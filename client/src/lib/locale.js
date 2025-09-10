export const LOCALES = ['en','pt','es'];

export function getCurrentLang(pathname){
  const m = typeof pathname === 'string' && pathname.match(/^\/(en|pt|es)(\/|$)/i);
  return m ? m[1].toLowerCase() : 'en';
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

