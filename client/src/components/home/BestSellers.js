'use client';

import { useEffect, useRef } from 'react';
import { dlog } from '../../lib/debug';

function Price({ value }){
  const num = typeof value === 'number' ? value : Number(String(value || '').replace(/[^\d.,-]/g, '').replace(',', '.'));
  const fmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return <>{fmt.format(isFinite(num) ? num : 0)}</>;
}

export default function BestSellers({ items = [] }){
  const containerRef = useRef(null);
  useEffect(() => {
    try{
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      dlog('BestSellers(grid) initial', { w: Math.round(r.width), h: Math.round(r.height) });
    }catch(e){}
  }, []);
  return (
    <section className="padding-large product-store" id="bestSellersReact">
      <div className="container" ref={containerRef}>
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Best-Sellers</h3>
            <div />
          </div>
        </div>
        <div className="row g-4" role="list">
          {items.map((p, i) => (
            <div className="col-sm-6 col-md-4 col-lg-3" role="listitem" key={`g-${i}`}>
              <div className="product-card position-relative">
                <div className="image-holder zoom-effect">
                  <img src={p.image} alt={p.name} className="img-fluid zoom-in" loading="lazy" />
                </div>
                <div className="card-detail text-center pt-3 pb-2">
                  <h5 className="card-title fs-3 text-capitalize">
                    <a href={p.link || '#'}>{p.name}</a>
                  </h5>
                  <span className="item-price text-primary fs-3 fw-light"><Price value={p.price} /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
