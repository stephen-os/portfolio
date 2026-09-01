import type { Metadata } from 'next';
import type { ImageInput, Post, Project } from '@/types';
import { siteConfig } from './site-config';

interface ArticleMetadataInput {
  title: string;
  description: string;
  date: string;
  tags: string[];
  // Canonical path, e.g. `/projects/my-slug`.
  path: string;
  // Frontmatter cover, if any.
  image?: ImageInput;
  // The route's generated OG card, used when there's no cover. Referencing it
  // explicitly is required because declaring `openGraph` otherwise suppresses
  // Next's file-based opengraph-image.
  ogImageFallback: string;
}

// Shared OpenGraph / Twitter builder for a content detail page. Private — call
// projectMetadata / postMetadata below, which mirror ProjectDetail / PostDetail.
function articleMetadata({
  title,
  description,
  date,
  tags,
  path,
  image,
  ogImageFallback,
}: ArticleMetadataInput): Metadata {
  const ogImage = image && typeof image === 'object' ? image.src : image;
  const images = [ogImage ?? ogImageFallback];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: 'article',
      url: path,
      publishedTime: date,
      authors: [siteConfig.author],
      tags,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export function projectMetadata(project: Project): Metadata {
  return articleMetadata({
    title: project.title,
    description: project.description,
    date: project.date,
    tags: project.tags,
    path: `/projects/${project.slug}`,
    image: project.image,
    ogImageFallback: `/projects/${project.slug}/opengraph-image`,
  });
}

export function postMetadata(post: Post): Metadata {
  return articleMetadata({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    path: `/posts/${post.slug}`,
    image: post.image,
    ogImageFallback: `/posts/${post.slug}/opengraph-image`,
  });
}
