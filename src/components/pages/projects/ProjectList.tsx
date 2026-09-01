'use client';

import { Project } from '@/types';
import { ProjectCard } from '@/components/pages/projects/ProjectCard';
import { StaggerContainerView, FadeInView } from '@/components/visuals/motion';

interface ProjectListProps {
  featured: Project[];
  other: Project[];
}

export function ProjectList({ featured, other }: ProjectListProps) {
  if (featured.length === 0 && other.length === 0) {
    return (
      <FadeInView className="card text-center mb-12">
        <p className="text-muted">No projects yet. Check back soon!</p>
      </FadeInView>
    );
  }

  return (
    <>
      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="mb-12">
          <FadeInView className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold">Featured Projects</h2>
            <div className="h-0.5 flex-1 bg-linear-to-r from-accent to-transparent" />
          </FadeInView>
          <StaggerContainerView className="space-y-6">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </StaggerContainerView>
        </section>
      )}

      {/* Other Projects */}
      {other.length > 0 && (
        <section className="mb-12">
          <FadeInView delay={0.2} className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-muted">
              Other Projects
            </h2>
            <div className="h-0.5 flex-1 bg-linear-to-r from-border to-transparent" />
          </FadeInView>
          <StaggerContainerView className="space-y-6" delay={0.1}>
            {other.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </StaggerContainerView>
        </section>
      )}
    </>
  );
}
