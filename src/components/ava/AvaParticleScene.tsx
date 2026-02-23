/**
 * AvaParticleScene — True Canvas 2D dot-particle portrait
 *
 * No real photo is ever visible. The face emerges from ~12–18k tiny dots:
 *
 * 1. ava-face.png is sampled pixel-by-pixel at load time
 * 2. Bright pixels → dot particles colored deep-purple → lavender → cyan
 * 3. Mouse moves right → particle field parallax-follows (same direction)
 * 4. Backlight glow moves OPPOSITE the mouse (drama / contrast)
 * 5. Canvas container gets CSS 3D tilt (±8° / ±5°) to follow the cursor
 * 6. HUD corner brackets, scanlines, data tag (Jarvis aesthetic)
 */

import React, { useRef, useEffect } from 'react';

interface AvaParticleSceneProps {
  scrollProgress: number;
  className?: string;
}

// ── Colour palette: 6 tiers, deep violet → cyan-white ───────────────────────
const TIER_COLORS = [
  'rgb(45,15,148)',    // 0 · deep violet
  'rgb(80,28,188)',    // 1 · purple
  'rgb(115,48,215)',   // 2 · medium purple
  'rgb(152,105,248)',  // 3 · lavender
  'rgb(185,160,255)',  // 4 · light lavender
  'rgb(210,235,255)',  // 5 · cyan-white
] as const;

interface Dot {
  nx: number;          // x / imgWidth  (0 … 1)
  ny: number;          // y / imgHeight (0 … 1)
  brightness: number;  // luminance 0 … 1
  tier: number;        // 0 … 5
  radius: number;      // render radius in px
}

/** Clamp + linear interpolation */
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

  // ── 1 · Load image, extract dot particles ─────────────────────────────────
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/ava-face.png';

    img.onload = () => {
      const iW = img.naturalWidth;
      const iH = img.naturalHeight;
      imgAspect.current = iW / iH;

      // Render to off-screen canvas to read pixel data
      const off  = document.createElement('canvas');
      off.width  = iW;
      off.height = iH;
      const c2   = off.getContext('2d')!;
      c2.drawImage(img, 0, 0);
      const { data } = c2.getImageData(0, 0, iW, iH);

      // Adaptive stride: target ≈ 15 k dots regardless of image resolution
      const TARGET = 15_000;
      const STRIDE = Math.max(2, Math.min(8,
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
          if (lum < 0.06) continue; // skip near-black / fully transparent

          const tier = Math.min(5, Math.floor(lum * 6));
          newTiers[tier].push({
            nx:         px / iW,
            ny:         py / iH,
            brightness: lum,
            tier,
            radius:     lerp(0.65, 1.75, lum), // dim → bright = tiny → fuller
          });
        }
      }

      tiers.current = newTiers;
      loaded.current = true;
    };
  }, []);

  // ── 2 · Canvas resize (ResizeObserver) ────────────────────────────────────
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

  // ── 3 · Mouse tracking + render loop ──────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 100;
      mouse.current.y = (e.clientY / window.innerHeight) * 100;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      // Smooth mouse (eased interpolation)
      const m = mouse.current;
      m.sx += (m.x - m.sx) * 0.055;
      m.sy += (m.y - m.sy) * 0.055;

      // ── Canvas: render particle dot field ────────────────────────────────
      const canvas = canvasRef.current;
      const ctx    = canvas?.getContext('2d');

      if (canvas && ctx) {
        const W = canvas.width;
        const H = canvas.height;

        // Black background — particles emerge from darkness
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);

        if (loaded.current) {
          // objectFit: contain, top-aligned (same as original CSS)
          const aspect  = imgAspect.current;
          const cAspect = W / H;
          let rW: number, rH: number, rX: number;

          if (aspect < cAspect) {
            // Portrait narrower than canvas → constrained by height
            rH = H;
            rW = H * aspect;
            rX = (W - rW) / 2; // horizontally centered
          } else {
            // Portrait wider → constrained by width
            rW = W;
            rH = W / aspect;
            rX = 0;
          }
          const rY = 0; // top-aligned

          // Parallax: whole dot field drifts in the same direction as cursor
          const pX = ((m.sx - 50) / 50) * 16; // ±16 px
          const pY = ((m.sy - 50) / 50) *  9; // ±9 px

          // Light source: always OPPOSITE to mouse
          const lX = (1 - m.sx / 100) * W;
          const lY = (1 - m.sy / 100) * H;
          const lR = Math.max(W, H) * 0.65;   // falloff radius

          // Batch by colour tier → only 6 fillStyle assignments per frame
          for (let ti = 0; ti < 6; ti++) {
            ctx.fillStyle = TIER_COLORS[ti];

            for (const dot of tiers.current[ti]) {
              const dx = rX + dot.nx * rW + pX;
              const dy = rY + dot.ny * rH + pY;

              // Glow: dots near the (opposite) light source are brighter
              const dist  = Math.hypot(dx - lX, dy - lY);
              const li    = Math.max(0, 1 - dist / lR);          // 0..1
              const alpha = Math.min(1,
                dot.brightness * 1.2 * (0.42 + li * 0.72)        // 0.42..1.2
              );

              ctx.globalAlpha = alpha;
              ctx.beginPath();
              ctx.arc(dx, dy, dot.radius, 0, 6.2832);
              ctx.fill();
            }
          }
          ctx.globalAlpha = 1;
        }
      }

      // ── Container: 3-D CSS tilt follows mouse ────────────────────────────
      if (containerRef.current) {
        const rotY = ((m.sx - 50) / 50) *  8;   // –8° … +8°  horizontal
        const rotX = ((m.sy - 50) / 50) * -5;   // –5° … +5°  vertical
        containerRef.current.style.transform =
          `perspective(1400px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      }

      // ── Backlight div: moves OPPOSITE mouse ──────────────────────────────
      if (lightRef.current) {
        const lx = 100 - m.sx;
        const ly = 100 - m.sy;
        lightRef.current.style.background =
          `radial-gradient(ellipse 62% 72% at ${lx}% ${ly}%,` +
          ` rgba(100,38,210,0.32) 0%,` +
          ` rgba(58,18,148,0.15) 44%,` +
          ` transparent 72%)`;
      }

      // ── Rim light: tight accent, also opposite ────────────────────────────
      if (rimRef.current) {
        const rx = 100 - m.sx * 0.70;
        const ry = 100 - m.sy * 0.70;
        rimRef.current.style.background =
          `radial-gradient(ellipse 30% 36% at ${rx}% ${ry}%,` +
          ` rgba(0,210,255,0.17) 0%,` +
          ` transparent 58%)`;
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
      {/* Ambient base — keeps portrait from being totally dark at center */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 65% at 60% 45%, rgba(70,18,170,0.10) 0%, transparent 65%)',
      }} />

      {/* Main backlight — dynamic position updated each frame (OPPOSITE mouse) */}
      <div
        ref={lightRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 62% 72% at 50% 58%, rgba(100,38,210,0.32) 0%, rgba(58,18,148,0.15) 44%, transparent 72%)',
        }}
      />

      {/* Rim light — tight accent, also opposite */}
      <div
        ref={rimRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 30% 36% at 65% 35%, rgba(0,210,255,0.17) 0%, transparent 58%)',
        }}
      />

      {/* ── Canvas container: receives CSS 3-D tilt ── */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '62%',
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

      {/* ── Scanlines — fine horizontal lines for digital-screen feel ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,200,255,0.018) 3px, rgba(0,200,255,0.018) 4px)',
      }} />

      {/* ── HUD corner brackets (Jarvis frame) ── */}
      {/* Top-right */}
      <div style={{ position: 'absolute', top: '7%', right: '3%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 20, height: 2, background: 'rgba(0,220,255,0.70)', position: 'absolute', top: 0, right: 0 }} />
        <div style={{ width: 2, height: 20, background: 'rgba(0,220,255,0.70)', position: 'absolute', top: 0, right: 0 }} />
      </div>
      {/* Bottom-right */}
      <div style={{ position: 'absolute', bottom: '7%', right: '3%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 20, height: 2, background: 'rgba(0,220,255,0.70)', position: 'absolute', bottom: 0, right: 0 }} />
        <div style={{ width: 2, height: 20, background: 'rgba(0,220,255,0.70)', position: 'absolute', bottom: 0, right: 0 }} />
      </div>
      {/* Top-left of portrait frame (canvas left edge ≈ right: 38%) */}
      <div style={{ position: 'absolute', top: '7%', right: '38%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 20, height: 2, background: 'rgba(0,220,255,0.70)', position: 'absolute', top: 0, left: 0 }} />
        <div style={{ width: 2, height: 20, background: 'rgba(0,220,255,0.70)', position: 'absolute', top: 0, left: 0 }} />
      </div>
      {/* Bottom-left of portrait frame */}
      <div style={{ position: 'absolute', bottom: '7%', right: '38%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 20, height: 2, background: 'rgba(0,220,255,0.70)', position: 'absolute', bottom: 0, left: 0 }} />
        <div style={{ width: 2, height: 20, background: 'rgba(0,220,255,0.70)', position: 'absolute', bottom: 0, left: 0 }} />
      </div>

      {/* ── HUD data tag ── */}
      <div style={{
        position: 'absolute', bottom: '6%', right: '6%', zIndex: 5,
        pointerEvents: 'none',
        fontSize: '0.6rem',
        fontFamily: 'monospace',
        letterSpacing: '0.12em',
        color: 'rgba(0,220,255,0.45)',
        textTransform: 'uppercase',
      }}>
        AI · VOICE · ACTIVE
      </div>
    </div>
  );
}
