import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROTATIONS = [
  // 90 deg clockwise
  { dir: 'design-6', files: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'], angle: 90 },
  { dir: 'design-17', files: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'], angle: 90 },
  { dir: 'design-21', files: ['02.jpg'], angle: 90 },
  { dir: 'design-22', files: ['01.jpg', '05.jpg'], angle: 90 },
  { dir: 'design-27', files: ['01.jpg'], angle: 90 },
  { dir: 'design-28', files: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'], angle: 90 },
  { dir: 'design-42', files: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'], angle: 90 },

  // 270 deg clockwise (90 CCW)
  { dir: 'design-25', files: ['04.jpg', '05.jpg'], angle: 270 },
  { dir: 'design-32', files: ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'], angle: 270 },
];

async function run() {
  for (const item of ROTATIONS) {
    for (const f of item.files) {
      const p = path.join('public/wedding-invites', item.dir, f);
      if (!fs.existsSync(p)) continue;
      const buf = fs.readFileSync(p);
      const rotated = await sharp(buf)
        .rotate(item.angle)
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
      fs.writeFileSync(p, rotated);
      const meta = await sharp(rotated).metadata();
      console.log(`Rotated ${item.dir}/${f} by ${item.angle}° -> ${meta.width}x${meta.height}`);
    }
  }
}
run().catch(console.error);

