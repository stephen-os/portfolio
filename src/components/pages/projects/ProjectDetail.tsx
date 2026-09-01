import type { Project } from '@/types';
import { formatDateLong } from '@/lib/format';
import { ArticleLayout } from '@/components/ui/ArticleLayout';
import { BackLink } from '@/components/ui/BackLink';
import { TagList } from '@/components/ui/TagList';
import { FeaturedImage } from '@/components/ui/FeaturedImage';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { MDXContent } from '@/components/mdx/MDXContent';
import { GitHubIcon, ExternalLinkIcon } from '@/components/ui/icons';

// The full project detail page: title/description/date/tags, the source/demo
// buttons, an optional cover, and the MDX body — inside the shared frame.
export function ProjectDetail({ project }: { project: Project }) {
  return (
    <ArticleLayout>
      <BackLink href="/projects" label="Back to projects" />

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-lg mb-4 text-muted">{project.description}</p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="text-sm text-muted">{formatDateLong(project.date)}</span>
          <TagList tags={project.tags} />
        </div>

        {(project.github || project.demo) && (
          <div className="flex flex-wrap gap-2">
            {project.github && (
              <ButtonLink href={project.github} label="View Source" icon={<GitHubIcon />} tone="surface" />
            )}
            {project.demo && (
              <ButtonLink href={project.demo} label="Live Demo" icon={<ExternalLinkIcon />} tone="accent" />
            )}
          </div>
        )}
      </header>

      {project.image && (
        <FeaturedImage image={project.image} alt={project.title} className="mb-8" />
      )}

      <MDXContent code={project.code} />
    </ArticleLayout>
  );
}
