'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ButtonLinkProps {
  href: string;
  label: string;
  icon?: ReactNode;
  // 'surface' — bordered pill on the surface colour (default). 'accent' —
  // filled orange with dark text (kept dark for AA; the home CTA's white text
  // is a deliberate one-off in ConnectCTA).
  tone?: 'surface' | 'accent';
  // Opens in a new tab. Defaults true — every current use is an outbound link.
  external?: boolean;
  // Adds a hover lift, used by the profile links in the hero.
  animated?: boolean;
}

const TONE = {
  surface: 'bg-surface border border-border text-fg',
  accent: 'bg-accent text-bg',
} as const;

// Icon + label pill link. Shared by the hero's profile links and the project
// detail page's "View Source" / "Live Demo" buttons.
export function ButtonLink({
  href,
  label,
  icon,
  tone = 'surface',
  external = true,
  animated = false,
}: ButtonLinkProps) {
  const className = `inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${TONE[tone]}`;
  const externalAttrs = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const inner = (
    <>
      {icon}
      {label}
    </>
  );

  if (animated) {
    return (
      <motion.a
        href={href}
        {...externalAttrs}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={className}
      >
        {inner}
      </motion.a>
    );
  }

  if (external) {
    return (
      <a href={href} {...externalAttrs} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
