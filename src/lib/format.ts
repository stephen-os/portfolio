// Centralized date/text formatting so toLocaleDateString options don't
// drift between callers.
//
// Both formatters pin the timezone to UTC. Content dates are calendar dates,
// not instants: Velite's `s.isodate()` stores `2023-12-01` as UTC midnight,
// and formatting that in the viewer's local zone renders the previous day for
// anyone at a negative UTC offset — "December 1" became "November 30" for
// every visitor in the Americas. Pinning to UTC makes the rendered date match
// the frontmatter everywhere in the world.

// e.g. "March 5, 2026" — used in detail page headers and metadata panels.
export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// e.g. "Mar 5, 2026" — used in compact list views (cards, home dashboard).
export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// e.g. "3d ago" — relative time for very recent events (used by the home
// commits feed).
export function timeAgo(iso: string): string {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86_400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604_800) return `${Math.floor(diffSec / 86_400)}d ago`;
  return `${Math.floor(diffSec / 604_800)}w ago`;
}
