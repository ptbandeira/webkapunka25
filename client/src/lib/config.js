// Rendering mode flags
// When false (default), Home uses the full legacy markup and legacy scripts
// When true, Home uses the React sections (Hero/Best‑Sellers/VideoStrip)
export const USE_REACT_HOME = false;

// Global feature flags (Step 0)
// Defaults: true in dev, false in prod
const isProd = process.env.NODE_ENV === 'production';
export const features = {
  learn: !isProd,
  clinics: !isProd,
  training: !isProd,
  policies: !isProd, // policies now live; footer no longer gated, kept for future use
  cart: !isProd,
};

export function isFeatureEnabled(key){
  return Boolean(features[key]);
}

// Canonical contact details (Step 6)
export const contact = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@kapunkargan.com',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+48 000 000 000',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || '', // e.g. https://wa.me/48XXXXXXXXX
};
