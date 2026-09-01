import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { siteConfig } from '@/lib/site-config';
import { rateLimit, clientKey } from '@/lib/rate-limit';

// Input schema. Subject is optional (the form's select can be empty); message
// has a sane lower bound to deter bot spam.
const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email().max(200),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(10).max(10_000),
  // Honeypot. Hidden from users, so any value means a bot filled the form.
  website: z.string().optional(),
  // Milliseconds the form was on screen before submitting, measured on the
  // client so clock skew between browser and server can't cause false
  // positives. Absent (a direct API post) is treated as zero.
  elapsedMs: z.number().nonnegative().optional(),
});

// A human cannot read the page, type a name, an email and a ten-character
// message in under three seconds.
const MIN_FILL_MS = 3_000;

// Counted before validation, so malformed and bot-flagged requests use up
// budget too — that is deliberate, it stops the endpoint being hammered. The
// allowance is loose enough that a person who mistypes a couple of times and
// retries won't be locked out.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Contact route called without RESEND_API_KEY set');
    return NextResponse.json(
      { error: 'Contact form is not configured.' },
      { status: 503 }
    );
  }

  const { allowed, retryAfter } = rateLimit(clientKey(request), RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  // JSON has no `undefined` literal, so it is a safe sentinel for a parse
  // failure — no valid request body can produce it.
  const body = await request.json().catch(() => undefined);
  if (body === undefined) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid form data', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { name, email, subject, message, website, elapsedMs } = parsed.data;

  // Bot checks. Both return a success shape on purpose: telling a bot which
  // signal caught it just helps it adapt. Nothing is sent.
  if (website) {
    console.warn('Contact form honeypot triggered');
    return NextResponse.json({ ok: true });
  }
  if ((elapsedMs ?? 0) < MIN_FILL_MS) {
    console.warn('Contact form submitted too fast:', elapsedMs ?? 0, 'ms');
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      // `from` must be a verified domain on Resend; until you set up one,
      // Resend's onboarding sender works for development.
      from: process.env.CONTACT_FROM ?? 'onboarding@resend.dev',
      to: [siteConfig.email],
      replyTo: email,
      subject: `[Portfolio] ${subject || 'New message'} — from ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subject || '(none)'}\n\n${message}`,
    });

    if (result.error) {
      console.error('Resend returned error:', result.error);
      return NextResponse.json(
        { error: 'Failed to send. Please email directly.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact route failed:', error);
    return NextResponse.json(
      { error: 'Failed to send. Please email directly.' },
      { status: 502 }
    );
  }
}
