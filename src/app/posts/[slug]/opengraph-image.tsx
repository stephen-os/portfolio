import { getPostBySlug, getPostSlugs } from '@/lib/content';
import { siteConfig } from '@/lib/site-config';
import { renderOgImage, ogSize, ogContentType } from '@/lib/og';
import { formatDateLong } from '@/lib/format';

// Per-post card showing the title, so a shared link says what it links to.
// A post with a frontmatter `image` overrides this via generateMetadata.

export const alt = 'Post';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function PostOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  return renderOgImage({
    eyebrow: 'stephen@portfolio:~/posts$',
    title: post?.title ?? 'Post',
    subtitle: post?.description,
    footer: post ? `${formatDateLong(post.date)} · ${siteConfig.title}` : siteConfig.title,
  });
}
