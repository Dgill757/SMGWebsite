
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

      <div className="flex flex-col sm:flex-row gap-6 mt-8">
        <Button 
          onClick={openCalendly}
          className="btn-primary gap-3 text-lg py-6 px-8 text-center shadow-2xl shadow-voiceai-primary/40"
        >
          <Calendar size={22} /> 
          Request Demo
        </Button>
        
        <Button
          onClick={onScrollToWidget}
          className="btn-secondary gap-3 text-lg py-6 px-8 group"
        >
          <div className={`rounded-full bg-gradient-to-r from-voiceai-primary to-voiceai-secondary p-2 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''} group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-voiceai-primary/50`}>
            <Play fill="white" size={20} className="ml-0.5 text-white" />
          </div>
          Hear It In Action
        </Button>
      </div>
    </>
  );
};

export default HeroActions;
