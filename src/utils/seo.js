import { SITE_URL } from '../data/site'

export const FACEBOOK_URL = 'https://www.facebook.com/Thepaperstory.co/'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL
  if (path.startsWith('http')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function absoluteImageUrl(image) {
  if (!image) return DEFAULT_OG_IMAGE
  if (image.startsWith('http')) return image
  return absoluteUrl(image)
}

export function parsePriceNumber(price) {
  if (!price) return null
  const match = String(price).replace(/,/g, '').match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : null
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'The Paper Story',
    url: absoluteUrl('/'),
    logo: DEFAULT_OG_IMAGE,
    description:
      'Premium stationery, wedding invitations, e-invites, and bespoke gifting. Worldwide delivery.',
    sameAs: ['https://www.instagram.com/thepaperstory.co/', FACEBOOK_URL],
    areaServed: 'Worldwide',
  }
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function buildProductSchema(product, pagePath) {
  const image = product.images?.[0] || product.image
  const price = parsePriceNumber(product.price)
  const offer = {
    '@type': 'Offer',
    url: absoluteUrl(pagePath),
    priceCurrency: 'PKR',
    availability: 'https://schema.org/InStock',
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'PK',
      },
    },
  }

  if (price != null) {
    offer.price = price
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.name} — ${product.category}`,
    image: absoluteImageUrl(image),
    description: `${product.name} from ${product.category} by The Paper Story. Enquire for custom orders and worldwide delivery.`,
    brand: {
      '@type': 'Brand',
      name: 'The Paper Story',
    },
    offers: offer,
  }
}

export function buildItemListSchema(products, pagePath, listName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: absoluteUrl(pagePath),
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: buildProductSchema(product, pagePath),
    })),
  }
}

export const PAGE_SEO = {
  home: {
    title: 'The Paper Story | Premium Stationery & Gifting',
    description:
      'The Paper Story — More than paper. Designed to be remembered. Premium stationery, wedding invitations, e-invites, and bespoke gifting. Worldwide delivery.',
  },
  about: {
    title: 'Our Story | The Paper Story',
    description:
      'Meet Fatima and Huzaifa, the husband-and-wife team behind The Paper Story. Bespoke stationery designed, printed, and packed with care.',
  },
  contact: {
    title: 'Contact Us | The Paper Story',
    description:
      'Get in touch with The Paper Story for orders, custom quotes, and questions. WhatsApp, email, and Instagram support with worldwide delivery.',
  },
  shop: {
    title: 'Shop | The Paper Story',
    description:
      'Browse wedding invitations, digital e-invites, nikkah certificates, favours, stationery, and bespoke gifting from The Paper Story.',
  },
}

export function categorySeo(cat, sub = null, occasion = null) {
  const title = occasion
    ? `${sub.label} — ${occasion.label} | The Paper Story`
    : sub
      ? `${sub.label} | The Paper Story`
      : `${cat.label} | The Paper Story`

  const description =
    sub?.tagline ||
    cat.description ||
    `Explore ${cat.label} from The Paper Story. Custom stationery with worldwide delivery.`

  return { title, description }
}

export function shopPath(categorySlug, subcategorySlug = null, typeSlug = null) {
  let path = `/shop/${categorySlug}`
  if (subcategorySlug) path += `/${subcategorySlug}`
  if (typeSlug) path += `/${typeSlug}`
  return path
}
