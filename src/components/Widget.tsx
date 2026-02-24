
import React, { useEffect } from 'react';
import RawHtmlBlock from './RawHtmlBlock';

const Widget: React.FC = () => {
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

  return (
    <section style={{
      position: 'relative',
      background: '#050507',
      padding: '5rem 1.5rem',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          width: 700, height: 500,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, rgba(0,229,255,0.07) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)',
        }} />
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)',
            borderRadius: 999, padding: '0.4rem 1.1rem', marginBottom: '1.25rem',
          }}>
            <span style={{
              display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
              background: '#00E5FF',
              boxShadow: '0 0 8px #00E5FF',
              animation: 'widgetPulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
              Live Demo — Talk to Ava Now
            </span>
          </div>
          <h2 style={{
            fontWeight: 800,
            fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            color: '#fff',
            marginBottom: '0.85rem',
          }}>
            Experience Ava{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00E5FF, #7C3AED)',
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

        {/* Glow border wrapper */}
        <div style={{
          position: 'relative',
          borderRadius: 24,
          padding: '0.15rem',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.4), rgba(124,58,237,0.35), rgba(59,130,246,0.3))',
          boxShadow: '0 0 60px rgba(0,229,255,0.12), 0 0 120px rgba(124,58,237,0.08)',
        }}>
          {/* Inner surface */}
          <div style={{
            position: 'relative',
            borderRadius: 21,
            background: 'rgba(8,8,14,0.97)',
            overflow: 'hidden',
            padding: '2.5rem 2rem',
          }}>
            {/* Cyan top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.6), transparent)',
            }} />

            {/* Corner radial glow */}
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
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
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </section>
  );
};

export default Widget;
