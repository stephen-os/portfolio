// Pure canvas drawing helpers for the wave background. Kept free of React so
// the rendering maths can be read (and changed) without wading through
// component state.

import type { WaveConfig, WaveType } from './wave-config';

export interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  timestamp: number;
}

export type WavePosition = 'center' | 'top' | 'bottom';

// Despite the `noise` name, all five generators are pure deterministic
// functions of (x, frequency) — `noise` is just three summed sines with phase
// offsets, which sounds more interesting than a sine but isn't real noise.
const waveGenerators: Record<WaveType, (x: number, frequency: number) => number> = {
  sine: (x, freq) => Math.sin(x * freq * Math.PI * 2),
  square: (x, freq) => Math.sign(Math.sin(x * freq * Math.PI * 2)),
  sawtooth: (x, freq) => 2 * ((x * freq) % 1) - 1,
  triangle: (x, freq) => Math.abs(4 * ((x * freq + 0.25) % 1) - 2) - 1,
  noise: (x, freq) =>
    Math.sin(x * freq * Math.PI * 2) * 0.5 +
    Math.sin(x * freq * Math.PI * 4.3 + 1.3) * 0.3 +
    Math.sin(x * freq * Math.PI * 7.1 + 2.1) * 0.2,
};

export function drawPerspectiveGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  const horizonY = height * 0.35;
  const vanishingX = width / 2;

  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.08;
  ctx.lineWidth = 1;

  const horizontalLines = 20;
  for (let i = 0; i <= horizontalLines; i++) {
    const progress = i / horizontalLines;
    const y = horizonY + (height - horizonY) * Math.pow(progress, 1.5);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const verticalLines = 30;
  for (let i = 0; i <= verticalLines; i++) {
    const x = (i / verticalLines) * width;
    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(vanishingX + (x - vanishingX) * 0.1, horizonY);
    ctx.stroke();
  }

  const gradient = ctx.createLinearGradient(0, horizonY - 50, 0, horizonY + 50);
  gradient.addColorStop(0, 'transparent');
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, 'transparent');

  ctx.globalAlpha = 0.15;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, horizonY - 50, width, 100);
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.04;
  ctx.lineWidth = 1;

  const gridSize = 50;
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Center line, slightly brighter.
  ctx.globalAlpha = 0.08;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
}

export function drawMarkers(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.15;
  ctx.font = '9px monospace';

  const freqMarkers = ['20Hz', '200Hz', '2kHz', '20kHz'];
  freqMarkers.forEach((label, i) => {
    const x = (i / (freqMarkers.length - 1)) * width;
    ctx.fillText(label, x + 4, 12);
  });

  const ampMarkers = ['+1', '0', '-1'];
  ampMarkers.forEach((label, i) => {
    const y = (i / (ampMarkers.length - 1)) * height;
    ctx.fillText(label, 4, y + 10);
  });
}

export function drawScanlines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.03;
  for (let y = 0; y < height; y += 3) {
    ctx.fillRect(0, y, width, 1);
  }
}

/**
 * Draws one wave layer.
 *
 * 1. Derive per-layer amplitude/opacity/frequency so stacked layers differ.
 * 2. Walk x across the canvas, summing the base wave with any ripple
 *    distortion from recent clicks.
 * 3. Optionally fill beneath the centre wave with a fading gradient.
 */
export function drawWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  centerY: number,
  layer: number,
  config: WaveConfig,
  accentColor: string,
  accentAltColor: string,
  position: WavePosition,
  timeMs: number,
  ripples: Ripple[]
): void {
  const layerOffset = layer / Math.max(config.layers, 1);
  const layerAmplitude = config.amplitude * (1 - layerOffset * 0.3);
  const layerOpacity = (config.opacity / 100) * (1 - layerOffset * 0.4);
  const layerFrequency = config.frequency * (1 + layerOffset * 0.15);
  const layerSpeed = config.speed * (1 - layerOffset * 0.15);

  // Mirrored waves sit at 20%/80% height and are damped so they read as
  // echoes of the centre wave rather than competing with it.
  const { waveY, amplitudeMultiplier } =
    position === 'top'
      ? { waveY: height * 0.2, amplitudeMultiplier: 0.6 }
      : position === 'bottom'
        ? { waveY: height * 0.8, amplitudeMultiplier: 0.6 }
        : { waveY: centerY, amplitudeMultiplier: 1 };

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, accentColor);
  gradient.addColorStop(0.5, accentAltColor);
  gradient.addColorStop(1, accentColor);

  ctx.beginPath();
  ctx.strokeStyle = gradient;
  ctx.globalAlpha = layerOpacity;
  ctx.lineWidth = 1.5 - layerOffset * 0.3;

  if (config.glow) {
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 8 - layerOffset * 3;
  } else {
    ctx.shadowBlur = 0;
  }

  const waveFunc = waveGenerators[config.waveType];
  const currentTime = Date.now();
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  for (let x = 0; x <= width; x += 2) {
    const normalizedX = x / width;
    const timeOffset = timeMs * 0.001 * layerSpeed;

    // Ripple distortion from click events. Deliberately a `let` accumulator
    // rather than a reduce — this runs once per 2px per frame, and allocating
    // a closure per pixel at 60fps is a cost with no readability payoff.
    let rippleEffect = 0;
    for (const ripple of ripples) {
      const dx = x - ripple.x / dpr;
      const dy = waveY - ripple.y / dpr;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const rippleAge = (currentTime - ripple.timestamp) / 1000;
      const rippleRadius = rippleAge * 300;
      const rippleWidth = 80;

      if (Math.abs(dist - rippleRadius) < rippleWidth) {
        const intensity =
          (1 - Math.abs(dist - rippleRadius) / rippleWidth) * ripple.opacity;
        rippleEffect += Math.sin(dist * 0.08 - rippleAge * 8) * intensity * 20;
      }
    }

    const baseWave = waveFunc(normalizedX + timeOffset, layerFrequency);
    const y =
      waveY +
      baseWave * ((layerAmplitude * height) / 100) * amplitudeMultiplier +
      rippleEffect;

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();

  // Subtle fill under the wave (only on center position).
  if (config.fillWave && position === 'center') {
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    const fillGradient = ctx.createLinearGradient(0, waveY - 100, 0, height);
    fillGradient.addColorStop(0, accentColor);
    fillGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = fillGradient;
    ctx.globalAlpha = layerOpacity * 0.08;
    ctx.shadowBlur = 0;
    ctx.fill();
  }

  ctx.shadowBlur = 0;
}

// Drops ripples older than 2s and advances the radius/opacity of the rest.
export function pruneRipples(ripples: Ripple[], dpr: number): Ripple[] {
  const currentTime = Date.now();
  return ripples.filter((ripple) => {
    const age = (currentTime - ripple.timestamp) / 1000;
    if (age > 2) return false;
    ripple.radius = age * 300 * dpr;
    ripple.opacity = 1 - age / 2;
    return true;
  });
}
