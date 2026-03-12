import React, { useEffect, useRef } from 'react';
import RawHtmlBlock from './RawHtmlBlock';
import SummitWidget from './SummitWidget';

const Widget: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const target = useRef({ x: 0.5, y: 0.5 });
  const current = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    setTimeout(() => {
      if (window.widgetLib && typeof window.widgetLib.scanWidgets === 'function') {
        window.widgetLib.scanWidgets();
        console.log('Thinkrr widget initialized');
      } else {
        console.log('Thinkrr widget library not available yet');
      }
    }, 150);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !hasPointer) return;

    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      target.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
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

  const stars: number[][] = [
    [8, 15], [15, 70], [22, 40], [30, 85], [38, 25], [45, 60], [52, 10],
    [60, 90], [67, 35], [72, 65], [78, 20], [83, 80], [90, 45], [95, 15],
    [12, 50], [25, 95], [48, 75], [70, 5], [85, 55], [93, 30],
  ];

  return (
    <section
      ref={sectionRef}
      id="experience-ava"
      style={{
        position: 'relative',
        background: '#050507',
        padding: '5rem 1.5rem',
        overflow: 'hidden',
        scrollMarginTop: '80px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {stars.map(([left, top], i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: `${top}%`,
              width: i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.3)',
              animation: `summit-star-twinkle ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 3}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes summit-star-twinkle {
            0%,100% { opacity: 0.2; }
            50%      { opacity: 0.8; }
          }
        `}</style>
      </div>

      <div
        ref={mouseGlowRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
      />

      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div
          style={{
            position: 'absolute',
            width: 800,
            height: 560,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, rgba(0,217,255,0.09) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)',
            animation: 'widgetGlowBreath 7s ease-in-out infinite',
          }}
        />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 3,
          alignItems: 'center',
          pointerEvents: 'none',
          opacity: 1,
          zIndex: 2,
        }}
      >
        {[0.6, 1, 1.4, 1, 0.7, 1.2, 0.9, 1.5, 0.8, 1.1, 0.6, 1.3].map((h, i) => (
          <div
            key={i}
            style={{
              width: 3,
              borderRadius: 99,
              height: `${h * 14}px`,
              background: '#00D9FF',
              animation: `wave ${0.9 + i * 0.07}s ease-in-out infinite`,
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', position: 'relative', zIndex: 3 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0,217,255,0.08)',
              border: '1px solid rgba(0,217,255,0.22)',
              borderRadius: 999,
              padding: '0.4rem 1.1rem',
              marginBottom: '1.25rem',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#00D9FF',
                boxShadow: '0 0 10px #00D9FF, 0 0 20px rgba(0,217,255,0.4)',
                animation: 'widgetPulse 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              LIVE DEMO — TALK TO AVA NOW
            </span>
          </div>
          <h2
            style={{
              fontWeight: 800,
              fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: '#fff',
              marginBottom: '0.85rem',
              overflowWrap: 'break-word',
            }}
          >
            Experience Ava{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #00D9FF, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              First-Hand
            </span>
          </h2>
          <p
            className="font-semibold"
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.65,
              maxWidth: 440,
              margin: '0 auto',
              background: 'linear-gradient(135deg, #ffffff 0%, #00D9FF 60%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Click below and have a real conversation with our AI voice agent. No sign-up required.
          </p>
        </div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(6,182,212,0.06) 0%, rgba(147,51,234,0.04) 40%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div id="widget-container" style={{ position: 'relative', zIndex: 2 }}>
            <SummitWidget />
            <RawHtmlBlock
              html='<div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"></div>'
              id="pure-widget-container"
            />
          </div>
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: '1.25rem',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          Powered by SummitVoiceAI · No data stored · End-to-end encrypted
        </p>
      </div>

      <style>{`
        [data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"] {
          position: fixed !important;
          bottom: -9999px !important;
          left: -9999px !important;
          opacity: 0 !important;
          pointer-events: none !important;
          z-index: -1 !important;
        }
        [data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"] * {
          pointer-events: auto !important;
          visibility: visible !important;
        }
        @keyframes widgetPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.82); }
        }
        @keyframes widgetGlowBreath {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.07); }
        }
      `}</style>
    </section>
  );
};

export default Widget;
