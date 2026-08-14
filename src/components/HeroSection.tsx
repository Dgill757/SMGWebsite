import React, { lazy, Suspense, useState, useEffect, useRef, useCallback } from 'react';

// Lazy-loaded so the Three.js bundle is code-split and only evaluated in the
// browser — the Vite equivalent of Next.js `dynamic(() => import(...), { ssr: false })`.
const AvaParticleHero = lazy(() => import('./ava/AvaParticleHero'));

const SPOTLIGHT_R = 240;

const HeroSection: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef      = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const cursorRef    = useRef({ x: 0.5, y: 0.5 });
  const lerpRef      = useRef({ x: 0.5, y: 0.5 });
  const rafCursorRef = useRef(0);

  // ── Cursor spotlight reveal state (cyan "Ava answered" world beneath cursor) ──
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const revealRef  = useRef<HTMLDivElement>(null);
  const spotMouseRef  = useRef({ x: -999, y: -999 });
  const spotSmoothRef = useRef({ x: -999, y: -999 });
  const spotRafRef    = useRef(0);

  const sizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  const spotlightTick = useCallback(() => {
    const c = canvasRef.current;
    const r = revealRef.current;
    if (!c || !r) { spotRafRef.current = requestAnimationFrame(spotlightTick); return; }
    const ctx = c.getContext('2d');
    if (!ctx) { spotRafRef.current = requestAnimationFrame(spotlightTick); return; }

    spotSmoothRef.current.x += (spotMouseRef.current.x - spotSmoothRef.current.x) * 0.09;
    spotSmoothRef.current.y += (spotMouseRef.current.y - spotSmoothRef.current.y) * 0.09;

    const { x, y } = spotSmoothRef.current;
    ctx.clearRect(0, 0, c.width, c.height);

    const grad = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_R);
    grad.addColorStop(0,    'rgba(255,255,255,1)');
    grad.addColorStop(0.4,  'rgba(255,255,255,1)');
    grad.addColorStop(0.65, 'rgba(255,255,255,0.72)');
    grad.addColorStop(0.82, 'rgba(255,255,255,0.28)');
    grad.addColorStop(0.94, 'rgba(255,255,255,0.06)');
    grad.addColorStop(1,    'rgba(255,255,255,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const url = c.toDataURL();
    r.style.maskImage       = `url(${url})`;
    r.style.webkitMaskImage = `url(${url})`;
    r.style.maskSize        = '100% 100%';
    r.style.webkitMaskSize  = '100% 100%';

    spotRafRef.current = requestAnimationFrame(spotlightTick);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    const onMove = (e: MouseEvent) => {
      spotMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => { spotMouseRef.current = { x: -999, y: -999 }; };

    if (!reduced) {
      window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseleave', onLeave);
      spotRafRef.current = requestAnimationFrame(spotlightTick);
    }

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(spotRafRef.current);
    };
  }, [sizeCanvas, spotlightTick]);

  // Cursor-follow parallax highlight over Ava face region (existing particle system)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      cursorRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      const LERP = 0.055;
      lerpRef.current.x += (cursorRef.current.x - lerpRef.current.x) * LERP;
      lerpRef.current.y += (cursorRef.current.y - lerpRef.current.y) * LERP;
      if (highlightRef.current) {
        const MAX = 9; // max px translate
        const tx = (lerpRef.current.x - 0.5) * MAX * 2;
        const ty = (lerpRef.current.y - 0.5) * MAX * 2;
        highlightRef.current.style.transform =
          `translate(calc(-50% + ${tx.toFixed(2)}px), calc(-50% + ${ty.toFixed(2)}px))`;
      }
      rafCursorRef.current = requestAnimationFrame(tick);
    };
    rafCursorRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafCursorRef.current);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  // Track scroll to dissolve Ava as section leaves viewport (existing particle system)
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (window.innerHeight * 0.6)));
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTalkToAva = () => {
    const section = document.getElementById('experience-ava');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const btn = document.querySelector('.wcw-state-container') as HTMLElement;
      if (btn) btn.click();
    }, 700);
  };

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="hero-section-wrapper"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#000000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {/* Ambient glow behind Ava — breathing glow tied to hero-breathe animation */}
      <div
        className="hero-glow-breathe"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: [
            'radial-gradient(ellipse 45% 65% at 68% 48%, rgba(0,220,255,0.13) 0%, transparent 70%)',
            'radial-gradient(ellipse 26% 38% at 66% 45%, rgba(0,180,255,0.09) 0%, transparent 55%)',
            'radial-gradient(ellipse 20% 30% at 70% 52%, rgba(0,220,255,0.07) 0%, transparent 60%)',
          ].join(', '),
          pointerEvents: 'none',
          animation: 'hero-breathe 9s ease-in-out infinite',
        }}
      />

      {/* ── Ava Particle Canvas (full-section overlay, pointer-events none on canvas) ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        opacity: 1 - scrollProgress * 0.8,
        transition: 'opacity 0.1s linear',
        pointerEvents: scrollProgress > 0.5 ? 'none' : 'auto',
      }}>
        <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#000' }} />}>
          <AvaParticleHero
            scrollProgress={scrollProgress}
            className="w-full h-full"
          />
        </Suspense>

        {/* Cursor-follow highlight — radial glow that lerps toward mouse over Ava face */}
        <div
          ref={highlightRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '44%',
            left: '67%',
            width: 340,
            height: 340,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,217,255,0.10) 0%, rgba(0,217,255,0.03) 45%, transparent 68%)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Text protection gradient — dark-left fade so particles don't bleed into copy */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        background: 'linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.50) 28%, rgba(0,0,0,0.14) 52%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      {/* ── Cursor spotlight reveal: default state = dark "missed call", cursor reveals cyan "Ava answered" world ── */}
      {/* Hidden mask-source canvas — never painted directly, only used to compute the reveal div's mask-image */}
      <canvas
        ref={canvasRef}
        className="hero-spotlight-canvas"
        aria-hidden="true"
      />
      <div
        ref={revealRef}
        className="hero-spotlight-reveal"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 60% 70% at 65% 45%,
              rgba(0,217,255,0.14) 0%,
              rgba(0,217,255,0.07) 40%,
              transparent 75%),
            radial-gradient(ellipse 40% 50% at 70% 38%,
              rgba(124,58,237,0.10) 0%,
              transparent 70%)
          `,
        }}
      />

      {/* ── Hero Content ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        padding: '0 1.5rem',
        paddingTop: '7rem',
        paddingBottom: '6rem',
      }}
        className="hero-content"
      >
        <div style={{ flex: '1', minWidth: 0, maxWidth: 640 }}>
          {/* Trust badge — liquid glass */}
          <div
            className="hero-fade glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              borderRadius: 999,
              padding: '0.45rem 1.1rem',
              marginBottom: '2rem',
              animationDelay: '0s',
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#00D9FF',
              boxShadow: '0 0 12px rgba(0,217,255,0.95)',
              animation: 'pulse-glow 2.5s ease-in-out infinite',
              display: 'inline-block',
            }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em' }}>
              Trusted by 42+ Roofing Companies Across the US
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-rise"
            style={{
              animationDelay: '0.06s',
              fontWeight: 900,
              fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)',
              lineHeight: 1.06,
              letterSpacing: '-0.035em',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 40%, #00D9FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
            Every Missed Call Is a Job Going to Your Competitor
          </h1>

          {/* Sub-headline */}
          <p
            className="hero-rise"
            style={{
              animationDelay: '0.14s',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.62)',
              marginBottom: '1.25rem',
              maxWidth: 520,
              fontWeight: 400,
            }}>
            Ava answers every call 24/7, books appointments automatically, follows up
            with unsold estimates, reactivates old leads &mdash; and syncs everything
            to your CRM. At a fraction of the cost of a receptionist.
          </p>

          {/* Social proof line */}
          <p
            className="hero-rise"
            style={{
              animationDelay: '0.18s',
              fontSize: '0.82rem',
              fontStyle: 'italic',
              color: 'rgba(0,217,255,0.75)',
              margin: '0 0 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
            }}>
            🏆 Teo Roofing booked 582 appointments in 12 months.
            That's $4.1M+ recovered from one AI receptionist.
          </p>

          {/* CTAs */}
          <div
            className="hero-rise"
            style={{ animationDelay: '0.22s', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}
          >
            <button
              onClick={handleTalkToAva}
              className="btn-primary hero-cta-pulse"
              style={{ padding: '1rem 2.2rem', fontSize: '1rem' }}
            >
              <span>🎙️ Talk to Ava Now &mdash; It's Free</span>
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="btn-outline glass"
              style={{ padding: '1rem 2.2rem', fontSize: '1rem', border: 'none' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                See How It Works &rarr;</span>
            </button>
          </div>

          {/* Trust pills — liquid glass */}
          <div className="hero-fade" style={{ animationDelay: '0.34s', display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {['No credit card required', 'Live in 48–72 hours', 'Cancel anytime'].map((pill) => (
              <span key={pill} className="glass" style={{
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.5)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 500,
                padding: '5px 14px',
                borderRadius: 999,
              }}>
                <span style={{ color: '#00D9FF' }}>✓</span>{pill}
              </span>
            ))}
          </div>

          {/* Feature Pills */}
          <div className="hero-fade" style={{ animationDelay: '0.4s', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              'Never Miss a Call',
              'Auto Scheduling',
              '24/7 Lead Capture',
              'Billing & Invoicing',
            ].map((feat) => (
              <div key={feat} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999,
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 500,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D9FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {feat}
              </div>
            ))}
          </div>

          {/* Cursor hint — invites the spotlight discovery interaction */}
          <p className="hero-fade" style={{
            animationDelay: '1.2s',
            fontSize: '0.68rem',
            color: 'rgba(255,255,255,0.2)',
            marginTop: '1.5rem',
            letterSpacing: '0.08em',
            fontStyle: 'italic',
          }}>
            ↖ Move your cursor to see what changes when Ava answers
          </p>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 11,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: Math.max(0, 1 - scrollProgress * 3),
        transition: 'opacity 0.2s',
      }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
          Scroll to explore
        </span>
        <div style={{
          width: 24, height: 38, borderRadius: 12,
          border: '1.5px solid rgba(255,255,255,0.18)',
          display: 'flex', justifyContent: 'center', paddingTop: '0.4rem',
        }}>
          <div style={{
            width: 4, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.5)',
            animation: 'float-y 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
