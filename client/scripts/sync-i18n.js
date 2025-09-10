// Copies i18n dictionaries into public for static export
// Priority: client/content/i18n overrides site/content/i18n
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const srcClient = path.join(__dirname, '..', 'content', 'i18n');
const srcSite = path.join(repoRoot, 'site', 'content', 'i18n');
const destDir = path.join(__dirname, '..', 'public', 'i18n');
const destContentDir = path.join(__dirname, '..', 'public', 'content', 'i18n');

function copyDir(src, dest){
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)){
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    if (fs.statSync(s).isFile()) fs.copyFileSync(s, d);
  }
  return true;
}

let used = null;
if (copyDir(srcClient, destDir)) { used = srcClient; }
else if (copyDir(srcSite, destDir)) { used = srcSite; }

if (used) {
  // Also mirror to /public/content/i18n for legacy components.js consumers
  copyDir(used, destContentDir);
  console.log('Synced i18n ->', path.relative(repoRoot, destDir), ' (from', path.relative(repoRoot, used) + ')');
} else {
  console.warn('i18n source not found:', path.relative(repoRoot, srcClient), 'or', path.relative(repoRoot, srcSite));
}
