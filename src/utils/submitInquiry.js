import { saveInquiryToSupabase } from './supabase.js'

export async function submitInquiry(inquiry) {
  // 1. Save directly to Supabase
  try {
    await saveInquiryToSupabase(inquiry)
  } catch (err) {
    console.warn('Supabase direct inquiry sync error:', err)
  }

  // 2. Dispatch to serverless endpoint for notifications
  const response = await fetch('/api/submit-inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry),
  }).catch(() => null)

  if (!response) {
    return { success: true, inquiryNumber: inquiry.inquiryNumber, offline: true }
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    console.warn('Backend inquiry notification notice:', data.error)
    return { success: true, inquiryNumber: inquiry.inquiryNumber, notice: data.error }
  }

  return data
}
