import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import convert from 'heic-convert';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

const ROOT = process.cwd();
const PUBLIC_ADDONS = path.join(ROOT, 'public', 'add-ons');

const FOLDERS = [
  {
    name: 'Oval Shape insert',
    src: 'C:\\Users\\Furqan\\Desktop\\Oval Shape insert',
    targetSub: 'oval-insert',
  },
  {
    name: 'Envelope liner',
    src: 'C:\\Users\\Furqan\\Desktop\\Envelope liner',
    targetSub: 'envelope-liner',
  },
  {
    name: 'Sticker Seal',
    src: 'C:\\Users\\Furqan\\Desktop\\Sticker Seal',
    targetSub: 'sticker-seal',
  },
  {
    name: 'ARCH SHAPE INSERT',
    src: 'C:\\Users\\Furqan\\Desktop\\ARCH SHAPE INSERT',
    targetSub: 'arch-shape-insert',
  },
  {
    name: 'Embossing',
    src: 'C:\\Users\\Furqan\\Desktop\\Embossing',
    targetSub: 'embossing',
  },
  {
    name: 'Belly Band',
    src: 'C:\\Users\\Furqan\\Desktop\\Belly Band',
    targetSub: 'name-belly-band',
  },
  {
    name: 'Printed ButterVellum Paper Belly band',
    src: 'C:\\Users\\Furqan\\Desktop\\Printed ButterVellum Paper Belly band',
    targetSub: 'butter-vellum-belly-band',
  },
];

async function processFolder({ name, src, targetSub }) {
  if (!fs.existsSync(src)) {
    console.log(`[SKIP] Missing folder: ${src}`);
    return [];
  }

  const outDir = path.join(PUBLIC_ADDONS, targetSub);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const entries = fs.readdirSync(src).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  const resultFiles = [];

  let imgIdx = 1;
  let vidIdx = 1;

  for (const file of entries) {
    const fullPath = path.join(src, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) continue;

    const ext = path.extname(file).toLowerCase();

    // Videos (.mov, .mp4)
    if (ext === '.mov' || ext === '.mp4') {
      const outName = `video-${String(vidIdx++).padStart(2, '0')}.mp4`;
      const outPath = path.join(outDir, outName);

      console.log(`  Encoding video: ${file} -> ${outName}`);
      try {
        execSync(
          `"${ffmpegStatic}" -i "${fullPath}" -c:v libx264 -pix_fmt yuv420p -crf 23 -preset fast -vf "scale='min(1080,iw)':-2" -c:a aac -b:a 128k -movflags +faststart -y "${outPath}"`,
          { stdio: 'ignore' }
        );
        resultFiles.push(`/add-ons/${targetSub}/${outName}`);
      } catch (err) {
        console.error(`    Error encoding video ${file}:`, err.message);
      }
      continue;
    }

    // Images (.heic, .jpg, .jpeg, .png)
    if (ext === '.heic' || ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const outName = `img-${String(imgIdx++).padStart(2, '0')}.jpg`;
      const outPath = path.join(outDir, outName);

      console.log(`  Processing image: ${file} -> ${outName}`);
      try {
        let buf;
        if (ext === '.heic') {
          const raw = fs.readFileSync(fullPath);
          buf = await convert({
            buffer: raw,
            format: 'JPEG',
            quality: 0.92,
          });
        } else {
          buf = fs.readFileSync(fullPath);
        }

        await sharp(buf)
          .rotate()
          .resize({
            width: 1600,
            height: 1600,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: 88, mozjpeg: true })
          .toFile(outPath);

        resultFiles.push(`/add-ons/${targetSub}/${outName}`);
      } catch (err) {
        console.error(`    Error processing image ${file}:`, err.message);
      }
    }
  }

  return resultFiles;
}

async function main() {
  console.log('Starting conversion of newly provided add-on folders...');
  const manifest = {};
  for (const f of FOLDERS) {
    console.log(`\n=== Folder: ${f.name} -> public/add-ons/${f.targetSub} ===`);
    const files = await processFolder(f);
    manifest[f.targetSub] = files;
    console.log(`  Done: ${files.length} assets created for ${f.targetSub}`);
  }

  const manifestPath = path.join(ROOT, 'scripts', '_addons_manifest_new.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('\nSaved results to scripts/_addons_manifest_new.json');
}

main().catch(console.error);

