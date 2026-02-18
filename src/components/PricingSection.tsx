import React, { useState, useRef, useEffect } from 'react';

interface PricingSectionProps { onOpenCalendar: () => void; }

const TIERS = [
  {
    name: 'Starter', icon: '🚀',
    tagline: 'Perfect for solo operators who want to sound big and never miss a lead.',
    monthly: 621, annual: 497, annualTotal: 5964,
    accent: '#3B82F6',
    features: [
      'Smart Voice AI Assistant (Web + Call)',
      'Website widget integration',
      'Call handling (pay-as-you-go: $0.18/min)',
      'Basic appointment scheduling',
      'CRM integration',
      'Lead capture & qualification',
      'Email & SMS notifications',
      'Customer data collection',
      'Standard business hours support',
    ],
    cta: 'Get Started', popular: false,
  },
  {
    name: 'Professional', icon: '⚡',
    tagline: 'Turn your AI into a fully functioning sales assistant. Most popular.',
    monthly: 1245, annual: 997, annualTotal: 11964,
    accent: '#7C3AED',
    features: [
      'Everything in Starter, plus:',
      'Custom CRM pipeline & workflow build-out',
      'Lead nurturing automation (calls, emails, texts)',
      'Calendar & scheduling integrations',
      'Enhanced lead qualification & routing',
      'Custom AI voice & tone configuration',
      'Priority support',
    ],
    cta: 'Get Started', popular: true,
  },
  {
    name: 'Enterprise', icon: '🏢',
    tagline: 'Tailored to your exact sales operations — we build and manage it for you.',
    monthly: 0, annual: 0, annualTotal: 0,
    accent: '#F472B6',
    features: [
      'Everything in Professional, plus:',
      'Multi-location routing & support',
      'Advanced analytics & reporting',
      'CRM syncing & custom integrations',
      'Custom workflows, scripts & sales triggers',
      'Dedicated account manager',
      'Payment processing integration',
      'Custom onboarding & AI management',
    ],
    cta: 'Contact Sales', popular: false,
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

const PricingSection: React.FC<PricingSectionProps> = ({ onOpenCalendar }) => {
  const [annual, setAnnual] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section ref={sectionRef} id="pricing"
      style={{ position: 'relative', background: '#07070A', padding: '7rem 0', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 800, height: 600, top: '50%', left: '50%', transform: 'translate(-50%,-55%)', background: 'radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 60%)' }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            Pricing
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1.2rem' }}>
            Simple,{' '}
            <span style={{ background: 'linear-gradient(135deg,#7C3AED,#3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Transparent</span>
            {' '}Pricing
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 480, margin: '0 auto 2rem' }}>
            All plans include Ava's core Voice AI. No hidden fees. Cancel anytime.
          </p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '0.4rem 0.4rem 0.4rem 1rem' }}>
            <span style={{ fontSize: '0.85rem', color: annual ? 'rgba(255,255,255,0.4)' : '#fff', fontWeight: 500, transition: 'color 0.3s' }}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} style={{
              width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative',
              background: annual ? 'linear-gradient(135deg,#7C3AED,#3B82F6)' : 'rgba(255,255,255,0.15)',
              transition: 'background 0.3s',
            }}>
              <div style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', left: annual ? 23 : 3 }} />
            </button>
            <span style={{ fontSize: '0.85rem', color: annual ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: 500, transition: 'color 0.3s' }}>Annual</span>
            <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 999, padding: '0.25rem 0.75rem', fontSize: '0.75rem', color: '#22C55E', fontWeight: 700 }}>
              Save 20%
            </div>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', alignItems: 'start' }} className="grid-cols-1 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <div key={tier.name} style={{
              position: 'relative', borderRadius: 24, overflow: 'hidden',
              background: tier.popular ? `linear-gradient(160deg,${tier.accent}15,rgba(5,5,7,0.95))` : 'rgba(255,255,255,0.025)',
              border: `1px solid ${tier.popular ? `${tier.accent}45` : 'rgba(255,255,255,0.07)'}`,
              transform: tier.popular ? 'scale(1.03)' : 'scale(1)',
              boxShadow: tier.popular ? `0 0 0 1px ${tier.accent}30, 0 40px 80px rgba(0,0,0,0.5), 0 0 60px ${tier.accent}15` : 'none',
              opacity: inView ? 1 : 0, transition: `all 0.5s ease ${i * 0.1 + 0.2}s`,
            }}>
              {tier.popular && (
                <div style={{ position: 'absolute', top: 0, right: 0, background: `linear-gradient(135deg,${tier.accent},#3B82F6)`, padding: '0.35rem 1.2rem', fontSize: '0.72rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', borderBottomLeftRadius: 12 }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ padding: '2.5rem 2rem' }}>
                {/* Tier Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${tier.accent}18`, border: `1px solid ${tier.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    {tier.icon}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{tier.name}</div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {tier.name === 'Enterprise' ? (
                    <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>Custom</div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>$</span>
                        <span style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                          {annual ? tier.annual : tier.monthly}
                        </span>
                        <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>/mo</span>
                      </div>
                      {annual && (
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem' }}>
                          Billed annually — ${tier.annualTotal.toLocaleString()}/yr
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Tagline */}
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '1.75rem', minHeight: 52 }}>
                  {tier.tagline}
                </p>

                {/* CTA */}
                <button onClick={onOpenCalendar} style={{
                  width: '100%', padding: '0.85rem', borderRadius: 12, cursor: 'pointer',
                  fontSize: '0.9rem', fontWeight: 700, transition: 'all 0.3s ease', marginBottom: '2rem',
                  background: tier.popular
                    ? `linear-gradient(135deg,${tier.accent},#3B82F6)`
                    : `${tier.accent}18`,
                  color: tier.popular ? '#fff' : tier.accent,
                  border: tier.popular ? 'none' : `1px solid ${tier.accent}35`,
                  boxShadow: tier.popular ? `0 8px 30px ${tier.accent}40` : 'none',
                }}>
                  {tier.cta}
                </button>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: '1.5rem' }} />

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {tier.features.map((feat) => (
                    <div key={feat} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                      {feat.startsWith('Everything') ? (
                        <span style={{ fontSize: '0.82rem', color: tier.accent, fontWeight: 600 }}>{feat}</span>
                      ) : (
                        <>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', background: `${tier.accent}18`, border: `1px solid ${tier.accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={tier.accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                          <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{feat}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ textAlign: 'center', marginTop: '3rem', opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease 0.6s' }}>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
            Questions? We'll build you a custom ROI projection before you commit to anything.
          </p>
          <button onClick={onOpenCalendar} className="btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '0.875rem' }}>
            Talk to Our Team
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
