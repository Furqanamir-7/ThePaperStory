export const WHATSAPP_PHONE = '923144392928'

export function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

export function buildProductWhatsAppMessage(product) {
  const label = product.whatsappLabel || product.name
  const design = product.name

  if (product.whatsappMode === 'more') {
    return `Hey please tell me more about ${label} ${design}`
  }
  return `Hey please tell me the price of ${label} ${design}`
}
