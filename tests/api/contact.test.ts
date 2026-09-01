import { describe, it, expect, beforeEach, vi } from 'vitest';

// Resend is mocked so nothing leaves the machine and no key is needed.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

// The route calls `new Resend(...)`, so the mock must be constructable. A
// `function` has [[Construct]]; an arrow function does not — Vitest 4 rejects
// the latter with "is not a constructor".
vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return { emails: { send: sendMock } };
  }),
}));

process.env.RESEND_API_KEY = 're_test_key';

const { POST } = await import('@/app/api/contact/route');

// The rate limiter keys off the client address and holds module-level state,
// so each test uses a distinct IP to stay isolated.
let ipCounter = 0;
const nextIp = () => `203.0.113.${ipCounter++}`;

function post(body: unknown, ip = nextIp()): Promise<Response> {
  return POST(
    new Request('https://example.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  );
}

const validSubmission = {
  name: 'Test Person',
  email: 'test@example.com',
  subject: 'General Inquiry',
  message: 'This message is comfortably longer than the minimum.',
  elapsedMs: 9_000,
};

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: 'sent' }, error: null });
});

describe('POST /api/contact — validation', () => {
  it('rejects a body that is not JSON', async () => {
    const res = await post('this is not json');
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rejects missing required fields', async () => {
    const res = await post({ name: 'Only a name' });
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rejects a malformed email', async () => {
    const res = await post({ ...validSubmission, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('rejects a message below the minimum length', async () => {
    const res = await post({ ...validSubmission, message: 'too short' });
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe('POST /api/contact — bot checks', () => {
  it('discards a submission with the honeypot filled', async () => {
    const res = await post({ ...validSubmission, website: 'http://spam.example' });

    // Reports success on purpose: telling a bot which signal caught it only
    // helps it adapt.
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('discards a submission filled in faster than a human could', async () => {
    const res = await post({ ...validSubmission, elapsedMs: 100 });
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('discards a direct API post carrying no timing at all', async () => {
    const { elapsedMs, ...noTiming } = validSubmission;
    void elapsedMs;
    const res = await post(noTiming);
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('accepts a submission that clears every check', async () => {
    const res = await post(validSubmission);
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();

    const payload = sendMock.mock.calls[0][0];
    expect(payload.replyTo).toBe('test@example.com');
    expect(payload.subject).toContain('General Inquiry');
    expect(payload.text).toContain('comfortably longer');
  });
});

describe('POST /api/contact — failure handling', () => {
  it('returns 502 when Resend reports an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'rejected' } });
    const res = await post(validSubmission);
    expect(res.status).toBe(502);
  });

  it('returns 502 when the send throws', async () => {
    sendMock.mockRejectedValue(new Error('network down'));
    const res = await post(validSubmission);
    expect(res.status).toBe(502);
  });
});

describe('POST /api/contact — rate limiting', () => {
  it('blocks once a single client exceeds the window allowance', async () => {
    const ip = nextIp();
    const statuses: number[] = [];

    for (let i = 0; i < 6; i++) {
      statuses.push((await post(validSubmission, ip)).status);
    }

    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200]);
    expect(statuses[5]).toBe(429);
  });

  it('sets Retry-After when it blocks', async () => {
    const ip = nextIp();
    for (let i = 0; i < 5; i++) await post(validSubmission, ip);

    const res = await post(validSubmission, ip);
    expect(res.status).toBe(429);
    expect(Number(res.headers.get('Retry-After'))).toBeGreaterThan(0);
  });

  it('does not let one client consume another client\'s allowance', async () => {
    const noisy = nextIp();
    for (let i = 0; i < 6; i++) await post(validSubmission, noisy);

    const other = await post(validSubmission, nextIp());
    expect(other.status).toBe(200);
  });
});
