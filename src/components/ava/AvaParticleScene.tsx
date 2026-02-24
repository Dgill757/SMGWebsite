/**
 * AvaParticleScene v3 — Epiminds-quality dot-particle portrait
 *
 * What this renders (no real photo ever visible):
 *  · ava-face.png sampled pixel-by-pixel → ~25k tiny dot particles
 *  · 6-tier deep-violet → lavender → white-pink colour palette
 *  · Each dot twinkles at its own phase/speed (sparkle effect)
 *  · Mouse → particle field parallax-drifts in the same direction
 *  · Mouse → 3-D CSS tilt (±8°/±5°) on the canvas container
 *  · Backlight glow (CSS div) moves OPPOSITE the mouse every frame
 *  · Post-render bloom pass: radial gradient overlay on canvas
 *  · Jarvis HUD: scanlines, L-bracket corners, "AI · VOICE · ACTIVE"
 */

import React, { useRef, useEffect } from 'react';

interface AvaParticleSceneProps {
  scrollProgress: number;
  className?: string;
}

// ── Colour tiers: deep near-black violet → near-white lavender-pink ──────────
const TIER_COLORS = [
  'rgb(20,7,62)',        // 0 · near-black deep violet  (heaviest shadows)
  'rgb(50,20,122)',      // 1 · dark purple
  'rgb(86,40,192)',      // 2 · medium purple
  'rgb(128,82,238)',     // 3 · purple-lavender
  'rgb(174,140,255)',    // 4 · lavender
  'rgb(224,208,255)',    // 5 · near-white lavender-pink (brightest highlights)
] as const;

interface Dot {
  nx: number;            // x / imgWidth   (0 … 1)
  ny: number;            // y / imgHeight  (0 … 1)
  brightness: number;    // perceived luminance × alpha  (0 … 1)
  tier: number;          // 0 … 5
  radius: number;        // render radius in pixels
  sparklePhase: number;  // random offset  (0 … 2π)
  sparkleSpeed: number;  // oscillation speed  (rad · s⁻¹)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export default function AvaParticleScene({ className }: AvaParticleSceneProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lightRef     = useRef<HTMLDivElement>(null);
  const rimRef       = useRef<HTMLDivElement>(null);

  const mouse     = useRef({ x: 50, y: 42, sx: 50, sy: 42 });
  const raf       = useRef<number>(0);
  const tiers     = useRef<Dot[][]>(Array.from({ length: 6 }, () => []));
  const imgAspect = useRef<number>(0.72); // sensible portrait fallback
  const loaded    = useRef(false);

  // ── 1 · Load image → extract dot particles ───────────────────────────────
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/ava-face.png';

    img.onload = () => {
      const iW = img.naturalWidth;
      const iH = img.naturalHeight;
      imgAspect.current = iW / iH;

      const off  = document.createElement('canvas');
      off.width  = iW;
      off.height = iH;
      const c2   = off.getContext('2d')!;
      c2.drawImage(img, 0, 0);
      const { data } = c2.getImageData(0, 0, iW, iH);

      // Adaptive stride → target ~25 k dots regardless of image size
      const TARGET = 25_000;
      const STRIDE = Math.max(2, Math.min(6,
        Math.ceil(Math.sqrt((iW * iH) / TARGET))
      ));

      const newTiers: Dot[][] = Array.from({ length: 6 }, () => []);

      for (let py = 0; py < iH; py += STRIDE) {
        for (let px = 0; px < iW; px += STRIDE) {
          const i  = (py * iW + px) * 4;
          const nr = data[i]     / 255;
          const ng = data[i + 1] / 255;
          const nb = data[i + 2] / 255;
          const na = data[i + 3] / 255;

          // Perceived luminance × alpha
          const lum = (nr * 0.299 + ng * 0.587 + nb * 0.114) * na;

          // Low threshold — capture shadow detail (dark purple dots visible)
          if (lum < 0.030) continue;

          const tier = Math.min(5, Math.floor(lum * 6));
          newTiers[tier].push({
            nx:           px / iW,
            ny:           py / iH,
            brightness:   lum,
            tier,
            radius:       lerp(0.40, 1.25, lum),  // tiny dark → fuller bright
            sparklePhase: Math.random() * Math.PI * 2,
            sparkleSpeed: 0.8 + Math.random() * 2.4,
          });
        }
      }

      tiers.current = newTiers;
      loaded.current = true;
    };
  }, []);

  // ── 2 · Canvas resize via ResizeObserver ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      const { width, height } = p.getBoundingClientRect();
      canvas.width  = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  // ── 3 · Mouse tracking + 60 fps render loop ─────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 100;
      mouse.current.y = (e.clientY / window.innerHeight) * 100;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      // Smooth / eased mouse position
      const m = mouse.current;
      m.sx += (m.x - m.sx) * 0.055;
      m.sy += (m.y - m.sy) * 0.055;

      const now = performance.now() * 0.001; // seconds

      // ── Canvas particle render ───────────────────────────────────────────
      const canvas = canvasRef.current;
      const ctx    = canvas?.getContext('2d');

      if (canvas && ctx) {
        const W = canvas.width;
        const H = canvas.height;

        // Black background — particles emerge from darkness
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);

        if (loaded.current) {
          // objectFit: contain  objectPosition: top  (same behaviour as CSS)
          const aspect  = imgAspect.current;
          const cAspect = W / H;
          let rW: number, rH: number, rX: number;

          if (aspect < cAspect) {
            rH = H;
            rW = H * aspect;
            rX = (W - rW) / 2;   // center within canvas
          } else {
            rW = W;
            rH = W / aspect;
            rX = 0;
          }
          const rY = 0;

          // Parallax: dots drift in the SAME direction as the cursor
          const pX = ((m.sx - 50) / 50) * 18;   // ±18 px
          const pY = ((m.sy - 50) / 50) * 10;   // ±10 px

          // Light source: always OPPOSITE the mouse
          const lX = (1 - m.sx / 100) * W;
          const lY = (1 - m.sy / 100) * H;
          const lR = Math.max(W, H) * 0.60;    // falloff radius

          // ── Draw all dot tiers (only 6 fillStyle changes per frame) ──
          for (let ti = 0; ti < 6; ti++) {
            ctx.fillStyle = TIER_COLORS[ti];

            for (const dot of tiers.current[ti]) {
              const dx = rX + dot.nx * rW + pX;
              const dy = rY + dot.ny * rH + pY;

              // Radial glow from opposite-mouse light
              const dist = Math.hypot(dx - lX, dy - lY);
              const li   = Math.max(0, 1 - dist / lR);  // 0 … 1

              // Sparkle: each dot pulses at its own frequency
              const sparkle = 0.72 + 0.28 * Math.sin(
                now * dot.sparkleSpeed + dot.sparklePhase
              );

              const alpha = Math.min(1,
                dot.brightness * 1.30 * (0.35 + li * 0.82) * sparkle
              );

              ctx.globalAlpha = alpha;
              ctx.beginPath();
              ctx.arc(dx, dy, dot.radius, 0, 6.2832);
              ctx.fill();
            }
          }
          ctx.globalAlpha = 1;

          // ── Bloom post-pass: single radial gradient overlay ──────────
          // Creates the soft luminous halo that looks like light behind her
          const bloomCX = lX;
          const bloomCY = lY * 0.55 + rY + rH * 0.35; // bias toward face center
          const bloomR  = rW * 0.62;
          const bloom   = ctx.createRadialGradient(
            bloomCX, bloomCY, 0,
            bloomCX, bloomCY, bloomR,
          );
          bloom.addColorStop(0,   'rgba(195,130,255,0.14)');
          bloom.addColorStop(0.35,'rgba(120, 60,220,0.07)');
          bloom.addColorStop(1,   'rgba(  0,  0,  0,0.00)');
          ctx.fillStyle = bloom;
          ctx.fillRect(0, 0, W, H);
        }
      }

      // ── CSS 3-D tilt: canvas container follows the cursor ────────────────
      if (containerRef.current) {
        const rotY = ((m.sx - 50) / 50) *  8;   // –8° … +8°
        const rotX = ((m.sy - 50) / 50) * -5;   // –5° … +5°
        containerRef.current.style.transform =
          `perspective(1400px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      }

      // ── Backlight CSS div: moves OPPOSITE mouse ───────────────────────────
      if (lightRef.current) {
        const lx = 100 - m.sx;
        const ly = 100 - m.sy;
        lightRef.current.style.background =
          `radial-gradient(ellipse 65% 75% at ${lx}% ${ly}%,` +
          ` rgba(128,48,228,0.30) 0%,` +
          ` rgba(72,20,158,0.13) 42%,` +
          ` transparent 70%)`;
      }

      // ── Rim light: tight cyan accent, also opposite ───────────────────────
      if (rimRef.current) {
        const rx = 100 - m.sx * 0.65;
        const ry = 100 - m.sy * 0.65;
        rimRef.current.style.background =
          `radial-gradient(ellipse 28% 33% at ${rx}% ${ry}%,` +
          ` rgba(10,195,255,0.15) 0%,` +
          ` transparent 56%)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {/* Ambient base glow */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 65% at 62% 44%, rgba(82,22,185,0.11) 0%, transparent 65%)',
      }} />

      {/* Main backlight — updated each frame to opposite-mouse position */}
      <div
        ref={lightRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 65% 75% at 50% 55%, rgba(128,48,228,0.30) 0%, rgba(72,20,158,0.13) 42%, transparent 70%)',
        }}
      />

      {/* Rim light — tight cyan accent, also opposite */}
      <div
        ref={rimRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 28% 33% at 65% 32%, rgba(10,195,255,0.15) 0%, transparent 56%)',
        }}
      />

      {/* ── Canvas container: right-aligned, receives CSS 3-D tilt ── */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '65%',
          height: '100%',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      </div>

      {/* ── Scanlines — fine horizontal lines for digital-screen texture ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent 0px, transparent 3px,' +
          ' rgba(180,140,255,0.016) 3px, rgba(180,140,255,0.016) 4px)',
      }} />

      {/* ── HUD corner brackets (Jarvis / Iron-Man interface) ── */}
      {/* Top-right */}
      <div style={{ position: 'absolute', top: '7%', right: '3%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 22, height: 2, background: 'rgba(0,215,255,0.72)', position: 'absolute', top: 0, right: 0 }} />
        <div style={{ width: 2, height: 22, background: 'rgba(0,215,255,0.72)', position: 'absolute', top: 0, right: 0 }} />
      </div>
      {/* Bottom-right */}
      <div style={{ position: 'absolute', bottom: '7%', right: '3%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 22, height: 2, background: 'rgba(0,215,255,0.72)', position: 'absolute', bottom: 0, right: 0 }} />
        <div style={{ width: 2, height: 22, background: 'rgba(0,215,255,0.72)', position: 'absolute', bottom: 0, right: 0 }} />
      </div>
      {/* Top-left of portrait (canvas left edge ≈ right: 35%) */}
      <div style={{ position: 'absolute', top: '7%', right: '35%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 22, height: 2, background: 'rgba(0,215,255,0.72)', position: 'absolute', top: 0, left: 0 }} />
        <div style={{ width: 2, height: 22, background: 'rgba(0,215,255,0.72)', position: 'absolute', top: 0, left: 0 }} />
      </div>
      {/* Bottom-left of portrait */}
      <div style={{ position: 'absolute', bottom: '7%', right: '35%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 22, height: 2, background: 'rgba(0,215,255,0.72)', position: 'absolute', bottom: 0, left: 0 }} />
        <div style={{ width: 2, height: 22, background: 'rgba(0,215,255,0.72)', position: 'absolute', bottom: 0, left: 0 }} />
      </div>

      {/* ── HUD data tag ── */}
      <div style={{
        position: 'absolute', bottom: '6%', right: '6%', zIndex: 5,
        pointerEvents: 'none',
        fontSize: '0.6rem',
        fontFamily: 'monospace',
        letterSpacing: '0.12em',
        color: 'rgba(0,215,255,0.48)',
        textTransform: 'uppercase',
      }}>
        AI · VOICE · ACTIVE
      </div>
    </div>
  );
}
