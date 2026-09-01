'use client';

import { motion } from 'framer-motion';
import { WAVE_TYPES, type WaveConfig, type WaveType } from '@/lib/wave-config';
import { WaveControlsIcon } from '@/components/ui/icons';

// Keys of WaveConfig grouped by value type, so the slider and toggle lists
// below can only ever reference a field they can actually drive.
type NumericKey = {
  [K in keyof WaveConfig]: WaveConfig[K] extends number ? K : never;
}[keyof WaveConfig];

type BooleanKey = {
  [K in keyof WaveConfig]: WaveConfig[K] extends boolean ? K : never;
}[keyof WaveConfig];

interface SliderSpec {
  key: NumericKey;
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}

// Bounds here mirror the Zod ranges in lib/wave-config.ts — keep them in sync.
const SLIDERS: SliderSpec[] = [
  { key: 'frequency', label: 'Frequency', min: 0.5, max: 8, step: 0.5, format: (v) => `${v.toFixed(1)} Hz` },
  { key: 'amplitude', label: 'Amplitude', min: 5, max: 45, step: 5, format: (v) => `${v}%` },
  { key: 'speed', label: 'Speed', min: 0, max: 2, step: 0.1, format: (v) => `${v.toFixed(1)}x` },
  { key: 'layers', label: 'Layers', min: 1, max: 6, step: 1, format: (v) => `${v}` },
  { key: 'opacity', label: 'Intensity', min: 2, max: 20, step: 1, format: (v) => `${v}%` },
];

const TOGGLES: Array<{ key: BooleanKey; label: string }> = [
  { key: 'glow', label: 'Glow' },
  { key: 'mirror', label: 'Mirror' },
  { key: 'showGrid', label: 'Grid' },
  { key: 'perspective', label: '3D Grid' },
  { key: 'scanlines', label: 'Scanlines' },
  { key: 'mouseReact', label: 'Click Ripples' },
  { key: 'fillWave', label: 'Fill Wave' },
];

// Shared look for the small square buttons (wave type + toggles).
function chipClass(active: boolean): string {
  return `px-2 py-1 rounded text-xs transition-colors border border-border ${
    active ? 'bg-accent text-bg' : 'bg-bg-alt text-fg'
  }`;
}

interface WaveControlsProps {
  config: WaveConfig;
  onChange: <K extends keyof WaveConfig>(key: K, value: WaveConfig[K]) => void;
  onReset: () => void;
}

export function WaveControls({ config, onChange, onReset }: WaveControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed bottom-16 right-4 z-50 p-4 rounded-lg w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-surface border border-border"
      role="group"
      aria-label="Wave controls"
    >
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <WaveControlsIcon className="w-4 h-4 text-accent" />
        Wave Controls
      </h3>

      {/* Wave Type */}
      <div className="mb-4">
        <span className="block text-xs mb-2 text-muted">Wave Type</span>
        <div className="flex flex-wrap gap-1">
          {WAVE_TYPES.map((type: WaveType) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange('waveType', type)}
              aria-pressed={config.waveType === type}
              className={`${chipClass(config.waveType === type)} capitalize`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-4">
        {SLIDERS.map(({ key, label, min, max, step, format }) => (
          <div key={key}>
            <label htmlFor={`wave-${key}`} className="flex justify-between text-xs mb-1 text-muted">
              <span>{label}</span>
              <span>{format(config[key])}</span>
            </label>
            <input
              id={`wave-${key}`}
              type="range"
              min={min}
              max={max}
              step={step}
              value={config[key]}
              onChange={(e) => onChange(key, Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        ))}
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {TOGGLES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key, !config[key])}
            aria-pressed={config[key]}
            className={`${chipClass(config[key])} py-1.5`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full py-2 rounded text-sm transition-colors bg-bg-alt border border-border text-muted"
      >
        Reset to Default
      </button>
    </motion.div>
  );
}
