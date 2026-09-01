// Minimal fixed-window rate limiter.
//
// State lives in this module's memory, which means it is per-instance: a
// serverless deployment that scales to N instances effectively allows N times
// the limit, and every cold start resets the counters. That is an acceptable
// speed bump for a personal contact form — it stops a single client hammering
// the endpoint. If this ever needs to be authoritative, back it with Redis
// (Upstash) instead.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Drop expired buckets so the map cannot grow without bound on a long-lived
// instance. Cheap: only runs on a request that is already doing IO.
function prune(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets. Suitable for a Retry-After header. */
  retryAfter: number;
}

/**
 * Records a hit against `key` and reports whether it is allowed.
 *
 * 1. Prune expired windows.
 * 2. Start a new window if this key has none, or its window has passed.
 * 3. Otherwise increment and compare against the limit.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;
  const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
  return { allowed: bucket.count <= limit, retryAfter };
}

/**
 * Best-effort client identifier from proxy headers.
 *
 * `x-forwarded-for` is a comma-separated chain; the first entry is the
 * original client. Falls back to a shared bucket when no header is present,
 * which is the safe direction — unattributable traffic shares one limit.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
