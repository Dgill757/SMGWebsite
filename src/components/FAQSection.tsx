import React, { useState, useRef, useEffect } from 'react';

const FAQS = [
  {
    q: 'How does Ava actually sound? Is it robotic?',
    a: 'Ava uses the latest natural language technology to deliver conversations that sound completely human. Most callers cannot tell they\'re speaking with an AI. You can choose from several voice profiles and customize her tone and personality to match your brand perfectly.',
  },
  {
    q: 'Will Ava work with my existing business phone number?',
    a: 'Yes. We integrate with your existing phone system or provide a dedicated number that forwards to Ava. She can handle calls end-to-end, or transfer to your team whenever needed — you\'re in complete control of the workflow.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most clients are live within 24–48 hours. We handle the entire setup — phone integration, CRM connection, script configuration, and testing. You don\'t need any technical knowledge. We do it for you.',
  },
  {
    q: 'What happens when a caller has a complex question Ava can\'t answer?',
    a: 'Ava is trained to gracefully escalate to a human when needed. She can transfer live calls, leave detailed notes for your team, and send follow-up messages — so nothing falls through the cracks. Over time, you can expand what Ava handles as you get more comfortable.',
  },
  {
    q: 'Can Ava integrate with my CRM and calendar?',
    a: 'Yes. Ava integrates with GoHighLevel, HubSpot, Salesforce, Calendly, Google Calendar, and dozens of other platforms via native integrations and Zapier. Every lead captured, every appointment booked flows directly into your existing systems.',
  },
  {
    q: 'Is this HIPAA compliant for healthcare businesses?',
    a: 'Yes. We offer HIPAA-compliant configurations for healthcare clients. This includes encrypted call recordings, secure data handling, and BAA agreements. Talk to our team for specifics for your use case.',
  },
  {
    q: 'What\'s the ROI? How fast will I see results?',
    a: 'Most clients see positive ROI within the first 30 days. The average client saves $8,500/month in staffing costs and increases captured revenue by 40%+ in the first 90 days. We\'ll build you a custom ROI projection before you commit to anything.',
  },
  {
    q: 'Can I cancel or change plans at any time?',
    a: 'Absolutely. All plans are flexible. You can upgrade, downgrade, or cancel at any time. Annual plans are billed upfront for the discount, but we offer pro-rated credits if you need to change. No long-term lock-in.',
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

const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section ref={sectionRef} id="faq"
      style={{ position: 'relative', background: '#050507', padding: '7rem 0', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 700, height: 600, bottom: -200, right: -100, background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 65%)' }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        {/* Header */}
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

        {/* FAQ Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                style={{
                  background: isOpen ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isOpen ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 18, overflow: 'hidden', transition: 'all 0.3s ease',
                  opacity: inView ? 1 : 0, transitionDelay: `${i * 0.05 + 0.2}s`,
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  style={{
                    width: '100%', padding: '1.4rem 1.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                    background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: isOpen ? '#fff' : 'rgba(255,255,255,0.8)', letterSpacing: '-0.01em', lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: isOpen ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isOpen ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke={isOpen ? '#7C3AED' : 'rgba(255,255,255,0.5)'}
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 0.6s' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Still have questions?
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>
            Our team will build you a custom demo and ROI projection — no commitment required.
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
