import nodemailer from 'nodemailer'
import { formatInquirySummary, generateInquiryNumber } from './order-utils.js'

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

  const message = `New inquiry - The Paper Story\n\n${summary}`.slice(0, 1500)
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
      error: 'Inquiry form is not configured yet. Please contact us on WhatsApp.',
    })
  }

  const inquiry = req.body || {}
  const required = ['name', 'email', 'phone', 'address', 'city', 'country', 'productName', 'consent']
  const missing = required.filter((field) => !inquiry[field])

  if (missing.length) {
    return res.status(400).json({ error: 'Please fill in all required fields.' })
  }

  if (!inquiry.consent) {
    return res.status(400).json({ error: 'Please agree to receive updates via WhatsApp and Email.' })
  }

  const inquiryNumber = generateInquiryNumber()
  const summary = formatInquirySummary({ ...inquiry, inquiryNumber })
  const from = `"The Paper Story" <${process.env.GMAIL_USER}>`

  try {
    await transporter.sendMail({
      from,
      to: inquiry.email,
      replyTo: process.env.GMAIL_USER,
      subject: `Your inquiry #${inquiryNumber} — The Paper Story`,
      text: `Hi ${inquiry.name},\n\nThanks for reaching out about ${inquiry.productName}!\n\nYour inquiry reference is ${inquiryNumber}. Our team will get back to you shortly with pricing and details.\n\nThe Paper Story\nthepaperstoryc@gmail.com`,
      html: `<p>Hi ${inquiry.name},</p><p>Thanks for reaching out about <strong>${inquiry.productName}</strong>!</p><p>Your inquiry reference is <strong>${inquiryNumber}</strong>. Our team will get back to you shortly with pricing and details.</p><pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;background:#FAF6F0;padding:1rem;border-radius:0.75rem;">${summary}</pre><p><strong>The Paper Story</strong><br><a href="mailto:thepaperstoryc@gmail.com">thepaperstoryc@gmail.com</a></p>`,
    })

    await transporter.sendMail({
      from,
      to: process.env.GMAIL_USER,
      subject: `New inquiry #${inquiryNumber} — ${inquiry.productName}`,
      text: `A new custom order inquiry was submitted.\n\n${summary}`,
      html: `<p><strong>New inquiry #${inquiryNumber}</strong></p><pre style="font-family:system-ui,sans-serif;white-space:pre-wrap;background:#FAF6F0;padding:1rem;border-radius:0.75rem;">${summary}</pre>`,
    })

    let whatsapp = { sent: false }
    try {
      whatsapp = await notifyOwnerWhatsApp(summary)
    } catch {
      whatsapp = { sent: false, reason: 'WhatsApp alert failed' }
    }

    return res.status(200).json({ ok: true, inquiryNumber, whatsapp })
  } catch (error) {
    console.error('submit-inquiry error:', error)
    return res.status(500).json({ error: 'Could not submit inquiry. Please try again or WhatsApp us.' })
  }
}
