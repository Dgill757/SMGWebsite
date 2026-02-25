import React, { useEffect, useRef } from 'react';

interface Dot {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; alpha: number;
  color: string; pf: number; // parallax factor
}

const PALETTE = ['#00D9FF', '#A855FF', '#3B82F6'];

/**
 * GlobalAtmosphere — fixed full-screen layer that adds:
 * 1) A canvas of slow-drifting luminous particles (cyan/purple/blue)
 * 2) Three large blurred gradient blobs that breathe and drift
 *
 * Mounted once at app root. pointer-events: none on everything.
 * Fully respects prefers-reduced-motion.
 * Heavy effects disabled on mobile (< 768 px).
 */
const GlobalAtmosphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const rafRef    = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile  = window.innerWidth < 768;
    const COUNT   = mobile ? 16 : 52;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const dots: Dot[] = Array.from({ length: COUNT }, () => ({
      x:      Math.random() * window.innerWidth,
      y:      Math.random() * window.innerHeight,
      vx:     (Math.random() - 0.5) * 0.22,
      vy:     (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 1.1 + 0.4,
      alpha:  Math.random() * 0.048 + 0.012,
      color:  PALETTE[Math.floor(Math.random() * PALETTE.length)],
      pf:     Math.random() * 0.01 + 0.003,
    }));

    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const draw = (animate: boolean) => {
      const W  = canvas.width;
      const H  = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      ctx.clearRect(0, 0, W, H);

      for (const d of dots) {
        if (animate) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < -4) d.x = W + 4;
          else if (d.x > W + 4) d.x = -4;
          if (d.y < -4) d.y = H + 4;
          else if (d.y > H + 4) d.y = -4;
        }
        // gentle mouse parallax
        const px = d.x + (mx - 0.5) * W * d.pf;
        const py = d.y + (my - 0.5) * H * d.pf;
        ctx.beginPath();
        ctx.arc(px, py, d.radius, 0, Math.PI * 2);
        ctx.globalAlpha = d.alpha;
        ctx.fillStyle = d.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      // Static single frame only
      draw(false);
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMove);
      };
    }

    const tick = () => {
      draw(true);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 9, pointerEvents: 'none',
        }}
      />

      {/* Breathing ambient blobs */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 8, pointerEvents: 'none', overflow: 'hidden',
        }}
      >
        {/* Cyan — top-left */}
        <div style={{
          position: 'absolute', top: '8%', left: '4%',
          width: 580, height: 580, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,217,255,0.065) 0%, transparent 65%)',
          filter: 'blur(85px)',
          animation: 'atm-b1 22s ease-in-out infinite',
        }} />
        {/* Purple — top-right */}
        <div style={{
          position: 'absolute', top: '2%', right: '6%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,255,0.055) 0%, transparent 65%)',
          filter: 'blur(100px)',
          animation: 'atm-b2 28s ease-in-out infinite',
        }} />
        {/* Blue — lower-center */}
        <div style={{
          position: 'absolute', bottom: '8%', left: '44%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 65%)',
          filter: 'blur(90px)',
          animation: 'atm-b3 34s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes atm-b1 {
          0%,100% { transform: translate(0,0)   scale(1);    }
          33%      { transform: translate(65px,55px)  scale(1.08); }
          66%      { transform: translate(-28px,88px) scale(0.93); }
        }
        @keyframes atm-b2 {
          0%,100% { transform: translate(0,0)    scale(1.03); }
          40%      { transform: translate(-58px,68px)  scale(0.89); }
          70%      { transform: translate(42px,-42px)  scale(1.11); }
        }
        @keyframes atm-b3 {
          0%,100% { transform: translate(-50%,0)   scale(1);    }
          50%      { transform: translate(-50%,-72px) scale(1.07); }
        }
        @media (prefers-reduced-motion: reduce) {
          canvas[aria-hidden="true"] { display: none !important; }
          div[aria-hidden="true"] > div { animation: none !important; }
        }
      `}</style>
    </>
  );
};

export default GlobalAtmosphere;
