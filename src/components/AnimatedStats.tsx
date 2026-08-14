import React, { useState, useEffect, useRef } from 'react';
import NumberFlow from '@number-flow/react';
import { motion, useInView } from 'framer-motion';

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

interface StatItem {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  subLabel?: string;
}

const stats: StatItem[] = [
  {
    end: 84,
    prefix: '$',
    suffix: 'M+',
    label: 'Client Revenue Recovered',
    subLabel: 'In annual revenue across active clients',
  },
  {
    end: 582,
    suffix: '',
    label: 'Appointments Booked',
    subLabel: 'One client. One year. Teo Roofing.',
  },
  {
    end: 100,
    suffix: '%',
    label: 'Call Answer Rate',
    subLabel: '24/7/365 — Ava never misses',
  },
  {
    end: 42,
    suffix: '+',
    label: 'Active Companies',
    subLabel: 'Roofing, home services & more',
  },
];

function AnimatedStatCard({ stat, delay }: { stat: StatItem; delay: number }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setTimeout(() => {
            setStarted(true);
            setValue(stat.end);
          }, delay);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, stat.end, delay]);

  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center',
        padding: '32px 24px',
        borderRadius: '16px',
        background: 'rgba(0, 217, 255, 0.03)',
        border: '1px solid rgba(0, 217, 255, 0.1)',
        transition: 'border-color 0.3s ease, background 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.35)';
        e.currentTarget.style.background = 'rgba(0, 217, 255, 0.07)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.1)';
        e.currentTarget.style.background = 'rgba(0, 217, 255, 0.03)';
      }}
    >
      <div
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: '8px',
          color: '#00D9FF',
          textShadow: '0 0 30px rgba(0,217,255,0.4)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}
      >
        {stat.prefix && <span>{stat.prefix}</span>}
        <NumberFlow
          value={value}
          format={{ maximumFractionDigits: 0 }}
          willChange
        />
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>
      <div
        style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
          marginBottom: '4px',
        }}
      >
        {stat.label}
      </div>
      {stat.subLabel && (
        <div
          style={{
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 500,
          }}
        >
          {stat.subLabel}
        </div>
      )}
    </div>
  );
}

export function AnimatedStats() {
  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <p
          style={{
            textAlign: 'center',
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            color: 'rgba(0,217,255,0.7)',
            fontWeight: 700,
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          Real Results From Real Clients
        </p>
        <h2
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '48px',
            lineHeight: 1.2,
          }}
        >
          What Happens When Roofing Companies Add Ava
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {stats.map((stat, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <AnimatedStatCard stat={stat} delay={i * 150} />
            </FadeUp>
          ))}
        </div>

        <div
          style={{
            marginTop: '40px',
            padding: '24px 28px',
            borderRadius: '14px',
            background: 'rgba(124, 58, 237, 0.06)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            🏆 <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Teo Roofing</strong> — 582 appointments booked in 12 months via Ava.
            At a 55% close rate averaging $13,100/job, that&apos;s{' '}
            <strong style={{ color: '#00D9FF' }}>$4,190,400+ in recovered revenue</strong>.
            {' '}From one AI receptionist. Now replicated across 42+ companies.
          </p>
        </div>
      </div>
    </section>
  );
}
