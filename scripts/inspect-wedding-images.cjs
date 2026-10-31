const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const P2_WEDDING = 'D:\\projects\\The Paper Story-20261031T042156Z-1-002\\The Paper Story\\Wedding Invitation';
const P1_WEDDING = 'D:\\projects\\The Paper Story-20261031T042156Z-1-001\\The Paper Story\\Wedding Invitation';
const PUB = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story\\public\\wedding-invites';

async function inspectDesign(num) {
  const pubDir = path.join(PUB, `design-${num}`);
  const pubFiles = fs.existsSync(pubDir) ? fs.readdirSync(pubDir).filter(f => f.endsWith('.jpg')) : [];
  
  const pubStats = [];
  for (const f of pubFiles) {
    const full = path.join(pubDir, f);
    const meta = await sharp(full).metadata();
    pubStats.push({ file: f, w: meta.width, h: meta.height, aspect: (meta.width / meta.height).toFixed(2), size: (fs.statSync(full).size / 1024).toFixed(1) + 'KB' });
  }

  const p2Dir = path.join(P2_WEDDING, String(num));
  const p1Dir = path.join(P1_WEDDING, String(num));
  const p2Files = fs.existsSync(p2Dir) ? fs.readdirSync(p2Dir) : [];
  const p1Files = fs.existsSync(p1Dir) ? fs.readdirSync(p1Dir) : [];

  return {
    design: num,
    pubStats,
    sourceFiles: {
      p2: p2Files,
      p1: p1Files
    }
  };
}

async function main() {
  for (let i = 1; i <= 33; i++) {
    const res = await inspectDesign(i);
    console.log(`\n=== Design ${i} ===`);
    console.log('Public images:');
    res.pubStats.forEach(s => console.log(`  ${s.file}: ${s.w}x${s.h} (${s.aspect}) ${s.size}`));
    console.log(`Source P2 (${res.sourceFiles.p2.length}):`, res.sourceFiles.p2.slice(0, 8).join(', '));
    console.log(`Source P1 (${res.sourceFiles.p1.length}):`, res.sourceFiles.p1.slice(0, 8).join(', '));
  }
}

main().catch(console.error);
