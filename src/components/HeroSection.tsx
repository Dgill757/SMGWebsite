
import React, { useState, useEffect } from 'react';
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
  const [widgetVisible, setWidgetVisible] = useState(false);

  // Check if widget is visible
  useEffect(() => {
    const checkWidgetVisibility = () => {
      // Try multiple selectors to ensure we find the widget
      const widgetElement = 
        document.querySelector('.widget-container') || 
        document.querySelector('[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]')?.parentElement;
      
      if (widgetElement) {
        const rect = widgetElement.getBoundingClientRect();
        // Check if the element is actually rendered with height
        if (rect.height > 0) {
          setWidgetVisible(true);
        } else {
          setWidgetVisible(false);
        }
      }
    };
    
    checkWidgetVisibility();
    // Check periodically
    const interval = setInterval(checkWidgetVisibility, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const scrollToWidget = (event: React.MouseEvent) => {
    event.preventDefault();
    
    // First check for iframe fallback
    const iframeElement = document.querySelector('.widget-container iframe');
    
    if (iframeElement) {
      iframeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
      return;
    }
    
    // Try multiple selectors to ensure we find the widget
    const widgetElement = 
      document.querySelector('.widget-container') || 
      document.querySelector('[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]')?.parentElement;
    
    if (widgetElement) {
      // First make sure the element is visible before scrolling
      if (widgetElement instanceof HTMLElement) {
        widgetElement.style.display = 'block';
        widgetElement.style.visibility = 'visible';
        widgetElement.style.opacity = '1';
      }
      
      // Use a shorter animation and center alignment for better visibility
      widgetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsPlaying(true);
      
      // Make sure the animation doesn't play too long
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
      
      // Force widget visibility after scrolling with multiple attempts
      const enforceWidgetVisibility = () => {
        const widgetDiv = document.querySelector('[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]');
        if (widgetDiv && widgetDiv instanceof HTMLElement) {
          // Apply styles immediately
          widgetDiv.style.display = 'block';
          widgetDiv.style.visibility = 'visible';
          widgetDiv.style.opacity = '1';
          widgetDiv.style.zIndex = '9999';
          
          // Add a class that might help with specificity
          widgetDiv.classList.add('force-visible');
          
          // Try to trigger a reflow
          void widgetDiv.offsetHeight;
        }
      };
      
      // Apply multiple times with delays
      enforceWidgetVisibility();
      setTimeout(enforceWidgetVisibility, 500);
      setTimeout(enforceWidgetVisibility, 1000);
      setTimeout(enforceWidgetVisibility, 2000);
    } else {
      // If widget container not found, look for fallback sections
      const featuresSection = document.querySelector('[id="features"]');
      
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsPlaying(true);
        setTimeout(() => {
          setIsPlaying(false);
        }, 3000);
      } else {
        console.error('Failed to find widget or fallback section');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-6 pb-[20px] md:pb-[30px]">
      <BackgroundElements />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-10">
          <div className="w-full lg:w-1/2 space-y-4 lg:space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-voiceai-primary/10 text-voiceai-primary px-4 py-2 rounded-full mb-3 lg:mb-6">
                <span className="animate-pulse rounded-full w-2 h-2 bg-voiceai-primary"></span>
                <span className="text-sm font-medium">The Future of Websites Is Here</span>
              </div>
              <h1 className="heading-xl">
                Give Your Website a <span className="text-gradient">Voice</span> & <span className="text-gradient">Brain</span>
              </h1>
              <p className="mt-3 lg:mt-6 text-lg text-muted-foreground">
                Stop losing leads to unanswered calls and static forms. Our Voice AI handles calls, qualifies leads, books appointments, and follows up—all while you sleep.
              </p>
            </div>
            
            <HeroActions
              isPlaying={isPlaying}
              onScrollToWidget={scrollToWidget}
              calendarOpen={calendarOpen}
              setCalendarOpen={setCalendarOpen}
            />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 lg:mt-8">
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
