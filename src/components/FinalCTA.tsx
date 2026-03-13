import React from 'react';

export function FinalCTA() {
  const handleDemo = () => {
    const section = document.getElementById('experience-ava');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const btn = document.querySelector('.wcw-state-container') as HTMLElement | null;
      if (btn) btn.click();
    }, 700);
  };

  return (
    <section
      style={{
        padding: '100px 24px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,217,255,0.07) 0%, transparent 70%)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.14em', fontWeight: 700, color: 'rgba(0,217,255,0.65)', marginBottom: '16px', textTransform: 'uppercase' }}>
          Your Next Move
        </p>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: '0 0 18px' }}>
          Every Call You Miss Tonight Is{' '}
          <span style={{ background: 'linear-gradient(135deg, #00D9FF, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            a Job You&apos;re Giving Away.
          </span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '1rem', maxWidth: '460px', margin: '0 auto 40px', lineHeight: 1.75 }}>
          Talk to Ava right now. No credit card, no sales call.
          Hear exactly what your customers will experience - live, in 30 seconds.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
          <button
            onClick={handleDemo}
            style={{
              padding: '17px 38px',
              background: 'linear-gradient(135deg, #00D9FF 0%, #7C3AED 100%)',
              border: 'none',
              borderRadius: '14px',
              color: '#000',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '0.02em',
              boxShadow: '0 6px 30px rgba(0,217,255,0.28)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,217,255,0.42)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,217,255,0.28)';
            }}
          >
            🎙️ Talk to Ava — It&apos;s Free
          </button>
          <a
            href="https://calendly.com/aivoice/call"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '17px 30px',
              background: 'transparent',
              border: '1px solid rgba(0,217,255,0.28)',
              borderRadius: '14px',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0,217,255,0.6)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,217,255,0.28)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
            }}
          >
            Book a Strategy Call →
          </a>
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['No credit card', 'Live in 48-72 hours', 'Cancel anytime'].map((x, i) => (
            <span key={i} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
              <span style={{ color: '#00D9FF', marginRight: '5px' }}>✓</span>{x}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
