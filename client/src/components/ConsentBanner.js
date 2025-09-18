'use client';

import { useEffect, useState } from 'react';
import { isFeatureEnabled } from '../lib/config';
import {
  ensureDntPreference,
  getStoredConsent,
  setStoredConsent,
  shouldRespectDNT,
  subscribeToConsent,
} from '../lib/consent';

const containerStyle = {
  position: 'fixed',
  bottom: '1.25rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1050,
  maxWidth: '460px',
  width: 'calc(100% - 2.5rem)',
};

const cardStyle = {
  background: '#fdf8f3',
  color: '#3a2f24',
  borderRadius: '20px',
  padding: '1rem 1.2rem',
  boxShadow: '0 24px 48px rgba(58, 47, 36, 0.18)',
  border: '1px solid rgba(58, 47, 36, 0.12)',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.75rem 1rem',
};

const textStyle = {
  fontSize: '0.92rem',
  margin: 0,
  flex: '1 1 auto',
  lineHeight: 1.45,
};

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isFeatureEnabled('consent')) return undefined;
    setEnabled(true);
    const dnt = ensureDntPreference();
    if (dnt === 'denied') {
      setVisible(false);
      return undefined;
    }
    const stored = getStoredConsent();
    setVisible(!stored);
    const unsubscribe = subscribeToConsent((value) => {
      setVisible(!value);
    });
    return unsubscribe;
  }, []);

  if (!enabled || !visible || shouldRespectDNT()) return null;

  const accept = () => {
    setStoredConsent('accepted');
    setVisible(false);
  };

  const decline = () => {
    setStoredConsent('denied');
    setVisible(false);
  };

  return (
    <div style={containerStyle} role="dialog" aria-live="polite" aria-label="Analytics consent prompt">
      <div style={cardStyle}>
        <p style={textStyle} className="mb-0">
          We quietly observe anonymous usage to improve Kapunka. Would you allow these analytics today?
        </p>
        <div className="d-flex gap-2 flex-nowrap">
          <button type="button" className="btn btn-primary btn-sm" onClick={accept}>
            Allow analytics
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={decline}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
