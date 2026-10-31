const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUB = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story\\public\\wedding-invites';

async function analyzeDesignImages(num) {
  const dir = path.join(PUB, `design-${num}`);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));
  console.log(`\n=== Design ${num} ===`);
  for (const f of files) {
    const full = path.join(dir, f);
    const meta = await sharp(full).metadata();
    const stat = fs.statSync(full);
    const stats = await sharp(full).stats();
    console.log(`  ${f}: ${meta.width}x${meta.height} (aspect ${meta.width/meta.height > 1 ? 'Landscape' : 'Portrait'}), size ${(stat.size/1024).toFixed(0)}KB, mean: ${stats.channels.map(c=>c.mean.toFixed(0)).join(',')}`);
  }
}

async function main() {
  for (let num = 27; num <= 33; num++) {
    await analyzeDesignImages(num);
  }
}

main().catch(console.error);
