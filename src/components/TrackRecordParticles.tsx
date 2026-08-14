import React, { useEffect, useRef } from 'react';

export function TrackRecordParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const mouse = { x: -999, y: -999 };

    class Particle {
      x: number; y: number;
      dx: number; dy: number;
      size: number;
      constructor() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.dx = (Math.random() - 0.5) * 0.35;
        this.dy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 1.8 + 0.6;
      }
      update() {
        if (this.x > canvas.width || this.x < 0)  this.dx *= -1;
        if (this.y > canvas.height || this.y < 0) this.dy *= -1;
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          const f = (120-dist)/120;
          this.x -= dx/dist*f*3.5;
          this.y -= dy/dist*f*3.5;
        }
        this.x += this.dx; this.y += this.dy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(0,217,255,0.55)';
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width  = canvas.parentElement?.offsetWidth  || 800;
      canvas.height = canvas.parentElement?.offsetHeight || 300;
    };
    resize();

    const count = Math.floor(canvas.width * canvas.height / 12000);
    const particles: Particle[] = Array.from({ length: count }, () => new Particle());

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    const connect = () => {
      const maxDist = (canvas.width / 8) ** 2;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a+1; b < particles.length; b++) {
          const dx = particles[a].x-particles[b].x;
          const dy = particles[a].y-particles[b].y;
          const dSq = dx*dx+dy*dy;
          if (dSq < maxDist) {
            const op = 0.18 * (1 - dSq/maxDist);
            ctx.strokeStyle = `rgba(0,217,255,${op})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connect();
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity: 0.55,
      }}
    />
  );
}
