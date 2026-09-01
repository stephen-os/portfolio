import { getFeaturedProjects, getRecentPosts } from '@/lib/content';
import { loadWaveConfig } from '@/lib/wave-config';
import { HomePage } from '@/components/pages/home/HomePage';

const MAX_FEATURED = 3;
const MAX_POSTS = 4;

export default function Home() {
  // Slim projections — only what the home cards render, so the client bundle
  // doesn't carry each project's compiled MDX.
  const featuredProjects = getFeaturedProjects()
    .slice(0, MAX_FEATURED)
    .map((project) => ({
      title: project.title,
      slug: project.slug,
      tags: project.tags,
    }));

  const recentPosts = getRecentPosts(MAX_POSTS).map((post) => ({
    title: post.title,
    slug: post.slug,
    date: post.date,
  }));

  return (
    <HomePage
      featuredProjects={featuredProjects}
      recentPosts={recentPosts}
      waveConfig={loadWaveConfig()}
    />
  );
}
