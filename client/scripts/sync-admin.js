// Copies site/admin into client/public/admin so Decap CMS works on the exported site
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const srcDir = path.join(repoRoot, 'site', 'admin');
const destDir = path.join(__dirname, '..', 'public', 'admin');

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
console.log('Synced admin ->', path.relative(repoRoot, destDir));

