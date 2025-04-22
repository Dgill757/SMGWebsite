
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import VoiceWaveAnimation from '../VoiceWaveAnimation';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

interface HeroActionsProps {
  isPlaying: boolean;
  onScrollToWidget: (event: React.MouseEvent) => void;
}

const HeroActions = ({ isPlaying, onScrollToWidget }: HeroActionsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* "Get Started" opens Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="btn-primary flex items-center justify-center gap-2"
            onClick={() => setOpen(true)}
            type="button"
          >
            <span>Get Started Today</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Schedule a Call</DialogTitle>
          </DialogHeader>
          {/* Calendar Embed - replace the below with your real embed. */}
          <div className="w-full">
            {/* EXAMPLE: Replace with your actual calendar HTML code below */}
            <div>
              <iframe
                src="https://your-calendar-link.com"
                width="100%"
                height="500"
                style={{ border: "none" }}
                title="Schedule a Call"
                allow="camera; microphone"
              ></iframe>
            </div>
            {/* If your embed comes as HTML+JS, paste it here as-is */}
          </div>
          {/* Optionally add dialog close at bottom */}
          <DialogClose asChild>
            <button
              className="mt-4 w-full bg-voiceai-primary text-white py-2 rounded-md hover:bg-voiceai-secondary transition"
              type="button"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>

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
