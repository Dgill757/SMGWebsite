import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrackRecordParticles } from '@/components/TrackRecordParticles';

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}>
      {children}
    </motion.div>
  );
}

function CountUp({ end, prefix = '', suffix = '', delay = 0 }: {
  end: number; prefix?: string; suffix?: string; delay?: number;
}) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setTimeout(() => setStarted(true), delay); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started, delay]);

  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(tick); else setVal(end);
    };
    requestAnimationFrame(tick);
  }, [started, end]);

  return <div ref={ref}>{prefix}{val.toLocaleString()}{suffix}</div>;
}

const items = [
  { end: 240, prefix: '$', suffix: 'M+', label: 'Total Revenue Recovered', sub: 'Across all clients, 4 years' },
  { end: 21000, suffix: '+', label: 'Total Appointments Booked', sub: 'By AI - zero human effort' },
  { end: 42, suffix: '+', label: 'Active Companies', sub: 'Roofing, home services & more' },
  { end: 4, suffix: ' Years', label: 'Proven Track Record', sub: 'Documented results since 2022' },
];

export function TrackRecord() {
  return (
    <section
      style={{
        position: 'relative',
        padding: '80px 24px',
        borderTop: '1px solid rgba(0,217,255,0.07)',
        background: 'linear-gradient(180deg, rgba(0,217,255,0.025) 0%, transparent 100%)',
      }}
    >
      <TrackRecordParticles />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.14em',
            fontWeight: 700,
            color: 'rgba(0,217,255,0.65)',
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          4 Years of Documented Results
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.7rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 1.15,
            margin: '0 0 14px',
          }}
        >
          The Cumulative Track Record
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.9rem',
            maxWidth: '500px',
            margin: '0 auto 52px',
            lineHeight: 1.7,
          }}
        >
          Every client, every call, every year since 2022.
          Not projections - documented results.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px',
            background: 'rgba(0,217,255,0.07)',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(0,217,255,0.12)',
          }}
          className="tr-grid"
        >
          {items.map((item, i) => (
            <FadeUp key={i} delay={i * 0.18}>
              <div
                style={{
                  padding: '40px 20px',
                  background: 'rgba(0,8,16,0.85)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
                    fontWeight: 900,
                    color: '#00D9FF',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    marginBottom: '10px',
                    textShadow: '0 0 24px rgba(0,217,255,0.35)',
                  }}
                >
                  <CountUp end={item.end} prefix={item.prefix || ''} suffix={item.suffix || ''} delay={i * 200} />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                  {item.sub}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <p style={{ marginTop: '20px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.03em' }}>
          Revenue figures based on client-reported close rates and average job values across live deployments since 2022.
        </p>
      </div>
      <style>{`@media(max-width:640px){.tr-grid{grid-template-columns:1fr 1fr!important;}}`}</style>
    </section>
  );
}
