'use client';

// Not wired yet. This component mirrors the legacy best‑sellers carousel
// using Swiper React with the same classes/markup for visual parity.
// We'll hook it into the home route in the next step.

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function Price({ value }){
  const num = typeof value === 'number' ? value : Number(String(value || '').replace(/[^\d.,-]/g, '').replace(',', '.'));
  const fmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return <>{fmt.format(isFinite(num) ? num : 0)}</>;
}

export default function BestSellers({ items = [] }){
  const pathname = usePathname();
  // Remove SSR skeleton only after we confirm slides are rendered
  useEffect(() => {
    let tries = 0;
    const clearSSR = () => {
      try{
        const root = document.querySelector('#bestSellersReact .react-product-swiper .swiper-wrapper');
        const slideCount = root ? root.children.length : 0;
        if (slideCount > 0){
          const sk = document.getElementById('bestSellersSSR');
          if (sk && sk.parentElement) sk.parentElement.removeChild(sk);
          return true;
        }
      }catch(e){}
      return false;
    };
    if (clearSSR()) return;
    const t = setInterval(() => { if (++tries > 10 || clearSSR()) clearInterval(t); }, 100);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="padding-large product-store" id="bestSellersReact">
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Best-Sellers</h3>
            <div className="d-flex align-items-center gap-2">
              <button className="swiper-prev react-product-carousel-prev" aria-label="Previous">‹</button>
              <button className="swiper-next react-product-carousel-next" aria-label="Next">›</button>
            </div>
          </div>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation={{ nextEl: '.react-product-carousel-next', prevEl: '.react-product-carousel-prev' }}
          speed={1000}
          spaceBetween={20}
          observer={true}
          observeParents={true}
          resizeObserver={true}
          watchOverflow={true}
          onSwiper={(swiper) => { try { setTimeout(() => swiper.update(), 0); } catch(e){} }}
          onResize={(swiper) => { try { swiper.update(); } catch(e){} }}
          rebuildOnUpdate={true}
          key={`bs-${pathname || ''}`}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            900: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="react-product-swiper"
        >
          {items.map((p, i) => (
            <SwiperSlide key={i}>
              <div className="product-card position-relative">
                <div className="image-holder zoom-effect">
                  <img src={p.image} alt={p.name} className="img-fluid zoom-in" loading="lazy" />
                  <div className="cart-concern position-absolute">
                    <div className="cart-button">
                      <a href={p.link || '#'} className="btn">Add to Cart</a>
                    </div>
                  </div>
                </div>
                <div className="card-detail text-center pt-3 pb-2">
                  <h5 className="card-title fs-3 text-capitalize">
                    <a href={p.link || '#'}>{p.name}</a>
                  </h5>
                  <span className="item-price text-primary fs-3 fw-light"><Price value={p.price} /></span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
