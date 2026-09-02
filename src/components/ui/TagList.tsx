import { Tag } from '@/components/ui/Tag';

interface TagListProps {
  tags: string[];
  variant?: 'mono' | 'accent';
  // When set, each tag becomes a button that calls this with the tag string.
  onTagClick?: (tag: string) => void;
}

export function TagList({ tags, variant = 'mono', onTagClick }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        // Composite key in case the same tag string repeats — Velite's schema
        // doesn't enforce uniqueness.
        <Tag
          key={`${tag}-${i}`}
          variant={variant}
          onClick={onTagClick ? () => onTagClick(tag) : undefined}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}
