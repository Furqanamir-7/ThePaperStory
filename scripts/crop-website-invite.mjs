import sharp from 'sharp'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const source =
  process.argv[2] ||
  'C:\\Users\\Dell\\Desktop\\Screenshot 2026-07-20 155252.png'
const output = join(__dirname, '../public/e-invites/website/website-invitation.png')

const image = sharp(source)
const { data, info } = await image
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

let cropTop = 0
const { width, height, channels } = info

for (let y = 0; y < height; y++) {
  let sum = 0
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    sum += data[i] + data[i + 1] + data[i + 2]
  }
  const avg = sum / (width * 3)
  if (avg > 100) {
    cropTop = y
    break
  }
}

const croppedHeight = height - cropTop
if (cropTop <= 0) {
  await sharp(source).toFile(output)
  console.log(`No top crop needed. Saved ${output}`)
} else {
  await sharp(source)
    .extract({ left: 0, top: cropTop, width, height: croppedHeight })
    .toFile(output)
  console.log(`Cropped ${cropTop}px from top. Saved ${output} (${width}x${croppedHeight})`)
}
