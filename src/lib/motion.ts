// Animation timing helpers. Keeps staggered reveals from snowballing into
// half-second-plus delays on long lists, while still giving each item a
// visible cascade.

const MAX_STAGGER_DELAY = 0.4;

/**
 * Stagger delay for the Nth item in a list. Capped at MAX_STAGGER_DELAY so
 * the last item in a long list isn't waiting a full second to appear.
 *
 *   staggerDelay(0)           // 0
 *   staggerDelay(3, 0.05, 0.1)  // 0.1 + 3*0.05 = 0.25
 *   staggerDelay(20, 0.05, 0.1) // 0.4 (capped)
 */
export function staggerDelay(index: number, step = 0.05, base = 0): number {
  return Math.min(base + index * step, MAX_STAGGER_DELAY);
}
