import { describe, it, expect } from 'vitest';
import { getGalleryData } from '@/lib/content';

// These run against the real content/gallery.json rather than a fixture, so
// they double as a guard on the content itself: a malformed hand-edit fails
// here as well as at build time.
describe('getGalleryData', () => {
  it('parses the real gallery.json without throwing', () => {
    expect(() => getGalleryData()).not.toThrow();
  });

  it('returns images newest first', () => {
    const { images } = getGalleryData();
    const dated = images.filter((image) => image.date);

    for (let i = 1; i < dated.length; i++) {
      const previous = new Date(dated[i - 1].date!).getTime();
      const current = new Date(dated[i].date!).getTime();
      expect(previous).toBeGreaterThanOrEqual(current);
    }
  });

  it('sinks undated images below dated ones', () => {
    const { images } = getGalleryData();
    const firstUndated = images.findIndex((image) => !image.date);

    if (firstUndated !== -1) {
      expect(images.slice(firstUndated).every((image) => !image.date)).toBe(true);
    }
  });

  it('derives categories that are unique and sorted', () => {
    const { categories } = getGalleryData();
    expect(categories).toEqual([...new Set(categories)].sort());
  });

  it('derives tags that are unique and sorted', () => {
    const { tags } = getGalleryData();
    expect(tags).toEqual([...new Set(tags)].sort());
  });

  it('derives categories and tags only from the images it returned', () => {
    const { images, categories, tags } = getGalleryData();

    const imageCategories = new Set(
      images.map((image) => image.category).filter(Boolean)
    );
    const imageTags = new Set(images.flatMap((image) => image.tags ?? []));

    expect(categories.every((c) => imageCategories.has(c))).toBe(true);
    expect(tags.every((t) => imageTags.has(t))).toBe(true);
    expect(categories.length).toBe(imageCategories.size);
    expect(tags.length).toBe(imageTags.size);
  });

  it('gives every image a non-empty src', () => {
    const { images } = getGalleryData();
    expect(images.length).toBeGreaterThan(0);
    expect(images.every((image) => image.src.length > 0)).toBe(true);
  });
});
