
import React, { useEffect, useRef } from 'react';

// Add declaration for the ThinkrrWidget property on the window object
declare global {
  interface Window {
    ThinkrrWidget?: any; // Using any type since we don't know the exact structure
  }
}

const Widget: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // First approach: Check if widget script exists, if not add it
    const scriptExists = document.querySelector('script#thinkrr-widget-script');
    if (!scriptExists) {
      const script = document.createElement('script');
      script.id = 'thinkrr-widget-script';
      script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
      script.async = true;
      
      script.onerror = () => {
        console.error('Failed to load Thinkrr widget script');
      };
      
      script.onload = () => {
        console.log('Thinkrr widget script loaded successfully');
      };
      
      document.body.appendChild(script);
    }
    
    // This effect ensures the widget is properly initialized
    // after the component mounts and the script has loaded
    const checkWidgetInterval = setInterval(() => {
      // Check if the widget's script has loaded and initialized
      if (widgetRef.current && window.ThinkrrWidget) {
        console.log('Thinkrr widget initialized successfully');
        clearInterval(checkWidgetInterval);
      } else {
        console.log('Waiting for Thinkrr widget to initialize...');
        // Attempt to force widget visibility
        if (widgetRef.current) {
          widgetRef.current.style.display = 'block';
          widgetRef.current.style.visibility = 'visible';
        }
      }
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      clearInterval(checkWidgetInterval);
    };
  }, []);
  
  return (
    <div className="widget-container">
      <div
        ref={widgetRef}
        data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
        style={{
          width: '220px',
          height: '220px',
          margin: '20px auto',
          position: 'relative',
          zIndex: 999,
          display: 'block',
          visibility: 'visible',
          opacity: 1,
        }}
      />
    </div>
  );
};

export default Widget;
