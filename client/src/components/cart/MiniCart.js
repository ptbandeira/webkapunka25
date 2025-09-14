'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart, close, clear, remove, removeAll, add, total } from '../../store/cart';

function Price({ value }){
  const num = typeof value === 'number' ? value : Number(String(value||'').replace(/[^\d.,-]/g,'').replace(',','.'));
  const fmt = new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', minimumFractionDigits:0, maximumFractionDigits:0 });
  return <>{fmt.format(isFinite(num) ? num : 0)}</>;
}

export default function MiniCart(){
  const cart = useCart();
  const isOpen = cart.open;
  const closeBtnRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Basic scroll lock when drawer is open
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useEffect(() => { setMounted(isOpen); }, [isOpen]);
  if (!isOpen && !mounted) return null;

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 2000,
  };
  const panelStyle = {
    position: 'absolute', top: 0, right: 0, height: '100%', width: 'min(92vw, 380px)', background: '#fff',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)', display: 'grid', gridTemplateRows: 'auto 1fr auto',
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .22s ease',
  };
  const headerStyle = { padding: '18px 20px', borderBottom: '1px solid rgba(0,0,0,.08)' };
  const bodyStyle = { overflow: 'auto', padding: 20 };
  const footerStyle = { padding: 20, borderTop: '1px solid rgba(0,0,0,.08)' };
  const accent = { height: 3, background: 'var(--primary-color, #b8892d)' };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-labelledby="minicart-title" onClick={(e) => { if (e.currentTarget === e.target) close(); }}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={accent} />
        <div style={headerStyle} className="d-flex align-items-center justify-content-between">
          <h3 id="minicart-title" className="mb-0" style={{ fontFamily: 'Italiana, serif', letterSpacing: '.02em' }}>Your Cart</h3>
          <button ref={closeBtnRef} className="btn btn-sm btn-outline-secondary" onClick={() => close()} aria-label="Close">Close</button>
        </div>
        <div style={bodyStyle}>
          {cart.items.length === 0 && (
            <p className="mb-0 text-muted">Your cart is empty.</p>
          )}

          {cart.items.map((it) => (
            <div className="card mb-3 border-0 shadow-sm" key={it.id}>
              <div className="card-body d-flex gap-3 align-items-center">
                <div className="image-holder" style={{ width: 64, height: 64, flex: '0 0 auto', borderRadius: 8, overflow: 'hidden' }}>
                  {it.image ? (
                    <img src={it.image} alt={it.name} className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="bg-light" style={{ width: '100%', height: '100%' }} />
                  )}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold text-capitalize">{it.name}</div>
                      <div className="text-muted small">Qty {it.qty} · <Price value={it.price} /></div>
                    </div>
                    <div className="fw-semibold item-price text-primary"><Price value={it.price * it.qty} /></div>
                  </div>
                  <div className="mt-2 d-flex gap-2 align-items-center">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => remove(it.id)}>-</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => add({ id: it.id, name: it.name, price: it.price, qty: 1, image: it.image })}>+</button>
                    <button className="btn btn-sm btn-link text-muted" onClick={() => removeAll(it.id)}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {process.env.NODE_ENV !== 'production' && (
            <button className="btn btn-sm btn-outline-primary" onClick={() => add({ id: 'test-100', name: 'Argan Oil 50ml', price: 32, qty: 1, image: '/images/product-item4.jpg' })}>
              + Add test item
            </button>
          )}
        </div>
        <div style={footerStyle}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="fw-semibold">Subtotal</div>
            <div className="fw-semibold fs-5 item-price text-primary"><Price value={total()} /></div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn-link link-dark p-0" onClick={() => close()}>Continue shopping</button>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => clear()}>Clear</button>
              <button className="btn btn-primary" disabled={cart.items.length === 0} onClick={() => { try { require('../../lib/analytics').track('begin_checkout', { items: cart.items.length, total: total() }); } catch(e){} }}>Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
