import React from 'react';

const before = [
  { icon: '📵', text: 'Calls go to voicemail after hours' },
  { icon: '💸', text: 'Lose $3,000-$30,000+ per missed job while competitors answer' },
  { icon: '😤', text: 'Customers call your competitor instead' },
  { icon: '🗂️', text: 'Manually log calls into your CRM' },
  { icon: '😴', text: 'Zero coverage on weekends & holidays' },
  { icon: '🤷', text: "No idea how many leads you're losing" },
];

const after = [
  { icon: '✅', text: 'Every call answered in under 1 second' },
  { icon: '💰', text: 'Every lead captured and booked automatically' },
  { icon: '🏆', text: 'You get the job before they even hang up' },
  { icon: '🔄', text: 'Auto-syncs to ServiceTitan, HubSpot, GHL' },
  { icon: '🌙', text: '24/7/365 - Ava never sleeps or calls in sick' },
  { icon: '📊', text: 'Full call analytics and ROI dashboard' },
];

export function AvaComparison() {
  return (
    <section
      id="ava-comparison"
      style={{
        padding: '96px 24px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            color: 'rgba(0,217,255,0.7)',
            fontWeight: 700,
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}
        >
          The Difference Is Immediate
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Your Roofing Business,{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #00D9FF, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Before and After Ava
          </span>
        </h2>
        <p
          style={{
            fontSize: '0.98rem',
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.65,
            maxWidth: '760px',
            margin: '18px auto 0',
          }}
        >
          One client (Teo Roofing) booked 582 appointments in 12 months. That's $4.1M+ in
          recovered revenue. From one AI receptionist.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
        className="comparison-grid"
      >
        <div
          style={{
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '20px',
            padding: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#EF4444',
                boxShadow: '0 0 10px rgba(239,68,68,0.6)',
              }}
            />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'rgba(239,68,68,0.9)',
                textTransform: 'uppercase',
              }}
            >
              Without Ava
            </span>
          </div>
          {before.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                marginBottom: i < before.length - 1 ? '16px' : 0,
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(239,68,68,0.04)',
              }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'rgba(0,217,255,0.04)',
            border: '1px solid rgba(0,217,255,0.25)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 0 40px rgba(0,217,255,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#00D9FF',
                boxShadow: '0 0 10px rgba(0,217,255,0.8)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#00D9FF',
                textTransform: 'uppercase',
              }}
            >
              With Ava
            </span>
          </div>
          {after.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                marginBottom: i < after.length - 1 ? '16px' : 0,
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(0,217,255,0.03)',
              }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .comparison-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
