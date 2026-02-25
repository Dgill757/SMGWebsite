import React, { useState, useRef, useEffect, useCallback } from 'react';

const TESTIMONIALS = [
  // ── Roofing (10) ──────────────────────────────────────────────────────────
  {
    name: 'John Peterson',
    role: 'Owner, Premier Roofing',
    avatar: 'JP',
    industry: 'Roofing',
    quote: 'We were missing 3–4 calls per day because our office staff was overwhelmed. Since Ava, we\'ve captured 100% of calls and increased monthly revenue by over $45,000. It pays for itself 50x over.',
    metrics: [
      { label: 'Appointments', value: '+127%' },
      { label: 'Monthly Revenue', value: '$45K+' },
      { label: 'Cost Reduction', value: '$8,500' },
    ],
    stars: 5, accent: '#7C3AED',
  },
  {
    name: 'Derek Calloway',
    role: 'Owner, Summit Ridge Roofing',
    avatar: 'DC',
    industry: 'Roofing',
    quote: 'Storm season used to be absolute chaos — phones ringing off the hook, jobs slipping through our fingers. Ava now handles the surge flawlessly. We booked 38 inspections in a single weekend.',
    metrics: [
      { label: 'Storm Leads Booked', value: '38/wknd' },
      { label: 'Response Time', value: '<30 sec' },
      { label: 'Revenue Lift', value: '+$62K' },
    ],
    stars: 5, accent: '#3B82F6',
  },
  {
    name: 'Marcus Webb',
    role: 'GM, All-Weather Roofing Co.',
    avatar: 'MW',
    industry: 'Roofing',
    quote: 'Our close rate jumped from 22% to 41% after deploying Ava. The instant response eliminates any window for the customer to call our competitor. We win because we\'re simply first.',
    metrics: [
      { label: 'Close Rate', value: '22% → 41%' },
      { label: 'Leads Lost', value: '0%' },
      { label: 'Annual ROI', value: '780%' },
    ],
    stars: 5, accent: '#F472B6',
  },
  {
    name: 'Tyler Henson',
    role: 'CEO, Apex Roofing Solutions',
    avatar: 'TH',
    industry: 'Roofing',
    quote: 'I was spending 3 hours a day returning missed calls — now Ava handles everything and I focus on the business. We\'ve grown 60% this year without adding a single admin employee.',
    metrics: [
      { label: 'Admin Hours Saved', value: '3 hrs/day' },
      { label: 'YoY Growth', value: '+60%' },
      { label: 'New Hires Needed', value: '0' },
    ],
    stars: 5, accent: '#7C3AED',
  },
  {
    name: 'Kevin Marsh',
    role: 'Owner, Reliable Roof & Restore',
    avatar: 'KM',
    industry: 'Roofing',
    quote: 'Ava qualifies every lead with the exact questions we trained it on. By the time a prospect gets to me, they\'re already pre-sold. My team closes jobs faster than ever before.',
    metrics: [
      { label: 'Pre-qualified Leads', value: '100%' },
      { label: 'Sales Cycle', value: '-40%' },
      { label: 'Revenue/Estimate', value: '+$3,200' },
    ],
    stars: 5, accent: '#3B82F6',
  },
  {
    name: 'Brandon Schultz',
    role: 'Partner, ProTech Roofing',
    avatar: 'BS',
    industry: 'Roofing',
    quote: 'We tested three AI answering services. Ava wasn\'t even close — it actually sounds human and adapts to the conversation. Our customers think they\'re talking to our front desk.',
    metrics: [
      { label: 'Customer Satisfaction', value: '96%' },
      { label: 'Callbacks Needed', value: '-88%' },
      { label: 'First-Call Book Rate', value: '73%' },
    ],
    stars: 5, accent: '#F472B6',
  },
  {
    name: 'Nathan Cruz',
    role: 'Owner, Cruz Roofing & Gutters',
    avatar: 'NC',
    industry: 'Roofing',
    quote: 'After-hours calls were going to voicemail and dying. Now Ava qualifies them, schedules the inspection, and sends a confirmation text — while I\'m watching my kids\' soccer games.',
    metrics: [
      { label: 'After-Hours Revenue', value: '+$18K/mo' },
      { label: 'Voicemails Left', value: '~0' },
      { label: 'Work-Life Balance', value: 'Restored' },
    ],
    stars: 5, accent: '#7C3AED',
  },
  {
    name: 'Ryan Whitfield',
    role: 'CEO, Elevation Roofing Group',
    avatar: 'RW',
    industry: 'Roofing',
    quote: 'We expanded to three markets this year and Ava scaled with us instantly. No additional phone staff, no training headaches — just consistent, professional call handling across every location.',
    metrics: [
      { label: 'Markets Expanded', value: '3x' },
      { label: 'Staff Added', value: '0' },
      { label: 'Monthly Revenue', value: '+$90K' },
    ],
    stars: 5, accent: '#3B82F6',
  },
  {
    name: 'Adam Fletcher',
    role: 'Owner, Pinnacle Roofing LLC',
    avatar: 'AF',
    industry: 'Roofing',
    quote: 'Insurance restoration is complex — lots of back-and-forth. Ava handles the intake, collects claim details, and books the adjuster walk-through. It\'s like having a licensed PA on staff.',
    metrics: [
      { label: 'Insurance Jobs/Month', value: '+34' },
      { label: 'Intake Time', value: '-70%' },
      { label: 'Annual Revenue Add', value: '$240K' },
    ],
    stars: 5, accent: '#F472B6',
  },
  {
    name: 'Greg Hammond',
    role: 'Director of Sales, Anchor Roofing',
    avatar: 'GH',
    industry: 'Roofing',
    quote: 'Our sales team used to spend mornings chasing down bad leads. Now Ava filters everything — only serious, ready-to-buy homeowners make it into our CRM. Productivity is through the roof.',
    metrics: [
      { label: 'Lead Quality Score', value: '+55%' },
      { label: 'Sales Team Productivity', value: '+80%' },
      { label: 'Cost per Acquisition', value: '-$420' },
    ],
    stars: 5, accent: '#7C3AED',
  },
  // ── HVAC (3) ──────────────────────────────────────────────────────────────
  {
    name: 'Sarah Williams',
    role: 'CEO, Elite Home Services (HVAC)',
    avatar: 'SW',
    industry: 'HVAC',
    quote: 'Ava has become our best salesperson. She never forgets to follow up, always sticks to the script, and has increased our close rate by 43%. It\'s like having a 24/7 sales team that never asks for a raise.',
    metrics: [
      { label: 'Leads Captured', value: '100%' },
      { label: 'Close Rate', value: '+43%' },
      { label: 'ROI', value: '684%' },
    ],
    stars: 5, accent: '#3B82F6',
  },
  {
    name: 'Tom Reilly',
    role: 'Owner, Arctic Air HVAC',
    avatar: 'TR',
    industry: 'HVAC',
    quote: 'Ava paid for herself in the first week. Summer heat wave hit and instead of dropping calls, we booked 47 tune-ups in 3 days. Competitors were getting voicemails. We were getting jobs.',
    metrics: [
      { label: 'Payback Period', value: '1 week' },
      { label: 'Tune-Ups in 3 Days', value: '47' },
      { label: 'Competitive Edge', value: 'Massive' },
    ],
    stars: 5, accent: '#F472B6',
  },
  {
    name: 'Lisa Park',
    role: 'Operations Manager, Cool Comfort HVAC',
    avatar: 'LP',
    industry: 'HVAC',
    quote: 'We integrated Ava with our service software in about 20 minutes. Now it auto-creates work orders and dispatches technicians from the same call that books the appointment. It\'s seamless.',
    metrics: [
      { label: 'Dispatch Automation', value: '100%' },
      { label: 'Integration Time', value: '20 min' },
      { label: 'Admin Overhead', value: '-65%' },
    ],
    stars: 5, accent: '#7C3AED',
  },
  // ── Plumbing (2) ──────────────────────────────────────────────────────────
  {
    name: 'Michael Rodriguez',
    role: 'Director, Sunshine Plumbing',
    avatar: 'MR',
    industry: 'Plumbing',
    quote: 'Emergency calls used to go to voicemail after hours — we lost those customers. Now Ava handles every call, qualifies the emergency, and dispatches our on-call tech. After-hours revenue is up 215%.',
    metrics: [
      { label: 'After-Hours Rev.', value: '+215%' },
      { label: 'Customer Sat.', value: '97%' },
      { label: 'Annual Savings', value: '$127K' },
    ],
    stars: 5, accent: '#F472B6',
  },
  {
    name: 'James Fontaine',
    role: 'Owner, Fontaine Plumbing & Drain',
    avatar: 'JF',
    industry: 'Plumbing',
    quote: 'We had a burst-pipe situation on a Sunday at 2am. Ava answered, triaged the emergency, sent the homeowner instructions to shut off the water, and had my on-call tech dispatched in 4 minutes. That\'s unbeatable.',
    metrics: [
      { label: 'Emergency Response', value: '4 min' },
      { label: 'After-Hours Jobs', value: '+$22K/mo' },
      { label: 'Customer Loyalty', value: '95%' },
    ],
    stars: 5, accent: '#3B82F6',
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

const AUTO_INTERVAL = 7000; // ms per slide

const TestimonialsSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);
  const t = TESTIMONIALS[active];

  // Detect prefers-reduced-motion
  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const goTo = useCallback((idx: number) => {
    setActive(idx);
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), [active, goTo]);
  const goNext = useCallback(() => goTo((active + 1) % TESTIMONIALS.length), [active, goTo]);

  // Keyboard left/right navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  // Auto-rotation with progress bar
  useEffect(() => {
    if (reducedMotion || paused || !inView) return;
    setProgress(0);
    const startTime = performance.now();

    const raf = { id: 0 };
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min((elapsed / AUTO_INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        raf.id = requestAnimationFrame(tick);
      } else {
        setActive((a) => (a + 1) % TESTIMONIALS.length);
        setProgress(0);
      }
    };
    raf.id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.id);
  }, [active, paused, inView, reducedMotion]);

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
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            background: 'rgba(255,255,255,0.025)', border: `1px solid ${t.accent}25`,
            borderRadius: 28, overflow: 'hidden',
            opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)',
            transition: 'all 0.6s ease 0.2s, border-color 0.4s',
            display: 'grid', gridTemplateColumns: '1fr 1.8fr',
          }}
          className="grid-cols-1 md:grid-cols-testimonial"
        >
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
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.4rem' }}>{t.role}</div>
            {/* Industry badge */}
            <div style={{
              display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: 999,
              background: `${t.accent}18`, border: `1px solid ${t.accent}30`,
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
              color: t.accent, textTransform: 'uppercase', marginBottom: '1.25rem',
            }}>
              {t.industry}
            </div>
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
            <p style={{ fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.72, fontStyle: 'italic', marginBottom: '2.5rem', flex: 1 }}>
              {t.quote}
            </p>

            {/* Nav: progress bar + arrows + dots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Progress bar */}
              {!reducedMotion && (
                <div style={{ height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 1,
                    background: `linear-gradient(90deg, ${t.accent}, ${t.accent}88)`,
                    width: `${progress}%`,
                    transition: 'width 0.05s linear',
                  }} />
                </div>
              )}
              {/* Arrow + dots row */}
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                {/* Prev arrow */}
                <button
                  onClick={goPrev}
                  aria-label="Previous testimonial"
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: `1px solid ${t.accent}30`,
                    background: `${t.accent}10`, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.2s ease', padding: 0,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${t.accent}28`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${t.accent}60`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${t.accent}10`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${t.accent}30`; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>

                {/* Dots */}
                {TESTIMONIALS.map((_,i) => (
                  <button key={i} onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    style={{
                      height: 4, borderRadius: 2, border: 'none', cursor: 'pointer',
                      width: active === i ? 28 : 6,
                      background: active === i ? t.accent : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease', padding: 0, flexShrink: 0,
                    }}
                  />
                ))}

                {/* Next arrow */}
                <button
                  onClick={goNext}
                  aria-label="Next testimonial"
                  style={{
                    width: 36, height: 36, borderRadius: '50%', border: `1px solid ${t.accent}30`,
                    background: `${t.accent}10`, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all 0.2s ease', padding: 0,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${t.accent}28`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${t.accent}60`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${t.accent}10`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${t.accent}30`; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>

                {/* Pause indicator */}
                {paused && (
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginLeft: 'auto', fontWeight: 500 }}>
                    Paused
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: mini testimonials (static quick hits) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginTop: '1.5rem' }} className="grid-cols-1 md:grid-cols-3">
          {[
            { text: '"Ava paid for herself in the first week. Best money we\'ve ever spent."', name: 'Tom R., HVAC Pro' },
            { text: '"Our no-show rate dropped from 28% to 4%. Absolutely unbelievable."', name: 'Dr. Kim C., Dentist' },
            { text: '"Best investment we\'ve made in 10 years of business — hands down."', name: 'Carla M., Realtor' },
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
