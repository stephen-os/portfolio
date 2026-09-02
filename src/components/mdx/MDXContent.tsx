import * as runtime from 'react/jsx-runtime';
import Link from 'next/link';

// Custom components for MDX
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold mt-8 mb-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mt-6 mb-3" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-lg font-semibold mt-6 mb-2" {...props} />
  ),
  h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="text-base font-semibold mt-4 mb-2" {...props} />
  ),
  h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="text-sm font-semibold mt-4 mb-2 text-muted" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-relaxed text-muted" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-muted" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-muted" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="ml-4" {...props} />
  ),
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = typeof href === 'string' && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="text-accent hover:opacity-80 transition-opacity"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      />
    );
  },
  // Inline code: <code> with no className and no language data-attr.
  // Block code: either has a `language-*` className (raw markdown) or a
  // `data-language` attr (after rehype-pretty-code rewrites the tree).
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const dataLanguage = (props as Record<string, unknown>)['data-language'];
    const isBlock = (className && /\blanguage-/.test(className)) || Boolean(dataLanguage);
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="px-1.5 py-0.5 rounded text-sm mono bg-bg-alt text-accent"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="p-4 rounded-lg mb-4 overflow-x-auto mono text-sm bg-bg-alt border border-border"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-accent pl-4 my-4 italic text-muted"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-4">
      <table
        className="w-full text-sm border-collapse border border-border"
        {...props}
      />
    </div>
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-3 py-2 text-left font-semibold bg-bg-alt border-b border-border"
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-3 py-2 border-b border-border text-muted" {...props} />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const src = typeof props.src === 'string' ? props.src : '';
    return (
      <span className="block my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={props.alt || ''}
          className="rounded-lg w-full h-auto"
        />
        {props.alt && (
          <span className="block text-center text-sm mt-2 text-muted">
            {props.alt}
          </span>
        )}
      </span>
    );
  },
  // Custom components
  Link,
  ImageGallery,
  Callout,
  Columns,
  Column,
  Center,
  Roadmap,
};

// Custom component: Image Gallery. Put colocated markdown images inside the tag;
// Velite resolves the relative paths sitting next to the MDX, and they render in
// a two-column grid with their alt text as a caption.
function ImageGallery({ children }: { children?: React.ReactNode }) {
  // Each markdown image is an <img> the `img` renderer wraps in a block span;
  // zero the per-image margins so the grid gap owns the spacing.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 [&_p]:m-0 [&_p>span]:my-0">
      {children}
    </div>
  );
}

// Custom component: side-by-side layout. Collapses to a single column below
// the md breakpoint so it stays readable on a phone. Wrap each side in
// <Column> — MDX turns loose paragraphs into separate children, which would
// otherwise each become their own grid cell.
function Columns({
  count = 2,
  children,
}: {
  count?: 2 | 3;
  children?: React.ReactNode;
}) {
  const columns = count === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  return <div className={`grid grid-cols-1 ${columns} gap-6 my-6`}>{children}</div>;
}

// `min-w-0` stops wide children (code blocks, tables) from forcing the grid
// track wider than the page.
function Column({ children }: { children?: React.ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}

// Custom component: centers text and inline content.
function Center({ children }: { children?: React.ReactNode }) {
  return <div className="my-6 text-center">{children}</div>;
}

// Roadmap: development state grouped as Shipped / In progress / Planned. Each
// item carries a status badge; colours come from the theme's success/warning/
// muted tokens. Empty groups are dropped so a page shows only the buckets it uses.
type RoadmapProps = {
  shipped?: string[];
  inProgress?: string[];
  planned?: string[];
};

type RoadmapGroup = {
  label: string;
  items: string[];
  labelClass: string;
  badgeClass: string;
  glyph: string;
};

function Roadmap({ shipped = [], inProgress = [], planned = [] }: RoadmapProps) {
  const groups: RoadmapGroup[] = [
    { label: 'Shipped', items: shipped, labelClass: 'text-success', badgeClass: 'bg-success/15 text-success', glyph: '✓' },
    { label: 'In progress', items: inProgress, labelClass: 'text-warning', badgeClass: 'bg-warning/15 text-warning', glyph: '●' },
    { label: 'Planned', items: planned, labelClass: 'text-muted', badgeClass: 'border border-border text-muted', glyph: '○' },
  ];
  return (
    <div className="my-6 space-y-6">
      {groups
        .filter((group) => group.items.length > 0)
        .map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wider ${group.labelClass}`}>
                {group.label}
              </span>
              <span className="text-xs text-muted">{group.items.length}</span>
            </div>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs leading-none ${group.badgeClass}`}
                  >
                    {group.glyph}
                  </span>
                  <span className="text-fg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

// Custom component: Callout box
function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'tip';
  children: React.ReactNode;
}) {
  const borderColor = {
    info: 'border-accent',
    warning: 'border-warning',
    tip: 'border-success',
  }[type];

  return (
    <div className={`p-4 rounded-lg my-4 border-l-4 bg-surface ${borderColor}`}>
      {children}
    </div>
  );
}

// Velite emits `code` as a string of compiled MDX (a function body that
// returns a React component when given the JSX runtime). We build the
// component by `new Function(code)` — no runtime parsing, just an eval of
// the precompiled module.
//
// The component is cached at module scope keyed by code string so React
// sees a stable reference across renders (avoids reseting MDX-internal state
// and satisfies react-hooks/static-components).
type MDXComponent = React.ComponentType<{
  components?: Record<string, React.ComponentType | unknown>;
}>;

const componentCache = new Map<string, MDXComponent>();

function getMDXComponent(code: string): MDXComponent {
  const cached = componentCache.get(code);
  if (cached) return cached;
  const fn = new Function(code);
  const Component = fn({ ...runtime }).default as MDXComponent;
  componentCache.set(code, Component);
  return Component;
}

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = getMDXComponent(code);
  // Component is cached at module scope keyed by `code`, so the reference is
  // stable across renders — the linter can't statically prove this.
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={components} />;
}
