// The terminal prompt — `stephen@portfolio:~$` — used at the start of command
// lines on the error and not-found pages.
export function Prompt() {
  return (
    <>
      <span className="text-accent">stephen</span>
      <span className="text-muted">@</span>
      <span className="text-accent-alt">portfolio</span>
      <span className="text-muted">:</span>
      <span className="text-fg">~$</span>
    </>
  );
}
