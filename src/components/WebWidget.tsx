
import React, { useEffect, useRef } from 'react';

const WebWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create and append the script element
    const script = document.createElement('script');
    script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <section id="web-widget" className="py-8 md:py-12 flex justify-center items-center w-full">
      <div className="max-w-xl w-full flex justify-center">
        <div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492" ref={containerRef}></div>
      </div>
    </section>
  );
};

export default WebWidget;
