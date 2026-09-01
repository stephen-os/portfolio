import { defineConfig, defineCollection, s } from 'velite';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

// Slug from the file's directory: `posts/<slug>` -> `<slug>`.
// Velite's `s.path()` returns the directory portion, so the last segment is the slug.
const folderSlug = s.path().transform((p) => {
  const parts = p.split(/[/\\]/).filter(Boolean);
  return parts[parts.length - 1] || p;
});

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/index.mdx',
  schema: s
    .object({
      title: s.string().max(120),
      description: s.string().max(300),
      date: s.isodate(),
      tags: s.array(s.string()),
      image: s.image().or(s.string()).optional(),
      published: s.boolean().default(true),
      slug: folderSlug,
      code: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      url: `/posts/${data.slug}`,
    })),
});

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/index.mdx',
  schema: s
    .object({
      title: s.string().max(120),
      description: s.string().max(300),
      date: s.isodate(),
      tags: s.array(s.string()),
      github: s.string().url().optional(),
      demo: s.string().url().optional(),
      featured: s.boolean().default(false),
      image: s.image().or(s.string()).optional(),
      slug: folderSlug,
      code: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      url: `/projects/${data.slug}`,
    })),
});

// Gallery photos: one folder per photo (index.mdx + a colocated image), the same
// model as posts/projects. Velite resolves the image and adds dimensions + blur.
const gallery = defineCollection({
  name: 'GalleryImage',
  pattern: 'gallery/**/index.mdx',
  schema: s
    .object({
      title: s.string().max(120),
      description: s.string().max(300).optional(),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      category: s.string(),
      featured: s.boolean().default(false),
      image: s.image(),
      slug: folderSlug,
    })
    .transform(({ image, ...rest }) => ({
      ...rest,
      // Flatten the resolved image so the grid reads `src` + dimensions directly
      // — the shape it already consumed from the old gallery.json.
      src: image.src,
      width: image.width,
      height: image.height,
      blurDataURL: image.blurDataURL,
    })),
});

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts, projects, gallery },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      // `vesper` is a warm dark theme — amber/orange tokens that sit on the
      // carbon palette without introducing a competing colour family.
      // keepBackground: false so blocks use --color-bg-alt, not the theme's.
      [rehypePrettyCode, { theme: 'vesper', keepBackground: false, defaultLang: 'plaintext' }],
    ],
  },
});
