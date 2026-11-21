import React from 'react';

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #00D9FF, #7C3AED)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: '#00D9FF',
};

const wrap: React.CSSProperties = { maxWidth: 1180, margin: '0 auto', padding: '0 1.5rem' };

export const LandingShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden', paddingTop: 'var(--page-top)', color: '#fff' }}>
    {children}
  </main>
);

interface HeroProps {
  eyebrow: string;
  headline: string;
  sub: string;
  bullets?: string[];
  scene?: string;
  form: React.ReactNode;
}

export const LandingHero: React.FC<HeroProps> = ({ eyebrow, headline, sub, bullets, scene, form }) => (
  <section style={{ ...wrap, padding: '3rem 1.5rem 4rem' }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: '3rem',
        alignItems: 'start',
      }}
    >
      <div>
        <p
          style={{
            fontSize: '0.74rem',
            letterSpacing: '0.14em',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'rgba(0,217,255,0.85)',
            margin: '0 0 1rem',
          }}
        >
          {eyebrow}
        </p>
        <h1
          style={{
            fontSize: 'clamp(1.9rem, 4.6vw, 3.1rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            margin: '0 0 1.25rem',
          }}
        >
          <span style={gradientText}>{headline}</span>
        </h1>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', margin: '0 0 1.5rem' }}>
          {sub}
        </p>
        {scene && (
          <p
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.7)',
              margin: '0 0 1.5rem',
              paddingLeft: '1rem',
              borderLeft: '3px solid rgba(124,58,237,0.7)',
              fontStyle: 'italic',
            }}
          >
            {scene}
          </p>
        )}
        {bullets && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {bullets.map((b) => (
              <li key={b} style={{ display: 'flex', gap: '0.7rem', fontSize: '0.98rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.82)' }}>
                <span aria-hidden="true" style={{ color: '#00D9FF', fontWeight: 800 }}>
                  +
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>{form}</div>
    </div>
  </section>
);

export const FormCard: React.FC<{ title: string; sub?: string; children: React.ReactNode }> = ({ title, sub, children }) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.035)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 20,
      padding: 'clamp(1.25rem, 3vw, 2rem)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.08)',
    }}
  >
    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.4rem', letterSpacing: '-0.01em' }}>{title}</h2>
    {sub && <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.68)', margin: '0 0 1.25rem' }}>{sub}</p>}
    {children}
  </div>
);

export const CardSection: React.FC<{
  heading: string;
  intro?: string;
  items: { title: string; body: string }[];
}> = ({ heading, intro, items }) => (
  <section style={{ ...wrap, padding: '3rem 1.5rem' }}>
    <h2 style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.1rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 0.75rem' }}>
      {heading}
    </h2>
    {intro && <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.72)', maxWidth: 720, margin: '0 0 1.75rem' }}>{intro}</p>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.1rem', marginTop: intro ? 0 : '1.5rem' }}>
      {items.map((it) => (
        <div
          key={it.title}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 16,
            padding: '1.4rem',
          }}
        >
          <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{it.title}</h3>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{it.body}</p>
        </div>
      ))}
    </div>
  </section>
);

export const ListSection: React.FC<{ heading: string; items: string[]; intro?: string }> = ({ heading, items, intro }) => (
  <section style={{ ...wrap, padding: '2rem 1.5rem 3rem' }}>
    <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 0.75rem' }}>{heading}</h2>
    {intro && <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.72)', maxWidth: 720, margin: '0 0 1rem' }}>{intro}</p>}
    <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: 720 }}>
      {items.map((i) => (
        <li key={i} style={{ fontSize: '0.98rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.78)' }}>
          {i}
        </li>
      ))}
    </ul>
  </section>
);

export const ComplianceNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section style={{ ...wrap, padding: '1rem 1.5rem 4rem' }}>
    <p
      style={{
        fontSize: '0.78rem',
        lineHeight: 1.7,
        color: 'rgba(255,255,255,0.55)',
        maxWidth: 820,
        margin: 0,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '1.25rem',
      }}
    >
      {children}
    </p>
  </section>
);

export const TextSection: React.FC<{ heading: string; children: React.ReactNode }> = ({ heading, children }) => (
  <section style={{ ...wrap, padding: '2rem 1.5rem' }}>
    <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 0.75rem' }}>{heading}</h2>
    <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', maxWidth: 720, margin: 0 }}>{children}</p>
  </section>
);
