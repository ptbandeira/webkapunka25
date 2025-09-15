import fs from 'fs';
import path from 'path';

function warnDev(msg){
  if (process.env.NODE_ENV !== 'production'){
    // eslint-disable-next-line no-console
    console.warn(`[products] ${msg}`);
  }
}

function publicPath(...parts){
  return path.join(process.cwd(), 'public', ...parts);
}

export function readProducts(){
  try{
    const file = publicPath('content', 'products.json');
    const raw = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(raw);
    if (Array.isArray(data?.products)) return data.products;
    if (Array.isArray(data?.items)) return data.items.map((x, i) => ({
      id: x.id || String(i+1), slug: x.slug || x.id || `p${i+1}`,
      name: x.name || x.title || '', sizes: x.sizes || [], prices: [x.price], images: [x.image].filter(Boolean),
      category: x.category || '', badges: x.badges || [], active: true, order: i
    }));
    return null;
  }catch(e){
    warnDev(`Failed to read products.json: ${e.message}`);
    return null;
  }
}

export function getProductBySlug(slug){
  const all = readProducts();
  if (Array.isArray(all)) return all.find(p => p.slug === slug) || null;
  return null;
}

