import fs from 'fs';
import path from 'path';
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

