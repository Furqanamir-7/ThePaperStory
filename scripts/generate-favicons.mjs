import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '../public')
const source = join(publicDir, 'logo.png')

async function writePng(size, filename) {
  const out = join(publicDir, filename)
  await sharp(source)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(out)
  console.log(`Wrote ${filename} (${size}x${size})`)
  return out
}

function pngToIco(pngBuffer, size) {
  // Minimal single-image ICO (PNG-compressed) for modern browsers
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)

  const entry = Buffer.alloc(16)
  entry[0] = size >= 256 ? 0 : size
  entry[1] = size >= 256 ? 0 : size
  entry[2] = 0
  entry[3] = 0
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(pngBuffer.length, 8)
  entry.writeUInt32LE(22, 12)

  return Buffer.concat([header, entry, pngBuffer])
}

await writePng(16, 'favicon-16x16.png')
await writePng(32, 'favicon-32x32.png')
await writePng(180, 'apple-touch-icon.png')

const icoPng = await sharp(source)
  .resize(32, 32, { fit: 'cover' })
  .png()
  .toBuffer()

writeFileSync(join(publicDir, 'favicon.ico'), pngToIco(icoPng, 32))
console.log('Wrote favicon.ico')

await sharp(source)
  .resize(512, 512, { fit: 'cover' })
  .png()
  .toFile(join(publicDir, 'android-chrome-512x512.png'))
console.log('Wrote android-chrome-512x512.png')
