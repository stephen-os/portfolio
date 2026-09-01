import type { Metadata } from 'next';
import Link from 'next/link';
import { ConnectCTA } from '@/components/ui/ConnectCTA';
import { PageLayout } from '@/components/ui/PageLayout';
import { TerminalCard } from '@/components/ui/TerminalCard';
import { Prompt } from '@/components/ui/Prompt';

export const metadata: Metadata = {
  title: 'Page Not Found',
  // A 404 shouldn't be indexed, but crawlers should still follow the links
  // out of it back into the real site.
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: '/projects', label: 'projects', hint: 'graphics engines, editors, web apps' },
  { href: '/posts', label: 'posts', hint: 'writing on graphics and development' },
  { href: '/gallery', label: 'gallery', hint: 'renders, events, milestones' },
  { href: '/about', label: 'about', hint: 'background and experience' },
];

export default function NotFound() {
  return (
    <PageLayout width="narrow">
      {/* Terminal transcript, matching the nav's prompt styling. */}
      <TerminalCard>
        <p>
          <Prompt /> cd .
        </p>
        <p className="mt-2 text-muted">bash: cd: No such file or directory</p>
        <p className="mt-4">
          <Prompt /> ls
          <span className="cursor-blink inline-block w-2 h-4 ml-1 align-middle bg-accent" />
        </p>
      </TerminalCard>

      <h1 className="text-3xl font-bold mb-2">404 — page not found</h1>
      <p className="text-muted mb-8">
        That page doesn&apos;t exist. It may have moved, or the link may be wrong.
      </p>

      <ul className="space-y-3 mb-12">
        {suggestions.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="mono text-accent">
              /{item.label}
            </Link>
            <span className="text-muted text-sm"> — {item.hint}</span>
          </li>
        ))}
      </ul>

      <ConnectCTA
        title="Looking for something specific?"
        description="If you followed a link here from somewhere, let me know so I can fix it."
        actions={[
          { href: '/', label: 'Back Home', variant: 'primary' },
          { href: '/contact', label: 'Report a Broken Link', variant: 'outline' },
        ]}
      />
    </PageLayout>
  );
}
