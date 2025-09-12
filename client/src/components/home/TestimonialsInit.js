'use client';

import { useEffect } from 'react';

export default function TestimonialsInit(){
  useEffect(() => {
    let swiperInstance = null;
    let cleanup = null;
    (async () => {
      try{
        const el = document.querySelector('.testimonial-swiper');
        if (!el) return;
        // Dynamically import Swiper core to avoid SSR issues
        const { default: Swiper } = await import('swiper');
        const { Navigation } = await import('swiper/modules');
        Swiper.use([Navigation]);
        swiperInstance = new Swiper('.testimonial-swiper', {
          speed: 1000,
          navigation: {
            nextEl: '.testimonial-arrow-next',
            prevEl: '.testimonial-arrow-prev',
          },
        });
        cleanup = () => { try { swiperInstance?.destroy(true, true); } catch(e){} };
      }catch(e){ /* noop */ }
    })();
    return () => { if (cleanup) cleanup(); };
  }, []);
  return null;
}

