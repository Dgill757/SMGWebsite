
import React, { useEffect, useRef } from 'react';

const WebWidget: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add the script dynamically
    const script = document.createElement('script');
    script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="web-widget" className="py-20 flex justify-center items-center w-full">
      <div className="max-w-xl w-full flex justify-center">
        <div 
          ref={widgetRef}
          data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
        ></div>
      </div>
    </div>
  );
};

export default WebWidget;
