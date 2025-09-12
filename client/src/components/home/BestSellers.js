'use client';

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { dlog } from '../../lib/debug';

function Price({ value }) {
  const num = typeof value === 'number' ? value : Number(String(value || '').replace(/[^\d.,-]/g, '').replace(',', '.'));
  const fmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return <>{fmt.format(isFinite(num) ? num : 0)}</>;
}

export default function BestSellers({ items = [] }) {
  const containerRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    try {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      dlog('BestSellers(swiper) initial', { w: Math.round(r.width), h: Math.round(r.height) });
    } catch (e) {}
  }, []);

  return (
    <section className="padding-large product-store" id="bestSellersReact">
      <div className="container" ref={containerRef}>
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Best-Sellers</h3>
          <div className="btn-right d-flex flex-wrap align-items-center">
            <a href="/shop" className="btn me-3">View all</a>
            <div className="swiper-buttons">
              <button className="swiper-prev best-sellers-prev me-2" ref={prevRef}>
                <svg width="41" height="41"><use xlinkHref="#angle-left" /></svg>
              </button>
              <button className="swiper-next best-sellers-next" ref={nextRef}>
                <svg width="41" height="41"><use xlinkHref="#angle-right" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onSwiper={(swiper) => {
            try {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            } catch (e) {}
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 5 },
          }}
          speed={1000}
          className="best-sellers-swiper"
        >
          {items.map((p, i) => (
            <SwiperSlide key={`s-${i}`}>
              <div className="product-card position-relative">
                <div className="image-holder zoom-effect" style={{ aspectRatio: '1 / 1' }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="img-fluid zoom-in"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
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

