import Link from 'next/link';

interface CTAAction {
  href: string;
  label: string;
  // 'primary' fills with --color-accent; 'outline' is bordered.
  variant?: 'primary' | 'outline';
  // External links open in a new tab.
  external?: boolean;
}

interface ConnectCTAProps {
  title: string;
  description: string;
  actions: CTAAction[];
}

// Gradient call-to-action panel reused across multiple pages (home, about,
// experience, projects). Renders the heading, description, and a row of pill
// buttons.
export function ConnectCTA({ title, description, actions }: ConnectCTAProps) {
  return (
    <section className="cta-gradient rounded-xl p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="mb-6 text-muted">{description}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {actions.map((action) => {
          const className =
            action.variant === 'outline'
              ? 'inline-block px-6 py-3 rounded-full font-medium transition-colors border border-border text-fg'
              : 'inline-block px-6 py-3 rounded-full font-medium transition-colors bg-accent text-white';
          if (action.external) {
            return (
              <a
                key={action.href}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {action.label}
              </a>
            );
          }
          return (
            <Link key={action.href} href={action.href} className={className}>
              {action.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
