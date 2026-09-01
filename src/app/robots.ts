import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-config';

// Everything is public and worth indexing except the API routes, which return
// JSON and have no business in search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
