import React, { useEffect, useRef } from 'react';

export function VoxelDivider() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef     = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0, width = 0, height = 0, time = 0;
    const TILE      = 22;
    const MAX_H     = 42;
    const PRIMARY   = '#00D9FF';
    const WIRE      = 'rgba(0,217,255,0.18)';
    const BG        = '#050505';
    const tileW     = TILE * 0.866025;
    const tileH     = TILE * 0.5;
    const maxRSq    = 200 * 200;
    const invMH     = 1 / (MAX_H + 30);

    const r = parseInt(PRIMARY.slice(1,3),16);
    const g = parseInt(PRIMARY.slice(3,5),16);
    const b = parseInt(PRIMARY.slice(5,7),16);
    const leftColor  = `rgba(${Math.floor(r*.42)},${Math.floor(g*.42)},${Math.floor(b*.42)},0.85)`;
    const rightColor = `rgba(${Math.floor(r*.62)},${Math.floor(g*.62)},${Math.floor(b*.62)},0.85)`;

    const lut: string[] = Array(101).fill('').map((_,i) => {
      const rt = i/100;
      return `rgb(${Math.floor(r*(0.5+rt*0.5))},${Math.floor(g*(0.5+rt*0.5))},${Math.floor(b*(0.5+rt*0.5))})`;
    });

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio||1,2);
      width  = container.clientWidth;
      height = container.clientHeight;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr,dpr);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    handleResize();

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };
    const onLeave = () => { mouseRef.current.targetX = -1000; mouseRef.current.targetY = -1000; };
    window.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });

    const draw = () => {
      time += reduced ? 0 : 0.012;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.28;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.28;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width  / tileW) + 4;
      const rows = Math.ceil(height / tileH) + 8;
      const ox = width * 0.5;
      const oy = height * 0.42;
      const sR = -Math.floor(rows/2);
      const eR =  Math.ceil(rows/2);
      const sC = -Math.floor(cols/2);
      const eC =  Math.ceil(cols/2);

      for (let row = sR; row < eR; row++) {
        for (let col = sC; col < eC; col++) {
          const ix = ox + (col - row) * tileW;
          const iy = oy + (col + row) * tileH;
          const dx = ix - mx, dy = iy - my;
          const dSq = dx*dx + dy*dy;
          const w1  = Math.sin(time*2 + col*0.28 + row*0.28);
          const w2  = Math.cos(time*1.4 + col*0.18 - row*0.32);
          let   h   = (w1+w2+2)*0.25*MAX_H;
          if (dSq < maxRSq) { const inf = 1-Math.sqrt(dSq)/200; h += inf*inf*30; }
          const py = iy - h;
          if (ix+tileW<0||ix-tileW>width||py+h+12<0||py-tileH>height) continue;
          const bot = h+12;
          ctx.beginPath();
          ctx.moveTo(ix-tileW,py); ctx.lineTo(ix,py+tileH);
          ctx.lineTo(ix,py+tileH+bot); ctx.lineTo(ix-tileW,py+bot);
          ctx.closePath(); ctx.fillStyle=leftColor; ctx.fill();
          ctx.beginPath();
          ctx.moveTo(ix,py+tileH); ctx.lineTo(ix+tileW,py);
          ctx.lineTo(ix+tileW,py+bot); ctx.lineTo(ix,py+tileH+bot);
          ctx.closePath(); ctx.fillStyle=rightColor; ctx.fill();
          ctx.beginPath();
          ctx.moveTo(ix,py-tileH); ctx.lineTo(ix+tileW,py);
          ctx.lineTo(ix,py+tileH); ctx.lineTo(ix-tileW,py);
          ctx.closePath();
          const lv = Math.min(1,Math.max(0.1,h*invMH));
          ctx.fillStyle = lut[(lv*100)|0]; ctx.fill();
          ctx.strokeStyle=WIRE; ctx.lineWidth=0.55; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      height: 'clamp(160px, 22vh, 260px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top fade */}
      <div style={{
        position:'absolute',top:0,left:0,right:0,
        height:'40%',
        background:'linear-gradient(to bottom,#050505,transparent)',
        zIndex:2,pointerEvents:'none',
      }}/>
      {/* Bottom fade */}
      <div style={{
        position:'absolute',bottom:0,left:0,right:0,
        height:'40%',
        background:'linear-gradient(to top,#050505,transparent)',
        zIndex:2,pointerEvents:'none',
      }}/>
      <div ref={containerRef} style={{ width:'100%', height:'100%' }}>
        <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'100%' }}/>
      </div>
    </div>
  );
}
