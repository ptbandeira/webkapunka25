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
  maxWidth: '420px',
  width: 'calc(100% - 2rem)',
};

const cardStyle = {
  background: 'rgba(33, 37, 41, 0.95)',
  color: '#fff',
  borderRadius: '999px',
  padding: '0.5rem 0.75rem',
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.5rem 0.75rem',
};

const textStyle = {
  fontSize: '0.85rem',
  margin: 0,
  flex: '1 1 auto',
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
          We use privacy-friendly analytics to improve the site. May we collect anonymous usage data?
        </p>
        <div className="d-flex gap-2 flex-nowrap">
          <button type="button" className="btn btn-primary btn-sm" onClick={accept}>
            Accept
          </button>
          <button type="button" className="btn btn-outline-light btn-sm" onClick={decline}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
