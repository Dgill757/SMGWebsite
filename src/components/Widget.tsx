
import React, { useEffect, useRef, useState } from 'react';

// Add declaration for the ThinkrrWidget property on the window object
declare global {
  interface Window {
    ThinkrrWidget?: any; // Using any type since we don't know the exact structure
  }
}

const Widget: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Approach 1: Use the script from index.html if it exists
    let scriptLoaded = document.querySelector('script#thinkrr-widget-script');
    
    // If no script exists, create and add it
    if (!scriptLoaded) {
      const script = document.createElement('script');
      script.id = 'thinkrr-widget-script';
      script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
      script.async = true;
      
      script.onerror = () => {
        console.error('Failed to load Thinkrr widget script');
      };
      
      script.onload = () => {
        console.log('Thinkrr widget script loaded successfully');
        setIsLoaded(true);
      };
      
      document.body.appendChild(script);
    } else {
      // Script already exists in the document
      setIsLoaded(true);
    }
    
    // More aggressive approach to ensure widget is initialized and visible
    const checkWidgetInterval = setInterval(() => {
      if (widgetRef.current) {
        // Apply styles directly to ensure visibility
        widgetRef.current.style.display = 'block';
        widgetRef.current.style.visibility = 'visible';
        widgetRef.current.style.opacity = '1';
        
        // Check if the widget's global object has been initialized
        if (window.ThinkrrWidget) {
          console.log('Thinkrr widget initialized successfully');
          clearInterval(checkWidgetInterval);
        } else {
          console.log('Waiting for Thinkrr widget to initialize...');
        }
      }
    }, 1000);
    
    // Force mobile viewport to recognize content
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', () => {
        if (widgetRef.current) {
          widgetRef.current.style.display = 'block';
        }
      });
    }
    
    // Cleanup on unmount
    return () => {
      clearInterval(checkWidgetInterval);
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', () => {});
      }
    };
  }, []);
  
  return (
    <div className="widget-container">
      <div
        ref={widgetRef}
        data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
        className="thinkrr-widget-element"
        style={{
          width: '220px',
          height: '220px',
          margin: '10px auto',
          position: 'relative',
          zIndex: 999,
          display: 'block',
          visibility: 'visible',
          opacity: 1,
        }}
      />
      {!isLoaded && (
        <div className="widget-loading">Loading voice AI widget...</div>
      )}
    </div>
  );
};

export default Widget;
