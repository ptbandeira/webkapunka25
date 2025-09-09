import fs from 'fs/promises';
import path from 'path';

const LOCALES = ['en', 'pt', 'es'];
const DEFAULT_LOCALE = 'en';

function ensureLang(lang){
  return LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
}

async function readJSON(file){
  const buf = await fs.readFile(file, 'utf8');
  return JSON.parse(buf);
}

function parseFrontmatter(md){
  // Very small YAML-like frontmatter parser (flat key: value only)
  // ---\ntitle: Hello\ndescription: Text\n---\nMarkdown body
  const FM = /^---\n([\s\S]*?)\n---\n?/;
  const m = md.match(FM);
  if (!m) return { data: {}, content: md };
  const yaml = m[1];
  const data = {};
  yaml.split(/\r?\n/).forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx+1).trim();
    if (k) data[k] = v.replace(/^"|"$/g,'');
  });
  const content = md.slice(m[0].length);
  return { data, content };
}

export async function getDictionary(lang){
  const l = ensureLang(lang);
  const root = path.join(process.cwd(), 'content', 'i18n');
  const tryLang = path.join(root, `${l}.json`);
  try {
    return await readJSON(tryLang);
  } catch {
    return await readJSON(path.join(root, `${DEFAULT_LOCALE}.json`));
  }
}

export async function getPage(lang, slug){
  const l = ensureLang(lang);
  const root = path.join(process.cwd(), 'content', 'pages');
  const file = path.join(root, `${slug}.${l}.md`);
  try {
    const md = await fs.readFile(file, 'utf8');
    return parseFrontmatter(md);
  } catch {
    const fallback = path.join(root, `${slug}.${DEFAULT_LOCALE}.md`);
    const md = await fs.readFile(fallback, 'utf8');
    return parseFrontmatter(md);
  }
}

export async function getProducts(lang){
  const l = ensureLang(lang);
  const root = path.join(process.cwd(), 'content', 'products');
  const file = path.join(root, `products.${l}.json`);
  try {
    return await readJSON(file);
  } catch {
    return await readJSON(path.join(root, `products.${DEFAULT_LOCALE}.json`));
  }
}

export const i18n = { LOCALES, DEFAULT_LOCALE };

