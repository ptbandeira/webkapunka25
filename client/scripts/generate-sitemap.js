// Generate sitemap.xml and robots.txt for static export
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kapunkargan.com';
const LOCALES = ['en','pt','es'];

async function loadModule(modPath){
  const url = pathToFileURL(modPath);
  return import(url.href);
}

async function main(){
  const urls = new Set();
  const add = (u) => urls.add(u.replace(/\/+$/,'').replace(/^(?!http)/, siteUrl.replace(/\/$/,'') + '/'));

  // Base localized routes
  for (const lang of LOCALES){
    add(`/${lang}`);
    add(`/${lang}/about`);
    add(`/${lang}/shop`);
    add(`/${lang}/contact`);
    add(`/${lang}/policies/privacy`);
    add(`/${lang}/policies/terms`);
    add(`/${lang}/policies/shipping`);
    add(`/${lang}/policies/returns`);
    add(`/${lang}/learn`);
    add(`/${lang}/clinics`);
    add(`/${lang}/training`);
  }

  // PDP slugs from model
  try{
    const productsMod = await loadModule(path.join(repoRoot, 'src', 'data', 'products.js'));
    const products = productsMod.products || [];
    for (const lang of LOCALES){
      products.forEach(p => add(`/${lang}/shop/${p.slug}`));
    }
  }catch(e){ /* ignore */ }

  // Learn article slugs
  try{
    const learnMod = await loadModule(path.join(repoRoot, 'src', 'data', 'articles.js'));
    const articles = learnMod.articles || [];
    for (const lang of LOCALES){
      articles.forEach(a => add(`/${lang}/learn/${a.slug}`));
    }
  }catch(e){ /* ignore */ }

  // Write sitemap.xml
  fs.mkdirSync(publicDir, { recursive: true });
  const now = new Date().toISOString();
  const body = Array.from(urls).sort().map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');

  // Write robots.txt
  const robots = `User-agent: *\nAllow: /\nSitemap: ${siteUrl.replace(/\/$/,'')}/sitemap.xml\n`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');

  console.log('Generated sitemap.xml and robots.txt with', urls.size, 'URLs');
}

main().catch((e) => { console.error('sitemap generation failed', e); process.exit(0); });

