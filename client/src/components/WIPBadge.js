'use client';

export default function WIPBadge(){
  if (process.env.NODE_ENV === 'production') return null;
  const style = {
    position: 'fixed',
    bottom: 12,
    right: 12,
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 10px',
    borderRadius: 999,
    zIndex: 2000,
    letterSpacing: '.03em',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
  };
  return (
    <div style={style} aria-label="Work in progress">
      WIP
    </div>
  );
}

