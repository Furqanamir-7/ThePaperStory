export const WHATSAPP_PHONE = '923144392928'

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

/**
 * Generates direct link to a design so that the client and admin can view it immediately.
 * Prefers the canonical domain https://www.thepaperstory.store/product/{code}.
 */
export function getProductDirectUrl(product) {
  if (!product) return 'https://www.thepaperstory.store/shop'
  const code = product.code || product.sku
  if (code) {
    return `https://www.thepaperstory.store/product/${encodeURIComponent(code)}`
  }
  if (product.id) {
    return `https://www.thepaperstory.store/product/${encodeURIComponent(product.id)}`
  }
  const cat = product.categorySlug || 'wedding-invitations'
  const sub = product.subcategorySlug ? `/${product.subcategorySlug}` : ''
  return `https://www.thepaperstory.store/shop/${cat}${sub}`
}

export function buildProductWhatsAppMessage(product) {
  const code = product?.code || product?.sku
  const codeStr = code ? ` [Code: ${code}]` : ''
  const label = product?.whatsappLabel || product?.category || 'Wedding Invitation'
  const design = product?.name || 'Design'
  const directUrl = getProductDirectUrl(product)

  if (product?.whatsappMode === 'more') {
    return `Hey! Please tell me more about ${label}${codeStr}: ${design}\n\nView Design: ${directUrl}`
  }
  return `Hey! Please tell me the price and details for ${label}${codeStr}: ${design}\n\nView Design: ${directUrl}`
}
