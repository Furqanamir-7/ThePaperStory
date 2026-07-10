import nodemailer from 'nodemailer'
import { formatOrderSummary, generateOrderNumber } from './order-utils.js'

const OWNER_WHATSAPP = '+923144392928'

function buildTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

async function notifyOwnerWhatsApp(summary) {
  const apiKey = process.env.CALLMEBOT_API_KEY?.trim()
  if (!apiKey) return { sent: false, reason: 'CALLMEBOT_API_KEY not configured' }

  const message = `New order - The Paper Story\n\n${summary}`.slice(0, 1500)
  const params = new URLSearchParams({
    source: 'thepaperstory',
    phone: OWNER_WHATSAPP,
    text: message,
    apikey: apiKey,
  })
  const url = `https://api.callmebot.com/whatsapp.php?${params}`

  const response = await fetch(url)
  const body = (await response.text()).trim()

  if (!response.ok) {
    throw new Error(body || `WhatsApp notification failed (${response.status})`)
  }

  if (/error|invalid|not activated/i.test(body)) {
    throw new Error(body)
  }

  return { sent: true }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const transporter = buildTransporter()
  if (!transporter) {
    return res.status(503).json({
      error: 'Order email is not configured yet. Please contact us on WhatsApp to place your order.',
    })
  }

  const order = req.body || {}
  const required = [
    'name',
    'email',
    'phone',
    'address',
    'city',
    'country',
    'productName',
    'price',
    'consent',
  ]
  const missing = required.filter((field) => !order[field])

  if (missing.length) {
    return res.status(400).json({ error: 'Please fill in all required fields.' })
  }

  if (!order.consent) {
    return res.status(400).json({ error: 'Please agree to receive order updates via WhatsApp and Email.' })
  }

  const orderNumber = generateOrderNumber()
  const itemLine = `${order.productName} (x${order.quantity || 1})`
  const deliveryEstimate = order.deliveryEstimate || '5–7 business days'

  const summary = formatOrderSummary({
    ...order,
    orderNumber,
    quantity: order.quantity || 1,
    paymentType: order.paymentType || 'advance',
    deliveryEstimate,
  })

  const from = `"The Paper Story" <${process.env.GMAIL_USER}>`

  try {
    await transporter.sendMail({
      from,
      to: order.email,
      replyTo: process.env.GMAIL_USER,
      subject: `Your The Paper Story Order #${orderNumber} is Confirmed`,
      text: `Hi ${order.name},\n\nYour order #${orderNumber} has been confirmed.\n\nItem(s): ${itemLine}\nTotal: ${order.price}\nExpected delivery: ${deliveryEstimate}\n\nDelivery address:\n${summary.split('Address:\n')[1] || ''}\n\nWe'll message you again once it ships. Thank you for shopping with The Paper Story.\n\nthepaperstoryc@gmail.com`,
      html: `<p>Hi ${order.name},</p><p>Your order <strong>#${orderNumber}</strong> has been confirmed.</p><pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;background:#FAF6F0;padding:1rem;border-radius:0.75rem;">${summary}</pre><p>We'll message you again once it ships. Thank you for shopping with <strong>The Paper Story</strong>.</p><p><a href="mailto:thepaperstoryc@gmail.com">thepaperstoryc@gmail.com</a></p>`,
    })

    await transporter.sendMail({
      from,
      to: process.env.GMAIL_USER,
      subject: `New website order #${orderNumber} — ${order.productName}`,
      text: `A new order was placed on the website.\n\n${summary}`,
      html: `<p><strong>New order #${orderNumber}</strong></p><pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;background:#FAF6F0;padding:1rem;border-radius:0.75rem;">${summary}</pre>`,
    })

    let whatsapp = { sent: false }
    try {
      whatsapp = await notifyOwnerWhatsApp(summary)
    } catch {
      whatsapp = { sent: false, reason: 'WhatsApp alert failed' }
    }

    return res.status(200).json({ ok: true, orderNumber, whatsapp })
  } catch (error) {
    console.error('place-order error:', error)
    return res.status(500).json({ error: 'Could not send order confirmation. Please try again or WhatsApp us.' })
  }
}
