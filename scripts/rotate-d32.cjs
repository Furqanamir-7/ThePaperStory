const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUB_D32 = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story\\public\\wedding-invites\\design-32';

async function rotateDesign32() {
  console.log('Rotating Design 32 images by 270 degrees...');
  for (const f of ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg']) {
    const filePath = path.join(PUB_D32, f);
    if (!fs.existsSync(filePath)) continue;
    const buf = fs.readFileSync(filePath);
    const rotated = await sharp(buf)
      .rotate(270)
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(filePath, rotated);
    console.log(`  Rotated ${f}`);
  }
}

rotateDesign32().catch(console.error);
