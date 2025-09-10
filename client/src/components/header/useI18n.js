'use client';

import { useEffect, useMemo, useState } from 'react';

export default function useI18n(){
  const [dict, setDict] = useState(null);

  const lang = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const m = window.location.pathname.match(/^\/(en|pt|es)(\/|$)/i);
    return m ? m[1].toLowerCase() : null;
  }, []);

  useEffect(() => {
    if (!lang) { setDict(null); return; }
    fetch(`/i18n/${lang}.json`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(setDict)
      .catch(() => setDict(null));
  }, [lang]);

  return { lang, t: dict };
}
