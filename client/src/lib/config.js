// Rendering mode flags
// When false (default), Home uses the full legacy markup and legacy scripts
// When true, Home uses the React sections (Hero/Best‑Sellers/VideoStrip)
export const USE_REACT_HOME = false;

// Global feature flags
// Defaults: true in dev, false in prod (unless specified otherwise)
const isProd = process.env.NODE_ENV === 'production';
const envOn = (v) => typeof v === 'string' && /^(1|true|yes|on)$/i.test(v);

function envToggle(value, fallback){
  if (typeof value === 'string') return envOn(value);
  return fallback;
}

function buildDefaultFeatureFlags(){
  return {
    learn: envToggle(process.env.NEXT_PUBLIC_FEATURE_LEARN, !isProd),
    clinics: envToggle(process.env.NEXT_PUBLIC_FEATURE_CLINICS, !isProd),
    training: envToggle(process.env.NEXT_PUBLIC_FEATURE_TRAINING, !isProd),
    policies: envToggle(process.env.NEXT_PUBLIC_FEATURE_POLICIES, true),
    cart: envToggle(process.env.NEXT_PUBLIC_FEATURE_CART, true),
    reviews: envToggle(process.env.NEXT_PUBLIC_FEATURE_REVIEWS, false),
    // Decap-driven pages (SSG/ISR only)
    decapPages: envToggle(process.env.NEXT_PUBLIC_FEATURE_DECAP_PAGES, true),
  };
}

const STORAGE_KEY = 'feature-overrides';

function parseOverrides(raw){
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function getClientOverrides(){
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return parseOverrides(stored);
  } catch {}
  return {};
}

function getServerOverrides(){
  if (isProd) return {};
  try {
    // eslint-disable-next-line global-require
    const { cookies } = require('next/headers');
    const raw = cookies().get(STORAGE_KEY)?.value;
    return parseOverrides(raw ? decodeURIComponent(raw) : '');
  } catch {
    return {};
  }
}

function getOverrides(){
  if (typeof window !== 'undefined') return getClientOverrides();
  return getServerOverrides();
}

export function getFeatureFlags(){
  return { ...buildDefaultFeatureFlags(), ...getOverrides() };
}

export function getDefaultFeatureFlags(){
  return buildDefaultFeatureFlags();
}

export function isFeatureEnabled(key){
  const flags = getFeatureFlags();
  return Boolean(flags[key]);
}

function persistClientOverrides(overrides){
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify(overrides);
  try {
    window.localStorage.setItem(STORAGE_KEY, payload);
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(payload)}; path=/`;
  } catch {}
  window.dispatchEvent(new CustomEvent('feature-overrides-changed'));
}

export function setClientFeatureOverride(key, value){
  if (typeof window === 'undefined') return;
  const overrides = getClientOverrides();
  overrides[key] = value;
  persistClientOverrides(overrides);
}

export function clearClientFeatureOverrides(){
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    document.cookie = `${STORAGE_KEY}=; Max-Age=0; path=/`;
  } catch {}
  window.dispatchEvent(new CustomEvent('feature-overrides-changed'));
}

export function listAvailableFeatures(){
  return Object.keys(buildDefaultFeatureFlags());
}

// Canonical contact details
export const contact = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@kapunkargan.com',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+48 000 000 000',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || '', // e.g. https://wa.me/48XXXXXXXXX
};

// Site info
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kapunkargan.com',
};

// External checkout endpoint (optional). If set, the cart "Checkout" button
// redirects to this URL with a base64-encoded cart payload in `cart` param.
export const checkout = {
  url: process.env.NEXT_PUBLIC_CHECKOUT_URL || '',
};
