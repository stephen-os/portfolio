import { Tag } from '@/components/ui/Tag';

interface TagListProps {
  tags: string[];
  variant?: 'mono' | 'accent';
}

export function TagList({ tags, variant = 'mono' }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        // Composite key in case the same tag string repeats — Velite's schema
        // doesn't enforce uniqueness.
        <Tag key={`${tag}-${i}`} variant={variant}>
          {tag}
        </Tag>
      ))}
    </div>
  );
}
