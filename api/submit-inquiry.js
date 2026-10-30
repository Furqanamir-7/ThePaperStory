import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'
import { formatInquirySummary, generateInquiryNumber } from './order-utils.js'

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

  const inquiry = req.body || {}
  const required = ['name', 'email', 'phone', 'productName', 'consent']
  const missing = required.filter((field) => !inquiry[field])

  if (missing.length) {
    return res.status(400).json({ error: 'Please fill in all required fields.' })
  }

  if (!inquiry.consent) {
    return res.status(400).json({ error: 'Please agree to receive updates via WhatsApp and Email.' })
  }

  const inquiryNumber = inquiry.inquiryNumber || generateInquiryNumber()

  // 1. Record to Supabase
  try {
    await supabase.from('inquiries').insert([
      {
        inquiry_number: inquiryNumber,
        customer_name: inquiry.name,
        customer_email: inquiry.email,
        customer_phone: inquiry.phone,
        product_category: inquiry.productCategory || inquiry.category || '',
        product_name: inquiry.productName,
        event_date: inquiry.eventDate || '',
        quantity: inquiry.quantity ? String(inquiry.quantity) : '',
        details: inquiry.details || '',
        inquiry_status: 'new',
      },
    ])
  } catch (dbErr) {
    console.warn('[Supabase Inquiry Insert Warning]:', dbErr.message)
  }

  // 2. Email & WhatsApp notification if configured
  const transporter = buildTransporter()
  const summary = formatInquirySummary({
    inquiryNumber,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    productName: inquiry.productName,
    eventDate: inquiry.eventDate,
    quantity: inquiry.quantity,
    details: inquiry.details,
  })

  let emailSent = false
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `The Paper Story <${process.env.GMAIL_USER}>`,
        to: inquiry.email,
        bcc: process.env.OWNER_EMAIL || process.env.GMAIL_USER,
        subject: `Inquiry Received - ${inquiryNumber}`,
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
    inquiryNumber,
    emailSent,
    message: 'Inquiry received successfully.',
  })
}
