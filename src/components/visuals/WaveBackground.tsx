'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WaveConfig } from '@/lib/wave-config';
import {
  drawGrid,
  drawMarkers,
  drawPerspectiveGrid,
  drawScanlines,
  drawWave,
  pruneRipples,
  type Ripple,
  type WavePosition,
} from '@/lib/wave-draw';
import { WaveControls } from '@/components/visuals/WaveControls';
import { WaveControlsIcon } from '@/components/ui/icons';

interface WaveBackgroundProps {
  // Starting configuration, validated from src/config/wave-defaults.json by a
  // server component. Also what "Reset to Default" restores.
  defaults: WaveConfig;
}

export function WaveBackground({ defaults }: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const ripplesRef = useRef<Ripple[]>([]);

  const [config, setConfig] = useState<WaveConfig>(defaults);
  const [showControls, setShowControls] = useState(false);

  // Click ripples. Registered on window so a click anywhere distorts the wave.
  useEffect(() => {
    if (!config.mouseReact) return;

    const handleClick = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      ripplesRef.current.push({
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
        radius: 0,
        opacity: 1,
        timestamp: Date.now(),
      });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [config.mouseReact]);

  // Theme colors are read once per draw-callback identity (i.e. whenever config
  // changes) rather than every frame — getComputedStyle at 60Hz is expensive.
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerY = height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rootStyle = getComputedStyle(document.documentElement);
    const accentColor = rootStyle.getPropertyValue('--color-accent').trim() || '#ff6a13';
    const accentAltColor = rootStyle.getPropertyValue('--color-accent-alt').trim() || '#ffa62b';
    const mutedColor = rootStyle.getPropertyValue('--color-muted').trim() || '#989390';

    if (config.perspective) {
      drawPerspectiveGrid(ctx, width, height, mutedColor);
    }
    if (config.showGrid && !config.perspective) {
      drawGrid(ctx, width, height, mutedColor);
    }
    if (config.showGrid) {
      drawMarkers(ctx, width, height, mutedColor);
    }

    const positions: WavePosition[] = config.mirror
      ? ['center', 'top', 'bottom']
      : ['center'];

    for (const position of positions) {
      for (let layer = 0; layer < config.layers; layer++) {
        drawWave(
          ctx,
          width,
          height,
          centerY,
          layer,
          config,
          accentColor,
          accentAltColor,
          position,
          timeRef.current,
          ripplesRef.current
        );
      }
    }

    ripplesRef.current = pruneRipples(ripplesRef.current, dpr);

    if (config.scanlines) {
      drawScanlines(ctx, width, height);
    }

    ctx.globalAlpha = 1;
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    function tick(timestamp: number) {
      timeRef.current = timestamp;
      draw();
      animationRef.current = requestAnimationFrame(tick);
    }

    // Honor prefers-reduced-motion — render one static frame, no RAF loop.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      draw();
    } else {
      animationRef.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  const updateConfig = useCallback(
    <K extends keyof WaveConfig>(key: K, value: WaveConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-x-0 bottom-0 top-14 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Control panel toggle */}
      <motion.button
        type="button"
        onClick={() => setShowControls((open) => !open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={showControls}
        aria-label={showControls ? 'Hide wave controls' : 'Show wave controls'}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full bg-surface border border-border ${
          showControls ? 'text-accent' : 'text-muted'
        }`}
      >
        <WaveControlsIcon />
      </motion.button>

      <AnimatePresence>
        {showControls && (
          <WaveControls
            config={config}
            onChange={updateConfig}
            onReset={() => setConfig(defaults)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
