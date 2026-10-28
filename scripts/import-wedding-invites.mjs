/**
 * Import Wedding Invitation designs from Desktop into public/wedding-invites/
 * - Each numbered source folder → one design gallery (4–5 images preferred)
 * - Dedupes by SHA-256 content hash across all designs
 * - Compresses with sharp (max width 1600, JPEG q82) matching site conventions
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
import { basename, dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC = join(ROOT, 'public')
const SOURCE = join('C:', 'Users', 'Dell', 'Desktop', 'Wedding Invitation')
const DEST_ROOT = join(PUBLIC, 'wedding-invites')
const MANIFEST = join(PUBLIC, 'ASSET-MANIFEST.md')

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff'])
const TARGET_MIN = 4
const TARGET_MAX = 5

const usedHashes = new Set()
const manifestRows = []
const galleryIndex = [] // { designNum, name, images: webPaths[], sourceFolder, skippedReason? }

function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

function hashFile(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex')
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

function listImages(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && IMAGE_EXTS.has(extname(e.name).toLowerCase()))
    .map((e) => join(dir, e.name))
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

/** Prefer non-edited (no IMG_E) originals; larger files; spread by name order */
function scoreCandidate(filePath, meta) {
  const name = basename(filePath)
  const isEdited = /^IMG_E/i.test(name) || /_E\d/i.test(name)
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
  return statSync(destJpg).size
}

/**
 * Pick up to TARGET_MAX unique (by hash) images for one design.
 * Spreads selection across the ranked list so we don't take 5 near-identical consecutive shots.
 */
async function pickImages(files) {
  const candidates = []
  for (const file of files.sort(naturalSort)) {
    const hash = hashFile(file)
    if (usedHashes.has(hash)) continue
    // also skip if same hash already in this folder's candidate list
    if (candidates.some((c) => c.hash === hash)) continue
    const meta = await getMeta(file)
    candidates.push({
      file,
      hash,
      score: scoreCandidate(file, meta),
      meta,
      size: statSync(file).size,
    })
  }

  if (!candidates.length) return []

  // Rank best first
  candidates.sort((a, b) => b.score - a.score || b.size - a.size)

  const want = Math.min(TARGET_MAX, Math.max(candidates.length, 0))
  // Prefer 5 when we have enough; if 4–5 available use all up to 5
  const takeCount = candidates.length >= TARGET_MIN ? Math.min(TARGET_MAX, candidates.length) : candidates.length

  if (candidates.length <= takeCount) {
    return candidates.slice(0, takeCount)
  }

  // Spread picks across ranked list for variety
  const picked = []
  const step = candidates.length / takeCount
  const usedIdx = new Set()
  for (let i = 0; i < takeCount; i++) {
    let idx = Math.min(candidates.length - 1, Math.floor(i * step))
    // find nearest unused
    while (usedIdx.has(idx) && idx < candidates.length - 1) idx += 1
    while (usedIdx.has(idx) && idx > 0) idx -= 1
    if (usedIdx.has(idx)) continue
    usedIdx.add(idx)
    picked.push(candidates[idx])
  }

  // If spread under-filled, fill from top scores
  for (const c of candidates) {
    if (picked.length >= takeCount) break
    if (!picked.includes(c)) picked.push(c)
  }

  return picked.slice(0, takeCount)
}

async function processDesign(folderName, designNum) {
  const sourceDir = join(SOURCE, folderName)
  const destDir = join(DEST_ROOT, `design-${designNum}`)
  const files = listImages(sourceDir)

  if (!files.length) {
    galleryIndex.push({
      designNum,
      name: `Design ${designNum}`,
      images: [],
      sourceFolder: folderName,
      skippedReason: 'no images in folder',
    })
    manifestRows.push({
      status: 'SKIPPED',
      source: `Wedding Invitation\\${folderName}`,
      dest: '—',
      note: 'no image files',
      bytesIn: 0,
      bytesOut: 0,
    })
    return
  }

  // Clean previous output for this design
  if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true })
  ensureDir(destDir)

  const picked = await pickImages(files)
  if (!picked.length) {
    galleryIndex.push({
      designNum,
      name: `Design ${designNum}`,
      images: [],
      sourceFolder: folderName,
      skippedReason: 'all images already used (hash dedupe)',
    })
    manifestRows.push({
      status: 'SKIPPED',
      source: `Wedding Invitation\\${folderName}`,
      dest: '—',
      note: 'all images already used by other designs (hash dedupe)',
      bytesIn: 0,
      bytesOut: 0,
    })
    return
  }

  const webPaths = []
  let idx = 0
  for (const item of picked) {
    idx += 1
    usedHashes.add(item.hash)
    const outName = `${String(idx).padStart(2, '0')}.jpg`
    const outPath = join(destDir, outName)
    const webPath = `/wedding-invites/design-${designNum}/${outName}`
    const sizeIn = item.size
    try {
      const sizeOut = await compressImage(item.file, outPath)
      webPaths.push(webPath)
      manifestRows.push({
        status: 'OK',
        source: `Wedding Invitation\\${folderName}\\${basename(item.file)}`,
        dest: webPath,
        note: `image ${formatBytes(sizeIn)} → ${formatBytes(sizeOut)} (hash ${item.hash.slice(0, 12)})`,
        bytesIn: sizeIn,
        bytesOut: sizeOut,
      })
    } catch (err) {
      manifestRows.push({
        status: 'ERROR',
        source: `Wedding Invitation\\${folderName}\\${basename(item.file)}`,
        dest: webPath,
        note: String(err.message || err),
        bytesIn: sizeIn,
        bytesOut: 0,
      })
    }
  }

  // Record unused leftover images in folder as SKIPPED (not selected)
  const pickedSet = new Set(picked.map((p) => p.file))
  for (const file of files) {
    if (pickedSet.has(file)) continue
    const hash = hashFile(file)
    const reason = usedHashes.has(hash)
      ? 'duplicate hash (already used)'
      : `not selected (kept ${webPaths.length} of ${files.length})`
    manifestRows.push({
      status: 'SKIPPED',
      source: `Wedding Invitation\\${folderName}\\${basename(file)}`,
      dest: '—',
      note: reason,
      bytesIn: statSync(file).size,
      bytesOut: 0,
    })
  }

  galleryIndex.push({
    designNum,
    name: `Design ${designNum}`,
    images: webPaths,
    sourceFolder: folderName,
  })

  console.log(
    `Design ${designNum} (folder ${folderName}): ${webPaths.length} images from ${files.length} source`
  )
}

function appendManifest() {
  const section = [
    '',
    '## Wedding Invites (local import)',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Source: \`C:\\\\Users\\\\Dell\\\\Desktop\\\\Wedding Invitation\``,
    '',
    '| Status | Source | Dest | Notes | In | Out |',
    '| --- | --- | --- | --- | --- | --- |',
  ]

  for (const e of manifestRows) {
    section.push(
      `| ${e.status} | \`${(e.source || '').replace(/\|/g, '\\|')}\` | \`${e.dest || '—'}\` | ${String(e.note || '').replace(/\|/g, '\\|')} | ${formatBytes(e.bytesIn || 0)} | ${formatBytes(e.bytesOut || 0)} |`
    )
  }

  section.push('', '### Output galleries', '')
  for (const g of galleryIndex) {
    section.push(`#### wedding-invites/design-${g.designNum}`)
    if (!g.images.length) section.push(`- (empty) ${g.skippedReason || ''}`)
    else for (const f of g.images) section.push(`- ${f}`)
    section.push('')
  }

  const ok = manifestRows.filter((m) => m.status === 'OK').length
  const skipped = manifestRows.filter((m) => m.status === 'SKIPPED').length
  const errors = manifestRows.filter((m) => m.status === 'ERROR').length
  section.push('### Wedding invites summary', '')
  section.push(`- Designs with images: ${galleryIndex.filter((g) => g.images.length).length}`)
  section.push(`- Images imported: ${ok}`)
  section.push(`- Skipped: ${skipped}`)
  section.push(`- Errors: ${errors}`)
  section.push('')

  let existing = ''
  if (existsSync(MANIFEST)) {
    existing = readFileSync(MANIFEST, 'utf8')
    // Remove previous wedding invites section if re-running
    const marker = '\n## Wedding Invites (local import)'
    const idx = existing.indexOf(marker)
    if (idx !== -1) existing = existing.slice(0, idx).trimEnd() + '\n'
  } else {
    existing = `# Asset Manifest\n\nGenerated: ${new Date().toISOString()}\n`
  }

  writeFileSync(MANIFEST, existing.trimEnd() + '\n' + section.join('\n'), 'utf8')
  console.log(`Updated ${relative(ROOT, MANIFEST)}`)
}

function writeGalleryJson() {
  const out = join(ROOT, 'scripts', '.wedding-invites-gallery.json')
  const designs = galleryIndex
    .filter((g) => g.images.length > 0)
    .map((g) => ({ name: g.name, images: g.images, sourceFolder: g.sourceFolder }))
  writeFileSync(out, JSON.stringify({ designs, cover: designs[0]?.images?.[0] || null }, null, 2))
  console.log(`Wrote ${relative(ROOT, out)}`)
  return designs
}

async function main() {
  if (!existsSync(SOURCE)) {
    console.error('Source folder not found:', SOURCE)
    process.exit(1)
  }

  ensureDir(DEST_ROOT)

  const folders = readdirSync(SOURCE, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => Number(a) - Number(b) || a.localeCompare(b))

  console.log(`Found ${folders.length} design folders in Wedding Invitation`)
  console.log(folders.join(', '))

  let designNum = 0
  for (const folder of folders) {
    designNum += 1
    await processDesign(folder, designNum)
  }

  const designs = writeGalleryJson()
  appendManifest()

  // Print products.js snippet helper
  console.log('\n=== Designs ready ===')
  for (const d of designs) {
    console.log(`${d.name}: ${d.images.length} imgs (${d.sourceFolder})`)
  }
  console.log(`Total designs: ${designs.length}`)
  console.log(`Unique hashes used: ${usedHashes.size}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
