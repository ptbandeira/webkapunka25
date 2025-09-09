// Copies legacy static site assets (css/js/images/html) into Next.js public
// so we can reuse the exact design/content under the new header.
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const legacyRoot = path.join(repoRoot, 'site');
const publicRoot = path.join(__dirname, '..', 'public');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const st = fs.statSync(s);
    if (st.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Ensure base public folder exists
fs.mkdirSync(publicRoot, { recursive: true });

// Copy CSS, JS, Images
copyDir(path.join(legacyRoot, 'css'), path.join(publicRoot, 'css'));
copyDir(path.join(legacyRoot, 'js'), path.join(publicRoot, 'js'));
copyDir(path.join(legacyRoot, 'images'), path.join(publicRoot, 'images'));

// Copy root style.css (legacy references it at /style.css)
const legacyStyle = path.join(legacyRoot, 'style.css');
if (fs.existsSync(legacyStyle)) {
  fs.copyFileSync(legacyStyle, path.join(publicRoot, 'style.css'));
}

// Copy top-level html pages into /public/site for server-side loading
const siteOut = path.join(publicRoot, 'site');
fs.mkdirSync(siteOut, { recursive: true });
for (const entry of fs.readdirSync(legacyRoot)) {
  if (/^.*\.html$/i.test(entry)) {
    fs.copyFileSync(path.join(legacyRoot, entry), path.join(siteOut, entry));
  }
}

console.log('Synced legacy static assets ->', path.relative(repoRoot, publicRoot));

