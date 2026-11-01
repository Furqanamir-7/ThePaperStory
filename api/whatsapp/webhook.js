import ws from 'ws'
import { createClient } from '@supabase/supabase-js'

// Default fallback verify token (can be overridden by process.env.WHATSAPP_VERIFY_TOKEN)
const DEFAULT_VERIFY_TOKEN = 'thepaperstory_whatsapp_webhook_2026'

// Supabase client for recording incoming leads & orders
const supabaseUrl = process.env.SUPABASE_URL || 'https://cldmkkbrovisonhgugvl.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_gfFEzcrb_jC6RoFLKqZKJw_gVSkiPdQ'
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: ws },
})

/**
 * Helper to send an outgoing WhatsApp message via Meta Cloud API if configured
 */
export async function sendWhatsAppMessage({ to, text }) {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    return { sent: false, reason: 'WHATSAPP_CLOUD_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID not configured' }
  }

  const cleanPhone = String(to).replace(/[^0-9]/g, '')
  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: { body: text },
    }),
  })

  const result = await response.json()
  return { sent: response.ok, result }
}

/**
 * Main Webhook Handler for WhatsApp Business API
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 1. GET: Webhook Verification Handshake from Meta
  if (req.method === 'GET') {
    const query = req.query || {}
    const mode = query['hub.mode']
    const token = query['hub.verify_token']
    const challenge = query['hub.challenge']

    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || DEFAULT_VERIFY_TOKEN

    // If query contains verification params from Meta
    if (mode && token) {
      if (mode === 'subscribe' && token === expectedToken) {
        console.log('[WhatsApp Webhook Verified]: Meta handshake successful with token:', token)
        res.setHeader('Content-Type', 'text/plain')
        return res.status(200).send(challenge)
      } else {
        console.warn('[WhatsApp Webhook Verification Failed]: Token mismatch')
        return res.status(403).json({ error: 'Verification token mismatch' })
      }
    }

    // Health check ping (e.g. from admin panel or browser)
    return res.status(200).json({
      status: 'active',
      service: 'The Paper Story - WhatsApp Cloud API Webhook',
      version: '2.0.0',
      webhookUrl: 'https://www.thepaperstory.store/api/whatsapp/webhook',
      verifyTokenConfigured: Boolean(process.env.WHATSAPP_VERIFY_TOKEN || DEFAULT_VERIFY_TOKEN),
      timestamp: new Date().toISOString(),
      capabilities: [
        'Meta Cloud API GET verification handshake',
        'Incoming customer messages & inquiry recording',
        'Automatic lead capture to database',
        'Auto-response dispatch (when configured)',
      ],
    })
  }

  // 2. POST: Event Notifications & Incoming Messages from Meta
  if (req.method === 'POST') {
    try {
      const body = req.body || {}

      if (body.object === 'whatsapp_business_account' || body.entry) {
        const entries = body.entry || []

        for (const entry of entries) {
          const changes = entry.changes || []

          for (const change of changes) {
            const value = change.value || {}

            // Handle Incoming Messages
            if (value.messages && value.messages.length > 0) {
              const contacts = value.contacts || []
              const contactMap = {}
              contacts.forEach((c) => {
                contactMap[c.wa_id] = c.profile?.name || 'Valued Client'
              })

              for (const message of value.messages) {
                const from = message.from // e.g. "923001234567"
                const senderName = contactMap[from] || 'Valued Client'
                const msgType = message.type
                let messageText = ''

                if (msgType === 'text') {
                  messageText = message.text?.body || ''
                } else if (msgType === 'button') {
                  messageText = message.button?.text || ''
                } else if (msgType === 'interactive') {
                  messageText =
                    message.interactive?.button_reply?.title ||
                    message.interactive?.list_reply?.title ||
                    ''
                } else if (message.caption) {
                  messageText = message.caption
                } else {
                  messageText = `[${msgType} message received]`
                }

                console.log(`[Incoming WhatsApp Message] from ${senderName} (${from}): ${messageText}`)

                // Detect Product Code or Intent
                let detectedProduct = 'General WhatsApp Inquiry'
                let detectedCategory = 'wedding-invitations'

                const codeMatch = messageText.match(/TPS-[A-Z]+-\d+/i)
                if (codeMatch) {
                  detectedProduct = `Product Inquiry: ${codeMatch[0].toUpperCase()}`
                  const prefix = codeMatch[0].split('-')[1]?.toUpperCase()
                  if (prefix === 'WI') detectedCategory = 'wedding-invitations'
                  else if (prefix === 'NC') detectedCategory = 'nikkahnama'
                  else if (prefix === 'DI') detectedCategory = 'digital-invitations'
                  else if (prefix === 'WS') detectedCategory = 'wax-seals'
                  else if (prefix === 'F') detectedCategory = 'favours'
                  else if (prefix === 'PK') detectedCategory = 'packaging'
                  else if (prefix === 'EE') detectedCategory = 'eidi-envelopes'
                  else if (prefix === 'S') detectedCategory = 'stationary-items'
                }

                const inquiryNum = `WA-${Date.now().toString().slice(-6)}`

                // Record into Supabase Inquiries table
                try {
                  await supabase.from('inquiries').insert([
                    {
                      inquiry_number: inquiryNum,
                      customer_name: senderName,
                      customer_phone: `+${from}`,
                      customer_email: '',
                      product_name: detectedProduct,
                      product_category: detectedCategory,
                      details: messageText,
                      inquiry_status: 'new',
                    },
                  ])
                  console.log(`[Supabase Saved] Recorded WhatsApp lead ${inquiryNum}`)
                } catch (dbErr) {
                  console.warn('[Supabase Insert Warning]:', dbErr.message)
                }

                // Optional Auto-Reply if WhatsApp Cloud API token is configured
                if (process.env.WHATSAPP_AUTO_REPLY === 'true') {
                  const replyText =
                    `Salam ${senderName}! ✨ Thank you for reaching out to The Paper Story.\n\n` +
                    `We have received your message regarding bespoke invitations & stationery. Our creative team will get back to you shortly.\n\n` +
                    `In the meantime, feel free to browse our full collection at:\nhttps://www.thepaperstory.store`

                  try {
                    await sendWhatsAppMessage({ to: from, text: replyText })
                  } catch (replyErr) {
                    console.warn('[Auto-reply Warning]:', replyErr.message)
                  }
                }
              }
            }

            // Handle Message Status updates (sent, delivered, read)
            if (value.statuses && value.statuses.length > 0) {
              for (const status of value.statuses) {
                console.log(`[WhatsApp Status Update] Message ${status.id}: ${status.status}`)
              }
            }
          }
        }

        // Return 200 OK to Meta immediately
        return res.status(200).json({ status: 'EVENT_RECEIVED' })
      }

      // Handle generic custom webhook payloads (e.g. Zapier, Wati, Make)
      if (body.phone || body.from || body.message) {
        const phone = body.phone || body.from
        const name = body.name || 'Valued Client'
        const msg = body.message || body.text || JSON.stringify(body)

        try {
          await supabase.from('inquiries').insert([
            {
              inquiry_number: `WA-${Date.now().toString().slice(-6)}`,
              customer_name: name,
              customer_phone: String(phone),
              details: msg,
              inquiry_status: 'new',
            },
          ])
        } catch (dbErr) {
          console.warn('[Supabase Insert Warning]:', dbErr.message)
        }

        return res.status(200).json({ success: true, message: 'Custom WhatsApp payload recorded' })
      }

      return res.status(200).json({ status: 'NOOP', message: 'Payload received' })
    } catch (err) {
      console.error('[WhatsApp Webhook Error]:', err)
      // Return 200 to prevent Meta from retrying broken payloads endlessly
      return res.status(200).json({ status: 'ERROR_RECORDED', error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
