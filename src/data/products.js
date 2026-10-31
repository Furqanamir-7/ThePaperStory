import stationaryGallery from './stationary-gallery.json' with { type: 'json' }
import importedDesktopGallery from './imported-desktop-gallery.json' with { type: 'json' }
import tpsDataGallery from './tps-data-gallery.json' with { type: 'json' }
import eidiPostcardsGallery from './eidi-postcards-gallery.json' with { type: 'json' }
import {
  SEO_EIDI,
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
    id: 'wax-seals',
    slug: 'wax-seals',
    label: 'Customised Wax Seals',
    shortLabel: 'Wax Seals',
    description: 'Bespoke custom wax seal stamps, monogram sealing kits, and luxury accents.',
    image: '/wax-seals/seal-1/01.jpg',
    showPrice: false,
    paymentType: 'advance',
    whatsappMode: 'price',
    subcategories: null,
  },
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
      { slug: 'printed', label: 'Printed', whatsappPrefix: 'Nikkah Certificates (Printed)' },
    ],
  },
  {
    id: 'favours',
    slug: 'favours',
    label: 'Favours',
    shortLabel: 'Favours',
    description: 'Potli, box, tin, and cake-topper favours for weddings and events.',
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
    id: 'packaging',
    slug: 'packaging',
    label: 'Packaging Material / Items',
    shortLabel: 'Packaging',
    description: 'Bespoke custom packaging, luxury paper bags, artisan gift tags, and business stickers for branding.',
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
    label: 'Stationary Items',
    shortLabel: 'Stationary',
    description:
      'Diaries and pens — order directly on the website. Complete payment online for free delivery within Pakistan.',
    image: '/stationary/diaries/01-01.jpg',
    showPrice: true,
    paymentType: 'cod',
    whatsappMode: 'more',
    subcategories: [
      { slug: 'diaries', label: 'Diaries', whatsappPrefix: 'Stationary (Diaries)' },
      { slug: 'pens', label: 'Pens', whatsappPrefix: 'Stationary (Pens)' },
      { slug: 'ramadan-calendar', label: 'Ramadan Calendar', whatsappPrefix: 'Stationary (Ramadan Calendar)' },
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
    'cake-toppers': base['cake-toppers'],
    cones: (imp.cones || []).map((c) => ({ name: c.name, images: c.images })),
    tags: (imp.tags || []).map((t) => ({ name: t.name, images: t.images })),
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

/** Each numbered folder becomes one product card with a gallery slider */
const NIKKAH_GALLERY_PRODUCTS = {
  'hand-painted': [
    {
      name: 'Design 1',
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
      name: 'Design 1',
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
      name: 'Design 2',
      images: [
        '/nikkah/printed-2/01.jpg',
        '/nikkah/printed-2/02.jpg',
        '/nikkah/printed-2/03.jpg',
      ],
    },
    {
      name: 'Design 3',
      images: ['/nikkah/printed-3/01.mp4'],
    },
    {
      name: 'Design 4',
      images: ['/nikkah/printed-4/01.jpg'],
    },
    {
      name: 'Design 5',
      images: [
        '/nikkah/printed-5/01.jpg',
        '/nikkah/printed-5/02.jpg',
        '/nikkah/printed-5/01.mp4',
      ],
    },
    ...(importedDesktopGallery?.nikkahnama || []).map((n) => ({
      name: n.name,
      images: n.images,
    })),
  ],
}

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
    const designNum = weddingDesignNumber(galleryImages) ?? parseDesignNum(name, 1)
    return [
      {
        id: productId++,
        name: resolveSeoDesignName({ name, categorySlug, subcategorySlug, typeSlug, designNum, galleryImages }),
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
      name: resolveSeoDesignName({ name, categorySlug, subcategorySlug, typeSlug, designNum }),
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
          whatsappLabel: 'Customised Wax Seals',
        });
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
    // Skip placeholder products (boxes / pamphlets / greeting-cards) until real photos are added
  }

  return all.filter((product) => {
    if (!product?.image) return false
    // Drop stock Unsplash fillers that aren't real catalog photos
    if (String(product.image).includes('images.unsplash.com')) return false
    return true
  })
}

export const products = buildAllProducts()
export const categories = shopCategories

export function getAllSitemapPaths() {
  const paths = new Set(['/', '/about', '/contact', '/shop', '/cart'])

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
  const picks = [
    { categorySlug: 'wedding-invitations', design: 1 },
    { categorySlug: 'digital-invitations', subcategorySlug: 'image-invitation', typeSlug: 'wedding', design: 1 },
    { categorySlug: 'stationary-items', subcategorySlug: 'diaries', design: 1 },
    { categorySlug: 'stationary-items', subcategorySlug: 'pens', name: 'Cute Hello Kitty Printed Gel Pen' },
  ]

  return picks
    .map(({ categorySlug, subcategorySlug, typeSlug, design, name }) =>
      products.find(
        (product) =>
          product.categorySlug === categorySlug &&
          product.subcategorySlug === (subcategorySlug ?? null) &&
          (typeSlug == null || product.typeSlug === typeSlug) &&
          product.name === seoPickName(categorySlug, { subcategorySlug, typeSlug, design, name })
      )
    )
    .filter(Boolean)
}

export function getBestSellers() {
  const picks = [
    { categorySlug: 'wedding-invitations', design: 1 },
    { categorySlug: 'wedding-invitations', design: 8 },
    { categorySlug: 'digital-invitations', subcategorySlug: 'image-invitation', typeSlug: 'wedding', design: 1 },
    { categorySlug: 'nikkahnama', subcategorySlug: 'hand-painted', design: 1 },
    { categorySlug: 'nikkahnama', subcategorySlug: 'printed', design: 1 },
    { categorySlug: 'favours', subcategorySlug: 'box-favours', name: 'Baby Announcement Box' },
    { categorySlug: 'favours', subcategorySlug: 'box-favours', name: 'Sweet Box with Gift Bags' },
    { categorySlug: 'favours', subcategorySlug: 'tin-favours', design: 1 },
    { categorySlug: 'packaging', subcategorySlug: 'business-stickers', design: 1 },
    { categorySlug: 'packaging', subcategorySlug: 'business-stickers', design: 2 },
    { categorySlug: 'vinyl-stickers', design: 1 },
    { categorySlug: 'eidi-envelopes', name: 'F.R.I.E.N.D.S Theme' },
  ]

  return picks
    .map(({ categorySlug, subcategorySlug, typeSlug, design, name }) =>
      products.find(
        (product) =>
          product.categorySlug === categorySlug &&
          product.subcategorySlug === (subcategorySlug ?? null) &&
          (typeSlug == null || product.typeSlug === typeSlug) &&
          product.name === seoPickName(categorySlug, { subcategorySlug, typeSlug, design, name })
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
