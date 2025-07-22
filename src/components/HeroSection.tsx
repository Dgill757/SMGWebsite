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
          
          {/* Floating Demo Widget */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 right-8 lg:right-16 xl:right-24 z-[99999] animate-float"
            style={{
              zIndex: 99999,
              pointerEvents: 'auto'
            }}
          >
            <div 
              className="relative max-w-[400px] w-80 backdrop-blur-lg transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '24px',
                boxShadow: `
                  0 0 40px rgba(124, 58, 237, 0.3),
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  inset 0 1px 0 rgba(255, 255, 255, 0.9)
                `
              }}
            >
              {/* Browser Bar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-100/80 rounded-lg px-3 py-1 text-sm text-gray-600 text-center">
                    yourwebsite.com
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Welcome to Our Service
                </h3>
                <p className="text-gray-600 text-sm mb-8">
                  How can we help you today?
                </p>
                
                {/* Hidden Widget Container */}
                <div className="opacity-0 absolute -z-10">
                  <RawHtmlBlock 
                    html='<div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"></div>'
                    className="widget-content"
                  />
                </div>
                
                {/* Voice Button */}
                <div className="flex justify-center mb-6">
                  <div 
                    className="relative w-20 h-20 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #F472B6 100%)',
                      boxShadow: `
                        0 8px 32px rgba(124, 58, 237, 0.4),
                        0 0 40px rgba(124, 58, 237, 0.2)
                      `
                    }}
                    onClick={scrollToWidget}
                  >
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                         style={{
                           background: 'linear-gradient(135deg, #7C3AED, #3B82F6)',
                           transform: 'scale(1.2)'
                         }}
                    ></div>
                    
                    {/* Microphone icon */}
                    <svg className="w-10 h-10 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 4a3 3 0 616 0v4a3 3 0 11-6 0V4z"/>
                      <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5a.75.75 0 001.5 0v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z"/>
                    </svg>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  Click to speak with our AI assistant
                </p>
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