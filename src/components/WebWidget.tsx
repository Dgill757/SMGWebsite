
import React, { useEffect, useRef, useState } from 'react';
import { toast } from "@/components/ui/sonner";

const WebWidget: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Create and add the script dynamically
    const script = document.createElement('script');
    script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
    script.async = true;
    
    // Set up listener to verify loading
    script.onload = () => {
      console.log("Widget script loaded successfully");
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load widget script");
      toast.error("Failed to load the widget. Please refresh the page.");
    };
    
    document.head.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="web-widget" className="py-8 md:py-12 flex justify-center items-center w-full bg-white/50 backdrop-blur-sm">
      <div className="max-w-xl w-full flex justify-center">
        <div 
          ref={widgetRef}
          data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
          className="w-full max-w-md mx-auto min-h-[300px] flex items-center justify-center"
        >
          {!isLoaded && (
            <div className="text-center p-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-voiceai-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-3"></div>
              <p>Loading widget...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WebWidget;
