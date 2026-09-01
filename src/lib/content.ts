import { posts as allPosts, projects as allProjects, gallery as allGallery } from '#site/content';
import type { Post, Project, GalleryImage } from '@/types';

function byDateDesc<T extends { date: string }>(a: T, b: T): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

// Projects
export function getProjectSlugs(): string[] {
  return allProjects.map((p) => p.slug);
}

export function getProjectBySlug(slug: string): Project | null {
  return allProjects.find((p) => p.slug === slug) ?? null;
}

export function getAllProjects(): Project[] {
  return [...allProjects].sort(byDateDesc);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

// Posts
export function getPostSlugs(): string[] {
  return allPosts.filter((p) => p.published).map((p) => p.slug);
}

export function getPostBySlug(slug: string): Post | null {
  const post = allPosts.find((p) => p.slug === slug);
  if (!post || !post.published) return null;
  return post;
}

export function getAllPosts(): Post[] {
  return allPosts.filter((p) => p.published).sort(byDateDesc);
}

export function getRecentPosts(count: number = 3): Post[] {
  return getAllPosts().slice(0, count);
}

export interface GalleryData {
  images: GalleryImage[];
  categories: string[];
  tags: string[];
}

// Newest first.
function byGalleryDate(a: GalleryImage, b: GalleryImage): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

/**
 * Everything the gallery page needs, from the Velite `gallery` collection (one
 * folder per photo). Sorted newest first, collecting the distinct categories and
 * tags that drive the filter controls along the way.
 */
export function getGalleryData(): GalleryData {
  const images: GalleryImage[] = [...allGallery].sort(byGalleryDate);

  const categories = new Set<string>();
  const tags = new Set<string>();
  for (const image of images) {
    categories.add(image.category);
    image.tags.forEach((tag) => tags.add(tag));
  }

  return {
    images,
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
  };
}

