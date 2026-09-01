import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/content';
import { PostList } from '@/components/pages/posts/PostList';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageLayout } from '@/components/ui/PageLayout';
import { FadeInView } from '@/components/visuals/motion';

const description =
  'Writing by Stephen Watson on graphics programming, web development and software engineering.';

export const metadata: Metadata = {
  title: 'Posts',
  description,
  alternates: { canonical: '/posts' },
};

export default function Posts() {
  const posts = getAllPosts();

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader
        title="Posts"
        subtitle={
          <>
            Thoughts on <span className="text-accent">graphics programming</span>,{' '}
            <span className="text-accent">web development</span>, and{' '}
            <span className="text-accent">software engineering</span>
          </>
        }
      />

      {/* Posts List */}
      <PostList posts={posts} />

      {/* Footer */}
      <FadeInView delay={0.3} className="card text-center">
        <p className="text-muted">
          More posts coming soon. In the meantime, check out my{' '}
          <Link href="/projects" className="text-accent">
            projects
          </Link>
          .
        </p>
      </FadeInView>
    </PageLayout>
  );
}
