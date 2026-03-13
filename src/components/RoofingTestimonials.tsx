import React from 'react';

const testimonials = [
  {
    company: 'Teo Roofing',
    name: 'Teo',
    role: 'Owner',
    quote: 'We booked 582 appointments in 12 months. Ava answers calls we used to miss completely. That\'s over $4 million in revenue we would have left on the table.',
    metric: '582 Appointments / Year',
    initials: 'TR',
    color: '#00D9FF',
  },
  {
    company: 'Stonewall Roofing',
    name: 'Owner',
    role: 'Founder',
    quote: 'Before Ava, half our after-hours leads never called back. Now every call gets answered, every lead gets booked. It\'s like having a full office team at 3am.',
    metric: '100% After-Hours Coverage',
    initials: 'SR',
    color: '#7C3AED',
  },
  {
    company: 'Black Label Roofing',
    name: 'Owner',
    role: 'CEO',
    quote: 'I was skeptical an AI could represent my brand. Within the first week Ava booked 11 appointments I would have missed. The ROI was immediate.',
    metric: '11 Appts - Week 1',
    initials: 'BL',
    color: '#00D9FF',
  },
  {
    company: 'Impact Roofing',
    name: 'Owner',
    role: 'General Manager',
    quote: 'Our crews are booked out 3 weeks. Ava handles the intake, qualifies every lead, and syncs it straight into our CRM. We\'ve never been more efficient.',
    metric: 'Booked 3 Weeks Out',
    initials: 'IR',
    color: '#7C3AED',
  },
  {
    company: 'Proof Roofing',
    name: 'Owner',
    role: 'Owner/Operator',
    quote: 'We went from missing 60% of our leads to capturing 100% of them. The math is simple - at $15,000 per job, every saved call is a massive win.',
    metric: '60% -> 100% Lead Capture',
    initials: 'PR',
    color: '#00D9FF',
  },
  {
    company: 'Summit Client',
    name: 'Healthcare Director',
    role: 'Medical Practice',
    quote: 'Ava handles our after-hours patient inquiries flawlessly. Appointment booking, triage routing, follow-up - all automated. Our staff finally gets to focus on care.',
    metric: '40% Admin Time Saved',
    initials: 'HC',
    color: '#7C3AED',
  },
];

const doubled = [...testimonials, ...testimonials];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: '320px',
        margin: '0 10px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'border-color 0.25s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${t.color}40`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${t.color}30, ${t.color}10)`,
            border: `2px solid ${t.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: t.color,
            flexShrink: 0,
          }}
        >
          {t.initials}
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
            {t.company}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
            {t.name} · {t.role}
          </div>
        </div>
      </div>

      <p
        style={{
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.65,
          margin: 0,
          fontStyle: 'italic',
        }}
      >
        "{t.quote}"
      </p>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '999px',
          background: `${t.color}12`,
          border: `1px solid ${t.color}25`,
          fontSize: '0.7rem',
          fontWeight: 700,
          color: t.color,
          letterSpacing: '0.04em',
          alignSelf: 'flex-start',
        }}
      >
        📊 {t.metric}
      </div>
    </div>
  );
}

export function RoofingTestimonials() {
  return (
    <section style={{ padding: '80px 0', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px', padding: '0 24px' }}>
        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            color: 'rgba(0,217,255,0.7)',
            fontWeight: 700,
            marginBottom: '12px',
            textTransform: 'uppercase',
          }}
        >
          What Roofing Business Owners Are Saying
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 12px',
            lineHeight: 1.2,
          }}
        >
          42+ Businesses. Millions Recovered.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
          Real results from roofing companies that stopped losing leads after hours.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '120px',
            height: '100%',
            background: 'linear-gradient(to right, rgba(0,8,16,1), transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '100%',
            background: 'linear-gradient(to left, rgba(0,8,16,1), transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{ display: 'flex', width: 'max-content', animation: 'testimonial-scroll 50s linear infinite' }}
          onMouseEnter={e => {
            e.currentTarget.style.animationPlayState = 'paused';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.animationPlayState = 'running';
          }}
        >
          {doubled.map((t, i) => <TestimonialCard key={i} t={t} />)}
        </div>
      </div>

      <style>{`
        @keyframes testimonial-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
