
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendlyModal: React.FC<CalendlyModalProps> = ({ isOpen, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Load Calendly script when modal is opened
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-voiceai-dark rounded-lg shadow-xl overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background text-foreground"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        <div className="w-full h-full">
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/aivoice/call"
            style={{ minWidth: '320px', height: '100%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CalendlyModal;
