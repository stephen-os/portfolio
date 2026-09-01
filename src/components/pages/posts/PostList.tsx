'use client';

import { Post } from '@/types';
import { PostCard } from '@/components/pages/posts/PostCard';
import { StaggerContainerView, FadeInView } from '@/components/visuals/motion';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <FadeInView className="card text-center mb-12">
        <p className="text-muted">
          No posts yet. Check back soon!
        </p>
      </FadeInView>
    );
  }

  return (
    <StaggerContainerView className="space-y-6 mb-12">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </StaggerContainerView>
  );
}
