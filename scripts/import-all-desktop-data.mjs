import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { createRequire } from 'node:module'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const convert = require('heic-convert')

const ROOT = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story'
const PUBLIC = join(ROOT, 'public')

const FOLDER_DATA = join('C:', 'Users', 'Furqan', 'Desktop', 'The Paper Story - Data')
const FOLDER_ZIP = join(
  'C:',
  'Users',
  'Furqan',
  'Desktop',
  'The Paper Story-20261030T183641Z-1-001',
  'The Paper Story'
)
const FOLDER_WAX = join('C:', 'Users', 'Furqan', 'Desktop', 'Customised Wax Seal')

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.tif', '.tiff'])
const globalUsedHashes = new Set()

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

function hashBuffer(buf) {
  return createHash('sha256').update(buf).digest('hex')
}

async function loadBufferAndMeta(filePath) {
  try {
    const ext = extname(filePath).toLowerCase()
    let raw = readFileSync(filePath)
    let buffer = raw

    if (ext === '.heic' || ext === '.heif') {
      const converted = await convert({ buffer: raw, format: 'JPEG', quality: 0.9 })
      buffer = Buffer.from(converted)
    }

    const meta = await sharp(buffer).rotate().metadata()
    return {
      buffer,
      meta,
      width: meta.width || 0,
      height: meta.height || 0,
    }
  } catch (err) {
    console.warn(`[WARN] Failed to load/convert ${basename(filePath)}: ${err.message}`)
    return null
  }
}

function scoreCandidate(fileName, meta, size) {
  const isEdited = /^IMG_E/i.test(fileName)
  const pixels = (meta?.width || 0) * (meta?.height || 0)
  let score = 0
  if (!isEdited) score += 20000
  score += Math.min(pixels / 1000, 50000)
  score += Math.min(size / 1000, 15000)
  return score
}

function collectImageFilesFromDirs(dirs) {
  const filePaths = []
  for (const dir of dirs) {
    if (!existsSync(dir)) continue
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile()) continue
      const ext = extname(entry.name).toLowerCase()
      if (IMAGE_EXTS.has(ext)) {
        filePaths.push(join(dir, entry.name))
      }
    }
  }
  return filePaths
}

function prefilterCandidates(files, maxCount) {
  if (files.length <= maxCount) return files
  // Prioritize unedited original photos over iOS portrait IMG_E duplicates
  const nonEdited = files.filter((f) => !/^IMG_E/i.test(basename(f)))
  const pool = nonEdited.length >= maxCount ? nonEdited : files
  // Sort by file size descending (larger size = higher resolution original)
  pool.sort((a, b) => statSync(b).size - statSync(a).size)
  return pool.slice(0, maxCount)
}

async function processAndSelectImages({
  sourceDirs,
  destDir,
  webPrefix,
  targetCount = 5,
  globalDedupe = true,
}) {
  // If destDir already has enough images, reuse them!
  if (existsSync(destDir)) {
    const existing = readdirSync(destDir)
      .filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    if (existing.length >= targetCount) {
      return existing.map((f) => `${webPrefix}/${f}`)
    }
  }

  const allFiles = collectImageFilesFromDirs(
    Array.isArray(sourceDirs) ? sourceDirs : [sourceDirs]
  )
  if (!allFiles.length) return []

  // Pre-filter so we only decode/convert top candidates
  const files = prefilterCandidates(allFiles, targetCount + 2)

  const candidates = []

  for (const filePath of files) {
    const stat = statSync(filePath)
    const loaded = await loadBufferAndMeta(filePath)
    if (!loaded) continue

    const hash = hashBuffer(loaded.buffer)
    if (globalDedupe && globalUsedHashes.has(hash)) {
      continue
    }
    if (candidates.some((c) => c.hash === hash)) {
      continue
    }

    const score = scoreCandidate(basename(filePath), loaded.meta, stat.size)
    candidates.push({
      filePath,
      buffer: loaded.buffer,
      hash,
      score,
    })
  }

  if (!candidates.length) return []

  candidates.sort((a, b) => b.score - a.score)
  const picked = candidates.slice(0, targetCount)

  if (globalDedupe) {
    picked.forEach((p) => globalUsedHashes.add(p.hash))
  }

  ensureDir(destDir)

  const outputUrls = []
  for (let i = 0; i < picked.length; i += 1) {
    const filename = `${String(i + 1).padStart(2, '0')}.jpg`
    const outPath = join(destDir, filename)

    await sharp(picked[i].buffer)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outPath)

    outputUrls.push(`${webPrefix}/${filename}`)
  }

  return outputUrls
}

// 1. Wedding Invitations (Designs 1 through 33)
async function importWeddingInvitations() {
  console.log('\n--- Importing Wedding Invitations (Designs 1 - 33) ---')
  const weddingCatalog = []

  for (let num = 1; num <= 33; num += 1) {
    const dirs = [
      join(FOLDER_DATA, 'Wedding Invitation', String(num)),
      join(FOLDER_ZIP, 'Wedding Invitation', String(num)),
    ]

    const destDir = join(PUBLIC, 'wedding-invites', `design-${num}`)
    const webPrefix = `/wedding-invites/design-${num}`

    const images = await processAndSelectImages({
      sourceDirs: dirs,
      destDir,
      webPrefix,
      targetCount: 5,
      globalDedupe: true,
    })

    if (images.length > 0) {
      weddingCatalog.push({
        designNumber: num,
        name: `Design ${num}`,
        images,
      })
      console.log(`  Design ${num}: ready with ${images.length} photos`)
    } else {
      const existing = []
      if (existsSync(destDir)) {
        for (const file of readdirSync(destDir)) {
          if (IMAGE_EXTS.has(extname(file).toLowerCase())) {
            existing.push(`${webPrefix}/${file}`)
          }
        }
      }
      if (existing.length) {
        weddingCatalog.push({
          designNumber: num,
          name: `Design ${num}`,
          images: existing,
        })
        console.log(`  Design ${num}: retained ${existing.length} existing photos`)
      }
    }
  }

  return weddingCatalog
}

// 2. Customised Wax Seals (Designs 1 to 4)
async function importWaxSeals() {
  console.log('\n--- Importing Customised Wax Seals ---')
  const waxCatalog = []

  for (let num = 1; num <= 4; num += 1) {
    const dirs = [
      join(FOLDER_ZIP, 'Customised Wax Seal', String(num)),
      join(FOLDER_WAX, String(num)),
    ]

    const destDir = join(PUBLIC, 'wax-seals', `seal-${num}`)
    const webPrefix = `/wax-seals/seal-${num}`

    const images = await processAndSelectImages({
      sourceDirs: dirs,
      destDir,
      webPrefix,
      targetCount: 4,
      globalDedupe: false,
    })

    if (images.length > 0) {
      waxCatalog.push({
        sealNumber: num,
        name: `Custom Wax Seal - Collection ${num}`,
        images,
      })
      console.log(`  Wax Seal ${num}: imported ${images.length} photos`)
    }
  }

  return waxCatalog
}

// 3. Favours & Gifting
async function importFavours() {
  console.log('\n--- Importing Favours ---')
  const favoursCatalog = {
    potli: [],
    'box-favours': [],
    'tin-favours': [],
    tags: [],
    cones: [],
  }

  // Potli
  const potliImages = await processAndSelectImages({
    sourceDirs: [join(FOLDER_DATA, 'Bid Pouches-Potli')],
    destDir: join(PUBLIC, 'favours', 'bid-potli'),
    webPrefix: '/favours/bid-potli',
    targetCount: 8,
    globalDedupe: false,
  })
  if (potliImages.length) {
    favoursCatalog.potli.push({
      name: 'Bid Pouches & Potli',
      images: potliImages,
    })
    console.log(`  Potli: ${potliImages.length} photos`)
  }

  // Boxes
  const boxConfigs = [
    {
      name: 'Customised Baby Announcement Box',
      dest: 'baby-announcement-box',
      dirs: [
        join(FOLDER_DATA, 'Customised Baby Announcement Box'),
        join(FOLDER_ZIP, 'Favours', 'Box Favours'),
      ],
      target: 6,
    },
    {
      name: 'Customised Bid Box',
      dest: 'bid-box',
      dirs: [join(FOLDER_DATA, 'Customised Bid Box')],
      target: 6,
    },
    {
      name: 'Customised Chocolate Box',
      dest: 'chocolate-box',
      dirs: [join(FOLDER_DATA, 'Customised Chocolate Box')],
      target: 6,
    },
    {
      name: '3D Flower Favour Box (Pink & White)',
      dest: '3d-flower-box-1',
      dirs: [join(FOLDER_ZIP, 'Favours', '3D Flower Favour Box')],
      target: 6,
    },
    {
      name: '3D Flower Favour Box (Floral & Gold)',
      dest: '3d-flower-box-2',
      dirs: [join(FOLDER_ZIP, 'Favours', '3D Flower Favour Box 1')],
      target: 6,
    },
    {
      name: 'Flower Shaped Favour Box',
      dest: 'flower-shaped-favours',
      dirs: [join(FOLDER_ZIP, 'Favours', 'Flower Shaped Favors')],
      target: 4,
    },
    {
      name: 'Trifold Favour Gift Box',
      dest: 'trifold-favours',
      dirs: [join(FOLDER_ZIP, 'Favours', 'Trifold Favours')],
      target: 6,
    },
  ]

  for (const cfg of boxConfigs) {
    const images = await processAndSelectImages({
      sourceDirs: cfg.dirs,
      destDir: join(PUBLIC, 'favours', cfg.dest),
      webPrefix: `/favours/${cfg.dest}`,
      targetCount: cfg.target,
      globalDedupe: true,
    })
    if (images.length) {
      favoursCatalog['box-favours'].push({
        name: cfg.name,
        images,
      })
      console.log(`  Box '${cfg.name}': ${images.length} photos`)
    }
  }

  // Tin Favours
  const tinConfigs = [
    {
      name: 'Customised Tin Bid Box',
      dest: 'tin-bid-box',
      dirs: [join(FOLDER_DATA, 'Customised Tin Bid Box')],
      target: 6,
    },
    {
      name: 'Mithai Favour Tin Box',
      dest: 'mithai-tin-1',
      dirs: [
        join(FOLDER_ZIP, 'Mithai Favours Tin Boxes', '1'),
        join(FOLDER_ZIP, 'Favours', 'Round Tin'),
      ],
      target: 5,
    },
    {
      name: 'Baby Announcement Mithai Tin Box',
      dest: 'mithai-tin-baby',
      dirs: [join(FOLDER_ZIP, 'Mithai Favours Tin Boxes', 'Baby Announcement')],
      target: 5,
    },
  ]

  for (const cfg of tinConfigs) {
    const images = await processAndSelectImages({
      sourceDirs: cfg.dirs,
      destDir: join(PUBLIC, 'favours', cfg.dest),
      webPrefix: `/favours/${cfg.dest}`,
      targetCount: cfg.target,
      globalDedupe: true,
    })
    if (images.length) {
      favoursCatalog['tin-favours'].push({
        name: cfg.name,
        images,
      })
      console.log(`  Tin '${cfg.name}': ${images.length} photos`)
    }
  }

  // Saunf Cones
  const coneConfigs = [
    {
      name: 'Wedding Saunf Cones - Design 1',
      dest: 'saunf-cones-1',
      dirs: [join(FOLDER_ZIP, 'Favours', 'Saunf Cones', '1')],
    },
    {
      name: 'Wedding Saunf Cones - Design 2',
      dest: 'saunf-cones-2',
      dirs: [join(FOLDER_ZIP, 'Favours', 'Saunf Cones', '2')],
    },
  ]

  for (const cfg of coneConfigs) {
    const images = await processAndSelectImages({
      sourceDirs: cfg.dirs,
      destDir: join(PUBLIC, 'favours', cfg.dest),
      webPrefix: `/favours/${cfg.dest}`,
      targetCount: 5,
      globalDedupe: true,
    })
    if (images.length) {
      favoursCatalog.cones.push({
        name: cfg.name,
        images,
      })
      console.log(`  Cones '${cfg.name}': ${images.length} photos`)
    }
  }

  // Jhumka Tags
  const jhumkaImages = await processAndSelectImages({
    sourceDirs: [join(FOLDER_ZIP, 'Favours', 'Jhumka Tags')],
    destDir: join(PUBLIC, 'favours', 'jhumka-tags'),
    webPrefix: '/favours/jhumka-tags',
    targetCount: 5,
    globalDedupe: true,
  })
  if (jhumkaImages.length) {
    favoursCatalog.tags.push({
      name: 'Traditional Jhumka Favour Tags',
      images: jhumkaImages,
    })
    console.log(`  Jhumka Tags: ${jhumkaImages.length} photos`)
  }

  return favoursCatalog
}

// 4. Packaging Material
async function importPackaging() {
  console.log('\n--- Importing Packaging Material ---')
  const packagingCatalog = []

  const items = [
    {
      name: 'Brand Stickers & Thank You Cards',
      dest: 'stickers-thankyou',
      dirs: [
        join(FOLDER_ZIP, 'packaging', 'Brand Stickers & Thankyou cards'),
        join(FOLDER_ZIP, 'packaging', 'Brand Stickers'),
      ],
      target: 5,
    },
    {
      name: 'Branding & Business Stickers',
      dest: 'branding-stickers',
      dirs: [
        join(FOLDER_ZIP, 'packaging', 'Branding Sticker'),
        join(FOLDER_ZIP, 'packaging', 'Stickers'),
      ],
      target: 5,
    },
    {
      name: 'Custom Business Cards',
      dest: 'business-cards',
      dirs: [
        join(FOLDER_ZIP, 'packaging', 'Business Cards'),
        join(FOLDER_ZIP, 'packaging', 'Business Cards', '1'),
        join(FOLDER_ZIP, 'packaging', 'Business Cards', '2'),
      ],
      target: 5,
    },
    {
      name: 'Customised Paper Bags',
      dest: 'paper-bags',
      dirs: [
        join(FOLDER_ZIP, 'packaging', 'Customised Paper Bags', '2'),
        join(FOLDER_ZIP, 'packaging', 'Customised Paper Bags', '3'),
        join(FOLDER_ZIP, 'packaging', 'Customised Paper Bags', '4'),
      ],
      target: 6,
    },
    {
      name: 'Custom Brownie & Bakery Gift Box',
      dest: 'brownie-boxes',
      dirs: [join(FOLDER_ZIP, 'packaging', 'Customised Brownie Boxes')],
      target: 3,
    },
    {
      name: 'Personalized Name & Gift Tags',
      dest: 'personalized-tags',
      dirs: [
        join(FOLDER_ZIP, 'packaging', 'Gift tags', '2'),
        join(FOLDER_ZIP, 'packaging', 'Personalized Name Tags'),
        join(FOLDER_ZIP, 'packaging', 'Nikkah Tags'),
      ],
      target: 5,
    },
  ]

  for (const it of items) {
    const images = await processAndSelectImages({
      sourceDirs: it.dirs,
      destDir: join(PUBLIC, 'packaging', it.dest),
      webPrefix: `/packaging/${it.dest}`,
      targetCount: it.target,
      globalDedupe: true,
    })
    if (images.length) {
      packagingCatalog.push({
        name: it.name,
        images,
      })
      console.log(`  Packaging '${it.name}': ${images.length} photos`)
    }
  }

  return packagingCatalog
}

// 5. Eidi Envelopes, Money Envelopes & Eid Cards
async function importEidiAndCards() {
  console.log('\n--- Importing Eidi Envelopes, Money Envelopes & Eid Cards ---')
  const catalog = {
    eidi: [],
    eidCards: [],
    ramadanCalendar: [],
    postcards: [],
  }

  // Eidi Envelopes
  const eidiImages = await processAndSelectImages({
    sourceDirs: [join(FOLDER_ZIP, 'Eidi Envelopes')],
    destDir: join(PUBLIC, 'eidi', 'luxury-collection'),
    webPrefix: '/eidi/luxury-collection',
    targetCount: 6,
    globalDedupe: true,
  })
  if (eidiImages.length) {
    catalog.eidi.push({
      name: 'Luxury Eidi Envelope Collection',
      images: eidiImages,
    })
    console.log(`  Eidi: ${eidiImages.length} photos`)
  }

  // Money Envelopes 1 & 2
  for (const sub of ['1', '2']) {
    const moneyImages = await processAndSelectImages({
      sourceDirs: [join(FOLDER_ZIP, 'Money Envelope', sub)],
      destDir: join(PUBLIC, 'eidi', `money-envelope-${sub}`),
      webPrefix: `/eidi/money-envelope-${sub}`,
      targetCount: 4,
      globalDedupe: true,
    })
    if (moneyImages.length) {
      catalog.eidi.push({
        name: `Handcrafted Money Envelopes - Style ${sub}`,
        images: moneyImages,
      })
      console.log(`  Money Envelope ${sub}: ${moneyImages.length} photos`)
    }
  }

  // Eid Cards
  const eidCardImages = await processAndSelectImages({
    sourceDirs: [join(FOLDER_ZIP, 'Eid Cards')],
    destDir: join(PUBLIC, 'greeting', 'eid-cards'),
    webPrefix: '/greeting/eid-cards',
    targetCount: 4,
    globalDedupe: true,
  })
  if (eidCardImages.length) {
    catalog.eidCards.push({
      name: 'Artisan Eid Mubarak Cards',
      images: eidCardImages,
    })
    console.log(`  Eid Cards: ${eidCardImages.length} photos`)
  }

  // Ramadan Calendar
  const ramadanImages = await processAndSelectImages({
    sourceDirs: [join(FOLDER_ZIP, 'Ramadan Calendar')],
    destDir: join(PUBLIC, 'stationary', 'ramadan-calendar'),
    webPrefix: '/stationary/ramadan-calendar',
    targetCount: 4,
    globalDedupe: true,
  })
  if (ramadanImages.length) {
    catalog.ramadanCalendar.push({
      name: 'Ramadan Daily Tracker Calendar',
      images: ramadanImages,
    })
    console.log(`  Ramadan Calendar: ${ramadanImages.length} photos`)
  }

  // Postcards
  const postcardImages = await processAndSelectImages({
    sourceDirs: [join(FOLDER_ZIP, 'Postcards')],
    destDir: join(PUBLIC, 'postcards', 'artisan-collection'),
    webPrefix: '/postcards/artisan-collection',
    targetCount: 4,
    globalDedupe: true,
  })
  if (postcardImages.length) {
    catalog.postcards.push({
      name: 'Artisan Aesthetic Postcards',
      images: postcardImages,
    })
    console.log(`  Postcards: ${postcardImages.length} photos`)
  }

  return catalog
}

// 6. Nikkahnama
async function importNikkahnama() {
  console.log('\n--- Importing Nikkahnama Certificates ---')
  const images = await processAndSelectImages({
    sourceDirs: [join(FOLDER_ZIP, 'Nikkahnama')],
    destDir: join(PUBLIC, 'nikkah', 'printed-custom'),
    webPrefix: '/nikkah/printed-custom',
    targetCount: 4,
    globalDedupe: true,
  })
  console.log(`  Nikkahnama: ${images.length} photos`)
  return images.length ? [{ name: 'Custom Calligraphy Nikkah Certificate', images }] : []
}

async function main() {
  console.log('Starting Unified Assets Import from Desktop folders...')
  console.log('Source 1:', FOLDER_DATA)
  console.log('Source 2:', FOLDER_ZIP)
  console.log('Source 3:', FOLDER_WAX)

  const wedding = await importWeddingInvitations()
  const waxSeals = await importWaxSeals()
  const favours = await importFavours()
  const packaging = await importPackaging()
  const eidiCards = await importEidiAndCards()
  const nikkahnama = await importNikkahnama()

  const masterManifest = {
    importedAt: new Date().toISOString(),
    wedding,
    waxSeals,
    favours,
    packaging,
    eidiCards,
    nikkahnama,
  }

  const outPath = join(ROOT, 'src', 'data', 'imported-desktop-gallery.json')
  writeFileSync(outPath, `${JSON.stringify(masterManifest, null, 2)}\n`, 'utf-8')

  console.log('\n=============================================')
  console.log('Unified Import Successfully Completed!')
  console.log(`Wedding Designs: ${wedding.length}`)
  console.log(`Wax Seal Collections: ${waxSeals.length}`)
  console.log(
    `Favours: ${favours.potli.length} potli, ${favours['box-favours'].length} boxes, ${favours['tin-favours'].length} tins, ${favours.cones.length} cones, ${favours.tags.length} tags`
  )
  console.log(`Packaging Products: ${packaging.length}`)
  console.log(`Eidi & Money Envelopes: ${eidiCards.eidi.length}`)
  console.log(`Eid Cards: ${eidiCards.eidCards.length}`)
  console.log(`Manifest written to: ${outPath}`)
  console.log('=============================================\n')
}

main().catch((err) => {
  console.error('Fatal error during import:', err)
  process.exit(1)
})
