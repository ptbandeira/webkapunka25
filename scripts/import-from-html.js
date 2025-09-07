const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function abs(p){ if(!p) return p; return p.startsWith('/')? p : '/'+p.replace(/^\.?\//,''); }
function read(file){ return fs.readFileSync(file, 'utf8'); }
function writeJSON(file, obj){
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
  console.log('wrote', file);
}

const INDEX = 'index.html';
if (!fs.existsSync(INDEX)) {
  console.error('index.html not found at repo root. Run this from the project root.');
  process.exit(1);
}
const $ = cheerio.load(read(INDEX));

/* --- ABOUT (from #about section) --- */
let aboutHeading = $('#about h3').first().text().trim() || 'About Kapunka';
let aboutBody = $('#about p').first().text().trim() || 'Edit this in the CMS.';

/* --- PRODUCTS (cards in the Best-Sellers carousel) --- */
let products = [];
$('.product-store .product-card').each((i, el) => {
  const $el = $(el);
  const name = $el.find('.card-title a').first().text().trim() || $el.find('.card-title').first().text().trim() || 'Product';
  const priceTxt = $el.find('.item-price').first().text().trim().replace(/[^\d.,]/g,'');
  const price = Number(priceTxt.replace(',','.')) || null;
  const image = abs($el.find('img').attr('src') || '');
  const link = $el.find('.card-title a').attr('href') || '#';
  products.push({ name, price, image, link });
});

/* --- FAQs (accordion) --- */
let faqs = [];
$('#faqs .accordion-item').each((i, el) => {
  const q = $(el).find('button.accordion-button').first().text().trim();
  const a = $(el).find('.accordion-body').first().text().trim();
  if (q) faqs.push({ q, a });
});

/* --- BANNERS (3 tiles) --- */
function bgFromStyle(style){
  if(!style) return null;
  const m = style.match(/url\(['"]?([^'")]+)['"]?\)/i);
  return m ? abs(m[1]) : null;
}
let banners = [];
['.banner-content-1','.banner-content-2','.banner-content-3'].forEach(sel=>{
  const $b = $(sel);
  if ($b.length){
    const style = $b.attr('style') || '';
    const background_image = bgFromStyle(style);
    const heading = $b.find('h2').first().text().trim();
    const $btn = $b.find('a.btn').first();
    const button_label = $btn.text().trim() || null;
    const button_link = $btn.attr('href') || null;
    banners.push({ type:'banner', heading, button_label, button_link, background_image });
  }
});

/* --- VIDEO --- */
let youtube_url = $('#our-video a[data-src]').attr('data-src') || null;

// Build HOME page JSON using your existing content
const homeSections = [];

// About text block (from the static #about)
homeSections.push({
  type: 'text',
  heading: aboutHeading,
  body: aboutBody,
  align: 'left'
});

// Product Grid (source points to products.json)
if (products.length){
  homeSections.push({
    type: 'productGrid',
    title: 'Best-Sellers',
    source: 'products.json',
    count: Math.min(12, products.length)
  });
}

// FAQs section (uses faqs.json)
if (faqs.length){
  homeSections.push({
    type: 'faqs',
    title: 'FAQs',
    source: 'faqs.json'
  });
}

// Banners
banners.forEach(b => homeSections.push(b));

// Video
if (youtube_url){
  homeSections.push({
    type: 'video',
    youtube_url,
    caption: ' '
  });
}

// Write JSON files that Decap edits
writeJSON('site/content/products.json', { items: products.length ? products : [
  { "name": "Argan Oil 30ml",  "price": 19, "image": "/images/product-item1.jpg", "url": "product-30ml.html"  }
]});

writeJSON('site/content/faqs.json', { items: faqs.length ? faqs : [
  { "q": "Is it 100% pure?", "a": "Yes—single-ingredient, cold-pressed argan oil." }
]});

writeJSON('site/content/pages/home.json', {
  takeover: false, // keep your existing layout; JSON just fills parts
  sections: homeSections
});

// Create stubs for other pages if missing (you can edit in the CMS)
if (!fs.existsSync('site/content/pages/about.json')){
  writeJSON('site/content/pages/about.json', {
    takeover: false,
    sections: [{ type:'text', heading:'Our Story', body:'Edit this in the CMS.', align:'left' }]
  });
}
if (!fs.existsSync('site/content/pages/shop.json')){
  writeJSON('site/content/pages/shop.json', {
    takeover: false,
    sections: [{ type:'productGrid', title:'Products', source:'products.json', count:12 }]
  });
}
if (!fs.existsSync('site/content/pages/contact.json')){
  writeJSON('site/content/pages/contact.json', {
    takeover: false,
    sections: [{ type:'text', heading:'Contact', body:'Email: info@kapunkargan.com', align:'left' }]
  });
}
if (!fs.existsSync('site/content/pages/faqs-page.json')){
  writeJSON('site/content/pages/faqs-page.json', {
    takeover: false,
    sections: [{ type:'faqs', title:'FAQs', source:'faqs.json' }]
  });
}

console.log('\nImport complete.');
