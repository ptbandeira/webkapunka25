'use client';

import { useEffect } from 'react';
import { useCart, close, clear, remove, add, total } from '../../store/cart';

export default function MiniCart(){
  const cart = useCart();
  const isOpen = cart.open;

  useEffect(() => {
    // Basic scroll lock when drawer is open
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 2000,
  };
  const panelStyle = {
    position: 'absolute', top: 0, right: 0, height: '100%', width: 'min(92vw, 360px)', background: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'grid', gridTemplateRows: 'auto 1fr auto',
  };
  const headerStyle = { padding: '16px 18px', borderBottom: '1px solid rgba(0,0,0,.08)' };
  const bodyStyle = { overflow: 'auto', padding: 18 };
  const footerStyle = { padding: 18, borderTop: '1px solid rgba(0,0,0,.08)' };

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" onClick={(e) => { if (e.currentTarget === e.target) close(); }}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle} className="d-flex align-items-center justify-content-between">
          <strong>Cart</strong>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => close()} aria-label="Close">Close</button>
        </div>
        <div style={bodyStyle}>
          {cart.items.length === 0 && (
            <p className="mb-0">Your cart is empty.</p>
          )}
          {cart.items.map((it) => (
            <div className="card mb-3" key={it.id}>
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-semibold">{it.name}</div>
                  <div className="text-muted">Qty {it.qty}</div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => remove(it.id)}>-</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => add({ id: it.id, name: it.name, price: it.price, qty: 1 })}>+</button>
                </div>
              </div>
            </div>
          ))}

          {process.env.NODE_ENV !== 'production' && (
            <button className="btn btn-sm btn-outline-primary" onClick={() => add({ id: 'test-100', name: 'Argan Oil 50ml', price: 32, qty: 1 })}>
              + Add test item
            </button>
          )}
        </div>
        <div style={footerStyle} className="d-flex align-items-center justify-content-between">
          <div className="fw-semibold">Total: €{total().toFixed(0)}</div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => clear()}>Clear</button>
            <button className="btn btn-primary" disabled>Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

