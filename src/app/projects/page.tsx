import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/content';
import { ProjectList } from '@/components/pages/projects/ProjectList';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageLayout } from '@/components/ui/PageLayout';
import { ConnectCTA } from '@/components/ui/ConnectCTA';
import { githubProfileUrl } from '@/lib/site-config';

const description =
  'Projects by Stephen Watson — graphics engines, 2D level editors, route-planning tools and full-stack applications.';

export const metadata: Metadata = {
  title: 'Projects',
  description,
  alternates: { canonical: '/projects' },
};

export default function Projects() {
  const allProjects = getAllProjects();
  // Single pass partition into featured / non-featured.
  const { featured, other } = allProjects.reduce<{ featured: typeof allProjects; other: typeof allProjects }>(
    (acc, p) => {
      (p.featured ? acc.featured : acc.other).push(p);
      return acc;
    },
    { featured: [], other: [] }
  );

  return (
    <PageLayout>
      <PageHeader
        title="My Projects"
        subtitle={
          <>
            A collection of projects showcasing my journey in{' '}
            <span className="text-accent">software development</span>
          </>
        }
        description="From graphics programming to full-stack applications, these projects represent my passion for creating innovative solutions and exploring new technologies."
      />

      <ProjectList featured={featured} other={other} />

      <ConnectCTA
        title="Interested in My Work?"
        description="These projects represent just a glimpse of what I'm passionate about. I'm always working on something new and would love to discuss potential collaborations."
        actions={[
          { href: githubProfileUrl, label: 'View All on GitHub', variant: 'primary', external: true },
          { href: '/contact', label: 'Get In Touch', variant: 'outline' },
        ]}
      />
    </PageLayout>
  );
}
