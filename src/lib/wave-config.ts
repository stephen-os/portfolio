// Wave visualiser configuration. The shipped defaults live in
// `src/config/wave-defaults.json` — edit that file to change what the
// background starts with; no component code needs touching.
//
// The schema is parsed at import time in a server component, so a malformed
// or out-of-range edit fails the build rather than silently rendering wrong.
// Keeping the parse server-side also keeps Zod out of the client bundle.

import { z } from 'zod';
import rawDefaults from '@/config/wave-defaults.json';

export const WAVE_TYPES = ['sine', 'square', 'sawtooth', 'triangle', 'noise'] as const;
export type WaveType = (typeof WAVE_TYPES)[number];

// Ranges mirror the control panel's slider bounds — a JSON value the UI
// couldn't produce is treated as a mistake.
const WaveConfigSchema = z.object({
  frequency: z.number().min(0.5).max(8),
  amplitude: z.number().min(5).max(45),
  speed: z.number().min(0).max(2),
  waveType: z.enum(WAVE_TYPES),
  layers: z.number().int().min(1).max(6),
  opacity: z.number().min(2).max(20),
  glow: z.boolean(),
  mirror: z.boolean(),
  showGrid: z.boolean(),
  perspective: z.boolean(),
  scanlines: z.boolean(),
  // Enables click-to-ripple distortion.
  mouseReact: z.boolean(),
  fillWave: z.boolean(),
});

export type WaveConfig = z.infer<typeof WaveConfigSchema>;

/** Parses the JSON defaults, throwing with field-level detail if invalid. */
export function loadWaveConfig(): WaveConfig {
  const result = WaveConfigSchema.safeParse(rawDefaults);
  if (!result.success) {
    throw new Error(
      `Invalid src/config/wave-defaults.json:\n${z.prettifyError(result.error)}`
    );
  }
  return result.data;
}
