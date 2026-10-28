import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const convert = require('heic-convert')

const IMAGE_RE = /\.(jpe?g|png|webp|heic|heif)$/i
const HEIC_RE = /\.(heic|heif)$/i

async function toJpegBuffer(inputPath) {
  const input = await fs.readFile(inputPath)
  if (HEIC_RE.test(inputPath)) {
    const converted = await convert({ buffer: input, format: 'JPEG', quality: 0.9 })
    return Buffer.from(converted)
  }
  return input
}

async function compressToJpg(inputPath, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  const buffer = await toJpegBuffer(inputPath)
  await sharp(buffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outputPath)
}

async function listImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && IMAGE_RE.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

async function importEidi() {
  const src = 'C:/Users/Dell/Desktop/Eidi Envelopes'
  const destRoot = path.resolve('public/eidi')
  const entries = await fs.readdir(src, { withFileTypes: true })

  // Fresh folders for numbered designs; keep friends-theme if present
  for (const entry of entries) {
    if (entry.isDirectory() && /^\d+$/.test(entry.name)) {
      await fs.rm(path.join(destRoot, `design-${entry.name}`), { recursive: true, force: true })
    }
  }
  await fs.rm(path.join(destRoot, 'intro'), { recursive: true, force: true })

  const loose = entries
    .filter((entry) => entry.isFile() && IMAGE_RE.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const intro = []
  for (let i = 0; i < loose.length; i += 1) {
    const outName = `${String(i + 1).padStart(2, '0')}.jpg`
    const outPath = path.join(destRoot, 'intro', outName)
    await compressToJpg(path.join(src, loose[i]), outPath)
    intro.push(`/eidi/intro/${outName}`)
    console.log(`Eidi intro ← ${loose[i]}`)
  }

  const folders = entries
    .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => Number(a) - Number(b))

  const designs = []
  for (const folder of folders) {
    const files = await listImages(path.join(src, folder))
    const images = []
    for (let i = 0; i < files.length; i += 1) {
      const outName = `${String(i + 1).padStart(2, '0')}.jpg`
      const outPath = path.join(destRoot, `design-${folder}`, outName)
      await compressToJpg(path.join(src, folder, files[i]), outPath)
      images.push(`/eidi/design-${folder}/${outName}`)
    }
    designs.push({
      folder: Number(folder),
      images,
    })
    console.log(`Eidi design ${folder}: ${images.length} image(s)`)
  }

  return { intro, designs }
}

async function importPostCards() {
  const src = 'C:/Users/Dell/Desktop/Post Cards'
  const destRoot = path.resolve('public/postcards')
  await fs.rm(destRoot, { recursive: true, force: true })
  await fs.mkdir(destRoot, { recursive: true })

  const files = await listImages(src)
  const cards = []
  for (let i = 0; i < files.length; i += 1) {
    const num = i + 1
    const outName = `${String(num).padStart(2, '0')}.jpg`
    await compressToJpg(path.join(src, files[i]), path.join(destRoot, outName))
    cards.push({
      design: num,
      image: `/postcards/${outName}`,
      images: [`/postcards/${outName}`],
    })
    console.log(`Postcard ${num} ← ${files[i]}`)
  }
  return cards
}

async function main() {
  const eidi = await importEidi()
  const postcards = await importPostCards()

  const out = { eidi, postcards }
  const outPath = path.resolve('src/data/eidi-postcards-gallery.json')
  await fs.writeFile(outPath, `${JSON.stringify(out, null, 2)}\n`, 'utf8')
  console.log(`\nWrote ${outPath}`)
  console.log(`Eidi designs: ${eidi.designs.length}, intro: ${eidi.intro.length}`)
  console.log(`Postcards: ${postcards.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
