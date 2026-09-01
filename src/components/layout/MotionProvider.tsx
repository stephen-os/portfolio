'use client';

import { MotionConfig } from 'framer-motion';

// Global motion configuration. `reducedMotion="user"` tells framer-motion to
// honor the OS-level `prefers-reduced-motion` setting — transitions become
// instant for users who've opted out of animation.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
