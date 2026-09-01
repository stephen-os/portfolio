import Link from 'next/link';
import { ChevronLeftIcon } from '@/components/ui/icons';

interface BackLinkProps {
  href: string;
  label: string;
  className?: string;
}

export function BackLink({ href, label, className = 'mb-8' }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-sm text-muted hover:opacity-80 ${className}`}
    >
      <ChevronLeftIcon />
      {label}
    </Link>
  );
}
