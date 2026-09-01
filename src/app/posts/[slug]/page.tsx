import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs } from '@/lib/content';
import { postMetadata } from '@/lib/metadata';
import { PostDetail } from '@/components/pages/posts/PostDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Only slugs returned by generateStaticParams render — anything else 404s
// instead of dynamically rendering an unknown slug.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  return postMetadata(post);
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <PostDetail post={post} />;
}
