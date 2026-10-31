/**
 * Rich product metadata: unique design codes, suite contents breakdown,
 * and SEO search keywords.
 */

export const WEDDING_DESCRIPTIONS = {
  1: 'Bespoke blush and bloom floral suite featuring delicate pastel watercolor roses, soft eucalyptus greenery, and deckled-edge textured cardstock with matching dusty rose envelopes.',
  2: 'Understated luxury with modern gold foil typography, architectural arched silhouette, and warm off-white cotton rag stock finished with a signature wax seal stamp.',
  3: 'Royal Mughal botanical heritage suite featuring illuminated border motifs, intricate vintage arabesques, gold calligraphy, and custom scan-to-locate venue QR code card.',
  4: 'Dreamy pastel garden party invitation featuring lush botanical florals, sage greenery accents, bespoke monogrammed tags, and premium textured cardstock.',
  5: 'Timeless classic cream invitation suite with embossed gold border, royal monogram crest, matching envelopes, and handcrafted metallic sealing wax.',
  6: 'Regal floral crest suite on heavy textured ivory stock with bespoke monogrammed envelopes, silk ribbon accent, and handmade seal.',
  7: 'Romantic vintage lace-inspired invitation suite with intricate laser-cut or embossed borders, pearlescent shimmer stock, and soft blush accents.',
  8: 'Vibrant blush pink floral botanical suite with matching botanical envelope inner lining, personalized itinerary insert card, and rose gold seal.',
  9: 'Regal navy blue and champagne gold luxury invitation featuring ornate oriental border illumination and crisp metallic foil typography.',
  10: 'Earthy sage green botanical garden wedding suite printed on organic cotton textured paper with custom monogram and olive branch accents.',
  11: 'Warm terracotta and burnt orange boho wedding suite featuring modern arch cutouts, vellum band wrap, and bronze sealing wax.',
  12: 'Dramatic black tie luxury wedding suite with deep obsidian cardstock, reflective mirror gold foil stamping, and personalized Urdu calligraphy.',
  13: 'Soft watercolor floral meadow invitation with hand-painted botanicals, translucent vellum jacket, and delicate wax seal stamp.',
  14: 'Traditional Islamic wedding invitation suite adorned with ornate Quranic verse calligraphy (Bismillah / Wa Khalaqnakum Azwaja), royal damask pattern, and gold foil borders.',
  15: 'Lush golden foil damask invitation card with rich velvet-touch envelope sleeve and engraved monogram emblem.',
  16: 'Vintage garden floral botanical suite with rich mauve and blush blooms, gold foil header, and customized event card inserts.',
  17: 'Understated modern botanical suite on warm almond cardstock featuring minimalist line art florals and clean serif typography.',
  18: 'Opulent Arabic calligraphy royal celebration suite with gold illuminated borders, metallic emerald and gold paper, and ornate RSVP card.',
  19: 'Burgundy and rose gold royal wedding suite featuring deep crimson cards, shimmering foil details, and floral envelope liners.',
  20: 'Regal golden arch baroque suite with intricate filigree framing, deep rich backdrop, and dual-language Urdu and English typography.',
  21: 'Celestial starry midnight navy blue wedding invitation suite with sprinkled gold foil dust, star chart accents, and deep navy shimmer envelopes.',
  22: 'Rustic kraft and lace destination wedding invitation with botanical sprigs, twine tie wrap, and personalized tag.',
  23: 'Elegant art deco geometric invitation suite featuring 1920s Great Gatsby inspired gold foil lines and sleek jet black framing.',
  24: 'Traditional desi paisley and marigold wedding suite in radiant festive hues with golden zari borders and custom mehndi event card.',
  25: 'Luxe mirror acrylic transparent invitation card engraved with custom typography, accompanied by a heavy textured velvet pouch envelope.',
  26: 'Minimalist contemporary editorial monochrome wedding invitation with high-fashion typography, blind letterpress debossing, and modern asymmetric layout.',
  27: 'Chic Parisian botanical rose suite with vintage French toile de Jouy patterns, dusty pink paper stock, and custom wax seal.',
  28: 'Opulent baroque gold filigree wedding card set on ivory stock with intricate crest framing and shimmering metallic envelopes.',
  29: 'Tropical destination wedding invitation featuring lush monstera and palm foliage, gold foil accents, and boarding pass itinerary.',
  30: 'Enchanted forest woodland celebration suite with deep forest green tones, copper foil typography, and botanical fern motifs.',
  31: 'Soft dusty blue romantic watercolor invitation suite with handmade torn edges, silk chiffon ribbon, and white wax seal.',
  32: 'Grand emerald green and gold foil royal Pakistani wedding invitation suite featuring intricate Mughal jali patterns and ornate Urdu script.',
  33: 'Pure minimalist ivory linen letterpress invitation with deep debossed typography and matching custom deckled-edge RSVP envelope.',
  34: 'Regal velvet hardcover wedding invitation box with gold laser-engraved monogram crest and satin ribbon closure.',
  35: 'Vintage renaissance floral garland invitation featuring antique gilded frame, calligraphy names, and matching reception card.',
  36: 'Contemporary geometric marble and rose gold wedding invitation suite on heavy pearl shimmer cardstock.',
  37: 'Traditional royal red and gold Nikahnama-inspired wedding invitation with ornate borders and Quranic calligraphy.',
  38: 'Modern Scandinavian eucalyptus greenery invitation suite with clean typography, vellum wrap, and copper wax seal.',
  39: 'Romantic lavender and lilac wildflower botanical wedding suite featuring watercolor blooms and custom venue map card.',
  40: 'Opulent champagne shimmer wedding suite with laser-cut lace gatefold jacket and satin ribbon bow.',
  41: 'Bohemian pampas grass and neutral dried florals wedding invitation on deckled cotton paper with terracotta envelope.',
  42: 'Vintage Victorian floral cameo wedding invitation with delicate embossed borders and antique gold foil accents.',
  43: 'Modern architectural arch multi-card wedding suite in warm taupe and ivory with custom monogrammed brass paperclip.',
  44: 'Regal peacock teal and antique gold wedding invitation featuring ornate feather motifs and rich foiled border detailing.',
  45: 'Whimsical fairytale garden wedding suite with pastel floral illustrations, gold foil stars, and ribbon tie.',
  46: 'Sophisticated modern black and white typography invitation with blind debossed borders and luxury silk ribbon.',
  47: 'Royal Rajasthani heritage wedding invitation with festive golden elephant and palace arch motifs on ivory card.',
  48: 'Ethereal translucent frosted acrylic invitation card printed with white UV ink, enclosed in a luxury velvet envelope.'
};

export const DEFAULT_WHATS_INCLUDED_WEDDING = [
  'Main Invitation Card (Premium 350-400 GSM textured / matte stock)',
  'Designer Envelope with Custom Monogram / Crest Printing',
  'Event Insert Card (Mehndi / Baraat / Valima / Reception)',
  'Custom Venue Scan-to-Locate QR Code Integration',
  'Digital Proof & 3 Rounds of Complimentary Revisions'
];

export const DEFAULT_SEO_KEYWORDS_WEDDING = [
  'Wedding Invitations Pakistan',
  'Luxury Wedding Cards Lahore',
  'Bespoke Wedding Stationery Islamabad',
  'Shaadi Cards Karachi',
  'Custom Wedding Invitation Suite',
  'Handmade Wax Seal Wedding Invites',
  'Gold Foil Shaadi Card',
  'The Paper Story Wedding Cards'
];

export function getProductCode(product = {}, designNum) {
  const num = designNum || parseInt(product.designNumber || product.id, 10);
  if (!isNaN(num)) {
    return `TPS-WI-${String(num).padStart(2, '0')}`;
  }
  return product.code || 'TPS-WI-01';
}

export function getProductDescription(product = {}, designNum) {
  const num = designNum || parseInt(product.designNumber || product.id, 10);
  if (!isNaN(num) && WEDDING_DESCRIPTIONS[num]) {
    return WEDDING_DESCRIPTIONS[num];
  }
  return product.description || 'Custom crafted luxury stationery suite designed and printed by The Paper Story. Fully customizable colors, fonts, inserts, and finishes.';
}

export function getProductWhatsIncluded(product = {}, designNum) {
  if (product.whatsIncluded && Array.isArray(product.whatsIncluded) && product.whatsIncluded.length > 0) {
    return product.whatsIncluded;
  }
  return DEFAULT_WHATS_INCLUDED_WEDDING;
}

export function getProductSeoKeywords(product = {}, designNum) {
  if (product.seoKeywords && Array.isArray(product.seoKeywords) && product.seoKeywords.length > 0) {
    return product.seoKeywords;
  }
  const tags = (product.tags || []).map(t => `${t} Wedding Card`);
  return Array.from(new Set([...tags, ...DEFAULT_SEO_KEYWORDS_WEDDING])).slice(0, 8);
}
