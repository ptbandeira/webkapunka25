// Build-time normalizer for Decap Products folder -> public/content/products.json
const fs = require('fs');
const path = require('path');

function warnDev(msg){
  if (process.env.NODE_ENV !== 'production'){
    console.warn(`[build-products] ${msg}`);
  }
}

function readJSON(file){
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
}

function toNumber(v){
  if (typeof v === 'number') return v;
  const n = Number(String(v||'').replace(/[^\d.,-]/g,'').replace(',','.'));
  return isFinite(n) ? n : 0;
}

function normalizeEntry(entry){
  const id = String(entry.id || '').trim();
  const slug = String(entry.slug || '').trim();
  const name = String(entry.title || entry.name || '').trim();
  const sizes = Array.isArray(entry.sizes) ? entry.sizes.map(x => String(x.size || x).trim()).filter(Boolean) : [];
  let prices = [];
  if (Array.isArray(entry.prices)) prices = entry.prices.map(x => toNumber(x.price || x));
  else if (entry.price) prices = [toNumber(entry.price)];
  const images = Array.isArray(entry.images) ? entry.images.map(x => String(x.image || x).trim()).filter(Boolean) : [];
  const badges = Array.isArray(entry.badges) ? entry.badges.map(x => String(x.badge || x).trim()).filter(Boolean) : [];
  const category = entry.category ? String(entry.category) : '';
  const active = typeof entry.active === 'boolean' ? entry.active : true;
  const order = typeof entry.order === 'number' ? entry.order : 0;
  return { id, slug, name, sizes, prices, images, category, badges, active, order };
}

function main(){
  const repoRoot = path.resolve(__dirname, '..', '..');
  const productsDir = path.join(repoRoot, 'site', 'content', 'products');
  const outFile = path.join(__dirname, '..', 'public', 'content', 'products.json');

  if (!fs.existsSync(productsDir)){
    warnDev('No site/content/products directory; skipping build-products');
    return;
  }
  const entries = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));
  if (entries.length === 0){
    warnDev('No product entries found; skipping normalization');
    return;
  }

  const products = [];
  for (const file of entries){
    try{
      const data = readJSON(path.join(productsDir, file));
      const norm = normalizeEntry(data);
      if (norm.id && norm.slug && norm.name) products.push(norm);
      else warnDev(`Skipping ${file}: missing id/slug/name`);
    }catch(e){
      warnDev(`Failed to parse ${file}: ${e.message}`);
    }
  }

  // Sort by order then name
  products.sort((a,b) => (a.order||0)-(b.order||0) || a.name.localeCompare(b.name));

  // Write out normalized JSON
  const outDir = path.dirname(outFile);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({ products, updatedAt: new Date().toISOString() }, null, 2));
  console.log(`Built normalized products -> ${path.relative(repoRoot, outFile)}`);
}

try{ main(); }catch(e){
  warnDev(`Failed building products: ${e.message}`);
}

