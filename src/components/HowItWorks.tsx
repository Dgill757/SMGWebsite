import React, { useState, useRef, useEffect } from 'react';

const STEPS = [
  {
    num: '01',
    id: 'call',
    title: 'Ava Answers Every Call',
    description:
      'The moment someone calls your business or clicks the voice widget on your site, Ava answers instantly — no hold music, no missed calls. She engages in fluid, natural conversation that feels completely human.',
    highlight: 'Zero missed calls. Ever.',
    accent: '#7C3AED',
    visual: (
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 16, padding: '1.25rem', marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7C3AED,#3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Incoming call</div>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>+1 (555) 823-4491</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem' }}>
              {[...Array(5)].map((_,i) => (
                <div key={i} style={{
                  width: 3, borderRadius: 2, background: '#7C3AED',
                  height: `${8 + Math.sin(i) * 8}px`,
                  animation: `wave 1.2s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }} />
              ))}
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>
            "Hi, this is Ava with Summit Voice AI! How can I help you today?"
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 10, padding: '0.75rem 1rem',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
          <span style={{ fontSize: '0.8rem', color: '#22C55E', fontWeight: 600 }}>Call connected — response time: 0.3s</span>
        </div>
      </div>
    ),
  },
  {
    num: '02',
    id: 'qualify',
    title: 'Qualifies & Books',
    description:
      'Ava intelligently assesses each caller — their intent, budget, urgency, and fit. High-value leads get booked directly into your calendar. Low-quality leads get filtered. Your time is protected.',
    highlight: 'Only real buyers reach you.',
    accent: '#3B82F6',
    visual: (
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Service needed', value: 'HVAC Repair', done: true },
            { label: 'Budget range', value: '$500 – $2,000', done: true },
            { label: 'Timeline', value: 'This week (urgent)', done: true },
            { label: 'Appointment', value: 'Tue Mar 12, 2pm', done: true },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: 12, padding: '0.85rem 1.1rem',
            }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{item.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{item.value}</span>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: '03',
    id: 'followup',
    title: 'Auto Follow-Up',
    description:
      'After every call, Ava automatically sends confirmation texts, reminder emails, and follow-up sequences. No-shows drop. Conversion rates climb. All on autopilot.',
    highlight: 'Your CRM, always up to date.',
    accent: '#F472B6',
    visual: (
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[
          { icon: '📱', label: 'SMS Confirmation', time: 'Sent instantly', color: '#F472B6' },
          { icon: '📧', label: 'Email Reminder', time: '24h before appt.', color: '#7C3AED' },
          { icon: '🔔', label: 'CRM Updated', time: 'Real-time sync', color: '#3B82F6' },
          { icon: '📊', label: 'Lead Score Logged', time: 'Auto-tagged', color: '#22C55E' },
        ].map((item) => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: '0.9rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '0.85rem 1.1rem',
          }}>
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{item.time}</div>
            </div>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: item.color,
              boxShadow: `0 0 8px ${item.color}`,
            }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '04',
    id: 'revenue',
    title: 'Revenue Grows 24/7',
    description:
      'While you sleep, Ava keeps working — answering calls, booking appointments, and closing more leads. Month over month, you see the compound effect: more revenue with less overhead.',
    highlight: 'Average client ROI: 684%',
    accent: '#7C3AED',
    visual: (
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '1.25rem',
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', fontWeight: 500, letterSpacing: '0.06em' }}>
            MONTHLY REVENUE IMPACT
          </div>
          {[
            { month: 'Before Ava', value: 45, label: '$22K' },
            { month: 'Month 1', value: 65, label: '$32K' },
            { month: 'Month 3', value: 85, label: '$42K' },
            { month: 'Month 6', value: 100, label: '$67K+' },
          ].map((bar, i) => (
            <div key={bar.month} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{bar.month}</span>
                <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>{bar.label}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${bar.value}%`, borderRadius: 3,
                  background: i === 0
                    ? 'rgba(255,255,255,0.2)'
                    : `linear-gradient(90deg, #7C3AED, #3B82F6)`,
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

const HowItWorks: React.FC = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      style={{ position: 'relative', background: '#07070A', padding: '7rem 0', overflow: 'hidden' }}
    >
      {/* BG */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 800, height: 800, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 60%)', borderRadius: '50%' }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            The Journey
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.15, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1.2rem', overflowWrap: 'break-word' }}>
            How Ava Turns Calls Into{' '}
            <span style={{ background: 'linear-gradient(135deg,#7C3AED,#F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Closed Revenue</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>
            Four seamless steps. Zero manual work. Compounding returns every month.
          </p>
        </div>

        {/* Step Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="how-it-works-grid">

          {/* Left: Step List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {STEPS.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActive(i)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                  padding: '1.5rem',
                  background: active === i ? `${step.accent}10` : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${active === i ? `${step.accent}35` : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 18, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.3s ease',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'none' : 'translateX(-20px)',
                  transitionDelay: `${i * 0.1 + 0.2}s`,
                  boxShadow: active === i ? `0 0 0 1px ${step.accent}20, 0 8px 30px rgba(0,0,0,0.3)` : 'none',
                }}
              >
                <div style={{
                  fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em',
                  color: active === i ? step.accent : 'rgba(255,255,255,0.25)',
                  fontFamily: 'monospace', flexShrink: 0, paddingTop: '0.2rem',
                  transition: 'color 0.3s',
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '1rem', fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.65)',
                    marginBottom: '0.4rem', letterSpacing: '-0.01em', transition: 'color 0.3s',
                  }}>
                    {step.title}
                  </div>
                  {active === i && (
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                      {step.description}
                    </div>
                  )}
                  {active === i && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      marginTop: '0.75rem', fontSize: '0.78rem', color: step.accent, fontWeight: 600,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {step.highlight}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Right: Visual */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${STEPS[active].accent}25`,
            borderRadius: 24,
            overflow: 'hidden',
            transition: 'border-color 0.4s ease',
            display: 'flex', flexDirection: 'column',
            opacity: inView ? 1 : 0,
            transform: inView ? 'none' : 'translateX(20px)',
            transitionDelay: '0.3s',
          }}
            className="hidden md:flex"
          >
            {/* Top bar */}
            <div style={{
              padding: '1rem 1.5rem',
              background: `${STEPS[active].accent}10`,
              borderBottom: `1px solid ${STEPS[active].accent}20`,
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: STEPS[active].accent, boxShadow: `0 0 10px ${STEPS[active].accent}` }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                Step {STEPS[active].num} — {STEPS[active].title}
              </span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              {STEPS[active].visual}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
