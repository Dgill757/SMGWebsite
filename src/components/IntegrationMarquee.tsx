import React from 'react';

const integrations = [
  { name: 'ServiceTitan', icon: '⚙️' },
  { name: 'Jobber', icon: '🔧' },
  { name: 'HubSpot', icon: '🟠' },
  { name: 'Roof Link', icon: '🏠' },
  { name: 'Zapier', icon: '⚡' },
  { name: 'Make.com', icon: '🔄' },
  { name: 'GoHighLevel', icon: '📈' },
  { name: 'Google Calendar', icon: '📅' },
  { name: 'Twilio', icon: '📞' },
  { name: 'Salesforce', icon: '☁️' },
  { name: 'Outlook', icon: '📧' },
  { name: 'Slack', icon: '💬' },
];

// Duplicate for seamless loop
const items = [...integrations, ...integrations];

export function IntegrationMarquee() {
  return (
    <section style={{
      padding: '48px 0 32px',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      background: 'rgba(0,217,255,0.02)',
      position: 'relative',
    }}>
      {/* Fade edges */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '120px', height: '100%',
        background: 'linear-gradient(to right, rgba(0,8,16,1), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '120px', height: '100%',
        background: 'linear-gradient(to left, rgba(0,8,16,1), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <p style={{
        textAlign: 'center',
        fontSize: '0.7rem',
        letterSpacing: '0.14em',
        color: 'rgba(0,217,255,0.6)',
        fontWeight: 700,
        marginBottom: '24px',
        textTransform: 'uppercase',
      }}>
        Works With Your Existing Systems
      </p>

      <div className="marquee-track">
        {items.map((item, i) => (
          <div key={i} className="marquee-item">
            <span className="marquee-icon">{item.icon}</span>
            <span className="marquee-name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
