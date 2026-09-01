import type { ReactNode } from 'react';

// A monospace "terminal transcript" card — the shared shell for the 404 and
// error pages. Command/output lines go in as children, using <Prompt /> for
// the prompt.
export function TerminalCard({ children }: { children: ReactNode }) {
  return <div className="card mono text-sm mb-8">{children}</div>;
}
