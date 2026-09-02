'use client';

import { useMemo } from 'react';
import { Project } from '@/types';
import { ProjectCard } from '@/components/pages/projects/ProjectCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { useSearch } from '@/hooks/useSearch';
import { StaggerContainerView, FadeInView } from '@/components/visuals/motion';

interface ProjectListProps {
  featured: Project[];
  other: Project[];
}

// Only surface the search box once there's enough to sift through.
const SEARCH_THRESHOLD = 3;

// A project's searchable text: title, tags, and description.
function projectSearchText(project: Project): string {
  return `${project.title} ${project.tags.join(' ')} ${project.description}`;
}

export function ProjectList({ featured, other }: ProjectListProps) {
  const allProjects = useMemo(() => [...featured, ...other], [featured, other]);
  const { query, setQuery, results } = useSearch(allProjects, projectSearchText);

  if (allProjects.length === 0) {
    return (
      <FadeInView className="card text-center mb-12">
        <p className="text-muted">No projects yet. Check back soon!</p>
      </FadeInView>
    );
  }

  const showSearch = allProjects.length > SEARCH_THRESHOLD;
  const searching = query.trim().length > 0;

  return (
    <>
      {showSearch && (
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search projects by name or tag..."
          label="Search projects"
        />
      )}

      {/* While searching, one flat list of matches (or a quiet no-match note). */}
      {searching && results.length === 0 && (
        <div className="card text-center mb-12">
          <p className="text-muted">No projects match &ldquo;{query}&rdquo;.</p>
        </div>
      )}

      {searching && results.length > 0 && (
        <section className="mb-12">
          <StaggerContainerView className="space-y-6">
            {results.map((project) => (
              <ProjectCard key={project.slug} project={project} onTagClick={setQuery} />
            ))}
          </StaggerContainerView>
        </section>
      )}

      {/* Idle: the usual Featured / Other split. */}
      {!searching && (
        <>
          {featured.length > 0 && (
            <section className="mb-12">
              <FadeInView className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-semibold">Featured Projects</h2>
                <div className="h-0.5 flex-1 bg-linear-to-r from-accent to-transparent" />
              </FadeInView>
              <StaggerContainerView className="space-y-6">
                {featured.map((project) => (
                  <ProjectCard key={project.slug} project={project} onTagClick={setQuery} />
                ))}
              </StaggerContainerView>
            </section>
          )}

          {other.length > 0 && (
            <section className="mb-12">
              <FadeInView delay={0.2} className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-muted">Other Projects</h2>
                <div className="h-0.5 flex-1 bg-linear-to-r from-border to-transparent" />
              </FadeInView>
              <StaggerContainerView className="space-y-6" delay={0.1}>
                {other.map((project) => (
                  <ProjectCard key={project.slug} project={project} onTagClick={setQuery} />
                ))}
              </StaggerContainerView>
            </section>
          )}
        </>
      )}
    </>
  );
}
