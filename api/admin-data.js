import { put, list } from '@vercel/blob'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const BLOB_NAME = 'tps-admin-store-data.json'

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: BLOB_NAME })
      if (!blobs || blobs.length === 0) {
        return res.status(200).json({ success: true, exists: false, data: null })
      }

      const matched = blobs.find((b) => b.pathname === BLOB_NAME) || blobs[0]
      const resp = await fetch(matched.url, { cache: 'no-store' })
      if (!resp.ok) {
        return res.status(200).json({ success: true, exists: false, data: null })
      }

      const json = await resp.json()
      return res.status(200).json({
        success: true,
        exists: true,
        data: json.data,
        updatedAt: json.updatedAt,
        updatedBy: json.updatedBy,
      })
    } catch (err) {
      console.warn('[api/admin-data GET error]', err.message)
      return res.status(200).json({ success: false, error: err.message, exists: false, data: null })
    }
  }

  if (req.method === 'POST') {
    try {
      const { data, updatedBy = 'admin' } = req.body || {}
      if (!data) {
        return res.status(400).json({ success: false, error: 'Missing data in payload' })
      }

      const payload = {
        updatedAt: new Date().toISOString(),
        updatedBy,
        data,
      }

      const blob = await put(BLOB_NAME, JSON.stringify(payload), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      })

      return res.status(200).json({
        success: true,
        url: blob.url,
        updatedAt: payload.updatedAt,
      })
    } catch (err) {
      console.warn('[api/admin-data POST offline fallback]', err.message)
      return res.status(200).json({ success: false, offline: true, error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

