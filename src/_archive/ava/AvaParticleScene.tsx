/**
 * AvaParticleScene v4
 *
 * Fixes in this version:
 *  ✓ Canvas covers the FULL hero section (inset:0) — no solid edge/line
 *  ✓ Ava is centred at ~55 % of viewport width, full-height
 *  ✓ Cyan colour palette  (near-black navy → deep cyan → white-cyan)
 *  ✓ Entrance animation   dots scatter from random positions → assemble
 *  ✓ Sparkle              every dot oscillates at its own phase + speed
 *  ✓ Light behind her     canvas bloom pass + CSS glow div (both cyan)
 *  ✓ 3-D tilt             ±12 ° / ±7 °  perspective(900px)  follows cursor
 *  ✓ Breathing            very subtle scale pulse (makes her feel alive)
 *  ✓ HUD brackets         drawn on the canvas → always track figure exactly
 */

import React, { useRef, useEffect } from 'react';

interface AvaParticleSceneProps {
  scrollProgress: number;
  className?: string;
}

// ── Six colour tiers: near-black navy → white-cyan ────────────────────────────
const TIER_COLORS = [
  'rgb(0,14,32)',        // 0 · near-black navy         — deepest shadows
  'rgb(0,58,100)',       // 1 · dark navy-cyan
  'rgb(0,122,168)',      // 2 · medium cyan-blue
  'rgb(0,190,222)',      // 3 · vivid cyan
  'rgb(80,230,255)',     // 4 · bright cyan
  'rgb(205,248,255)',    // 5 · near-white cyan          — brightest highlights
] as const;

interface Dot {
  nx: number;            // x / imgWidth   0…1
  ny: number;            // y / imgHeight  0…1
  brightness: number;    // perceived luminance × alpha  0…1
  tier: number;          // 0…5
  radius: number;        // px
  sparklePhase: number;  // 0…2π
  sparkleSpeed: number;  // rad · s⁻¹
  scatterX: number;      // entrance offset px (x)
  scatterY: number;      // entrance offset px (y)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

// Smooth cubic easing (ease-in-out)
function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

const REVEAL_DURATION = 2.6; // seconds for full assembly

export default function AvaParticleScene({ className }: AvaParticleSceneProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);   // CSS glow overlay

  const mouse       = useRef({ x: 50, y: 48, sx: 50, sy: 48 });
  const raf         = useRef<number>(0);
  const tiers       = useRef<Dot[][]>(Array.from({ length: 6 }, () => []));
  const imgAspect   = useRef<number>(0.72);
  const loaded      = useRef(false);
  const revealStart = useRef<number | null>(null);

  // ── 1 · Load image → extract dot particles ──────────────────────────────
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

      // Adaptive stride → target ~28 k dots
      const STRIDE = Math.max(2, Math.min(6,
        Math.ceil(Math.sqrt((iW * iH) / 28_000))
      ));

      const newTiers: Dot[][] = Array.from({ length: 6 }, () => []);

      for (let py = 0; py < iH; py += STRIDE) {
        for (let px = 0; px < iW; px += STRIDE) {
          const i  = (py * iW + px) * 4;
          const nr = data[i]     / 255;
          const ng = data[i + 1] / 255;
          const nb = data[i + 2] / 255;
          const na = data[i + 3] / 255;

          const lum = (nr * 0.299 + ng * 0.587 + nb * 0.114) * na;
          if (lum < 0.028) continue; // discard background

          const tier = Math.min(5, Math.floor(lum * 6));

          // Scatter: dots start spread in all directions from their final pos
          const angle = Math.random() * Math.PI * 2;
          const dist  = 200 + Math.random() * 400;

          newTiers[tier].push({
            nx:           px / iW,
            ny:           py / iH,
            brightness:   lum,
            tier,
            radius:       lerp(0.42, 1.35, lum),
            sparklePhase: Math.random() * Math.PI * 2,
            sparkleSpeed: 0.7 + Math.random() * 2.6,
            scatterX:     Math.cos(angle) * dist,
            scatterY:     Math.sin(angle) * dist - 80, // slight upward bias
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

  // ── 3 · Mouse tracking + render loop ────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 100;
      mouse.current.y = (e.clientY / window.innerHeight) * 100;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      const m = mouse.current;
      m.sx += (m.x - m.sx) * 0.055;
      m.sy += (m.y - m.sy) * 0.055;

      const now = performance.now() * 0.001; // seconds

      // Start the reveal clock the first frame dots are ready
      if (loaded.current && revealStart.current === null) {
        revealStart.current = now;
      }

      const rawReveal = revealStart.current !== null
        ? Math.min(1, (now - revealStart.current) / REVEAL_DURATION)
        : 0;
      const reveal  = smoothstep(rawReveal);   // 0 → 1  (eased)
      const scatter = 1 - reveal;              // scatter: 1 → 0

      // Breathing: very slow subtle pulse
      const breathe = 1 + 0.010 * Math.sin(now * 0.38);

      // ── Canvas render ─────────────────────────────────────────────────
      const canvas = canvasRef.current;
      const ctx    = canvas?.getContext('2d');

      if (canvas && ctx) {
        const W = canvas.width;
        const H = canvas.height;

        // Pure black background — particles emerge from darkness
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);

        if (loaded.current) {
          // ── Place Ava: centred at 55 % of viewport, fill height ────────
          const aspect = imgAspect.current;
          let rH = H * 0.96;
          let rW = rH * aspect;

          // Cap width at 58 % of viewport so she doesn't crowd the text
          if (rW > W * 0.58) {
            rW = W * 0.58;
            rH = rW / aspect;
          }

          // Centre-X at 55 %, centre-Y at 50 %
          const rX = W * 0.55 - rW / 2;
          const rY = (H - rH) / 2;

          // Parallax: dot field drifts with the cursor
          const pX = ((m.sx - 50) / 50) * 20;
          const pY = ((m.sy - 50) / 50) * 12;

          // Light source: OPPOSITE the mouse
          const lX = (1 - m.sx / 100) * W;
          const lY = (1 - m.sy / 100) * H;
          const lR = Math.max(W, H) * 0.62;

          // ── Draw dots batched by tier (6 fillStyle changes per frame) ──
          for (let ti = 0; ti < 6; ti++) {
            ctx.fillStyle = TIER_COLORS[ti];

            for (const dot of tiers.current[ti]) {
              // Final position (with breathing scale from centre)
              const finalX = rX + rW * 0.5 + (dot.nx - 0.5) * rW * breathe;
              const finalY = rY + rH * 0.5 + (dot.ny - 0.5) * rH * breathe;

              // During entrance: dots scatter quadratically away
              const dx = finalX + dot.scatterX * scatter * scatter + pX;
              const dy = finalY + dot.scatterY * scatter * scatter + pY;

              // Glow from opposite-mouse light
              const dist = Math.hypot(dx - lX, dy - lY);
              const li   = Math.max(0, 1 - dist / lR);

              // Sparkle: every dot pulses at its own frequency
              const sparkle = 0.70 + 0.30 * Math.sin(
                now * dot.sparkleSpeed + dot.sparklePhase
              );

              const alpha = Math.min(1,
                dot.brightness * 1.35 * (0.32 + li * 0.85) * sparkle * reveal
              );

              ctx.globalAlpha = alpha;
              ctx.beginPath();
              ctx.arc(dx, dy, dot.radius, 0, 6.2832);
              ctx.fill();
            }
          }
          ctx.globalAlpha = 1;

          // ── Bloom pass: soft cyan halo, tracks opposite-mouse ─────────
          const bloomCX = lerp(rX + rW * 0.5, lX, 0.30); // 30 % toward light
          const bloomCY = lerp(rY + rH * 0.38, lY, 0.25);
          const bloomR  = rW * 0.72;
          const bloom   = ctx.createRadialGradient(
            bloomCX, bloomCY, 0,
            bloomCX, bloomCY, bloomR,
          );
          const ba = (0.18 * reveal).toFixed(3);
          const bb = (0.08 * reveal).toFixed(3);
          bloom.addColorStop(0,   `rgba(0,210,255,${ba})`);
          bloom.addColorStop(0.4, `rgba(0,150,200,${bb})`);
          bloom.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = bloom;
          ctx.fillRect(0, 0, W, H);

          // ── HUD corner brackets — drawn on canvas, track figure ────────
          if (reveal > 0.55) {
            const hudA   = Math.min(1, (reveal - 0.55) / 0.30); // fade-in
            const B      = 26;     // bracket arm length px
            const inset  = rW * 0.015;

            ctx.save();
            ctx.globalAlpha = hudA * 0.80;
            ctx.strokeStyle = 'rgba(0,215,255,1)';
            ctx.lineWidth   = 2;
            ctx.lineCap     = 'square';

            const x0 = rX + inset;
            const y0 = rY + inset;
            const x1 = rX + rW - inset;
            const y1 = rY + rH - inset;

            // Top-left
            ctx.beginPath();
            ctx.moveTo(x0, y0 + B); ctx.lineTo(x0, y0); ctx.lineTo(x0 + B, y0);
            ctx.stroke();
            // Top-right
            ctx.beginPath();
            ctx.moveTo(x1 - B, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + B);
            ctx.stroke();
            // Bottom-left
            ctx.beginPath();
            ctx.moveTo(x0, y1 - B); ctx.lineTo(x0, y1); ctx.lineTo(x0 + B, y1);
            ctx.stroke();
            // Bottom-right
            ctx.beginPath();
            ctx.moveTo(x1 - B, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - B);
            ctx.stroke();

            // Data tag
            ctx.globalAlpha = hudA * 0.55;
            ctx.fillStyle   = 'rgba(0,215,255,1)';
            ctx.font        = '11px monospace';
            ctx.fillText('AI · VOICE · ACTIVE', x1 - 132, y1 - 10);

            ctx.restore();
          }
        }
      }

      // ── CSS 3-D tilt: canvas container follows the cursor ─────────────
      if (containerRef.current) {
        const rotY = ((m.sx - 50) / 50) * 12;   // –12 ° … +12 °
        const rotX = ((m.sy - 50) / 50) * -7;   //  –7 ° … +7 °
        containerRef.current.style.transform =
          `perspective(900px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      }

      // ── CSS glow div: opposite-mouse, sits above canvas ───────────────
      if (glowRef.current) {
        const lx = 100 - m.sx;
        const ly = 100 - m.sy;
        glowRef.current.style.background =
          `radial-gradient(ellipse 68% 78% at ${lx}% ${ly}%,` +
          ` rgba(0,180,230,0.18) 0%,` +
          ` rgba(0,100,170,0.08) 46%,` +
          ` transparent 72%)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {/* ── Canvas container: FULL section, gets 3-D tilt ── */}
      {/*    Full width eliminates the seam/line at the canvas edge     */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          inset: 0,                      // ← covers the entire hero section
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      </div>

      {/* ── CSS glow overlay — above canvas, semi-transparent ── */}
      {/*    Adds extra luminosity around the opposite-mouse area    */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 68% 78% at 50% 50%, rgba(0,180,230,0.18) 0%, rgba(0,100,170,0.08) 46%, transparent 72%)',
        }}
      />

      {/* ── Scanlines — very faint horizontal lines for screen texture ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        backgroundImage:
          'repeating-linear-gradient(0deg,' +
          ' transparent 0px, transparent 3px,' +
          ' rgba(0,200,255,0.015) 3px, rgba(0,200,255,0.015) 4px)',
      }} />
    </div>
  );
}
