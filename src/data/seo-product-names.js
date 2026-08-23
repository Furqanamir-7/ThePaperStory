/** Catchy, SEO-friendly product display names keyed by category context. */

export const SEO_WEDDING = {
  1: 'Blush & Bloom Floral Wedding Invite',
  2: 'Gold Minimal Wedding Invitation',
  3: 'Royal Mughal Wedding Invite Card',
  4: 'Pastel Garden Party Wedding Card',
  5: 'Classic Cream Wedding Invite Suite',
  6: 'Modern Geo Wedding Invitation',
  7: 'Vintage Lace Dream Wedding Card',
  8: 'Blush Pink Floral Wedding Invite',
  9: 'Navy Classic Wedding Invitation',
  10: 'Sage Green Botanical Wedding Card',
  11: 'Terracotta Boho Wedding Invite',
  12: 'Black & Gold Luxe Wedding Card',
  13: 'Watercolor Bloom Wedding Invite',
  14: 'Islamic Calligraphy Wedding Card',
  15: 'Peacock Motif Wedding Invitation',
  16: 'Rose Gold Glitter Wedding Invite',
  17: 'Marble Luxe Wedding Invitation',
  18: 'Rustic Kraft Wedding Invite',
  19: 'Art Deco Glam Wedding Card',
  20: 'Cherry Blossom Spring Wedding Invite',
  21: 'Midnight Starry Wedding Invitation',
  22: 'Sunflower Summer Wedding Invite',
  23: 'Lavender Dream Wedding Card',
  24: 'Embossed Monogram Wedding Invite',
  25: 'Tropical Palm Beach Wedding Card',
  26: 'Heritage Pakistani Wedding Invite',
}

export const SEO_DIGITAL_IMAGE_WEDDING = {
  1: 'Pretty Floral Digital Wedding E-Card',
  2: 'Minimal Gold Digital Wedding Invite',
  3: 'Gold Typography Digital Wedding Card',
  4: 'Pastel Watercolor Digital Wedding Invite',
  5: 'Classic Urdu Digital Wedding E-Card',
  6: 'Modern Couple Digital Wedding Invite',
  7: 'Botanical Digital Wedding E-Card',
  8: 'Royal Digital Wedding Invite Design',
  9: 'Simple Elegant Digital Wedding Card',
  10: 'Shareable Digital Wedding Invite PNG',
}

export const SEO_DIGITAL_IMAGE_BABY = {
  1: 'Sweet Baby Announcement Digital Card',
  2: 'Newborn Welcome Digital Announcement',
}

export const SEO_DIGITAL_ANIMATED_WEDDING = {
  1: 'Animated Floral Wedding Video Invite',
  2: 'Animated Gold Wedding E-Invite Video',
  3: 'Animated Minimal Wedding Video Card',
  4: 'Animated Urdu Wedding Video Invite',
  5: 'Animated Royal Wedding E-Invite',
  6: 'Animated Pastel Wedding Video Card',
  7: 'Animated Islamic Wedding Video Invite',
  8: 'Animated Luxury Wedding Video Invitation',
}

export const SEO_DIGITAL_ANIMATED_BABY = {
  1: 'Animated Baby Announcement Video Invite',
}

export const SEO_DIGITAL_ANIMATED_BIRTHDAY = {
  1: 'Animated Birthday Party Video Invitation',
}

export const SEO_NIKKAH_HAND_PAINTED = {
  1: 'Hand-Painted Floral Nikkah Certificate',
}

export const SEO_NIKKAH_PRINTED = {
  1: 'Classic Floral Printed Nikkah Certificate',
  2: 'Minimal Printed Nikkah Certificate',
  3: 'Modern Printed Nikkah Certificate Card',
  4: 'Elegant Printed Nikkah Certificate',
  5: 'Gold Border Printed Nikkah Certificate',
}

export const SEO_PACKAGING_BUSINESS = {
  1: 'Custom Business Brand Sticker Roll',
  2: 'Personalised Logo Business Stickers',
}

export const SEO_VINYL = {
  1: 'Pretty Floral Vinyl Sticker Design',
  2: 'Personalised Script Vinyl Sticker',
  3: 'Custom Wedding Vinyl Sticker Decal',
  4: 'Branded Packaging Vinyl Sticker Set',
}

export const SEO_FAVOURS = {
  'Bid Potli': 'Custom Wedding Bid Potli Favour Bag',
  'Baby Announcement Box': 'Sweet Baby Announcement Gift Box Favour',
  'Sweet Box with Gift Bags': 'Wedding Sweet Box with Gift Bags',
  'Customised Bid Box': 'Personalised Wedding Bid Box Favour',
  'Customised Chocolate Box': 'Custom Chocolate Box Wedding Favour',
  'Customised Tin Bid Box': 'Personalised Tin Bid Box Wedding Favour',
  'Personalised Golden Round Tin Favour': 'Golden Round Tin Wedding Favour',
  'Golden Round Tin Favour — Rose Gold': 'Rose Gold Round Tin Wedding Favour',
  'Custom Acrylic Wedding Cake Topper': 'Custom Acrylic Wedding Cake Topper',
}

export const SEO_EIDI = {
  'F.R.I.E.N.D.S Theme': 'F.R.I.E.N.D.S Theme Eidi Money Envelope',
  1: 'Blushing Vintage Rose Eidi Envelope',
  2: 'Bold Pink Stripe Eidi Envelope',
  3: 'Mint Rose Garden Eidi Envelope',
  4: 'Palm Oasis Checkered Eidi Envelope',
  5: 'Heritage Olive Floral Eidi Envelope',
  6: 'Soft Mauve Bloom Eidi Envelope',
  7: 'Classic Blue Toile Eidi Envelope',
}

export const SEO_POSTCARDS = {
  1: 'Sabr · Shukr · Tawakkul Landscape Postcard Set',
}

export const SEO_DIARIES = {
  1: 'Pretty Pink Tulip Spiral Mini Diary',
  2: 'Lavender Tulip Aesthetic Pocket Journal',
  3: 'Silent Rose Vintage Mini Diary Set',
  4: 'Blue Happy Day Floral Pocket Notebook',
  5: 'Cute Heart Smile Flower Mini Diary',
  6: 'One Life One Love Heart Pocket Journal',
  7: 'Blush Floral Checkered Mini Diary',
  8: 'Dreamy Pastel Bloom Pocket Notebook',
  9: 'Soft Peach Petal Spiral Mini Diary',
  10: 'Cherry Blossom Cute Pocket Journal',
  11: 'Mint Garden Floral Mini Diary',
  12: 'Green Daisy Plaid Pocket Notebook',
}

export const SEO_GREETING = {
  1: 'Pretty Floral Greeting Card with Envelope',
  2: 'Happy Birthday Celebration Greeting Card',
  3: 'Thank You Greeting Card Design',
  4: 'Elegant Wedding Greeting Card',
}

export const SEO_PAMPHLET = {
  1: 'Custom Event Pamphlet Print Design',
  2: 'Business Promotional Pamphlet',
  3: 'Wedding Event Pamphlet Design',
  4: 'Folded Marketing Pamphlet Layout',
}

export function weddingDesignNumber(images = []) {
  const match = images[0]?.match(/design-(\d+)/)
  return match ? Number(match[1]) : null
}

export function diaryNumber(image = '') {
  const match = image.match(/diaries\/(\d+)(?:-\d+)?\.jpg/)
  return match ? Number(match[1]) : null
}

export function seoWeddingName(design) {
  const num = weddingDesignNumber(design.images)
  return (num && SEO_WEDDING[num]) || design.name
}

export function seoDigitalName(subcategorySlug, typeSlug, designNum) {
  if (subcategorySlug === 'image-invitation' && typeSlug === 'wedding') {
    return SEO_DIGITAL_IMAGE_WEDDING[designNum]
  }
  if (subcategorySlug === 'image-invitation' && typeSlug === 'baby-announcement') {
    return SEO_DIGITAL_IMAGE_BABY[designNum]
  }
  if (subcategorySlug === 'animated-invitation' && typeSlug === 'wedding') {
    return SEO_DIGITAL_ANIMATED_WEDDING[designNum]
  }
  if (subcategorySlug === 'animated-invitation' && typeSlug === 'baby-announcement') {
    return SEO_DIGITAL_ANIMATED_BABY[designNum]
  }
  if (subcategorySlug === 'animated-invitation' && typeSlug === 'birthday') {
    return SEO_DIGITAL_ANIMATED_BIRTHDAY[designNum]
  }
  return null
}

export function seoNikkahName(subcategorySlug, designNum) {
  if (subcategorySlug === 'hand-painted') return SEO_NIKKAH_HAND_PAINTED[designNum]
  if (subcategorySlug === 'printed') return SEO_NIKKAH_PRINTED[designNum]
  return null
}

export function seoPackagingName(subcategorySlug, designNum) {
  if (subcategorySlug === 'business-stickers') return SEO_PACKAGING_BUSINESS[designNum]
  return null
}

export function seoVinylName(designNum) {
  return SEO_VINYL[designNum]
}

export function seoFavourName(name) {
  return SEO_FAVOURS[name] || name
}

export function seoEidiName(nameOrNum) {
  return SEO_EIDI[nameOrNum] || (typeof nameOrNum === 'string' ? nameOrNum : `Eidi Envelope ${nameOrNum}`)
}

export function seoPostcardName(designNum) {
  return SEO_POSTCARDS[designNum] || `Postcard ${designNum}`
}

export function seoDiaryName(item) {
  const num = diaryNumber(item.image)
  return (num && SEO_DIARIES[num]) || item.name
}

export function seoGreetingName(designNum) {
  return SEO_GREETING[designNum]
}

export function seoPamphletName(designNum) {
  return SEO_PAMPHLET[designNum]
}

/** Lookup for featured / best-seller picks after SEO rename */
export function seoPickName(categorySlug, { subcategorySlug, typeSlug, design, name }) {
  if (name) {
    if (categorySlug === 'stationary-items' && subcategorySlug === 'pens') return name
    if (categorySlug === 'favours') return seoFavourName(name)
    if (categorySlug === 'eidi-envelopes') return SEO_EIDI[name] || name
    return name
  }
  if (categorySlug === 'wedding-invitations') return SEO_WEDDING[design]
  if (categorySlug === 'digital-invitations') return seoDigitalName(subcategorySlug, typeSlug, design)
  if (categorySlug === 'nikkahnama') return seoNikkahName(subcategorySlug, design)
  if (categorySlug === 'packaging') return seoPackagingName(subcategorySlug, design)
  if (categorySlug === 'vinyl-stickers') return SEO_VINYL[design]
  if (categorySlug === 'stationary-items' && subcategorySlug === 'diaries') return SEO_DIARIES[design]
  if (categorySlug === 'eidi-envelopes') return SEO_EIDI[design] || SEO_EIDI[name]
  if (categorySlug === 'post-cards') return SEO_POSTCARDS[design]
  if (categorySlug === 'favours' && subcategorySlug === 'tin-favours') {
    return design === 1
      ? SEO_FAVOURS['Personalised Golden Round Tin Favour']
      : SEO_FAVOURS['Golden Round Tin Favour — Rose Gold']
  }
  return `Design ${design}`
}
