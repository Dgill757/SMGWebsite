/**
 * Ava — Canvas-based particle portrait
 *
 * How it works:
 * 1. ava-face.png is sampled pixel-by-pixel at load time on an offscreen canvas.
 *    Every pixel above a brightness threshold becomes a dot with a stored position
 *    and brightness value.
 * 2. Each animation frame: dots are drawn on a main canvas as tiny filled circles.
 * 3. A "backlight" glow position is always opposite the mouse cursor.
 *    Dots close to the backlight glow brighter and shift toward cyan/white.
 *    Dots far from it fall back to deep purple/lavender.
 * 4. The entire dot field translates slightly *toward* the mouse (parallax drift).
 * 5. HUD chrome (corner brackets, scanlines, data tag) sits as HTML on top.
 */

import React, { useRef, useEffect } from 'react';

interface Dot {
  /** Normalized 0–1 within the sampled image */
  x: number;
  y: number;
  /** Luminance from original pixel, 0–1 */
  brightness: number;
  /** Base dot radius in px (screen-space, adjusted by canvas scale later) */
  r: number;
}

interface SceneState {
  dots: Dot[];
  loaded: boolean;
  imgW: number; // natural image width (for aspect ratio)
  imgH: number; // natural image height
  W: number;    // canvas pixel width
  H: number;    // canvas pixel height
}

interface AvaParticleSceneProps {
  scrollProgress?: number;
  className?: string;
}

export default function AvaParticleScene({ className }: AvaParticleSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const mouse        = useRef({ x: 50, y: 42, sx: 50, sy: 42 });
  const raf          = useRef<number>(0);
  const scene        = useRef<SceneState>({
    dots: [], loaded: false, imgW: 1, imgH: 1, W: 0, H: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    // ── Resize: keep canvas pixel dimensions in sync with layout ─────────
    const syncSize = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      canvas.width  = W;
      canvas.height = H;
      scene.current.W = W;
      scene.current.H = H;
    };
    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(container);

    // ── Sample ava-face.png into dot positions ────────────────────────────
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/ava-face.png';
    img.onload = () => {
      const { naturalWidth: iw, naturalHeight: ih } = img;
      scene.current.imgW = iw;
      scene.current.imgH = ih;

      // Sample at reduced resolution so we end up with ~6 000–12 000 dots
      const SAMPLE_W = 120;
      const SAMPLE_H = Math.round(SAMPLE_W * ih / iw);

      const off  = document.createElement('canvas');
      off.width  = SAMPLE_W;
      off.height = SAMPLE_H;
      const octx = off.getContext('2d')!;
      octx.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
      const data = octx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;

      const collected: Dot[] = [];
      for (let py = 0; py < SAMPLE_H; py++) {
        for (let px = 0; px < SAMPLE_W; px++) {
          const i = (py * SAMPLE_W + px) * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 25) continue;                                    // transparent → skip
          const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          if (lum < 0.07) continue;                               // near-black bg → skip
          collected.push({
            x:          px / SAMPLE_W,
            y:          py / SAMPLE_H,
            brightness: lum,
            r:          0.65 + lum * 0.85,  // 0.65–1.5 px base radius
          });
        }
      }
      scene.current.dots   = collected;
      scene.current.loaded = true;
    };

    // ── Mouse tracking ────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 100;
      mouse.current.y = (e.clientY / window.innerHeight) * 100;
    };
    window.addEventListener('mousemove', onMove);

    // ── Render loop ───────────────────────────────────────────────────────
    const tick = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) { raf.current = requestAnimationFrame(tick); return; }

      const { loaded, dots, imgW, imgH, W, H } = scene.current;
      const m = mouse.current;

      // Smooth mouse
      m.sx += (m.x - m.sx) * 0.05;
      m.sy += (m.y - m.sy) * 0.05;

      ctx.clearRect(0, 0, W, H);

      if (!loaded || W === 0 || H === 0) {
        raf.current = requestAnimationFrame(tick);
        return;
      }

      // ── Compute render area: right 62% of canvas, objectFit:contain, align top ──
      const fieldLeft = W * 0.30;
      const fieldW    = W * 0.70;
      const fieldH    = H;

      // Contain image aspect ratio within field
      const imgAspect   = imgW / imgH;
      const fieldAspect = fieldW / fieldH;
      let rX: number, rY: number, rW: number, rH: number;
      if (imgAspect < fieldAspect) {
        // portrait-style: fit by height
        rH = fieldH;
        rW = fieldH * imgAspect;
        rX = fieldLeft + (fieldW - rW) / 2; // center horizontally
        rY = 0;
      } else {
        // landscape-style: fit by width
        rW = fieldW;
        rH = fieldW / imgAspect;
        rX = fieldLeft;
        rY = 0; // align top
      }

      // Backlight position — always OPPOSITE the mouse
      const lx = (1 - m.sx / 100) * W;
      const ly = (1 - m.sy / 100) * H;
      const maxDist = Math.sqrt(W * W + H * H);

      // Parallax drift — dots drift slightly TOWARD the mouse
      const offX = ((m.sx - 50) / 50) * 16;
      const offY = ((m.sy - 50) / 50) * 10;

      // ── Draw every dot ────────────────────────────────────────────────
      for (const dot of dots) {
        const sx = rX + dot.x * rW + offX;
        const sy = rY + dot.y * rH + offY;

        // Distance from backlight (0 = far, 1 = right at the light source)
        const ddx  = sx - lx;
        const ddy  = sy - ly;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        const lf   = Math.max(0, 1 - dist / (maxDist * 0.65)); // light factor 0–1

        // Color: deep purple (base) → lavender (bright) → cyan-white (near backlight)
        // Base purple:  rgb(110, 70, 210)
        // Mid lavender: rgb(165, 130, 245)
        // Glow cyan:    rgb(80, 210, 255)
        const b = dot.brightness;

        // Step 1: lerp purple → lavender by brightness
        const pr = Math.round(110 + (165 - 110) * b);
        const pg = Math.round(70  + (130 - 70)  * b);
        const pb = Math.round(210 + (245 - 210) * b);

        // Step 2: lerp toward cyan-white by light factor
        const t  = Math.min(1, lf * 1.8);
        const cr = Math.round(pr + (80  - pr) * t);
        const cg = Math.round(pg + (210 - pg) * t);
        const cb = Math.round(pb + (255 - pb) * t);

        // Alpha: base brightness + light boost
        const ca = Math.min(1, b * 1.15 + lf * 0.55);

        // Radius: grow near backlight
        const radius = dot.r * (1 + lf * 1.4);

        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${ca.toFixed(2)})`;
        ctx.fill();
      }

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, []);

  // ── HUD chrome colour ─────────────────────────────────────────────────
  const hud = 'rgba(0,220,255,0.70)';

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {/* Main particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* ── Scanlines — digital screen texture ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent 0px, transparent 3px,' +
          ' rgba(0,200,255,0.018) 3px, rgba(0,200,255,0.018) 4px)',
      }} />

      {/* ── HUD corner brackets ── */}
      {/* Top-right */}
      <div style={{ position: 'absolute', top: '7%', right: '3%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 22, height: 2, background: hud, position: 'absolute', top: 0, right: 0 }} />
        <div style={{ width: 2, height: 22, background: hud, position: 'absolute', top: 0, right: 0 }} />
      </div>
      {/* Bottom-right */}
      <div style={{ position: 'absolute', bottom: '7%', right: '3%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 22, height: 2, background: hud, position: 'absolute', bottom: 0, right: 0 }} />
        <div style={{ width: 2, height: 22, background: hud, position: 'absolute', bottom: 0, right: 0 }} />
      </div>
      {/* Top-left of portrait frame */}
      <div style={{ position: 'absolute', top: '7%', right: '38%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 22, height: 2, background: hud, position: 'absolute', top: 0, left: 0 }} />
        <div style={{ width: 2, height: 22, background: hud, position: 'absolute', top: 0, left: 0 }} />
      </div>
      {/* Bottom-left of portrait frame */}
      <div style={{ position: 'absolute', bottom: '7%', right: '38%', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ width: 22, height: 2, background: hud, position: 'absolute', bottom: 0, left: 0 }} />
        <div style={{ width: 2, height: 22, background: hud, position: 'absolute', bottom: 0, left: 0 }} />
      </div>

      {/* ── HUD data tag ── */}
      <div style={{
        position: 'absolute', bottom: '6%', right: '6%', zIndex: 5,
        pointerEvents: 'none', fontSize: '0.6rem', fontFamily: 'monospace',
        letterSpacing: '0.14em', color: 'rgba(0,220,255,0.45)', textTransform: 'uppercase',
      }}>
        AI · VOICE · ACTIVE
      </div>
    </div>
  );
}
