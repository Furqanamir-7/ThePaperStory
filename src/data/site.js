export const SITE_URL = 'https://www.thepaperstory.store'
export const SITE_TAGLINE = 'More than paper. Designed to be remembered.'

export const STORE_EMAIL = 'thepaperstoryc@gmail.com'
export const STORE_PHONE = '+92 314 4392928'
export const STORE_WHATSAPP = '923144392928'

export function canPlaceOrder(product) {
  return Boolean(product?.showPrice && product?.price)
}
