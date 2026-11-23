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

export async function appendOrderToCatalog(order) {
  try {
    const adminOrder = {
      id: `ord-${Date.now()}`,
      number: order.orderNumber || `TPS-${Date.now().toString().slice(-6)}`,
      customerName: order.name || order.customer?.name || order.customerName || 'Valued Client',
      email: order.email || order.customer?.email || order.customerEmail || '',
      phone: order.phone || order.customer?.phone || order.customerPhone || '',
      shippingAddress: `${order.address || order.customer?.address || ''}${order.addressLine2 ? ', ' + order.addressLine2 : ''}, ${order.city || order.customer?.city || ''}, ${order.country || 'Pakistan'}`.replace(/^, /, ''),
      city: order.city || order.customer?.city || '',
      items: order.items || [
        {
          productName: order.productName || 'Bespoke Stationery Order',
          quantity: order.quantity || 1,
          unitPrice: order.price || 'On Request',
          lineTotal: order.price || 'On Request',
        },
      ],
      total: order.price || order.total || order.totalAmount || 'On Request',
      paymentMethod: order.paymentType === 'cod' || order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer',
      paymentStatus: 'Advance Due (50%)',
      status: 'Pending',
      notes: order.notes || order.customer?.notes || '',
      createdAt: new Date().toISOString(),
    }

    const { data: current, error: fetchErr } = await supabase
      .from('store_catalog')
      .select('data')
      .eq('id', 'live_store_catalog')
      .maybeSingle()

    if (!fetchErr && current && current.data) {
      const currentData = current.data
      const orders = Array.isArray(currentData.orders) ? currentData.orders : []
      if (!orders.some((o) => o.number === adminOrder.number)) {
        currentData.orders = [adminOrder, ...orders]
        await supabase
          .from('store_catalog')
          .upsert([{ id: 'live_store_catalog', data: currentData, updated_at: new Date().toISOString(), updated_by: 'system_order' }])
      }
    }
    return { success: true, order: adminOrder }
  } catch (err) {
    console.warn('[Supabase] catalog order fallback notice:', err)
    return { success: false }
  }
}

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
      // Safely append to store_catalog so order is preserved across all admin devices
      await appendOrderToCatalog(order)
      return { success: true, fallback: true }
    }
    return { success: true, data }
  } catch (err) {
    console.warn('[Supabase] orders exception:', err.message)
    try {
      await appendOrderToCatalog(order)
    } catch (e) {}
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
    const res = await supabase.from('store_catalog').select('id').limit(1)
    if (res.error && res.error.code !== 'PGRST116') {
      const ordersRes = await supabase.from('orders').select('id').limit(1)
      return {
        connected: !ordersRes.error,
        tablesExist: !ordersRes.error,
        details: ordersRes.error?.message || 'Healthy',
      }
    }
    return {
      connected: true,
      tablesExist: true,
      details: 'Healthy',
    }
  } catch (e) {
    return { connected: false, error: e.message }
  }
}

/** Sync live store catalog (products, categories, settings) to Supabase */
export async function syncCatalogToSupabase(catalogData) {
  try {
    const payload = {
      id: 'live_store_catalog',
      data: catalogData,
      updated_at: new Date().toISOString(),
      updated_by: 'admin',
    }
    const { data, error } = await supabase
      .from('store_catalog')
      .upsert([payload], { onConflict: 'id' })
      .select()
    if (error) {
      console.warn('[Supabase] catalog upsert note:', error.message)
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/** Pull live store catalog from Supabase */
export async function fetchCatalogFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('store_catalog')
      .select('data, updated_at')
      .eq('id', 'live_store_catalog')
      .maybeSingle()
    if (error) {
      return { success: false, error: error.message }
    }
    if (data && data.data) {
      return { success: true, data: data.data, updatedAt: data.updated_at }
    }
    return { success: true, data: null }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

/**
 * Lightweight heartbeat keepalive ping to Supabase.
 * Touching the database on site & admin visits keeps free-tier projects active
 * and prevents 7-day inactivity pausing.
 */
export async function pingSupabaseKeepAlive() {
  try {
    const { data, error } = await supabase
      .from('store_catalog')
      .select('id, updated_at')
      .eq('id', 'live_store_catalog')
      .maybeSingle()
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, updatedAt: data?.updated_at }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
