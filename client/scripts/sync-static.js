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

// Copy common favicons to public root so /favicon.ico resolves
const favSrcs = [
  path.join(legacyRoot, 'images', 'favicon.ico'),
  path.join(legacyRoot, 'images', 'apple-touch-icon.png'),
  path.join(legacyRoot, 'images', 'favicon-16.png'),
  path.join(legacyRoot, 'images', 'favicon-32.png'),
];
const favDests = [
  ['favicon.ico', 'favicon.ico'],
  ['apple-touch-icon.png', 'apple-touch-icon.png'],
  ['favicon-16.png', 'favicon-16x16.png'],
  ['favicon-32.png', 'favicon-32x32.png'],
];
favSrcs.forEach((src, i) => {
  try{
    if (fs.existsSync(src)) {
      const name = favDests[i][0];
      const alt = favDests[i][1];
      fs.copyFileSync(src, path.join(publicRoot, name));
      // Also write a common alias if provided
      if (alt && alt !== name) fs.copyFileSync(src, path.join(publicRoot, alt));
    }
  }catch(e){}
});

// Copy top-level html pages into /public/site for server-side loading
const siteOut = path.join(publicRoot, 'site');
fs.mkdirSync(siteOut, { recursive: true });
for (const entry of fs.readdirSync(legacyRoot)) {
  if (/^.*\.html$/i.test(entry)) {
    fs.copyFileSync(path.join(legacyRoot, entry), path.join(siteOut, entry));
  }
}

console.log('Synced legacy static assets ->', path.relative(repoRoot, publicRoot));
