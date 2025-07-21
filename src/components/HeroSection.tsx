
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
    
    // Try multiple selectors to ensure we find the widget
    const widgetElement = 
      document.querySelector('.widget-container') || 
      document.querySelector('[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]')?.parentElement;
    
    if (widgetElement) {
      // Use a shorter animation and center alignment for better visibility
      widgetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsPlaying(true);
      
      // Make sure the animation doesn't play too long
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
      
      // Force widget visibility after scrolling with multiple attempts
      const widgetDiv = document.querySelector('[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]');
      if (widgetDiv && widgetDiv instanceof HTMLElement) {
        // Apply styles immediately
        widgetDiv.style.display = 'block';
        widgetDiv.style.visibility = 'visible';
        widgetDiv.style.opacity = '1';
        
        // And also after a delay to ensure they take effect
        setTimeout(() => {
          widgetDiv.style.display = 'block';
          widgetDiv.style.visibility = 'visible';
          widgetDiv.style.opacity = '1';
          
          // Add a class that might help with specificity
          widgetDiv.classList.add('force-visible');
          
          // Try to trigger a reflow
          void widgetDiv.offsetHeight;
        }, 500);
      }
    } else {
      // If widget container not found, look for fallback sections
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
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-voiceai-primary/10 text-voiceai-primary px-4 py-2 rounded-full mb-4 lg:mb-6">
                <span className="animate-pulse rounded-full w-2 h-2 bg-voiceai-primary"></span>
                <span className="text-sm font-medium">The Future of Websites Is Here</span>
              </div>
              <h1 className="heading-xl">
                Give Your Website a <span className="text-gradient">Voice</span> & <span className="text-gradient">Brain</span>
              </h1>
              <p className="mt-3 lg:mt-4 text-lg text-muted-foreground">
                Stop losing leads to unanswered calls and static forms. Our Voice AI handles calls, qualifies leads, books appointments, and follows up—all while you sleep.
              </p>
            </div>
            
            <HeroActions
              isPlaying={isPlaying}
              onScrollToWidget={scrollToWidget}
              calendarOpen={calendarOpen}
              setCalendarOpen={setCalendarOpen}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 lg:mt-6">
              <FeatureItem Icon={PhoneCall} text="Never Miss a Call" colorClass="bg-voiceai-primary/10" />
              <FeatureItem Icon={Calendar} text="Auto Scheduling" colorClass="bg-voiceai-secondary/10" />
              <FeatureItem Icon={CreditCard} text="Billing & Invoicing" colorClass="bg-voiceai-accent/10" />
            </div>
          </div>
          
          <WebsiteMockup />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
