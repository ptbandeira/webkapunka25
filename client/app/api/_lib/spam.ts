import { NextRequest } from 'next/server';

const DEFAULT_WINDOW_MS = 1000 * 60 * 5; // 5 minutes
const DEFAULT_MAX_REQUESTS = 5;
const MIN_SUBMIT_TIME_MS = 800;
const MAX_SUBMIT_TIME_MS = 1000 * 60 * 30; // 30 minutes

type RateBucket = {
  count: number;
  expires: number;
};

const rateMap = new Map<string, RateBucket>();

function bucketKey(key: string, ip: string) {
  return `${key}:${ip}`;
}

export function getClientIp(req: NextRequest): string | null {
  const header = req.headers.get('x-forwarded-for');
  if (header) {
    const [first] = header.split(',');
    if (first) return first.trim();
  }
  // @ts-expect-error — NextRequest exposes ip in edge/runtime >= 13.2
  if (typeof req.ip === 'string' && req.ip) {
    return req.ip;
  }
  return null;
}

export function enforceRateLimit(options: {
  key: string;
  ip: string | null;
  max?: number;
  windowMs?: number;
}) {
  const { key, ip, max = DEFAULT_MAX_REQUESTS, windowMs = DEFAULT_WINDOW_MS } = options;
  if (!ip) {
    return { ok: true };
  }
  const mapKey = bucketKey(key, ip);
  const now = Date.now();
  const bucket = rateMap.get(mapKey);
  if (bucket && bucket.expires > now) {
    bucket.count += 1;
    if (bucket.count > max) {
      return { ok: false, retryAfter: Math.ceil((bucket.expires - now) / 1000) };
    }
    rateMap.set(mapKey, bucket);
    return { ok: true };
  }
  rateMap.set(mapKey, { count: 1, expires: now + windowMs });
  return { ok: true };
}

export function checkTiming(startedAt: unknown) {
  const now = Date.now();
  if (typeof startedAt !== 'number' || Number.isNaN(startedAt)) {
    return { ok: false, message: 'Missing submission metadata.' };
  }
  if (startedAt > now) {
    return { ok: false, message: 'Invalid submission timestamp.' };
  }
  const elapsed = now - startedAt;
  if (elapsed < MIN_SUBMIT_TIME_MS) {
    return { ok: false, message: 'Form submitted too quickly.' };
  }
  if (elapsed > MAX_SUBMIT_TIME_MS) {
    return { ok: false, message: 'Form session expired. Please try again.' };
  }
  return { ok: true };
}

export async function verifyCaptcha(token: string | undefined | null, ip?: string | null) {
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

  if (!turnstileSecret && !recaptchaSecret) {
    return { ok: true };
  }

  if (!token) {
    return { ok: false, message: 'Captcha validation required.' };
  }

  try {
    if (turnstileSecret) {
      const body = new URLSearchParams();
      body.append('secret', turnstileSecret);
      body.append('response', token);
      if (ip) body.append('remoteip', ip);

      const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
      if (!data?.success) {
        return { ok: false, message: 'Captcha verification failed.' };
      }
      return { ok: true };
    }

    if (recaptchaSecret) {
      const body = new URLSearchParams();
      body.append('secret', recaptchaSecret);
      body.append('response', token);
      if (ip) body.append('remoteip', ip);

      const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = (await res.json()) as { success?: boolean };
      if (!data?.success) {
        return { ok: false, message: 'Captcha verification failed.' };
      }
      return { ok: true };
    }
  } catch (err) {
    console.warn('[captcha] verify failed', err);
    return { ok: false, message: 'Captcha verification unavailable.' };
  }

  return { ok: true };
}

export function buildErrorResponse(status: number, message: string, errors: Record<string, string> = {}) {
  return Response.json({ ok: false, message, errors }, { status });
}

export function buildSuccessResponse(data: Record<string, unknown> = {}) {
  return Response.json({ ok: true, ...data }, { status: 200 });
}

export function extractFieldErrors(issues: { path: (string | number)[]; message: string }[]) {
  const out: Record<string, string> = {};
  issues.forEach(issue => {
    const path = issue.path[0];
    if (typeof path === 'string' && !out[path]) {
      out[path] = issue.message;
    }
  });
  return out;
}
