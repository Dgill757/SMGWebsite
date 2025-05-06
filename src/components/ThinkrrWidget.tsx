
import React from 'react';

export default function ThinkrrWidget() {
  return (
    <div className="flex justify-center my-12 md:my-16">
      <iframe 
        src="/thinkrr-widget.html" 
        title="Thinkrr Voice Widget"
        style={{
          width: '220px',
          height: '220px',
          border: 'none',
          overflow: 'visible'
        }}
        className="block sm:block"
      />
    </div>
  );
}
