import Link from 'next/link';
import type { Post } from '@/types';
import { formatDateLong } from '@/lib/format';
import { ArticleLayout } from '@/components/ui/ArticleLayout';
import { BackLink } from '@/components/ui/BackLink';
import { TagList } from '@/components/ui/TagList';
import { FeaturedImage } from '@/components/ui/FeaturedImage';
import { MDXContent } from '@/components/mdx/MDXContent';

// The full post detail page: title/description/date/tags, an optional cover,
// the MDX body, and the closing "thanks for reading" footer — inside the
// shared frame.
export function PostDetail({ post }: { post: Post }) {
  return (
    <ArticleLayout>
      <BackLink href="/posts" label="Back to posts" />

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-lg mb-4 text-muted">{post.description}</p>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-muted">{formatDateLong(post.date)}</span>
          <TagList tags={post.tags} />
        </div>
      </header>

      {post.image && (
        <FeaturedImage image={post.image} alt={post.title} className="mb-8" />
      )}

      <MDXContent code={post.code} />

      <footer className="mt-12 pt-8 border-t border-border">
        <p className="text-muted">
          Thanks for reading! If you have questions or want to discuss this topic,{' '}
          <Link href="/contact" className="text-accent">
            get in touch
          </Link>
          .
        </p>
      </footer>
    </ArticleLayout>
  );
}
