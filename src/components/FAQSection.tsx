import React, { useState, useRef, useEffect } from 'react';

const FAQS = [
  {
    q: 'Will Ava sound robotic to my roofing customers?',
    a: 'No. Ava uses the same voice AI trusted by Fortune 500 companies. Most callers never realize they\'re talking to AI — they experience a fast, professional, helpful conversation. You can hear Ava live on this page right now.',
  },
  {
    q: 'What happens when a customer calls after hours or during a storm?',
    a: 'Ava answers in under 1 second, 24/7/365 — including Sunday nights, holidays, and peak storm season when your phones won\'t stop ringing. Every call answered. Every lead captured. Every appointment booked automatically.',
  },
  {
    q: 'How does Ava sync with ServiceTitan or my existing CRM?',
    a: 'Ava integrates with ServiceTitan, Jobber, HubSpot, GoHighLevel, and 5,000+ other tools via Zapier and Make. Every call note, lead, and booked appointment syncs automatically. Zero manual data entry.',
  },
  {
    q: 'How long does setup take for my roofing company?',
    a: 'Most clients are live within 48–72 hours. We handle everything — voice training, CRM integration, call routing, and scheduling rules. You don\'t touch a line of code.',
  },
  {
    q: 'What\'s the ROI compared to hiring a receptionist?',
    a: 'A full-time receptionist costs $45,000–$65,000/year and still misses after-hours calls. Ava costs as little as $16/day, answers 100% of calls, and pays for itself the moment it books the first job your receptionist would have missed. Teo Roofing recovered $4.1M+ in year one.',
  },
  {
    q: 'I\'m not a roofing company — can Ava still work for my business?',
    a: 'Absolutely. We serve home service businesses, healthcare clinics, real estate teams, pool companies, landscapers, and more. If you have inbound calls and leads you\'re losing, Ava solves that — regardless of your industry.',
  },
];

function useInView(ref: React.RefObject<Element>, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="faq"
      style={{ position: 'relative', background: '#050507', padding: '7rem 0', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 700, height: 600, bottom: -200, right: -100, background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 65%)' }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            FAQ
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1.2rem' }}>
            Questions?{' '}
            <span style={{ background: 'linear-gradient(135deg,#7C3AED,#3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Answered.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
            Everything you need to know before making the switch to Voice AI.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                style={{
                  background: isOpen ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isOpen ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 18,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  opacity: inView ? 1 : 0,
                  transitionDelay: `${i * 0.05 + 0.2}s`,
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '1.4rem 1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: isOpen ? '#fff' : 'rgba(255,255,255,0.8)', letterSpacing: '-0.01em', lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: isOpen ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${isOpen ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isOpen ? '#7C3AED' : 'rgba(255,255,255,0.5)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.75rem 1.5rem' }}>
                    <div style={{ height: 1, background: 'rgba(124,58,237,0.15)', marginBottom: '1.25rem' }} />
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.75 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 0.6s' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Still have questions?
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>
            Our team will build you a custom demo and ROI projection - no commitment required.
          </p>
          <a href="https://calendly.com/aivoice/call" target="_blank" rel="noreferrer noopener" className="btn-primary" style={{ display: 'inline-flex', padding: '0.85rem 2rem', textDecoration: 'none' }}>
            <span>Book a Free Demo</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
