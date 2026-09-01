'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/ui/PageLayout';
import { TerminalCard } from '@/components/ui/TerminalCard';
import { Prompt } from '@/components/ui/Prompt';

// Route-level error boundary. Catches render and data errors in any page under
// the root layout; the nav and background stay mounted. Errors thrown by the
// root layout itself are not caught here — that would need global-error.tsx.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the browser console locally and in the host's logs in
    // production. `digest` is the server-side correlation id.
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <PageLayout width="narrow">
      <TerminalCard>
        <p>
          <Prompt /> ./render
        </p>
        <p className="mt-2 text-error">Error: process exited unexpectedly</p>
        {error.digest && <p className="mt-2 text-muted">digest: {error.digest}</p>}
      </TerminalCard>

      <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted mb-8">
        This page failed to render. Trying again often clears it — if it
        doesn&apos;t, the details above help me track it down.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 rounded-full font-medium transition-colors bg-accent text-bg"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-full font-medium transition-colors border border-border text-fg text-center"
        >
          Back Home
        </Link>
      </div>
    </PageLayout>
  );
}
