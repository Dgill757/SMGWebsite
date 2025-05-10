
import React, { useEffect } from 'react';

const ThinkrrWidget: React.FC = () => {
  useEffect(() => {
    // inject Thinkrr loader
    const script = document.createElement('script');
    script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
    script.async = true;
    document.body.appendChild(script);

    // cleanup so we can re-inject on next mount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
      style={{ width: 220, height: 220, margin: '60px auto' }}
    />
  );
};

export default ThinkrrWidget;
