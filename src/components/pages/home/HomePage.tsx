'use client';

import { motion } from 'framer-motion';
import { WaveformSectionDivider, FrequencyVisualizer } from '@/components/visuals/Waveform';
import { WaveBackground } from '@/components/visuals/WaveBackground';
import type { WaveConfig } from '@/lib/wave-config';
import { formatDateShort } from '@/lib/format';
import { ConnectCTA } from '@/components/ui/ConnectCTA';
import { PageLayout } from '@/components/ui/PageLayout';
import { Hero } from '@/components/pages/home/Hero';
import { DashboardCard } from '@/components/pages/home/DashboardCard';
import { DashboardTile } from '@/components/pages/home/DashboardTile';
import { staggerDelay } from '@/lib/motion';

// Slim shapes passed from the server page — just what the dashboard cards
// show, not the full project/post objects with their compiled MDX.
interface FeaturedProject {
  title: string;
  slug: string;
  tags: string[];
}

interface RecentPost {
  title: string;
  slug: string;
  date: string;
}

interface HomePageProps {
  featuredProjects: FeaturedProject[];
  recentPosts: RecentPost[];
  waveConfig: WaveConfig;
}

export function HomePage({ featuredProjects, recentPosts, waveConfig }: HomePageProps) {
  return (
    <>
      <WaveBackground defaults={waveConfig} />
      <PageLayout>
        <Hero />

        <WaveformSectionDivider className="mb-8" />

        {/* Featured Projects and Recent Posts side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <DashboardCard title="Featured Projects" viewAllHref="/projects" from="left">
            {featuredProjects.map((project, index) => (
              <motion.li
                key={project.slug}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: staggerDelay(index, 0.08, 0.6) }}
              >
                <DashboardTile
                  href={`/projects/${project.slug}`}
                  title={project.title}
                  subtitle={project.tags.slice(0, 3).join(' · ')}
                  background="bg-bg"
                />
              </motion.li>
            ))}
          </DashboardCard>

          <DashboardCard title="Recent Posts" viewAllHref="/posts" from="right">
            {recentPosts.length === 0 ? (
              <li className="text-sm text-muted px-3 py-2">No posts yet — check back soon.</li>
            ) : (
              recentPosts.map((post, index) => (
                <motion.li
                  key={post.slug}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: staggerDelay(index, 0.08, 0.6) }}
                >
                  <DashboardTile
                    href={`/posts/${post.slug}`}
                    title={post.title}
                    subtitle={formatDateShort(post.date)}
                  />
                </motion.li>
              ))
            )}
          </DashboardCard>
        </div>

        {/* Contact CTA */}
        <div className="space-y-6">
          <ConnectCTA
            title="Want to build something together?"
            description="I'm always up for a conversation about graphics, developer tools, or an interesting problem to solve."
            actions={[{ href: '/contact', label: 'Get In Touch', variant: 'primary' }]}
          />
          <FrequencyVisualizer barCount={40} height={30} className="opacity-50" />
        </div>
      </PageLayout>
    </>
  );
}
