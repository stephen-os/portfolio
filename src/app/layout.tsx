import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { TerminalNav } from "@/components/layout/TerminalNav";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { siteConfig, siteUrl, githubProfileUrl } from "@/lib/site-config";

const defaultTitle = `${siteConfig.title} | ${siteConfig.tagline}`;

export const metadata: Metadata = {
  // Resolves every relative URL below (and in child pages) to an absolute one.
  metadataBase: new URL(siteUrl),
  title: {
    // Child pages set only their own title; the suffix is appended here so it
    // can never drift between pages.
    default: defaultTitle,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author, url: githubProfileUrl }],
  creator: siteConfig.author,
  alternates: {
    canonical: "/",
  },
  // Site-level facts ONLY. `title`, `description` and `url` are deliberately
  // absent: a child page inherits this whole block unless it declares its own,
  // so setting them here would stamp the home card onto every static page. Left
  // unset, Next derives og:title / og:description per page from its own resolved
  // title / description.
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.title,
  },
  // Card type only. Setting title/description here would win over every child
  // page's own values, leaving all X/Twitter previews showing the site title —
  // Next derives them from each page's `title`/`description` when unset.
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Tints mobile browser chrome to match the page. Keep in sync with
  // --color-bg in globals.css.
  themeColor: "#0d0d0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Skip link — lets keyboard/screen-reader users jump past the fixed
            nav straight to the content. Visually hidden until focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium focus:bg-accent focus:text-bg"
        >
          Skip to content
        </a>
        <MotionProvider>
          <TerminalNav />
          {/* tabIndex -1 lets the skip link move focus here; outline suppressed
              so the whole region isn't ringed when it receives that focus. */}
          <main
            id="main"
            tabIndex={-1}
            className="min-h-screen pt-20 px-4 md:px-8 pb-8 focus:outline-none"
          >
            {children}
          </main>
        </MotionProvider>
        {/* Cookieless page analytics. Only collects anything when deployed on
            Vercel with Analytics enabled for the project — it no-ops
            everywhere else, including locally. */}
        <Analytics />
      </body>
    </html>
  );
}
