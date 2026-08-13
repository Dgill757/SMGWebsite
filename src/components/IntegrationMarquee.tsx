import React from 'react';

const integrations = [
  { name: 'ServiceTitan',    logo: '/logos/service-titan-logo-cropped.png' },
  { name: 'Jobber',          logo: '/logos/jobber-logo-cropped.png' },
  { name: 'HubSpot',         logo: '/logos/hubspot-logo-cropped.png' },
  { name: 'GoHighLevel',     logo: '/logos/GHL-logo-cropped.png' },
  { name: 'Zapier',          logo: '/logos/zapier-logo-cropped.png' },
  { name: 'Make',            logo: '/logos/make.come-logo-cropped.png' },
  { name: 'Google Calendar', logo: '/logos/google-calendar-logo-cropped.png' },
  { name: 'Twilio',          logo: '/logos/twilio-logo-cropped.png' },
  { name: 'Salesforce',      logo: '/logos/salesforce-logo-cropped.png' },
  { name: 'Outlook',         logo: '/logos/outlook-logo-cropped.png' },
  { name: 'Slack',           logo: '/logos/slack-logo-cropped.png' },
  { name: 'AccuLynx',        logo: '/logos/Acculynx-logo-cropped.png' },
  { name: 'Roof Link',       logo: '/logos/roof-link-logo-cropped.png' },
  { name: 'Housecall Pro',   logo: '/logos/housecall-logo-cropped.png' },
];

const items = [...integrations, ...integrations, ...integrations];

export function IntegrationMarquee() {
  return (
    <div style={{
      padding: '32px 0 28px',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      position: 'relative',
    }}>
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
        textAlign: 'center', fontSize: '0.67rem', letterSpacing: '0.14em',
        color: 'rgba(0,217,255,0.55)', fontWeight: 700, marginBottom: '20px',
        textTransform: 'uppercase',
      }}>
        Integrates With Tools You Already Use
      </p>
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'im-scroll 38s linear infinite',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused'}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running'}
      >
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            margin: '0 6px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.03)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            <img
              src={item.logo}
              alt={item.name}
              style={{
                width: '20px',
                height: '20px',
                objectFit: 'contain',
                borderRadius: '3px',
                display: 'block',
              }}
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.72)',
            }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes im-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
