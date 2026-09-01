import type { MetadataRoute } from 'next';
import { getAllPosts, getAllProjects } from '@/lib/content';
import { siteUrl } from '@/lib/site-config';

// Static routes, with a rough priority ordering. Anything added under
// src/app/ that should be indexed needs adding here too — Next does not
// discover routes for the sitemap automatically.
const staticRoutes = [
  { path: '', priority: 1 },
  { path: '/projects', priority: 0.9 },
  { path: '/posts', priority: 0.8 },
  { path: '/gallery', priority: 0.7 },
  { path: '/about', priority: 0.7 },
  { path: '/contact', priority: 0.5 },
];

/**
 * Sitemap covering every indexable route.
 *
 * 1. Static pages, dated to the most recent content change so crawlers see
 *    the listings move when something is published.
 * 2. One entry per published post and per project, dated from its frontmatter.
 *
 * Unpublished posts are excluded — `getAllPosts()` already filters them, and
 * their URLs 404 anyway thanks to `dynamicParams = false`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const projects = getAllProjects();

  const contentDates = [...posts, ...projects].map((item) => new Date(item.date).getTime());
  const lastContentUpdate = contentDates.length ? new Date(Math.max(...contentDates)) : new Date();

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${siteUrl}${path}`,
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: new Date(project.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
