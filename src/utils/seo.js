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

export const COUNTRY_SEO = {
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    transitTime: '4–7 business days via DHL Express',
    title: 'Custom Wedding Invitations & Nikkahnama USA | The Paper Story',
    description:
      'Bespoke Pakistani & South Asian wedding invitations, digital invites, and luxury Nikkah certificates delivered across the USA. Express tracked shipping to New York, California, Texas & nationwide.',
    heading: 'Custom Luxury Wedding Invitations Delivered Across the United States',
    subheading:
      'Handcrafted wedding stationery, bespoke Urdu/English Nikkahnama & digital video invites. Door-to-door tracked delivery to New York, California, Texas, Illinois & nationwide.',
    keywords:
      'Pakistani wedding invitations USA, South Asian wedding invites US, custom Nikkahnama USA, luxury Islamic wedding cards New York California Texas, bespoke wedding stationery America',
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    transitTime: '4–6 business days via DHL Express',
    title: 'Luxury Bespoke Wedding Invitations & Nikkah Certificates UK | The Paper Story',
    description:
      'Handcrafted custom wedding invitations, Urdu calligraphy Nikkahnama & luxury wedding stationery for UK couples. Express tracked delivery to London, Birmingham, Manchester & across the UK.',
    heading: 'Luxury Bespoke Wedding Stationery for UK Couples',
    subheading:
      'Premium foil-stamped wedding cards, velvet invitations & keepsake Nikkahnama suites. Tracked express shipping to London, Birmingham, Manchester, Bradford, Leeds & nationwide.',
    keywords:
      'Pakistani wedding invitations UK, bespoke wedding cards London, Nikkah certificate UK, Asian wedding stationery Birmingham Manchester, Muslim wedding invites UK',
  },
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED ',
    transitTime: '3–5 business days express delivery',
    title: 'Luxury Wedding Invitations & Keepsakes UAE | The Paper Story — Dubai & Abu Dhabi',
    description:
      'Bespoke Arabic & Urdu calligraphy wedding invitations, digital video invites, and luxury event packaging. Fast door-to-door delivery across Dubai, Abu Dhabi, Sharjah & all Emirates.',
    heading: 'Luxury Wedding Invitations & Keepsakes in the UAE',
    subheading:
      'Bespoke wedding cards, gold foil finishes & handcrafted ceremonial keepsakes. Fast tracked delivery across Dubai, Abu Dhabi, Sharjah and across the GCC.',
    keywords:
      'wedding invitations Dubai, luxury wedding cards UAE, custom invitations Abu Dhabi, Nikkah certificate UAE Dubai, Arabic wedding stationery GCC',
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'CA$',
    transitTime: '5–8 business days via DHL Express',
    title: 'Custom South Asian Wedding Invitations Canada | The Paper Story — Toronto & Vancouver',
    description:
      'Bespoke Pakistani & South Asian wedding invites, Nikkahnama certificates, and digital invites with express tracked shipping to Ontario, British Columbia, Alberta & across Canada.',
    heading: 'Custom South Asian Wedding Invitations in Canada',
    subheading:
      'Heirloom quality wedding stationery, custom Nikkahnama & festive packaging delivered door-to-door across Toronto, Vancouver, Calgary, Montreal & nationwide.',
    keywords:
      'Pakistani wedding invitations Canada, South Asian wedding cards Toronto, Nikkahnama certificate Vancouver Canada, Muslim wedding invitations Ontario Calgary',
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencySymbol: 'A$',
    transitTime: '5–8 business days tracked delivery',
    title: 'Bespoke Luxury Wedding Invitations Australia | The Paper Story — Sydney & Melbourne',
    description:
      'Handcrafted custom wedding invitations, Nikkah certificates, and bespoke event stationery for Australian couples. Express tracked delivery to Sydney, Melbourne, Brisbane & Perth.',
    heading: 'Bespoke Luxury Wedding Invitations in Australia',
    subheading:
      'Distinctive custom wedding invitations, gold foil accents & keepsake Nikkahnama certificates. Reliable tracked shipping across Sydney, Melbourne, Brisbane & Perth.',
    keywords:
      'wedding invitations Australia, Pakistani wedding cards Sydney Melbourne, custom Nikkahnama Australia, South Asian wedding stationery Brisbane Perth',
  },
  EU: {
    code: 'EU',
    name: 'Europe',
    flag: '🇪🇺',
    currency: 'EUR',
    currencySymbol: '€',
    transitTime: '4–7 business days tracked delivery',
    title: 'Custom Wedding Invitations & Stationery Europe | The Paper Story',
    description:
      'Bespoke wedding stationery, digital cards, and luxury Nikkah certificates delivered across Europe. Tracked delivery to Germany, France, Netherlands, Italy, Spain & EU.',
    heading: 'Custom Wedding Invitations Delivered Across Europe',
    subheading:
      'Handcrafted luxury wedding stationery and keepsake certificates delivered door-to-door across Germany, France, Netherlands, Italy, Spain & the EU.',
    keywords:
      'wedding invitations Europe, custom wedding cards Germany France Netherlands, Nikkah certificate Europe, Islamic wedding invitations EU',
  },
  PK: {
    code: 'PK',
    name: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    currencySymbol: 'Rs. ',
    transitTime: '2–4 business days via TCS / Leopards',
    title: 'The Paper Story | Custom Wedding Invitations & Bespoke Stationery Pakistan',
    description:
      'Pakistan’s premier design & print studio. Custom wedding invitations, Nikkah certificates, favours, packaging, and digital invites. Delivery across Lahore, Karachi, Islamabad & nationwide.',
    heading: 'Custom Wedding Invitations & Bespoke Stationery in Pakistan',
    subheading:
      'Premium cardstocks, custom foil stamping, wax seals & hand-lettered calligraphy. Express delivery across Lahore, Karachi, Islamabad, Rawalpindi & nationwide.',
    keywords:
      'wedding cards Pakistan, custom invitations Lahore Karachi Islamabad, Nikkahnama certificate Pakistan, bespoke printing Lahore',
  },
}

export function getCountrySeo(codeOrCountry) {
  if (!codeOrCountry) return null
  const clean = String(codeOrCountry).toUpperCase().trim()
  if (COUNTRY_SEO[clean]) return COUNTRY_SEO[clean]

  const aliasMap = {
    USA: 'US',
    UK: 'GB',
    EN_US: 'US',
    'EN-US': 'US',
    EN_GB: 'GB',
    'EN-GB': 'GB',
    UAE: 'AE',
    'EN-AE': 'AE',
    CAN: 'CA',
    'EN-CA': 'CA',
    AUS: 'AU',
    'EN-AU': 'AU',
    EUROPE: 'EU',
    'EN-EU': 'EU',
    PAK: 'PK',
    'EN-PK': 'PK',
  }

  const mapped = aliasMap[clean]
  return mapped ? COUNTRY_SEO[mapped] : null
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.thepaperstory.store/#org',
        name: 'The Paper Story',
        url: 'https://www.thepaperstory.store/',
        logo: 'https://www.thepaperstory.store/logo.png',
        image: 'https://www.thepaperstory.store/og-image.png',
        description:
          'Custom luxury wedding invitations, handcrafted Nikkahnama certificates, digital invites, and bespoke packaging delivered worldwide to US, UK, UAE, Canada, Australia & beyond.',
        sameAs: ['https://www.instagram.com/thepaperstory.co/', FACEBOOK_URL],
        areaServed: [
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Country', name: 'United Arab Emirates' },
          { '@type': 'Country', name: 'Canada' },
          { '@type': 'Country', name: 'Australia' },
          { '@type': 'Country', name: 'Pakistan' },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '180',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.thepaperstory.store/#website',
        url: 'https://www.thepaperstory.store/',
        name: 'The Paper Story',
        publisher: { '@id': 'https://www.thepaperstory.store/#org' },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.thepaperstory.store/shop?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }
}

export function buildFaqSchema(countryCode = null) {
  const info = getCountrySeo(countryCode)
  const countryName = info ? info.name : 'internationally'
  const transit = info ? info.transitTime : '4–7 business days via DHL Express'

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Does The Paper Story deliver custom wedding invitations to ${
          countryName === 'internationally' ? 'the USA, UK, Canada, Australia and worldwide' : countryName
        }?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes! We provide door-to-door tracked worldwide delivery via DHL Express and express international couriers to ${
            countryName === 'internationally'
              ? 'over 20+ countries including the USA, UK, UAE, Canada, Australia, and Europe'
              : countryName
          }. Typical shipping transit time is ${transit}.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How long does production take, and does it include shipping time?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our standard production time is 20–30 working days to meticulously print, foil-stamp, assemble, and quality-check each suite. Please note that production time is separate and does not include courier transit time. If you need your invitations earlier, contact us prior to ordering as we accommodate urgent orders based on our studio schedule.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can we customize the language, calligraphy (Urdu, Arabic, English), and design colors?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every design in our studio is 100% bespoke. You can customize wording in English, Urdu, Arabic, or bilingual combinations, select your preferred foil finishes (gold, rose gold, silver, bronze), envelope lining patterns, wax seal monograms, and silk ribbon shades.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the minimum order quantity for wedding invitations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our standard minimum order quantity is 25 pieces per design. For custom quantities or intimate events, you can reach out directly to our design team on WhatsApp for a tailored quote.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do international customers place an order and pay?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Browse our collections, click "Enquire on WhatsApp", and collaborate one-on-one with Fatima and Huzaifa. We provide digital proofs for your review and approval before anything is printed. International payments are accepted via secure bank transfer, credit/debit card, and international wire transfer.',
        },
      },
    ],
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
        addressCountry: ['PK', 'US', 'GB', 'AE', 'CA', 'AU', 'EU'],
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 4,
          maxValue: 14,
          unitCode: 'DAY',
        },
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 14,
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
    description:
      product.description ||
      `${product.name} from ${product.category} by The Paper Story. Handcrafted bespoke design with worldwide tracked delivery to USA, UK, UAE, Canada, Australia and Pakistan.`,
    sku: product.code || product.sku || String(product.id),
    brand: {
      '@type': 'Brand',
      name: 'The Paper Story',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '48',
      bestRating: '5',
      worstRating: '1',
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
    title: 'The Paper Story | Custom Wedding Invitations & Stationery',
    description:
      'Custom wedding invitations, digital invites, Nikkah certificates, personalised stationery and bespoke packaging. Designed in-house. We ship worldwide to USA, UK, UAE, Canada & Australia.',
  },
  about: {
    title: 'Our Story | The Paper Story — Independent Design & Print Studio',
    description:
      'Founded by Fatima and Huzaifa. Handcrafted custom wedding stationery, digital invites, and bespoke packaging delivered worldwide.',
  },
  contact: {
    title: 'Contact & Custom Orders | The Paper Story',
    description:
      'Get in touch for custom wedding invitations, digital invites, quotes and questions. Direct WhatsApp support with worldwide shipping.',
  },
  shipping: {
    title: 'Worldwide Shipping & Delivery Guide | The Paper Story',
    description:
      'Express worldwide delivery to the UK, USA, UAE, Canada, Australia & worldwide. Turnaround times, custom orders, and tracking.',
  },
  shop: {
    title: 'Shop Custom Wedding Invitations & Stationery | The Paper Story',
    description:
      'Browse wedding invitations, digital e-invites, Nikkah certificates, favours, bespoke packaging, and premium add-ons. Worldwide delivery.',
  },
}

export function categorySeo(cat, sub = null, occasion = null) {
  const catTitleMap = {
    'wedding-invitations': 'Custom Wedding Invitations | The Paper Story',
    'digital-invitations': 'Digital & Animated Wedding Invitations | The Paper Story',
    'nikkahnama': 'Nikkah Certificates | The Paper Story',
    'favours': 'Custom Wedding Favours & Keepsakes | The Paper Story',
    'packaging': 'Custom Packaging & Printed Boxes | The Paper Story',
    'stationary-items': 'Personalised Greeting Cards & Stationery | The Paper Story',
    'accessories-add-ons': 'Premium Add-ons & Wax Seals | The Paper Story',
    'gifting-envelopes-tags': 'Luxury Gifting Envelopes & Tags | The Paper Story',
  }

  const title = occasion
    ? `${sub.label} — ${occasion.label} | The Paper Story`
    : sub
      ? `${sub.label} | The Paper Story`
      : catTitleMap[cat.slug] || `${cat.label} | The Paper Story`

  const description =
    sub?.tagline ||
    cat.description ||
    `Explore ${cat.label} from The Paper Story. Custom stationery designed and printed in our studio. We ship worldwide.`

  return { title, description }
}

export function shopPath(categorySlug, subcategorySlug = null, typeSlug = null) {
  let path = `/shop/${categorySlug}`
  if (subcategorySlug) path += `/${subcategorySlug}`
  if (typeSlug) path += `/${typeSlug}`
  return path
}
