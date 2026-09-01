// Single source of truth for site-level identifiers and external links.
// Avoids the same handle/url being copy-pasted (and drifting) across the
// codebase.

export const siteConfig = {
  author: 'Stephen Watson',
  email: 'ImStephenTylerWatson@gmail.com',
  // GitHub username — used both as the API target (commits, languages) and
  // as the human-facing profile link.
  githubUser: 'stephen-os',
  linkedinUrl: 'https://www.linkedin.com/in/stephen-os/',

  title: 'Stephen Watson',
  tagline: 'Software Developer',
  description:
    'Portfolio of Stephen Watson — software developer working in computer graphics, full-stack web, and low-level systems.',
} as const;

export const githubProfileUrl = `https://github.com/${siteConfig.githubUser}`;

/**
 * Absolute origin of the deployed site, with no trailing slash.
 *
 * Everything that must emit absolute URLs — `metadataBase`, the sitemap,
 * robots.txt, Open Graph image URLs — reads this single value so they can
 * never disagree.
 *
 * Falls back to localhost for local development. **Set NEXT_PUBLIC_SITE_URL in
 * the deployment environment**, or the sitemap and every link preview will
 * point at localhost.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/$/, '');
