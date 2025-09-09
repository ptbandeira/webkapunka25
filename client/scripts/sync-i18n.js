// Copies site/content/i18n into client/public/i18n for static export
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const srcDir = path.join(repoRoot, 'site', 'content', 'i18n');
const destDir = path.join(__dirname, '..', 'public', 'i18n');

if (fs.existsSync(srcDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, entry);
    const d = path.join(destDir, entry);
    if (fs.statSync(s).isFile()) fs.copyFileSync(s, d);
  }
  console.log('Synced i18n ->', path.relative(repoRoot, destDir));
} else {
  console.warn('i18n source not found:', path.relative(repoRoot, srcDir));
}

