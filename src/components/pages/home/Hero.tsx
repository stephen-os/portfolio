'use client';

import { motion } from 'framer-motion';
import { EQBars } from '@/components/visuals/Waveform';
import { SocialLink } from '@/components/ui/SocialLink';
import { GitHubIcon, LinkedInIcon } from '@/components/ui/icons';
import { siteConfig, githubProfileUrl } from '@/lib/site-config';

// Home hero: name, tagline, intro, and the profile links. Static copy, so it
// takes no props.
export function Hero() {
  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-4"
      >
        <h1 className="text-4xl lg:text-5xl font-bold">
          Hi, I&apos;m <span className="text-accent">Stephen Watson</span>
        </h1>
        <EQBars count={5} height={40} className="hidden sm:flex" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl mb-6 text-muted"
      >
        Graphics programming and developer tools, mostly in{' '}
        <span className="text-accent">C++</span>.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg mb-8 text-muted"
      >
        I&apos;m a software developer focused on computer graphics and the tooling around it.
        I built <span className="text-accent">Lumina</span>, a C++ application framework, and most of
        my projects — from a 3D solar-system simulation to a 2D tile editor — run on top of it.
        Computer Science graduate from JMU, drawn to the math behind rendering.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-4"
      >
        <SocialLink href={githubProfileUrl} icon={<GitHubIcon />} label="GitHub" />
        <SocialLink href={siteConfig.linkedinUrl} icon={<LinkedInIcon />} label="LinkedIn" />
      </motion.div>
    </section>
  );
}
