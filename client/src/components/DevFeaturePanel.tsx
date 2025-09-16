'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  getFeatureFlags,
  listAvailableFeatures,
  setClientFeatureOverride,
  clearClientFeatureOverrides,
} from '../lib/config';

const isProd = process.env.NODE_ENV === 'production';

const panelStyle: CSSProperties = {
  position: 'fixed',
  bottom: '1.5rem',
  right: '1.5rem',
  zIndex: 9999,
  background: 'rgba(0,0,0,0.85)',
  color: '#fff',
  borderRadius: '12px',
  padding: '0.75rem 1rem',
  boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
  minWidth: '220px',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const buttonStyle: CSSProperties = {
  border: '1px solid rgba(255,255,255,0.4)',
  borderRadius: '6px',
  background: 'transparent',
  color: '#fff',
  padding: '0.25rem 0.5rem',
  cursor: 'pointer',
};

export default function DevFeaturePanel(){
  const [open, setOpen] = useState(false);
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isProd) return undefined;
    const sync = () => setFlags(getFeatureFlags());
    sync();
    window.addEventListener('feature-overrides-changed', sync);
    return () => window.removeEventListener('feature-overrides-changed', sync);
  }, []);

  if (isProd) return null;

  const toggle = (key: string) => {
    const next = !flags[key];
    setClientFeatureOverride(key, next);
    setFlags(getFeatureFlags());
    setTimeout(() => { window.location.reload(); }, 100);
  };

  const reset = () => {
    clearClientFeatureOverrides();
    setFlags(getFeatureFlags());
    setTimeout(() => { window.location.reload(); }, 100);
  };

  const features = listAvailableFeatures();

  return (
    <div style={panelStyle} aria-live="polite">
      <button type="button" style={{ ...buttonStyle, width: '100%' }} onClick={() => setOpen(v => !v)}>
        Dev Flags
      </button>
      {open ? (
        <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
          <p style={{ marginBottom: '0.5rem', opacity: 0.8 }}>Toggle for this browser (dev only).</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {features.map(key => (
              <li key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span>{key}</span>
                <button
                  type="button"
                  style={{ ...buttonStyle, borderColor: flags[key] ? '#4ade80' : 'rgba(255,255,255,0.35)' }}
                  onClick={() => toggle(key)}
                >
                  {flags[key] ? 'on' : 'off'}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" style={{ ...buttonStyle, width: '100%', marginTop: '0.75rem' }} onClick={reset}>
            Reset overrides
          </button>
        </div>
      ) : null}
    </div>
  );
}
