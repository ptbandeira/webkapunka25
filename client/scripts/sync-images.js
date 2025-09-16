/*
  Copies curated images from the static site into the Next.js public folder
  Usage: npm run sync-images
*/
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const srcDir = path.join(repoRoot, 'site', 'images');
const destDir = path.join(__dirname, '..', 'public', 'images');
const uploadsSrcDir = path.join(repoRoot, 'site', 'static', 'uploads');
const uploadsDestDir = path.join(__dirname, '..', 'public', 'uploads');

const mapping = [
  { from: 'banner-image.jpg',  to: 'home.jpg' },
  { from: 'product-item2.jpg', to: 'shop.jpg' },
  { from: 'banner-image1.jpg', to: 'about.jpg' },
  { from: 'banner-image2.jpg', to: 'contact.jpg' },
];

fs.mkdirSync(destDir, { recursive: true });
let copied = 0, missing = [];
for (const m of mapping) {
  const src = path.join(srcDir, m.from);
  const dst = path.join(destDir, m.to);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    copied++;
    console.log('Copied', m.from, '->', path.relative(repoRoot, dst));
  } else {
    missing.push(m.from);
  }
}
if (missing.length) {
  console.warn('Missing source images:', missing.join(', '));
}
console.log(`Done. ${copied} file(s) copied.`);

function copyDir(src, dest){
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries){
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

copyDir(uploadsSrcDir, uploadsDestDir);
