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

  // 3. Sync to local admin store so admin sees automatic orders immediately
  try {
    const raw = localStorage.getItem('tps_admin_data_v1')
    if (raw) {
      const parsed = JSON.parse(raw)
      const adminOrder = {
        id: `ord-${Date.now()}`,
        number: order.orderNumber || `TPS-${Date.now().toString().slice(-6)}`,
        customerName: order.name,
        email: order.email,
        phone: order.phone,
        shippingAddress: `${order.address || ''}${order.addressLine2 ? ', ' + order.addressLine2 : ''}, ${order.city || ''}, ${order.country || 'Pakistan'}`.replace(/^, /, ''),
        city: order.city,
        items: order.items || [
          {
            productName: order.productName || 'Bespoke Stationery Order',
            quantity: order.quantity || 1,
            unitPrice: order.price || 'On Request',
            lineTotal: order.price || 'On Request',
          },
        ],
        total: order.price || order.total || 'On Request',
        paymentMethod: order.paymentType === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
        paymentStatus: 'Advance Due (50%)',
        status: 'Pending',
        notes: order.notes || '',
        createdAt: new Date().toISOString(),
      }
      parsed.orders = [adminOrder, ...(parsed.orders || [])]
      localStorage.setItem('tps_admin_data_v1', JSON.stringify(parsed))
    }
  } catch (err) {
    console.warn('Local admin store sync notice:', err)
  }

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
