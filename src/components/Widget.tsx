
import React, { useEffect, useState, useRef } from 'react';
import RawHtmlBlock from './RawHtmlBlock';

const Widget: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const sectionRef   = useRef<HTMLElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const target       = useRef({ x: 0.5, y: 0.5 });
  const current      = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    // Wait a short time to ensure the div is in the DOM
    setTimeout(() => {
      if (window.widgetLib && typeof window.widgetLib.scanWidgets === 'function') {
        window.widgetLib.scanWidgets();
        console.log('Thinkrr widget initialized');
      } else {
        console.log('Thinkrr widget library not available yet');
      }
    }, 150);
  }, []); // Run after mount

  // Pointer-follow ambient glow — desktop + non-reduced-motion only
  useEffect(() => {
    const reduced    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !hasPointer) return;

    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      target.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top)  / rect.height,
      };
    };

    const tick = () => {
      const lerp = 0.055;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;

      if (mouseGlowRef.current) {
        const px = current.current.x * 100;
        const py = current.current.y * 100;
        mouseGlowRef.current.style.background =
          `radial-gradient(ellipse 55% 45% at ${px}% ${py}%, rgba(0,217,255,0.10) 0%, rgba(124,58,237,0.06) 45%, transparent 70%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      section.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <section ref={sectionRef} id="experience-ava" style={{
      position: 'relative',
      background: '#050507',
      padding: '5rem 1.5rem',
      overflow: 'hidden',
      scrollMarginTop: '80px',
    }}>
      {/* Mouse-follow glow layer — desktop only, pointer: fine */}
      <div
        ref={mouseGlowRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Static ambient glow — center breathe */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          width: 800, height: 560,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(0,217,255,0.09) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)',
          animation: 'widgetGlowBreath 7s ease-in-out infinite',
        }} />
        {/* Secondary purple bloom — lower-left */}
        <div style={{
          position: 'absolute',
          width: 420, height: 300,
          bottom: '-4rem', left: '-2rem',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 65%)',
          animation: 'widgetGlowBreath 11s ease-in-out infinite reverse',
        }} />
      </div>

      {/* Animated waveform accent */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '3rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 3, alignItems: 'center', pointerEvents: 'none', opacity: 0.22,
      }}>
        {[0.6, 1, 1.4, 1, 0.7, 1.2, 0.9, 1.5, 0.8, 1.1, 0.6, 1.3].map((h, i) => (
          <div key={i} style={{
            width: 3, borderRadius: 99,
            height: `${h * 14}px`,
            background: 'linear-gradient(to top, rgba(0,217,255,0.9), rgba(124,58,237,0.7))',
            animation: `wave ${0.9 + i * 0.07}s ease-in-out infinite`,
            animationDelay: `${i * 0.08}s`,
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.22)',
            borderRadius: 999, padding: '0.4rem 1.1rem', marginBottom: '1.25rem',
          }}>
            <span style={{
              display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
              background: '#00D9FF',
              boxShadow: '0 0 10px #00D9FF, 0 0 20px rgba(0,217,255,0.4)',
              animation: 'widgetPulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
              Live Demo — Talk to Ava Now
            </span>
          </div>
          <h2 style={{
            fontWeight: 800,
            fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: '#fff',
            marginBottom: '0.85rem',
            overflowWrap: 'break-word',
          }}>
            Experience Ava{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00D9FF, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              First-Hand
            </span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: 440, margin: '0 auto' }}>
            Click below and have a real conversation with our AI voice agent. No sign-up required.
          </p>
        </div>

        {/* Glow border wrapper — hover elevation + focus ring */}
        <div
          tabIndex={0}
          className="widget-border-wrap"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            borderRadius: 24,
            padding: '0.15rem',
            background: 'linear-gradient(135deg, rgba(0,217,255,0.5), rgba(124,58,237,0.4), rgba(59,130,246,0.35))',
            boxShadow: hovered
              ? '0 0 100px rgba(0,217,255,0.28), 0 0 180px rgba(124,58,237,0.18), 0 24px 60px rgba(0,0,0,0.55)'
              : '0 0 70px rgba(0,217,255,0.15), 0 0 140px rgba(124,58,237,0.10)',
            transform: hovered ? 'translateY(-4px)' : 'none',
            transition: 'box-shadow 0.35s ease, transform 0.35s ease',
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,217,255,0.55), 0 0 90px rgba(0,217,255,0.22)'; }}
          onBlur={(e)  => { e.currentTarget.style.boxShadow = '0 0 70px rgba(0,217,255,0.15), 0 0 140px rgba(124,58,237,0.10)'; }}
        >
          {/* Inner surface */}
          <div className="widget-inner" style={{
            position: 'relative',
            borderRadius: 21,
            background: 'rgba(6,6,12,0.98)',
            overflow: 'hidden',
            padding: '2.5rem 2rem',
          }}>
            {/* Cyan top accent line — brighter */}
            <div style={{
              position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(0,217,255,0.75), transparent)',
            }} />

            {/* Corner radial glow — top-right */}
            <div style={{
              position: 'absolute', top: -80, right: -80, width: 260, height: 260,
              background: 'radial-gradient(circle, rgba(0,217,255,0.08) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />
            {/* Corner glow — bottom-left */}
            <div style={{
              position: 'absolute', bottom: -60, left: -60, width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />

            <div
              id="widget-container"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <RawHtmlBlock
                html='<div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"></div>'
                id="pure-widget-container"
              />
            </div>
          </div>
        </div>

        {/* Trust line */}
        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
          Powered by SummitVoiceAI · No data stored · End-to-end encrypted
        </p>
      </div>

      <style>{`
        @keyframes widgetPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.82); }
        }
        @keyframes widgetGlowBreath {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.07); }
        }
        @keyframes widgetBorderShimmer {
          0%   { opacity: 0.6; }
          50%  { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .widget-border-wrap {
          animation: widgetBorderShimmer 3.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .widget-waveform-bar,
          .widget-border-wrap { animation: none !important; }
        }
        @media (max-width: 480px) {
          .widget-inner { padding: 1.5rem 1rem !important; }
        }
      `}</style>
    </section>
  );
};

export default Widget;
