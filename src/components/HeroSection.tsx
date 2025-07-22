import React, { useState, useEffect } from 'react';
import { PhoneCall, Calendar, CreditCard } from 'lucide-react';
import BackgroundElements from './hero/BackgroundElements';
import FeatureItem from './hero/FeatureItem';
import WebsiteMockup from './hero/WebsiteMockup';
import HeroActions from './hero/HeroActions';
import RawHtmlBlock from './RawHtmlBlock';

interface HeroSectionProps {
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ calendarOpen, setCalendarOpen }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize the floating widget
    setTimeout(() => {
      if (window.widgetLib && typeof window.widgetLib.scanWidgets === 'function') {
        window.widgetLib.scanWidgets();
        console.log('Floating widget initialized in hero section');
      }
    }, 150);
  }, []);

  const scrollToWidget = (event: React.MouseEvent) => {
    event.preventDefault();
    
    const widgetElement = 
      document.querySelector('.widget-container') || 
      document.querySelector('[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]')?.parentElement;
    
    if (widgetElement) {
      widgetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsPlaying(true);
      
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
      
      const widgetDiv = document.querySelector('[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]');
      if (widgetDiv && widgetDiv instanceof HTMLElement) {
        widgetDiv.style.display = 'block';
        widgetDiv.style.visibility = 'visible';
        widgetDiv.style.opacity = '1';
        
        setTimeout(() => {
          widgetDiv.style.display = 'block';
          widgetDiv.style.visibility = 'visible';
          widgetDiv.style.opacity = '1';
          widgetDiv.classList.add('force-visible');
          void widgetDiv.offsetHeight;
        }, 500);
      }
    } else {
      const opportunitiesSection = document.querySelector('[id="features"]');
      
      if (opportunitiesSection) {
        opportunitiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsPlaying(true);
        setTimeout(() => {
          setIsPlaying(false);
        }, 3000);
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center relative overflow-hidden pt-2 pb-4">
      <BackgroundElements />
      
      {/* Section divider */}
      <div className="section-divider"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6">
            <div>
                <div className="inline-flex items-center gap-3 glassmorphism px-6 py-3 rounded-full mb-6 lg:mb-8 shadow-lg shadow-voiceai-primary/30 border border-white/20">
                  <span className="animate-pulse rounded-full w-3 h-3 bg-gradient-to-r from-voiceai-primary to-voiceai-secondary shadow-lg shadow-voiceai-primary/50"></span>
                  <span className="text-sm font-semibold tracking-wide text-foreground">The Future of Websites Is Here</span>
                </div>
              <h1 className="heading-xl mb-6">
                <span style={{ 
                  background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #F472B6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: '#7C3AED'
                }}>Give Your Website</span> a <span className="text-white font-bold">Voice</span> & <span style={{ 
                  background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #F472B6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: '#F472B6'
                }} className="font-bold">Brain</span>
              </h1>
              <p className="mt-3 lg:mt-4 text-xl text-foreground/80 leading-relaxed font-medium">
                Stop losing leads to unanswered calls and static forms. Our Voice AI handles calls, qualifies leads, books appointments, and follows up—all while you sleep.
              </p>
            </div>
            
            <HeroActions
              isPlaying={isPlaying}
              onScrollToWidget={scrollToWidget}
              calendarOpen={calendarOpen}
              setCalendarOpen={setCalendarOpen}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 lg:mt-12">
              <FeatureItem Icon={PhoneCall} text="Never Miss a Call" colorClass="glassmorphism" />
              <FeatureItem Icon={Calendar} text="Auto Scheduling" colorClass="glassmorphism" />
              <FeatureItem Icon={CreditCard} text="Billing & Invoicing" colorClass="glassmorphism" />
            </div>
          </div>
          
          <WebsiteMockup />
          
          {/* Floating Widget - positioned to the right of the headline */}
          <div 
            className="absolute top-1/4 right-8 lg:right-16 xl:right-24 z-[99999] animate-float"
            style={{
              zIndex: 99999,
              pointerEvents: 'auto'
            }}
          >
            <div 
              className="relative group cursor-pointer transition-all duration-500 hover:scale-105"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(124, 58, 237, 0.4))'
              }}
            >
              <div 
                className="relative rounded-2xl p-6 max-w-sm min-w-[320px] backdrop-blur-xl border transition-all duration-500 group-hover:border-voiceai-primary/50"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.5),
                    0 0 40px rgba(124, 58, 237, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `
                }}
              >
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(244, 114, 182, 0.1) 100%)',
                       filter: 'blur(1px)'
                     }}
                ></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="font-semibold text-xl mb-2 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                      Welcome to Our Service
                    </h3>
                    <p className="text-gray-300 text-sm opacity-90">How can we help you today?</p>
                  </div>
                  
                  <RawHtmlBlock 
                    html='<div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"></div>'
                    className="widget-content mb-6"
                  />
                  
                  {/* Click to speak text with gradient */}
                  <div className="text-center mb-4">
                    <p className="text-sm bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
                      Click to speak with our AI assistant
                    </p>
                  </div>
                </div>
                
                {/* Floating Voice Button with enhanced effects */}
                <div className="absolute -bottom-6 -right-6">
                  <div className="relative">
                    {/* Pulsing glow ring */}
                    <div className="absolute inset-0 rounded-full animate-ping" 
                         style={{
                           background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
                           transform: 'scale(1.5)'
                         }}
                    ></div>
                    
                    {/* Main button */}
                    <div 
                      className="relative w-16 h-16 rounded-full shadow-2xl cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 group/button"
                      style={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #F472B6 100%)',
                        boxShadow: `
                          0 8px 32px rgba(124, 58, 237, 0.6),
                          0 0 60px rgba(124, 58, 237, 0.3),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        `
                      }}
                    >
                      {/* Red notification dot */}
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-lg"
                           style={{
                             boxShadow: '0 0 20px rgba(239, 68, 68, 0.8)'
                           }}
                      ></div>
                      
                      {/* Microphone icon */}
                      <svg className="w-8 h-8 text-white transition-transform duration-300 group-hover/button:scale-110" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 4a3 3 0 616 0v4a3 3 0 11-6 0V4z"/>
                        <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5a.75.75 0 001.5 0v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom section divider */}
      <div className="section-divider mt-12"></div>
    </div>
  );
};

export default HeroSection;