import sharp from 'sharp';
const files = [
  'public/wedding-invites/design-7/01.jpg',
  'public/wedding-invites/design-5/01.jpg',
  'public/wedding-invites/design-5/02.jpg',
  'public/wedding-invites/design-12/02.jpg',
  'public/wedding-invites/design-19/01.jpg',
  'public/wedding-invites/design-20/02.jpg',
  'public/wedding-invites/design-37/01.jpg',
  'public/wedding-invites/design-37/02.jpg',
  'public/wedding-invites/design-44/01.jpg',
  'public/wedding-invites/design-42/05.jpg',
  'public/wedding-invites/design-14/01.jpg',
  'public/wedding-invites/design-14/02.jpg',
  'public/wedding-invites/design-24/01.jpg',
  'public/wedding-invites/design-24/05.jpg',
  'public/wedding-invites/design-15/01.jpg',
  'public/wedding-invites/design-40/01.jpg',
  'public/wedding-invites/design-41/01.jpg',
  'public/wedding-invites/design-41/02.jpg',
  'public/wedding-invites/design-16/01.jpg',
];
const results = await Promise.all(files.map(f => sharp(f).metadata().then(m => `${f}: ${m.width}x${m.height}`).catch(() => `${f}: ERROR`)));
results.forEach(r => console.log(r));

