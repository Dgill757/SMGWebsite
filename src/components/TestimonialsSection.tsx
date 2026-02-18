import React, { useState, useRef, useEffect } from 'react';

const TESTIMONIALS = [
  {
    name: 'John Peterson',
    role: 'Owner, Premier Roofing',
    avatar: 'JP',
    quote: 'We were missing 3–4 calls per day because our office staff was overwhelmed. Since Ava, we\'ve captured 100% of calls and increased monthly revenue by over $45,000. It pays for itself 50x over.',
    metrics: [
      { label: 'Appointments', value: '+127%' },
      { label: 'Monthly Revenue', value: '$45K+' },
      { label: 'Cost Reduction', value: '$8,500' },
    ],
    stars: 5, accent: '#7C3AED',
  },
  {
    name: 'Sarah Williams',
    role: 'CEO, Elite Home Services',
    avatar: 'SW',
    quote: 'Ava has become our best salesperson. She never forgets to follow up, always sticks to the script, and has increased our close rate by 43%. It\'s like having a 24/7 sales team that never asks for a raise.',
    metrics: [
      { label: 'Leads Captured', value: '100%' },
      { label: 'Close Rate', value: '+43%' },
      { label: 'ROI', value: '684%' },
    ],
    stars: 5, accent: '#3B82F6',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Director, Sunshine Plumbing',
    avatar: 'MR',
    quote: 'Emergency calls used to go to voicemail after hours — we lost those customers. Now Ava handles every call, qualifies the emergency, and dispatches our on-call tech. After-hours revenue is up 215%.',
    metrics: [
      { label: 'After-Hours Rev.', value: '+215%' },
      { label: 'Customer Sat.', value: '97%' },
      { label: 'Annual Savings', value: '$127K' },
    ],
    stars: 5, accent: '#F472B6',
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

const TestimonialsSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);
  const t = TESTIMONIALS[active];

  return (
    <section ref={sectionRef} id="testimonials"
      style={{ position: 'relative', background: '#07070A', padding: '7rem 0', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 800, height: 600, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 60%)' }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            Social Proof
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1.2rem' }}>
            What Our <span style={{ background: 'linear-gradient(135deg,#7C3AED,#F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Clients</span> Say
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 480, margin: '0 auto' }}>
            Real results from real businesses that made the switch to Voice AI.
          </p>
        </div>

        {/* Main Card */}
        <div style={{
          background: 'rgba(255,255,255,0.025)', border: `1px solid ${t.accent}25`,
          borderRadius: 28, overflow: 'hidden',
          opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)',
          transition: 'all 0.6s ease 0.2s, border-color 0.4s',
          display: 'grid', gridTemplateColumns: '1fr 1.8fr',
        }} className="grid-cols-1 md:grid-cols-testimonial">
          {/* Left: Person */}
          <div style={{ padding: '3rem 2.5rem', background: `linear-gradient(160deg, ${t.accent}18, rgba(0,0,0,0.3))`, borderRight: `1px solid ${t.accent}15`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%', marginBottom: '1.5rem',
              background: `linear-gradient(135deg,${t.accent},#3B82F6)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 800, color: '#fff',
              border: `3px solid ${t.accent}40`,
              boxShadow: `0 0 40px ${t.accent}30`,
            }}>
              {t.avatar}
            </div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{t.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1rem' }}>{t.role}</div>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '2rem' }}>
              {[...Array(5)].map((_,i) => <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
            </div>
            {/* Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
              {t.metrics.map((m) => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '0.6rem 1rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{m.label}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: t.accent }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quote */}
          <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '5rem', color: t.accent, lineHeight: 0.7, marginBottom: '1.5rem', fontFamily: 'Georgia,serif', opacity: 0.35 }}>"</div>
            <p style={{ fontSize: 'clamp(1.1rem,2vw,1.4rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.72, fontStyle: 'italic', marginBottom: '2.5rem' }}>
              {t.quote}
            </p>
            {/* Nav dots */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {TESTIMONIALS.map((_,i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  height: 4, borderRadius: 2, border: 'none', cursor: 'pointer',
                  width: active === i ? 32 : 8,
                  background: active === i ? t.accent : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row: extra mini testimonials */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginTop: '1.5rem' }} className="grid-cols-1 md:grid-cols-3">
          {[
            { text: '"Ava paid for herself in the first week."', name: 'Tom R., HVAC Pro' },
            { text: '"Our no-show rate dropped from 28% to 4%. Unbelievable."', name: 'Dr. Kim C., Dentist' },
            { text: '"Best investment we\'ve made in 10 years of business."', name: 'Carla M., Realtor' },
          ].map((mini) => (
            <div key={mini.name} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.5rem', opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 0.5s' }}>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '0.75rem' }}>{mini.text}</p>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{mini.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
