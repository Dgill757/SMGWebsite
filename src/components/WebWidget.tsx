
import React, { useEffect, useRef } from 'react';

const WebWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only add the widget if it hasn't been initialized in this container
    if (containerRef.current && !containerRef.current.querySelector('[data-widget-initialized="true"]')) {
      // Create a new div for the widget
      const widgetDiv = document.createElement('div');
      widgetDiv.setAttribute('data-widget-key', '8ba094ef-bcf2-4aec-bcef-ee65c95b0492');
      widgetDiv.setAttribute('data-widget-initialized', 'true');
      widgetDiv.className = 'w-full';
      
      // Append to our container
      if (containerRef.current.children.length === 0) {
        containerRef.current.appendChild(widgetDiv);
      }
      
      // Make sure the script is loaded
      if (!document.getElementById('summit-voice-widget-script')) {
        const script = document.createElement('script');
        script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
        script.id = 'summit-voice-widget-script';
        script.async = true;
        script.onload = () => {
          console.log('Widget script loaded directly in WebWidget component');
          // Explicitly try to initialize if the global object exists
          if (window.hasOwnProperty('SummitVoiceWidget') && 
              // @ts-ignore
              typeof window.SummitVoiceWidget?.init === 'function') {
            // @ts-ignore
            window.SummitVoiceWidget.init();
          }
        };
        document.head.appendChild(script);
      } else {
        // If script already exists, try to initialize explicitly
        if (window.hasOwnProperty('SummitVoiceWidget') && 
            // @ts-ignore
            typeof window.SummitVoiceWidget?.init === 'function') {
          // @ts-ignore
          window.SummitVoiceWidget.init();
        }
      }
    }
  }, []);

  return (
    <section id="web-widget" className="py-8 md:py-12 flex justify-center items-center w-full bg-white/50 backdrop-blur-sm">
      <div className="max-w-xl w-full flex justify-center" ref={containerRef}>
        {/* Widget will be dynamically inserted here */}
      </div>
    </section>
  );
};

export default WebWidget;
