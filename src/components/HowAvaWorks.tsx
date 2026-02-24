import React, { useState, useRef, useEffect } from 'react';

// ── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'calls',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Handles Calls',
    accent: '#00E5FF',
    demo: {
      tag: 'Live Call',
      title: 'Ava Answers Instantly',
      lines: [
        { from: 'caller', text: 'Hi, I need a plumber as soon as possible — my basement is flooding.' },
        { from: 'ava',    text: "I'm dispatching an emergency crew to your area right now. Can I get your address to confirm availability?" },
        { from: 'caller', text: '847 Maple Lane, Springfield.' },
        { from: 'ava',    text: "Got it. A tech will be there within 45 minutes. You'll receive a confirmation text shortly." },
      ],
    },
  },
  {
    id: 'qualify',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    label: 'Qualifies Leads',
    accent: '#7C3AED',
    demo: {
      tag: 'Lead Scoring',
      title: 'Ava Qualifies in Real Time',
      lines: [
        { from: 'ava',    text: "What's the approximate scope of work you're looking for?" },
        { from: 'caller', text: 'Full roof replacement — about 2,400 square feet.' },
        { from: 'ava',    text: 'Have you had other estimates, or are you still in the early planning stage?' },
        { from: 'caller', text: 'Ready to move forward within the next two weeks.' },
      ],
    },
  },
  {
    id: 'book',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    label: 'Books Appointments',
    accent: '#22C55E',
    demo: {
      tag: 'Scheduling',
      title: 'Calendar Booked Automatically',
      lines: [
        { from: 'ava',    text: "I have Thursday at 10 AM or Friday at 2 PM available. Which works best for you?" },
        { from: 'caller', text: "Thursday at 10 works perfectly." },
        { from: 'ava',    text: "Done. You'll receive a calendar invite and reminder 24 hours before. Is there a best number to confirm on?" },
        { from: 'caller', text: "Yes — 757-555-1234." },
      ],
    },
  },
  {
    id: 'followup',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
    label: 'Handles Follow-up',
    accent: '#F472B6',
    demo: {
      tag: 'Automated Follow-up',
      title: 'Zero Leads Fall Through the Cracks',
      lines: [
        { from: 'ava',    text: "Hi, this is Ava from Summit Services. Just checking in on the quote we sent Monday — any questions?" },
        { from: 'caller', text: "Actually, yes — can you add gutter replacement to the estimate?" },
        { from: 'ava',    text: "Absolutely. I'll flag that update for the team and have a revised quote to you by end of day." },
        { from: 'caller', text: "Perfect, thank you." },
      ],
    },
  },
  {
    id: 'payments',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    label: 'Handles Payments',
    accent: '#FBBF24',
    demo: {
      tag: 'Payment Processing',
      title: 'Frictionless Payment Collection',
      lines: [
        { from: 'ava',    text: "Your balance of $1,850 is due upon completion. Would you like to pay now by card, or on the day of service?" },
        { from: 'caller', text: "I'll pay now — it's easier." },
        { from: 'ava',    text: "Great. I'll send a secure payment link to your phone right now. It takes less than a minute." },
        { from: 'caller', text: "Got it — paying now." },
      ],
    },
  },
];

// ── Waveform animation ───────────────────────────────────────────────────────
const Waveform: React.FC<{ accent: string }> = ({ accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 28 }}>
    {[0.4, 0.7, 1, 0.85, 0.6, 1, 0.75, 0.5, 0.9, 0.65, 1, 0.8, 0.55].map((h, i) => (
      <div
        key={i}
        style={{
          width: 3,
          height: `${h * 100}%`,
          background: accent,
          borderRadius: 2,
          opacity: 0.85,
          animation: `wave-bar 1.1s ease-in-out ${(i * 0.08).toFixed(2)}s infinite alternate`,
        }}
      />
    ))}
    <style>{`
      @keyframes wave-bar {
        from { transform: scaleY(0.3); opacity: 0.4; }
        to   { transform: scaleY(1);   opacity: 1;   }
      }
    `}</style>
  </div>
);

// ── useInView helper ─────────────────────────────────────────────────────────
function useInView(ref: React.RefObject<Element>, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ── Main component ────────────────────────────────────────────────────────────
const HowAvaWorks: React.FC = () => {
  const [activeId, setActiveId] = useState(STEPS[0].id);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);

  const active = STEPS.find(s => s.id === activeId) ?? STEPS[0];

  return (
    <section
      ref={sectionRef}
      id="how-ava-works"
      style={{ position: 'relative', background: '#07070A', padding: '7rem 0', overflow: 'hidden' }}
    >
      {/* BG glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 700, height: 500, top: '40%', left: '55%', transform: 'translate(-50%,-50%)', background: `radial-gradient(ellipse, ${active.accent}12 0%, transparent 65%)`, transition: 'background 0.6s ease' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            How Your Smart AI Works
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1.2rem' }}>
            From First Ring to{' '}
            <span style={{ background: 'linear-gradient(135deg,#00E5FF,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Closed Deal</span>
            {' '}— Automatically
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 560, margin: '0 auto' }}>
            Ava handles every stage of your sales process without missing a beat. Click a step to see her in action.
          </p>
        </div>

        {/* Content grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem', alignItems: 'start' }}
          className="how-ava-grid"
        >
          {/* Left: step list */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
            opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(-20px)',
            transition: 'all 0.6s ease 0.15s',
          }}>
            {STEPS.map((step, i) => {
              const isActive = step.id === activeId;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveId(step.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1.1rem 1.4rem',
                    borderRadius: 16,
                    border: `1px solid ${isActive ? step.accent + '55' : 'rgba(255,255,255,0.07)'}`,
                    background: isActive
                      ? `linear-gradient(135deg, ${step.accent}12, rgba(255,255,255,0.03))`
                      : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'left',
                    width: '100%',
                    boxShadow: isActive ? `0 0 24px ${step.accent}20` : 'none',
                    transform: isActive ? 'translateX(4px)' : 'none',
                  }}
                >
                  {/* Step number */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? step.accent : 'rgba(255,255,255,0.06)',
                    fontSize: '0.72rem', fontWeight: 800, color: isActive ? '#000' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.25s ease',
                  }}>
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div style={{ color: isActive ? step.accent : 'rgba(255,255,255,0.35)', transition: 'color 0.25s ease', flexShrink: 0 }}>
                    {step.icon}
                  </div>

                  {/* Label */}
                  <span style={{
                    fontSize: '0.95rem', fontWeight: 700,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'color 0.25s ease',
                    letterSpacing: '-0.01em',
                  }}>
                    {step.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: step.accent, boxShadow: `0 0 8px ${step.accent}` }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: demo card */}
          <div style={{
            opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(20px)',
            transition: 'all 0.6s ease 0.25s',
          }}>
            <div
              key={activeId}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${active.accent}35`,
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: `0 0 0 1px ${active.accent}15, 0 30px 60px rgba(0,0,0,0.4), 0 0 40px ${active.accent}12`,
                animation: 'fadeSlideIn 0.35s ease',
              }}
            >
              {/* Card header */}
              <div style={{
                padding: '1.25rem 1.75rem',
                borderBottom: `1px solid ${active.accent}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${active.accent}10, rgba(255,255,255,0.02))`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {['#EF4444','#FBBF24','#22C55E'].map(c => (
                      <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                    ))}
                  </div>
                  <Waveform accent={active.accent} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.8)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {active.demo.tag}
                  </span>
                </div>
              </div>

              {/* Demo title */}
              <div style={{ padding: '1.25rem 1.75rem 0.75rem', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: active.accent, marginBottom: '0.3rem' }}>
                  {active.label}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                  {active.demo.title}
                </div>
              </div>

              {/* Conversation */}
              <div style={{ padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {active.demo.lines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: line.from === 'ava' ? 'row' : 'row-reverse',
                      gap: '0.65rem',
                      animation: `fadeSlideIn 0.3s ease ${(i * 0.07).toFixed(2)}s both`,
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: line.from === 'ava'
                        ? `linear-gradient(135deg, ${active.accent}, #7C3AED)`
                        : 'rgba(255,255,255,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 700, color: '#fff',
                    }}>
                      {line.from === 'ava' ? 'A' : 'C'}
                    </div>

                    {/* Bubble */}
                    <div style={{
                      maxWidth: '78%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: line.from === 'ava' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      background: line.from === 'ava'
                        ? `linear-gradient(135deg, ${active.accent}18, rgba(255,255,255,0.04))`
                        : 'rgba(255,255,255,0.07)',
                      border: `1px solid ${line.from === 'ava' ? active.accent + '30' : 'rgba(255,255,255,0.08)'}`,
                      fontSize: '0.83rem',
                      color: 'rgba(255,255,255,0.82)',
                      lineHeight: 1.6,
                    }}>
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .how-ava-grid { grid-template-columns: 1fr !important; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </section>
  );
};

export default HowAvaWorks;
