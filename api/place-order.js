import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'
import { formatOrderSummary, generateOrderNumber } from './order-utils.js'

const OWNER_WHATSAPP = '+923144392928'

const supabaseUrl = process.env.SUPABASE_URL || 'https://cldmkkbrovisonhgugvl.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_gfFEzcrb_jC6RoFLKqZKJw_gVSkiPdQ'
const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

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

  const orderNumber = order.orderNumber || generateOrderNumber()
  const items = order.items?.length
    ? order.items
    : [{ productName: order.productName, quantity: order.quantity || 1, lineTotal: order.price }]
  const itemLine =
    items.length === 1
      ? `${items[0].productName} (x${items[0].quantity || 1})`
      : items.map((item) => `${item.productName} (x${item.quantity || 1})`).join(', ')
  const deliveryEstimate = order.deliveryEstimate || '5–7 business days'

  // 1. Record to Supabase
  try {
    await supabase.from('orders').insert([
      {
        order_number: orderNumber,
        customer_name: order.name,
        customer_email: order.email,
        customer_phone: order.phone,
        city: order.city,
        delivery_address: order.address,
        notes: order.notes || '',
        items: items,
        subtotal: order.subtotal || null,
        shipping_fee: order.shippingFee || 0,
        total_amount: order.price || 0,
        payment_method: order.paymentMethod || 'cod',
        payment_status: 'pending',
        order_status: 'new',
      },
    ])
  } catch (dbErr) {
    console.warn('[Supabase Order Insert Warning]:', dbErr.message)
  }

  // 2. Email & WhatsApp notification if configured
  const transporter = buildTransporter()
  const summary = formatOrderSummary({
    orderNumber,
    name: order.name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    country: order.country,
    itemLine,
    notes: order.notes,
    total: order.price,
    deliveryEstimate,
  })

  let emailSent = false
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `The Paper Story <${process.env.GMAIL_USER}>`,
        to: order.email,
        bcc: process.env.OWNER_EMAIL || process.env.GMAIL_USER,
        subject: `Order Confirmation - ${orderNumber}`,
        text: summary,
      })
      emailSent = true
    } catch (mailErr) {
      console.warn('Mail send warning:', mailErr.message)
    }
  }

  try {
    await notifyOwnerWhatsApp(summary)
  } catch (waErr) {
    console.warn('WhatsApp notify warning:', waErr.message)
  }

  return res.status(200).json({
    success: true,
    orderNumber,
    emailSent,
    message: 'Order received successfully.',
  })
}
