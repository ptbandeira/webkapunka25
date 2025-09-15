'use client';

import { useEffect } from 'react';
import { track } from '../lib/analytics';

export default function NewsletterTracker(){
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e) => {
      const form = e.target && e.target.closest ? e.target.closest('form') : null;
      if (!form) return;
      const name = String(form.getAttribute('name')||'').toLowerCase();
      if (name === 'newsletter' || form.hasAttribute('data-analytics-newsletter')){
        try{ track('newsletter_submit', {}); }catch(_){ }
      }
    };
    document.addEventListener('submit', handler, true);
    return () => document.removeEventListener('submit', handler, true);
  }, []);
  return null;
}

