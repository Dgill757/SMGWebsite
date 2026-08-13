import React from 'react';

const stats = [
  { value: '$84M+', label: 'Client Revenue Recovered' },
  { value: '42+', label: 'Active Roofing & Service Companies' },
  { value: '582', label: 'Appointments Booked - 1 Client, 1 Year' },
  { value: '100%', label: 'Call Answer Rate, 24/7/365' },
];

export function SocialProofBar() {
  return (
    <div style={{
      background: 'rgba(0,217,255,0.03)',
      borderTop: '1px solid rgba(0,217,255,0.1)',
      borderBottom: '1px solid rgba(0,217,255,0.1)',
      padding: '28px 24px',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        textAlign: 'center',
      }}
      className="social-proof-grid"
      >
        {stats.map((stat, i) => (
          <div key={i}>
            <div style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 800,
              color: '#00D9FF',
              lineHeight: 1.1,
              marginBottom: '4px',
              textShadow: '0 0 20px rgba(0,217,255,0.4)',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .social-proof-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
