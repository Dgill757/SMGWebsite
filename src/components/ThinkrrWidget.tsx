
import React, { useEffect } from 'react';

const ThinkrrWidget: React.FC = () => {
  useEffect(() => {
    if (!document.getElementById('thinkrr-widget-script')) {
      const script = document.createElement('script');
      script.id = 'thinkrr-widget-script';
      script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
      style={{
        width: 220,
        height: 220,
        margin: '60px auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

export default ThinkrrWidget;
