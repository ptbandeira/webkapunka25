// Copies site/content into client/public/content for static export
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const srcDir = path.join(repoRoot, 'site', 'content');
const destDir = path.join(__dirname, '..', 'public', 'content');

function copyDir(src, dest){
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)){
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const st = fs.statSync(s);
    if (st.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir(srcDir, destDir);
console.log('Synced content ->', path.relative(repoRoot, destDir));

