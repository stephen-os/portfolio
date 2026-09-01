'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryImage } from '@/types';
import { formatDateLong } from '@/lib/format';
import { CloseIcon, TagFilterIcon } from '@/components/ui/icons';
import { TagList } from '@/components/ui/TagList';
import { staggerDelay } from '@/lib/motion';

interface GalleryGridProps {
  images: GalleryImage[];
  categories: string[];
  tags: string[];
}

export function GalleryGrid({ images, categories, tags }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Filter images based on category and tags
  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      // Category filter
      if (selectedCategory !== 'all' && image.category !== selectedCategory) {
        return false;
      }

      // Tag filter (image must have ALL selected tags)
      if (selectedTags.length > 0) {
        const imageTags = image.tags || [];
        return selectedTags.every((tag) => imageTags.includes(tag));
      }

      return true;
    });
  }, [images, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedTags.length > 0;

  // Close lightbox on Escape. Also lock body scroll while open.
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into the dialog so screen readers and keyboard users land there.
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedImage]);

  return (
    <div>
      {/* Category Filter — 'all' is rendered as the first option alongside the
          real categories so both share one code path. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-4"
      >
        {['all', ...categories].map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm transition-colors capitalize border border-border ${
              selectedCategory === category ? 'bg-accent text-bg' : 'bg-surface text-fg'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Tag Filter Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex justify-center gap-2 mb-4"
      >
        <motion.button
          onClick={() => setShowTagFilter(!showTagFilter)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 bg-surface border border-border ${
            showTagFilter ? 'text-accent' : 'text-muted'
          }`}
        >
          <TagFilterIcon />
          Filter by Tags
          {selectedTags.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-accent text-bg">
              {selectedTags.length}
            </span>
          )}
        </motion.button>

        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearFilters}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg text-sm bg-bg-alt border border-border text-muted"
          >
            Clear Filters
          </motion.button>
        )}
      </motion.div>

      {/* Tag Pills */}
      <AnimatePresence>
        {showTagFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="flex flex-wrap justify-center gap-2 py-4">
              {tags.map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-full text-xs transition-colors border border-border ${
                    selectedTags.includes(tag) ? 'bg-accent text-bg' : 'bg-bg-alt text-fg'
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm mb-6 text-muted"
      >
        Showing {filteredImages.length} of {images.length} images
      </motion.p>

      {/* Gallery Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, index) => (
            <motion.button
              key={image.src}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: staggerDelay(index, 0.03),
                layout: { duration: 0.3 },
              }}
              whileHover={{ y: -4 }}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group bg-surface text-left focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              aria-label={image.title ? `Open ${image.title}` : 'Open gallery image'}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.title || 'Gallery image'}
                fill
                sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  console.warn('Gallery image failed to load:', image.src);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Hover Overlay */}
              {/* Fixed black scrim rather than a theme colour — it has to keep
                  the caption legible over arbitrary photography. */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end bg-linear-to-t from-black/85 via-black/30 to-transparent">
                <div className="p-4">
                  {image.title && (
                    <h3 className="font-medium text-white mb-1">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-sm text-gray-300 line-clamp-2">{image.description}</p>
                  )}
                  {image.tags && image.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {image.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-xs bg-white/20 text-white"
                        >
                          {tag}
                        </span>
                      ))}
                      {image.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{image.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Featured Badge */}
              {image.featured && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium bg-accent text-bg">
                  Featured
                </div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      <AnimatePresence>
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-muted"
          >
            <p className="mb-2">No images match your filters.</p>
            <button
              onClick={clearFilters}
              className="text-sm underline text-accent"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.title ? `${selectedImage.title} (full size)` : 'Gallery image (full size)'}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                ref={closeButtonRef}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-12 right-0 p-2 rounded-full z-10 text-fg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                aria-label="Close"
                onClick={() => setSelectedImage(null)}
              >
                <CloseIcon className="w-6 h-6" />
              </motion.button>

              {/* Image */}
              <div className="relative">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title || 'Gallery image'}
                  width={1200}
                  height={800}
                  className="object-contain w-full h-auto max-h-[70vh] rounded-lg"
                />
              </div>

              {/* Metadata Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 p-4 rounded-lg bg-surface"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    {selectedImage.title && (
                      <h2 className="text-xl font-semibold mb-1">{selectedImage.title}</h2>
                    )}
                    {selectedImage.description && (
                      <p className="text-muted">{selectedImage.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {selectedImage.date && (
                      <span className="text-sm text-muted">{formatDateLong(selectedImage.date)}</span>
                    )}
                    {selectedImage.category && (
                      <span className="px-2 py-1 rounded text-xs capitalize bg-bg-alt border border-border">
                        {selectedImage.category}
                      </span>
                    )}
                  </div>
                </div>

                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <TagList tags={selectedImage.tags} variant="accent" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
