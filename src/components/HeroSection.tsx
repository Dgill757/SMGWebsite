import React, { useState } from 'react';
import { PhoneCall, Calendar, CreditCard } from 'lucide-react';
import BackgroundElements from './hero/BackgroundElements';
import FeatureItem from './hero/FeatureItem';
import WebsiteMockup from './hero/WebsiteMockup';
import HeroActions from './hero/HeroActions';

const HeroSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollToWidget = (event: React.MouseEvent) => {
    event.preventDefault();
    const widgetElement = document.getElementById('web-widget');
    if (widgetElement) {
      widgetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-20 hero-section" style={{ position: 'relative', paddingBottom: '150px' }}>
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
            
            <HeroActions isPlaying={isPlaying} onScrollToWidget={scrollToWidget} />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
              <FeatureItem Icon={PhoneCall} text="Never Miss a Call" colorClass="bg-voiceai-primary/10" />
              <FeatureItem Icon={Calendar} text="Auto Scheduling" colorClass="bg-voiceai-secondary/10" />
              <FeatureItem Icon={CreditCard} text="Billing & Invoicing" colorClass="bg-voiceai-accent/10" />
            </div>
          </div>
          
          <WebsiteMockup />
        </div>
      </div>

      <script src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"></script>
      <div 
        data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
        style={{
          position: 'absolute',
          bottom: '-110px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '220px',
          height: '220px',
          background: 'transparent',
          padding: '0',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform .3s ease, box-shadow .3s ease'
        }}
      ></div>
    </div>
  );
};

export default HeroSection;
