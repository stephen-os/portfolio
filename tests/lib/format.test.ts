import { describe, it, expect, afterEach, vi } from 'vitest';
import { formatDateLong, formatDateShort, timeAgo } from '@/lib/format';

describe('formatDateLong / formatDateShort', () => {
  it('renders the calendar date from the frontmatter, not a shifted one', () => {
    // Regression guard. Velite stores `2023-12-01` as UTC midnight. Formatted
    // in a negative-offset zone without pinning the timezone this rendered
    // "November 30, 2023" — every date on the site was a day early for
    // visitors in the Americas.
    expect(formatDateLong('2023-12-01T00:00:00.000Z')).toBe('December 1, 2023');
    expect(formatDateShort('2023-12-01T00:00:00.000Z')).toBe('Dec 1, 2023');
  });

  it('accepts a bare date string as well as a full ISO timestamp', () => {
    expect(formatDateLong('2024-05-04')).toBe('May 4, 2024');
    expect(formatDateShort('2024-05-04')).toBe('May 4, 2024');
  });

  it('formats the UTC calendar day, not the runtime-local one', () => {
    // Machine-independent: derive both interpretations from the runtime and
    // assert the formatter follows UTC. On a machine at a non-zero offset the
    // two differ, and this is what catches a regression; on a UTC machine it
    // still holds, just without the contrast.
    const iso = '2024-01-10T00:00:00.000Z';
    const date = new Date(iso);

    expect(formatDateLong(iso)).toBe(`January ${date.getUTCDate()}, 2024`);

    if (date.getDate() !== date.getUTCDate()) {
      expect(formatDateLong(iso)).not.toContain(`January ${date.getDate()},`);
    }
  });
});

describe('timeAgo', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // Freezes the clock so relative output is deterministic.
  function at(now: string) {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(now));
  }

  it('reports seconds under a minute', () => {
    at('2026-07-20T12:00:30Z');
    expect(timeAgo('2026-07-20T12:00:00Z')).toBe('30s ago');
  });

  it('reports minutes under an hour', () => {
    at('2026-07-20T12:45:00Z');
    expect(timeAgo('2026-07-20T12:00:00Z')).toBe('45m ago');
  });

  it('reports hours under a day', () => {
    at('2026-07-20T17:00:00Z');
    expect(timeAgo('2026-07-20T12:00:00Z')).toBe('5h ago');
  });

  it('reports days under a week', () => {
    at('2026-07-23T12:00:00Z');
    expect(timeAgo('2026-07-20T12:00:00Z')).toBe('3d ago');
  });

  it('reports weeks beyond that', () => {
    at('2026-08-10T12:00:00Z');
    expect(timeAgo('2026-07-20T12:00:00Z')).toBe('3w ago');
  });

  it('switches unit exactly on each boundary', () => {
    at('2026-07-20T12:01:00Z');
    expect(timeAgo('2026-07-20T12:00:00Z')).toBe('1m ago');

    at('2026-07-20T13:00:00Z');
    expect(timeAgo('2026-07-20T12:00:00Z')).toBe('1h ago');

    at('2026-07-21T12:00:00Z');
    expect(timeAgo('2026-07-20T12:00:00Z')).toBe('1d ago');

    at('2026-07-27T12:00:00Z');
    expect(timeAgo('2026-07-20T12:00:00Z')).toBe('1w ago');
  });
});
