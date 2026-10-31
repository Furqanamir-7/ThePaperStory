const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Users\\Furqan\\Desktop\\Web Projects\\The Paper Story';
const manifestPath = path.join(ROOT, 'src', 'data', 'imported-desktop-gallery.json');
const productsJsPath = path.join(ROOT, 'src', 'data', 'products.js');

const CURATED_WEDDING_DESIGNS = [
  {
    designNumber: 1,
    name: 'Design 1',
    images: [
      '/wedding-invites/design-1/04.jpg',
      '/wedding-invites/design-1/03.jpg',
      '/wedding-invites/design-1/01.jpg',
      '/wedding-invites/design-1/02.jpg',
      '/wedding-invites/design-1/05.jpg',
    ],
  },
  {
    designNumber: 2,
    name: 'Design 2',
    images: [
      '/wedding-invites/design-2/01.jpg',
      '/wedding-invites/design-2/02.jpg',
      '/wedding-invites/design-2/03.jpg',
      '/wedding-invites/design-2/04.jpg',
      '/wedding-invites/design-2/05.jpg',
    ],
  },
  {
    designNumber: 3,
    name: 'Design 3',
    images: [
      '/wedding-invites/design-3/02.jpg',
      '/wedding-invites/design-3/03.jpg',
      '/wedding-invites/design-3/01.jpg',
      '/wedding-invites/design-3/04.jpg',
      '/wedding-invites/design-3/05.jpg',
    ],
  },
  {
    designNumber: 4,
    name: 'Design 4',
    images: [
      '/wedding-invites/design-4/03.jpg',
      '/wedding-invites/design-4/02.jpg',
      '/wedding-invites/design-4/01.jpg',
      '/wedding-invites/design-4/04.jpg',
      '/wedding-invites/design-4/05.jpg',
    ],
  },
  {
    designNumber: 5,
    name: 'Design 5',
    images: [
      '/wedding-invites/design-5/02.jpg',
      '/wedding-invites/design-5/01.jpg',
      '/wedding-invites/design-5/03.jpg',
      '/wedding-invites/design-5/04.jpg',
      '/wedding-invites/design-5/05.jpg',
    ],
  },
  {
    designNumber: 6,
    name: 'Design 6',
    images: [
      '/wedding-invites/design-6/02.jpg',
      '/wedding-invites/design-6/01.jpg',
      '/wedding-invites/design-6/03.jpg',
      '/wedding-invites/design-6/04.jpg',
      '/wedding-invites/design-6/05.jpg',
    ],
  },
  {
    designNumber: 7,
    name: 'Design 7',
    images: [
      '/wedding-invites/design-7/03.jpg',
      '/wedding-invites/design-7/02.jpg',
      '/wedding-invites/design-7/01.jpg',
      '/wedding-invites/design-7/04.jpg',
      '/wedding-invites/design-7/05.jpg',
    ],
  },
  {
    designNumber: 8,
    name: 'Design 8',
    images: [
      '/wedding-invites/design-8/02.jpg',
      '/wedding-invites/design-8/04.jpg',
      '/wedding-invites/design-8/01.jpg',
      '/wedding-invites/design-8/03.jpg',
      '/wedding-invites/design-8/05.jpg',
    ],
  },
  {
    designNumber: 9,
    name: 'Design 9',
    images: [
      '/wedding-invites/design-9/01.jpg',
      '/wedding-invites/design-9/02.jpg',
      '/wedding-invites/design-9/03.jpg',
      '/wedding-invites/design-9/04.jpg',
      '/wedding-invites/design-9/05.jpg',
    ],
  },
  {
    designNumber: 10,
    name: 'Design 10',
    images: [
      '/wedding-invites/design-10/01.jpg',
      '/wedding-invites/design-10/04.jpg',
      '/wedding-invites/design-10/02.jpg',
      '/wedding-invites/design-10/03.jpg',
      '/wedding-invites/design-10/05.jpg',
    ],
  },
  {
    designNumber: 11,
    name: 'Design 11',
    images: [
      '/wedding-invites/design-11/04.jpg',
      '/wedding-invites/design-11/02.jpg',
      '/wedding-invites/design-11/01.jpg',
      '/wedding-invites/design-11/03.jpg',
      '/wedding-invites/design-11/05.jpg',
    ],
  },
  {
    designNumber: 12,
    name: 'Design 12',
    images: [
      '/wedding-invites/design-12/04.jpg',
      '/wedding-invites/design-12/05.jpg',
      '/wedding-invites/design-12/01.jpg',
      '/wedding-invites/design-12/03.jpg',
      '/wedding-invites/design-12/02.jpg',
    ],
  },
  {
    designNumber: 13,
    name: 'Design 13',
    images: [
      '/wedding-invites/design-13/01.jpg',
      '/wedding-invites/design-13/02.jpg',
      '/wedding-invites/design-13/03.jpg',
      '/wedding-invites/design-13/04.jpg',
      '/wedding-invites/design-13/05.jpg',
    ],
  },
  {
    designNumber: 14,
    name: 'Design 14',
    images: [
      '/wedding-invites/design-14/01.jpg',
      '/wedding-invites/design-14/02.jpg',
      '/wedding-invites/design-14/03.jpg',
      '/wedding-invites/design-14/04.jpg',
      '/wedding-invites/design-14/05.jpg',
    ],
  },
  {
    designNumber: 15,
    name: 'Design 15',
    images: [
      '/wedding-invites/design-15/02.jpg',
      '/wedding-invites/design-15/01.jpg',
      '/wedding-invites/design-15/03.jpg',
      '/wedding-invites/design-15/04.jpg',
      '/wedding-invites/design-15/05.jpg',
    ],
  },
  {
    designNumber: 16,
    name: 'Design 16',
    images: [
      '/wedding-invites/design-16/02.jpg',
      '/wedding-invites/design-16/04.jpg',
      '/wedding-invites/design-16/01.jpg',
      '/wedding-invites/design-16/03.jpg',
      '/wedding-invites/design-16/05.jpg',
    ],
  },
  {
    designNumber: 17,
    name: 'Design 17',
    images: [
      '/wedding-invites/design-17/05.jpg',
      '/wedding-invites/design-17/01.jpg',
      '/wedding-invites/design-17/02.jpg',
      '/wedding-invites/design-17/03.jpg',
      '/wedding-invites/design-17/04.jpg',
    ],
  },
  {
    designNumber: 18,
    name: 'Design 18',
    images: [
      '/wedding-invites/design-18/03.jpg',
      '/wedding-invites/design-18/02.jpg',
      '/wedding-invites/design-18/01.jpg',
      '/wedding-invites/design-18/04.jpg',
      '/wedding-invites/design-18/05.jpg',
    ],
  },
  {
    designNumber: 19,
    name: 'Design 19',
    images: [
      '/wedding-invites/design-19/05.jpg',
      '/wedding-invites/design-19/02.jpg',
      '/wedding-invites/design-19/01.jpg',
      '/wedding-invites/design-19/03.jpg',
      '/wedding-invites/design-19/04.jpg',
    ],
  },
  {
    designNumber: 20,
    name: 'Design 20',
    images: [
      '/wedding-invites/design-20/02.jpg',
      '/wedding-invites/design-20/04.jpg',
      '/wedding-invites/design-20/01.jpg',
      '/wedding-invites/design-20/03.jpg',
      '/wedding-invites/design-20/05.jpg',
    ],
  },
  {
    designNumber: 21,
    name: 'Design 21',
    images: [
      '/wedding-invites/design-21/01.jpg',
      '/wedding-invites/design-21/04.jpg',
      '/wedding-invites/design-21/02.jpg',
      '/wedding-invites/design-21/03.jpg',
      '/wedding-invites/design-21/05.jpg',
    ],
  },
  {
    designNumber: 22,
    name: 'Design 22',
    images: [
      '/wedding-invites/design-22/02.jpg',
      '/wedding-invites/design-22/04.jpg',
      '/wedding-invites/design-22/01.jpg',
      '/wedding-invites/design-22/03.jpg',
      '/wedding-invites/design-22/05.jpg',
    ],
  },
  {
    designNumber: 23,
    name: 'Design 23',
    images: [
      '/wedding-invites/design-23/03.jpg',
      '/wedding-invites/design-23/01.jpg',
      '/wedding-invites/design-23/02.jpg',
      '/wedding-invites/design-23/04.jpg',
      '/wedding-invites/design-23/05.jpg',
    ],
  },
  {
    designNumber: 24,
    name: 'Design 24',
    images: [
      '/wedding-invites/design-24/04.jpg',
      '/wedding-invites/design-24/02.jpg',
      '/wedding-invites/design-24/01.jpg',
      '/wedding-invites/design-24/03.jpg',
      '/wedding-invites/design-24/05.jpg',
    ],
  },
  {
    designNumber: 25,
    name: 'Design 25',
    images: [
      '/wedding-invites/design-25/02.jpg',
      '/wedding-invites/design-25/04.jpg',
      '/wedding-invites/design-25/01.jpg',
      '/wedding-invites/design-25/03.jpg',
      '/wedding-invites/design-25/05.jpg',
    ],
  },
  {
    designNumber: 26,
    name: 'Design 26',
    images: [
      '/wedding-invites/design-26/05.jpg',
      '/wedding-invites/design-26/02.jpg',
      '/wedding-invites/design-26/01.jpg',
      '/wedding-invites/design-26/04.jpg',
      '/wedding-invites/design-26/03.jpg',
    ],
  },
  {
    designNumber: 27,
    name: 'Design 27',
    images: [
      '/wedding-invites/design-27/04.jpg',
      '/wedding-invites/design-27/01.jpg',
      '/wedding-invites/design-27/02.jpg',
      '/wedding-invites/design-27/03.jpg',
      '/wedding-invites/design-27/05.jpg',
    ],
  },
  {
    designNumber: 28,
    name: 'Design 28',
    images: [
      '/wedding-invites/design-28/05.jpg',
      '/wedding-invites/design-28/01.jpg',
      '/wedding-invites/design-28/02.jpg',
      '/wedding-invites/design-28/03.jpg',
      '/wedding-invites/design-28/04.jpg',
    ],
  },
  {
    designNumber: 29,
    name: 'Design 29',
    images: [
      '/wedding-invites/design-29/02.jpg',
      '/wedding-invites/design-29/01.jpg',
      '/wedding-invites/design-29/03.jpg',
      '/wedding-invites/design-29/04.jpg',
      '/wedding-invites/design-29/05.jpg',
    ],
  },
  {
    designNumber: 30,
    name: 'Design 30',
    images: [
      '/wedding-invites/design-30/03.jpg',
      '/wedding-invites/design-30/01.jpg',
      '/wedding-invites/design-30/04.jpg',
      '/wedding-invites/design-30/05.jpg',
      '/wedding-invites/design-30/02.jpg',
    ],
  },
  {
    designNumber: 31,
    name: 'Design 31',
    images: [
      '/wedding-invites/design-31/01.jpg',
      '/wedding-invites/design-31/04.jpg',
      '/wedding-invites/design-31/02.jpg',
      '/wedding-invites/design-31/03.jpg',
      '/wedding-invites/design-31/05.jpg',
    ],
  },
  {
    designNumber: 32,
    name: 'Design 32',
    images: [
      '/wedding-invites/design-32/03.jpg',
      '/wedding-invites/design-32/01.jpg',
      '/wedding-invites/design-32/02.jpg',
      '/wedding-invites/design-32/04.jpg',
      '/wedding-invites/design-32/05.jpg',
    ],
  },
  {
    designNumber: 33,
    name: 'Design 33',
    images: [
      '/wedding-invites/design-33/05.jpg',
      '/wedding-invites/design-33/02.jpg',
      '/wedding-invites/design-33/03.jpg',
      '/wedding-invites/design-33/04.jpg',
      '/wedding-invites/design-33/01.jpg',
    ],
  },
];

// 1. Update manifest
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.wedding = CURATED_WEDDING_DESIGNS;
manifest.updatedAt = new Date().toISOString();
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log('Updated manifest wedding array with curated best display image order.');

// 2. Update WEDDING_GALLERY_BASE in products.js
let code = fs.readFileSync(productsJsPath, 'utf8');

const baseJson = JSON.stringify(CURATED_WEDDING_DESIGNS.map(d => ({ name: d.name, images: d.images })), null, 2);
const oldBaseRegex = /const WEDDING_GALLERY_BASE = \[[\s\S]*?\n\];/;
const newBaseBlock = `const WEDDING_GALLERY_BASE = ${baseJson};`;

code = code.replace(oldBaseRegex, newBaseBlock);
fs.writeFileSync(productsJsPath, code, 'utf8');
console.log('Updated products.js WEDDING_GALLERY_BASE with all 33 curated designs.');
