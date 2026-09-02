'use client';

import { Post } from '@/types';
import { PostCard } from '@/components/pages/posts/PostCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { useSearch } from '@/hooks/useSearch';
import { StaggerContainerView, FadeInView } from '@/components/visuals/motion';

interface PostListProps {
  posts: Post[];
}

// Only surface the search box once there's enough to sift through.
const SEARCH_THRESHOLD = 3;

// A post's searchable text: title, tags, and description.
function postSearchText(post: Post): string {
  return `${post.title} ${post.tags.join(' ')} ${post.description}`;
}

export function PostList({ posts }: PostListProps) {
  const { query, setQuery, results } = useSearch(posts, postSearchText);

  if (posts.length === 0) {
    return (
      <FadeInView className="card text-center mb-12">
        <p className="text-muted">No posts yet. Check back soon!</p>
      </FadeInView>
    );
  }

  const showSearch = posts.length > SEARCH_THRESHOLD;
  const searching = query.trim().length > 0;

  return (
    <>
      {showSearch && (
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search posts by name or tag..."
          label="Search posts"
        />
      )}

      {searching && results.length === 0 ? (
        <div className="card text-center mb-12">
          <p className="text-muted">No posts match &ldquo;{query}&rdquo;.</p>
        </div>
      ) : (
        <StaggerContainerView className="space-y-6 mb-12">
          {results.map((post) => (
            <PostCard key={post.slug} post={post} onTagClick={setQuery} />
          ))}
        </StaggerContainerView>
      )}
    </>
  );
}
