import fs from 'fs';
import path from 'path';
import { articles } from '../src/data/articles';
import { LOCALES } from '../src/lib/locale';

const repoRoot = path.resolve(__dirname, '..', '..');
const publicDir = path.join(repoRoot, 'client', 'public');
const productsFile = path.join(publicDir, 'content', 'products.json');
const searchIndexFile = path.join(publicDir, 'content', 'search-index.json');

export type SearchEntry = {
  type: 'product' | 'article';
  slug: string;
  title: string;
  summary: string;
  category: string;
  locale: string;
};

function readJSON<T>(file: string): T | null {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn('[build-search] Failed reading', path.relative(repoRoot, file), (err as Error).message);
    return null;
  }
}

function buildProductEntries(): SearchEntry[] {
  const out: SearchEntry[] = [];
  const data = readJSON<{ products?: any[]; items?: any[] }>(productsFile);
  if (!data) return out;
  const items = Array.isArray(data.products) ? data.products : Array.isArray(data.items) ? data.items : [];
  items
    .filter(item => item && (item.active !== false))
    .forEach(item => {
      const title = String(item.name || item.title || item.slug || '').trim();
      if (!title) return;
      const summaryParts: string[] = [];
      if (Array.isArray(item.sizes) && item.sizes.length) {
        summaryParts.push(`Sizes: ${item.sizes.join(', ')}`);
      }
      if (Array.isArray(item.prices) && item.prices.length) {
        summaryParts.push(`From €${item.prices[0]}`);
      }
      const summary = summaryParts.join(' • ') || 'Product';
      const category = (item.category || 'Product').toString();
      LOCALES.forEach(locale => {
        out.push({
          type: 'product',
          slug: `/${locale}/shop/${item.slug || ''}`,
          title,
          summary,
          category,
          locale,
        });
      });
    });
  return out;
}

function buildArticleEntries(): SearchEntry[] {
  const out: SearchEntry[] = [];
  articles.forEach(article => {
    LOCALES.forEach(locale => {
      out.push({
        type: 'article',
        slug: `/${locale}/learn/${article.slug}`,
        title: article.title,
        summary: article.excerpt,
        category: article.category || 'Learn',
        locale,
      });
    });
  });
  return out;
}

function ensureDir(file: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

async function main() {
  const entries: SearchEntry[] = [];
  entries.push(...buildProductEntries());
  entries.push(...buildArticleEntries());
  ensureDir(searchIndexFile);
  const payload = { generatedAt: new Date().toISOString(), entries };
  fs.writeFileSync(searchIndexFile, JSON.stringify(payload, null, 2));
  console.log('[build-search] Wrote search index ->', path.relative(repoRoot, searchIndexFile), `(${entries.length} entries)`);
}

main().catch(err => {
  console.error('[build-search] Failed:', err);
  process.exitCode = 1;
});

