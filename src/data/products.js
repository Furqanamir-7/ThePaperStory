import {
  getProductCode,
  getProductDescription,
  getProductWhatsIncluded,
  getProductSeoKeywords,
  CATEGORY_INITIALS,
} from './product-metadata.js'
import stationaryGallery from './stationary-gallery.json' with { type: 'json' }
import importedDesktopGallery from './imported-desktop-gallery.json' with { type: 'json' }
import tpsDataGallery from './tps-data-gallery.json' with { type: 'json' }
import eidiPostcardsGallery from './eidi-postcards-gallery.json' with { type: 'json' }
import {
  SEO_EIDI,
  SEO_PAMPHLET,
  seoDiaryName,
  seoDigitalName,
  seoEidiName,
  seoFavourName,
  seoGreetingName,
  seoNikkahName,
  seoPackagingName,
  seoPamphletName,
  seoPickName,
  seoPostcardName,
  seoVinylName,
  seoWeddingName,
  weddingDesignNumber,
} from './seo-product-names.js'

const IMG = {
  wedding: '/wedding-invites/cover.jpg',
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
    description:
      'Custom wedding invitations designed around your wedding. Choose from floral, minimalist, traditional and modern styles, then personalise the wording, colours, paper and finish. Matching inserts and envelopes are available.',
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
    description:
      'Digital wedding invitations as image or animated e-invites, customised with your names, event details and design style. Easy to share on WhatsApp, email and social media. Worldwide digital delivery.',
    image: IMG.digital,
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      {
        slug: 'image-invitation',
        label: 'Image Invitation',
        tagline: 'Invitation designs that are easy to share on WhatsApp and email',
        whatsappPrefix: 'Digital Invitation (Image)',
        types: [
          { slug: 'wedding', label: 'Wedding', whatsappPrefix: 'Digital Invitation — Image (Wedding)' },
          { slug: 'baby-announcement', label: 'Baby Announcement', whatsappPrefix: 'Digital Invitation — Image (Baby Announcement)' },
        ],
      },
      {
        slug: 'animated-invitation',
        label: 'Animated Invitations',
        tagline: 'Bring your invitation to life with music and motion',
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
    description:
      'Custom Nikkah certificates with your names, dates and details in a layout that suits your wedding ceremony. Handcrafted on archival textured cardstock with gold foil embellishments.',
    image: '/nikkah/cover-printed.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'hand-painted', label: 'Hand Painted', whatsappPrefix: 'Nikkah Certificates (Hand Painted)' },
      { slug: 'printed', label: 'Printed', whatsappPrefix: 'Nikkah Certificates (Printed)' },
    ],
  },
  {
    id: 'favours',
    slug: 'favours',
    label: 'Favours',
    shortLabel: 'Favours',
    description:
      'Custom wedding favours and favour boxes for your guests, personalised with your names, date or monogram.',
    image: '/favours/bid-potli/01.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'potli', label: 'Potli', whatsappPrefix: 'Favours (Potli)' },
      { slug: 'box-favours', label: 'Box Favours', whatsappPrefix: 'Favours (Box)' },
      { slug: 'tin-favours', label: 'Tin Favours', whatsappPrefix: 'Favours (Tin)' },
      { slug: 'cones', label: 'Saunf Cones', whatsappPrefix: 'Favours (Saunf Cones)' },
      { slug: 'tags', label: 'Favour Tags', whatsappPrefix: 'Favours (Tags)' },
      { slug: 'cake-toppers', label: 'Cake Toppers', whatsappPrefix: 'Favours (Cake Toppers)' },
    ],
  },
  {
    id: 'gifting-envelopes-tags',
    slug: 'gifting-envelopes-tags',
    label: 'Gifting Envelopes & Tags',
    shortLabel: 'Envelopes & Tags',
    description: 'Luxury handcrafted money envelopes, artisan gift tags, and custom stationery for celebrations.',
    image: '/eidi/friends-theme/01.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'gifting-envelopes', label: 'Gifting Envelopes', whatsappPrefix: 'Gifting Envelopes' },
      { slug: 'gift-tags', label: 'Gift Tags', whatsappPrefix: 'Gift Tags' },
      { slug: 'custom-stationery', label: 'Custom Stationery', whatsappPrefix: 'Custom Stationery' },
    ],
  },
  {
    id: 'greeting-cards',
    slug: 'greeting-cards',
    label: 'Greeting Cards',
    shortLabel: 'Greeting Cards',
    description: 'Bespoke heartfelt greeting cards for every special celebration.',
    image: IMG.greeting,
    showPrice: true,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'all-cards', label: 'All Cards', whatsappPrefix: 'Greeting Cards (All Cards)' },
      { slug: 'birthday-cards', label: 'Birthday Cards', whatsappPrefix: 'Greeting Cards (Birthday)' },
      { slug: 'for-mothers', label: 'For Mothers', whatsappPrefix: 'Greeting Cards (For Mothers)' },
      { slug: 'for-fathers', label: 'For Fathers', whatsappPrefix: 'Greeting Cards (For Fathers)' },
    ],
  },
  {
    id: 'ramadan-eid-gifts',
    slug: 'ramadan-eid-gifts',
    label: 'Ramadan & Eid Gifts',
    shortLabel: 'Ramadan & Eid',
    description: 'Artisan Ramadan calendars, luxury Eid gift sets, money envelope hampers, and celebratory keepsakes.',
    image: '/stationary/ramadan-calendar/01.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: null,
  },
  {
    id: 'packaging',
    slug: 'packaging',
    label: 'Packaging Material / Items',
    shortLabel: 'Packaging',
    description:
      "Custom printed boxes, gift boxes, cake boxes, stickers and branded packaging for businesses and personal orders. Share your size, quantity and design, and we'll quote you.",
    image: '/packaging/paper-bags-design-1/01.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { slug: 'business-stickers', label: 'Business & Event Stickers', whatsappPrefix: 'Packaging (Stickers)' },
      { slug: 'paper-bags', label: 'Luxury Paper Bags', whatsappPrefix: 'Packaging (Paper Bags)' },
      { slug: 'gift-tags', label: 'Artisan Gift & Event Tags', whatsappPrefix: 'Packaging (Gift Tags)' },
      { slug: 'business-cards', label: 'Business Cards & Boxes', whatsappPrefix: 'Packaging (Business Cards)' },
    ],
  },
  {
    id: 'stationary-items',
    slug: 'stationary-items',
    label: 'Stationery Items',
    shortLabel: 'Stationery',
    description:
      'Personalised greeting cards, Eidi and money envelopes, baby announcement boxes and other custom stationery for everyday occasions and celebrations.',
    image: '/stationary/diaries/01-01.jpg',
    showPrice: true,
    paymentType: 'cod',
    whatsappMode: 'more',
    subcategories: [
      { slug: 'diaries', label: 'Diaries', whatsappPrefix: 'Stationery (Diaries)' },
      { slug: 'pens', label: 'Pens', whatsappPrefix: 'Stationery (Pens)' },
      { slug: 'ramadan-calendar', label: 'Ramadan Calendar', whatsappPrefix: 'Stationery (Ramadan Calendar)' },
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
    description: 'Bespoke printed pamphlets, folded ceremony programs, brand brochures, and celebration menus.',
    image: '/pamphlets/pamphlet-01.jpg',
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
    id: 'post-cards',
    slug: 'post-cards',
    label: 'Post Cards',
    shortLabel: 'Post Cards',
    description: '',
    image: '/postcards/01.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: null,
  },
  {
    id: 'eidi-envelopes',
    slug: 'eidi-envelopes',
    label: 'Eidi and Money Envelopes',
    shortLabel: 'Eidi & Money Envelopes',
    description: '',
    image: '/eidi/friends-theme/01.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: null,
  },
  {
    id: 'wax-seals',
    slug: 'wax-seals',
    label: 'Wax Seal and Custom Stamps',
    shortLabel: 'Wax Seals & Stamps',
    description: 'Bespoke custom wax seal stamps, monogram sealing kits, and luxury accents.',
    image: '/wax-seals/seal-1/01.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: null,
  },
  {
    id: 'accessories-add-ons',
    slug: 'accessories-add-ons',
    label: 'Premium Add-ons',
    shortLabel: 'Premium Add-ons',
    description: 'Decorative ribbons, gold printing, embossing, vellum paper, envelope liners, belly bands, die-cut inserts, wax seals & gold foiling.',
    image: '/add-ons/gold-foiling/img-01.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: [
      { id: 'sub-ribbon', slug: 'ribbon', label: 'Ribbon', code: 'TPS-ACC-01' },
      { id: 'sub-gold-printing', slug: 'gold-printing', label: 'Gold Printing / Screen Printing', code: 'TPS-ACC-02' },
      { id: 'sub-embossing', slug: 'embossing', label: 'Embossing', code: 'TPS-ACC-03' },
      { id: 'sub-printed-butter', slug: 'printed-butter-vellum-paper', label: 'Printed Butter / Vellum Paper', code: 'TPS-ACC-04' },
      { id: 'sub-envelope-liner', slug: 'envelope-liner', label: 'Envelope Liner', code: 'TPS-ACC-05' },
      { id: 'sub-belly-band', slug: 'belly-band', label: 'Belly Band', code: 'TPS-ACC-06' },
      { id: 'sub-butter-belly-band', slug: 'butter-vellum-paper-belly-band', label: 'Butter / Vellum Paper Belly Band', code: 'TPS-ACC-07' },
      { id: 'sub-arch-shape', slug: 'arch-shape-insert', label: 'Arch Shape Insert', code: 'TPS-ACC-08' },
      { id: 'sub-scalloped', slug: 'scalloped-insert', label: 'Scalloped Insert', code: 'TPS-ACC-09' },
      { id: 'sub-oval', slug: 'oval-insert', label: 'Oval Insert', code: 'TPS-ACC-10' },
      { id: 'sub-wax-seal', slug: 'custom-stamp-wax-seal', label: 'Custom Stamp / Wax Seal', code: 'TPS-ACC-11' },
      { id: 'sub-sticker-seal', slug: 'sticker-seal', label: 'Sticker Seal', code: 'TPS-ACC-12' },
      { id: 'sub-gold-foiling', slug: 'gold-foiling', label: 'Gold Foiling', code: 'TPS-ACC-13' },
    ],
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
  '/vinyl/vinyl-4.jpeg',
]

/** Wedding Invitations — each numbered folder → one product card */
const WEDDING_GALLERY_BASE = [
  {
    name: 'Design 1',
    images: [
      '/wedding-invites/design-1/04.jpg',
      '/wedding-invites/design-1/03.jpg',
      '/wedding-invites/design-1/01.jpg',
      '/wedding-invites/design-1/02.jpg',
      '/wedding-invites/design-1/05.jpg',
    ],
  },
  {
    name: 'Design 2',
    images: [
      '/wedding-invites/design-2/01.jpg',
      '/wedding-invites/design-2/02.jpg',
      '/wedding-invites/design-2/03.jpg',
      '/wedding-invites/design-2/04.jpg',
    ],
  },
  {
    name: 'Design 3',
    images: [
      '/wedding-invites/design-3/02.jpg',
      '/wedding-invites/design-3/03.jpg',
      '/wedding-invites/design-3/01.jpg',
      '/wedding-invites/design-3/04.jpg',
      '/wedding-invites/design-3/05.jpg',
    ],
  },
  {
    name: 'Design 4',
    images: [
      '/wedding-invites/design-4/03.jpg',
      '/wedding-invites/design-4/02.jpg',
      '/wedding-invites/design-4/01.jpg',
      '/wedding-invites/design-4/04.jpg',
      '/wedding-invites/design-4/05.jpg',
    ],
  },
  {
    name: 'Design 5',
    images: [
      '/wedding-invites/design-5/02.jpg',
      '/wedding-invites/design-5/01.jpg',
      '/wedding-invites/design-5/03.jpg',
      '/wedding-invites/design-5/04.jpg',
      '/wedding-invites/design-5/05.jpg',
    ],
  },
  {
    name: 'Design 6',
    images: [
      '/wedding-invites/design-6/02.jpg',
      '/wedding-invites/design-6/01.jpg',
      '/wedding-invites/design-6/03.jpg',
      '/wedding-invites/design-6/04.jpg',
      '/wedding-invites/design-6/05.jpg',
    ],
  },
  {
    name: 'Design 7',
    images: [
      '/wedding-invites/design-7/03.jpg',
      '/wedding-invites/design-7/02.jpg',
      '/wedding-invites/design-7/01.jpg',
      '/wedding-invites/design-7/04.jpg',
      '/wedding-invites/design-7/05.jpg',
    ],
  },
  {
    name: 'Design 8',
    images: [
      '/wedding-invites/design-8/02.jpg',
      '/wedding-invites/design-8/04.jpg',
      '/wedding-invites/design-8/01.jpg',
      '/wedding-invites/design-8/03.jpg',
      '/wedding-invites/design-8/05.jpg',
    ],
  },
  {
    name: 'Design 9',
    images: [
      '/wedding-invites/design-9/01.jpg',
      '/wedding-invites/design-9/02.jpg',
      '/wedding-invites/design-9/03.jpg',
      '/wedding-invites/design-9/04.jpg',
      '/wedding-invites/design-9/05.jpg',
    ],
  },
  {
    name: 'Design 10',
    images: [
      '/wedding-invites/design-10/01.jpg',
      '/wedding-invites/design-10/04.jpg',
      '/wedding-invites/design-10/02.jpg',
      '/wedding-invites/design-10/03.jpg',
      '/wedding-invites/design-10/05.jpg',
    ],
  },
  {
    name: 'Design 11',
    images: [
      '/wedding-invites/design-11/04.jpg',
      '/wedding-invites/design-11/02.jpg',
      '/wedding-invites/design-11/01.jpg',
      '/wedding-invites/design-11/03.jpg',
      '/wedding-invites/design-11/05.jpg',
    ],
  },
  {
    name: 'Design 12',
    images: [
      '/wedding-invites/design-12/02.jpg',
      '/wedding-invites/design-12/01.jpg',
      '/wedding-invites/design-12/03.jpg',
    ],
  },
  {
    name: 'Design 13',
    images: [
      '/wedding-invites/design-13/01.jpg',
    ],
  },
  {
    name: 'Design 14',
    images: [
      '/wedding-invites/design-14/01.jpg',
      '/wedding-invites/design-14/02.jpg',
      '/wedding-invites/design-14/03.jpg',
      '/wedding-invites/design-14/04.jpg',
      '/wedding-invites/design-14/05.jpg',
    ],
  },
  {
    name: 'Design 15',
    images: [
      '/wedding-invites/design-15/02.jpg',
      '/wedding-invites/design-15/01.jpg',
      '/wedding-invites/design-15/03.jpg',
      '/wedding-invites/design-15/04.jpg',
      '/wedding-invites/design-15/05.jpg',
    ],
  },
  {
    name: 'Design 16',
    images: [
      '/wedding-invites/design-16/02.jpg',
      '/wedding-invites/design-16/04.jpg',
      '/wedding-invites/design-16/01.jpg',
      '/wedding-invites/design-16/03.jpg',
      '/wedding-invites/design-16/05.jpg',
    ],
  },
  {
    name: 'Design 17',
    images: [
      '/wedding-invites/design-17/05.jpg',
      '/wedding-invites/design-17/01.jpg',
      '/wedding-invites/design-17/02.jpg',
      '/wedding-invites/design-17/03.jpg',
      '/wedding-invites/design-17/04.jpg',
    ],
  },
  {
    name: 'Design 18',
    images: [
      '/wedding-invites/design-18/03.jpg',
      '/wedding-invites/design-18/02.jpg',
      '/wedding-invites/design-18/01.jpg',
      '/wedding-invites/design-18/04.jpg',
      '/wedding-invites/design-18/05.jpg',
    ],
  },
  {
    name: 'Design 19',
    images: [
      '/wedding-invites/design-19/05.jpg',
      '/wedding-invites/design-19/02.jpg',
      '/wedding-invites/design-19/01.jpg',
      '/wedding-invites/design-19/03.jpg',
      '/wedding-invites/design-19/04.jpg',
    ],
  },
  {
    name: 'Design 20',
    images: [
      '/wedding-invites/design-20/02.jpg',
      '/wedding-invites/design-20/04.jpg',
      '/wedding-invites/design-20/01.jpg',
      '/wedding-invites/design-20/03.jpg',
      '/wedding-invites/design-20/05.jpg',
    ],
  },
  {
    name: 'Design 21',
    images: [
      '/wedding-invites/design-21/01.jpg',
      '/wedding-invites/design-21/04.jpg',
      '/wedding-invites/design-21/02.jpg',
      '/wedding-invites/design-21/03.jpg',
      '/wedding-invites/design-21/05.jpg',
    ],
  },
  {
    name: 'Design 22',
    images: [
      '/wedding-invites/design-22/02.jpg',
      '/wedding-invites/design-22/04.jpg',
      '/wedding-invites/design-22/01.jpg',
      '/wedding-invites/design-22/03.jpg',
      '/wedding-invites/design-22/05.jpg',
    ],
  },
  {
    name: 'Design 23',
    images: [
      '/wedding-invites/design-23/03.jpg',
      '/wedding-invites/design-23/01.jpg',
      '/wedding-invites/design-23/02.jpg',
      '/wedding-invites/design-23/04.jpg',
    ],
  },
  {
    name: 'Design 24',
    images: [
      '/wedding-invites/design-24/04.jpg',
      '/wedding-invites/design-24/02.jpg',
      '/wedding-invites/design-24/01.jpg',
      '/wedding-invites/design-24/03.jpg',
      '/wedding-invites/design-24/05.jpg',
    ],
  },
  {
    name: 'Design 25',
    images: [
      '/wedding-invites/design-25/02.jpg',
      '/wedding-invites/design-25/04.jpg',
      '/wedding-invites/design-25/01.jpg',
      '/wedding-invites/design-25/03.jpg',
      '/wedding-invites/design-25/05.jpg',
    ],
  },
  {
    name: 'Design 26',
    images: [
      '/wedding-invites/design-26/05.jpg',
      '/wedding-invites/design-26/02.jpg',
      '/wedding-invites/design-26/01.jpg',
      '/wedding-invites/design-26/04.jpg',
      '/wedding-invites/design-26/03.jpg',
    ],
  },
]

/** Packaging — dynamically categorized gallery */
function buildPackagingGallery() {
  const stickers = [
    {
      name: 'Design 1',
      images: [
        '/packaging/business-1/01.jpg',
        '/packaging/business-1/02.jpg',
        '/packaging/business-1/03.jpg',
      ],
    },
    {
      name: 'Design 2',
      images: [
        '/packaging/business-2/01.jpg',
        '/packaging/business-2/02.jpg',
        '/packaging/business-2/03.jpg',
        '/packaging/business-2/04.jpg',
        '/packaging/business-2/05.jpg',
        '/packaging/business-2/01.mp4',
      ],
    },
  ];

  const paperBags = [];
  const giftTags = [];
  const businessCards = [];

  for (const item of (importedDesktopGallery?.packaging || [])) {
    const n = item.name.toLowerCase();
    if (n.includes('bag')) {
      paperBags.push(item);
    } else if (n.includes('tag')) {
      giftTags.push(item);
    } else if (n.includes('card') || n.includes('box')) {
      businessCards.push(item);
    } else {
      stickers.push(item);
    }
  }

  return {
    'business-stickers': stickers,
    'paper-bags': paperBags,
    'gift-tags': giftTags,
    'business-cards': businessCards,
  };
}

const PACKAGING_GALLERY = buildPackagingGallery();

/** Favours — keyed by subcategory */
const FAVOURS_GALLERY_BASE = {
  potli: [],
  'box-favours': [
    {
      name: 'Baby Announcement Box',
      images: [
        '/favours/baby-announcement-box/01.jpg',
        '/favours/baby-announcement-box/02.jpg',
        '/favours/baby-announcement-box/03.jpg',
        '/favours/baby-announcement-box/04.jpg',
        '/favours/baby-announcement-box/05.jpg',
        '/favours/baby-announcement-box/06.jpg',
        '/favours/baby-announcement-box/07.jpg',
        '/favours/baby-announcement-box/08.jpg',
      ],
    },
    {
      name: 'Sweet Box with Gift Bags',
      images: [
        '/favours/sweet-box-1/01.jpg',
        '/favours/sweet-box-1/02.jpg',
        '/favours/sweet-box-1/03.jpg',
        '/favours/sweet-box-1/04.jpg',
        '/favours/sweet-box-1/05.jpg',
        '/favours/sweet-box-1/06.jpg',
        '/favours/sweet-box-1/07.jpg',
        '/favours/sweet-box-1/08.jpg',
        '/favours/sweet-box-1/09.jpg',
        '/favours/sweet-box-1/10.jpg',
      ],
    },
  ],
  'tin-favours': [
    {
      name: 'Personalised Golden Round Tin Favour',
      images: [
        '/favours/golden-tin-1/01.jpg',
        '/favours/golden-tin-1/02.jpg',
        '/favours/golden-tin-1/03.jpg',
        '/favours/golden-tin-1/01.mp4',
      ],
    },
    {
      name: 'Golden Round Tin Favour — Rose Gold',
      images: [
        '/favours/golden-tin-2/01.jpg',
        '/favours/golden-tin-2/02.jpg',
        '/favours/golden-tin-2/01.mp4',
      ],
    },
  ],
  'cake-toppers': [
    {
      name: 'Custom Acrylic Wedding Cake Topper',
      images: [
        '/favours/cake-toppers-1/01.jpg',
        '/favours/cake-toppers-1/02.jpg',
        '/favours/cake-toppers-1/03.jpg',
      ],
    },
  ],
}

function mergeWeddingFromTps(base) {
  return base.map((design) => {
    return { ...design, name: seoWeddingName(design) }
  })
}

function mergeFavoursFromTps(base) {
  const tps = tpsDataGallery.favours
  const tpsBoxNames = new Set(tps['box-favours'].map((design) => design.name))
  const withSeo = (design) => ({ ...design, name: seoFavourName(design.name) })
  return {
    potli: (tps.potli.length ? tps.potli : base.potli).map(withSeo),
    'box-favours': [
      ...tps['box-favours'].map(withSeo),
      ...base['box-favours'].filter((design) => !tpsBoxNames.has(design.name)).map(withSeo),
    ],
    'tin-favours': [...tps['tin-favours'], ...base['tin-favours']].map(withSeo),
    'cake-toppers': base['cake-toppers'].map(withSeo),
  }
}

const WEDDING_GALLERY = importedDesktopGallery?.wedding?.length
  ? importedDesktopGallery.wedding.map((design) => ({
      ...design,
      name: seoWeddingName(design),
    }))
  : mergeWeddingFromTps(WEDDING_GALLERY_BASE)
function buildComprehensiveFavours() {
  const base = mergeFavoursFromTps(FAVOURS_GALLERY_BASE);
  const imp = importedDesktopGallery?.favours || {};

  const boxMap = new Map();
  base['box-favours'].forEach((b) => boxMap.set(b.name, b));
  (imp['box-favours'] || []).forEach((b) => {
    boxMap.set(seoFavourName(b.name), { name: seoFavourName(b.name), images: b.images });
  });

  const tinMap = new Map();
  base['tin-favours'].forEach((t) => tinMap.set(t.name, t));
  (imp['tin-favours'] || []).forEach((t) => {
    tinMap.set(seoFavourName(t.name), { name: seoFavourName(t.name), images: t.images });
  });

  return {
    potli: (imp.potli?.length ? imp.potli : base.potli).map((p) => ({ ...p, name: seoFavourName(p.name) })),
    'box-favours': Array.from(boxMap.values()),
    'tin-favours': Array.from(tinMap.values()),
    'cake-toppers': base['cake-toppers'].map((c) => ({ ...c, name: seoFavourName(c.name) })),
    cones: (imp.cones || []).map((c) => ({ name: seoFavourName(c.name), images: c.images })),
    tags: (imp.tags || []).map((t) => ({ name: seoFavourName(t.name), images: t.images })),
  };
}
const FAVOURS_GALLERY = buildComprehensiveFavours()

/** Eidi and Money envelopes */
const EIDI_GALLERY = [
  {
    name: 'F.R.I.E.N.D.S Theme',
    images: [
      '/eidi/friends-theme/01.jpg',
      '/eidi/friends-theme/01.mp4',
      '/eidi/friends-theme/02.mp4',
      '/eidi/friends-theme/03.mp4',
    ],
  },
  ...eidiPostcardsGallery.eidi.designs.map((design) => ({
    name: seoEidiName(design.folder),
    images: design.images,
  })),
  ...(importedDesktopGallery?.extra?.moneyEnvelope1 ? [importedDesktopGallery.extra.moneyEnvelope1] : []),
  ...(importedDesktopGallery?.extra?.moneyEnvelope2 ? [importedDesktopGallery.extra.moneyEnvelope2] : []),
  ...(importedDesktopGallery?.extra?.eidCards ? [importedDesktopGallery.extra.eidCards] : []),
];

/** Post Cards — aesthetic landscape calligraphy set */
const POSTCARDS_GALLERY = [
  {
    name: seoPostcardName(1),
    images: importedDesktopGallery?.eidiCards?.postcards?.[0]?.images?.length
      ? importedDesktopGallery.eidiCards.postcards[0].images
      : eidiPostcardsGallery.postcards.map((card) => card.image),
  },
];

/** ACCESSORIES/ADD ONS catalogue */
export const ACCESSORIES_ADDONS_GALLERY = [
  {
    name: 'Ribbon',
    slug: 'ribbon',
    code: 'TPS-ACC-01',
    description: 'Add a finishing touch to your wedding invitations with decorative ribbons, available in different colours and styles to match your wedding theme.',
    images: [
      '/add-ons/ribbon/img-01.jpg',
      '/add-ons/ribbon/img-02.jpg',
      '/add-ons/ribbon/img-03.jpg',
      '/add-ons/ribbon/img-04.jpg',
      '/add-ons/ribbon/img-05.jpg',
      '/add-ons/ribbon/img-06.jpg',
      '/add-ons/ribbon/img-07.jpg',
      '/add-ons/ribbon/img-08.jpg',
      '/add-ons/ribbon/img-09.jpg',
    ],
  },
  {
    name: 'Gold Printing / Screen Printing',
    slug: 'gold-printing',
    code: 'TPS-ACC-02',
    description: 'Give your wedding cards a subtle metallic finish with gold screen printing, perfect for names, initials, borders and other design details.',
    images: [
      '/add-ons/gold-printing/img-01.jpg',
      '/add-ons/gold-printing/img-02.jpg',
      '/add-ons/gold-printing/video-01.mp4',
      '/add-ons/gold-printing/video-02.mp4',
      '/add-ons/gold-printing/video-03.mp4',
      '/add-ons/gold-printing/video-04.mp4',
      '/add-ons/gold-printing/video-05.mp4',
    ],
  },
  {
    name: 'Embossing',
    slug: 'embossing',
    code: 'TPS-ACC-03',
    description: 'Add texture to your custom wedding stationery with embossed details. This technique creates raised designs, patterns or lettering on paper.',
    images: [
      '/add-ons/embossing/img-01.jpg',
      '/add-ons/embossing/video-01.mp4',
    ],
  },
  {
    name: 'Printed Butter / Vellum Paper',
    slug: 'printed-butter-vellum-paper',
    code: 'TPS-ACC-04',
    description: 'Add a personalised layer to your wedding invitations with printed butter or vellum paper, featuring custom text, patterns or designs.',
    images: [
      '/add-ons/printed-butter-vellum-paper/img-01.jpg',
      '/add-ons/printed-butter-vellum-paper/img-02.jpg',
      '/add-ons/printed-butter-vellum-paper/img-03.jpg',
      '/add-ons/printed-butter-vellum-paper/img-04.jpg',
      '/add-ons/printed-butter-vellum-paper/img-05.jpg',
      '/add-ons/printed-butter-vellum-paper/img-06.jpg',
      '/add-ons/printed-butter-vellum-paper/img-07.jpg',
      '/add-ons/printed-butter-vellum-paper/img-08.jpg',
      '/add-ons/printed-butter-vellum-paper/img-09.jpg',
      '/add-ons/printed-butter-vellum-paper/img-10.jpg',
      '/add-ons/printed-butter-vellum-paper/video-01.mp4',
      '/add-ons/printed-butter-vellum-paper/img-11.jpg',
      '/add-ons/printed-butter-vellum-paper/img-12.jpg',
    ],
  },
  {
    name: 'Envelope Liner',
    slug: 'envelope-liner',
    code: 'TPS-ACC-05',
    description: 'Complete your wedding invitation envelopes with custom printed liners featuring matching patterns, illustrations, monograms or personalised designs.',
    images: [
      '/add-ons/envelope-liner/img-01.jpg',
      '/add-ons/envelope-liner/img-02.jpg',
    ],
  },
  {
    name: 'Belly Band',
    slug: 'belly-band',
    code: 'TPS-ACC-06',
    description: "Keep your wedding invitation cards together with a personalised belly band featuring the couple's names, initials or wedding monogram.",
    images: [
      '/add-ons/name-belly-band/img-01.jpg',
      '/add-ons/name-belly-band/img-02.jpg',
      '/add-ons/name-belly-band/img-03.jpg',
      '/add-ons/name-belly-band/img-04.jpg',
    ],
  },
  {
    name: 'Butter / Vellum Paper Belly Band',
    slug: 'butter-vellum-paper-belly-band',
    code: 'TPS-ACC-07',
    description: 'Wrap your wedding invitation suite in translucent butter or vellum paper, customised with names, initials or printed designs.',
    images: [
      '/add-ons/butter-vellum-belly-band/img-01.jpg',
      '/add-ons/butter-vellum-belly-band/img-02.jpg',
    ],
  },
  {
    name: 'Arch Shape Insert',
    slug: 'arch-shape-insert',
    code: 'TPS-ACC-08',
    description: 'Add an arch-shaped card to your wedding invitation set for event details, additional information or personalised messages.',
    images: [
      '/add-ons/arch-shape-insert/img-01.jpg',
      '/add-ons/arch-shape-insert/img-02.jpg',
      '/add-ons/arch-shape-insert/img-03.jpg',
      '/add-ons/arch-shape-insert/img-04.jpg',
      '/add-ons/arch-shape-insert/img-05.jpg',
    ],
  },
  {
    name: 'Scalloped Insert',
    slug: 'scalloped-insert',
    code: 'TPS-ACC-09',
    description: 'Give your wedding stationery a decorative finish with scalloped-edge inserts, perfect for event details and additional invitation cards.',
    images: [
      '/add-ons/scalloped-insert/img-01.jpg',
      '/add-ons/scalloped-insert/img-02.jpg',
      '/add-ons/scalloped-insert/video-01.mp4',
      '/add-ons/scalloped-insert/img-03.jpg',
      '/add-ons/scalloped-insert/video-02.mp4',
    ],
  },
  {
    name: 'Oval Insert',
    slug: 'oval-insert',
    code: 'TPS-ACC-10',
    description: 'Add an oval-shaped insert to your wedding invitation suite for event details, personalised messages or additional information.',
    images: [
      '/add-ons/oval-insert/img-01.jpg',
      '/add-ons/oval-insert/video-01.mp4',
    ],
  },
  {
    name: 'Custom Stamp / Wax Seal',
    slug: 'custom-stamp-wax-seal',
    code: 'TPS-ACC-11',
    description: 'Personalise your wedding invitations with custom wax seals or stamps featuring your initials, names or wedding monogram.',
    images: [
      '/wax-seals/seal-1/01.jpg',
      '/wax-seals/seal-2/01.jpg',
      '/wax-seals/seal-3/01.jpg',
      '/wax-seals/seal-4/01.jpg',
    ],
  },
  {
    name: 'Sticker Seal',
    slug: 'sticker-seal',
    code: 'TPS-ACC-12',
    description: 'Personalise your wedding envelopes and stationery suites with custom self-adhesive sticker seals featuring your monogram, initials or bespoke illustrations.',
    images: [
      '/add-ons/sticker-seal/img-01.jpg',
      '/add-ons/sticker-seal/img-02.jpg',
      '/add-ons/sticker-seal/img-03.jpg',
      '/add-ons/sticker-seal/img-04.jpg',
      '/add-ons/sticker-seal/img-05.jpg',
      '/add-ons/sticker-seal/video-01.mp4',
    ],
  },
  {
    name: 'Gold Foiling',
    slug: 'gold-foiling',
    code: 'TPS-ACC-13',
    badge: 'Premium Finish',
    description: 'Add a luxurious metallic finish to your wedding invitations with gold foil stamping. Perfect for highlighting names, initials, wedding monograms, borders and other design details.',
    images: [
      '/add-ons/gold-foiling/img-01.jpg',
      '/add-ons/gold-foiling/img-02.jpg',
      '/add-ons/gold-foiling/img-03.jpg',
      '/add-ons/gold-foiling/img-04.jpg',
      '/add-ons/gold-foiling/video-01.mp4',
      '/add-ons/gold-foiling/video-02.mp4',
      '/add-ons/gold-foiling/video-03.mp4',
    ],
  },
];

/** Gifting Envelopes & Tags catalogue */
export const GIFTING_ENVELOPES_TAGS_GALLERY = {
  'gifting-envelopes': [
    ...EIDI_GALLERY,
  ],
  'gift-tags': [
    {
      name: 'Artisan Foil Gift Tags',
      images: ['/packaging/paper-bags-design-1/01.jpg', '/real-moments/moment-05.jpg'],
    },
    {
      name: 'Monogrammed Botanical Gift Tags',
      images: ['/real-moments/moment-04.jpg', '/real-moments/moment-06.jpg'],
    },
    {
      name: 'Celebratory Ribbon & Event Tag Set',
      images: ['/real-moments/moment-11.jpg', '/real-moments/moment-02.jpg'],
    },
  ],
  'custom-stationery': [
    {
      name: 'Personalized Monogram Stationery Suite',
      images: ['/stationary/diaries/01-01.jpg', '/stationary/diaries/01-02.jpg'],
    },
    {
      name: 'Bespoke Luxury Correspondence Notecards',
      images: ['/stationary/diaries/02-01.jpg', '/stationary/diaries/03-01.jpg'],
    },
    {
      name: 'Handcrafted Letterhead & Envelope Set',
      images: ['/stationary/diaries/04-01.jpg', '/real-moments/moment-09.jpg'],
    },
  ],
};

/** Greeting Cards gallery */
export const GREETING_CARDS_GALLERY = {
  'all-cards': [
    {
      name: 'Artisan Eid Calligraphy Greeting Cards',
      images: ['/greeting/eid-cards/01.jpg', '/greeting/eid-cards/02.jpg'],
    },
    {
      name: 'Botanical Celebration Keepsake Card',
      images: ['/postcards/01.jpg', '/postcards/02.jpg'],
    },
    {
      name: 'Floral Blossom Greeting Card',
      images: ['/postcards/03.jpg', '/postcards/04.jpg'],
    },
  ],
  'birthday-cards': [
    {
      name: 'Pastel Floral Happy Birthday Card',
      images: ['/postcards/01.jpg', '/postcards/02.jpg'],
    },
    {
      name: 'Golden Confetti Birthday Keepsake Card',
      images: ['/postcards/03.jpg'],
    },
  ],
  'for-mothers': [
    {
      name: "Blush Roses Mother's Day Keepsake Card",
      images: ['/postcards/02.jpg', '/greeting/eid-cards/01.jpg'],
    },
    {
      name: "Timeless Gratitude Card for Mother",
      images: ['/postcards/04.jpg'],
    },
  ],
  'for-fathers': [
    {
      name: "Regal Navy & Gold Father's Day Card",
      images: ['/postcards/01.jpg', '/postcards/03.jpg'],
    },
    {
      name: "Classic Heritage Keepsake Card for Father",
      images: ['/postcards/04.jpg'],
    },
  ],
};

/** Ramadan & Eid Gifts catalogue */
export const RAMADAN_EID_GALLERY = [
  {
    name: 'Ramadan Kareem Daily Countdown Calendar',
    images: [
      '/stationary/ramadan-calendar/01.jpg',
      '/stationary/ramadan-calendar/02.jpg',
      '/stationary/ramadan-calendar/03.jpg',
    ],
  },
  {
    name: 'Artisan Ramadan & Eid Keepsake Hamper',
    images: ['/stationary/ramadan-calendar/01.jpg', '/eidi/friends-theme/01.jpg'],
  },
  {
    name: 'Luxury Eid Mubarak Money & Gifting Suite',
    images: ['/eidi/friends-theme/01.jpg', '/greeting/eid-cards/01.jpg'],
  },
];

/** Each numbered folder becomes one product card with a gallery slider */
const NIKKAH_GALLERY_PRODUCTS = {
  'hand-painted': [
    {
      name: 'Hand-Painted Floral Nikkah Certificate',
      code: 'TPS-NC-01',
      sku: 'TPS-NC-01',
      designNumber: 1,
      minQuantity: 1,
      specifications: [
        { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
        { label: 'Material', value: 'Archival Heavyweight Textured Cotton Card (360–400 GSM)' },
        { label: 'Presentation Folder', value: 'Signature Protective Velvet Keepsake Folder' },
        { label: 'Printing Technique', value: 'Original Hand-Painted Watercolor & Traditional Arabic Calligraphy' },
      ],
      images: [
        '/nikkah/hand-painted-1/01.jpg',
        '/nikkah/hand-painted-1/02.jpg',
        '/nikkah/hand-painted-1/03.jpg',
        '/nikkah/hand-painted-1/04.jpg',
        '/nikkah/hand-painted-1/05.jpg',
        '/nikkah/hand-painted-1/06.jpg',
        '/nikkah/hand-painted-1/07.jpg',
        '/nikkah/hand-painted-1/08.jpg',
        '/nikkah/hand-painted-1/09.jpg',
        '/nikkah/hand-painted-1/10.jpg',
        '/nikkah/hand-painted-1/11.jpg',
        '/nikkah/hand-painted-1/12.jpg',
        '/nikkah/hand-painted-1/13.jpg',
        '/nikkah/hand-painted-1/14.jpg',
        '/nikkah/hand-painted-1/01.mp4',
        '/nikkah/hand-painted-1/02.mp4',
        '/nikkah/hand-painted-1/03.mp4',
        '/nikkah/hand-painted-1/04.mp4',
      ],
    },
  ],
  printed: [
    {
      name: 'Classic Floral Printed Nikkah Certificate',
      code: 'TPS-NC-02',
      sku: 'TPS-NC-02',
      designNumber: 2,
      minQuantity: 1,
      specifications: [
        { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
        { label: 'Material', value: '9K Archival Textured Card (350 GSM)' },
        { label: 'Presentation Folder', value: 'Protective Luxury Keepsake Folder' },
        { label: 'Printing Technique', value: 'High-Definition Archival Pigment Printing' },
      ],
      images: [
        '/nikkah/printed-1/01.jpg',
        '/nikkah/printed-1/02.jpg',
        '/nikkah/printed-1/03.jpg',
        '/nikkah/printed-1/04.jpg',
        '/nikkah/printed-1/05.jpg',
        '/nikkah/printed-1/01.mp4',
      ],
    },
    {
      name: 'Minimal Printed Nikkah Certificate',
      code: 'TPS-NC-03',
      sku: 'TPS-NC-03',
      designNumber: 3,
      minQuantity: 1,
      specifications: [
        { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
        { label: 'Material', value: 'Warm Off-White Cotton Felt Card (320–350 GSM)' },
        { label: 'Presentation Folder', value: 'Sleek Signature Certificate Sleeve' },
        { label: 'Printing Technique', value: 'Fine Line Digital Archival Print' },
      ],
      images: [
        '/nikkah/printed-2/01.jpg',
        '/nikkah/printed-2/02.jpg',
        '/nikkah/printed-2/03.jpg',
      ],
    },
    {
      name: 'Modern Printed Nikkah Certificate Card',
      code: 'TPS-NC-04',
      sku: 'TPS-NC-04',
      designNumber: 4,
      minQuantity: 1,
      specifications: [
        { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
        { label: 'Material', value: 'Premium Textured Matte Card (350 GSM)' },
        { label: 'Presentation Folder', value: 'Keepsake Hardcover Folder' },
        { label: 'Printing Technique', value: 'Precision Archival Print with Gold Accents' },
      ],
      images: ['/nikkah/printed-3/01.mp4'],
    },
    {
      name: 'Elegant Printed Nikkah Certificate',
      code: 'TPS-NC-05',
      sku: 'TPS-NC-05',
      designNumber: 5,
      minQuantity: 1,
      specifications: [
        { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
        { label: 'Material', value: 'Premium Heavy Textured Card (350 GSM)' },
        { label: 'Presentation Folder', value: 'Deluxe Velvet Presentation Folder' },
        { label: 'Printing Technique', value: 'High-Resolution Archival Digital Printing' },
      ],
      images: ['/nikkah/printed-4/01.jpg'],
    },
    {
      name: 'Gold Border Printed Nikkah Certificate',
      code: 'TPS-NC-06',
      sku: 'TPS-NC-06',
      designNumber: 6,
      minQuantity: 1,
      specifications: [
        { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
        { label: 'Material', value: 'Heavyweight Pearl Archival Stock (360 GSM)' },
        { label: 'Presentation Folder', value: 'Luxury Golden Ribbon Keepsake Folder' },
        { label: 'Printing Technique', value: 'Archival Print with Gilded Gold Foil Border' },
      ],
      images: [
        '/nikkah/printed-5/01.jpg',
        '/nikkah/printed-5/02.jpg',
        '/nikkah/printed-5/01.mp4',
      ],
    },
    {
      name: 'Custom Calligraphy Nikkah Certificate',
      code: 'TPS-NC-07',
      sku: 'TPS-NC-07',
      designNumber: 7,
      minQuantity: 1,
      specifications: [
        { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
        { label: 'Material', value: '9K Textured Archival Card (350 GSM)' },
        { label: 'Presentation Folder', value: 'Signature Hardcover Keepsake Folder' },
        { label: 'Printing Technique', value: 'Custom Calligraphy & Archival Pigment Print' },
      ],
      images: [
        '/nikkah/printed-custom/01.jpg',
        '/nikkah/printed-custom/02.jpg',
        '/nikkah/printed-custom/03.jpg',
        '/nikkah/printed-custom/04.jpg',
      ],
    },
    {
      name: 'Islamic Calligraphy Nikkah Certificate Suite',
      code: 'TPS-NC-08',
      sku: 'TPS-NC-08',
      designNumber: 8,
      minQuantity: 1,
      specifications: [
        { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
        { label: 'Material', value: 'Antique Ivory Deckled Cotton Card (360 GSM)' },
        { label: 'Presentation Folder', value: 'Regal Certificate Folder with Ribbon Tie' },
        { label: 'Printing Technique', value: 'Illuminated Archival Print with Gold Accents' },
      ],
      images: [
        '/nikkah/calligraphy-certificate/01.jpg',
        '/nikkah/calligraphy-certificate/02.jpg',
        '/nikkah/calligraphy-certificate/03.jpg',
      ],
    },
    {
      name: 'Royal Gold Foil Floral Nikkah Certificate',
      code: 'TPS-NC-09',
      sku: 'TPS-NC-09',
      designNumber: 9,
      minQuantity: 1,
      specifications: [
        { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
        { label: 'Material', value: '9K Textured Archival Cotton Card (380 GSM)' },
        { label: 'Presentation Folder', value: 'Luxury Velvet Presentation Mount' },
        { label: 'Printing Technique', value: 'Raised Metallic Gold Foil Stamping & Archival Print' },
      ],
      images: [
        '/nikkah/printed-6/01.jpg',
        '/nikkah/printed-6/02.jpg',
        '/nikkah/printed-6/03.jpg',
        '/nikkah/printed-6/04.jpg',
      ],
    },
  ],
}

export const PAMPHLETS_GALLERY = Array.from({ length: 16 }, (_, i) => {
  const num = i + 1
  const numStr = String(num).padStart(2, '0')
  return {
    designNumber: num,
    name: SEO_PAMPHLET[num] || `Printed Pamphlet Design ${num}`,
    images: [`/pamphlets/pamphlet-${numStr}.jpg`],
  }
})

function addStationaryProducts({
  categorySlug,
  subcategorySlug,
  items,
  whatsappLabel,
  categoryLabel,
}) {
  return items.map((item) => ({
    id: productId++,
    name: subcategorySlug === 'diaries' ? seoDiaryName(item) : item.name,
    category: categoryLabel,
    categorySlug,
    subcategorySlug,
    typeSlug: null,
    image: item.image,
    images: item.images?.length ? item.images : null,
    showPrice: true,
    price: item.price,
    priceNote: item.priceNote ?? null,
    paymentType: 'advance',
    whatsappMode: 'more',
    whatsappLabel,
    orderOnline: true,
  }))
}

function parseDesignNum(name, fallback = 1) {
  const match = String(name || '').match(/Design\s+(\d+)/i)
  return match ? Number(match[1]) : fallback
}

function resolveSeoDesignName({ name, categorySlug, subcategorySlug, typeSlug, designNum, galleryImages }) {
  if (categorySlug === 'favours' && name) {
    return seoFavourName(name)
  }
  if (categorySlug !== 'wedding-invitations' && name && !/^Design \d+$/i.test(name)) {
    return name;
  }
  const num =
    designNum ??
    (galleryImages?.length ? weddingDesignNumber(galleryImages) : null) ??
    parseDesignNum(name, 1)

  if (categorySlug === 'wedding-invitations') {
    return seoWeddingName(galleryImages?.length ? { images: galleryImages } : { images: [`/wedding-invites/design-${num}/01.jpg`] })
  }
  if (categorySlug === 'digital-invitations') {
    return seoDigitalName(subcategorySlug, typeSlug, num) || name || `Design ${num}`
  }
  if (categorySlug === 'nikkahnama') {
    return seoNikkahName(subcategorySlug, num) || name || `Design ${num}`
  }
  if (categorySlug === 'packaging') {
    return seoPackagingName(subcategorySlug, num) || name || `Design ${num}`
  }
  if (categorySlug === 'vinyl-stickers') {
    return seoVinylName(num) || name || `Design ${num}`
  }
  if (categorySlug === 'greeting-cards') {
    return seoGreetingName(num) || name || `Design ${num}`
  }
  if (categorySlug === 'pamphlets') {
    return seoPamphletName(num) || name || `Design ${num}`
  }
  if (categorySlug === 'favours' && name) {
    return seoFavourName(name)
  }
  if (categorySlug === 'eidi-envelopes' && name) {
    return SEO_EIDI[name] || name
  }
  if (categorySlug === 'post-cards' && name) {
    return name
  }
  return name || `Design ${num}`
}

function addDesigns({
  name,
  code,
  sku,
  designNumber,
  minQuantity,
  specifications,
  categoryLabel,
  categorySlug,
  subcategorySlug,
  typeSlug,
  image,
  images,
  galleryImages,
  count = 1,
  showPrice,
  priceBase = 500,
  paymentType = 'direct',
  whatsappMode = 'price',
  whatsappLabel,
}) {
  if (galleryImages?.length) {
    const designNum = designNumber ?? weddingDesignNumber(galleryImages) ?? parseDesignNum(name, 1)
    const baseObj = { categorySlug, subcategorySlug: subcategorySlug || null, typeSlug: typeSlug || null }
    const resolvedCode = code || sku || getProductCode(baseObj, designNum)
    return [
      {
        id: productId++,
        code: resolvedCode,
        sku: sku || resolvedCode,
        designNumber: designNum,
        name: resolveSeoDesignName({ name, categorySlug, subcategorySlug, typeSlug, designNum, galleryImages }),
        category: categoryLabel,
        categorySlug,
        subcategorySlug: subcategorySlug || null,
        typeSlug: typeSlug || null,
        image: galleryImages[0],
        images: galleryImages,
        description: getProductDescription(baseObj, designNum),
        specifications: specifications || (categorySlug === 'nikkahnama' ? [
          { label: 'Certificate Size', value: 'A3 (11.7 × 16.5 inches)' },
          { label: 'Material', value: 'Archival Heavyweight Textured Cotton Card (360–400 GSM)' },
          { label: 'Presentation Folder', value: 'Signature Protective Velvet Keepsake Folder' },
          { label: 'Printing Technique', value: 'Original Hand-Painted & Traditional Islamic Calligraphy' },
        ] : undefined),
        minQuantity: minQuantity ?? (categorySlug === 'nikkahnama' ? 1 : 25),
        whatsIncluded: getProductWhatsIncluded(baseObj, designNum),
        seoKeywords: getProductSeoKeywords(baseObj, designNum),
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
    const baseObj = { categorySlug, subcategorySlug: subcategorySlug || null, typeSlug: typeSlug || null }
    return {
      id: productId++,
      code: getProductCode(baseObj, designNum),
      designNumber: designNum,
      name: resolveSeoDesignName({ name, categorySlug, subcategorySlug, typeSlug, designNum }),
      category: categoryLabel,
      categorySlug,
      subcategorySlug: subcategorySlug || null,
      typeSlug: typeSlug || null,
      image: images?.[i] || image,
      images: null,
      description: getProductDescription(baseObj, designNum),
      whatsIncluded: getProductWhatsIncluded(baseObj, designNum),
      seoKeywords: getProductSeoKeywords(baseObj, designNum),
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
    if (cat.slug === 'accessories-add-ons') {
      for (const item of ACCESSORIES_ADDONS_GALLERY) {
        // One product per add-on type — all photos/videos go into the gallery slider
        all.push({
          id: `prod-acc-${item.code.toLowerCase()}`,
          designNumber: 1,
          code: item.code,
          altCode: item.code,
          sku: item.code,
          slug: item.slug,
          name: item.name,
          category: cat.label,
          categorySlug: cat.slug,
          subcategorySlug: item.slug,
          typeSlug: null,
          image: item.images[0],
          images: item.images,
          imageCount: item.images.length,
          showPrice: false,
          paymentType: 'advance',
          whatsappMode: 'price',
          whatsappLabel: 'Premium Add-ons',
          description: item.description,
          badge: item.badge || null,
        })
      }
      continue
    }

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
                code: design.code,
                sku: design.sku,
                designNumber: design.designNumber,
                minQuantity: design.minQuantity || 1,
                specifications: design.specifications,
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

        if (cat.slug === 'gifting-envelopes-tags' && GIFTING_ENVELOPES_TAGS_GALLERY[sub.slug]) {
          for (const design of GIFTING_ENVELOPES_TAGS_GALLERY[sub.slug]) {
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

        if (cat.slug === 'greeting-cards' && GREETING_CARDS_GALLERY[sub.slug]) {
          for (const design of GREETING_CARDS_GALLERY[sub.slug]) {
            all.push(
              ...addDesigns({
                categorySlug: cat.slug,
                subcategorySlug: sub.slug,
                whatsappLabel: sub.whatsappPrefix,
                galleryImages: design.images,
                name: design.name,
                showPrice: true,
                priceBase: 650,
                paymentType: cat.paymentType,
                whatsappMode: cat.whatsappMode,
                categoryLabel: cat.label,
              })
            )
          }
          continue
        }

        if (cat.slug === 'packaging' && PACKAGING_GALLERY[sub.slug]) {
          for (const design of PACKAGING_GALLERY[sub.slug]) {
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

        if (cat.slug === 'favours' && Object.prototype.hasOwnProperty.call(FAVOURS_GALLERY, sub.slug)) {
          const designs = FAVOURS_GALLERY[sub.slug]
          if (!designs.length) continue
          for (const design of designs) {
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

        if (cat.slug === 'stationary-items' && stationaryGallery[sub.slug]?.length) {
          all.push(
            ...addStationaryProducts({
              categorySlug: cat.slug,
              subcategorySlug: sub.slug,
              items: stationaryGallery[sub.slug],
              whatsappLabel: sub.whatsappPrefix,
              categoryLabel: cat.label,
            })
          )
          continue
        }

        // Skip empty subcategories (e.g. cake-boxes) until real photos are imported
        if (!sub.types?.length) continue

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
    } else if (cat.slug === 'eidi-envelopes') {
      for (const design of EIDI_GALLERY) {
        all.push(
          ...addDesigns({
            categorySlug: cat.slug,
            whatsappLabel: 'Eidi Envelope',
            galleryImages: design.images,
            name: design.name,
            showPrice: cat.showPrice,
            priceBase: 1500,
            paymentType: cat.paymentType,
            whatsappMode: cat.whatsappMode,
            categoryLabel: cat.label,
          })
        )
      }
    } else if (cat.slug === 'post-cards') {
      for (const design of POSTCARDS_GALLERY) {
        all.push(
          ...addDesigns({
            categorySlug: cat.slug,
            whatsappLabel: 'Post Card',
            galleryImages: design.images,
            name: design.name,
            showPrice: cat.showPrice,
            priceBase: 0,
            paymentType: cat.paymentType,
            whatsappMode: cat.whatsappMode,
            categoryLabel: cat.label,
          })
        )
      }
    } else if (cat.slug === 'ramadan-eid-gifts') {
      for (const design of RAMADAN_EID_GALLERY) {
        all.push(
          ...addDesigns({
            categorySlug: cat.slug,
            whatsappLabel: 'Ramadan & Eid Gifts',
            galleryImages: design.images,
            name: design.name,
            showPrice: cat.showPrice,
            priceBase: 2500,
            paymentType: cat.paymentType,
            whatsappMode: cat.whatsappMode,
            categoryLabel: cat.label,
          })
        )
      }
      continue;
    } else if (cat.slug === 'wax-seals') {
      const seals = importedDesktopGallery?.waxSeals || [
        { name: 'Custom Wax Seal - Collection 1', images: ['/wax-seals/seal-1/01.jpg'] },
        { name: 'Custom Wax Seal - Collection 2', images: ['/wax-seals/seal-2/01.jpg'] },
        { name: 'Custom Wax Seal - Collection 3', images: ['/wax-seals/seal-3/01.jpg'] },
      ];
      for (const seal of seals) {
        all.push({
          id: productId++,
          name: seal.name,
          category: cat.label,
          categorySlug: cat.slug,
          subcategorySlug: null,
          typeSlug: null,
          image: seal.images[0],
          images: seal.images,
          showPrice: false,
          paymentType: 'advance',
          whatsappMode: 'price',
          whatsappLabel: 'Wax Seal and Custom Stamps',
        });
      }
      continue;
    }

    if (cat.slug === 'pamphlets') {
      for (const design of PAMPHLETS_GALLERY) {
        all.push(
          ...addDesigns({
            categorySlug: cat.slug,
            whatsappLabel: 'Printed Pamphlet',
            galleryImages: design.images,
            name: design.name,
            showPrice: cat.showPrice,
            priceBase: 0,
            paymentType: cat.paymentType,
            whatsappMode: cat.whatsappMode,
            categoryLabel: cat.label,
            designNum: design.designNumber,
          })
        )
      }
      continue;
    }

    if (cat.slug === 'wedding-invitations') {
      for (const design of WEDDING_GALLERY) {
        all.push(
          ...addDesigns({
            categorySlug: cat.slug,
            whatsappLabel: 'Wedding Invitation',
            galleryImages: design.images,
            name: design.name,
            showPrice: cat.showPrice,
            priceBase: 0,
            paymentType: cat.paymentType,
            whatsappMode: cat.whatsappMode,
            categoryLabel: cat.label,
          })
        )
      }
    }
    // Skip placeholder products (boxes / greeting-cards) until real photos are added
  }

  const categoryCounters = {}
  return all
    .filter((product) => {
      if (!product?.image) return false
      // Drop stock Unsplash fillers that aren't real catalog photos
      if (String(product.image).includes('images.unsplash.com')) return false
      return true
    })
    .map((product) => {
      const slug = product.categorySlug || 'wedding-invitations'
      categoryCounters[slug] = (categoryCounters[slug] || 0) + 1
      const initial = CATEGORY_INITIALS[slug] || 'WI'

      let designNum
      let code
      if (slug === 'wedding-invitations') {
        designNum = product.designNumber || categoryCounters[slug]
        code = `TPS-WI-${String(designNum).padStart(2, '0')}`
      } else {
        designNum = categoryCounters[slug]
        code = `TPS-${initial}-${String(designNum).padStart(2, '0')}`
      }

      const baseObj = { ...product, code, designNumber: designNum }
      return {
        ...product,
        code,
        sku: code,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        designNumber: designNum,
        description: product.description || getProductDescription(baseObj, designNum),
        whatsIncluded: getProductWhatsIncluded(baseObj, designNum),
        seoKeywords: getProductSeoKeywords(baseObj, designNum),
      }
    })
}

export const products = buildAllProducts()
export const categories = shopCategories

export function getAllSitemapPaths() {
  const paths = new Set(['/', '/about', '/contact', '/shop', '/shipping', '/cart'])

  for (const cat of shopCategories) {
    paths.add(`/shop/${cat.slug}`)

    for (const sub of cat.subcategories || []) {
      paths.add(`/shop/${cat.slug}/${sub.slug}`)

      for (const type of sub.types || []) {
        paths.add(`/shop/${cat.slug}/${sub.slug}/${type.slug}`)
      }
    }
  }

  for (const p of products) {
    const code = p.code || p.sku || p.id
    if (code) {
      paths.add(`/product/${encodeURIComponent(code)}`)
    }
  }

  return [...paths]
}

const GET_CUSTOMISED_WEDDING = {
  id: 'get-customised-wedding',
  name: 'Get Customised',
  category: 'Wedding Invitations',
  categorySlug: 'wedding-invitations',
  subcategorySlug: null,
  typeSlug: null,
  image: '/wedding-invites/get-customised.mp4',
  showPrice: false,
  price: null,
  paymentType: 'advance',
  whatsappMode: 'price',
  whatsappLabel: 'Wedding Invitation — Get Customised',
}

const GET_CUSTOMISED_DIGITAL = {
  id: 'get-customised-digital',
  name: 'Get Customised',
  category: 'Digital Invitations',
  categorySlug: 'digital-invitations',
  subcategorySlug: null,
  typeSlug: null,
  image: '/e-invites/get-customised.png',
  showPrice: false,
  price: null,
  paymentType: 'advance',
  whatsappMode: 'price',
  whatsappLabel: 'Digital Invitation — Get Customised',
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
  'printed-without-frame': 'printed',
  'printed-with-frame': 'printed',
}

export function getFeaturedProducts() {
  const weddingInvite = products.find((p) => p.categorySlug === 'wedding-invitations')
  const nikkahnama = products.find((p) => p.categorySlug === 'nikkahnama')
  const seal = products.find((p) => p.categorySlug === 'wax-seals')
  const potli =
    products.find((p) => p.categorySlug === 'favours' && p.subcategorySlug === 'potli') ||
    products.find((p) => p.categorySlug === 'favours')

  return [weddingInvite, nikkahnama, seal, potli].filter(Boolean)
}

export function getBestSellers(catalog = products) {
  const pool = (catalog && catalog.length > 0) ? catalog : products
  const selected = [
    // 1. Wedding Invitations (2 top distinct luxury suites)
    pool.find((p) => p.categorySlug === 'wedding-invitations' && p.designNumber === 1),
    pool.find((p) => p.categorySlug === 'wedding-invitations' && p.designNumber === 8),
    // 2. Digital E-Invites
    pool.find((p) => p.categorySlug === 'digital-invitations' && p.typeSlug === 'wedding' && p.designNumber === 1),
    // 3. Nikkah Certificates (2 completely distinct styles)
    pool.find((p) => p.categorySlug === 'nikkahnama' && p.name && p.name.includes('Islamic Calligraphy')) ||
      pool.find((p) => p.categorySlug === 'nikkahnama' && p.subcategorySlug === 'printed'),
    pool.find((p) => p.categorySlug === 'nikkahnama' && p.subcategorySlug === 'hand-painted'),
    // 4. Favours (3 completely distinct styles: Baby Gift Box, Sweet Box with Bag, and Metallic Tin)
    pool.find((p) => p.categorySlug === 'favours' && p.name && (p.name.includes('Baby Announcement') || p.name.includes('Teddy'))),
    pool.find((p) => p.categorySlug === 'favours' && p.name && (p.name.includes('Royal Heritage') || p.name.includes('Sweet Box'))),
    pool.find((p) => p.categorySlug === 'favours' && p.name && (p.name.includes('Golden Tin') || p.name.includes('Round Tin'))),
    // 5. Packaging (Brand stickers & Custom cards)
    pool.find((p) => p.categorySlug === 'packaging' && p.subcategorySlug === 'business-stickers' && p.designNumber === 1),
    pool.find((p) => p.categorySlug === 'packaging' && p.subcategorySlug === 'business-stickers' && p.designNumber === 2),
    // 6. Vinyl Stickers
    pool.find((p) => p.categorySlug === 'vinyl-stickers' && p.designNumber === 1),
    // 7. Premium Add-on / Wax Seals
    pool.find((p) => p.categorySlug === 'accessories-add-ons' && p.slug === 'gold-foiling') ||
      pool.find((p) => p.categorySlug === 'wax-seals' && p.designNumber === 1),
  ].filter(Boolean)

  const seenIds = new Set()
  return selected.filter((p) => {
    if (seenIds.has(p.id)) return false
    seenIds.add(p.id)
    return true
  })
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

export function getProductsByCategory(categorySlug, subcategorySlug = null, typeSlug = null, catalog = products) {
  const pool = (catalog && catalog.length > 0) ? catalog : products
  const normalizedCategory = normalizeCategorySlug(categorySlug)
  const normalizedSub = subcategorySlug ? normalizeSubcategorySlug(subcategorySlug) : null

  const list = pool.filter((p) => {
    if (p.categorySlug !== normalizedCategory) return false
    if (normalizedSub && p.subcategorySlug !== normalizedSub) return false
    if (typeSlug && p.typeSlug !== typeSlug) return false
    return true
  })

  if (normalizedCategory === 'wedding-invitations' && !normalizedSub) {
    return [...list, GET_CUSTOMISED_WEDDING]
  }

  if (normalizedCategory !== 'digital-invitations') return list

  if (normalizedSub === 'image-invitation') {
    if (typeSlug === 'wedding' || !typeSlug) {
      return [...list, WEBSITE_WEDDING_INVITE, GET_CUSTOMISED_DIGITAL]
    }
    return [...list, GET_CUSTOMISED_DIGITAL]
  }
  if (normalizedSub === 'animated-invitation') {
    return [...list, GET_CUSTOMISED_DIGITAL]
  }
  if (!normalizedSub) {
    return [...list, WEBSITE_WEDDING_INVITE, GET_CUSTOMISED_DIGITAL]
  }

  return list
}
