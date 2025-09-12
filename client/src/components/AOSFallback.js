'use client';

import { useEffect } from 'react';

export default function AOSFallback(){
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.AOS) {
      document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
        el.style.opacity = '1';
      });
    }
  }, []);
  return null;
}
