import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  buildErrorResponse,
  buildSuccessResponse,
  checkTiming,
  enforceRateLimit,
  extractFieldErrors,
  getClientIp,
  verifyCaptcha,
} from '../_lib/spam';

const clinicsSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(200, 'Name is too long.'),
  clinic: z.string().trim().min(2, 'Please enter your clinic or organisation.').max(200, 'Clinic name is too long.'),
  email: z.string().trim().min(1, 'Please enter your email.').email('Please enter a valid email.'),
  phone: z.string().trim().min(6, 'Please enter a phone number.').max(50, 'Phone number is too long.'),
  message: z.string().trim().min(10, 'Please include some details in your message.').max(4000, 'Message is too long.'),
  consent: z.boolean().refine(val => val === true, { message: 'Please confirm consent.' }),
  startedAt: z.number().int().nonnegative(),
  honeypot: z.string().optional(),
  captchaToken: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const requestId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  const ip = getClientIp(request);
  const log = (level: 'info' | 'warn' | 'error', message: string, extra?: unknown) => {
    const label = `[clinics][${requestId}] ${new Date().toISOString()} ${message}`;
    if (extra === undefined) console[level](label);
    else console[level](label, extra);
  };

  try {
    const rateLimit = enforceRateLimit({ key: 'clinics', ip });
    if (!rateLimit.ok) {
      log('warn', 'rate-limit');
      return buildErrorResponse(429, 'Too many submissions. Please try again in a few minutes.');
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch (err) {
      log('warn', 'invalid-json', (err as Error)?.message || err);
      return buildErrorResponse(400, 'Invalid request payload.');
    }

    const parsed = clinicsSchema.safeParse(payload);
    if (!parsed.success) {
      log('warn', 'validation-error', parsed.error.issues);
      return buildErrorResponse(400, 'Please fix the highlighted fields.', extractFieldErrors(parsed.error.issues));
    }

    const { honeypot, startedAt, captchaToken, ...form } = parsed.data;

    if (honeypot && honeypot.trim().length > 0) {
      log('warn', 'honeypot-triggered');
      return buildErrorResponse(400, 'Suspicious submission detected.');
    }

    const timing = checkTiming(startedAt);
    if (!timing.ok) {
      log('warn', 'timing-check-failed', timing.message);
      return buildErrorResponse(400, timing.message);
    }

    const captcha = await verifyCaptcha(captchaToken, ip);
    if (!captcha.ok) {
      log('warn', 'captcha-failed', captcha.message);
      return buildErrorResponse(403, captcha.message ?? 'Captcha verification failed.');
    }

    log('info', 'submission-received', { ...form, ip: ip || 'unknown' });
    return buildSuccessResponse();
  } catch (err: any) {
    log('error', 'unhandled-error', err?.message || err);
    return buildErrorResponse(500, 'Something went wrong. Please try again later.');
  }
}
