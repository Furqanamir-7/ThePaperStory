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
        '@type': ['Organization', 'LocalBusiness', 'Store'],
        '@id': 'https://www.thepaperstory.store/#org',
        name: 'The Paper Story',
        legalName: 'The Paper Story Design Studio',
        url: 'https://www.thepaperstory.store/',
        logo: 'https://www.thepaperstory.store/logo.png',
        image: 'https://www.thepaperstory.store/og-image.png',
        description:
          'Premier bespoke design & print studio specializing in custom luxury wedding invitations, Urdu & English Nikkahnama certificates, wax seals, digital video invites, and luxury event packaging with tracked worldwide shipping to USA, UK, UAE, Canada, Australia and Pakistan.',
        telephone: '+923144392928',
        email: 'info@thepaperstory.store',
        priceRange: '$$',
        currenciesAccepted: 'PKR, USD, GBP, AED, CAD, AUD, EUR',
        paymentAccepted: 'Cash on Delivery, Bank Transfer, Credit Card, Debit Card',
        openingHours: 'Mo,Tu,We,Th,Fr,Sa 10:00-20:00',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lahore',
          addressRegion: 'Punjab',
          addressCountry: 'PK',
        },
        founder: [
          { '@type': 'Person', name: 'Fatima' },
          { '@type': 'Person', name: 'Huzaifa' },
        ],
        sameAs: ['https://www.instagram.com/thepaperstory.co/', FACEBOOK_URL],
        areaServed: [
          { '@type': 'Country', name: 'Pakistan' },
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'United Kingdom' },
          { '@type': 'Country', name: 'United Arab Emirates' },
          { '@type': 'Country', name: 'Canada' },
          { '@type': 'Country', name: 'Australia' },
          { '@type': 'Country', name: 'Saudi Arabia' },
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
    priceValidUntil: '2027-12-31',
    itemCondition: 'https://schema.org/NewCondition',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'The Paper Story',
      url: 'https://www.thepaperstory.store/',
    },
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
          minValue: 2,
          maxValue: 7,
          unitCode: 'DAY',
        },
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 14,
      applicableCountry: ['PK', 'US', 'GB', 'AE', 'CA', 'AU'],
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
    category: product.category || 'Wedding Stationery',
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
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Ayesha & Bilal',
        },
        datePublished: '2026-09-14',
        reviewBody:
          'Absolutely magnificent wedding stationery! The gold foil quality, velvet texture, and custom Urdu calligraphy exceeded all our expectations. Our guests were mesmerized.',
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Zainab K. (Dubai, UAE)',
        },
        datePublished: '2026-10-02',
        reviewBody:
          'Ordered from Dubai and received our parcel in pristine condition via express DHL. Fatima and Huzaifa were exceptionally responsive and accommodating on WhatsApp.',
      },
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Hamza & Sarah (London, UK)',
        },
        datePublished: '2026-10-28',
        reviewBody:
          'The bespoke Nikkahnama and matching wedding cards were the highlight of our event. Superb craftsmanship and fast international dispatch.',
      },
    ],
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

export const CATEGORY_FAQS = {
  'wedding-invitations': [
    {
      q: 'What is the minimum order quantity for custom wedding invitations?',
      a: 'Our standard minimum order quantity is 25 pieces per design. For intimate weddings or custom quantities, feel free to reach out directly to our design team on WhatsApp for a tailored quote.',
    },
    {
      q: 'How long does production take, and when should we order?',
      a: 'Our standard production time is 20–30 working days to meticulously print, foil-stamp, assemble, and quality-check each suite. We recommend ordering 6 to 8 weeks before your planned distribution date. Urgent rush orders can also be accommodated based on studio availability.',
    },
    {
      q: 'Can we customize the language, wording, and calligraphy style?',
      a: 'Every design in our studio is 100% bespoke. You can customize wording in English, Urdu Nastaliq, Arabic, or bilingual layouts, select custom foil colors (gold, rose gold, silver, bronze), wax seal monograms, and envelope finishes.',
    },
    {
      q: 'Do you deliver wedding cards internationally (USA, UK, UAE, Canada, Australia)?',
      a: 'Yes! We ship worldwide via express DHL Express and international tracked couriers. Transit time is typically 3–5 days to Dubai/UAE, 4–6 days to the UK, and 4–7 days to the USA, Canada, and Australia.',
    },
    {
      q: 'What paper stocks and premium finishes do you use?',
      a: 'We craft our suites using imported premium 350–600 GSM heavy cardstocks, tactile cotton and linen textures, velvet folios, handmade deckled-edge paper, translucent vellum overlays, and metallic hot-foil stamping.',
    },
  ],
  'digital-invitations': [
    {
      q: 'In what formats are digital invitations delivered?',
      a: 'We provide full HD animated video invitations (MP4) with your choice of background instrumental music, along with high-resolution digital image files (PNG/PDF) optimized for crystal-clear WhatsApp, Instagram, and email sharing.',
    },
    {
      q: 'Can you include multiple wedding functions (Mehndi, Barat, Walima)?',
      a: 'Yes, multi-event digital suites are available. We can create separate cards for each function or a multi-page animated video invite covering all your ceremonies.',
    },
    {
      q: 'What is the turnaround time for digital invitations?',
      a: 'Standard digital invitation design takes 3–5 working days. Once completed, a preview draft is sent to you on WhatsApp for approval before final high-resolution delivery.',
    },
    {
      q: 'Can we change the text, music, and font in digital invites?',
      a: 'Yes! You can choose your preferred audio soundtrack, personalized couple names, event dates, venues, Google Maps location QR codes, and dress codes.',
    },
  ],
  'nikkahnama': [
    {
      q: 'What makes The Paper Story Nikkah certificates special?',
      a: 'Our Nikkah certificates are heirloom-quality keepsakes featuring traditional Islamic geometric illumination, hand-gilded gold foiling, and classical Urdu/Arabic calligraphy on archival cardstock, designed to be framed and cherished for generations.',
    },
    {
      q: 'Can our personal vows, names, and wedding date be printed or hand-written?',
      a: 'Yes, both digital calligraphy and hand-lettered customization are available. We format the groom, bride, witnesses, and officiant signature fields according to your ceremony requirements.',
    },
    {
      q: 'Do certificates come with presentation folders or framing options?',
      a: 'Yes! We offer velvet presentation folios, hardcover keepsake boxes, and certificate tubes stamped with custom gold foil.',
    },
    {
      q: 'How fast can a Nikkahnama be delivered in Pakistan or internationally?',
      a: 'Domestic delivery across Pakistan takes 2–3 business days via Leopards/TCS. International delivery via DHL Express takes 3–5 days to UAE and 4–7 days to the UK, USA, and Canada.',
    },
  ],
  'accessories-add-ons': [
    {
      q: 'Can we order custom brass wax seal stamps with our couple initials?',
      a: 'Yes! We manufacture precision-engraved solid brass wax seal stamps with your custom initials, monogram, or wedding logo, paired with a solid wooden handle.',
    },
    {
      q: 'Do you offer pre-made self-adhesive wax seal stickers?',
      a: 'Yes! We offer ready-to-stick wax seals with industrial 3M adhesive backing in over 20+ custom wax colors (classic gold, burgundy, champagne, sage green, pearl white, antique bronze). Just peel and stick to envelopes.',
    },
    {
      q: 'What other accessories can we add to our wedding stationery?',
      a: 'We offer frayed-edge silk chiffon ribbons, velvet belly bands, scalloped and oval card inserts, printed vellum overlays, gold foiling, embossing, and personalized stickers.',
    },
  ],
  'packaging': [
    {
      q: 'What types of custom packaging boxes do you manufacture?',
      a: 'We design and produce rigid luxury boxes, magnetic closure gift boxes, gold foil stamped paper bags, custom sweet/mithai boxes, and corporate event hampers.',
    },
    {
      q: 'Can we print custom branding and wedding monograms on packaging?',
      a: 'Yes! All packaging is fully customizable with hot-foil stamping, spot UV, custom embossing, ribbon ties, and personalized inside-lid printing.',
    },
    {
      q: 'What is the minimum quantity for custom rigid boxes?',
      a: 'Minimum orders start at 25–50 pieces depending on box structure and sizing. Contact us on WhatsApp for exact dimensions and price quotes.',
    },
  ],
  'favours': [
    {
      q: 'What wedding favour items are most popular for wedding guests?',
      a: 'Our luxury golden tin keepsake boxes, custom printed favor boxes with ribbons, personalized scented candles, and mini celebratory pouches are client favorites.',
    },
    {
      q: 'Can favour boxes include our wedding logo and guest thank-you tags?',
      a: 'Yes, every favor box comes with customized tags, gold foil stickers, or direct foil embossing matching your wedding invitation theme.',
    },
  ],
  'stationary-items': [
    {
      q: 'What products are in your stationery collection?',
      a: 'Our stationery range includes luxury money gifting envelopes, greeting cards, thank-you notes, custom diaries, planners, and personalized letterheads.',
    },
    {
      q: 'Do you offer Eid and festive gifting envelopes in bulk?',
      a: 'Yes! We offer themed Eidi envelopes, Salami packets, and festive money cards in sets of 5, 10, or custom event quantities.',
    },
  ],
  'gifting-envelopes-tags': [
    {
      q: 'Can gifting envelopes be customized with family names?',
      a: 'Yes! We offer custom foil-stamped family names and monogrammed initials on luxury velvet and cardstock gifting envelopes.',
    },
  ],
}

export function buildCategoryFaqSchema(categorySlug, categoryLabel) {
  const faqs = CATEGORY_FAQS[categorySlug] || CATEGORY_FAQS['wedding-invitations']
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  }
}

export const PAGE_SEO = {
  home: {
    title: 'The Paper Story | Custom Wedding Invitations, Nikkahnama & Bespoke Stationery',
    description:
      'Pakistan’s premier luxury wedding stationery studio. Bespoke wedding invitations, Urdu & English Nikkahnama certificates, digital video e-invites, wax seals & event packaging. Tracked worldwide shipping to USA, UK, UAE, Canada, Australia & Pakistan.',
  },
  about: {
    title: 'About The Paper Story | Handcrafted Luxury Wedding Stationery Studio',
    description:
      'Founded by Fatima and Huzaifa. Crafting heirloom-quality wedding invitations, bespoke Urdu calligraphy, and ceremonial keepsakes for celebrations across Pakistan and worldwide.',
  },
  contact: {
    title: 'Order on WhatsApp & Contact Design Studio | The Paper Story',
    description:
      'Chat directly with Fatima and Huzaifa on WhatsApp for custom wedding invitation quotes, design proofs, rush orders, and international shipping support.',
  },
  shipping: {
    title: 'Worldwide Shipping & Turnaround Times | The Paper Story',
    description:
      'Door-to-door express delivery with DHL Express & TCS. Shipping luxury wedding invitations & Nikkahnama across Pakistan, USA, UK, UAE, Canada & Australia.',
  },
  shop: {
    title: 'Shop Custom Wedding Cards, Nikkahnama & Stationery | The Paper Story',
    description:
      'Browse handcrafted wedding cards, luxury Nikkahnama certificates, animated e-invites, wax seals, gift boxes, and bespoke stationery. Door-to-door worldwide delivery.',
  },
}

export function categorySeo(cat, sub = null, occasion = null) {
  const catTitleMap = {
    'wedding-invitations': 'Custom Wedding Cards & Invitations | The Paper Story',
    'digital-invitations': 'Animated Video Wedding Invites & E-Cards | The Paper Story',
    'nikkahnama': 'Luxury Nikkahnama & Islamic Wedding Certificates | The Paper Story',
    'favours': 'Custom Wedding Favours, Golden Tins & Keepsakes | The Paper Story',
    'packaging': 'Custom Luxury Event Packaging & Rigid Boxes | The Paper Story',
    'stationary-items': 'Personalised Greeting Cards & Bespoke Stationery | The Paper Story',
    'accessories-add-ons': 'Custom Wax Seals, Monogram Stamps & Ribbon Add-ons | The Paper Story',
    'gifting-envelopes-tags': 'Luxury Money Gifting Envelopes & Event Tags | The Paper Story',
  }

  const catDescMap = {
    'wedding-invitations':
      'Explore luxury custom wedding invitations with gold foiling, velvet envelopes, wax seals, and Urdu/English calligraphy. Tracked worldwide delivery to USA, UK, UAE, Canada & Pakistan.',
    'digital-invitations':
      'Modern animated wedding video invitations and WhatsApp digital invites customized with your music, names, and event details. Instant worldwide digital delivery.',
    'nikkahnama':
      'Handcrafted custom Nikkah certificates with illuminated Islamic borders, Urdu calligraphy, and luxury presentation folders. Worldwide express shipping.',
    'favours':
      'Bespoke wedding favours, personalised golden tins, and celebratory keepsake packaging for your guests. Custom orders delivered nationwide and globally.',
    'packaging':
      'Custom rigid gift boxes, corporate packaging, and celebratory luxury bags with custom foil stamping and ribbon details.',
    'stationary-items':
      'Handcrafted greeting cards, event stationery, and custom keepsakes designed in-house with worldwide delivery.',
    'accessories-add-ons':
      'Elevate your stationery with bespoke brass wax seal stamps, peel-and-stick wax stickers, silk ribbons, and luxury envelope liners.',
    'gifting-envelopes-tags':
      'Handcrafted Eidi & Salami money gifting envelopes, festive gift tags, and celebratory stationery.',
  }

  const title = occasion
    ? `${sub.label} — ${occasion.label} | The Paper Story`
    : sub
      ? `${sub.label} — ${cat.label} | The Paper Story`
      : catTitleMap[cat.slug] || `${cat.label} | The Paper Story`

  const description =
    sub?.tagline ||
    catDescMap[cat.slug] ||
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
