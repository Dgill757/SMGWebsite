import React, { useState, useRef, useEffect } from 'react';

const INDUSTRIES = [
  {
    id: 'home-services', icon: '🔧', name: 'Home Services',
    tag: 'Plumbers · HVAC · Electricians · Landscapers',
    description: 'Home service pros miss 30–40% of calls during busy seasons. Ava captures every lead, qualifies the job scope, and books your techs — even at 2am on a Sunday.',
    benefits: [
      { title: 'Emergency Call Capture', desc: 'Never lose a burst pipe or no-heat call to voicemail again.' },
      { title: 'Tech Scheduling', desc: 'Schedule by location to minimize drive time and maximize jobs per day.' },
      { title: 'Pre-Visit Intel', desc: 'Collect issue details before arrival so techs show up prepared.' },
    ],
    testimonial: { quote: 'We were missing 5 calls a day after hours. Ava answers every one. Revenue up 40% in two months.', author: 'Michael J.', company: 'Comfort Air Systems' },
    metrics: ['↑ 40% Revenue', '0 Missed Calls', '$8,500/mo Saved'], accent: '#7C3AED',
  },
  {
    id: 'real-estate', icon: '🏠', name: 'Real Estate',
    tag: 'Agents · Brokers · Property Managers',
    description: 'Buyers expect instant responses. Ava pre-qualifies every inquiry, auto-schedules showings, and sends listing details — so you only meet serious buyers.',
    benefits: [
      { title: 'Instant Inquiry Response', desc: 'Every showing request answered before your competitor wakes up.' },
      { title: 'Buyer Pre-Qualification', desc: 'Ava screens for budget, timeline, and financing first.' },
      { title: 'Listing Details on Demand', desc: 'Auto-send MLS links and virtual tours during the call.' },
    ],
    testimonial: { quote: "Ava pre-qualifies prospects and only sends me serious buyers. I've saved 15 hours a week.", author: 'Sarah L.', company: 'Premier Properties' },
    metrics: ['3x More Showings', '15 hrs/wk Saved', '↑ 52% Close Rate'], accent: '#3B82F6',
  },
  {
    id: 'healthcare', icon: '🏥', name: 'Healthcare',
    tag: 'Medical · Dental · Wellness · Clinics',
    description: 'Overwhelmed front desks lose patients to competitors who answer faster. Ava schedules appointments and reduces no-shows with automated reminders.',
    benefits: [
      { title: 'After-Hours Scheduling', desc: 'Patients book at 11pm. No staff required, no lost opportunity.' },
      { title: 'Insurance Pre-Screening', desc: 'Collect insurance info to eliminate billing delays.' },
      { title: 'No-Show Reduction', desc: 'Automated reminder sequences cut no-shows by up to 60%.' },
    ],
    testimonial: { quote: 'We reduced front desk staffing 50% while patient satisfaction scores went up.', author: 'Dr. Amanda R.', company: 'Bright Smile Dental' },
    metrics: ['↓ 60% No-Shows', '50% Fewer Staff Costs', '↑ 4.9★ Reviews'], accent: '#F472B6',
  },
  {
    id: 'legal', icon: '⚖️', name: 'Legal Services',
    tag: 'Law Firms · Solo Practitioners',
    description: 'Every missed call from a potential client is revenue walking to your competition. Ava conducts initial intake and fills your consultation calendar automatically.',
    benefits: [
      { title: 'Case Intake Automation', desc: 'Collect incident details before the first consultation.' },
      { title: 'Practice Area Routing', desc: 'Route callers to the right attorney based on case type.' },
      { title: 'Retainer Follow-Up', desc: 'Automated sequences nurture undecided prospects.' },
    ],
    testimonial: { quote: 'Ava qualifies leads and schedules consultations so I can focus on actual legal work.', author: 'James W., Esq.', company: 'West Law Partners' },
    metrics: ['↑ 68% Consultations', '$127K Annual Value', '0 Intake Delays'], accent: '#7C3AED',
  },
  {
    id: 'automotive', icon: '🚗', name: 'Automotive',
    tag: 'Dealerships · Repair Shops · Detailers',
    description: 'Ava handles appointment booking, captures vehicle info upfront, and sends automated status updates — so your advisors focus on cars, not calls.',
    benefits: [
      { title: 'Service Appointment Booking', desc: 'Capture vehicle make, model, mileage, and issue at time of booking.' },
      { title: 'Recall & Warranty Reminders', desc: 'Automated outreach fills your schedule months in advance.' },
      { title: 'Repair Status Updates', desc: 'Customers get proactive SMS — zero "is my car ready?" calls.' },
    ],
    testimonial: { quote: 'Appointment bookings up 35%, no-shows virtually eliminated. The ROI is incredible.', author: 'Robert T.', company: 'Precision Auto Care' },
    metrics: ['↑ 35% Bookings', '↓ 90% No-Shows', '↑ 215% After-Hours Rev.'], accent: '#3B82F6',
  },
  {
    id: 'professional', icon: '💼', name: 'Professional Services',
    tag: 'Consultants · Financial · Marketing',
    description: 'Chasing unqualified leads is the biggest time drain. Ava pre-screens every prospect against your ideal client profile before they reach your calendar.',
    benefits: [
      { title: 'ICP Screening', desc: 'Define your ideal client; Ava only books calls that match.' },
      { title: 'Discovery Call Prep', desc: 'Ava collects goals, budget, and challenges before the first meeting.' },
      { title: 'Proposal Follow-Up', desc: 'Automated nudges on sent proposals improve close rates 30%+.' },
    ],
    testimonial: { quote: 'Ava prescreens and only books meetings with clients matching our ideal profile. Game changer.', author: 'Lisa M.', company: 'Digital Growth Partners' },
    metrics: ['↑ 82% Qualified Leads', '↓ 70% Wasted Calls', '↑ 30% Close Rate'], accent: '#F472B6',
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

const UseCases: React.FC = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);
  const ind = INDUSTRIES[active];

  return (
    <section ref={sectionRef} id="use-cases"
      style={{ position: 'relative', background: '#050507', padding: '7rem 0', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 700, height: 700, top: -200, left: -200, background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, bottom: -100, right: -100, background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)', borderRadius: '50%' }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            Industry Solutions
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1.2rem' }}>
            Built for <span style={{ background: 'linear-gradient(135deg,#3B82F6,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Industry</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>
            Ava is trained and customized for your specific industry, language, and workflows.
          </p>
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '3.5rem' }}>
          {INDUSTRIES.map((ind2, i) => (
            <button key={ind2.id} onClick={() => setActive(i)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.2rem',
              background: active === i ? `${ind2.accent}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${active === i ? `${ind2.accent}45` : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 999, cursor: 'pointer', transition: 'all 0.25s ease',
              color: active === i ? ind2.accent : 'rgba(255,255,255,0.55)',
              fontSize: '0.875rem', fontWeight: active === i ? 600 : 500,
            }}>
              <span style={{ fontSize: '1rem' }}>{ind2.icon}</span>{ind2.name}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(3,1fr)' }} className="use-cases-content-grid">
          {/* Description */}
          <div style={{ background: `${ind.accent}0D`, border: `1px solid ${ind.accent}25`, borderRadius: 24, padding: '2rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: 'all 0.5s ease 0.1s' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{ind.icon}</div>
            <div style={{ fontSize: '0.7rem', color: ind.accent, fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.5rem', textTransform: 'uppercase' as const }}>{ind.tag}</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>{ind.name}</h3>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{ind.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ind.metrics.map((m) => (
                <div key={m} style={{ padding: '0.5rem 0.85rem', background: `${ind.accent}15`, border: `1px solid ${ind.accent}30`, borderRadius: 8, fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{m}</div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '2rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: 'all 0.5s ease 0.2s' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '1.5rem', textTransform: 'uppercase' as const }}>Key Benefits</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {ind.benefits.map((b, i) => (
                <div key={b.title} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: `${ind.accent}18`, border: `1px solid ${ind.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: ind.accent, fontFamily: 'monospace' }}>
                    {String(i+1).padStart(2,'0')}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>{b.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.6 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: 'all 0.5s ease 0.3s' }}>
            <div>
              <div style={{ fontSize: '3.5rem', color: ind.accent, lineHeight: 0.75, marginBottom: '1.5rem', fontFamily: 'Georgia,serif', opacity: 0.5 }}>"</div>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '2rem' }}>{ind.testimonial.quote}</p>
            </div>
            <div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: '1.25rem' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg,${ind.accent},#3B82F6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                  {ind.testimonial.author[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{ind.testimonial.author}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{ind.testimonial.company}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_,i) => <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
