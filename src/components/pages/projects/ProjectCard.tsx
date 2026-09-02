'use client';

import Link from 'next/link';
import { Project } from '@/types';
import { StaggerHoverCard } from '@/components/visuals/motion';
import { GitHubIcon, ExternalLinkIcon } from '@/components/ui/icons';
import { TagList } from '@/components/ui/TagList';
import { FeaturedImage } from '@/components/ui/FeaturedImage';

export function ProjectCard({
  project,
  onTagClick,
}: {
  project: Project;
  onTagClick?: (tag: string) => void;
}) {
  return (
    <StaggerHoverCard className="card">
      {project.image && (
        <FeaturedImage image={project.image} alt={project.title} priority={false} className="mb-4" />
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div>
          <Link href={`/projects/${project.slug}`}>
            <h2 className="text-xl font-semibold mb-2 hover:opacity-80 transition-opacity">
              {project.title}
            </h2>
          </Link>
          <p className="text-muted">{project.description}</p>
        </div>
      </div>

      <div className="mb-4">
        <TagList tags={project.tags} onTagClick={onTagClick} />
      </div>

      <div className="flex items-center gap-4">
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm text-accent transition-colors"
        >
          Read more &rarr;
        </Link>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
          >
            <GitHubIcon />
            Source
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
          >
            <ExternalLinkIcon />
            Demo
          </a>
        )}
      </div>
    </StaggerHoverCard>
  );
}
