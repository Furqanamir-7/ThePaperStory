import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL || 'https://cldmkkbrovisonhgugvl.supabase.co'
const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZG1ra2Jyb3Zpc29uaGd1Z3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODQwODUsImV4cCI6MjEwODk2MDA4NX0.Bk6Xk5MC-X6fmxbrDepYdfIbCDcZKtM_cL2ieeu-6bg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export async function saveOrderToSupabase(order) {
  try {
    const record = {
      order_number: order.orderNumber,
      customer_name: order.customer?.name || order.customerName,
      customer_email: order.customer?.email || order.customerEmail,
      customer_phone: order.customer?.phone || order.customerPhone,
      city: order.customer?.city || order.city || '',
      delivery_address: order.customer?.address || order.deliveryAddress || '',
      notes: order.customer?.notes || order.notes || '',
      items: order.items || [],
      subtotal: order.subtotal || order.itemsTotal || null,
      shipping_fee: order.shippingFee || 0,
      total_amount: order.totalAmount || order.total || 0,
      payment_method: order.paymentMethod || 'cod',
      payment_status: 'pending',
      order_status: 'new',
    }

    const { data, error } = await supabase.from('orders').insert([record]).select()
    if (error) {
      console.warn('[Supabase] Note on orders insert:', error.message)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    console.warn('[Supabase] orders exception:', err.message)
    return { success: false, error: err.message }
  }
}

export async function saveInquiryToSupabase(inquiry) {
  try {
    const record = {
      inquiry_number: inquiry.inquiryNumber,
      customer_name: inquiry.name,
      customer_email: inquiry.email,
      customer_phone: inquiry.phone,
      product_category: inquiry.productCategory || inquiry.category || '',
      product_name: inquiry.productName || inquiry.product || '',
      event_date: inquiry.eventDate || '',
      quantity: inquiry.quantity ? String(inquiry.quantity) : '',
      details: inquiry.details || inquiry.notes || '',
      inquiry_status: 'new',
    }

    const { data, error } = await supabase.from('inquiries').insert([record]).select()
    if (error) {
      console.warn('[Supabase] Note on inquiries insert:', error.message)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    console.warn('[Supabase] inquiries exception:', err.message)
    return { success: false, error: err.message }
  }
}

export async function subscribeNewsletterToSupabase(email) {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])
      .select()
    if (error) {
      console.warn('[Supabase] Note on newsletter insert:', error.message)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    console.warn('[Supabase] newsletter exception:', err.message)
    return { success: false, error: err.message }
  }
}

export async function checkSupabaseHealth() {
  try {
    const res = await supabase.from('orders').select('id').limit(1)
    return {
      connected: !res.error || res.error.code !== 'PGRST301',
      tablesExist: !res.error,
      details: res.error?.message || 'Healthy',
    }
  } catch (e) {
    return { connected: false, error: e.message }
  }
}
