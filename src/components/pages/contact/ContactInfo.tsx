'use client';

import { useSyncExternalStore, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { siteConfig, githubProfileUrl } from '@/lib/site-config';
import { EmailIcon, LocationIcon, ClockIcon, GitHubIcon, LinkedInIcon } from '@/components/ui/icons';
import { SocialLink } from '@/components/ui/SocialLink';

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

// Shared shell for a contact detail card.
function InfoCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card"
    >
      <div className="flex items-center gap-4 mb-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/20"
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// The address is split and only reassembled into a mailto after hydration, so
// it never appears verbatim in the server-rendered HTML that email harvesters
// scrape. No-JS visitors still get a readable, un-scrapable "user [at] domain".
const [emailUser, emailDomain] = siteConfig.email.split('@');

// A client-only flag (server snapshot false, client true) — renders the real
// mailto only after hydration, without a setState-in-effect.
const subscribeNoop = () => () => {};

function EmailCard() {
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const email = `${emailUser}@${emailDomain}`;

  return (
    <InfoCard
      icon={<EmailIcon className="w-5 h-5 text-accent" />}
      title="Email"
      subtitle="Drop me a line anytime"
    >
      {hydrated ? (
        <a href={`mailto:${email}`} className="text-sm break-words text-accent">
          {email}
        </a>
      ) : (
        <span className="text-sm break-words text-muted">
          {emailUser} [at] {emailDomain}
        </span>
      )}
    </InfoCard>
  );
}

// Contact detail cards, cascading in on mount.
export function ContactInfo() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
      }}
      className="space-y-4"
    >
      <EmailCard />

      <InfoCard
        icon={<LocationIcon className="w-5 h-5 text-accent" />}
        title="Location"
        subtitle="Where I'm based"
      >
        <p className="text-sm">Waynesboro, Virginia, US</p>
      </InfoCard>

      <InfoCard
        icon={<ClockIcon className="w-5 h-5 text-accent" />}
        title="Response Time"
        subtitle="I'll get back to you"
      >
        <p className="text-sm">Within 24-48 hours</p>
      </InfoCard>

      {/* Profile links — reuses the hero's SocialLink pill. */}
      <motion.div variants={cardVariants} className="flex flex-wrap gap-3 pt-2">
        <SocialLink href={githubProfileUrl} icon={<GitHubIcon />} label="GitHub" />
        <SocialLink href={siteConfig.linkedinUrl} icon={<LinkedInIcon />} label="LinkedIn" />
      </motion.div>
    </motion.div>
  );
}
