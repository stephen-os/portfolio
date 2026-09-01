'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Animated EQ bars — used in the home hero and the section divider.
export function EQBars({
  count = 5,
  height = 24,
  className = '',
  animated = true,
}: {
  count?: number;
  height?: number;
  className?: string;
  animated?: boolean;
}) {
  // Lock random heights/durations per-instance via useState's lazy initializer
  // (runs once, treated as init not render — keeps the render pure). Note:
  // changing `count` after mount won't re-seed; today all call sites pass a
  // fixed value.
  const [seeds] = useState(() =>
    Array.from({ length: count }, () => ({
      peakA: 40 + Math.random() * 60,
      peakB: 50 + Math.random() * 50,
      duration: 1 + Math.random() * 0.5,
    }))
  );

  return (
    <div className={`flex items-end gap-1 ${className}`} style={{ height }}>
      {seeds.map((seed, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-accent"
          initial={{ height: '20%' }}
          animate={
            animated
              ? {
                  height: ['20%', `${seed.peakA}%`, '30%', `${seed.peakB}%`, '20%'],
                }
              : { height: `${30 + i * 15}%` }
          }
          transition={
            animated
              ? {
                  duration: seed.duration,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }
              : {}
          }
        />
      ))}
    </div>
  );
}

// Animated frequency visualizer — used at the bottom of the home CTA.
export function FrequencyVisualizer({
  barCount = 32,
  height = 60,
  className = '',
}: {
  barCount?: number;
  height?: number;
  className?: string;
}) {
  // baseHeight follows a sine half-cycle (bell shape) across the bars; jitter
  // and duration are locked per-instance via useState's lazy initializer so
  // re-renders don't reshuffle them. Today all call sites pass a fixed
  // `barCount`; changing it after mount would not re-seed.
  const [bars] = useState(() =>
    Array.from({ length: barCount }, (_, i) => {
      const baseHeight = Math.sin((i / barCount) * Math.PI) * 70 + 20;
      return {
        baseHeight,
        peakHeight: Math.max(10, baseHeight + (Math.random() - 0.5) * 40),
        duration: 0.8 + Math.random() * 0.4,
        opacity: 0.6 + Math.sin((i / barCount) * Math.PI) * 0.4,
      };
    })
  );

  return (
    <div
      className={`flex items-end justify-center gap-[2px] ${className}`}
      style={{ height }}
    >
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-t-sm bg-accent"
          style={{ opacity: bar.opacity }}
          initial={{ height: `${bar.baseHeight}%` }}
          animate={{
            height: [`${bar.baseHeight}%`, `${bar.peakHeight}%`, `${bar.baseHeight}%`],
          }}
          transition={{
            duration: bar.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.02,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Section divider with a small EQ in the middle. Used between major sections
// on the home page.
export function WaveformSectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 my-8 ${className}`}>
      <div className="h-px flex-1 bg-border" />
      <EQBars count={7} height={20} animated={true} />
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
