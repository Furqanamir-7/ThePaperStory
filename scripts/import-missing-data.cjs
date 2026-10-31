const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const convert = require('heic-convert');

const ROOT = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story';
const PUBLIC = path.join(ROOT, 'public');

const SRC_PART2 = 'D:\\projects\\The Paper Story-20261031T042156Z-1-002\\The Paper Story';
const SRC_PART1 = 'D:\\projects\\The Paper Story-20261031T042156Z-1-001\\The Paper Story';
const SRC_DATA = 'C:\\Users\\Furqan\\Desktop\\The Paper Story - Data';

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']);
const globalHashes = new Set();

function hashBuffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

// Index all existing images in public to guarantee no duplicates
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

// 1. Check Wedding Invitations (specifically Design 13 and others with missing slots)
async function updateWeddingInvitations() {
  console.log('\n--- Checking Wedding Invitations ---');
  const updatedDesigns = {};

  for (let num = 1; num <= 33; num++) {
    const destDir = path.join(PUBLIC, 'wedding-invites', `design-${num}`);
    fs.mkdirSync(destDir, { recursive: true });

    const existingFiles = fs.readdirSync(destDir).filter((f) => /\.(jpe?g|png)$/i.test(f));
    const currentCount = existingFiles.length;

    if (currentCount < 5) {
      // Look for candidates in Part 2 and Part 1
      const dirs = [
        path.join(SRC_PART2, 'Wedding Invitation', String(num)),
        path.join(SRC_PART1, 'Wedding Invitation', String(num)),
      ];

      const candidates = [];
      for (const d of dirs) {
        if (!fs.existsSync(d)) continue;
        for (const f of fs.readdirSync(d)) {
          if (IMAGE_EXTS.has(path.extname(f).toLowerCase())) {
            candidates.push(path.join(d, f));
          }
        }
      }

      let added = 0;
      for (const cand of candidates) {
        if (currentCount + added >= 5) break;
        try {
          const buf = await loadBuffer(cand);
          const hash = hashBuffer(buf);
          if (globalHashes.has(hash)) continue;

          globalHashes.add(hash);
          added++;
          const nextIndex = currentCount + added;
          const outName = `${String(nextIndex).padStart(2, '0')}.jpg`;
          const outPath = path.join(destDir, outName);
          await processImage(buf, outPath);
          console.log(`  Added image to Wedding Design ${num}: ${outName}`);
        } catch (e) {
          console.warn(`  Warning on ${cand}: ${e.message}`);
        }
      }

      if (added > 0) {
        console.log(`  Design ${num} now has ${currentCount + added} images (added ${added})`);
      }
    }

    // Refresh final list
    const finalFiles = fs
      .readdirSync(destDir)
      .filter((f) => /\.(jpe?g|png)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/wedding-invites/design-${num}/${f}`);

    updatedDesigns[num] = {
      designNumber: num,
      name: `Design ${num}`,
      images: finalFiles,
    };
  }

  return Object.values(updatedDesigns);
}

// 2. Add New Tin Favours: Mithai Favours Tin Box 2
async function updateTinFavours() {
  console.log('\n--- Checking Tin Favours ---');
  const tin2Src = path.join(SRC_PART2, 'Mithai Favours Tin Boxes', '2');
  const tin2Dest = path.join(PUBLIC, 'favours', 'mithai-tin-2');
  const images = [];

  if (fs.existsSync(tin2Src)) {
    fs.mkdirSync(tin2Dest, { recursive: true });
    let idx = 1;
    for (const f of fs.readdirSync(tin2Src)) {
      if (!IMAGE_EXTS.has(path.extname(f).toLowerCase())) continue;
      const full = path.join(tin2Src, f);
      try {
        const buf = await loadBuffer(full);
        const hash = hashBuffer(buf);
        if (globalHashes.has(hash)) continue;
        globalHashes.add(hash);

        const outName = `${String(idx++).padStart(2, '0')}.jpg`;
        await processImage(buf, path.join(tin2Dest, outName));
        images.push(`/favours/mithai-tin-2/${outName}`);
      } catch (e) {}
    }
    console.log(`  Mithai Tin Box Style 2: imported ${images.length} images`);
  }

  return images.length ? { name: 'Mithai Favour Tin Box - Style 2', images } : null;
}

// 3. Flower Shaped Favours (add extra photos from Part 2)
async function updateFlowerShapedFavours() {
  console.log('\n--- Checking Flower Shaped Favours ---');
  const src = path.join(SRC_PART2, 'Favours', 'Flower Shaped Favors');
  const dest = path.join(PUBLIC, 'favours', 'flower-shaped-favours');
  fs.mkdirSync(dest, { recursive: true });

  const existing = fs.readdirSync(dest).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let idx = existing.length + 1;
  const newImages = [];

  if (fs.existsSync(src)) {
    for (const f of fs.readdirSync(src)) {
      if (!IMAGE_EXTS.has(path.extname(f).toLowerCase())) continue;
      const full = path.join(src, f);
      try {
        const buf = await loadBuffer(full);
        const hash = hashBuffer(buf);
        if (globalHashes.has(hash)) continue;
        globalHashes.add(hash);

        const outName = `${String(idx++).padStart(2, '0')}.jpg`;
        await processImage(buf, path.join(dest, outName));
        newImages.push(`/favours/flower-shaped-favours/${outName}`);
      } catch (e) {}
    }
  }

  const all = fs
    .readdirSync(dest)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort()
    .map((f) => `/favours/flower-shaped-favours/${f}`);
  console.log(`  Flower Shaped Favours: total ${all.length} photos (added ${newImages.length})`);
  return { name: 'Flower Shaped Favour Box', images: all };
}

// 4. Packaging: Customised Paper Bags 1, Gift Tags 1, Customised Stickers
async function updatePackaging() {
  console.log('\n--- Checking Packaging ---');
  const items = [];

  // Paper Bags 1
  const pb1Src = path.join(SRC_PART2, 'packaging', 'Customised Paper Bags', '1');
  const pb1Dest = path.join(PUBLIC, 'packaging', 'paper-bags-design-1');
  if (fs.existsSync(pb1Src)) {
    const images = [];
    fs.mkdirSync(pb1Dest, { recursive: true });
    let idx = 1;
    for (const f of fs.readdirSync(pb1Src)) {
      if (!IMAGE_EXTS.has(path.extname(f).toLowerCase())) continue;
      const buf = await loadBuffer(path.join(pb1Src, f));
      const hash = hashBuffer(buf);
      if (globalHashes.has(hash)) continue;
      globalHashes.add(hash);
      const outName = `${String(idx++).padStart(2, '0')}.jpg`;
      await processImage(buf, path.join(pb1Dest, outName));
      images.push(`/packaging/paper-bags-design-1/${outName}`);
    }
    if (images.length) {
      items.push({ name: 'Customised Luxury Paper Bags - Style 1', images });
      console.log(`  Paper Bags Style 1: ${images.length} images`);
    }
  }

  // Gift Tags 1
  const gt1Src = path.join(SRC_PART2, 'packaging', 'Gift tags', '1');
  const gt1Dest = path.join(PUBLIC, 'packaging', 'gift-tags-collection-1');
  if (fs.existsSync(gt1Src)) {
    const images = [];
    fs.mkdirSync(gt1Dest, { recursive: true });
    let idx = 1;
    for (const f of fs.readdirSync(gt1Src)) {
      if (!IMAGE_EXTS.has(path.extname(f).toLowerCase())) continue;
      try {
        const buf = await loadBuffer(path.join(gt1Src, f));
        const hash = hashBuffer(buf);
        if (globalHashes.has(hash)) continue;
        globalHashes.add(hash);
        const outName = `${String(idx++).padStart(2, '0')}.jpg`;
        await processImage(buf, path.join(gt1Dest, outName));
        images.push(`/packaging/gift-tags-collection-1/${outName}`);
      } catch (e) {}
    }
    if (images.length) {
      items.push({ name: 'Artisan Gift & Event Tags - Collection 1', images });
      console.log(`  Gift Tags Collection 1: ${images.length} images`);
    }
  }

  // Customised Stickers
  const csSrc = path.join(SRC_PART2, 'packaging', 'Customised Stickers');
  const csDest = path.join(PUBLIC, 'packaging', 'custom-stickers');
  if (fs.existsSync(csSrc)) {
    const images = [];
    fs.mkdirSync(csDest, { recursive: true });
    let idx = 1;
    for (const f of fs.readdirSync(csSrc)) {
      if (!IMAGE_EXTS.has(path.extname(f).toLowerCase())) continue;
      const buf = await loadBuffer(path.join(csSrc, f));
      const hash = hashBuffer(buf);
      if (globalHashes.has(hash)) continue;
      globalHashes.add(hash);
      const outName = `${String(idx++).padStart(2, '0')}.jpg`;
      await processImage(buf, path.join(csDest, outName));
      images.push(`/packaging/custom-stickers/${outName}`);
    }
    if (images.length) {
      items.push({ name: 'Bespoke Customised Stickers', images });
      console.log(`  Customised Stickers: ${images.length} images`);
    }
  }

  return items;
}

// 5. Postcards (expand from 2 to 5 postcards)
async function updatePostcards() {
  console.log('\n--- Checking Postcards ---');
  const src = path.join(SRC_PART2, 'Postcards');
  const dest = path.join(PUBLIC, 'postcards', 'artisan-collection');
  fs.mkdirSync(dest, { recursive: true });

  const existing = fs.readdirSync(dest).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let idx = existing.length + 1;

  if (fs.existsSync(src)) {
    for (const f of fs.readdirSync(src)) {
      if (!IMAGE_EXTS.has(path.extname(f).toLowerCase())) continue;
      try {
        const buf = await loadBuffer(path.join(src, f));
        const hash = hashBuffer(buf);
        if (globalHashes.has(hash)) continue;
        globalHashes.add(hash);

        const outName = `${String(idx++).padStart(2, '0')}.jpg`;
        await processImage(buf, path.join(dest, outName));
        console.log(`  Added Postcard: ${outName}`);
      } catch (e) {}
    }
  }

  const all = fs
    .readdirSync(dest)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort()
    .map((f) => `/postcards/artisan-collection/${f}`);
  console.log(`  Postcards: total ${all.length} photos`);
  return { name: 'Artisan Aesthetic Postcards', images: all };
}

// 6. Nikkahnama (add Nikkahnama 1 and 3)
async function updateNikkahnama() {
  console.log('\n--- Checking Nikkahnama ---');
  const n1Src = path.join(SRC_PART2, 'Nikkahnama', '1');
  const n3Src = path.join(SRC_PART2, 'Nikkahnama', '3');
  const dest = path.join(PUBLIC, 'nikkah', 'printed-custom');
  fs.mkdirSync(dest, { recursive: true });

  const existing = fs.readdirSync(dest).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let idx = existing.length + 1;

  for (const src of [n1Src, n3Src]) {
    if (!fs.existsSync(src)) continue;
    for (const f of fs.readdirSync(src)) {
      if (!IMAGE_EXTS.has(path.extname(f).toLowerCase())) continue;
      try {
        const buf = await loadBuffer(path.join(src, f));
        const hash = hashBuffer(buf);
        if (globalHashes.has(hash)) continue;
        globalHashes.add(hash);
        const outName = `${String(idx++).padStart(2, '0')}.jpg`;
        await processImage(buf, path.join(dest, outName));
        console.log(`  Added Nikkahnama image: ${outName}`);
      } catch (e) {}
    }
  }

  const all = fs
    .readdirSync(dest)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort()
    .map((f) => `/nikkah/printed-custom/${f}`);
  console.log(`  Nikkahnama: total ${all.length} photos`);
  return [{ name: 'Custom Calligraphy Nikkah Certificate', images: all }];
}

// 7. Customised Wax Seals (add root photos)
async function updateWaxSeals() {
  console.log('\n--- Checking Wax Seals ---');
  const dest = path.join(PUBLIC, 'wax-seals', 'seal-4');
  fs.mkdirSync(dest, { recursive: true });

  const rootPhotos = [
    path.join(SRC_PART2, 'Customised Wax Seal', 'SETE8766.JPG'),
    path.join(SRC_PART2, 'Customised Wax Seal', 'XTOM9156.JPG'),
  ];

  let idx = 1;
  const images = [];
  for (const photo of rootPhotos) {
    if (!fs.existsSync(photo)) continue;
    try {
      const buf = await loadBuffer(photo);
      const hash = hashBuffer(buf);
      if (globalHashes.has(hash)) continue;
      globalHashes.add(hash);
      const outName = `${String(idx++).padStart(2, '0')}.jpg`;
      await processImage(buf, path.join(dest, outName));
      images.push(`/wax-seals/seal-4/${outName}`);
    } catch (e) {}
  }

  if (images.length) {
    console.log(`  Wax Seal Collection 4: ${images.length} images`);
    return { name: 'Custom Wax Seal - Collection 4', images };
  }
  return null;
}

// Master execution
async function main() {
  console.log('=== Integrating Missing Data from Part 2 ===');
  indexPublicImages();

  const wedding = await updateWeddingInvitations();
  const tin2 = await updateTinFavours();
  const flowerBox = await updateFlowerShapedFavours();
  const newPackaging = await updatePackaging();
  const postcards = await updatePostcards();
  const nikkahnama = await updateNikkahnama();
  const wax4 = await updateWaxSeals();

  // Update imported-desktop-gallery.json
  const manifestPath = path.join(ROOT, 'src', 'data', 'imported-desktop-gallery.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  manifest.wedding = wedding;

  if (tin2 && !manifest.favours['tin-favours'].some((t) => t.name === tin2.name)) {
    manifest.favours['tin-favours'].push(tin2);
  }

  const flowerIdx = manifest.favours['box-favours'].findIndex(
    (b) => b.name === flowerBox.name
  );
  if (flowerIdx >= 0) {
    manifest.favours['box-favours'][flowerIdx] = flowerBox;
  } else {
    manifest.favours['box-favours'].push(flowerBox);
  }

  for (const pkg of newPackaging) {
    if (!manifest.packaging.some((p) => p.name === pkg.name)) {
      manifest.packaging.push(pkg);
    }
  }

  manifest.eidiCards.postcards = [postcards];
  manifest.nikkahnama = nikkahnama;

  if (wax4 && !manifest.waxSeals.some((w) => w.name === wax4.name)) {
    manifest.waxSeals.push(wax4);
  }

  manifest.updatedAt = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  console.log('\nUpdated manifest saved successfully to:', manifestPath);
  console.log('Total Wedding Designs:', manifest.wedding.length);
  console.log('Total Wax Seal Collections:', manifest.waxSeals.length);
  console.log('Total Tin Favours:', manifest.favours['tin-favours'].length);
  console.log('Total Packaging Products:', manifest.packaging.length);
  console.log('Total Postcards:', postcards.images.length);
  console.log('Total Nikkahnama photos:', nikkahnama[0].images.length);
}

main().catch((err) => {
  console.error('Fatal error in import-missing-data:', err);
  process.exit(1);
});
