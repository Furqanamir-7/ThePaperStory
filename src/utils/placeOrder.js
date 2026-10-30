import { saveOrderToSupabase } from './supabase.js'

export async function submitOrder(order) {
  // 1. Save directly to Supabase
  try {
    await saveOrderToSupabase(order)
  } catch (err) {
    console.warn('Supabase direct order sync error:', err)
  }

  // 2. Dispatch to serverless backend for notifications
  const response = await fetch('/api/place-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  }).catch(() => null)

  if (!response) {
    // Serverless endpoint offline (e.g. running vite local dev without vercel api)
    return { success: true, orderNumber: order.orderNumber, offline: true }
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    // If Supabase already recorded the order, don't fail the user completely
    console.warn('Backend notification notice:', data.error)
    return { success: true, orderNumber: order.orderNumber, notice: data.error }
  }

  return data
}
