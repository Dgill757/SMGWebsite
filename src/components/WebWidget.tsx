
import React, { useEffect, useRef } from 'react';

const WebWidget: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This will ensure the widget is initialized when the component is mounted
    // and after the script is loaded
    if (window.hasOwnProperty('SummitVoiceWidget') && widgetRef.current) {
      // @ts-ignore - The widget might not be typed
      if (typeof window.SummitVoiceWidget?.init === 'function') {
        // @ts-ignore
        window.SummitVoiceWidget.init();
      }
    }
  }, []);

  return (
    <section id="web-widget" className="py-8 md:py-12 flex justify-center items-center w-full bg-white/50 backdrop-blur-sm">
      <div className="max-w-xl w-full flex justify-center">
        <div 
          ref={widgetRef}
          data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
          className="w-full max-w-md mx-auto min-h-[300px] flex items-center justify-center"
        />
      </div>
    </section>
  );
};

export default WebWidget;
