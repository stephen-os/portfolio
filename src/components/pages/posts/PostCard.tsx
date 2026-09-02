'use client';

import Link from 'next/link';
import { Post } from '@/types';
import { formatDateShort } from '@/lib/format';
import { StaggerHoverCard } from '@/components/visuals/motion';
import { TagList } from '@/components/ui/TagList';
import { FeaturedImage } from '@/components/ui/FeaturedImage';

export function PostCard({
  post,
  onTagClick,
}: {
  post: Post;
  onTagClick?: (tag: string) => void;
}) {
  return (
    <StaggerHoverCard className="card">
      {post.image && (
        <FeaturedImage image={post.image} alt={post.title} priority={false} className="mb-4" />
      )}
      <div className="flex items-center gap-3 mb-3 text-sm">
        <span className="text-muted">{formatDateShort(post.date)}</span>
        <span className="text-border">|</span>
        <TagList tags={post.tags} variant="accent" onTagClick={onTagClick} />
      </div>

      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-xl font-semibold mb-2 hover:opacity-80 transition-opacity">
          {post.title}
        </h2>
      </Link>

      <p className="text-muted">{post.description}</p>

      <Link
        href={`/posts/${post.slug}`}
        className="inline-block mt-4 text-sm text-accent"
      >
        Read more &rarr;
      </Link>
    </StaggerHoverCard>
  );
}
