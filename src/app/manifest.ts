import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

// Web app manifest. Mainly affects how the site looks when saved to a phone
// home screen, and gives Android/Chrome a colour for the browser chrome.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.title} — ${siteConfig.tagline}`,
    short_name: siteConfig.title,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0d0d',
    theme_color: '#0d0d0d',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}
