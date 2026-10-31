const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const convert = require('heic-convert');

const ROOT = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story';
const PUBLIC = path.join(ROOT, 'public');

const SRC_PART2 = 'D:\\projects\\The Paper Story-20261031T042156Z-1-002\\The Paper Story';
const SRC_PART1 = 'D:\\projects\\The Paper Story-20261031T042156Z-1-001\\The Paper Story';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']);
const globalHashes = new Set();

function hashBuffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function indexPublicImages() {
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (IMAGE_EXTS.has(path.extname(e.name).toLowerCase())) {
        try {
          const buf = fs.readFileSync(full);
          globalHashes.add(hashBuffer(buf));
        } catch (e) {}
      }
    }
  }
  walk(PUBLIC);
  console.log(`Indexed ${globalHashes.size} existing images in public.`);
}

async function loadBuffer(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let raw = fs.readFileSync(filePath);
  if (ext === '.heic' || ext === '.heif') {
    const converted = await convert({ buffer: raw, format: 'JPEG', quality: 0.9 });
    return Buffer.from(converted);
  }
  return raw;
}

async function processImage(inputBuffer, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await sharp(inputBuffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outputPath);
}

// Helper to import best images from multiple possible source folders
async function importFolderImages({ sourceRels, destSubdir, maxCount = 5, name }) {
  const destDir = path.join(PUBLIC, destSubdir);
  fs.mkdirSync(destDir, { recursive: true });

  const existingFiles = fs.readdirSync(destDir).filter(f => /\.(jpe?g|png)$/i.test(f));
  let idx = existingFiles.length + 1;
  const newImages = [];

  const candidates = [];
  for (const rel of sourceRels) {
    for (const base of [SRC_PART2, SRC_PART1]) {
      const dir = path.join(base, rel);
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (!IMAGE_EXTS.has(path.extname(f).toLowerCase())) continue;
        const full = path.join(dir, f);
        try {
          const stat = fs.statSync(full);
          candidates.push({ full, size: stat.size, name: f });
        } catch (e) {}
      }
    }
  }

  // Deduplicate candidate filenames and pick largest non-duplicate files
  // Prioritize non-IMG_E unless only IMG_E exists
  candidates.sort((a, b) => {
    const aIsE = a.name.startsWith('IMG_E') ? 1 : 0;
    const bIsE = b.name.startsWith('IMG_E') ? 1 : 0;
    if (aIsE !== bIsE) return aIsE - bIsE;
    return b.size - a.size;
  });

  const seenCand = new Set();
  const dedupedCandidates = [];
  for (const c of candidates) {
    if (seenCand.has(c.name)) continue;
    seenCand.add(c.name);
    dedupedCandidates.push(c);
  }

  for (const cand of dedupedCandidates) {
    if (existingFiles.length + newImages.length >= maxCount) break;
    try {
      const buf = await loadBuffer(cand.full);
      const hash = hashBuffer(buf);
      if (globalHashes.has(hash)) continue;
      globalHashes.add(hash);

      const outName = `${String(idx++).padStart(2, '0')}.jpg`;
      const outPath = path.join(destDir, outName);
      await processImage(buf, outPath);
      newImages.push(`/${destSubdir.replace(/\\/g, '/')}/${outName}`);
      console.log(`  [${name}] Added ${outName} from ${path.basename(cand.full)}`);
    } catch (e) {
      console.warn(`  Warning processing ${cand.full}: ${e.message}`);
    }
  }

  const allImages = fs.readdirSync(destDir)
    .filter(f => /\.(jpe?g|png)$/i.test(f))
    .sort()
    .map(f => `/${destSubdir.replace(/\\/g, '/')}/${f}`);

  console.log(`  => ${name}: total ${allImages.length} images (added ${newImages.length})`);
  return allImages.length ? { name, images: allImages } : null;
}

async function main() {
  console.log('=== Complete Data Import of Remaining Folders ===');
  indexPublicImages();

  const manifestPath = path.join(ROOT, 'src', 'data', 'imported-desktop-gallery.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // 1. Eid Cards
  console.log('\n--- Importing Eid Cards ---');
  const eidCards = await importFolderImages({
    sourceRels: ['Eid Cards'],
    destSubdir: 'eidi-envelopes/eid-cards',
    maxCount: 2,
    name: 'Artisan Eid Calligraphy Greeting Cards'
  });

  // 2. Ramadan Calendar
  console.log('\n--- Importing Ramadan Calendar ---');
  const ramadanCal = await importFolderImages({
    sourceRels: ['Ramadan Calendar'],
    destSubdir: 'stationary/ramadan-calendar',
    maxCount: 3,
    name: 'Bespoke Ramadan Calendar & Daily Tracker'
  });

  // 3. Money Envelopes (Style 1 and Style 2)
  console.log('\n--- Importing Money Envelopes ---');
  const moneyEnv1 = await importFolderImages({
    sourceRels: ['Money Envelope/1'],
    destSubdir: 'eidi-envelopes/money-envelope-1',
    maxCount: 2,
    name: 'Luxury Artisan Money Envelope - Style 1'
  });
  const moneyEnv2 = await importFolderImages({
    sourceRels: ['Money Envelope/2'],
    destSubdir: 'eidi-envelopes/money-envelope-2',
    maxCount: 5,
    name: 'Luxury Artisan Money Envelope - Style 2'
  });

  // 4. Favours: Round Tin & Box Favours
  console.log('\n--- Importing Remaining Favours ---');
  const roundTin = await importFolderImages({
    sourceRels: ['Favours/Round Tin'],
    destSubdir: 'favours/round-tin',
    maxCount: 5,
    name: 'Round Metallic Mithai & Bid Tin'
  });
  const luxuryBoxFavours = await importFolderImages({
    sourceRels: ['Favours/Box Favours'],
    destSubdir: 'favours/luxury-box-favours',
    maxCount: 3,
    name: 'Luxury Handcrafted Box Favours'
  });

  // 5. Nikkahnama (Root collection)
  console.log('\n--- Importing Root Nikkahnama ---');
  const rootNikkah = await importFolderImages({
    sourceRels: ['Nikkahnama'],
    destSubdir: 'nikkah/calligraphy-certificate',
    maxCount: 3,
    name: 'Islamic Calligraphy Nikkah Certificate Suite'
  });

  // 6. Packaging Folders
  console.log('\n--- Importing Packaging Folders ---');
  const nikkahTags = await importFolderImages({
    sourceRels: ['packaging/Nikkah Tags'],
    destSubdir: 'packaging/nikkah-tags',
    maxCount: 5,
    name: 'Traditional Nikkah & Event Tags'
  });
  const bizCards1 = await importFolderImages({
    sourceRels: ['packaging/Business Cards/1', 'packaging/Business Cards'],
    destSubdir: 'packaging/business-cards-1',
    maxCount: 5,
    name: 'Artisan Custom Business Cards - Collection 1'
  });
  const bizCards2 = await importFolderImages({
    sourceRels: ['packaging/Business Cards/2'],
    destSubdir: 'packaging/business-cards-2',
    maxCount: 5,
    name: 'Artisan Custom Business Cards - Collection 2'
  });
  const paperBags2 = await importFolderImages({
    sourceRels: ['packaging/Customised Paper Bags/2'],
    destSubdir: 'packaging/paper-bags-style-2',
    maxCount: 3,
    name: 'Customised Luxury Paper Bags - Style 2'
  });
  const paperBags3 = await importFolderImages({
    sourceRels: ['packaging/Customised Paper Bags/3'],
    destSubdir: 'packaging/paper-bags-style-3',
    maxCount: 4,
    name: 'Customised Luxury Paper Bags - Style 3'
  });
  const paperBags4 = await importFolderImages({
    sourceRels: ['packaging/Customised Paper Bags/4'],
    destSubdir: 'packaging/paper-bags-style-4',
    maxCount: 3,
    name: 'Customised Luxury Paper Bags - Style 4'
  });
  const eventStickers = await importFolderImages({
    sourceRels: ['packaging/Stickers', 'packaging/1'],
    destSubdir: 'packaging/event-stickers',
    maxCount: 5,
    name: 'Bespoke Event & Gift Stickers'
  });
  const giftTags2 = await importFolderImages({
    sourceRels: ['packaging/Gift tags/2'],
    destSubdir: 'packaging/gift-tags-collection-2',
    maxCount: 5,
    name: 'Luxury Event Gift Tags - Collection 2'
  });

  // Save updates into manifest
  manifest.extra = manifest.extra || {};
  if (eidCards) manifest.extra.eidCards = eidCards;
  if (ramadanCal) manifest.extra.ramadanCalendar = ramadanCal;
  if (moneyEnv1) manifest.extra.moneyEnvelope1 = moneyEnv1;
  if (moneyEnv2) manifest.extra.moneyEnvelope2 = moneyEnv2;

  if (roundTin && !manifest.favours['tin-favours'].some(t => t.name === roundTin.name)) {
    manifest.favours['tin-favours'].push(roundTin);
  }
  if (luxuryBoxFavours && !manifest.favours['box-favours'].some(b => b.name === luxuryBoxFavours.name)) {
    manifest.favours['box-favours'].push(luxuryBoxFavours);
  }

  if (rootNikkah && !manifest.nikkahnama.some(n => n.name === rootNikkah.name)) {
    manifest.nikkahnama.push(rootNikkah);
  }

  const newPackaging = [
    nikkahTags,
    bizCards1,
    bizCards2,
    paperBags2,
    paperBags3,
    paperBags4,
    eventStickers,
    giftTags2
  ].filter(Boolean);

  for (const pkg of newPackaging) {
    const idx = manifest.packaging.findIndex(p => p.name === pkg.name);
    if (idx >= 0) {
      manifest.packaging[idx] = pkg;
    } else {
      manifest.packaging.push(pkg);
    }
  }

  manifest.updatedAt = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log('\nManifest successfully updated with all newly integrated assets!');
}

main().catch(err => {
  console.error('Fatal import error:', err);
  process.exit(1);
});
