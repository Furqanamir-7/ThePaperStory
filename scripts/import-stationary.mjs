import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve('public/stationary')
const DIARIES_SRC = 'C:/Users/Dell/Desktop/TPS DATA/Diaries'
const PENS_SRC = 'C:/Users/Dell/Desktop/TPS DATA/Pens'
const IMAGE_RE = /\.(jpe?g|png|webp)$/i

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.(jpe?g|png|webp)$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function compressToJpg(inputPath, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await sharp(inputPath)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outputPath)
}

/** Higher saturation ≈ closed colorful covers; lower ≈ open pale lined pages. */
async function coverSaturation(inputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .resize(160, 280, { fit: 'inside' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  let sat = 0
  const pixels = info.width * info.height
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    sat += max === 0 ? 0 : (max - min) / max
  }
  return sat / pixels
}

async function isVertical(inputPath) {
  const meta = await sharp(inputPath).rotate().metadata()
  return (meta.height || 0) >= (meta.width || 0)
}

async function importDiaries(src, price) {
  const files = (await fs.readdir(src))
    .filter((name) => IMAGE_RE.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const destDir = path.join(ROOT, 'diaries')
  await fs.rm(destDir, { recursive: true, force: true })
  await fs.mkdir(destDir, { recursive: true })

  const products = []
  let productNum = 0

  for (let i = 0; i < files.length; ) {
    productNum += 1
    const group = files.slice(i, i + 2)
    i += group.length

    const scored = []
    for (const fileName of group) {
      const inputPath = path.join(src, fileName)
      scored.push({
        fileName,
        inputPath,
        sat: await coverSaturation(inputPath),
      })
    }

    // Closed cover first (higher color saturation), then open/group shot
    scored.sort((a, b) => b.sat - a.sat)

    const images = []
    for (let j = 0; j < scored.length; j += 1) {
      const outName = `${String(productNum).padStart(2, '0')}-${String(j + 1).padStart(2, '0')}.jpg`
      const outPath = path.join(destDir, outName)
      await compressToJpg(scored[j].inputPath, outPath)
      images.push(`/stationary/diaries/${outName}`)
    }

    products.push({
      name: `Diary ${productNum}`,
      image: images[0],
      images: images.length > 1 ? images : null,
      price: `PKR ${price}`,
    })

    console.log(
      `Diary ${productNum}: ${scored.map((s) => `${s.fileName}(sat=${s.sat.toFixed(3)})`).join(' + ')} → display ${path.basename(images[0])}`
    )
  }

  return products
}

async function importPens(src, price) {
  const entries = await fs.readdir(src, { withFileTypes: true })
  const products = []
  const pensRoot = path.join(ROOT, 'pens')
  await fs.rm(pensRoot, { recursive: true, force: true })
  await fs.mkdir(pensRoot, { recursive: true })

  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  for (const folderName of folders) {
    const folderPath = path.join(src, folderName)
    const slug = slugify(folderName)
    const destDir = path.join(pensRoot, slug)

    const files = (await fs.readdir(folderPath))
      .filter((name) => IMAGE_RE.test(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    const scored = []
    for (const fileName of files) {
      const inputPath = path.join(folderPath, fileName)
      scored.push({
        fileName,
        inputPath,
        vertical: await isVertical(inputPath),
      })
    }

    // Vertical shots first for display; keep stable order within each group
    scored.sort((a, b) => Number(b.vertical) - Number(a.vertical) || a.fileName.localeCompare(b.fileName, undefined, { numeric: true }))

    const images = []
    for (let i = 0; i < scored.length; i += 1) {
      const outName = `${String(i + 1).padStart(2, '0')}.jpg`
      const outPath = path.join(destDir, outName)
      await compressToJpg(scored[i].inputPath, outPath)
      images.push(`/stationary/pens/${slug}/${outName}`)
    }

    if (!images.length) continue

    products.push({
      name: folderName,
      image: images[0],
      images: images.length > 1 ? images : null,
      price: `PKR ${price}`,
      priceNote: 'Pack of 2 = PKR 450',
    })
    console.log(
      `Pen — ${folderName}: display ${scored[0].fileName} (${scored[0].vertical ? 'V' : 'H'}), ${images.length} image(s)`
    )
  }

  const looseFiles = entries
    .filter((entry) => entry.isFile() && IMAGE_RE.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  for (const fileName of looseFiles) {
    const displayName = fileName.replace(/\.(jpe?g|png|webp)$/i, '')
    const slug = slugify(displayName)
    const destDir = path.join(pensRoot, slug)
    const outName = '01.jpg'
    await compressToJpg(path.join(src, fileName), path.join(destDir, outName))

    products.push({
      name: displayName,
      image: `/stationary/pens/${slug}/${outName}`,
      images: null,
      price: `PKR ${price}`,
      priceNote: 'Pack of 2 = PKR 450',
    })
    console.log(`Pen — ${displayName}: 1 image`)
  }

  return products
}

async function main() {
  const pensOnly = process.argv.includes('--pens-only')
  const diariesOnly = process.argv.includes('--diaries-only')
  const existingPath = path.resolve('scripts/stationary-gallery.json')
  let existing = { diaries: [], pens: [] }

  try {
    existing = JSON.parse(await fs.readFile(existingPath, 'utf8'))
  } catch {
    /* fresh */
  }

  const diaries = pensOnly
    ? existing.diaries
    : await importDiaries(DIARIES_SRC, 1150)

  const pens = diariesOnly
    ? existing.pens
    : await importPens(PENS_SRC, 250)

  const result = { diaries, pens }

  await fs.writeFile(existingPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  await fs.copyFile(existingPath, path.resolve('src/data/stationary-gallery.json'))

  console.log(`\nDiaries: ${result.diaries.length} products`)
  console.log(`Pens: ${result.pens.length} products`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
