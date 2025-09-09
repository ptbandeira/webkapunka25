'use client';

import { useEffect, useState } from 'react';

function Price({ value }){
  const fmt = new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', minimumFractionDigits:0, maximumFractionDigits:0 });
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.,-]/g,'').replace(',','.'));
  return <>{fmt.format(isFinite(num) ? num : 0)}</>;
}

export default function ShopPage(){
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/content/products.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(j => setItems(Array.isArray(j?.items) ? j.items : []))
      .catch(() => setItems([]));
  }, []);

  return (
    <main style={{ padding: '6rem 8vw 4rem 8vw' }}>
      <section style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 2rem 0' }}>Shop</h1>
        <div className="row" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:'24px' }}>
          {items.map((p, i) => (
            <div className="col-md-4" key={i}>
              <div className="product-card position-relative">
                <div className="image-holder zoom-effect">
                  <img src={p.image} alt={p.name} className="img-fluid zoom-in" style={{ width:'100%', height: 'auto' }} />
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
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

