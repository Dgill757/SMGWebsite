
import React, { useEffect, useRef } from 'react';

export default function ThinkrrWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    
    const script = document.createElement('script');
    script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
    script.async = true;
    script.onload = () => {
      console.log('Thinkrr widget script loaded successfully');
    };
    script.onerror = (e) => {
      console.error('Error loading Thinkrr widget script:', e);
    };
    
    document.body.appendChild(script);
    scriptLoaded.current = true;
    
    return () => {
      // Clean up script if component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="thinkrr-widget-container w-full flex justify-center my-8 overflow-visible">
      <div
        ref={containerRef}
        data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
        style={{ 
          width: 220, 
          height: 220,
          display: 'block',
          zIndex: 999
        }}
      />
    </div>
  );
}
