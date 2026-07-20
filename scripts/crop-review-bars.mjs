/**
 * Crop solid black letterbox bars from review JPEGs in-place.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, '..', 'public', 'reviews')

async function main() {
  const sharp = (await import('sharp')).default
  const files = fs.readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f))

  for (const file of files) {
    const input = path.join(dir, file)
    const img = sharp(input)
    const { width, height, channels } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true }).then(async () => {
      const meta = await sharp(input).metadata()
      const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
      return { width: info.width, height: info.height, channels: info.channels, data }
    })

    const { data } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const isBlack = (y) => {
      let dark = 0
      const row = y * width * 4
      const step = Math.max(1, Math.floor(width / 80))
      let samples = 0
      for (let x = 0; x < width; x += step) {
        const i = row + x * 4
        const lum = (data[i] + data[i + 1] + data[i + 2]) / 3
        samples++
        if (lum < 28) dark++
      }
      return dark / samples > 0.85
    }

    let top = 0
    while (top < height * 0.2 && isBlack(top)) top++
    let bottom = height - 1
    while (bottom > height * 0.8 && isBlack(bottom)) bottom--

    const cropTop = top
    const cropHeight = bottom - top + 1
    if (cropTop > 0 || cropHeight < height) {
      await sharp(input)
        .extract({ left: 0, top: cropTop, width, height: cropHeight })
        .jpeg({ quality: 90 })
        .toFile(input + '.tmp')
      fs.renameSync(input + '.tmp', input)
      console.log(`${file}: cropped y=${cropTop}..${bottom} (was ${height}px)`)
    } else {
      console.log(`${file}: no bars detected`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
