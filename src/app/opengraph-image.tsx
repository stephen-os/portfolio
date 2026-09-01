import { siteConfig } from '@/lib/site-config';
import { renderOgImage, ogSize, ogContentType } from '@/lib/og';

// Inherited by every route that doesn't define its own opengraph-image — but
// only where the page's metadata does not set an `openGraph` object without
// `images`, which suppresses it.

export const alt = `${siteConfig.title} — ${siteConfig.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    eyebrow: 'stephen@portfolio:~$',
    title: siteConfig.title,
    subtitle: siteConfig.tagline,
    footer: 'Computer graphics · Full-stack · Low-level systems',
  });
}
