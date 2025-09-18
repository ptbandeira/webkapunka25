'use client';

import { useEffect } from 'react';
import { loadExternal } from '../lib/analytics';
import { isFeatureEnabled } from '../lib/config';
import {
  getStoredConsent,
  subscribeToConsent,
  shouldRespectDNT,
} from '../lib/consent';

let analyticsBootstrapped = false;

function maybeLoadAnalytics() {
  if (analyticsBootstrapped) return;
  if (shouldRespectDNT()) return;
  loadExternal();
  analyticsBootstrapped = true;
}

export default function AnalyticsLoader(){
  useEffect(() => {
    const consentEnabled = isFeatureEnabled('consent');

    if (!consentEnabled) {
      maybeLoadAnalytics();
      return undefined;
    }

    const evaluate = () => {
      const consent = getStoredConsent();
      if (consent === 'accepted') {
        maybeLoadAnalytics();
      }
    };

    evaluate();
    const unsubscribe = subscribeToConsent(() => {
      evaluate();
    });

    return unsubscribe;
  }, []);

  return null;
}
