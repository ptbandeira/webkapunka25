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
    else {
      // Do not overwrite a custom config.yml placed in public/admin
      if (entry === 'config.yml' && fs.existsSync(d)) continue;
      fs.copyFileSync(s, d);
    }
  }
}

copyDir(srcDir, destDir);
// If a custom CMS config is provided in client/admin, copy it over (override)
const customCfg = path.join(__dirname, '..', 'admin', 'config.yml');
if (fs.existsSync(customCfg)) {
  fs.copyFileSync(customCfg, path.join(destDir, 'config.yml'));
}
console.log('Synced admin ->', path.relative(repoRoot, destDir), fs.existsSync(customCfg) ? '(with custom config.yml)' : '');
