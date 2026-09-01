import Image from 'next/image';
import type { ImageInput } from '@/types';

interface FeaturedImageProps {
  image: ImageInput;
  alt: string;
  className?: string;
  // Detail-page covers are above the fold, so they preload (the default). Card
  // thumbnails in a list pass false so the whole list doesn't preload at once.
  priority?: boolean;
}

export function FeaturedImage({ image, alt, className = '', priority = true }: FeaturedImageProps) {
  const isObject = typeof image === 'object' && image !== null;
  return (
    <div className={`relative aspect-video rounded-lg overflow-hidden ${className}`}>
      {isObject ? (
        <Image
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          placeholder={image.blurDataURL ? 'blur' : 'empty'}
          blurDataURL={image.blurDataURL}
          className="w-full h-full object-cover"
          priority={priority}
        />
      ) : (
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
          priority={priority}
        />
      )}
    </div>
  );
}
