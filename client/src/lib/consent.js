const STORAGE_KEY = 'kapunka-consent';
const EVENT_KEY = 'consent-change';

function safeWindow() {
  return typeof window !== 'undefined' ? window : null;
}

export function shouldRespectDNT() {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator || {};
  const dnt = nav.doNotTrack || window.doNotTrack || nav.msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
}

export function getStoredConsent() {
  const win = safeWindow();
  if (!win) return null;
  try {
    const value = win.localStorage.getItem(STORAGE_KEY);
    if (value === 'accepted' || value === 'denied') return value;
  } catch (err) {}
  return null;
}

export function setStoredConsent(value) {
  const win = safeWindow();
  if (!win) return;
  const prev = getStoredConsent();
  try {
    win.localStorage.setItem(STORAGE_KEY, value);
  } catch (err) {}
  if (prev !== value) {
    win.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: value }));
  }
}

export function clearStoredConsent() {
  const win = safeWindow();
  if (!win) return;
  try {
    win.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {}
  win.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: null }));
}

export function subscribeToConsent(callback) {
  const win = safeWindow();
  if (!win) return () => {};
  const handler = (event) => {
    const detail = event?.detail;
    if (detail === undefined) {
      callback(getStoredConsent());
    } else {
      callback(detail);
    }
  };
  win.addEventListener(EVENT_KEY, handler);
  return () => win.removeEventListener(EVENT_KEY, handler);
}

export function ensureDntPreference() {
  if (!shouldRespectDNT()) return null;
  if (getStoredConsent() !== 'denied') {
    setStoredConsent('denied');
  }
  return 'denied';
}

export const CONSENT_STORAGE_KEY = STORAGE_KEY;
