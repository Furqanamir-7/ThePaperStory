/** SEO-friendly product display names keyed by category context. */

export const SEO_WEDDING = {
  1: 'Elegant Floral Wedding Invitation Card',
  2: 'Minimalist Gold Wedding Invitation',
  3: 'Royal Mughal Wedding Invitation Design',
  4: 'Pastel Garden Wedding Invitation Card',
  5: 'Classic Cream Wedding Invitation Suite',
  6: 'Modern Geometric Wedding Invite',
  7: 'Vintage Lace Wedding Invitation',
  8: 'Blush Pink Floral Wedding Card',
  9: 'Navy Blue Classic Wedding Invitation',
  10: 'Sage Green Botanical Wedding Invite',
  11: 'Terracotta Boho Wedding Invitation',
  12: 'Black and Gold Luxury Wedding Card',
  13: 'Watercolor Floral Wedding Invitation',
  14: 'Islamic Calligraphy Wedding Invite',
  15: 'Peacock Motif Wedding Invitation Card',
  16: 'Rose Gold Glitter Wedding Invite',
  17: 'Marble Texture Wedding Invitation',
  18: 'Rustic Kraft Wedding Invitation Card',
  19: 'Art Deco Wedding Invitation Design',
  20: 'Cherry Blossom Wedding Invite Card',
  21: 'Midnight Blue Starry Wedding Invitation',
  22: 'Sunflower Summer Wedding Invite',
  23: 'Lavender Dream Wedding Invitation Card',
  24: 'Embossed Monogram Wedding Invite',
  25: 'Tropical Palm Wedding Invitation',
  26: 'Heritage Pakistani Wedding Invitation Card',
}

export const SEO_DIGITAL_IMAGE_WEDDING = {
  1: 'Digital Floral Wedding Invitation Card',
  2: 'Minimal Digital Wedding E-Invite',
  3: 'Gold Typography Digital Wedding Invite',
  4: 'Pastel Watercolor Digital Wedding Card',
  5: 'Classic Urdu Digital Wedding Invitation',
  6: 'Modern Couple Digital Wedding E-Card',
  7: 'Botanical Digital Wedding Invitation',
  8: 'Royal Digital Wedding Invite Design',
  9: 'Simple Elegant Digital Wedding Card',
  10: 'Shareable Digital Wedding Invitation PNG',
}

export const SEO_DIGITAL_IMAGE_BABY = {
  1: 'Baby Announcement Digital Invitation Card',
  2: 'Newborn Welcome Digital Announcement Card',
}

export const SEO_DIGITAL_ANIMATED_WEDDING = {
  1: 'Animated Floral Wedding Video Invitation',
  2: 'Animated Gold Wedding E-Invite Video',
  3: 'Animated Minimal Wedding Video Card',
  4: 'Animated Urdu Wedding Video Invitation',
  5: 'Animated Royal Wedding E-Invite',
  6: 'Animated Pastel Wedding Video Card',
  7: 'Animated Islamic Wedding Video Invite',
  8: 'Animated Luxury Wedding Video Invitation',
}

export const SEO_DIGITAL_ANIMATED_BABY = {
  1: 'Animated Baby Announcement Video Invitation',
}

export const SEO_DIGITAL_ANIMATED_BIRTHDAY = {
  1: 'Animated Birthday Party Video Invitation',
}

export const SEO_NIKKAH_HAND_PAINTED = {
  1: 'Hand Painted Floral Nikkah Certificate',
}

export const SEO_NIKKAH_PRINTED = {
  1: 'Printed Classic Floral Nikkah Certificate',
  2: 'Printed Minimal Nikkah Certificate Design',
  3: 'Printed Modern Nikkah Certificate Card',
  4: 'Printed Elegant Nikkah Certificate',
  5: 'Printed Gold Border Nikkah Certificate',
}

export const SEO_PACKAGING_BUSINESS = {
  1: 'Custom Business Brand Sticker Roll',
  2: 'Personalised Logo Business Stickers',
}

export const SEO_VINYL = {
  1: 'Custom Floral Vinyl Sticker Design',
  2: 'Personalised Script Vinyl Sticker',
  3: 'Custom Wedding Vinyl Sticker Decal',
  4: 'Branded Packaging Vinyl Sticker Set',
}

export const SEO_FAVOURS = {
  'Bid Potli': 'Custom Wedding Bid Potli Favour Bag',
  'Baby Announcement Box': 'Custom Baby Announcement Gift Box Favour',
  'Sweet Box with Gift Bags': 'Wedding Sweet Box with Gift Bags Favour',
  'Customised Bid Box': 'Personalised Wedding Bid Box Favour',
  'Customised Chocolate Box': 'Custom Chocolate Box Wedding Favour',
  'Customised Tin Bid Box': 'Personalised Tin Bid Box Wedding Favour',
  'Personalised Golden Round Tin Favour': 'Personalised Golden Round Tin Wedding Favour',
  'Golden Round Tin Favour — Rose Gold': 'Rose Gold Golden Round Tin Wedding Favour',
  'Custom Acrylic Wedding Cake Topper': 'Custom Acrylic Wedding Cake Topper',
}

export const SEO_EIDI = {
  'F.R.I.E.N.D.S Theme': 'F.R.I.E.N.D.S Theme Eidi Money Envelope',
}

export const SEO_DIARIES = {
  1: 'Pastel Floral Hardcover Diary',
  2: 'Marble Print Journal Notebook',
  3: 'Kawaii Character Spiral Diary',
  4: 'Minimalist Linen Cover Diary',
  5: 'Glitter Unicorn Journal Notebook',
  6: 'Vintage Leather Look Diary',
  7: 'Aesthetic Grid Bullet Journal',
  8: 'Cute Cat Hardcover Diary',
  9: 'Botanical Garden Journal',
  10: 'Pink Striped Notebook Diary',
  11: 'Blue Ocean Wave Journal',
  12: 'Motivational Quote Diary',
  13: 'Rainbow Pastel Journal',
  14: 'Classic Black Hardcover Diary',
  15: 'Heart Pattern Love Journal',
  16: 'Cloud Sky Aesthetic Diary',
  17: 'Fruit Print Summer Journal',
  18: 'Starry Night Dream Diary',
  19: 'Teddy Bear Cute Journal',
  20: 'Monogram Initial Diary Notebook',
  21: 'Striped Campus Study Journal',
  22: 'Butterfly Garden Diary',
  23: 'Cream Elegance Journal Notebook',
}

export const SEO_GREETING = {
  1: 'Floral Greeting Card with Envelope',
  2: 'Birthday Celebration Greeting Card',
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
  const match = image.match(/diaries\/(\d+)\.jpg/)
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
  if (categorySlug === 'favours' && subcategorySlug === 'tin-favours') {
    return design === 1
      ? SEO_FAVOURS['Personalised Golden Round Tin Favour']
      : SEO_FAVOURS['Golden Round Tin Favour — Rose Gold']
  }
  return `Design ${design}`
}
