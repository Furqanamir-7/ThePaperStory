const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUB = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story\\public\\wedding-invites';

async function checkAllDesigns() {
  const issues = [];
  for (let num = 1; num <= 33; num++) {
    const dir = path.join(PUB, `design-${num}`);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
    for (const f of files) {
      const full = path.join(dir, f);
      const meta = await sharp(full).metadata();
      // If width > height, it's landscape. Check if it's sideways
      if (meta.width > meta.height) {
        issues.push({ design: num, file: f, dim: `${meta.width}x${meta.height}` });
      }
    }
  }
  console.log('Landscape / potentially rotated images:');
  console.table(issues);
}

checkAllDesigns().catch(console.error);
