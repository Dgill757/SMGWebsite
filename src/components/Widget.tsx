
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
    // This effect ensures the widget is properly initialized
    // after the component mounts and the script has loaded
    const checkWidgetInterval = setInterval(() => {
      // Check if the widget's script has loaded and initialized
      if (widgetRef.current && window.ThinkrrWidget) {
        console.log('Thinkrr widget initialized successfully');
        clearInterval(checkWidgetInterval);
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
          margin: '30px auto',       // reduced top/bottom margin
          position: 'relative',      // ensure proper stacking
          zIndex: 10,                // ensure visibility
          display: 'block',          // force display
        }}
      />
    </div>
  );
};

export default Widget;
