import React, { useRef, useEffect, useState } from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: '24/7 Availability',
    desc: 'Ava never sleeps, never calls in sick. Every call is answered and every opportunity captured regardless of time or day.',
    accent: '#7C3AED',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Save $100K+ Annually',
    desc: 'Replace expensive reception staff while delivering superior service and capturing dramatically more revenue every month.',
    accent: '#3B82F6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    title: 'Smart Learning AI',
    desc: 'Continuously adapts from every interaction—becoming more precise at converting leads and handling your specific business.',
    accent: '#F472B6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'Perfect Call Handling',
    desc: 'Handle unlimited simultaneous calls with perfect consistency, professional tone, and zero hold times.',
    accent: '#7C3AED',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: 'Seamless Scheduling',
    desc: 'Auto-coordinate appointments, sync confirmations, and manage your calendar—zero manual intervention required.',
    accent: '#3B82F6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Lead Qualification',
    desc: 'Intelligently assess caller intent, budget, and timeline. Only high-value prospects reach your sales team.',
    accent: '#F472B6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: 'Revenue Growth +40%',
    desc: 'Increase conversion rates with instant response times and professional, consistent interactions on every single call.',
    accent: '#7C3AED',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Instant Deployment',
    desc: 'Live in minutes, not months. Pre-configured with industry knowledge and conversational abilities from day one.',
    accent: '#3B82F6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'No Training Needed',
    desc: 'Deploy instantly. Ava comes with pre-configured industry knowledge and improves autonomously over time.',
    accent: '#F472B6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    title: 'Database Reactivation',
    desc: 'Instantly revive old leads with automated SMS, calls, and follow-up sequences that book jobs from your existing list.',
    accent: '#7C3AED',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'CRM + ROI Reporting',
    desc: 'Track every lead, call, booking, and closed job in one pipeline, with clear attribution and ROI reporting.',
    accent: '#3B82F6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Smart Website',
    desc: 'Turn your website into a 24/7 voice-enabled assistant. Visitors can talk to your site, ask questions, get instant answers, and book appointments on the spot. Combined with smart forms and automations, every lead gets an immediate response and the right follow-up — so static websites stop leaking revenue.',
    accent: '#F472B6',
  },
];

const STATS = [
  { value: '100%', label: 'Calls Captured', sub: 'Zero missed opportunities' },
  { value: '$8.5K', label: 'Monthly Savings', sub: 'vs. traditional staff' },
  { value: '40%', label: 'Higher Close Rate', sub: 'instant AI response' },
  { value: '24/7', label: 'Always On', sub: 'no holidays or sick days' },
];

function useInView(ref: React.RefObject<Element>, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

const RevenueSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="features"
      style={{
        position: 'relative',
        background: '#050507',
        padding: '7rem 0',
        overflow: 'hidden',
      }}
    >
      {/* BG glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: 700, height: 700, top: -200, right: -200,
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, bottom: -100, left: -100,
          background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 65%)',
          borderRadius: '50%',
        }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)',
            borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem',
            fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Why SummitVoiceAI
          </div>
          <h2 style={{
            fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff',
            marginBottom: '1.2rem',
          }}>
            Stop Losing Revenue to<br />
            <span style={{
              background: 'linear-gradient(135deg,#7C3AED,#3B82F6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Missed Opportunities
            </span>
          </h2>
          <p style={{
            fontSize: '1.1rem', color: 'rgba(255,255,255,0.52)', lineHeight: 1.65,
            maxWidth: 560, margin: '0 auto',
          }}>
            Every unanswered call is a lead your competition just captured. Ava makes sure
            that never happens again.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: '5rem',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{
              padding: '2.5rem 2rem',
              background: '#050507',
              textAlign: 'center',
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(20px)',
              transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
            }}>
              <div style={{
                fontSize: 'clamp(2.2rem,4vw,3rem)',
                fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1,
                background: 'linear-gradient(135deg,#7C3AED,#3B82F6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Grid — 4 cols desktop / 2 tablet / 1 mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
          }}
          className="revenue-feature-grid"
        >
          {FEATURES.map((feat, i) => (
            <div
              key={feat.title}
              style={{
                background: 'rgba(255,255,255,0.028)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20,
                padding: '2rem',
                cursor: 'default',
                transition: 'all 0.3s ease',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(30px)',
                transitionDelay: `${0.05 * i}s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(255,255,255,0.05)';
                el.style.borderColor = `${feat.accent}44`;
                el.style.transform = 'translateY(-3px)';
                el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${feat.accent}22`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(255,255,255,0.028)';
                el.style.borderColor = 'rgba(255,255,255,0.07)';
                el.style.transform = 'none';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: `${feat.accent}18`,
                border: `1px solid ${feat.accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: feat.accent,
                marginBottom: '1.25rem',
              }}>
                {feat.icon}
              </div>
              <h3 style={{
                fontWeight: 700, fontSize: '1rem', color: '#fff',
                marginBottom: '0.6rem', letterSpacing: '-0.01em',
              }}>
                {feat.title}
              </h3>
              <p style={{
                fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.6,
              }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .revenue-feature-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .revenue-feature-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};

export default RevenueSection;
