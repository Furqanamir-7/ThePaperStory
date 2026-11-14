import webhookHandler from '../whatsapp/webhook.js'

export default async function handler(req, res) {
  return webhookHandler(req, res)
}

