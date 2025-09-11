'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LegacyReinit(){
  const pathname = usePathname();
  const isHome = /^\/(en|pt|es)\/?$/i.test(pathname || '/');
  if (isHome) return null; // React-only on Home; skip legacy reinit entirely

  useEffect(() => {
    let observer;
    let t0, t1, t2, t3, interval;
    let offLoad;

    function initSwiper(selector, options){
      try{
        const el = document.querySelector(selector);
        if (!el) return false;
        // If a stale instance exists, destroy it to avoid broken state
        if (el.swiper && typeof el.swiper.destroy === 'function'){
          try { el.swiper.destroy(true, true); } catch(e){}
        }
        // eslint-disable-next-line no-new
        new window.Swiper(selector, options);
        return true;
      }catch(e){ return false; }
    }

    function reinitJarallax(){
      try{
        if (typeof window === 'undefined' || !window.jarallax) return false;
        const els = document.querySelectorAll('.jarallax, .jarallax-img');
        if (!els || els.length === 0) return false;
        try { window.jarallax(document.querySelectorAll('.jarallax'), 'destroy'); } catch(e){}
        try {
          window.jarallax(document.querySelectorAll('.jarallax'));
          window.jarallax(document.querySelectorAll('.jarallax-img'), { keepImg: true });
        } catch(e){}
        return true;
      }catch(e){ return false; }
    }

    function tryInit(){
      try{
        if (typeof window === 'undefined' || !window.Swiper) return false;
        let did = false;
        // Skip hero/product on non-home pages too unless needed; other legacy widgets may run
        // Do not initialize legacy product-swiper; React carousel handles Best‑Sellers
        // Re-initialize parallax backgrounds (jarallax)
        did = reinitJarallax() || did;
        return did;
      }catch(e){ return false; }
    }

    // Immediate attempts and short retries
    tryInit();
    t0 = setTimeout(tryInit, 0);
    t1 = setTimeout(tryInit, 150);
    t2 = setTimeout(tryInit, 500);
    t3 = setTimeout(tryInit, 1000);

    // Also attempt after full window load (late assets)
    try{
      const onLoad = () => { tryInit(); };
      window.addEventListener('load', onLoad, { once: true });
      offLoad = () => window.removeEventListener('load', onLoad);
    }catch(e){}

    function isHealthy(){
      try{
        const el = document.querySelector('.main-swiper');
        if (!el) return false;
        const inited = el.classList.contains('swiper-initialized');
        const wrapper = el.querySelector('.swiper-wrapper');
        const hasSlides = wrapper && wrapper.children && wrapper.children.length > 0;
        const h = el.clientHeight || (wrapper ? wrapper.clientHeight : 0);
        return inited && hasSlides && h > 0;
      }catch(e){ return false; }
    }

    // Observe DOM for sliders appearing then init once
    try{
      observer = new MutationObserver(() => {
        if (tryInit() && observer){ observer.disconnect(); }
      });
      observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }catch(e){}

    // As a last safety, poll for a short time and initialize if unhealthy
    let attempts = 0;
    interval = setInterval(() => {
      attempts++;
      if (isHealthy() || attempts > 24){ // ~6s max
        clearInterval(interval);
        interval = null;
      } else {
        tryInit();
      }
    }, 250);

    return () => {
      try{ if (observer) observer.disconnect(); }catch(e){}
      if (offLoad) offLoad();
      clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (interval) clearInterval(interval);
    };
  }, [pathname]);

  return null;
}
