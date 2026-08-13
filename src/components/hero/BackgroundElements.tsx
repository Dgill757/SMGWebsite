
import React from 'react';

const BackgroundElements = () => {
  return (
    <>
      {/* Enhanced neural background with animation */}
      <div className="absolute inset-0 neural-bg opacity-60 z-0"></div>
      
      {/* Large animated gradient orbs */}
      <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-radial from-voiceai-primary/20 via-voiceai-primary/10 to-transparent rounded-full filter blur-3xl animate-pulse-glow"></div>
      <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-radial from-voiceai-secondary/20 via-voiceai-secondary/10 to-transparent rounded-full filter blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-voiceai-accent/15 via-voiceai-accent/5 to-transparent rounded-full filter blur-3xl animate-pulse-glow" style={{ animationDelay: '8s' }}></div>
      
      {/* Animated lines/waves */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        <path d="M0,200 Q250,50 500,200 T1000,200" stroke="url(#waveGradient1)" strokeWidth="2" fill="none">
          <animate attributeName="d" dur="20s" repeatCount="indefinite" 
            values="M0,200 Q250,50 500,200 T1000,200;M0,300 Q250,150 500,300 T1000,300;M0,200 Q250,350 500,200 T1000,200;M0,200 Q250,50 500,200 T1000,200" />
        </path>
        
        <path d="M0,600 Q250,450 500,600 T1000,600" stroke="url(#waveGradient2)" strokeWidth="2" fill="none">
          <animate attributeName="d" dur="25s" repeatCount="indefinite" 
            values="M0,600 Q250,450 500,600 T1000,600;M0,500 Q250,650 500,500 T1000,500;M0,700 Q250,550 500,700 T1000,700;M0,600 Q250,450 500,600 T1000,600" />
        </path>
        
        <path d="M0,800 Q250,650 500,800 T1000,800" stroke="url(#waveGradient1)" strokeWidth="1" fill="none" opacity="0.5">
          <animate attributeName="d" dur="30s" repeatCount="indefinite" 
            values="M0,800 Q250,650 500,800 T1000,800;M0,750 Q250,900 500,750 T1000,750;M0,850 Q250,700 500,850 T1000,850;M0,800 Q250,650 500,800 T1000,800" />
        </path>
      </svg>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-voiceai-primary to-voiceai-secondary rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatOrb ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 20}s`
            }}
          />
        ))}
      </div>
    </>
  );
};

export default BackgroundElements;
