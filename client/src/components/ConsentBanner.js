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
  bottom: '1.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1050,
  maxWidth: '440px',
  width: 'calc(100% - 2.5rem)',
};

const cardStyle = {
  background: '#ffffff',
  color: '#2d2a26',
  borderRadius: '18px',
  padding: '0.85rem 1rem',
  boxShadow: '0 18px 45px rgba(33, 30, 25, 0.15)',
  border: '1px solid rgba(33, 30, 25, 0.12)',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.65rem 0.75rem',
};

const textStyle = {
  fontSize: '0.9rem',
  margin: 0,
  flex: '1 1 auto',
  lineHeight: 1.4,
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
          We use lightweight analytics to understand what’s working. May we enable them for your visit?
        </p>
        <div className="d-flex gap-2 flex-nowrap">
          <button type="button" className="btn btn-primary btn-sm" onClick={accept}>
            Accept
          </button>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={decline}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
