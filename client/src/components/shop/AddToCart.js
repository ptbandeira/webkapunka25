'use client';

import { add, open as openCart } from '../../store/cart';
import { track } from '../../lib/analytics';

function Price({ value }){
  const num = typeof value === 'number' ? value : Number(String(value||'').replace(/[^\d.,-]/g,'').replace(',','.'));
  const fmt = new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', minimumFractionDigits:0, maximumFractionDigits:0 });
  return <>{fmt.format(isFinite(num) ? num : 0)}</>;
}

export default function AddToCart({ product }){
  if (!product) return null;
  const handleAdd = () => {
    add({ id: product.id, name: product.name, price: product.price, qty: 1, image: product.image });
    openCart();
    track('add_to_cart', { id: product.id, name: product.name, price: product.price });
  };
  return (
    <div className="d-flex align-items-center gap-3 mb-4">
      <span className="item-price text-primary fs-3 fw-light"><Price value={product.price} /></span>
      <button className="btn btn-primary" onClick={handleAdd}>Add to Cart</button>
    </div>
  );
}
