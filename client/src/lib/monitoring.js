let sentryInitPromise = null;
let sentryModule = null;

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || '';
const SENTRY_ENABLED = Boolean(SENTRY_DSN) && !/^(0|false|off|no)$/i.test(process.env.NEXT_PUBLIC_SENTRY_ENABLED || '1');
const SAMPLE_RATE_RAW = process.env.NEXT_PUBLIC_SENTRY_SAMPLE_RATE || '0.1';
const SAMPLE_RATE = Math.max(0, Math.min(1, Number(SAMPLE_RATE_RAW) || 0.1));
const RELEASE = process.env.NEXT_PUBLIC_COMMIT_SHA || undefined;
const ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV || 'development';

function initBrowserSentry() {
  if (!SENTRY_ENABLED || typeof window === 'undefined') return null;
  if (sentryInitPromise) return sentryInitPromise;
  sentryInitPromise = import('@sentry/browser')
    .then(mod => {
      sentryModule = mod;
      if (typeof mod.init === 'function') {
        mod.init({
          dsn: SENTRY_DSN,
          environment: ENVIRONMENT,
          tracesSampleRate: SAMPLE_RATE,
          replaysSessionSampleRate: 0,
          replaysOnErrorSampleRate: 0,
          release: RELEASE,
          enabled: true,
        });
      }
      return mod;
    })
    .catch(err => {
      console.warn('[monitoring] Failed to init Sentry', err);
      return null;
    });
  return sentryInitPromise;
}

export function captureError(error, context) {
  if (!SENTRY_ENABLED) return;
  const promise = initBrowserSentry();
  if (promise && typeof promise.then === 'function') {
    promise.then(mod => {
      if (!mod) return;
      try {
        mod.captureException(error, context);
      } catch (err) {
        console.warn('[monitoring] captureException failed', err);
      }
    });
  }
}

export function captureMessage(message, context) {
  if (!SENTRY_ENABLED) return;
  const promise = initBrowserSentry();
  if (promise && typeof promise.then === 'function') {
    promise.then(mod => {
      if (!mod) return;
      try {
        mod.captureMessage(message, context);
      } catch (err) {
        console.warn('[monitoring] captureMessage failed', err);
      }
    });
  }
}

export function ensureMonitoring() {
  if (!SENTRY_ENABLED) return;
  initBrowserSentry();
}

// Kick off initialization on import if in browser
if (typeof window !== 'undefined') {
  ensureMonitoring();
}

export const monitoringEnabled = SENTRY_ENABLED;
