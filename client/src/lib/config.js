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
  policies: !isProd,
  cart: !isProd,
};

export function isFeatureEnabled(key){
  return Boolean(features[key]);
}
