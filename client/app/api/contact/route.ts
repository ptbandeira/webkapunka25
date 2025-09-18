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

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(200, 'Name is too long.'),
  email: z.string().trim().min(1, 'Please enter your email.').email('Please enter a valid email.'),
  message: z.string().trim().min(10, 'Please enter a message with a bit more detail.').max(4000, 'Message is too long.'),
  consent: z.boolean().refine(val => val === true, { message: 'Please accept the privacy policy.' }),
  startedAt: z.number().int().nonnegative(),
  honeypot: z.string().optional(),
  captchaToken: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = enforceRateLimit({ key: 'contact', ip });
  if (!rateLimit.ok) {
    return buildErrorResponse(429, 'Too many submissions. Please try again in a few minutes.');
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch (err) {
    return buildErrorResponse(400, 'Invalid request payload.');
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return buildErrorResponse(400, 'Please fix the highlighted fields.', extractFieldErrors(parsed.error.issues));
  }

  const { honeypot, startedAt, captchaToken, ...form } = parsed.data;

  if (honeypot && honeypot.trim().length > 0) {
    return buildErrorResponse(400, 'Suspicious submission detected.');
  }

  const timing = checkTiming(startedAt);
  if (!timing.ok) {
    return buildErrorResponse(400, timing.message);
  }

  const captcha = await verifyCaptcha(captchaToken, ip);
  if (!captcha.ok) {
    return buildErrorResponse(403, captcha.message ?? 'Captcha verification failed.');
  }

  console.info('[contact] submission received', { ...form, ip });

  return buildSuccessResponse();
}
