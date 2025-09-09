'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LegacyReinit(){
  const pathname = usePathname();

  useEffect(() => {
    try{
      // Re-init Swiper sliders used by the legacy homepage after SPA nav
      if (typeof window !== 'undefined' && window.Swiper){
        const main = document.querySelector('.main-swiper');
        if (main && !main.classList.contains('swiper-initialized')){
          // Matches legacy options closely
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
        }
      }
    }catch(e){}
  }, [pathname]);

  return null;
}

