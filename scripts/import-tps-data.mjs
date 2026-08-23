/**
 * Import assets from Desktop/TPS DATA/The Paper Story - Data
 * Maps each folder to the correct website section (same conventions as prior imports).
 */
import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  rmSync,
} from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC = join(ROOT, 'public')
const SOURCE = join('C:', 'Users', 'Dell', 'Desktop', 'TPS DATA', 'The Paper Story - Data')

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff'])
const TARGET_MIN = 4
const TARGET_MAX = 5

const usedHashes = new Set()

function hashFile(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

function listImages(dir) {
  if (!existsSync(dir)) return []
  const seen = new Map()
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile()) continue
    if (!IMAGE_EXTS.has(extname(entry.name).toLowerCase())) continue
    const full = join(dir, entry.name)
    const size = statSync(full).size
    const baseKey = entry.name.replace(/\(\d+\)/, '').toLowerCase()
    if (seen.has(baseKey) && seen.get(baseKey) === size) continue
    seen.set(baseKey, size)
    files.push(full)
  }
  return files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function scoreCandidate(filePath, meta) {
  const name = basename(filePath)
  const isEdited = /^IMG_E/i.test(name)
  const size = statSync(filePath).size
  const pixels = (meta?.width || 0) * (meta?.height || 0)
  let score = 0
  if (!isEdited) score += 50_000
  score += Math.min(pixels / 1000, 40_000)
  score += Math.min(size / 1000, 10_000)
  return score
}

async function getMeta(filePath) {
  try {
    const m = await sharp(filePath).rotate().metadata()
    return { width: m.width || 0, height: m.height || 0 }
  } catch {
    return { width: 0, height: 0 }
  }
}

async function compressImage(src, destJpg) {
  ensureDir(dirname(destJpg))
  await sharp(src)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(destJpg)
}

async function pickImages(files, { globalDedupe = true } = {}) {
  const candidates = []
  for (const file of files) {
    const hash = hashFile(file)
    if (globalDedupe && usedHashes.has(hash)) continue
    if (candidates.some((c) => c.hash === hash)) continue
    const meta = await getMeta(file)
    candidates.push({ file, hash, score: scoreCandidate(file, meta) })
  }
  if (!candidates.length) return []
  candidates.sort((a, b) => b.score - a.score)
  const takeCount =
    candidates.length >= TARGET_MIN ? Math.min(TARGET_MAX, candidates.length) : candidates.length
  const picked = candidates.slice(0, takeCount)
  if (globalDedupe) picked.forEach((p) => usedHashes.add(p.hash))
  return picked
}

async function importGallery({ sourceDir, destDir, webPrefix, name, globalDedupe = true }) {
  if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true })
  ensureDir(destDir)

  const files = listImages(sourceDir)
  if (!files.length) return null

  const picked = await pickImages(files, { globalDedupe })
  if (!picked.length) return null

  const images = []
  for (let i = 0; i < picked.length; i += 1) {
    const outName = `${String(i + 1).padStart(2, '0')}.jpg`
    const outPath = join(destDir, outName)
    await compressImage(picked[i].file, outPath)
    images.push(`${webPrefix}/${outName}`)
  }

  return { name, images }
}

async function importWeddingDesigns() {
  const weddingSrc = join(SOURCE, 'Wedding Invitation')
  const designs = []

  const folders = readdirSync(weddingSrc, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => Number(a) - Number(b) || a.localeCompare(b))

  for (const folder of folders) {
    const designNum = Number(folder)
    if (Number.isNaN(designNum)) continue

    const result = await importGallery({
      sourceDir: join(weddingSrc, folder),
      destDir: join(PUBLIC, 'wedding-invites', `design-${designNum}`),
      webPrefix: `/wedding-invites/design-${designNum}`,
      name: `Design ${designNum}`,
      globalDedupe: true,
    })

    if (result) {
      designs.push(result)
      console.log(`Wedding Design ${designNum}: ${result.images.length} images`)
    } else {
      console.log(`Wedding Design ${designNum}: skipped (empty or deduped)`)
    }
  }

  return designs
}

async function importFavours() {
  const favours = {
    potli: [],
    'box-favours': [],
    'tin-favours': [],
  }

  const potliGroups = [
    { source: 'Bid Pouches-Potli', dest: 'potli-1', name: 'Bid Potli Design 1' },
  ]

  for (const item of potliGroups) {
    const srcDir = join(SOURCE, item.source)
    const allFiles = listImages(srcDir)
    if (!allFiles.length) continue

    // Split 30 potli photos into up to 6 designs (5 images each)
    const chunkSize = 5
    const chunks = []
    for (let i = 0; i < allFiles.length; i += chunkSize) {
      chunks.push(allFiles.slice(i, i + chunkSize))
    }
    const useChunks = chunks.slice(0, 6)

    for (let c = 0; c < useChunks.length; c += 1) {
      const destKey = `potli-${c + 1}`
      const destDir = join(PUBLIC, 'favours', destKey)
      if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true })
      ensureDir(destDir)

      const picked = await pickImages(useChunks[c], { globalDedupe: false })
      if (!picked.length) continue

      const images = []
      for (let i = 0; i < picked.length; i += 1) {
        const outName = `${String(i + 1).padStart(2, '0')}.jpg`
        await compressImage(picked[i].file, join(destDir, outName))
        images.push(`/favours/${destKey}/${outName}`)
        usedHashes.add(picked[i].hash)
      }

      favours.potli.push({
        name: useChunks.length > 1 ? `Bid Potli Design ${c + 1}` : 'Bid Potli',
        images,
      })
      console.log(`Potli ${c + 1}: ${images.length} images`)
    }
  }

  const boxMappings = [
    {
      source: 'Customised Baby Announcement Box',
      dest: 'baby-announcement-box',
      name: 'Baby Announcement Box',
    },
    {
      source: 'Customised Bid Box',
      dest: 'bid-box',
      name: 'Customised Bid Box',
    },
    {
      source: 'Customised Chocolate Box',
      dest: 'chocolate-box',
      name: 'Customised Chocolate Box',
    },
  ]

  for (const item of boxMappings) {
    const result = await importGallery({
      sourceDir: join(SOURCE, item.source),
      destDir: join(PUBLIC, 'favours', item.dest),
      webPrefix: `/favours/${item.dest}`,
      name: item.name,
    })
    if (result) {
      favours['box-favours'].push(result)
      console.log(`Box — ${item.name}: ${result.images.length} images`)
    }
  }

  const tinResult = await importGallery({
    sourceDir: join(SOURCE, 'Customised Tin Bid Box'),
    destDir: join(PUBLIC, 'favours', 'tin-bid-box'),
    webPrefix: '/favours/tin-bid-box',
    name: 'Customised Tin Bid Box',
  })
  if (tinResult) {
    favours['tin-favours'].push(tinResult)
    console.log(`Tin — ${tinResult.name}: ${tinResult.images.length} images`)
  }

  return favours
}

async function main() {
  if (!existsSync(SOURCE)) {
    console.error('Source not found:', SOURCE)
    process.exit(1)
  }

  console.log('Importing TPS DATA from', SOURCE)

  const wedding = await importWeddingDesigns()
  const favours = await importFavours()

  const output = {
    wedding,
    favours,
    importedAt: new Date().toISOString(),
  }

  writeFileSync(join(ROOT, 'scripts', 'tps-data-gallery.json'), `${JSON.stringify(output, null, 2)}\n`)
  writeFileSync(join(ROOT, 'src', 'data', 'tps-data-gallery.json'), `${JSON.stringify(output, null, 2)}\n`)

  console.log('\nDone.')
  console.log(`Wedding designs updated: ${wedding.length}`)
  console.log(`Potli products: ${favours.potli.length}`)
  console.log(`Box favours: ${favours['box-favours'].length}`)
  console.log(`Tin favours added: ${favours['tin-favours'].length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
