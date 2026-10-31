/**
 * MASTER FIX SCRIPT — The Paper Story Wedding Invitations
 * Handles: rotation, dedup, cover reorder, Drive import, merges, JSON update
 *
 * Run from project root: node scripts/master-fix-all.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = process.cwd();
const PUB = path.join(ROOT, 'public', 'wedding-invites');
const DRIVE1 = 'D:\\projects\\The Paper Story-20261031T042156Z-1-001\\The Paper Story\\Wedding Invitation';
const DRIVE2 = 'D:\\projects\\The Paper Story-20261031T042156Z-1-002\\The Paper Story\\Wedding Invitation';
const JSON_PATH = path.join(ROOT, 'src', 'data', 'imported-desktop-gallery.json');

// ─── Helpers ───────────────────────────────────────────────────────────────

function fileHash(fpath) {
  const buf = fs.readFileSync(fpath);
  return crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);
}

async function ensurePortrait(src, dest) {
  const meta = await sharp(src).metadata();
  let pipeline = sharp(src);
  if (meta.width > meta.height) {
    pipeline = pipeline.rotate(90); // landscape → portrait
  }
  // Always write output with max quality
  await pipeline.jpeg({ quality: 92 }).toFile(dest);
  const out = await sharp(dest).metadata();
  console.log(`  ✓ ${path.basename(dest)}: ${out.width}x${out.height}`);
}

async function processImage(src, dest, { rotate = null, crop = false } = {}) {
  let pipeline = sharp(src);
  let meta;
  try {
    meta = await sharp(src).metadata();
  } catch (e) {
    console.log(`  ⚠ SKIP corrupt/unsupported: ${path.basename(src)} — ${e.message.slice(0,80)}`);
    return null; // signal skip
  }
  if (rotate !== null) {
    pipeline = pipeline.rotate(rotate);
  } else if (meta.width > meta.height) {
    pipeline = pipeline.rotate(90);
  }
  if (crop) {
    pipeline = pipeline.trim({ threshold: 10 });
  }
  await pipeline.jpeg({ quality: 92 }).toFile(dest);
  const out = await sharp(dest).metadata();
  console.log(`  ✓ ${path.basename(src)} → ${path.basename(dest)}: ${out.width}x${out.height}`);
  return dest;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// Get all image files from a Drive folder (JPG + HEIC, no MOV/MP4)
function getDriveImages(folderNum) {
  const imgs = [];
  for (const base of [DRIVE1, DRIVE2]) {
    const dir = path.join(base, String(folderNum));
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      const ext = path.extname(f).toLowerCase();
      if (['.jpg', '.jpeg', '.heic'].includes(ext)) {
        imgs.push(path.join(dir, f));
      }
    }
  }
  return imgs;
}

// Get unique images by hash from a list
function deduplicateByHash(imgPaths) {
  const seen = new Set();
  const unique = [];
  for (const p of imgPaths) {
    const h = fileHash(p);
    if (!seen.has(h)) {
      seen.add(h);
      unique.push(p);
    }
  }
  return unique;
}

// Get existing images for a design
function getDesignImages(designNum) {
  const dir = path.join(PUB, `design-${designNum}`);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.jpg'))
    .sort()
    .map(f => path.join(dir, f));
}

// Global temp directory outside public/ to avoid Windows file lock issues
const TMPDIR = path.join(ROOT, 'scripts', '_rebuild_tmp');
fs.mkdirSync(TMPDIR, { recursive: true });

// Rebuild design folder with given ordered unique images (convert HEIC if needed)
async function rebuildDesign(designNum, orderedSrcs) {
  const dir = path.join(PUB, `design-${designNum}`);
  fs.mkdirSync(dir, { recursive: true });
  const tmpDir = path.join(TMPDIR, `d${designNum}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  // Step 1: Process all images into an EXTERNAL temp dir
  const tmpFiles = [];
  for (let i = 0; i < orderedSrcs.length; i++) {
    const tmp = path.join(tmpDir, `out_${i}.jpg`);
    const result = await processImage(orderedSrcs[i], tmp);
    if (result !== null) tmpFiles.push(tmp); // skip corrupt files
  }

  // Step 2: Get existing numbered files
  const existing = fs.readdirSync(dir).filter(f => /^\d+\.jpg$/.test(f)).sort();
  
  // Step 3: Overwrite each destination file from temp
  // On Windows, files can be renamed even when open, but not written directly.
  // Strategy: rename existing → .bak, write new file, delete .bak
  for (let i = 0; i < tmpFiles.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const dest = path.join(dir, `${num}.jpg`);
    const bak = path.join(dir, `${num}.bak`);
    
    if (fs.existsSync(dest)) {
      // Rename existing file out of the way (rename works even on locked files on Windows)
      try { fs.renameSync(dest, bak); } catch { /* ignore, will overwrite */ }
    }
    
    // Move temp file into place
    try {
      fs.renameSync(tmpFiles[i], dest);
    } catch {
      // If cross-device rename fails, copy then delete
      fs.copyFileSync(tmpFiles[i], dest);
      try { fs.unlinkSync(tmpFiles[i]); } catch {}
    }
    
    // Clean up backup
    if (fs.existsSync(bak)) {
      try { fs.unlinkSync(bak); } catch { console.log(`  ⚠ Could not delete backup ${bak}`); }
    }
  }

  // Step 4: Remove any leftover old numbered files beyond the new count
  for (let i = tmpFiles.length; i < existing.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const old = path.join(dir, `${num}.jpg`);
    if (fs.existsSync(old)) {
      try { fs.unlinkSync(old); } catch { console.log(`  ⚠ Could not delete ${old} (locked), skipping`); }
    }
  }

  // Cleanup temp subdir
  try { fs.rmdirSync(tmpDir); } catch {}
  return Array.from({ length: tmpFiles.length }, (_, i) =>
    `/wedding-invites/design-${designNum}/${String(i + 1).padStart(2, '0')}.jpg`
  );
}

// Merge multiple design folders into one, deduplicate
async function mergeIntoDesign(targetDesign, sourceDesigns, coverSrc = null) {
  console.log(`\n↔ Merging designs [${sourceDesigns.join(',')}] → design-${targetDesign}`);
  
  // Collect all existing images from all designs
  let allSrcs = [];
  for (const d of [targetDesign, ...sourceDesigns]) {
    allSrcs.push(...getDesignImages(d));
  }
  const unique = deduplicateByHash(allSrcs);
  
  // Put cover first if specified
  let ordered = unique;
  if (coverSrc && fs.existsSync(coverSrc)) {
    const coverHash = fileHash(coverSrc);
    ordered = [coverSrc, ...unique.filter(p => fileHash(p) !== coverHash)];
  }
  
  return await rebuildDesign(targetDesign, ordered);
}

// Import Drive images into a design (add missing, dedup, keep existing first)
async function importDriveImages(designNum, driveFolder, coverIdx = 0) {
  console.log(`\n📥 Importing Drive folder ${driveFolder} → design-${designNum}`);
  const existing = getDesignImages(designNum);
  const driveImgs = getDriveImages(driveFolder);
  
  const allSrcs = [...existing, ...driveImgs];
  const unique = deduplicateByHash(allSrcs);
  
  // Reorder: put requested cover first
  let ordered = unique;
  if (coverIdx > 0 && coverIdx < ordered.length) {
    const cover = ordered.splice(coverIdx, 1)[0];
    ordered.unshift(cover);
  }
  
  return await rebuildDesign(designNum, ordered);
}

// Reorder images in a design (0-based index of new first image)
async function setFirstImage(designNum, newFirstIdx, rotateFirst = false, crop = false) {
  console.log(`\n↕ Design-${designNum}: setting image[${newFirstIdx}] as first (rotate=${rotateFirst}, crop=${crop})`);
  const existing = getDesignImages(designNum);
  if (existing.length === 0) { console.log('  ✗ No images found'); return []; }
  
  // Reorder
  const newFirst = existing.splice(newFirstIdx, 1)[0];
  const ordered = [newFirst, ...existing];
  
  const dir = path.join(PUB, `design-${designNum}`);
  const results = [];
  for (let i = 0; i < ordered.length; i++) {
    const num = String(i + 1).padStart(2, '0');
    const dest = path.join(dir, `${num}.jpg`);
    const src = ordered[i];
    if (i === 0) {
      await processImage(src, dest + '.tmp', { rotate: rotateFirst ? 90 : null, crop });
      fs.renameSync(dest + '.tmp', dest);
    } else if (src !== dest) {
      // Copy in place if different
      const tmp = dest + '.bak';
      fs.copyFileSync(src, tmp);
      fs.renameSync(tmp, dest);
    }
    results.push(`/wedding-invites/design-${designNum}/${num}.jpg`);
  }
  return results;
}

// Remove duplicate images within a design
async function removeDuplicatesInDesign(designNum) {
  console.log(`\n🔍 Design-${designNum}: removing duplicates`);
  const existing = getDesignImages(designNum);
  const unique = deduplicateByHash(existing);
  if (unique.length === existing.length) {
    console.log('  No duplicates found');
    return existing.map((_, i) => `/wedding-invites/design-${designNum}/${String(i+1).padStart(2,'0')}.jpg`);
  }
  console.log(`  Removed ${existing.length - unique.length} duplicates`);
  return await rebuildDesign(designNum, unique);
}

// Rotate specific image in place
async function rotateImage(fpath, degrees = 90) {
  const meta = await sharp(fpath).metadata();
  if (meta.width <= meta.height && degrees !== 270) {
    console.log(`  ↷ ${fpath}: already portrait, skip`);
    return;
  }
  const tmp = fpath + '.tmp';
  await sharp(fpath).rotate(degrees).jpeg({ quality: 92 }).toFile(tmp);
  fs.renameSync(tmp, fpath);
  const out = await sharp(fpath).metadata();
  console.log(`  ↷ rotated ${path.basename(fpath)}: ${out.width}x${out.height}`);
}

// Rotate all landscape images in a design
async function rotateAllLandscapeInDesign(designNum) {
  const existing = getDesignImages(designNum);
  for (const f of existing) {
    const meta = await sharp(f).metadata();
    if (meta.width > meta.height) {
      await rotateImage(f, 90);
    }
  }
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

const gallery = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// Helper to update gallery entry
function updateGalleryEntry(designNum, images) {
  const entry = gallery.wedding.find(w => w.designNumber === designNum);
  if (entry) {
    entry.images = images;
  } else {
    console.log(`  ⚠ No gallery entry for design-${designNum}`);
  }
}

// Helper to remove gallery entry
function removeGalleryEntry(designNum) {
  gallery.wedding = gallery.wedding.filter(w => w.designNumber !== designNum);
  console.log(`  🗑 Removed gallery entry for design-${designNum}`);
}

// ─── Step 1: ALREADY DONE in prior run ────────────────────────────────────
console.log('\n═══ STEP 1: Landscape rotation already done — skipping ═══');

// ─── Step 2a: ALREADY DONE — design-7 had 14 images written ───────────────
console.log('\n═══ STEP 2a: Design-7 already done ═══');

// ─── Steps 2b-2d: ALREADY DONE (designs 8, 9, 10 imported) ───────────────
console.log('\n═══ STEPS 2b-2d: Designs 8,9,10 already done ═══');

// ─── Step 2e: Design-11 — SKIP (file locked, handle manually later) ──────
console.log('\n═══ STEP 2e: Design-11 — SKIPPED (file locked by IDE) ═══');

// ─── Steps 2f-2h: ALREADY DONE (designs 12, 13, 14 imported) ────────────
console.log('\n═══ STEPS 2f-2h: Designs 12,13,14 already done ═══');

// ─── Step 3: Designs 19–33 — Drive import + cover reorder + dedup ─────────

console.log('\n═══ STEP 3a: Design-19 (Shaheer & Zainab) — Drive import + 3rd image first ═══');
{
  const existing = getDesignImages(19);
  const driveFiles = getDriveImages(19);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  // 3rd image (index 2) as first
  const cover = unique.splice(2, 1)[0];
  const ordered = [cover, ...unique];
  const imgs19 = await rebuildDesign(19, ordered);
  // Rotate all landscape
  await rotateAllLandscapeInDesign(19);
  updateGalleryEntry(19, imgs19.map((_, i) => `/wedding-invites/design-19/${String(i+1).padStart(2,'0')}.jpg`));
}

console.log('\n═══ STEP 3b: Design-20 — Drive import + 5th image first (rotate) ═══');
{
  const existing = getDesignImages(20);
  const driveFiles = getDriveImages(20);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  // 5th image (index 4) as first, rotate it
  const coverIdx = Math.min(4, unique.length - 1);
  const cover = unique.splice(coverIdx, 1)[0];
  const ordered = [cover, ...unique];
  const imgs20 = await rebuildDesign(20, ordered);
  // Rotate first image if landscape
  await rotateAllLandscapeInDesign(20);
  // Update with actual file count
  const actual20 = getDesignImages(20).map(f => `/wedding-invites/design-20/${path.basename(f)}`);
  updateGalleryEntry(20, actual20);
}

console.log('\n═══ STEP 3c: Design-21 — import Drive + remove duplicates ═══');
{
  const existing = getDesignImages(21);
  const driveFiles = getDriveImages(21);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const imgs21 = await rebuildDesign(21, unique);
  await rotateAllLandscapeInDesign(21);
  updateGalleryEntry(21, imgs21);
}

console.log('\n═══ STEP 3d: Design-22 — import Drive (missing images) ═══');
{
  const existing = getDesignImages(22);
  const driveFiles = getDriveImages(22);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const imgs22 = await rebuildDesign(22, unique);
  await rotateAllLandscapeInDesign(22);
  updateGalleryEntry(22, imgs22);
}

console.log('\n═══ STEP 3e: Design-23 — import Drive (missing images) ═══');
{
  const existing = getDesignImages(23);
  const driveFiles = getDriveImages(23);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const imgs23 = await rebuildDesign(23, unique);
  await rotateAllLandscapeInDesign(23);
  updateGalleryEntry(23, imgs23);
}

console.log('\n═══ STEP 3f: Design-24 (Amna Khan) — Drive import + remove dup (2&3) + 5th as first ═══');
{
  const existing = getDesignImages(24);
  const driveFiles = getDriveImages(24);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  // 5th image (index 4) as first
  const coverIdx = Math.min(4, unique.length - 1);
  const cover = unique.splice(coverIdx, 1)[0];
  const ordered = [cover, ...unique];
  const imgs24 = await rebuildDesign(24, ordered);
  await rotateAllLandscapeInDesign(24);
  updateGalleryEntry(24, imgs24);
}

console.log('\n═══ STEP 3g: Design-25 — import Drive (missing images) ═══');
{
  const existing = getDesignImages(25);
  const driveFiles = getDriveImages(25);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const imgs25 = await rebuildDesign(25, unique);
  await rotateAllLandscapeInDesign(25);
  updateGalleryEntry(25, imgs25);
}

console.log('\n═══ STEP 3h: Design-26 — import Drive + 5th image first ═══');
{
  const existing = getDesignImages(26);
  const driveFiles = getDriveImages(26);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const coverIdx = Math.min(4, unique.length - 1);
  const cover = unique.splice(coverIdx, 1)[0];
  const ordered = [cover, ...unique];
  const imgs26 = await rebuildDesign(26, ordered);
  await rotateAllLandscapeInDesign(26);
  updateGalleryEntry(26, imgs26);
}

console.log('\n═══ STEP 3i: Design-27 — import Drive (missing) + 3rd image first ═══');
{
  const existing = getDesignImages(27);
  const driveFiles = getDriveImages(27);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const coverIdx = Math.min(2, unique.length - 1);
  const cover = unique.splice(coverIdx, 1)[0];
  const ordered = [cover, ...unique];
  const imgs27 = await rebuildDesign(27, ordered);
  await rotateAllLandscapeInDesign(27);
  updateGalleryEntry(27, imgs27);
}

console.log('\n═══ STEP 3j: Design-28 — import Drive (missing) + 4th image first ═══');
{
  const existing = getDesignImages(28);
  const driveFiles = getDriveImages(28);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const coverIdx = Math.min(3, unique.length - 1);
  const cover = unique.splice(coverIdx, 1)[0];
  const ordered = [cover, ...unique];
  const imgs28 = await rebuildDesign(28, ordered);
  await rotateAllLandscapeInDesign(28);
  updateGalleryEntry(28, imgs28);
}

console.log('\n═══ STEP 3k: Design-29 — import Drive + 4th image first ═══');
{
  const existing = getDesignImages(29);
  const driveFiles = getDriveImages(29);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const coverIdx = Math.min(3, unique.length - 1);
  const cover = unique.splice(coverIdx, 1)[0];
  const ordered = [cover, ...unique];
  const imgs29 = await rebuildDesign(29, ordered);
  await rotateAllLandscapeInDesign(29);
  updateGalleryEntry(29, imgs29);
}

console.log('\n═══ STEP 3l: Design-30 — import Drive images ═══');
{
  const existing = getDesignImages(30);
  const driveFiles = getDriveImages(30);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const imgs30 = await rebuildDesign(30, unique);
  await rotateAllLandscapeInDesign(30);
  updateGalleryEntry(30, imgs30);
}

console.log('\n═══ STEP 3m: Design-31 — import Drive + remove duplicates ═══');
{
  const existing = getDesignImages(31);
  const driveFiles = getDriveImages(31);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const imgs31 = await rebuildDesign(31, unique);
  await rotateAllLandscapeInDesign(31);
  updateGalleryEntry(31, imgs31);
}

console.log('\n═══ STEP 3n: Design-32 — import Drive + 2nd image first ═══');
{
  const existing = getDesignImages(32);
  const driveFiles = getDriveImages(32);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const cover = unique.splice(1, 1)[0];
  const ordered = [cover, ...unique];
  const imgs32 = await rebuildDesign(32, ordered);
  await rotateAllLandscapeInDesign(32);
  updateGalleryEntry(32, imgs32);
}

console.log('\n═══ STEP 3o: Design-33 — import Drive + 4th image first ═══');
{
  const existing = getDesignImages(33);
  const driveFiles = getDriveImages(33);
  const allSrcs = [...existing, ...driveFiles];
  const unique = deduplicateByHash(allSrcs);
  const coverIdx = Math.min(3, unique.length - 1);
  const cover = unique.splice(coverIdx, 1)[0];
  const ordered = [cover, ...unique];
  const imgs33 = await rebuildDesign(33, ordered);
  await rotateAllLandscapeInDesign(33);
  updateGalleryEntry(33, imgs33);
}

// ─── Step 4: Designs 34–36 cover reorders ─────────────────────────────────

console.log('\n═══ STEP 4a: Design-34 — 2nd image first ═══');
{
  const existing = getDesignImages(34);
  const cover = existing.splice(1, 1)[0];
  const ordered = [cover, ...existing];
  const imgs34 = await rebuildDesign(34, ordered);
  await rotateAllLandscapeInDesign(34);
  updateGalleryEntry(34, imgs34);
}

console.log('\n═══ STEP 4b: Design-36 — 4th image first ═══');
{
  const existing = getDesignImages(36);
  const cover = existing.splice(3, 1)[0];
  const ordered = [cover, ...existing];
  const imgs36 = await rebuildDesign(36, ordered);
  await rotateAllLandscapeInDesign(36);
  updateGalleryEntry(36, imgs36);
}

// ─── Step 5: Merges ────────────────────────────────────────────────────────

// Merge TPS-WI-35 and TPS-WI-07 → keep design-7
console.log('\n═══ STEP 5a: Merge design-35 into design-7 ═══');
{
  const existing7 = getDesignImages(7);
  const existing35 = getDesignImages(35);
  const allSrcs = [...existing7, ...existing35];
  const unique = deduplicateByHash(allSrcs);
  const imgs7merged = await rebuildDesign(7, unique);
  await rotateAllLandscapeInDesign(7);
  updateGalleryEntry(7, imgs7merged);
  removeGalleryEntry(35);
}

// Merge TPS-WI-37 and TPS-WI-12 → keep design-12
console.log('\n═══ STEP 5b: Merge design-37 into design-12 ═══');
{
  const existing12 = getDesignImages(12);
  const existing37 = getDesignImages(37);
  const allSrcs = [...existing12, ...existing37];
  const unique = deduplicateByHash(allSrcs);
  const imgs12merged = await rebuildDesign(12, unique);
  await rotateAllLandscapeInDesign(12);
  updateGalleryEntry(12, imgs12merged);
  removeGalleryEntry(37);
}

// Merge TPS-WI-38 + TPS-WI-48 + TPS-WI-13 → keep design-13
console.log('\n═══ STEP 5c: Merge design-38 + design-48 + design-13 ═══');
{
  const existing13 = getDesignImages(13);
  const existing38 = getDesignImages(38);
  const existing48 = getDesignImages(48);
  const allSrcs = [...existing13, ...existing38, ...existing48];
  const unique = deduplicateByHash(allSrcs);
  const imgs13merged = await rebuildDesign(13, unique);
  await rotateAllLandscapeInDesign(13);
  updateGalleryEntry(13, imgs13merged);
  removeGalleryEntry(38);
  removeGalleryEntry(48);
}

// Merge design-44 into design-19 (same Shaheer & Zainab suite)
console.log('\n═══ STEP 5d: Merge design-44 into design-19 (same suite) ═══');
{
  const existing19 = getDesignImages(19);
  const existing44 = getDesignImages(44);
  const allSrcs = [...existing19, ...existing44];
  const unique = deduplicateByHash(allSrcs);
  const imgs19merged = await rebuildDesign(19, unique);
  await rotateAllLandscapeInDesign(19);
  updateGalleryEntry(19, imgs19merged);
  removeGalleryEntry(44);
}

// Merge design-5 + design-15 + design-40 → keep design-5, use design-40/01.jpg as cover
console.log('\n═══ STEP 5e: Merge design-5+15+40 (Gursimran & Avneet) ═══');
{
  const cover40 = path.join(PUB, 'design-40', '01.jpg');
  const existing5 = getDesignImages(5);
  const existing15 = getDesignImages(15);
  const existing40 = getDesignImages(40);
  const allSrcs = [...existing5, ...existing15, ...existing40];
  const unique = deduplicateByHash(allSrcs);
  const coverHash = fileHash(cover40);
  const ordered = [cover40, ...unique.filter(p => fileHash(p) !== coverHash)];
  const imgs5merged = await rebuildDesign(5, ordered);
  await rotateAllLandscapeInDesign(5);
  updateGalleryEntry(5, imgs5merged);
  removeGalleryEntry(15);
  removeGalleryEntry(40);
}

// Merge design-16 + design-41 → keep design-16
console.log('\n═══ STEP 5f: Merge design-41 into design-16 ═══');
{
  const existing16 = getDesignImages(16);
  const existing41 = getDesignImages(41);
  const allSrcs = [...existing16, ...existing41];
  const unique = deduplicateByHash(allSrcs);
  const imgs16merged = await rebuildDesign(16, unique);
  await rotateAllLandscapeInDesign(16);
  updateGalleryEntry(16, imgs16merged);
  removeGalleryEntry(41);
}

// ─── Step 6: Final gallery JSON cleanup — update all image paths ───────────
console.log('\n═══ STEP 6: Cleaning .bak files and syncing gallery JSON ═══');

// Clean up any .bak files left over from Windows file locking
for (const d of fs.readdirSync(PUB)) {
  const dir = path.join(PUB, d);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.bak')) {
      try { fs.unlinkSync(path.join(dir, f)); console.log(`  🗑 deleted ${d}/${f}`); }
      catch { /* locked, ignore */ }
    }
  }
}
for (const entry of gallery.wedding) {
  const dn = entry.designNumber;
  const dir = path.join(PUB, `design-${dn}`);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => /^\d+\.jpg$/.test(f)).sort();
  entry.images = files.map(f => `/wedding-invites/design-${dn}/${f}`);
  console.log(`  design-${dn}: ${files.length} images`);
}

// Write updated gallery JSON
fs.writeFileSync(JSON_PATH, JSON.stringify(gallery, null, 2));
console.log('\n✅ Gallery JSON updated');

// ─── Step 7: Final rotation pass on all designs ────────────────────────────
console.log('\n═══ STEP 7: Final rotation check on all designs ═══');
const allDesigns = fs.readdirSync(PUB).filter(d => d.startsWith('design-')).map(d => parseInt(d.replace('design-', '')));
for (const dn of allDesigns.sort((a,b) => a-b)) {
  await rotateAllLandscapeInDesign(dn);
}

console.log('\n\n✅✅✅ ALL DONE — now run: npm run build && git add -A && git commit -m "fix: complete wedding invitation overhaul" && npx vercel --prod --yes');
