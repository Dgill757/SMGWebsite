import React, { useEffect, useRef, useCallback } from 'react';

interface Wave {
  frequency: number;
  amplitude: number;
  speed: number;
  phase: number;
  color: string;
  lineWidth: number;
  glow: boolean;
}

const WAVES: Wave[] = [
  { frequency: 0.0025, amplitude: 90, speed: 0.55, phase: 0,    color: 'rgba(0,217,255,0.10)', lineWidth: 1.5, glow: false },
  { frequency: 0.0038, amplitude: 68, speed: 0.72, phase: 1.2,  color: 'rgba(0,217,255,0.22)', lineWidth: 1.5, glow: false },
  { frequency: 0.0052, amplitude: 50, speed: 0.92, phase: 2.5,  color: 'rgba(0,217,255,0.55)', lineWidth: 2.0, glow: true  },
  { frequency: 0.0068, amplitude: 34, speed: 1.15, phase: 0.8,  color: 'rgba(124,58,237,0.35)', lineWidth: 1.5, glow: false },
  { frequency: 0.0085, amplitude: 22, speed: 1.40, phase: 3.8,  color: 'rgba(200,180,255,0.18)', lineWidth: 1.0, glow: false },
];

export function AvaWaveform() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef(0);
  const timeRef      = useRef(0);
  const mouseRef     = useRef({ x: -999, y: -999, smoothX: -999, smoothY: -999 });
  const spikeRef     = useRef({ active: false, intensity: 0, nextAt: Date.now() + 5000 });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const drawWave = useCallback((
    ctx: CanvasRenderingContext2D,
    wave: Wave,
    w: number,
    h: number,
    t: number,
    mouseInfluence: number,
    spikeMod: number
  ) => {
    const centerY = h * 0.5;
    const amp = wave.amplitude * mouseInfluence * spikeMod;

    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const mx_ratio = mouseRef.current.smoothX / w;
      const proximity = 1 - Math.abs((x / w) - mx_ratio) * 2;
      const localAmp  = amp * (1 + Math.max(0, proximity) * 0.7);
      const y = centerY + Math.sin(x * wave.frequency + t * wave.speed + wave.phase) * localAmp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    if (wave.glow) {
      ctx.shadowBlur  = 16;
      ctx.shadowColor = '#00D9FF';
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = wave.color;
    ctx.lineWidth   = wave.lineWidth;
    ctx.stroke();
    ctx.shadowBlur  = 0;
  }, []);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = false;

    resize();
    const obs = new ResizeObserver(resize);
    obs.observe(container);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouseRef.current.x = -999; mouseRef.current.y = -999; };

    if (!reduced) {
      container.addEventListener('mousemove', onMove);
      container.addEventListener('mouseleave', onLeave);
    }

    const tick = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = container.offsetWidth;
      const h = container.offsetHeight;

      timeRef.current += 0.016;
      const t = timeRef.current;

      // Smooth mouse lerp
      mouseRef.current.smoothX += (mouseRef.current.x - mouseRef.current.smoothX) * 0.06;
      mouseRef.current.smoothY += (mouseRef.current.y - mouseRef.current.smoothY) * 0.06;

      // Breathing envelope
      const breathe = 0.82 + 0.18 * Math.sin(t * 0.45);

      // Mouse influence on amplitude
      const mouseActive = mouseRef.current.x > 0;
      const mY_ratio    = mouseActive ? mouseRef.current.smoothY / h : 0.5;
      const mouseAmp    = mouseActive ? (1 + (1 - mY_ratio) * 0.55) : 1;
      const influence   = breathe * mouseAmp;

      // Spike system (simulates "incoming call answered")
      const spike = spikeRef.current;
      let spikeMod = 1;
      if (!spike.active && Date.now() > spike.nextAt) {
        spike.active    = true;
        spike.intensity = 1;
      }
      if (spike.active) {
        spikeMod         = 1 + spike.intensity * 2.2;
        spike.intensity -= 0.045;
        if (spike.intensity <= 0) {
          spike.active = false;
          spike.nextAt = Date.now() + 5000 + Math.random() * 4000;
        }
      }

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Draw waves back to front
      WAVES.forEach(wave => drawWave(ctx, wave, w, h, t, influence, spikeMod));

      // Center hairline accent
      ctx.beginPath();
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.5);
      ctx.strokeStyle = 'rgba(0,217,255,0.07)';
      ctx.lineWidth   = 1;
      ctx.stroke();

      if (visible) rafRef.current = requestAnimationFrame(tick);
    };

    // Hero scrolls out of view on a long homepage — stop the 5-wave sine
    // computation (5 * ~600 points every frame) once it's no longer visible.
    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible;
      visible = entry.isIntersecting;
      if (visible && !wasVisible) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!visible) {
        cancelAnimationFrame(rafRef.current);
      }
    }, { rootMargin: '150px' });
    io.observe(container);

    return () => {
      obs.disconnect();
      io.disconnect();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [resize, drawWave]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'auto',
        cursor: 'crosshair',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      {/* Subtle radial glow behind the waveform center */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 70% 40% at 50% 50%,
            rgba(0,217,255,0.04) 0%,
            transparent 70%),
          radial-gradient(ellipse 40% 60% at 75% 50%,
            rgba(124,58,237,0.03) 0%,
            transparent 65%)
        `,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
