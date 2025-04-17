
import React from 'react';

const WebWidget: React.FC = () => {
  return (
    <section id="web-widget" className="py-8 md:py-12 flex justify-center items-center w-full bg-white/50 backdrop-blur-sm">
      <div className="max-w-xl w-full flex justify-center">
        {/* The widget will be rendered in this container */}
        <div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492" className="w-full"></div>
      </div>
    </section>
  );
};

export default WebWidget;
