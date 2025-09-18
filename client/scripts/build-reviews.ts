import fs from 'fs';
import path from 'path';
import { LOCALES } from '../src/lib/locale';

const LOG_PREFIX = '[build-reviews]';
const repoRoot = path.resolve(__dirname, '..', '..');
const contentDir = path.join(repoRoot, 'site', 'content', 'reviews');
const publicContentDir = path.join(repoRoot, 'client', 'public', 'content');

const SUPPORTED_LOCALES = new Set(LOCALES);

function warn(msg: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`${LOG_PREFIX} ${msg}`);
  }
}

function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJSON(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed parsing ${path.relative(repoRoot, filePath)}: ${message}`);
  }
}

function isDraft(status: unknown): boolean {
  if (typeof status === 'string') {
    const value = status.trim().toLowerCase();
    return value === 'draft' || value === 'false';
  }
  if (typeof status === 'boolean') return !status;
  return false;
}

function toBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  }
  if (value == null) return fallback;
  return Boolean(value);
}

function clampRating(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.min(5, Math.max(1, Math.round(value)));
  }
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.+-]/g, ''));
    if (Number.isFinite(parsed)) {
      return Math.min(5, Math.max(1, Math.round(parsed)));
    }
  }
  return undefined;
}

type NormalizedReview = {
  id: string;
  canonicalKey: string;
  name: string;
  quote: string;
  role?: string;
  source?: string;
  rating?: number;
  productSlug?: string;
  locale?: string;
};

function buildCanonicalKey(slug: string, productSlug?: string) {
  if (productSlug && productSlug.trim()) return productSlug.trim();
  return slug;
}

function normalizeReview(data: Record<string, unknown>, slug: string): NormalizedReview | null {
  if (isDraft(data.status)) return null;
  if (!toBoolean(data.active, true)) return null;

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const quote = typeof data.quote === 'string' ? data.quote.trim() : '';
  if (!name || !quote) {
    warn(`Skipping ${slug}: missing name or quote`);
    return null;
  }

  const role = typeof data.role === 'string' ? data.role.trim() : undefined;
  const source = typeof data.source === 'string' ? data.source.trim() : undefined;
  const rating = clampRating(data.rating);
  const productSlug = typeof data.productSlug === 'string' ? data.productSlug.trim() || undefined : undefined;

  const localeRaw = typeof data.locale === 'string' ? data.locale.trim().toLowerCase() : '';
  const locale = SUPPORTED_LOCALES.has(localeRaw) ? localeRaw : undefined;

  return {
    id: slug,
    canonicalKey: buildCanonicalKey(slug, productSlug),
    name,
    quote,
    ...(role ? { role } : {}),
    ...(source ? { source } : {}),
    ...(rating ? { rating } : {}),
    ...(productSlug ? { productSlug } : {}),
    ...(locale ? { locale } : {}),
  };
}

function collectReviews(): NormalizedReview[] {
  if (!fs.existsSync(contentDir) || !fs.statSync(contentDir).isDirectory()) {
    warn(`Source directory not found: ${path.relative(repoRoot, contentDir)}`);
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((name) => name.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((name) => {
      const filePath = path.join(contentDir, name);
      const slug = path.basename(name, path.extname(name));
      try {
        const data = readJSON(filePath);
        return normalizeReview(data, slug);
      } catch (err) {
        warn(err instanceof Error ? err.message : String(err));
        return null;
      }
    })
    .filter((entry): entry is NormalizedReview => Boolean(entry));
}

function writeReviews(outFile: string, items: NormalizedReview[]) {
  ensureDir(outFile);
  const payload = {
    items: items.map(({ canonicalKey, ...rest }) => rest),
    generatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
  const rel = path.relative(repoRoot, outFile);
  console.log(`${LOG_PREFIX} wrote ${rel} (${payload.items.length} items)`);
}

function buildDefaultList(entries: NormalizedReview[]) {
  return entries.filter((entry) => !entry.locale);
}

function buildLocaleList(defaultEntries: NormalizedReview[], localizedEntries: NormalizedReview[]) {
  if (!localizedEntries.length) return defaultEntries;
  const map = new Map<string, NormalizedReview>();
  defaultEntries.forEach((entry) => {
    map.set(entry.canonicalKey, entry);
  });
  localizedEntries.forEach((entry) => {
    map.set(entry.canonicalKey, entry);
  });
  return Array.from(map.values());
}

function main() {
  const allEntries = collectReviews();
  const defaultEntries = buildDefaultList(allEntries);
  const defaultOut = path.join(publicContentDir, 'reviews.json');
  writeReviews(defaultOut, defaultEntries);

  LOCALES.forEach((locale) => {
    const localized = allEntries.filter((entry) => entry.locale === locale);
    if (!localized.length && !defaultEntries.length) {
      return;
    }
    const combined = buildLocaleList(defaultEntries, localized);
    const outFile = path.join(publicContentDir, locale, 'reviews.json');
    writeReviews(outFile, combined);
  });
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`${LOG_PREFIX} Failed: ${message}`);
  process.exitCode = 1;
}
