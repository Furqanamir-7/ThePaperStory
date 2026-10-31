import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const att2 = 'C:\\Users\\Furqan\\.gemini\\antigravity\\brain\\281de72f-d9c0-48fa-9a4c-ada104e0368e\\.user_uploaded\\media_1793472523403_fb0579ca.jpg';
const att3 = 'C:\\Users\\Furqan\\.gemini\\antigravity\\brain\\281de72f-d9c0-48fa-9a4c-ada104e0368e\\.user_uploaded\\media_1793472555133_6e005175.jpg';
const att4 = 'C:\\Users\\Furqan\\.gemini\\antigravity\\brain\\281de72f-d9c0-48fa-9a4c-ada104e0368e\\.user_uploaded\\media_1793472588042_30cb8ae4.jpg';
const att5 = 'C:\\Users\\Furqan\\.gemini\\antigravity\\brain\\281de72f-d9c0-48fa-9a4c-ada104e0368e\\.user_uploaded\\media_1793472683059_1c5bd2be.jpg';

async function matchAttachment(label, attPath) {
  const metaAtt = await sharp(attPath).metadata();
  const attBuf = await sharp(attPath)
    .extract({
      left: Math.floor(metaAtt.width * 0.2),
      top: Math.floor(metaAtt.height * 0.2),
      width: Math.floor(metaAtt.width * 0.6),
      height: Math.floor(metaAtt.height * 0.6)
    })
    .resize(100, 100)
    .raw()
    .toBuffer();

  let minDiff = Infinity;
  let best = null;

  for (let i = 1; i <= 48; i++) {
    const dir = path.join('public/wedding-invites', 'design-' + i);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.jpg')) continue;
      const p = path.join(dir, f);
      const meta = await sharp(p).metadata();
      const buf = await sharp(p)
        .extract({
          left: Math.floor(meta.width * 0.2),
          top: Math.floor(meta.height * 0.2),
          width: Math.floor(meta.width * 0.6),
          height: Math.floor(meta.height * 0.6)
        })
        .resize(100, 100)
        .raw()
        .toBuffer();
      let diff = 0;
      for (let j = 0; j < buf.length; j++) {
        diff += Math.abs(buf[j] - attBuf[j]);
      }
      if (diff < minDiff) {
        minDiff = diff;
        best = `design-${i}/${f}`;
      }
    }
  }
  console.log(`Best match for ${label}: ${best} (diff: ${minDiff})`);
}

async function run() {
  await matchAttachment('Att 2 (2nd pic)', att2);
  await matchAttachment('Att 3 (envelope set)', att3);
  await matchAttachment('Att 4 (TPS-WI-05 card)', att4);
  await matchAttachment('Att 5 (5th image)', att5);
}
run();

