
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
    
    // First try to find the widget container
    const widgetElement = document.querySelector('.widget-container');
    
    // If widget container not found, look for the "Stop Losing..." section
    // This is a backup in case the widget-container class isn't available
    const opportunitiesSection = document.querySelector('h2:contains("Stop Losing")') || 
                                document.querySelector('h2:contains("Thousands of Dollar")');
    
    // Determine which element to scroll to
    const targetElement = widgetElement || opportunitiesSection;
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
    } else {
      // If neither element is found, scroll to the DemoSection as fallback
      const demoSection = document.getElementById('demo');
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setIsPlaying(true);
        setTimeout(() => {
          setIsPlaying(false);
        }, 5000);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-8 pb-[50px]">
      <BackgroundElements />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-voiceai-primary/10 text-voiceai-primary px-4 py-2 rounded-full mb-6">
                <span className="animate-pulse rounded-full w-2 h-2 bg-voiceai-primary"></span>
                <span className="text-sm font-medium">The Future of Websites Is Here</span>
              </div>
              <h1 className="heading-xl">
                Give Your Website a <span className="text-gradient">Voice</span> & <span className="text-gradient">Brain</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Stop losing leads to unanswered calls and static forms. Our Voice AI handles calls, qualifies leads, books appointments, and follows up—all while you sleep.
              </p>
            </div>
            
            <HeroActions
              isPlaying={isPlaying}
              onScrollToWidget={scrollToWidget}
              calendarOpen={calendarOpen}
              setCalendarOpen={setCalendarOpen}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
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
