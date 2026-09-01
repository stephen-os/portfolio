import type { ReactNode } from 'react';

// The frame shared by every content detail page (posts, projects): the
// <article> wrapper with a consistent width and fade-in. The body itself lives
// in ProjectDetail / PostDetail, which render their own header, cover and MDX
// inside here — so the two page types can diverge freely without this frame
// growing props.
export function ArticleLayout({ children }: { children: ReactNode }) {
  return <article className="animate-fade-in max-w-3xl mx-auto">{children}</article>;
}
