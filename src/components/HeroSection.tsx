
import React, { useState } from 'react';
import { PhoneCall, Calendar, CreditCard } from 'lucide-react';
import BackgroundElements from './hero/BackgroundElements';
import FeatureItem from './hero/FeatureItem';
import WebsiteMockup from './hero/WebsiteMockup';
import HeroActions from './hero/HeroActions';

interface HeroSectionProps {
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ calendarOpen, setCalendarOpen }) => {
  const [isPlaying, setIsPlaying] = useState(false);

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
                Give Your Website a <span className="text-voiceai-primary font-bold">Voice</span> & <span className="text-voiceai-secondary font-bold">Brain</span>
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
        </div>
      </div>
      
      {/* Bottom section divider */}
      <div className="section-divider mt-12"></div>
    </div>
  );
};

export default HeroSection;
