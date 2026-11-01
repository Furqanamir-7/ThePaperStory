/**
 * Complete HEIC conversion, visual deduplication, cover ordering, and gallery sync.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import convert from 'heic-convert';

const ROOT = process.cwd();
const PUB = path.join(ROOT, 'public', 'wedding-invites');
const DRIVE1 = 'D:\\projects\\The Paper Story-20261031T042156Z-1-001\\The Paper Story\\Wedding Invitation';
const DRIVE2 = 'D:\\projects\\The Paper Story-20261031T042156Z-1-002\\The Paper Story\\Wedding Invitation';
const GALLERY_JSON = path.join(ROOT, 'src', 'data', 'imported-desktop-gallery.json');
const TMP_DIR = path.join(ROOT, 'scripts', '_heic_tmp');

if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

async function getThumb(bufOrPath) {
  return await sharp(bufOrPath).resize(16, 16, { fit: 'fill' }).raw().toBuffer();
}

function areDups(t1, t2, threshold = 6.0) {
  let diff = 0;
  for (let i = 0; i < t1.length; i++) diff += Math.abs(t1[i] - t2[i]);
  return (diff / t1.length) < threshold;
}

// Convert any file (JPG or HEIC) into a normalized portrait JPEG buffer
async function normalizeImage(filePath, { rotate = null, crop = false } = {}) {
  const ext = path.extname(filePath).toLowerCase();
  let buffer;

  if (ext === '.heic') {
    try {
      const raw = fs.readFileSync(filePath);
      buffer = await convert({
        buffer: raw,
        format: 'JPEG',
        quality: 0.92
      });
    } catch (e) {
      console.log(`    ⚠ Failed heic-convert for ${path.basename(filePath)}: ${e.message}`);
      return null;
    }
  } else {
    buffer = fs.readFileSync(filePath);
  }

  try {
    let pipeline = sharp(buffer);
    const meta = await pipeline.metadata();

    if (rotate !== null) {
      pipeline = pipeline.rotate(rotate);
    } else if (meta.width > meta.height) {
      pipeline = pipeline.rotate(90);
    }

    if (crop) {
      pipeline = pipeline.trim({ threshold: 10 });
    }

    // Limit maximum dimension to 2400 for web performance
    pipeline = pipeline.resize({
      width: 2400,
      height: 2400,
      fit: 'inside',
      withoutEnlargement: true
    }).jpeg({ quality: 90 });

    return await pipeline.toBuffer();
  } catch (e) {
    console.log(`    ⚠ Failed sharp processing for ${path.basename(filePath)}: ${e.message}`);
    return null;
  }
}

// Get all candidate files from Drive1 and Drive2 for a folder
function getDriveFiles(folderNum) {
  const files = [];
  for (const base of [DRIVE1, DRIVE2]) {
    const dir = path.join(base, String(folderNum));
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      const ext = path.extname(f).toLowerCase();
      if (['.jpg', '.jpeg', '.heic'].includes(ext)) {
        files.push(path.join(dir, f));
      }
    }
  }
  return files;
}

// Process a design folder completely
async function processDesign(designNum, { coverIndex = 0, rotateCover = false, cropCover = false, includeDrive = true } = {}) {
  console.log(`\n=== Processing Design-${designNum} ===`);
  const designDir = path.join(PUB, `design-${designNum}`);
  if (!fs.existsSync(designDir)) fs.mkdirSync(designDir, { recursive: true });

  const existingFiles = fs.readdirSync(designDir)
    .filter(f => /^\d+\.jpg$/.test(f))
    .sort()
    .map(f => path.join(designDir, f));

  // Determine candidates
  const candidates = [...existingFiles];
  if (includeDrive) {
    const driveFiles = getDriveFiles(designNum);
    candidates.push(...driveFiles);
  }

  if (candidates.length === 0) {
    console.log(`  No candidates for design-${designNum}`);
    return;
  }

  // If specific cover requested from existing
  let coverCandidate = null;
  if (coverIndex > 0 && coverIndex < existingFiles.length) {
    coverCandidate = existingFiles[coverIndex];
  } else if (existingFiles.length > 0) {
    coverCandidate = existingFiles[0];
  } else {
    coverCandidate = candidates[0];
  }

  console.log(`  Total candidate sources: ${candidates.length} (cover: ${path.basename(coverCandidate)})`);

  // Process cover first
  const processedBuffers = [];
  const thumbs = [];

  const coverBuf = await normalizeImage(coverCandidate, { rotate: rotateCover ? 90 : null, crop: cropCover });
  if (coverBuf) {
    processedBuffers.push(coverBuf);
    thumbs.push(await getThumb(coverBuf));
  }

  // Now process remaining candidates, deduplicating visually
  for (const cand of candidates) {
    if (cand === coverCandidate) continue;

    const buf = await normalizeImage(cand);
    if (!buf) continue;

    const thumb = await getThumb(buf);
    let isDuplicate = false;
    for (const t of thumbs) {
      if (areDups(thumb, t)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      thumbs.push(thumb);
      processedBuffers.push(buf);
      process.stdout.write(`+`);
    } else {
      process.stdout.write(`.`);
    }
  }

  console.log(`\n  Result: ${processedBuffers.length} unique images`);

  // Write out all images
  // To avoid Windows locking issues, write to temp dir first then move
  const dTmp = path.join(TMP_DIR, `d${designNum}`);
  if (!fs.existsSync(dTmp)) fs.mkdirSync(dTmp, { recursive: true });

  for (let i = 0; i < processedBuffers.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    fs.writeFileSync(path.join(dTmp, `${num}.jpg`), processedBuffers[i]);
  }

  // Remove old files in designDir
  for (const f of fs.readdirSync(designDir)) {
    if (/^\d+\.jpg$/.test(f) || f.endsWith('.bak')) {
      try { fs.unlinkSync(path.join(designDir, f)); } catch {}
    }
  }

  // Copy new files over
  for (let i = 0; i < processedBuffers.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const src = path.join(dTmp, `${num}.jpg`);
    const dest = path.join(designDir, `${num}.jpg`);
    fs.copyFileSync(src, dest);
    try { fs.unlinkSync(src); } catch {}
  }

  try { fs.rmdirSync(dTmp); } catch {}
}

async function main() {
  // 1. Process designs requested with missing images or specific covers
  // TPS-WI-19: 3rd image as cover, crop extra space
  await processDesign(19, { coverIndex: 2, cropCover: true, includeDrive: true });

  // TPS-WI-20: 5th image as cover, rotate
  await processDesign(20, { coverIndex: 4, rotateCover: true, includeDrive: true });

  // TPS-WI-21: dedup
  await processDesign(21, { coverIndex: 0, includeDrive: true });

  // TPS-WI-22: missing images from Drive
  await processDesign(22, { coverIndex: 0, includeDrive: true });

  // TPS-WI-23: missing images from Drive
  await processDesign(23, { coverIndex: 0, includeDrive: true });

  // TPS-WI-24: 5th image as cover, remove repeating images
  await processDesign(24, { coverIndex: 4, includeDrive: true });

  // TPS-WI-25: missing images from Drive
  await processDesign(25, { coverIndex: 0, includeDrive: true });

  // TPS-WI-26: 5th image as cover
  await processDesign(26, { coverIndex: 4, includeDrive: true });

  // TPS-WI-27: 3rd image as cover, include missing Drive images
  await processDesign(27, { coverIndex: 2, includeDrive: true });

  // TPS-WI-28: 4th image as cover, rotate, include missing Drive images
  await processDesign(28, { coverIndex: 3, rotateCover: true, includeDrive: true });

  // TPS-WI-29: 4th image as cover
  await processDesign(29, { coverIndex: 3, includeDrive: true });

  // TPS-WI-30: all Drive images
  await processDesign(30, { coverIndex: 0, includeDrive: true });

  // TPS-WI-31: remove repeated images, all Drive images
  await processDesign(31, { coverIndex: 0, includeDrive: true });

  // TPS-WI-32: 2nd image as cover, rotate
  await processDesign(32, { coverIndex: 1, rotateCover: true, includeDrive: true });

  // TPS-WI-33: 4th image as cover
  await processDesign(33, { coverIndex: 3, includeDrive: true });

  // TPS-WI-34: 2nd image as cover
  await processDesign(34, { coverIndex: 1, includeDrive: false });

  // TPS-WI-36: 4th image as cover
  await processDesign(36, { coverIndex: 3, includeDrive: false });

  // 2. Final global check: ensure ALL files in ALL designs are portrait
  console.log('\n=== Global Portrait Rotation Check ===');
  for (const d of fs.readdirSync(PUB)) {
    if (!d.startsWith('design-')) continue;
    const dir = path.join(PUB, d);
    for (const f of fs.readdirSync(dir)) {
      if (!/^\d+\.jpg$/.test(f)) continue;
      const fpath = path.join(dir, f);
      try {
        const meta = await sharp(fpath).metadata();
        if (meta.width > meta.height) {
          console.log(`  Rotating ${d}/${f} (${meta.width}x${meta.height})`);
          const buf = await sharp(fpath).rotate(90).jpeg({ quality: 92 }).toBuffer();
          fs.writeFileSync(fpath, buf);
        }
      } catch (err) {
        console.log(`  Error checking ${d}/${f}: ${err.message}`);
      }
    }
  }

  // 3. Update gallery JSON
  console.log('\n=== Syncing Gallery JSON ===');
  const gallery = JSON.parse(fs.readFileSync(GALLERY_JSON, 'utf8'));
  for (const item of gallery.wedding) {
    const dn = item.designNumber;
    const dir = path.join(PUB, `design-${dn}`);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => /^\d+\.jpg$/.test(f)).sort();
      item.images = files.map(f => `/wedding-invites/design-${dn}/${f}`);
      console.log(`  TPS-WI-${dn}: ${files.length} images`);
    }
  }
  fs.writeFileSync(GALLERY_JSON, JSON.stringify(gallery, null, 2));

  // Clean TMP_DIR
  try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch {}

  console.log('\n✅ FINISHED ALL HEIC AND COVER PROCESSING');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

