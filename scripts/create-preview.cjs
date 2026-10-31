const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUB = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story\\public\\wedding-invites';
const SCRATCH = 'C:\\Users\\Furqan\\.gemini\\antigravity-ide\\scratch\\wedding-preview';

fs.mkdirSync(SCRATCH, { recursive: true });

async function createThumbnails() {
  const htmlParts = [
    '<!DOCTYPE html><html><head><style>',
    'body { font-family: sans-serif; background: #fdfbf7; padding: 20px; }',
    '.design { margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px; }',
    '.grid { display: flex; gap: 15px; flex-wrap: wrap; }',
    '.item { text-align: center; background: white; padding: 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }',
    'img { width: 220px; height: 280px; object-fit: cover; border-radius: 4px; display: block; }',
    '</style></head><body><h1>Wedding Designs 1 to 33 - Photo Inspection</h1>'
  ];

  for (let num = 1; num <= 33; num++) {
    const dir = path.join(PUB, `design-${num}`);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
    
    htmlParts.push(`<div class="design"><h2>Design ${num}</h2><div class="grid">`);
    for (const f of files) {
      const full = path.join(dir, f);
      const dest = path.join(SCRATCH, `d${num}_${f}`);
      // create small 400x500 thumbnail
      await sharp(full)
        .resize(400, 500, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(dest);

      htmlParts.push(`<div class="item"><img src="d${num}_${f}" /><span>${f}</span></div>`);
    }
    htmlParts.push('</div></div>');
  }

  htmlParts.push('</body></html>');
  fs.writeFileSync(path.join(SCRATCH, 'preview.html'), htmlParts.join('\n'));
  console.log('Preview generated at:', path.join(SCRATCH, 'preview.html'));
}

createThumbnails().catch(console.error);
