import { describe, it, expect } from 'vitest';
import { metadata } from '@/app/layout';

// Regression guard for the Open Graph inheritance trap: a child page inherits
// the root `openGraph` block wholesale unless it declares its own. So the root
// must NOT set page-specific `title` / `description` / `url` here — doing so
// stamps the home page's share card onto every static page (/about, /contact,
// …). The [slug] pages override the root via lib/metadata.ts; the static pages
// rely on Next deriving og:title / og:description from their own fields, which
// only happens while the root leaves them unset.
describe('root layout metadata', () => {
  it('root openGraph omits page-specific title/description/url', () => {
    const og = metadata.openGraph as Record<string, unknown> | undefined;
    expect(og).toBeDefined();
    expect(og).not.toHaveProperty('title');
    expect(og).not.toHaveProperty('description');
    expect(og).not.toHaveProperty('url');
  });
});
