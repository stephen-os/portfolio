interface TagProps {
  // 'mono' (default) — monospace pill with a subtle border. Detail pages
  // and project cards use this for the technical-tag look.
  // 'accent' — orange text on a darker chip. Used on post cards / gallery
  // overlays where the tag should pop more.
  variant?: 'mono' | 'accent';
  className?: string;
  children: React.ReactNode;
  // When set, the tag renders as a button that fires this on click — the list
  // cards use it to drop the tag into the search box.
  onClick?: () => void;
}

export function Tag({ variant = 'mono', className = '', children, onClick }: TagProps) {
  const base = 'px-2 py-1 rounded text-xs';
  const style =
    variant === 'mono'
      ? 'mono bg-bg-alt border border-border'
      : 'bg-bg-alt text-accent';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} ${style} cursor-pointer transition-colors hover:border-accent hover:text-accent hover:bg-surface focus:outline-none focus-visible:ring-1 focus-visible:ring-accent ${className}`}
      >
        {children}
      </button>
    );
  }
  return <span className={`${base} ${style} ${className}`}>{children}</span>;
}
