import React from 'react';

interface IndustryIntroCardProps {
  description: string;
  /** Optional icon element displayed top-right of card */
  icon?: React.ReactNode;
  /** Optional accent colour override (default cyan) */
  accent?: string;
}

/**
 * Premium industry intro card — replaces the plain bg-muted text box
 * on every /industries/:slug page. Pass the industry's description text
 * and (optionally) its icon.
 */
const IndustryIntroCard: React.FC<IndustryIntroCardProps> = ({
  description,
  icon,
  accent = '#00E5FF',
}) => {
  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 900,
        margin: '4rem auto 0',
        borderRadius: 22,
        padding: '0.15rem',               // gradient border trick
        background: `linear-gradient(135deg, ${accent}55, rgba(124,58,237,0.35), rgba(255,255,255,0.06))`,
        boxShadow: `0 0 0 1px ${accent}18, 0 24px 60px rgba(0,0,0,0.45), 0 0 40px ${accent}10`,
      }}
    >
      {/* Inner surface */}
      <div
        style={{
          position: 'relative',
          borderRadius: 20,
          padding: '2.25rem 2.5rem',
          background: 'linear-gradient(145deg, rgba(12,12,18,0.98), rgba(8,8,14,0.99))',
          overflow: 'hidden',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${accent}, #7C3AED, transparent)`,
          }}
        />

        {/* Corner glow */}
        <div
          style={{
            position: 'absolute',
            top: -60, right: -60,
            width: 200, height: 200,
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${accent}20, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: accent,
                boxShadow: `0 0 12px ${accent}`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: accent,
              }}
            >
              Industry Overview
            </span>
          </div>

          {/* Icon (optional) */}
          {icon && (
            <div
              style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: `${accent}14`,
                border: `1px solid ${accent}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: accent,
                boxShadow: `0 0 18px ${accent}22`,
              }}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Description text */}
        <p
          style={{
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.8,
            margin: 0,
            fontWeight: 400,
          }}
        >
          {description}
        </p>

        {/* Bottom decorative dots row */}
        <div style={{ display: 'flex', gap: 6, marginTop: '1.75rem', alignItems: 'center' }}>
          {[accent, '#7C3AED', 'rgba(255,255,255,0.2)'].map((c, i) => (
            <div key={i} style={{ width: i === 2 ? 24 : 6, height: 6, borderRadius: 3, background: c, opacity: i === 2 ? 0.5 : 1 }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndustryIntroCard;
