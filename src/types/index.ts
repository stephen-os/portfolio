// Content types — sourced from Velite's generated module so frontmatter
// and runtime data stay in sync. Schema lives in velite.config.ts.
export type { Post, Project, GalleryImage } from '#site/content';

// Shape of the optional `image` field on Post/Project: either a string path
// for an image with no Velite-extracted metadata, or a Velite-resolved image
// object with dimensions + blur placeholder.
export type ImageInput =
  | string
  | {
      src: string;
      width: number;
      height: number;
      blurDataURL?: string;
    };
