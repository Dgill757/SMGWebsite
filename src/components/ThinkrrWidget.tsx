
import React, { useEffect, useRef } from 'react';

const ThinkrrWidget: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1) Inject loader script once if missing
    if (!document.getElementById('thinkrr-web-widget-script')) {
      const s = document.createElement('script');
      s.id = 'thinkrr-web-widget-script';
      s.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
      s.async = true;
      document.body.appendChild(s);
    }

    // 2) Define re-init function
    const initWidget = () => {
      if (window.ThinkrrWebWidget?.init) {
        window.ThinkrrWebWidget.init({
          key: '8ba094ef-bcf2-4aec-bcef-ee65c95b0492'
        });
      }
    };

    // 3) Observe when our div enters the viewport
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) initWidget();
      });
    });
    if (ref.current) obs.observe(ref.current);

    return () => {
      if (ref.current) obs.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
      style={{ width: 220, height: 220, margin: '60px auto' }}
    />
  );
};

export default ThinkrrWidget;
