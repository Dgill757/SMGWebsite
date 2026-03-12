import React from 'react';

const AmbientBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Top-right — cyan glow */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-8%',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.03) 40%, transparent 70%)',
        filter: 'blur(60px)',
        willChange: 'transform',
      }} />

      {/* Mid-left — violet glow */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, rgba(139,92,246,0.02) 45%, transparent 70%)',
        filter: 'blur(70px)',
        willChange: 'transform',
      }} />

      {/* Lower-right — deep blue */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.02) 45%, transparent 70%)',
        filter: 'blur(80px)',
        willChange: 'transform',
      }} />

      {/* Center-bottom — subtle warm */}
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '30%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 60%)',
        filter: 'blur(80px)',
        willChange: 'transform',
      }} />
    </div>
  );
};

export default AmbientBackground;
