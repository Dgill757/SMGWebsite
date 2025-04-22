
import React from 'react';
import { Play } from 'lucide-react';
import VoiceWaveAnimation from '../VoiceWaveAnimation';
import CalendarDialog from '../CalendarDialog';

interface HeroActionsProps {
  isPlaying: boolean;
  onScrollToWidget: (event: React.MouseEvent) => void;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
}

const HeroActions = ({ isPlaying, onScrollToWidget, calendarOpen, setCalendarOpen }: HeroActionsProps) => {
  const scrollToPricing = (event: React.MouseEvent) => {
    event.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* "Get Started" scrolls to pricing */}
      <button
        onClick={scrollToPricing}
        className="btn-primary flex items-center justify-center gap-2"
        type="button"
      >
        <span>Get Started Today</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Hear It In Action button */}
      <button 
        onClick={onScrollToWidget}
        className="btn-secondary flex items-center justify-center gap-2"
        type="button"
      >
        {isPlaying ? (
          <>
            <span>Listening...</span>
            <VoiceWaveAnimation isAnimating={true} className="h-6" />
          </>
        ) : (
          <>
            <Play size={18} />
            <span>Hear It In Action</span>
          </>
        )}
      </button>
    </div>
  );
};

export default HeroActions;
