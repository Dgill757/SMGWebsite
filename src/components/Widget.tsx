
import React, { useEffect } from 'react';
import RawHtmlBlock from './RawHtmlBlock';

const Widget: React.FC = () => {
  useEffect(() => {
    // Wait a short time to ensure the div is in the DOM
    setTimeout(() => {
      if (window.widgetLib && typeof window.widgetLib.scanWidgets === 'function') {
        window.widgetLib.scanWidgets();
        console.log('Thinkrr widget initialized');
      } else {
        console.log('Thinkrr widget library not available yet');
      }
    }, 150);
  }, []); // Run after mount

  return (
    <div 
      id="widget-container"
      style={{
        margin: '30px auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1000
      }}
    >
      <RawHtmlBlock 
        html='<div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"></div>'
        id="pure-widget-container"
      />
    </div>
  );
};

export default Widget;
