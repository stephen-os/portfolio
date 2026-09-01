import { describe, it, expect, afterEach, vi } from 'vitest';
import { rateLimit, clientKey } from '@/lib/rate-limit';

// The limiter keeps module-level state, so every test uses a unique key rather
// than trying to reset it between runs.
let counter = 0;
const uniqueKey = () => `key-${counter++}`;

describe('rateLimit', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests up to the limit', () => {
    const key = uniqueKey();
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, 3, 60_000).allowed).toBe(true);
    }
  });

  it('blocks the request after the limit', () => {
    const key = uniqueKey();
    for (let i = 0; i < 3; i++) rateLimit(key, 3, 60_000);
    expect(rateLimit(key, 3, 60_000).allowed).toBe(false);
  });

  it('reports seconds remaining in the window when blocked', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-20T12:00:00Z'));

    const key = uniqueKey();
    rateLimit(key, 1, 60_000);

    vi.setSystemTime(new Date('2026-07-20T12:00:20Z'));
    const result = rateLimit(key, 1, 60_000);

    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBe(40);
  });

  it('allows again once the window has passed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-20T12:00:00Z'));

    const key = uniqueKey();
    expect(rateLimit(key, 1, 60_000).allowed).toBe(true);
    expect(rateLimit(key, 1, 60_000).allowed).toBe(false);

    vi.setSystemTime(new Date('2026-07-20T12:01:01Z'));
    expect(rateLimit(key, 1, 60_000).allowed).toBe(true);
  });

  it('tracks each key independently', () => {
    const a = uniqueKey();
    const b = uniqueKey();

    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).allowed).toBe(false);
    expect(rateLimit(b, 1, 60_000).allowed).toBe(true);
  });

  it('counts a blocked request against the window rather than resetting it', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-20T12:00:00Z'));

    const key = uniqueKey();
    rateLimit(key, 1, 60_000);
    rateLimit(key, 1, 60_000); // blocked

    // Still inside the original window, not a fresh one started by the block.
    vi.setSystemTime(new Date('2026-07-20T12:00:59Z'));
    expect(rateLimit(key, 1, 60_000).allowed).toBe(false);
  });
});

describe('clientKey', () => {
  const req = (headers: Record<string, string>) =>
    new Request('https://example.com', { headers });

  it('uses the first entry of x-forwarded-for', () => {
    expect(clientKey(req({ 'x-forwarded-for': '203.0.113.5, 70.41.3.18' }))).toBe('203.0.113.5');
  });

  it('trims whitespace around the client address', () => {
    expect(clientKey(req({ 'x-forwarded-for': '  203.0.113.5 , 70.41.3.18' }))).toBe('203.0.113.5');
  });

  it('falls back to x-real-ip', () => {
    expect(clientKey(req({ 'x-real-ip': '198.51.100.7' }))).toBe('198.51.100.7');
  });

  it('prefers x-forwarded-for over x-real-ip', () => {
    expect(
      clientKey(req({ 'x-forwarded-for': '203.0.113.5', 'x-real-ip': '198.51.100.7' }))
    ).toBe('203.0.113.5');
  });

  it('falls back to a single shared bucket when unattributable', () => {
    // Safe direction: unidentifiable traffic shares one limit rather than
    // each request getting a fresh allowance.
    expect(clientKey(req({}))).toBe('unknown');
  });
});
