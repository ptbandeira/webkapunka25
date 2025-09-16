'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { usePathname } from 'next/navigation';
import { dlog } from '../../lib/debug';
import { getCurrentLang } from '../../lib/locale';
import { buildImageSources } from '../../lib/image-sources';

const SLIDES = [
  {
    image: '/images/banner-image.jpg',
    heading: (title) => title || 'Calm, Repair, Protect',
    body: (subtitle) => subtitle || 'Helps restore the skin barrier and ease redness after procedures or everyday stress.',
    cta: 'Shop the Oil',
    position: 'left',
  },
  {
    image: '/images/banner-image1.jpg',
    heading: () => 'Pure, Cold‑Pressed Argan Oil',
    body: () => 'Single-ingredient care for skin & hair.',
    cta: 'Shop the Oil',
    position: 'right',
  },
  {
    image: '/images/banner-image2.jpg',
    heading: () => 'Calm, Repair, Protect',
    body: () => 'Fragrance‑free and lab‑tested argan oil.',
    cta: 'Shop the Oil',
    position: 'left',
  },
];

export default function Hero({ title, subtitle, imageManifest = {} }){
  const pathname = usePathname();
  const lang = getCurrentLang(pathname || '/');
  return (
    <section id="billboard" className="position-relative overflow-hidden">
      <Swiper
        key={`hero-${pathname || ''}`}
        modules={[Pagination, Autoplay, EffectCreative]}
        effect="creative"
        creativeEffect={{ prev: { shadow: true, translate: ['-20%', 0, -1] }, next: { translate: ['100%', 0, 0] } }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ el: '.main-slider-pagination', clickable: true }}
        className="main-swiper"
        observer
        observeParents
        resizeObserver
        onSwiper={(s) => { try { setTimeout(() => { s.update(); dlog('Hero swiper updated'); }, 0); } catch(e){} }}
        onResize={(s) => { try { s.update(); dlog('Hero resize update'); } catch(e){} }}
      >
        {SLIDES.map((slide, idx) => {
          const sources = buildImageSources(imageManifest, slide.image);
          const placeholder = sources?.lqip ? {
            backgroundImage: `url(${sources.lqip})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : null;
          const alignment = slide.position === 'right' ? 'offset-md-6 col-md-6' : 'offset-md-1 col-md-6';
          return (
            <SwiperSlide key={`hero-slide-${idx}`}>
              <div className="position-relative" style={{ height: '100vh', ...(placeholder || {}) }}>
                <img
                  src={sources?.src || slide.image}
                  srcSet={sources?.srcSet}
                  sizes="100vw"
                  alt=""
                  role="presentation"
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ objectFit: 'cover', filter: 'brightness(0.75)' }}
                />
                <div className="container position-relative" style={{ zIndex: 1 }}>
                  <div className="row">
                    <div className={alignment}>
                      <div className="banner-content">
                        <h2>{slide.heading(title)}</h2>
                        {slide.body(subtitle) ? <p className="fs-3">{slide.body(subtitle)}</p> : null}
                        <a href={`/${lang}/shop`} className="btn">{slide.cta}</a>
                      </div>
                    </div>
                    <div className="col-md-5"></div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="main-slider-pagination"></div>
    </section>
  );
}
