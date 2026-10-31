const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUB = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story\\public\\wedding-invites\\design-32';
const SCRATCH = 'C:\\Users\\Furqan\\.gemini\\antigravity-ide\\scratch\\wedding-preview';

async function testRotation() {
  for (const f of ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg']) {
    const full = path.join(PUB, f);
    // Try rotate 270 degrees (90 deg counter-clockwise)
    await sharp(full)
      .rotate(270)
      .resize(400, 500, { fit: 'cover' })
      .toFile(path.join(SCRATCH, `d32_rot270_${f}`));
    // Try rotate 90 degrees clockwise
    await sharp(full)
      .rotate(90)
      .resize(400, 500, { fit: 'cover' })
      .toFile(path.join(SCRATCH, `d32_rot90_${f}`));
  }
  console.log('Rotated previews generated.');
}

testRotation().catch(console.error);
