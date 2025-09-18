import { LOCALES } from '../locale';
import { site } from '../config';

function normalizeSegments(segments: string[] = []): string[] {
  return segments
    .filter(Boolean)
    .map(seg => seg.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean);
}

function getBaseUrl(): string {
  const base = site.url || '';
  return base.replace(/\/+$/, '');
}

export function buildLocalePath(locale: string, segments: string[] = []): string {
  const cleaned = normalizeSegments(segments);
  const suffix = cleaned.length ? `/${cleaned.join('/')}` : '';
  return `/${locale}${suffix}`;
}

export function buildLocaleUrl(locale: string, segments: string[] = []): string {
  const base = getBaseUrl();
  return `${base}${buildLocalePath(locale, segments)}`;
}

export function buildAlternateLinks(currentLocale: string, segments: string[] = []) {
  const languages: Record<string, string> = {};
  LOCALES.forEach(locale => {
    languages[locale] = buildLocaleUrl(locale, segments);
  });
  const canonical = languages[currentLocale] || languages['en'];
  languages['x-default'] = languages['en'] || canonical;
  return { canonical, languages };
}

