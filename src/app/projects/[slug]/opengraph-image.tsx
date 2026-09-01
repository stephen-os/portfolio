import { getProjectBySlug, getProjectSlugs } from '@/lib/content';
import { siteConfig } from '@/lib/site-config';
import { renderOgImage, ogSize, ogContentType } from '@/lib/og';

// Per-project card showing the title and its tech tags. A project with a
// frontmatter `image` overrides this via generateMetadata.

export const alt = 'Project';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return renderOgImage({
    eyebrow: 'stephen@portfolio:~/projects$',
    title: project?.title ?? 'Project',
    subtitle: project?.description,
    footer: project?.tags.length
      ? project.tags.slice(0, 5).join(' · ')
      : siteConfig.title,
  });
}
