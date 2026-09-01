'use client';

import { ReactNode } from 'react';
import { FadeIn } from '@/components/visuals/motion';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  description?: string;
}

export function PageHeader({ title, subtitle, description }: PageHeaderProps) {
  return (
    <section className="text-center mb-12">
      <FadeIn>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
      </FadeIn>
      {subtitle && (
        <FadeIn delay={0.1}>
          <p className="text-xl mb-4 text-muted">
            {subtitle}
          </p>
        </FadeIn>
      )}
      {description && (
        <FadeIn delay={0.2}>
          <p className="max-w-2xl mx-auto text-muted">
            {description}
          </p>
        </FadeIn>
      )}
    </section>
  );
}
