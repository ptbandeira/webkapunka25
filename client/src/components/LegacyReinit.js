'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LegacyReinit(){
  const pathname = usePathname();

  useEffect(() => {
    let observer;
    let t0, t1, t2, t3, interval;
    let offLoad;

    function tryInit(){
      try{
        if (typeof window === 'undefined' || !window.Swiper) return false;
        let did = false;
        const main = document.querySelector('.main-swiper');
        if (main && !main.classList.contains('swiper-initialized')){
          // eslint-disable-next-line no-new
          new window.Swiper('.main-swiper', {
            loop: true,
            speed: 800,
            autoplay: { delay: 6000 },
            effect: 'creative',
            creativeEffect: {
              prev: { shadow: true, translate: ['-20%', 0, -1] },
              next: { translate: ['100%', 0, 0] },
            },
            pagination: { el: '.main-slider-pagination', clickable: true },
          });
          did = true;
        }
        const prod = document.querySelector('.product-swiper');
        if (prod && !prod.classList.contains('swiper-initialized')){
          // eslint-disable-next-line no-new
          new window.Swiper('.product-swiper', {
            speed: 1000,
            spaceBetween: 20,
            navigation: { nextEl: '.product-carousel-next', prevEl: '.product-carousel-prev' },
            breakpoints: {
              0:   { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              900: { slidesPerView: 3, spaceBetween: 20 },
              1200:{ slidesPerView: 5, spaceBetween: 20 },
            },
          });
          did = true;
        }
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
      if (isHealthy() || attempts > 16){ // ~4s max
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
