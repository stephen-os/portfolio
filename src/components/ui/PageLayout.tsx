import type { ReactNode } from 'react';

const WIDTH = {
  narrow: 'max-w-2xl', // error / not-found
  default: 'max-w-4xl', // most pages
  wide: 'max-w-5xl', // gallery
} as const;

interface PageLayoutProps {
  width?: keyof typeof WIDTH;
  children: ReactNode;
}

// The centered content column shared by every top-level page — the one place
// page width is defined. ArticleLayout is the equivalent frame for post and
// project detail pages.
export function PageLayout({ width = 'default', children }: PageLayoutProps) {
  return <div className={`${WIDTH[width]} mx-auto`}>{children}</div>;
}
