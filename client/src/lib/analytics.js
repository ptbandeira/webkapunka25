'use client';

const SRC = process.env.NEXT_PUBLIC_ANALYTICS_SRC || '';
const DEBUG = /^(1|true|yes|on)$/i.test(process.env.NEXT_PUBLIC_ANALYTICS_DEBUG || '1');

export function track(event, props = {}){
  try{
    if (typeof window === 'undefined') return;
    // External tracker hook (if a loader sets window.kpa)
    if (typeof window.kpa === 'function'){
      try{ window.kpa(event, props); }catch(e){}
    }
    // Dev/debug console log (no network)
    if (DEBUG || !SRC){
      // eslint-disable-next-line no-console
      console.log('[analytics]', event, props);
    }
  }catch(e){}
}

export function loadExternal(){
  if (!SRC || typeof window === 'undefined') return;
  if (document.getElementById('analytics-src')) return;
  const s = document.createElement('script');
  s.src = SRC; s.async = true; s.id = 'analytics-src';
  document.head.appendChild(s);
}

