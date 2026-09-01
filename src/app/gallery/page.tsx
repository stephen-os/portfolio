import type { Metadata } from 'next';
import { getGalleryData } from '@/lib/content';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageLayout } from '@/components/ui/PageLayout';
import { GalleryGrid } from '@/components/pages/gallery/GalleryGrid';

const description =
  'A visual archive from Stephen Watson — rendering and level-design captures, conferences, and personal milestones.';

export const metadata: Metadata = {
  title: 'Gallery',
  description,
  alternates: { canonical: '/gallery' },
};

export default function Gallery() {
  const { images, categories, tags } = getGalleryData();

  return (
    <PageLayout width="wide">
      {/* Header */}
      <PageHeader
        title="Gallery"
        subtitle={
          <>
            A visual journey through{' '}
            <span className="text-accent">projects</span>,{' '}
            <span className="text-accent">events</span>, and{' '}
            <span className="text-accent">adventures</span>
          </>
        }
      />

      {/* Gallery Grid with Filters */}
      <GalleryGrid images={images} categories={categories} tags={tags} />
    </PageLayout>
  );
}
