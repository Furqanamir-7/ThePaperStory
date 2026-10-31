export const WHATSAPP_PHONE = '923144392928'

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

export function buildProductWhatsAppMessage(product) {
  const codeStr = product?.code ? ` [Code: ${product.code}]` : ''
  const label = product?.whatsappLabel || product?.name || 'Wedding Invitation'
  const design = product?.name || 'Design'

  if (product?.whatsappMode === 'more') {
    return `Hey! Please tell me more about ${label}${codeStr}: ${design}`
  }
  return `Hey! Please tell me the price and details for ${label}${codeStr}: ${design}`
}
