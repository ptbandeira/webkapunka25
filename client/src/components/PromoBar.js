'use client';

export default function PromoBar(){
  const isProd = process.env.NODE_ENV === 'production';
  const text = process.env.NEXT_PUBLIC_PROMO_TEXT || (!isProd ? 'Free shipping over €50' : '');
  if (!text) return null;
  const style = {
    background: 'var(--accent, #e9dec5)',
    color: '#000',
    fontSize: 14,
    lineHeight: '18px',
    padding: '8px 16px',
    textAlign: 'center',
  };
  return (
    <div className="d-none d-md-block" style={style} role="note" aria-label="Promotion">
      {text}
    </div>
  );
}

