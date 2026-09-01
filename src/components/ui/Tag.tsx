interface TagProps {
  // 'mono' (default) — monospace pill with a subtle border. Detail pages
  // and project cards use this for the technical-tag look.
  // 'accent' — orange text on a darker chip. Used on post cards / gallery
  // overlays where the tag should pop more.
  variant?: 'mono' | 'accent';
  className?: string;
  children: React.ReactNode;
}

export function Tag({ variant = 'mono', className = '', children }: TagProps) {
  const base = 'px-2 py-1 rounded text-xs';
  const style =
    variant === 'mono'
      ? 'mono bg-bg-alt border border-border'
      : 'bg-bg-alt text-accent';
  return <span className={`${base} ${style} ${className}`}>{children}</span>;
}
