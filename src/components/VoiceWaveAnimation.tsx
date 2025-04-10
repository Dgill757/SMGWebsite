
import React, { useEffect, useRef } from 'react';

interface VoiceWaveAnimationProps {
  isAnimating?: boolean;
  className?: string;
}

const VoiceWaveAnimation: React.FC<VoiceWaveAnimationProps> = ({ 
  isAnimating = true, 
  className = '' 
}) => {
  const waveCount = 12;
  const waves = Array.from({ length: waveCount });
  
  // Random heights for a more natural look
  const getRandomDelay = () => Math.random() * 1.5;
  
  return (
    <div className={`flex items-center justify-center h-16 space-x-1 ${className}`}>
      {waves.map((_, index) => (
        <div
          key={index}
          className={`w-2 bg-gradient-to-t from-voiceai-primary to-voiceai-secondary rounded-full
                     ${isAnimating ? 'animate-wave' : 'h-3'}`}
          style={{ 
            animationDelay: `${getRandomDelay()}s`,
            height: isAnimating ? '20px' : '12px',
            opacity: isAnimating ? 1 : 0.5
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveAnimation;
