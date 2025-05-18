
import { useState } from 'react';
import { Play, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalendlyModal from '../CalendlyModal';

interface HeroActionsProps {
  isPlaying: boolean;
  onScrollToWidget: (event: React.MouseEvent) => void;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
}

const HeroActions: React.FC<HeroActionsProps> = ({ 
  isPlaying, 
  onScrollToWidget, 
  calendarOpen, 
  setCalendarOpen 
}) => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const openCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCalendlyOpen(true);
  };

  return (
    <>
      <CalendlyModal 
        isOpen={isCalendlyOpen} 
        onClose={() => setIsCalendlyOpen(false)} 
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={openCalendly}
          className="btn-primary gap-2 text-center"
        >
          <Calendar size={18} /> 
          Request Demo
        </Button>
        
        <Button
          onClick={onScrollToWidget}
          variant="outline"
          className="gap-2 border-primary text-primary hover:bg-primary/10"
        >
          <div className={`rounded-full bg-voiceai-primary flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
            <Play fill="white" size={18} className="ml-0.5" />
          </div>
          Hear It In Action
        </Button>
      </div>
    </>
  );
};

export default HeroActions;
