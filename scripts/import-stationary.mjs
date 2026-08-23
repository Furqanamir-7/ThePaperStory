import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve('public/stationary')

const SOURCES = [
  {
    key: 'diaries',
    label: 'Diary',
    src: 'C:/Users/Dell/Desktop/Diaries',
    price: 1150,
  },
  {
    key: 'pens',
    label: 'Pen',
    src: 'C:/Users/Dell/Desktop/Pens',
    price: 850,
  },
]

async function compressToJpg(inputPath, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await sharp(inputPath)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outputPath)
}

async function importCategory({ key, label, src, price }) {
  const files = (await fs.readdir(src))
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
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

async function main() {
  const result = {}
  for (const source of SOURCES) {
    result[source.key] = await importCategory(source)
    console.log(`${source.key}: ${result[source.key].length} products`)
  }
  await fs.writeFile(
    path.resolve('scripts/stationary-gallery.json'),
    `${JSON.stringify(result, null, 2)}\n`,
    'utf8'
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
