'use client';

import { useEffect, useMemo, useState } from 'react';

export default function useI18n(){
  const [dict, setDict] = useState(null);

  const lang = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const url = new URL(window.location.href);
    const qp = (url.searchParams.get('lang') || '').toLowerCase();
    return ['pt','es'].includes(qp) ? qp : null;
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

