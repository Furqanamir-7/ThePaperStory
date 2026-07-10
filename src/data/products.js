const IMG = {
  wedding: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
  digital: '/e-invites/static-1.png',
  nikkah: 'https://images.unsplash.com/photo-1522673606300-2744e24c2470?w=800&h=600&fit=crop',
  favours: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop',
  packaging: 'https://images.unsplash.com/photo-1586075010923-2dd457f5f5a0?w=800&h=600&fit=crop',
  stationary: 'https://images.unsplash.com/photo-1456320508967-f6a0e8d8a2f9?w=800&h=600&fit=crop',
  boxes: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
  pamphlet: 'https://images.unsplash.com/photo-1565680018434-b513d5e261b9?w=800&h=600&fit=crop',
  vinyl: 'https://images.unsplash.com/photo-1608589215137-8ad787a33c4c?w=800&h=600&fit=crop',
  greeting: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=600&fit=crop',
  eidi: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&h=600&fit=crop',
}

export const STATIC_E_INVITE_IMAGES = [
  '/e-invites/static-1.png',
  '/e-invites/static-2.png',
  '/e-invites/static-3.png',
  '/e-invites/static-4.png',
  '/e-invites/static-5.jpg',
  '/e-invites/static-6.jpg',
  '/e-invites/static-7.jpg',
  '/e-invites/static-8.jpg',
  '/e-invites/static-9.jpg',
  '/e-invites/static-10.jpg',
]

export const INSTAGRAM_URL = 'https://www.instagram.com/thepaperstory.co/'

export const shopCategories = [
  {
    id: 'wedding-invitations',
    slug: 'wedding-invitations',
    label: 'Wedding Invitations',
    shortLabel: 'Wedding',
    description: 'Elegant wedding invitation designs — enquire for pricing.',
    image: IMG.wedding,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: null,
  },
  {
    id: 'digital-e-invitations',
    slug: 'digital-e-invitations',
    label: 'Digital E-Invitations',
    shortLabel: 'E-Invites',
    description: 'Static and animated digital invitations for your special day.',
    image: IMG.digital,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'static', label: 'Static Invites', whatsappPrefix: 'Digital E-Invitation (Static)' },
      { slug: 'animated', label: 'Animated Invites', whatsappPrefix: 'Digital E-Invitation (Animated)' },
    ],
  },
  {
    id: 'nikkahnama',
    slug: 'nikkahnama',
    label: 'Nikkah Certificates',
    shortLabel: 'Nikkah Certificates',
    description: 'Hand-painted and printed nikkah certificates — pricing on request only.',
    image: IMG.nikkah,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'hand-painted', label: 'Hand Painted', whatsappPrefix: 'Nikkah Certificates (Hand Painted)' },
      { slug: 'printed-without-frame', label: 'Printed — Without Frame', whatsappPrefix: 'Nikkah Certificates (Printed - Without Frame)' },
      { slug: 'printed-with-frame', label: 'Printed — With Frame', whatsappPrefix: 'Nikkah Certificates (Printed - With Frame)' },
    ],
  },
  {
    id: 'favours',
    slug: 'favours',
    label: 'Favours',
    shortLabel: 'Favours',
    description: 'Potli, box, and tin favours for weddings and events.',
    image: IMG.favours,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'potli', label: 'Potli', whatsappPrefix: 'Favours (Potli)' },
      { slug: 'box-favours', label: 'Box Favours', whatsappPrefix: 'Favours (Box)' },
      { slug: 'tin-favours', label: 'Tin Favours', whatsappPrefix: 'Favours (Tin)' },
    ],
  },
  {
    id: 'packaging',
    slug: 'packaging',
    label: 'Packaging Material / Items',
    shortLabel: 'Packaging',
    description: 'Business stickers for branding and packaging.',
    image: IMG.packaging,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'business-stickers', label: 'Business Stickers', whatsappPrefix: 'Packaging (Business Stickers)' },
    ],
  },
  {
    id: 'stationary-items',
    slug: 'stationary-items',
    label: 'Stationary Items',
    shortLabel: 'Stationary',
    description: 'Diaries, pens, and everyday stationery — COD available in Pakistan.',
    image: IMG.stationary,
    showPrice: true,
    paymentType: 'cod',
    whatsappMode: 'more',
    subcategories: [
      { slug: 'diaries', label: 'Diaries', whatsappPrefix: 'Stationary (Diaries)' },
      { slug: 'pens', label: 'Pens', whatsappPrefix: 'Stationary (Pens)' },
    ],
  },
  {
    id: 'boxes',
    slug: 'boxes',
    label: 'Boxes',
    shortLabel: 'Boxes',
    description: 'Custom cake boxes and gift packaging.',
    image: IMG.boxes,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'cake-boxes', label: 'Cake Boxes', whatsappPrefix: 'Boxes (Cake Boxes)' },
    ],
  },
  {
    id: 'pamphlets',
    slug: 'pamphlets',
    label: 'Pamphlets',
    shortLabel: 'Pamphlets',
    description: 'Printed pamphlets for events and promotions.',
    image: IMG.pamphlet,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: null,
  },
  {
    id: 'vinyl-stickers',
    slug: 'vinyl-stickers',
    label: 'Vinyl Stickers',
    shortLabel: 'Vinyl',
    description: 'Custom vinyl stickers — pricing varies by design complexity.',
    image: IMG.vinyl,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: null,
  },
  {
    id: 'greeting-cards',
    slug: 'greeting-cards',
    label: 'Greeting Cards',
    shortLabel: 'Greeting Cards',
    description: 'Beautiful greeting card designs with listed prices.',
    image: IMG.greeting,
    showPrice: true,
    paymentType: 'advance',
    whatsappMode: 'more',
    subcategories: null,
  },
  {
    id: 'eidi-envelopes',
    slug: 'eidi-envelopes',
    label: 'Money / Eidi Envelopes',
    shortLabel: 'Eidi Envelopes',
    description: 'Festive eidi envelope designs with listed prices.',
    image: IMG.eidi,
    showPrice: true,
    paymentType: 'advance',
    whatsappMode: 'more',
    subcategories: null,
  },
]

let productId = 1

function addDesigns({
  categorySlug,
  subcategorySlug,
  whatsappLabel,
  image,
  images,
  count = 4,
  showPrice,
  priceBase,
  paymentType,
  whatsappMode,
  categoryLabel,
}) {
  const total = images?.length || count
  return Array.from({ length: total }, (_, i) => {
    const designNum = i + 1
    return {
      id: productId++,
      name: `Design ${designNum}`,
      category: categoryLabel,
      categorySlug,
      subcategorySlug: subcategorySlug || null,
      image: images?.[i] || image,
      showPrice: showPrice ?? false,
      price: showPrice ? `PKR ${priceBase + designNum * 350}` : null,
      paymentType,
      whatsappMode,
      whatsappLabel,
    }
  })
}

function buildAllProducts() {
  const all = []

  for (const cat of shopCategories) {
    if (cat.subcategories?.length) {
      for (const sub of cat.subcategories) {
        const isEInvite = cat.slug === 'digital-e-invitations'
        all.push(
          ...addDesigns({
            categorySlug: cat.slug,
            subcategorySlug: sub.slug,
            whatsappLabel: sub.whatsappPrefix,
            image: cat.image,
            images: isEInvite ? STATIC_E_INVITE_IMAGES : undefined,
            count: isEInvite ? STATIC_E_INVITE_IMAGES.length : 4,
            showPrice: cat.showPrice,
            priceBase: cat.slug === 'stationary-items' ? 800 : 1200,
            paymentType: cat.paymentType,
            whatsappMode: cat.whatsappMode,
            categoryLabel: cat.label,
          })
        )
      }
    } else {
      const prefixMap = {
        'wedding-invitations': 'Wedding Invitation',
        pamphlets: 'Pamphlet',
        'vinyl-stickers': 'Vinyl Sticker',
        'greeting-cards': 'Greeting Card',
        'eidi-envelopes': 'Eidi Envelope',
      }
      all.push(
        ...addDesigns({
          categorySlug: cat.slug,
          whatsappLabel: prefixMap[cat.slug] || cat.label,
          image: cat.image,
          showPrice: cat.showPrice,
          priceBase: cat.showPrice ? 1500 : 0,
          paymentType: cat.paymentType,
          whatsappMode: cat.whatsappMode,
          categoryLabel: cat.label,
        })
      )
    }
  }

  return all
}

export const products = buildAllProducts()
export const categories = shopCategories

export function getFeaturedProducts() {
  const picks = [
    { categorySlug: 'wedding-invitations', design: 1 },
    { categorySlug: 'digital-e-invitations', subcategorySlug: 'static', design: 1 },
    { categorySlug: 'nikkahnama', subcategorySlug: 'hand-painted', design: 1 },
    { categorySlug: 'greeting-cards', design: 1 },
  ]

  return picks
    .map(({ categorySlug, subcategorySlug, design }) =>
      products.find(
        (product) =>
          product.categorySlug === categorySlug &&
          product.subcategorySlug === (subcategorySlug ?? null) &&
          product.name === `Design ${design}`
      )
    )
    .filter(Boolean)
}

export function getBestSellers() {
  const picks = [
    { categorySlug: 'greeting-cards', design: 1 },
    { categorySlug: 'eidi-envelopes', design: 2 },
    { categorySlug: 'wedding-invitations', design: 2 },
    { categorySlug: 'favours', subcategorySlug: 'potli', design: 1 },
    { categorySlug: 'digital-e-invitations', subcategorySlug: 'static', design: 1 },
    { categorySlug: 'stationary-items', subcategorySlug: 'diaries', design: 1 },
    { categorySlug: 'nikkahnama', subcategorySlug: 'printed-with-frame', design: 1 },
    { categorySlug: 'packaging', subcategorySlug: 'business-stickers', design: 1 },
  ]

  return picks
    .map(({ categorySlug, subcategorySlug, design }) =>
      products.find(
        (product) =>
          product.categorySlug === categorySlug &&
          product.subcategorySlug === (subcategorySlug ?? null) &&
          product.name === `Design ${design}`
      )
    )
    .filter(Boolean)
}

export function getCategoryBySlug(slug) {
  return shopCategories.find((c) => c.slug === slug)
}

export function getSubcategory(category, subSlug) {
  return category?.subcategories?.find((s) => s.slug === subSlug) ?? null
}

export function getProductsByCategory(categorySlug, subcategorySlug = null) {
  return products.filter((p) => {
    if (p.categorySlug !== categorySlug) return false
    if (subcategorySlug) return p.subcategorySlug === subcategorySlug
    return true
  })
}
