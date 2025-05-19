
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
  const [useFallback, setUseFallback] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  // Function to detect mobile viewport
  const isMobileDevice = () => {
    return (window.innerWidth <= 768) || 
           (navigator.userAgent.match(/Android/i)) || 
           (navigator.userAgent.match(/iPhone|iPad|iPod/i));
  };
  
  useEffect(() => {
    // Function to create and inject the widget
    const createVoiceWidget = () => {
      console.log("Creating voice widget, mobile device: " + isMobileDevice());
      
      // First approach: Use existing script if available
      let scriptLoaded = document.querySelector('script#thinkrr-widget-script');
      
      // If no script exists, create and add it
      if (!scriptLoaded) {
        const script = document.createElement('script');
        script.id = 'thinkrr-widget-script';
        script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
        script.async = true;
        
        script.onerror = () => {
          console.error('Failed to load Thinkrr widget script');
          setAttempts(prev => prev + 1);
          // Switch to fallback after multiple failures
          if (attempts >= 2) {
            setUseFallback(true);
          }
        };
        
        script.onload = () => {
          console.log('Thinkrr widget script loaded successfully');
          setIsLoaded(true);
        };
        
        document.head.appendChild(script);
      } else {
        // Script already exists in the document
        setIsLoaded(true);
      }
      
      // Force the widget element to be visible
      if (widgetRef.current) {
        widgetRef.current.style.display = 'block';
        widgetRef.current.style.visibility = 'visible';
        widgetRef.current.style.opacity = '1';
        widgetRef.current.style.position = 'relative';
        widgetRef.current.style.zIndex = '9999';
      }
    };
    
    // Initial creation
    createVoiceWidget();
    
    // Persistent checking to ensure widget loads and stays visible
    const checkWidgetInterval = setInterval(() => {
      if (attempts >= 5) {
        console.log("Max widget creation attempts reached, switching to fallback");
        setUseFallback(true);
        clearInterval(checkWidgetInterval);
        return;
      }
      
      if (widgetRef.current) {
        // Apply styles directly to ensure visibility
        widgetRef.current.style.display = 'block';
        widgetRef.current.style.visibility = 'visible';
        widgetRef.current.style.opacity = '1';
        widgetRef.current.style.zIndex = '9999';
        
        // Check if the widget's global object has been initialized
        if (window.ThinkrrWidget) {
          console.log('Thinkrr widget initialized successfully');
          clearInterval(checkWidgetInterval);
        } else {
          console.log('Waiting for Thinkrr widget to initialize...');
          // If on mobile, try more aggressively
          if (isMobileDevice()) {
            setAttempts(prev => prev + 1);
            createVoiceWidget();
          }
        }
      }
    }, 2000);
    
    // Force mobile viewport to recognize content
    if ('visualViewport' in window) {
      const handleViewportChange = () => {
        if (widgetRef.current) {
          widgetRef.current.style.display = 'block';
          widgetRef.current.style.visibility = 'visible';
          widgetRef.current.style.opacity = '1';
        }
      };
      
      window.visualViewport?.addEventListener('resize', handleViewportChange);
      window.visualViewport?.addEventListener('scroll', handleViewportChange);
      
      // Extra attempts specifically for mobile
      if (isMobileDevice()) {
        console.log("Mobile device detected, forcing widget creation");
        setTimeout(createVoiceWidget, 3000);
        setTimeout(createVoiceWidget, 6000);
      }
      
      // Cleanup on unmount
      return () => {
        clearInterval(checkWidgetInterval);
        if ('visualViewport' in window) {
          window.visualViewport?.removeEventListener('resize', handleViewportChange);
          window.visualViewport?.removeEventListener('scroll', handleViewportChange);
        }
      };
    }
    
    // Cleanup on unmount
    return () => {
      clearInterval(checkWidgetInterval);
    };
  }, [attempts]);
  
  // If we need to use the iframe fallback
  if (useFallback) {
    return (
      <div className="widget-container">
        <iframe 
          title="Voice AI Widget Iframe"
          style={{
            width: '220px', 
            height: '220px', 
            border: 'none', 
            overflow: 'visible',
            display: 'block',
            margin: '0 auto'
          }}
          srcDoc={`
            <!DOCTYPE html>
            <html>
            <head>
              <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1'>
              <style>
                body { margin:0; padding:0; overflow:visible; }
                [data-widget-key] { 
                  display:block !important; 
                  visibility:visible !important; 
                  opacity:1 !important;
                  margin:10px auto;
                }
              </style>
            </head>
            <body>
              <div data-widget-key='8ba094ef-bcf2-4aec-bcef-ee65c95b0492'></div>
              <script src='https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js'></script>
            </body>
            </html>
          `}
        />
      </div>
    );
  }
  
  return (
    <div className="widget-container">
      <div
        ref={widgetRef}
        data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
        className="thinkrr-widget-element"
        style={{
          width: '100%',
          maxWidth: '220px',
          height: '220px',
          margin: '10px auto',
          position: 'relative',
          zIndex: 9999,
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
