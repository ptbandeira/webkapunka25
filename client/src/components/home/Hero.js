'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { usePathname } from 'next/navigation';
import { dlog } from '../../lib/debug';
import { getCurrentLang } from '../../lib/locale';

export default function Hero({ title, subtitle }){
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
        <SwiperSlide style={{ backgroundImage: 'url(/images/banner-image.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: '100vh', backgroundPosition: 'center' }}>
          <div className="container ">
            <div className="row">
              <div className="offset-md-1 col-md-6">
                <div className="banner-content">
                  <h2>{title}</h2>
                  {subtitle ? <p className="fs-3">{subtitle}</p> : null}
                  <a href={`/${lang}/shop`} className="btn">Shop the Oil</a>
                </div>
              </div>
              <div className="col-md-5"></div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide style={{ backgroundImage: 'url(/images/banner-image1.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: '100vh', backgroundPosition: 'center' }}>
          <div className="container">
            <div className="row">
              <div className="offset-md-6 col-md-6">
                <div className="banner-content">
                  <h2>Pure, Cold‑Pressed Argan Oil</h2>
                  <p className="fs-3">Single-ingredient care for skin & hair.</p>
                  <a href={`/${lang}/shop`} className="btn">Shop the Oil</a>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide style={{ backgroundImage: 'url(/images/banner-image2.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: '100vh', backgroundPosition: 'center' }}>
          <div className="container">
            <div className="row">
              <div className="offset-md-1 col-md-6">
                <div className="banner-content">
                  <h2>Calm, Repair, Protect</h2>
                  <p className="fs-3">Fragrance‑free and lab‑tested argan oil.</p>
                  <a href={`/${lang}/shop`} className="btn">Shop the Oil</a>
                </div>
              </div>
              <div className="col-md-5"></div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="main-slider-pagination"></div>
    </section>
  );
}
