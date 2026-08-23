import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve('public/stationary')

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

async function importFlatCategory({ key, label, src, price }) {
  const files = (await fs.readdir(src))
    .filter((name) => IMAGE_RE.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const gallery = []

  for (let i = 0; i < files.length; i += 1) {
    const num = i + 1
    const inputPath = path.join(src, files[i])
    const outRel = `/stationary/${key}/${String(num).padStart(2, '0')}.jpg`
    const outPath = path.join(ROOT, key, `${String(num).padStart(2, '0')}.jpg`)
    await compressToJpg(inputPath, outPath)
    gallery.push({
      name: `${label} ${num}`,
      image: outRel,
      price: `PKR ${price}`,
    })
  }

  return gallery
}

async function importPens(src, price) {
  const entries = await fs.readdir(src, { withFileTypes: true })
  const products = []

  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  for (const folderName of folders) {
    const folderPath = path.join(src, folderName)
    const slug = slugify(folderName)
    const destDir = path.join(ROOT, 'pens', slug)
    await fs.rm(destDir, { recursive: true, force: true })

    const files = (await fs.readdir(folderPath))
      .filter((name) => IMAGE_RE.test(name))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    const images = []
    for (let i = 0; i < files.length; i += 1) {
      const outName = `${String(i + 1).padStart(2, '0')}.jpg`
      const outPath = path.join(destDir, outName)
      await compressToJpg(path.join(folderPath, files[i]), outPath)
      images.push(`/stationary/pens/${slug}/${outName}`)
    }

    if (!images.length) continue

    products.push({
      name: folderName,
      image: images[0],
      images: images.length > 1 ? images : null,
      price: `PKR ${price}`,
    })
    console.log(`Pen — ${folderName}: ${images.length} image(s)`)
  }

  const looseFiles = entries
    .filter((entry) => entry.isFile() && IMAGE_RE.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  for (const fileName of looseFiles) {
    const displayName = fileName.replace(/\.(jpe?g|png|webp)$/i, '')
    const slug = slugify(displayName)
    const destDir = path.join(ROOT, 'pens', slug)
    await fs.rm(destDir, { recursive: true, force: true })

    const outName = '01.jpg'
    const outPath = path.join(destDir, outName)
    await compressToJpg(path.join(src, fileName), outPath)

    products.push({
      name: displayName,
      image: `/stationary/pens/${slug}/${outName}`,
      images: null,
      price: `PKR ${price}`,
    })
    console.log(`Pen — ${displayName}: 1 image`)
  }

  return products
}

async function main() {
  const pensOnly = process.argv.includes('--pens-only')
  const existingPath = path.resolve('scripts/stationary-gallery.json')
  let existing = { diaries: [], pens: [] }

  if (pensOnly) {
    try {
      existing = JSON.parse(await fs.readFile(existingPath, 'utf8'))
    } catch {
      /* fresh import */
    }
  }

  // Remove old flat pen files (Pen 1, Pen 2, …)
  const oldPensDir = path.join(ROOT, 'pens')
  try {
    const oldEntries = await fs.readdir(oldPensDir, { withFileTypes: true })
    for (const entry of oldEntries) {
      if (/^\d+\.jpg$/i.test(entry.name)) {
        await fs.rm(path.join(oldPensDir, entry.name), { force: true })
      }
    }
  } catch {
    /* pens dir may not exist yet */
  }

  const result = {
    diaries: pensOnly
      ? existing.diaries
      : await importFlatCategory({
          key: 'diaries',
          label: 'Diary',
          src: 'C:/Users/Dell/Desktop/Diaries',
          price: 1150,
        }),
    pens: await importPens('C:/Users/Dell/Desktop/Pens', 850),
  }

  await fs.writeFile(existingPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  await fs.copyFile(existingPath, path.resolve('src/data/stationary-gallery.json'))

  console.log(`\nDiaries: ${result.diaries.length} products`)
  console.log(`Pens: ${result.pens.length} products`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
