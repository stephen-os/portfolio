# Portfolio

Personal portfolio and writing site for Stephen Watson — projects, posts, and a photo gallery.

Built with **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind v4** · **Velite** (MDX content) · **Framer Motion** · **Resend**.

## Getting started

Requires **Node 22+** (pinned in `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # fill in what you need
npm run dev                  # http://localhost:3000
```

`npm run dev` runs Velite in watch mode alongside Next, so edits under `content/` rebuild automatically. Nothing in `.env.local` is required to boot — without a `RESEND_API_KEY` the contact form returns 503 instead of sending.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Velite watch + Next dev server |
| `npm run build` | Content build, then a production Next build |
| `npm start` | Serve the production build |
| `npm test` | Vitest (rebuilds content first) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (incl. deprecated-API check) |
| `npm run knip` | Find unused files / exports / dependencies |
| `npm run secretlint` | Scan the tree for committed secrets |
| `npm run linkcheck` | Crawl the built site for broken links |

Run `test`, `typecheck`, `lint`, and `build` before calling a change done.

## Content

Every piece of content — a **project**, **post**, or **gallery photo** — is a folder under `content/` with an `index.mdx` (frontmatter + body) and its images. Images are referenced by relative filename; Velite fingerprints them into `public/static/` with dimensions and a blur placeholder.

```
content/projects/my-thing/
├── index.mdx        # frontmatter: image: cover.png
├── cover.png
└── screenshot.png   # in the body: ![alt](screenshot.png)
```

Drop a folder in and it's picked up automatically — the folder name is the slug, and malformed frontmatter fails the build. `content/templates/` holds reference scaffolds to copy from; nothing there is compiled or routed.

## Structure

```
src/app         routes, layouts, API handlers, metadata files
src/components  UI — ui/ · layout/ · visuals/ · mdx/ · pages/
src/lib         content loading, metadata, formatting, wave rendering
src/config      wave-visualiser defaults
src/types       shared types
content         projects · posts · gallery (folder-per-item) · templates
tests           Vitest suites (src/lib + the contact route)
```

## Deploying

Deploys on **Vercel** — connect the repo and it builds on push. Set these in the project's environment variables:

- `NEXT_PUBLIC_SITE_URL` — the real origin (drives sitemap, canonical URLs, and OG image URLs).
- `RESEND_API_KEY` — required for the contact form to send.

See `.env.example` for the full list and details.
