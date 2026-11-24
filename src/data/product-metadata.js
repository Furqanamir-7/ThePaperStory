/**
 * Rich product metadata: unique design codes with category middle initials,
 * suite contents breakdown, and SEO search keywords.
 */

export const CATEGORY_INITIALS = {
  'wedding-invitations': 'WI',
  'digital-invitations': 'DI',
  'nikkahnama': 'NC',
  'stationary-items': 'S',
  'stationary': 'S',
  'post-cards': 'PC',
  'wax-seals': 'WS',
  'favours': 'F',
  'packaging': 'PK',
  'vinyl-stickers': 'VS',
  'eidi-envelopes': 'EE',
  'greeting-cards': 'GC',
  'boxes': 'BX',
  'pamphlets': 'PM',
  'accessories-add-ons': 'ACC',
  'gifting-envelopes-tags': 'GET',
  'ramadan-eid-gifts': 'REG',
};

export const BLUSH_BLOOM_TEMPLATE = `This invitation takes inspiration from Mughal art, featuring peacocks, floral details, and traditional patterns. The pink, green, and maroon colours create a rich and elegant look, while the illustrated borders and matching envelope bring the entire design together.

Perfect for couples who want a wedding invitation with a touch of Mughal heritage.`

export function stripAutoAddedDetails(text) {
  if (!text) return ''
  let clean = String(text)
  if (/##\s*PRODUCT DETAILS/i.test(clean)) {
    clean = clean.split(/##\s*PRODUCT DETAILS/i)[0]
  }
  clean = clean.replace(/^##\s*ABOUT THIS DESIGN\s*\n*/i, '')
  clean = clean.replace(/Premium add-ons included in this design:\s*$/i, '')
  return clean.trim()
}

export function formatWeddingTemplate(summary, specs = {}) {
  return summary ? String(summary).trim() : ''
}

export const WEDDING_DESCRIPTIONS = {
  1: BLUSH_BLOOM_TEMPLATE,
  2: formatWeddingTemplate(
    'Understated wedding invitation featuring clean modern gold foil typography, an architectural arched silhouette, and warm off-white cotton rag cardstock with coordinating envelope.',
    { printing: 'Digital Printing & Gold Foil Stamping' }
  ),
  3: formatWeddingTemplate(
    'Royal Mughal heritage invitation suite featuring illuminated border motifs, vintage arabesques, and gold calligraphy inspired by historic court architecture.',
    { printing: 'Digital Printing & Screen Print Accents' }
  ),
  4: formatWeddingTemplate(
    'Ivory invitation with bright pink flowers and a peacock, layered under a translucent overlay and tied with a cream ribbon, with a patterned envelope sealed in crimson wax.'
  ),
  5: formatWeddingTemplate(
    'Red and navy floral invitations with an illustrated couple portrait, swans, mughal buildings, and peacocks, with a monogrammed envelope and crimson wax seals.'
  ),
  6: formatWeddingTemplate(
    'Gold-bordered invitations available in mint, blush, or cream designed with digitally-drawn pink flowering branches and doves, with a translucent “Save the Date” overlay tied with a cream satin ribbon. Handmade wax seal also included.'
  ),
  7: formatWeddingTemplate(
    'Cream invitation with burgundy and rust roses, ivory orchids, and blue wildflowers. Includes a burgundy pocket folder with a matching floral card.'
  ),
  8: formatWeddingTemplate(
    'Pale blue envelopes with coral pink peonies on brown branches and a faint tonal vine pattern.'
  ),
  9: formatWeddingTemplate(
    'Square invitations with a trellis pattern border in orange, pink, or sage green and a lotus motif on a cream panel.'
  ),
  10: formatWeddingTemplate(
    'Cream pocket-fold invitation with a rose gold foil arch, blush geometric border, blue and green peacocks, pastel florals, and a palace skyline.'
  ),
  11: formatWeddingTemplate(
    'Invitations with a navy or burgundy floral border and gold foil edging, with peacocks, palm trees, and a palace scene on a cream panel. Seal wax included.'
  ),
  12: formatWeddingTemplate(
    'Seafoam green and ivory invitations with a gold border, arched cream panel, pink roses on brown branches, doves, and a gold wax seal on a matching seafoam envelope.'
  ),
  13: formatWeddingTemplate(
    '(Left) Pale mint green and ivory arched invitation with pink roses, a blue peacock on a white stone urn, doves, and green palm leaves. (Right) Purple, magenta, and teal invitation with a pink lotus and floral border, a cream arched panel, and a row of arches along the bottom.'
  ),
  14: formatWeddingTemplate(
    'Ivory and pale sage invitation with a gold border, pink roses on brown branches, a dove on a white stone urn, and a green calligraphy cover, with a translucent envelope sealed with a gold sticker.'
  ),
  15: formatWeddingTemplate(
    'Lush golden foil damask invitation card with rich velvet-touch envelope sleeve and engraved monogram emblem.',
    { printing: 'Gold Foil Stamping & Digital Printing' }
  ),
  16: formatWeddingTemplate(
    'Ivory arched invitation with a red, green, and navy Persian rug pattern border, with a matching patterned envelope liner and deep red envelopes with a gold foil monogram.'
  ),
  17: formatWeddingTemplate('Understated modern botanical suite on warm almond cardstock featuring minimalist line art florals and clean serif typography.'),
  18: formatWeddingTemplate('Opulent Arabic calligraphy royal celebration suite with gold illuminated borders, metallic emerald and gold paper, and ornate RSVP card.', { printing: 'Gold Foil Stamping & Screen Print Accents' }),
  19: formatWeddingTemplate('Burgundy and rose gold royal wedding suite featuring deep crimson cards, shimmering foil details, and floral envelope liners.'),
  20: formatWeddingTemplate('Regal golden arch baroque suite with intricate filigree framing, deep rich backdrop, and dual-language Urdu and English typography.'),
  21: formatWeddingTemplate('Celestial starry midnight navy blue wedding invitation suite with sprinkled gold foil dust, star chart accents, and deep navy shimmer envelopes.', { printing: 'Gold Foil Dust & Digital Printing' }),
  22: formatWeddingTemplate('Rustic kraft and lace destination wedding invitation with botanical sprigs, twine tie wrap, and personalized tag.'),
  23: formatWeddingTemplate('Elegant art deco geometric invitation suite featuring 1920s Great Gatsby inspired gold foil lines and sleek jet black framing.', { printing: 'Digital Printing & Gold Foil Stamping' }),
  24: formatWeddingTemplate('Traditional desi paisley and marigold wedding suite in radiant festive hues with golden zari borders and custom mehndi event card.'),
  25: formatWeddingTemplate('Luxe mirror acrylic transparent invitation card engraved with custom typography, accompanied by a heavy textured velvet pouch envelope.', { cardStock: '3mm Mirror Acrylic Card', envelope: 'Luxury Velvet Pouch Envelope' }),
  26: formatWeddingTemplate('Minimalist contemporary editorial monochrome wedding invitation with high-fashion typography, blind letterpress debossing, and modern asymmetric layout.', { printing: 'Letterpress Debossing & Digital Printing' }),
  27: formatWeddingTemplate('Chic Parisian botanical rose suite with vintage French toile de Jouy patterns, dusty pink paper stock, and custom wax seal.'),
  28: formatWeddingTemplate('Opulent baroque gold filigree wedding card set on ivory stock with intricate crest framing and shimmering metallic envelopes.'),
  29: formatWeddingTemplate('Tropical destination wedding invitation featuring lush monstera and palm foliage, gold foil accents, and boarding pass itinerary.'),
  30: formatWeddingTemplate('Enchanted forest woodland celebration suite with deep forest green tones, copper foil typography, and botanical fern motifs.'),
  31: formatWeddingTemplate('Soft dusty blue romantic watercolor invitation suite with handmade torn edges, silk chiffon ribbon, and white wax seal.'),
  32: formatWeddingTemplate('Grand emerald green and gold foil royal Pakistani wedding invitation suite featuring intricate Mughal jali patterns and ornate Urdu script.', { printing: 'Gold Foil Stamping & Screen Print Accents' }),
  33: formatWeddingTemplate('Pure minimalist ivory linen letterpress invitation with deep debossed typography and matching custom deckled-edge RSVP envelope.', { printing: 'Letterpress Debossing & Digital Printing' }),
  34: formatWeddingTemplate('Regal velvet hardcover wedding invitation box with gold laser-engraved monogram crest and satin ribbon closure.', { cardStock: 'Hardcover Velvet Invitation Board', envelope: 'Box Envelope with Ribbon Closure' }),
  35: formatWeddingTemplate('Vintage renaissance floral garland invitation featuring antique gilded frame, calligraphy names, and matching reception card.'),
  36: formatWeddingTemplate('Contemporary geometric marble and rose gold wedding invitation suite on heavy pearl shimmer cardstock.'),
  37: formatWeddingTemplate('Traditional royal red and gold Nikahnama-inspired wedding invitation with ornate borders and Quranic calligraphy.'),
  38: formatWeddingTemplate('Modern Scandinavian eucalyptus greenery invitation suite with clean typography, vellum wrap, and copper wax seal.'),
  39: formatWeddingTemplate('Romantic lavender and lilac wildflower botanical wedding suite featuring watercolor blooms and custom venue map card.'),
  40: formatWeddingTemplate('Opulent champagne shimmer wedding suite with laser-cut lace gatefold jacket and satin ribbon bow.'),
  41: formatWeddingTemplate('Bohemian pampas grass and neutral dried florals wedding invitation on deckled cotton paper with terracotta envelope.'),
  42: formatWeddingTemplate('Vintage Victorian floral cameo wedding invitation with delicate embossed borders and antique gold foil accents.'),
  43: formatWeddingTemplate('Modern architectural arch multi-card wedding suite in warm taupe and ivory with custom monogrammed brass paperclip.'),
  44: formatWeddingTemplate('Regal peacock teal and antique gold wedding invitation featuring ornate feather motifs and rich foiled border detailing.'),
  45: formatWeddingTemplate('Whimsical fairytale garden wedding suite with pastel floral illustrations, gold foil stars, and ribbon tie.'),
  46: formatWeddingTemplate('Sophisticated modern black and white typography invitation with blind debossed borders and luxury silk ribbon.'),
  47: formatWeddingTemplate('Royal Rajasthani heritage wedding invitation with festive golden elephant and palace arch motifs on ivory card.'),
  48: formatWeddingTemplate('Ethereal translucent frosted acrylic invitation card printed with white UV ink, enclosed in a luxury velvet envelope.', { cardStock: '3mm Frosted Translucent Acrylic', envelope: 'Luxury Velvet Pouch Envelope', printing: 'UV Screen Printing' }),
  49: formatWeddingTemplate('Exquisite blush and gold gilded wedding invitation suite featuring intricate botanical filigree, handcrafted deckled cotton cardstock, and matching monogrammed stationery inserts.'),
  50: formatWeddingTemplate('Enchanting pastel garden wedding card with delicate floral sprays, soft ivory tones, premium textured cardstock, and bespoke RSVP details.'),
  51: formatWeddingTemplate('Majestic wedding suite adorned with a regal heraldic crest, deep warm tones, embossed metallic foil borders, and luxury envelope seal.'),
  52: formatWeddingTemplate('Romantic rose damask foil-stamped invitation on heavy velvet-touch matte cardstock with matching insert cards and satin ribbon wrap.'),
  53: formatWeddingTemplate('Deep midnight navy blue cardstock illuminated with fine celestial gold foil typography, constellation detailing, and bespoke wax-stamped envelope.'),
  54: formatWeddingTemplate('Organic olive branch and botanical meadow motif printed on textured recycled cotton paper with minimalist typography and translucent vellum band.'),
  55: formatWeddingTemplate('Grand royal wedding invitation suite inspired by classic Mughal architecture, illuminated arabesque borders, and intricate gold foil calligraphy.'),
  56: formatWeddingTemplate('Nostalgic vintage rosebud florals on pearlized cardstock, finished with scalloped die-cut edges and romantic calligraphy script.'),
  57: formatWeddingTemplate('Clean, modern luxury in alabaster off-white and warm metallic gold foil with architectural arch frame and custom seal.'),
  58: formatWeddingTemplate('Soft twilight lilac and champagne shimmer invitation with delicate watercolor wash, gold edging, and personalized monogram.'),
  59: formatWeddingTemplate('Intricate baroque gilded filigree framing a classic royal invitation layout on thick museum-grade cotton cardstock.'),
  60: formatWeddingTemplate('Stunning deep ruby card with rich gold foil stamping, royal Urdu and English wedding typography, and matching lined envelopes.'),
  61: formatWeddingTemplate('Regal sapphire blue invitation suite accented with silver foil blossom branches, matching event cards, and luxury pocketfold.'),
  62: formatWeddingTemplate('Fragrant jasmine vines cascading around a golden arched frame on warm ivory textured paper with bespoke sealing wax.'),
  63: formatWeddingTemplate('Heirloom-inspired damask pattern in burnished gold on heavy cream cardstock, accompanied by an RSVP insert card.'),
  64: formatWeddingTemplate('Lush blush peony florals with reflective rose gold foil typography, soft vellum jacket, and wax seal closure.'),
  65: formatWeddingTemplate('Minimalist eucalyptus greenery illustration on natural linen-textured cardstock with clean contemporary typography.'),
  66: formatWeddingTemplate('Deep burgundy and cream invitation suite featuring delicate cherry blossom accents, gold foiled names, and customized matching stationery.')
};

export function formatNikkahTemplate(summary, specs = {}) {
  return summary ? String(summary).trim() : ''
}

export const NIKKAH_DESCRIPTIONS = {
  1: formatNikkahTemplate(
    'An exquisite heirloom Nikkah Certificate hand-painted by master artisans with delicate botanical watercolors and illuminated Arabic calligraphy. Features the sacred Quranic verse "And We created you in pairs" (Wa Khalaqnakum Azwaja), surrounded by intricately painted floral garlands, soft rose blush tones, and lush olive foliage. Each piece is an original work of art on heavy archival textured cardstock, presented in a luxury keepsake folder for ceremonial signing.',
    {
      cardSize: 'A3 (11.7 × 16.5 inches)',
      cardStock: 'Archival Heavyweight Textured Cotton Card (360–400 GSM)',
      folder: 'Signature Protective Velvet Keepsake Folder',
      printing: 'Original Hand-Painted Watercolor & Traditional Arabic Calligraphy'
    }
  ),
  2: formatNikkahTemplate(
    'A timeless ceremonial Nikkah Certificate framed by delicate pastel watercolor flora, blooming peonies, and romantic blush botanicals. Designed with crisp ceremonial vows, bilingual Arabic and English calligraphy headings, and formal signature lines for the bride, groom, Wali, and witnesses. Printed on museum-grade textured stock that resists fading for generations.',
    {
      cardSize: 'A3 (11.7 × 16.5 inches)',
      cardStock: '9K Archival Textured Card (350 GSM)',
      folder: 'Protective Luxury Keepsake Folder',
      printing: 'High-Definition Archival Pigment Printing'
    }
  ),
  3: formatNikkahTemplate(
    'Understated modern elegance designed for couples who appreciate clean aesthetics. Features minimalist fine-line botanical branch sketches, airy typography, and graceful Urdu and English calligraphy. The warm ivory cardstock gives a sophisticated, contemporary feel suited for framing in modern home interiors.',
    {
      cardSize: 'A3 (11.7 × 16.5 inches)',
      cardStock: 'Warm Off-White Cotton Felt Card (320–350 GSM)',
      folder: 'Sleek Signature Certificate Sleeve',
      printing: 'Fine Line Digital Archival Print'
    }
  ),
  4: formatNikkahTemplate(
    'A sleek contemporary Nikkah Certificate designed with structured geometric borders and modern Islamic typography. Created specifically for intimate Nikkah ceremonies and signing moments, with crisp contrasts, tailored vow clauses, and gold foil accents.',
    {
      cardSize: 'A3 (11.7 × 16.5 inches)',
      cardStock: 'Premium Textured Matte Card (350 GSM)',
      folder: 'Keepsake Hardcover Folder',
      printing: 'Precision Archival Print with Gold Accents'
    }
  ),
  5: formatNikkahTemplate(
    'An ornate traditional Nikkahnama design featuring an arched Islamic mihrab crest, arabesque filigree motifs, and flowing nastaliq Urdu calligraphy. Perfect for traditional South Asian wedding celebrations, capturing royal court grandeur and sacred marital commitment.',
    {
      cardSize: 'A3 (11.7 × 16.5 inches)',
      cardStock: 'Premium Heavy Textured Card (350 GSM)',
      folder: 'Deluxe Velvet Presentation Folder',
      printing: 'High-Resolution Archival Digital Printing'
    }
  ),
  6: formatNikkahTemplate(
    'A majestic Nikkahnama featuring shimmering metallic gold ornamental borders, rich geometric Islamic tessellations, and prominent Bismillah calligraphy. The luminous border catches the light during the signing ceremony, creating stunning photographs and video memories.',
    {
      cardSize: 'A3 (11.7 × 16.5 inches)',
      cardStock: 'Heavyweight Pearl Archival Stock (360 GSM)',
      folder: 'Luxury Golden Ribbon Keepsake Folder',
      printing: 'Archival Print with Gilded Gold Foil Border'
    }
  ),
  7: formatNikkahTemplate(
    'Fully personalized bespoke Nikkah Certificate crafted with custom hand-penned or digital calligraphy of the bride and groom\'s names. Features ornate decorative crests, floral embellishments, and customized clauses to preserve the sacred memory of your wedding day forever.',
    {
      cardSize: 'A3 (11.7 × 16.5 inches)',
      cardStock: '9K Textured Archival Card (350 GSM)',
      folder: 'Signature Hardcover Keepsake Folder',
      printing: 'Custom Calligraphy & Archival Pigment Print'
    }
  ),
  8: formatNikkahTemplate(
    'Inspired by classical illuminated Islamic manuscripts, this regal Nikkahnama suite features gilded circular medallion rosettes, ornate Thuluth script, and symmetrical arabesque illuminated headers. An authentic heirloom piece designed to be treasured, framed, and displayed for generations.',
    {
      cardSize: 'A3 (11.7 × 16.5 inches)',
      cardStock: 'Antique Ivory Deckled Cotton Card (360 GSM)',
      folder: 'Regal Certificate Folder with Ribbon Tie',
      printing: 'Illuminated Archival Print with Gold Accents'
    }
  ),
  9: formatNikkahTemplate(
    'A breathtaking showpiece Nikkahnama combining lush royal emerald and burgundy botanical wreaths with reflective raised gold foil stamping. The opulent floral crest and shimmering gold typography make this one of our most coveted bridal keepsakes, perfect for high-profile luxury weddings.',
    {
      cardSize: 'A3 (11.7 × 16.5 inches)',
      cardStock: '9K Textured Archival Cotton Card (380 GSM)',
      folder: 'Luxury Velvet Presentation Mount',
      printing: 'Raised Metallic Gold Foil Stamping & Archival Print'
    }
  )
};

export const CATEGORY_DESCRIPTIONS = {
  'wedding-invitations': 'Bespoke luxury wedding invitation suite crafted on premium textured cardstock with designer monogram envelopes and matching event inserts.',
  'digital-invitations': 'High-definition digital video and e-card invitation tailored for instant sharing on WhatsApp and social media with interactive maps and RSVP integration.',
  'nikkahnama': 'Handcrafted luxury Nikkah Certificate printed on heavy archival cardstock or canvas with traditional Islamic illumination and ornate Urdu/Arabic calligraphy.',
  'stationary-items': 'Designer everyday stationery, cute spiral mini diaries, and smooth gel pens crafted with care for journaling, planning, and celebration gifting.',
  'wax-seals': 'Custom engraved solid brass wax seal stamp with bespoke couple monogram, paired with premium metallic sealing wax sticks.',
  'favours': 'Handcrafted luxury wedding favour packaging, potli pouches, and custom gift boxes personalized with hot-foil monograms and satin ribbons.',
  'packaging': 'Premium custom business and wedding packaging solutions, including high-gloss stickers, branded labels, and bespoke event packaging.',
  'vinyl-stickers': 'Durable waterproof die-cut vinyl stickers featuring aesthetic botanical artwork with UV-resistant scratch-proof laminate finish.',
  'eidi-envelopes': 'Festive celebratory money and Eidi envelopes crafted on rich pearlescent paper with gold foil greetings and festive themes.',
  'post-cards': 'Fine art collectible postcard printed on heavy textured linen paper featuring inspirational Islamic quotes and serene artwork.',
  'pamphlets': 'Bespoke printed event pamphlets, folded ceremony programs, brand brochures, and personalized celebration menus crafted on premium cardstock.'
};

export const CATEGORY_WHATS_INCLUDED = {
  'wedding-invitations': [
    'Main Invitation Card (Premium 350-400 GSM textured / matte stock)',
    'Designer Envelope with Custom Monogram / Crest Printing',
    'Event Insert Card (Mehndi / Baraat / Valima / Reception)',
    'Custom Venue Scan-to-Locate QR Code Integration',
    'Digital Proof & 3 Rounds of Complimentary Revisions'
  ],
  'digital-invitations': [
    'High-Definition Animated MP4 Video & Static High-Res JPG/PDF',
    'Interactive Venue Google Maps QR Code / Direct Link',
    'Direct WhatsApp Click-to-RSVP Integration',
    'Unlimited Distribution Rights across WhatsApp & Social Media',
    'Fast 24-48 Hour Turnaround with Complimentary Proof Revisions'
  ],
  'nikkahnama': [
    '1x Luxury Printed / Hand-Embellished Nikkah Certificate',
    '1x Hardbound Presentation Folder or Velvet Keepsake Box',
    'Complimentary Feather Calligraphy Signing Pen with Gold Accents',
    'Custom Couple Names & Nikah Date Calligraphy / Foil Imprint',
    'Complimentary Digital Text & Proof Approval'
  ],
  'stationary-items': [
    'Premium Bound Diary / Spiral Ruled Mini Notebook',
    'Smooth-Flow Designer Gel Pen / Fine Point Writing Tool',
    'Thick High-GSM Paper (No Ink Bleed-Through)',
    'Protective Sleeve Packaging — Ready for Gifting'
  ],
  'wax-seals': [
    'Custom Laser-Engraved Solid Brass Stamp Head',
    'Handcrafted Ergonomic Natural Wood Handle',
    '2x Premium Metallic Sealing Wax Sticks (approx. 20-25 seals)',
    'Bespoke Initial / Monogram Design Service Included',
    'Velvet Storage Keepsake Pouch'
  ],
  'favours': [
    'Custom Crafted Favour Box / Potli Pouch (Selected Model)',
    'Personalized Couple Names & Monogram Foil Printing',
    'Matching Silk / Satin Ribbon Closure',
    'Food-Safe Certified Inner Lining (for confectioneries & sweets)'
  ],
  'packaging': [
    'High-Resolution Printed Adhesive Sticker Rolls / Die-Cut Sheets',
    'Waterproof & Smudge-Resistant Gloss / Matte Laminate',
    'Custom Brand Logo or Event Text Integration',
    'Precision Die-Cut for Clean Peel-and-Stick Application'
  ],
  'vinyl-stickers': [
    'Waterproof & Weather-Proof Die-Cut Vinyl Sticker',
    'UV-Resistant Scratch-Proof Matte Laminate',
    'Residue-Free Clean Peel Adhesive Backing'
  ],
  'eidi-envelopes': [
    'Pack of Premium Pearlescent / Textured Money Envelopes',
    'Rich Metallic Hot Foil Stamped Greetings & Motifs',
    'Pre-Applied Self-Sealing Adhesive Flap'
  ],
  'post-cards': [
    'Heavy 350 GSM Textured Linen Cardstock Art Postcard',
    'Fine Art Archival Ink Printing with Vibrant Colorfast Finish',
    'Lined Reverse Surface for Personalized Messages & Postage'
  ],
  'pamphlets': [
    'Custom Designed Folded / Flat Pamphlet (Premium 260-350 GSM Cardstock)',
    'High-Resolution Digital Offset / Foil Stamped Print Quality',
    'Custom Typography, Event Itinerary, Menu or Brand Content',
    'Precision Scoring & Machine Folding Included',
    'Digital Proof with 3 Rounds of Complimentary Revisions'
  ],
  'accessories-add-ons': [
    'Handcrafted Artisanal Finish & Custom Detailing',
    'Custom Color Palettes, Monograms & Wording Options',
    'Premium Imported Paper, Foil, Wax & Fabric Materials',
    'Custom Sized & Matched to Coordinate with Your Invitation Suite',
  ],
};

export const CATEGORY_SEO_KEYWORDS = {
  'wedding-invitations': [
    'Wedding Invitations Pakistan',
    'Luxury Wedding Cards Lahore',
    'Bespoke Wedding Stationery Islamabad',
    'Shaadi Cards Karachi',
    'Custom Wedding Invitation Suite',
    'Handmade Wax Seal Wedding Invites',
    'Gold Foil Shaadi Card',
    'The Paper Story Wedding Cards'
  ],
  'digital-invitations': [
    'Digital Wedding Invitations Pakistan',
    'WhatsApp Wedding Card Lahore',
    'Animated E-Invite Video Pakistan',
    'Digital Shaadi Card Karachi',
    'Interactive Nikkah E-Card',
    'Paperless Wedding Invitations',
    'Digital Save the Date Video'
  ],
  'nikkahnama': [
    'Custom Nikkahnama Certificate Pakistan',
    'Handmade Nikkah Certificate Lahore',
    'Islamic Marriage Certificate Islamabad',
    'Framed Nikkahnama Karachi',
    'Nikkah Signing Pen & Folder',
    'Urdu Calligraphy Nikkahnama'
  ],
  'stationary-items': [
    'Aesthetic Stationery Pakistan',
    'Cute Mini Diaries Lahore',
    'Spiral Planners & Journals',
    'Kawaii Gel Pens Karachi',
    'The Paper Story Stationery'
  ],
  'wax-seals': [
    'Custom Wax Seal Stamp Pakistan',
    'Brass Wax Seal Lahore',
    'Wedding Monogram Stamp Karachi',
    'Sealing Wax Sticks Islamabad',
    'Wax Seal Gift Kit'
  ],
  'favours': [
    'Wedding Favours Pakistan',
    'Custom Bid Boxes Lahore',
    'Luxury Gift Pouches Karachi',
    'Baraat Favour Boxes',
    'Baby Announcement Gifts'
  ],
  'packaging': [
    'Custom Stickers Pakistan',
    'Branded Packaging Labels Lahore',
    'Product Tags Printing Karachi',
    'Thank You Business Stickers'
  ],
  'vinyl-stickers': [
    'Waterproof Vinyl Stickers Pakistan',
    'Aesthetic Laptop Stickers Lahore',
    'Floral Vinyl Decals'
  ],
  'eidi-envelopes': [
    'Eidi Envelopes Pakistan',
    'Luxury Money Envelopes Lahore',
    'Salami Envelopes Karachi',
    'Gold Foil Eid Envelopes'
  ],
  'post-cards': [
    'Postcards Pakistan',
    'Islamic Art Prints Lahore',
    'Linen Postcard Set'
  ],
  'pamphlets': [
    'Pamphlet Printing Pakistan',
    'Event Pamphlets Lahore',
    'Custom Wedding Program Karachi',
    'Tri-Fold Pamphlets Islamabad',
    'Luxury Menu Pamphlets'
  ],
  'accessories-add-ons': [
    'Wedding Invitation Accessories Pakistan',
    'Premium Add-ons The Paper Story',
    'Gold Foiling Wedding Cards',
    'Embossed Wedding Monograms',
    'Custom Wax Seals Lahore',
    'Vellum Paper Belly Bands',
    'Envelope Liners Pakistan',
    'Die Cut Arch Scalloped Inserts'
  ]
};

export function getProductCode(product = {}, designNum) {
  if (product.code && typeof product.code === 'string' && product.code.trim()) {
    return product.code.trim();
  }
  if (product.sku && typeof product.sku === 'string' && product.sku.trim()) {
    return product.sku.trim();
  }
  const slug = product.categorySlug || 'wedding-invitations';
  const initial = CATEGORY_INITIALS[slug] || 'WI';

  let num = designNum;
  if (!num && product.designNumber) {
    num = Number(product.designNumber);
  }
  if (!num && product.id) {
    const digits = String(product.id).match(/\d+/);
    if (digits) num = parseInt(digits[0], 10);
  }
  if (!num && product.slug) {
    const digits = String(product.slug).match(/\d+/);
    if (digits) num = parseInt(digits[0], 10);
  }
  if (!num || isNaN(num)) num = 1;

  return `TPS-${initial}-${String(num).padStart(2, '0')}`;
}

export function getProductDescription(product = {}, designNum) {
  const slug = product.categorySlug || 'wedding-invitations';
  const num = designNum || parseInt(product.designNumber || product.id, 10);
  if (slug === 'wedding-invitations' && !isNaN(num) && WEDDING_DESCRIPTIONS[num]) {
    return WEDDING_DESCRIPTIONS[num];
  }
  if (slug === 'nikkahnama' && !isNaN(num) && NIKKAH_DESCRIPTIONS[num]) {
    return NIKKAH_DESCRIPTIONS[num];
  }
  if (product.description && product.description.length > 20) {
    return product.description;
  }
  return CATEGORY_DESCRIPTIONS[slug] || 'Custom crafted luxury stationery designed and printed by The Paper Story.';
}

export function getProductWhatsIncluded(product = {}, designNum) {
  if (product.whatsIncluded && Array.isArray(product.whatsIncluded) && product.whatsIncluded.length > 0) {
    return product.whatsIncluded;
  }
  const slug = product.categorySlug || 'wedding-invitations';
  return CATEGORY_WHATS_INCLUDED[slug] || CATEGORY_WHATS_INCLUDED['wedding-invitations'];
}

export function getProductSeoKeywords(product = {}, designNum) {
  if (product.seoKeywords && Array.isArray(product.seoKeywords) && product.seoKeywords.length > 0) {
    return product.seoKeywords;
  }
  const slug = product.categorySlug || 'wedding-invitations';
  const defaults = CATEGORY_SEO_KEYWORDS[slug] || CATEGORY_SEO_KEYWORDS['wedding-invitations'];
  const tags = (product.tags || []).map(t => `${t} Pakistan`);
  return Array.from(new Set([...tags, ...defaults])).slice(0, 8);
}
