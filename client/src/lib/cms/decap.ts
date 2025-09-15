import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { PageSchema, Section, SectionSchema } from '../../types/sections';

// Utility: resolve a path inside Next public folder
function publicPath(...parts: string[]) {
  return path.join(process.cwd(), 'public', ...parts);
}

// Reads JSON synchronously (build-time only)
function readJSONSync(filePath: string) {
  const buf = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(buf);
}

// Returns true if a file exists and is a regular file
function fileExistsSync(filePath: string) {
  try {
    const st = fs.statSync(filePath);
    return st.isFile();
  } catch {
    return false;
  }
}

// Log warning only in development
function warnDev(msg: string) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(`[decap] ${msg}`);
  }
}

const FaqItemSchema = z.object({
  question: z.string().optional(),
  q: z.string().optional(),
  answer: z.string().optional(),
  a: z.string().optional(),
  category: z.string().optional(),
  order: z.union([z.number(), z.string()]).optional(),
});
const FaqListSchema = z.object({
  items: z.array(FaqItemSchema).default([]),
});
type RawFaqItem = z.infer<typeof FaqItemSchema>;

export type FaqEntry = {
  question: string;
  answer: string;
  category?: string;
  order: number;
};

function normalizeFaqItem(item: RawFaqItem, idx: number): FaqEntry | null {
  const question = (item.question ?? item.q ?? '').trim();
  const answer = (item.answer ?? item.a ?? '').trim();
  if (!question || !answer) return null;
  const orderRaw = item.order;
  let order = idx + 1;
  if (typeof orderRaw === 'number' && Number.isFinite(orderRaw)) order = orderRaw;
  else if (typeof orderRaw === 'string') {
    const parsed = Number(orderRaw.trim());
    if (Number.isFinite(parsed)) order = parsed;
  }
  const category = item.category?.trim();
  return {
    question,
    answer,
    order,
    ...(category ? { category } : {}),
  };
}

function sortFaqEntries(entries: FaqEntry[]): FaqEntry[] {
  return entries.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.question.localeCompare(b.question, undefined, { sensitivity: 'base' });
  });
}

/**
 * Read a localized JSON blob from public/content
 * Tries /public/content/<locale>/<relPath>, then /public/content/<relPath>
 * Synchronous by design: only meant for SSG/ISR on server.
 */
export function readLocaleJSON<T = unknown>(locale: string, relPath: string): T | null {
  const localized = publicPath('content', locale, relPath);
  const fallback = publicPath('content', relPath);

  let fileToRead = '';
  if (fileExistsSync(localized)) fileToRead = localized;
  else if (fileExistsSync(fallback)) fileToRead = fallback;

  if (!fileToRead) {
    warnDev(`File not found for locale=${locale} relPath=${relPath}`);
    return null;
  }

  try {
    return readJSONSync(fileToRead) as T;
  } catch (err) {
    warnDev(`Failed parsing JSON: ${fileToRead} (${(err as Error).message})`);
    return null;
  }
}

export function readFaqs(locale: string): FaqEntry[] {
  const data = readLocaleJSON<Record<string, unknown>>(locale, 'faqs.json');
  if (!data) return [];
  const res = FaqListSchema.safeParse(data);
  if (!res.success) {
    warnDev(`Invalid FAQs schema for locale=${locale}: ${res.error.issues.map(i => i.message).join('; ')}`);
    return [];
  }
  const items = Array.isArray(res.data.items) ? res.data.items : [];
  const normalized: FaqEntry[] = [];
  items.forEach((item, idx) => {
    const faq = normalizeFaqItem(item as RawFaqItem, idx);
    if (faq) normalized.push(faq);
  });
  return sortFaqEntries(normalized);
}

/**
 * Read a page definition and return validated sections array.
 * Looks up /public/content/<locale>/pages/<slug>.json, with fallback to
 * /public/content/pages/<slug>.json.
 * Returns [] when invalid or missing, logging a warning in dev.
 */
export function readPageSections(locale: string, slug: string): Section[] {
  const rel = path.join('pages', `${slug}.json`);
  const data = readLocaleJSON<Record<string, unknown>>(locale, rel);
  if (!data) return [];

  // Validate using PageSchema (expects { takeover?, sections: [...] })
  const res = PageSchema.safeParse(data);
  if (!res.success) {
    warnDev(`Invalid page schema for slug=${slug}: ${res.error.issues.map(i => i.message).join('; ')}`);
    return [];
  }
  const { sections } = res.data;

  // Extra safety: validate each section individually (defensive)
  const valid: Section[] = [];
  for (const s of sections) {
    const sec = SectionSchema.safeParse(s);
    if (sec.success) valid.push(sec.data);
    else warnDev(`Invalid section in ${slug}: ${sec.error.issues.map(i => i.message).join('; ')}`);
  }
  return valid;
}

/**
 * Convenience helper to return sections for a page or null when unavailable.
 */
export function getDecapPage(slug: string, locale: string): Section[] | null {
  try {
    const sections = readPageSections(locale, slug);
    return Array.isArray(sections) && sections.length > 0 ? sections : null;
  } catch {
    return null;
  }
}
