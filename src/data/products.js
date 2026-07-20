const IMG = {
  wedding: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
  digital: '/e-invites/wedding-static-01.png',
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

/** Image Invitation — Wedding (from TPS DIGITAL INVITES / Wedding) */
export const WEDDING_IMAGE_INVITES = [
  '/e-invites/wedding-static-01.png',
  '/e-invites/wedding-static-02.png',
  '/e-invites/wedding-static-03.png',
  '/e-invites/wedding-static-04.png',
  '/e-invites/wedding-static-05.jpg',
  '/e-invites/wedding-static-06.jpg',
  '/e-invites/wedding-static-07.jpg',
  '/e-invites/wedding-static-08.jpg',
  '/e-invites/wedding-static-09.jpg',
  '/e-invites/wedding-static-10.jpg',
]

/** Image Invitation — Baby Announcement (from TPS DIGITAL INVITES / Baby) */
export const BABY_IMAGE_INVITES = [
  '/e-invites/baby-announcement-static-1.png',
  '/e-invites/baby-announcement-static-2.png',
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
    id: 'digital-invitations',
    slug: 'digital-invitations',
    label: 'Digital Invitations',
    shortLabel: 'Digital Invitations',
    description: 'Find the perfect digital invitation for your celebration',
    image: IMG.digital,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      {
        slug: 'image-invitation',
        label: 'Image Invitation',
        tagline: 'Invitation designs that are easy to share',
        whatsappPrefix: 'Digital Invitation (Image)',
        types: [
          { slug: 'wedding', label: 'Wedding', whatsappPrefix: 'Digital Invitation — Image (Wedding)' },
          { slug: 'baby-announcement', label: 'Baby Announcement', whatsappPrefix: 'Digital Invitation — Image (Baby Announcement)' },
        ],
      },
      {
        slug: 'animated-invitation',
        label: 'Animated Invitations',
        tagline: 'Bring your invitation to life with beautiful animations',
        whatsappPrefix: 'Digital Invitation (Animated)',
        types: [
          { slug: 'wedding', label: 'Wedding', whatsappPrefix: 'Digital Invitation — Animated (Wedding)' },
          { slug: 'baby-announcement', label: 'Baby Announcement', whatsappPrefix: 'Digital Invitation — Animated (Baby Announcement)' },
          { slug: 'birthday', label: 'Birthday', whatsappPrefix: 'Digital Invitation — Animated (Birthday)' },
        ],
      },
      {
        slug: 'website-invitation',
        label: 'Website Invitation',
        tagline: 'A full wedding website invitation guests can open and explore',
        whatsappPrefix: 'Digital Invitation (Website)',
        externalUrl: 'https://wedding-invite-sand-eight.vercel.app/',
        image: '/e-invites/website/website-invitation.png',
        types: null,
      },
    ],
  },
  {
    id: 'nikkahnama',
    slug: 'nikkahnama',
    label: 'Nikkah Certificates',
    shortLabel: 'Nikkah Certificates',
    description: 'Hand-painted and printed nikkah certificates — pricing on request only.',
    image: '/nikkah/cover-printed.jpg',
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
    description: 'Diaries, pens, and everyday stationery — COD available within Pakistan.',
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
    description: 'Custom cake boxes and gift packaging — COD available within Pakistan.',
    image: IMG.boxes,
    showPrice: false,
    paymentType: 'cod',
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
    image: '/vinyl/vinyl-1.jpeg',
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

const DIGITAL_TYPE_IMAGES = {
  'image-invitation': {
    wedding: WEDDING_IMAGE_INVITES,
    'baby-announcement': BABY_IMAGE_INVITES,
  },
  'animated-invitation': {
    wedding: [
      '/e-invites/animated-wedding-01.mp4',
      '/e-invites/animated-wedding-02.mp4',
      '/e-invites/animated-wedding-03.mp4',
      '/e-invites/animated-wedding-04.mp4',
      '/e-invites/animated-wedding-05.mp4',
      '/e-invites/animated-wedding-06.mp4',
      '/e-invites/animated-wedding-07.mp4',
      '/e-invites/animated-wedding-08.mp4',
    ],
    'baby-announcement': ['/e-invites/animated-baby-01.mp4'],
    birthday: ['/e-invites/animated-birthday-01.mp4'],
  },
}

const VINYL_IMAGES = [
  '/vinyl/vinyl-1.jpeg',
  '/vinyl/vinyl-2.jpeg',
  '/vinyl/vinyl-3.jpeg',
  '/vinyl/vinyl-4.png',
]

/** Each numbered folder becomes one product card with a gallery slider */
const NIKKAH_GALLERY_PRODUCTS = {
  'hand-painted': [
    {
      name: 'Design 1',
      images: [
        '/nikkah/hand-painted-1/01.jpeg',
        '/nikkah/hand-painted-1/02.jpeg',
        '/nikkah/hand-painted-1/03.jpeg',
      ],
    },
  ],
  'printed-without-frame': [
    {
      name: 'Design 1',
      images: [
        '/nikkah/printed-1/01.jpeg',
        '/nikkah/printed-1/02.jpeg',
        '/nikkah/printed-1/03.jpeg',
      ],
    },
  ],
  'printed-with-frame': [
    {
      name: 'Design 1',
      images: [
        '/nikkah/printed-2/01.jpeg',
        '/nikkah/printed-2/02.jpeg',
        '/nikkah/printed-2/03.jpeg',
      ],
    },
    {
      name: 'Design 2',
      images: ['/nikkah/printed-fatima-post.jpg'],
    },
    {
      name: 'Design 3',
      images: ['/nikkah/printed-mockup-2.png'],
    },
  ],
}

function addDesigns({
  categorySlug,
  subcategorySlug,
  typeSlug,
  whatsappLabel,
  image,
  images,
  galleryImages,
  count = 4,
  showPrice,
  priceBase,
  paymentType,
  whatsappMode,
  categoryLabel,
  name,
}) {
  if (galleryImages?.length) {
    return [
      {
        id: productId++,
        name: name || 'Design 1',
        category: categoryLabel,
        categorySlug,
        subcategorySlug: subcategorySlug || null,
        typeSlug: typeSlug || null,
        image: galleryImages[0],
        images: galleryImages,
        showPrice: showPrice ?? false,
        price: showPrice ? `PKR ${priceBase + 350}` : null,
        paymentType,
        whatsappMode,
        whatsappLabel,
      },
    ]
  }

  const total = images?.length || count
  return Array.from({ length: total }, (_, i) => {
    const designNum = i + 1
    return {
      id: productId++,
      name: name || `Design ${designNum}`,
      category: categoryLabel,
      categorySlug,
      subcategorySlug: subcategorySlug || null,
      typeSlug: typeSlug || null,
      image: images?.[i] || image,
      images: null,
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
        if (sub.slug === 'website-invitation') continue

        if (cat.slug === 'nikkahnama' && NIKKAH_GALLERY_PRODUCTS[sub.slug]) {
          for (const design of NIKKAH_GALLERY_PRODUCTS[sub.slug]) {
            all.push(
              ...addDesigns({
                categorySlug: cat.slug,
                subcategorySlug: sub.slug,
                whatsappLabel: sub.whatsappPrefix,
                galleryImages: design.images,
                name: design.name,
                showPrice: cat.showPrice,
                priceBase: 1200,
                paymentType: cat.paymentType,
                whatsappMode: cat.whatsappMode,
                categoryLabel: cat.label,
              })
            )
          }
          continue
        }

        if (sub.types?.length) {
          for (const type of sub.types) {
            const typeImages = DIGITAL_TYPE_IMAGES[sub.slug]?.[type.slug]
            if (Array.isArray(typeImages) && typeImages.length === 0) continue
            all.push(
              ...addDesigns({
                categorySlug: cat.slug,
                subcategorySlug: sub.slug,
                typeSlug: type.slug,
                whatsappLabel: type.whatsappPrefix || sub.whatsappPrefix,
                image: cat.image,
                images: typeImages,
                count: typeImages?.length || 3,
                showPrice: cat.showPrice,
                priceBase: 1200,
                paymentType: cat.paymentType,
                whatsappMode: cat.whatsappMode,
                categoryLabel: cat.label,
              })
            )
          }
        } else {
          all.push(
            ...addDesigns({
              categorySlug: cat.slug,
              subcategorySlug: sub.slug,
              whatsappLabel: sub.whatsappPrefix,
              image: cat.image,
              count: 4,
              showPrice: cat.showPrice,
              priceBase: cat.slug === 'stationary-items' ? 800 : 1200,
              paymentType: cat.paymentType,
              whatsappMode: cat.whatsappMode,
              categoryLabel: cat.label,
            })
          )
        }
      }
    } else if (cat.slug === 'vinyl-stickers') {
      all.push(
        ...addDesigns({
          categorySlug: cat.slug,
          whatsappLabel: 'Vinyl Sticker',
          image: cat.image,
          images: VINYL_IMAGES,
          showPrice: cat.showPrice,
          priceBase: 0,
          paymentType: cat.paymentType,
          whatsappMode: cat.whatsappMode,
          categoryLabel: cat.label,
        })
      )
    } else {
      const prefixMap = {
        'wedding-invitations': 'Wedding Invitation',
        pamphlets: 'Pamphlet',
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

export function getAllSitemapPaths() {
  const paths = new Set(['/', '/about', '/contact', '/shop'])

  for (const cat of shopCategories) {
    paths.add(`/shop/${cat.slug}`)

    for (const sub of cat.subcategories || []) {
      paths.add(`/shop/${cat.slug}/${sub.slug}`)

      for (const type of sub.types || []) {
        paths.add(`/shop/${cat.slug}/${sub.slug}/${type.slug}`)
      }
    }
  }

  return [...paths]
}

const GET_CUSTOMISED_IMAGE = {
  id: 'get-customised-image',
  name: 'Get Customised',
  category: 'Digital Invitations',
  categorySlug: 'digital-invitations',
  subcategorySlug: 'image-invitation',
  typeSlug: null,
  image: '/e-invites/get-customised.png',
  showPrice: false,
  price: null,
  paymentType: 'advance',
  whatsappMode: 'price',
  whatsappLabel: 'Digital Invitation — Get Customised (Image)',
}

const GET_CUSTOMISED_ANIMATED = {
  id: 'get-customised-animated',
  name: 'Get Customised',
  category: 'Digital Invitations',
  categorySlug: 'digital-invitations',
  subcategorySlug: 'animated-invitation',
  typeSlug: null,
  image: '/e-invites/get-customised.mp4',
  showPrice: false,
  price: null,
  paymentType: 'advance',
  whatsappMode: 'price',
  whatsappLabel: 'Digital Invitation — Get Customised (Animated)',
}

const WEBSITE_WEDDING_INVITE = {
  id: 'website-wedding-invite',
  name: 'Website Invitation',
  category: 'Digital Invitations',
  categorySlug: 'digital-invitations',
  subcategorySlug: 'image-invitation',
  typeSlug: 'wedding',
  image: '/e-invites/website/website-invitation.png',
  externalUrl: 'https://wedding-invite-sand-eight.vercel.app/',
  showPrice: false,
  price: null,
  paymentType: 'advance',
  whatsappMode: 'price',
  whatsappLabel: 'Digital Invitation — Website (Wedding)',
}

const CATEGORY_ALIASES = {
  'digital-e-invitations': 'digital-invitations',
}

const SUBCATEGORY_ALIASES = {
  static: 'image-invitation',
  animated: 'animated-invitation',
}

export function getFeaturedProducts() {
  const picks = [
    { categorySlug: 'wedding-invitations', design: 1 },
    { categorySlug: 'digital-invitations', subcategorySlug: 'image-invitation', typeSlug: 'wedding', design: 1 },
    { categorySlug: 'nikkahnama', subcategorySlug: 'hand-painted', design: 1 },
    { categorySlug: 'greeting-cards', design: 1 },
  ]

  return picks
    .map(({ categorySlug, subcategorySlug, typeSlug, design }) =>
      products.find(
        (product) =>
          product.categorySlug === categorySlug &&
          product.subcategorySlug === (subcategorySlug ?? null) &&
          (typeSlug == null || product.typeSlug === typeSlug) &&
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
    { categorySlug: 'digital-invitations', subcategorySlug: 'image-invitation', typeSlug: 'wedding', design: 1 },
    { categorySlug: 'stationary-items', subcategorySlug: 'diaries', design: 1 },
    { categorySlug: 'nikkahnama', subcategorySlug: 'printed-with-frame', design: 1 },
    { categorySlug: 'packaging', subcategorySlug: 'business-stickers', design: 1 },
  ]

  return picks
    .map(({ categorySlug, subcategorySlug, typeSlug, design }) =>
      products.find(
        (product) =>
          product.categorySlug === categorySlug &&
          product.subcategorySlug === (subcategorySlug ?? null) &&
          (typeSlug == null || product.typeSlug === typeSlug) &&
          product.name === `Design ${design}`
      )
    )
    .filter(Boolean)
}

export function normalizeCategorySlug(slug) {
  return CATEGORY_ALIASES[slug] || slug
}

export function normalizeSubcategorySlug(slug) {
  return SUBCATEGORY_ALIASES[slug] || slug
}

export function getCategoryBySlug(slug) {
  return shopCategories.find((c) => c.slug === normalizeCategorySlug(slug))
}

export function getSubcategory(category, subSlug) {
  if (!category || !subSlug) return null
  return category.subcategories?.find((s) => s.slug === normalizeSubcategorySlug(subSlug)) ?? null
}

export function getType(subcategory, typeSlug) {
  if (!subcategory || !typeSlug) return null
  return subcategory.types?.find((t) => t.slug === typeSlug) ?? null
}

export function getProductsByCategory(categorySlug, subcategorySlug = null, typeSlug = null) {
  const normalizedCategory = normalizeCategorySlug(categorySlug)
  const normalizedSub = subcategorySlug ? normalizeSubcategorySlug(subcategorySlug) : null

  const list = products.filter((p) => {
    if (p.categorySlug !== normalizedCategory) return false
    if (normalizedSub && p.subcategorySlug !== normalizedSub) return false
    if (typeSlug && p.typeSlug !== typeSlug) return false
    return true
  })

  if (normalizedCategory !== 'digital-invitations') return list

  if (normalizedSub === 'image-invitation') {
    if (typeSlug === 'wedding' || !typeSlug) {
      return [...list, WEBSITE_WEDDING_INVITE]
    }
    return list
  }
  if (normalizedSub === 'animated-invitation') {
    return list
  }
  if (!normalizedSub) {
    return [...list, WEBSITE_WEDDING_INVITE]
  }

  return list
}
