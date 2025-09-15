import * as fs from 'fs';
import * as path from 'path';

type RawFaq = {
  question?: unknown;
  answer?: unknown;
  category?: unknown;
  order?: unknown;
  active?: unknown;
  q?: unknown;
  a?: unknown;
};

type NormalizedFaq = {
  slug: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
};

const LOG_PREFIX = '[build-faqs]';
const SUPPORTED_LOCALES = ['en', 'pt', 'es'];
const DEFAULT_LOCALE = 'en';

const repoRoot = path.resolve(__dirname, '..');
const contentRoot = path.join(repoRoot, 'site', 'content');
const faqsSourceDir = path.join(contentRoot, 'faqs');
const publicContentDir = path.join(repoRoot, 'client', 'public', 'content');

function warn(msg: string) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(`${LOG_PREFIX} ${msg}`);
  }
}

function readJSON(file: string): unknown {
  const raw = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed parsing ${path.relative(repoRoot, file)}: ${message}`);
  }
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    const normalized = trimmed.replace(/,/g, '.').replace(/[^0-9.+-]/g, '');
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toBoolean(value: unknown, fallback = true): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  }
  if (typeof value === 'number') return value !== 0;
  if (value == null) return fallback;
  return Boolean(value);
}

function normalizeEntry(raw: RawFaq, slug: string): NormalizedFaq | null {
  const questionSrc = raw.question ?? raw.q;
  const answerSrc = raw.answer ?? raw.a;
  const question = typeof questionSrc === 'string' ? questionSrc.trim() : '';
  const answer = typeof answerSrc === 'string' ? answerSrc.trim() : '';
  if (!question || !answer) {
    warn(`Skipping ${slug}: missing question or answer`);
    return null;
  }
  const category = typeof raw.category === 'string' ? raw.category.trim() : undefined;
  const order = toNumber(raw.order, 0);
  const active = toBoolean(raw.active, true);
  if (!active) return null;
  const entry: NormalizedFaq = {
    slug,
    question,
    answer,
    order,
  };
  if (category) entry.category = category;
  return entry;
}

function collectDirEntries(dir: string): NormalizedFaq[] {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
  const entries: NormalizedFaq[] = [];
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.json')) continue;
    const filePath = path.join(dir, name);
    try {
      const data = readJSON(filePath);
      if (!data || typeof data !== 'object') {
        warn(`Ignoring ${path.relative(repoRoot, filePath)}: not an object`);
        continue;
      }
      const slug = path.basename(name, path.extname(name));
      const normalized = normalizeEntry(data as RawFaq, slug);
      if (normalized) entries.push(normalized);
    } catch (err) {
      warn(err instanceof Error ? err.message : String(err));
    }
  }
  return entries;
}

function readLegacyListFile(file: string): NormalizedFaq[] {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return [];
  try {
    const data = readJSON(file) as { items?: RawFaq[] };
    if (!data || !Array.isArray(data.items)) return [];
    return data.items
      .map((item, idx) => normalizeEntry(item, `legacy-${idx + 1}`))
      .filter((item): item is NormalizedFaq => Boolean(item));
  } catch (err) {
    warn(err instanceof Error ? err.message : String(err));
    return [];
  }
}

function sortEntries(entries: NormalizedFaq[]): NormalizedFaq[] {
  return entries.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.question.localeCompare(b.question, undefined, { sensitivity: 'base' });
  });
}

function writeFaqFile(outFile: string, items: NormalizedFaq[]): void {
  const payload = {
    items: items.map(({ question, answer, category, order }) => ({
      question,
      answer,
      ...(category ? { category } : {}),
      order,
    })),
    updatedAt: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
  const rel = path.relative(repoRoot, outFile);
  // eslint-disable-next-line no-console
  console.log(`${LOG_PREFIX} Wrote ${rel} (${payload.items.length} items)`);
}

function collectDefaultEntries(): NormalizedFaq[] {
  const localeDir = path.join(faqsSourceDir, DEFAULT_LOCALE);
  let entries = collectDirEntries(localeDir);
  if (entries.length === 0) {
    entries = collectDirEntries(faqsSourceDir);
  }
  if (entries.length === 0) {
    const legacyFile = path.join(contentRoot, 'faqs.json');
    entries = readLegacyListFile(legacyFile);
  }
  return sortEntries(entries);
}

function main(): void {
  if (!fs.existsSync(faqsSourceDir)) {
    warn(`Source directory not found: ${path.relative(repoRoot, faqsSourceDir)}`);
  }

  const defaultEntries = collectDefaultEntries();
  const defaultOut = path.join(publicContentDir, 'faqs.json');
  writeFaqFile(defaultOut, defaultEntries);

  for (const locale of SUPPORTED_LOCALES) {
    const dir = path.join(faqsSourceDir, locale);
    const entries = sortEntries(collectDirEntries(dir));
    if (entries.length === 0) {
      continue;
    }
    const outFile = path.join(publicContentDir, locale, 'faqs.json');
    writeFaqFile(outFile, entries);
  }
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  // eslint-disable-next-line no-console
  console.error(`${LOG_PREFIX} Failed: ${message}`);
  process.exitCode = 1;
}
