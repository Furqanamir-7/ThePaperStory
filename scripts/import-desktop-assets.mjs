/**
 * Import + compress Desktop product assets into public/
 * Images: sharp max-width 1600, JPEG q~80 (PNG→JPEG except logo/favicon)
 * Videos: ffmpeg MOV→mp4 H.264 720p CRF 28; skip >20MB if ffmpeg missing
 */
import { spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
  copyFileSync,
} from 'node:fs'
import { basename, dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC = join(ROOT, 'public')
const DESKTOP = join('C:', 'Users', 'Dell', 'Desktop')
const MAX_COMMIT_BYTES = 95 * 1024 * 1024
const SKIP_VIDEO_WITHOUT_FFMPEG_BYTES = 20 * 1024 * 1024

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff'])
const VIDEO_EXTS = new Set(['.mov', '.mp4', '.m4v', '.avi', '.mkv', '.webm'])

const MAPPINGS = [
  {
    source: join(DESKTOP, 'Business-Brand Tags', '1'),
    dest: join(PUBLIC, 'packaging', 'business-1'),
    label: 'packaging/business-1',
  },
  {
    source: join(DESKTOP, 'Business-Brand Tags', '2'),
    dest: join(PUBLIC, 'packaging', 'business-2'),
    label: 'packaging/business-2',
  },
  {
    source: join(DESKTOP, 'Money Envelopes', 'F.R.I.E.N.D.S Theme'),
    dest: join(PUBLIC, 'eidi', 'friends-theme'),
    label: 'eidi/friends-theme',
  },
  {
    source: join(DESKTOP, 'Favours-Gifting', 'Baby Announcement Box'),
    dest: join(PUBLIC, 'favours', 'baby-announcement-box'),
    label: 'favours/baby-announcement-box',
  },
  {
    source: join(DESKTOP, 'Favours-Gifting', 'Cake Toppers', '1'),
    dest: join(PUBLIC, 'favours', 'cake-toppers-1'),
    label: 'favours/cake-toppers-1',
  },
  {
    source: join(DESKTOP, 'Favours-Gifting', 'Personlised Golden Round Tin', '1'),
    dest: join(PUBLIC, 'favours', 'golden-tin-1'),
    label: 'favours/golden-tin-1',
  },
  {
    source: join(DESKTOP, 'Favours-Gifting', 'Personlised Golden Round Tin', '2'),
    dest: join(PUBLIC, 'favours', 'golden-tin-2'),
    label: 'favours/golden-tin-2',
  },
  {
    source: join(DESKTOP, 'Favours-Gifting', 'Sweet Box with Gift Bags', '1'),
    dest: join(PUBLIC, 'favours', 'sweet-box-1'),
    label: 'favours/sweet-box-1',
  },
  {
    source: join(DESKTOP, 'Nikkah Certificates', 'Hand Painted', '1'),
    dest: join(PUBLIC, 'nikkah', 'hand-painted-1'),
    label: 'nikkah/hand-painted-1',
  },
  {
    source: join(DESKTOP, 'Nikkah Certificates', 'Printed', '1'),
    dest: join(PUBLIC, 'nikkah', 'printed-1'),
    label: 'nikkah/printed-1',
  },
  {
    source: join(DESKTOP, 'Nikkah Certificates', 'Printed', '2'),
    dest: join(PUBLIC, 'nikkah', 'printed-2'),
    label: 'nikkah/printed-2',
  },
  {
    source: join(DESKTOP, 'Nikkah Certificates', 'Printed', '3'),
    dest: join(PUBLIC, 'nikkah', 'printed-3'),
    label: 'nikkah/printed-3',
  },
  {
    source: join(DESKTOP, 'Nikkah Certificates', 'Printed', '4'),
    dest: join(PUBLIC, 'nikkah', 'printed-4'),
    label: 'nikkah/printed-4',
  },
  {
    source: join(DESKTOP, 'Nikkah Certificates', 'Printed', '5'),
    dest: join(PUBLIC, 'nikkah', 'printed-5'),
    label: 'nikkah/printed-5',
  },
]

const VINYL_SOURCE = join(DESKTOP, 'Vinyl Sticker')

const manifest = []
const outputsByLabel = new Map()

function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

function findFfmpeg() {
  const which = spawnSync('where.exe', ['ffmpeg'], { encoding: 'utf8' })
  if (which.status === 0) {
    const first = which.stdout.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0]
    if (first && existsSync(first)) return first
  }
  const wingetGuess =
    'C:\\Users\\Dell\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe'
  if (existsSync(wingetGuess)) return wingetGuess
  return null
}

const FFMPEG = findFfmpeg()
console.log(FFMPEG ? `ffmpeg: ${FFMPEG}` : 'ffmpeg: NOT FOUND')

function listFilesRecursive(dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listFilesRecursive(full))
    else if (entry.isFile()) out.push(full)
  }
  return out
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

function mediaKind(filePath) {
  const ext = extname(filePath).toLowerCase()
  if (IMAGE_EXTS.has(ext)) return 'image'
  if (VIDEO_EXTS.has(ext)) return 'video'
  return 'other'
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

function record(entry) {
  manifest.push(entry)
  const line = `${entry.status.padEnd(8)} ${entry.source} → ${entry.dest || '—'} (${entry.note})`
  console.log(line)
}

async function compressImage(src, destJpg) {
  ensureDir(dirname(destJpg))
  await sharp(src)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(destJpg)
  return statSync(destJpg).size
}

async function convertVideo(src, destMp4) {
  ensureDir(dirname(destMp4))
  const result = spawnSync(
    FFMPEG,
    [
      '-y',
      '-i',
      src,
      '-vf',
      "scale='min(1280,iw)':-2",
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      '28',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-movflags',
      '+faststart',
      destMp4,
    ],
    { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
  )
  if (result.status !== 0 || !existsSync(destMp4)) {
    throw new Error(result.stderr?.slice(-800) || `ffmpeg failed for ${src}`)
  }
  return statSync(destMp4).size
}

async function processFolder({ source, dest, label }) {
  ensureDir(dest)
  const files = listFilesRecursive(source).sort(naturalSort)
  let imgIdx = 0
  let vidIdx = 0
  const produced = []

  if (!existsSync(source)) {
    record({
      status: 'MISSING',
      source,
      dest: relative(PUBLIC, dest).replace(/\\/g, '/'),
      note: 'source folder not found',
      bytesIn: 0,
      bytesOut: 0,
    })
    outputsByLabel.set(label, produced)
    return
  }

  for (const file of files) {
    const relSrc = relative(DESKTOP, file)
    const sizeIn = statSync(file).size
    const kind = mediaKind(file)

    if (kind === 'other') {
      record({
        status: 'SKIPPED',
        source: relSrc,
        dest: null,
        note: `unsupported type ${extname(file)}`,
        bytesIn: sizeIn,
        bytesOut: 0,
      })
      continue
    }

    if (kind === 'image') {
      imgIdx += 1
      const name = `${String(imgIdx).padStart(2, '0')}.jpg`
      const outPath = join(dest, name)
      const webPath = `/${relative(PUBLIC, outPath).replace(/\\/g, '/')}`
      try {
        const sizeOut = await compressImage(file, outPath)
        if (sizeOut > MAX_COMMIT_BYTES) {
          record({
            status: 'SKIPPED',
            source: relSrc,
            dest: webPath,
            note: `compressed still >95MB (${formatBytes(sizeOut)})`,
            bytesIn: sizeIn,
            bytesOut: sizeOut,
          })
          continue
        }
        produced.push(webPath)
        record({
          status: 'OK',
          source: relSrc,
          dest: webPath,
          note: `image ${formatBytes(sizeIn)} → ${formatBytes(sizeOut)}`,
          bytesIn: sizeIn,
          bytesOut: sizeOut,
        })
      } catch (err) {
        record({
          status: 'ERROR',
          source: relSrc,
          dest: webPath,
          note: String(err.message || err),
          bytesIn: sizeIn,
          bytesOut: 0,
        })
      }
      continue
    }

    // video
    vidIdx += 1
    const name = `${String(vidIdx).padStart(2, '0')}.mp4`
    const outPath = join(dest, name)
    const webPath = `/${relative(PUBLIC, outPath).replace(/\\/g, '/')}`

    if (!FFMPEG) {
      if (sizeIn > SKIP_VIDEO_WITHOUT_FFMPEG_BYTES) {
        record({
          status: 'SKIPPED',
          source: relSrc,
          dest: null,
          note: `no ffmpeg; video >20MB (${formatBytes(sizeIn)})`,
          bytesIn: sizeIn,
          bytesOut: 0,
        })
      } else {
        try {
          copyFileSync(file, outPath.replace(/\.mp4$/i, extname(file).toLowerCase()))
          const copied = outPath.replace(/\.mp4$/i, extname(file).toLowerCase())
          const copiedWeb = `/${relative(PUBLIC, copied).replace(/\\/g, '/')}`
          produced.push(copiedWeb)
          record({
            status: 'COPIED',
            source: relSrc,
            dest: copiedWeb,
            note: `no ffmpeg; raw copy ${formatBytes(sizeIn)}`,
            bytesIn: sizeIn,
            bytesOut: sizeIn,
          })
        } catch (err) {
          record({
            status: 'ERROR',
            source: relSrc,
            dest: webPath,
            note: String(err.message || err),
            bytesIn: sizeIn,
            bytesOut: 0,
          })
        }
      }
      continue
    }

    try {
      console.log(`  converting video ${relSrc} …`)
      const sizeOut = await convertVideo(file, outPath)
      if (sizeOut > MAX_COMMIT_BYTES) {
        record({
          status: 'SKIPPED',
          source: relSrc,
          dest: webPath,
          note: `compressed video still >95MB (${formatBytes(sizeOut)})`,
          bytesIn: sizeIn,
          bytesOut: sizeOut,
        })
        continue
      }
      produced.push(webPath)
      record({
        status: 'OK',
        source: relSrc,
        dest: webPath,
        note: `video ${formatBytes(sizeIn)} → ${formatBytes(sizeOut)}`,
        bytesIn: sizeIn,
        bytesOut: sizeOut,
      })
    } catch (err) {
      record({
        status: 'ERROR',
        source: relSrc,
        dest: webPath,
        note: String(err.message || err),
        bytesIn: sizeIn,
        bytesOut: 0,
      })
    }
  }

  outputsByLabel.set(label, produced)
}

async function processVinyl() {
  ensureDir(join(PUBLIC, 'vinyl'))
  const files = listFilesRecursive(VINYL_SOURCE)
    .filter((f) => mediaKind(f) === 'image')
    .sort(naturalSort)

  const produced = []
  let idx = 0
  for (const file of files) {
    idx += 1
    const relSrc = relative(DESKTOP, file)
    const sizeIn = statSync(file).size
    const name = `vinyl-${idx}.jpeg`
    const outPath = join(PUBLIC, 'vinyl', name)
    const webPath = `/vinyl/${name}`
    try {
      const sizeOut = await compressImage(file, outPath)
      produced.push(webPath)
      record({
        status: 'OK',
        source: relSrc,
        dest: webPath,
        note: `vinyl ${formatBytes(sizeIn)} → ${formatBytes(sizeOut)}`,
        bytesIn: sizeIn,
        bytesOut: sizeOut,
      })
    } catch (err) {
      record({
        status: 'ERROR',
        source: relSrc,
        dest: webPath,
        note: String(err.message || err),
        bytesIn: sizeIn,
        bytesOut: 0,
      })
    }
  }
  outputsByLabel.set('vinyl', produced)
}

async function writeNikkahCover() {
  const candidates = [
    join(PUBLIC, 'nikkah', 'printed-1', '01.jpg'),
    join(PUBLIC, 'nikkah', 'printed-1', '04.jpg'),
    join(PUBLIC, 'nikkah', 'printed-4', '01.jpg'),
    join(PUBLIC, 'nikkah', 'printed-5', '01.jpg'),
  ]
  const src = candidates.find((p) => existsSync(p))
  if (!src) {
    record({
      status: 'SKIPPED',
      source: '(nikkah cover)',
      dest: '/nikkah/cover-printed.jpg',
      note: 'no printed image available for cover',
      bytesIn: 0,
      bytesOut: 0,
    })
    return
  }
  const dest = join(PUBLIC, 'nikkah', 'cover-printed.jpg')
  ensureDir(dirname(dest))
  copyFileSync(src, dest)
  const sizeOut = statSync(dest).size
  record({
    status: 'OK',
    source: relative(PUBLIC, src).replace(/\\/g, '/'),
    dest: '/nikkah/cover-printed.jpg',
    note: `cover copy ${formatBytes(sizeOut)}`,
    bytesIn: sizeOut,
    bytesOut: sizeOut,
  })
}

function writeManifest() {
  const lines = [
    '# Asset Manifest',
    '',
    `Generated: ${new Date().toISOString()}`,
    `ffmpeg: ${FFMPEG || 'not available'}`,
    '',
    'Every source file from the Desktop inventory folders is listed below with its outcome.',
    '',
    '| Status | Source (Desktop-relative) | Dest (public) | Notes | In | Out |',
    '| --- | --- | --- | --- | --- | --- |',
  ]

  for (const e of manifest) {
    lines.push(
      `| ${e.status} | \`${(e.source || '').replace(/\|/g, '\\|')}\` | \`${e.dest || '—'}\` | ${e.note.replace(/\|/g, '\\|')} | ${formatBytes(e.bytesIn || 0)} | ${formatBytes(e.bytesOut || 0)} |`
    )
  }

  lines.push('', '## Output galleries', '')
  for (const [label, files] of outputsByLabel) {
    lines.push(`### ${label}`)
    if (!files.length) lines.push('- (empty)')
    else for (const f of files) lines.push(`- ${f}`)
    lines.push('')
  }

  const ok = manifest.filter((m) => m.status === 'OK' || m.status === 'COPIED').length
  const skipped = manifest.filter((m) => m.status === 'SKIPPED').length
  const errors = manifest.filter((m) => m.status === 'ERROR' || m.status === 'MISSING').length
  lines.push('## Summary', '')
  lines.push(`- Imported/OK: ${ok}`)
  lines.push(`- Skipped: ${skipped}`)
  lines.push(`- Errors/Missing: ${errors}`)
  lines.push('')

  writeFileSync(join(PUBLIC, 'ASSET-MANIFEST.md'), lines.join('\n'), 'utf8')
  console.log(`\nWrote public/ASSET-MANIFEST.md (${manifest.length} entries)`)
}

async function main() {
  console.log('Importing Desktop assets…')
  for (const mapping of MAPPINGS) {
    console.log(`\n== ${mapping.label} ==`)
    await processFolder(mapping)
  }
  console.log('\n== vinyl ==')
  await processVinyl()
  await writeNikkahCover()
  writeManifest()

  // quick size guard
  const oversized = []
  for (const e of manifest) {
    if (e.dest && e.bytesOut > MAX_COMMIT_BYTES) oversized.push(e)
  }
  if (oversized.length) {
    console.error('ERROR: files still over 95MB:', oversized)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
