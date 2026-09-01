import Link from 'next/link';

interface DashboardTileProps {
  href: string;
  title: string;
  // Small monospace line under the title — tags for a project, a date for a post.
  subtitle: string;
  // Bubble fill. Defaults to the darkest tone; Featured Projects use the
  // slightly lighter `bg-bg` so they sit a step above the darkest.
  background?: 'bg-bg-alt' | 'bg-bg';
}

// A single item in a home dashboard list: a bubble that highlights (accent
// border + lifted background) on hover. Shared by Featured Projects and
// Recent Posts.
export function DashboardTile({ href, title, subtitle, background = 'bg-bg-alt' }: DashboardTileProps) {
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 ${background} border border-border transition-colors hover:border-accent hover:bg-surface`}
    >
      <span className="block text-sm font-medium text-fg">{title}</span>
      <span className="block text-xs text-muted mono">{subtitle}</span>
    </Link>
  );
}
