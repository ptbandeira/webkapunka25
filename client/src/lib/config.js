// Feature flags for rendering modes
// When false (default), Home uses the full legacy markup and legacy scripts
// When true, Home uses the React sections (Hero/Best‑Sellers/VideoStrip)
export const USE_REACT_HOME = false;

// Global feature flags
// Defaults: true in dev, false in prod
const isProd = process.env.NODE_ENV === 'production';
const envOn = (v) => typeof v === 'string' && /^(1|true|yes|on)$/i.test(v);
export const features = {
  // Decap-driven pages (SSG/ISR only)
  decapPages: envOn(process.env.NEXT_PUBLIC_FEATURE_DECAP_PAGES) || !isProd,
};
