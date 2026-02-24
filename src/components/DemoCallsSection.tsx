import React, { useRef, useEffect, useState } from 'react';

// ── Video data — swap YouTube IDs when real demos are ready ──────────────────
const VIDEOS = [
  {
    id: 'j5c4RmZk7Pc',
    title: 'AI Realtor Demo',
    tag: 'Real Estate',
    accent: '#00E5FF',
  },
  {
    id: 'p59_ZOmgodk',
    title: 'AI Deck & Landscaping Demo',
    tag: 'Home Services',
    accent: '#7C3AED',
  },
  {
    id: 'ly-UhP_91H0',
    title: 'AI Roofing Demo',
    tag: 'Home Services',
    accent: '#F472B6',
  },
  {
    id: 'Uu35W1wtAZA',
    title: 'AI Pool Demo',
    tag: 'Home Services',
    accent: '#FBBF24',
  },
];

function useInView(ref: React.RefObject<Element>, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

interface VideoCardProps {
  id: string;
  title: string;
  tag: string;
  accent: string;
  delay: string;
  inView: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ id, title, tag, accent, delay, inView }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        border: `1px solid ${hovered ? accent + '66' : 'rgba(255,255,255,0.08)'}`,
        background: 'rgba(255,255,255,0.025)',
        boxShadow: hovered
          ? `0 0 0 1px ${accent}30, 0 28px 70px rgba(0,0,0,0.55), 0 0 60px ${accent}22, inset 0 1px 0 rgba(255,255,255,0.06)`
          : '0 4px 24px rgba(0,0,0,0.35)',
        transition: 'all 0.32s ease',
        transform: hovered ? 'translateY(-4px) scale(1.012)' : 'none',
        opacity: inView ? 1 : 0,
        animation: inView ? `fadeSlideUp 0.55s ease ${delay} both` : 'none',
        willChange: 'transform',
      }}
    >
      {/* 16:9 Video Embed */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            border: 'none',
          }}
        />
      </div>

      {/* Card footer */}
      <div style={{
        padding: '1rem 1.25rem',
        background: `linear-gradient(135deg, ${accent}0A, rgba(255,255,255,0.01))`,
        borderTop: `1px solid ${accent}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent, marginBottom: '0.2rem' }}>
            {tag}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            {title}
          </div>
        </div>
        {/* Play icon */}
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: `${accent}22`,
          border: `1px solid ${accent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={accent}>
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

// ── Main section ─────────────────────────────────────────────────────────────
const DemoCallsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="demo-calls"
      style={{ position: 'relative', background: '#05050A', padding: '7rem 0', overflow: 'hidden' }}
    >
      {/* BG glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 600, height: 400, top: '40%', left: '25%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse, rgba(0,229,255,0.05) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', width: 500, height: 350, top: '60%', left: '75%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 65%)' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.22)', borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            Real Demos
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1.2rem' }}>
            SummitVoiceAI{' '}
            <span style={{ background: 'linear-gradient(135deg,#F472B6,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Demo Calls</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>
            Hear Ava in real conversations — handling calls, qualifying leads, and booking appointments across industries.
          </p>
        </div>

        {/* 2 × 2 video grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.75rem' }}
          className="demo-grid"
        >
          {VIDEOS.map((v, i) => (
            <VideoCard
              key={v.id}
              {...v}
              delay={`${i * 0.1 + 0.2}s`}
              inView={inView}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .demo-grid { grid-template-columns: 1fr !important; } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      `}</style>
    </section>
  );
};

export default DemoCallsSection;
