import { ImageResponse } from 'next/og';

// Shared Open Graph card renderer.
//
// Rendered by Satori, which supports only a flexbox subset and inline styles —
// no Tailwind classes, and every multi-child element needs an explicit
// `display: flex`. Palette values are duplicated here because Satori cannot
// read CSS custom properties; keep them in sync with globals.css.
const COLORS = {
  bg: '#0d0d0d',
  surface: '#171717',
  fg: '#e8e6e3',
  muted: '#989390',
  accent: '#ff6a13',
};

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

interface OgImageProps {
  // Small monospace line above the title, e.g. the terminal prompt or section.
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: string;
}

/** Renders the site's standard OG card. Long titles shrink to stay on-card. */
export function renderOgImage({ eyebrow, title, subtitle, footer }: OgImageProps): ImageResponse {
  // Satori has no text measurement, so scale by length instead of wrapping
  // unpredictably.
  const titleSize = title.length > 55 ? 48 : title.length > 32 ? 62 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: COLORS.bg,
        }}
      >
        <div style={{ display: 'flex', width: 16, backgroundColor: COLORS.accent }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 72px',
            flex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: COLORS.accent,
              fontFamily: 'monospace',
              marginBottom: 28,
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              color: COLORS.fg,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                display: 'flex',
                fontSize: 32,
                color: COLORS.muted,
                marginTop: 20,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          )}

          {footer && (
            <div
              style={{
                display: 'flex',
                marginTop: 40,
                paddingTop: 32,
                borderTop: `2px solid ${COLORS.surface}`,
                fontSize: 28,
                color: COLORS.muted,
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
