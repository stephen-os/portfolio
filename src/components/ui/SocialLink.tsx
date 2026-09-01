'use client';

import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';

interface SocialLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

// A profile link (GitHub, LinkedIn) — the hover-lift surface pill. A thin
// preset over ButtonLink so the intent reads clearly at call sites.
export function SocialLink({ href, icon, label }: SocialLinkProps) {
  return <ButtonLink href={href} icon={icon} label={label} tone="surface" animated />;
}
