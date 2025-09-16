export const LOCALES = ['en','pt','es'];

export function getCurrentLocale(input){
  if (typeof input === 'string' && input) {
    const value = input.trim().toLowerCase();
    if (LOCALES.includes(value)) return value;
    const match = value.match(/^\/?(en|pt|es)(?=\/|$)/i);
    if (match) return match[1].toLowerCase();
  }
  return 'en';
}

export function getCurrentLang(pathname){
  return getCurrentLocale(pathname);
}

export function stripLang(pathname){
  if (typeof pathname !== 'string') return '/';
  return pathname.replace(/^\/(en|pt|es)(?=\/|$)/i,'') || '/';
}

export function withLang(lang, path){
  const clean = path.startsWith('/') ? path : '/' + path;
  const suffix = clean === '/' ? '' : clean;
  return `/${lang}${suffix}`;
}
