'use client';

export function isDebugUI(){
  try{
    if (typeof window === 'undefined') return false;
    const url = new URL(window.location.href);
    const q = (url.searchParams.get('debugui')||'').toLowerCase();
    if (q === '1' || q === 'true') return true;
    return window.localStorage.getItem('debugui') === '1';
  }catch(e){ return false; }
}

export function dlog(...args){
  if (!isDebugUI()) return;
  try{ console.debug('[UI]', ...args); }catch(e){}
}

