'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  viewAllHref: string;
  // Slide-in direction on mount — the two home cards mirror each other.
  from?: 'left' | 'right';
  // The list items (each an <li>, typically wrapping a <DashboardTile>).
  children: ReactNode;
}

// One card in the home dashboard grid: a header (title + "view all") over a
// list. The card itself is a static container; the interactivity lives on the
// individual tiles inside.
export function DashboardCard({ title, viewAllHref, from = 'left', children }: DashboardCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: from === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{title}</h2>
        <Link href={viewAllHref} className="text-xs text-accent">
          view all
        </Link>
      </div>
      <ul className="space-y-2">{children}</ul>
    </motion.section>
  );
}
