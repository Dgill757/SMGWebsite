
import React from 'react';

const Widget: React.FC = () => (
  <div
    id="voice-widget-container"
    draggable={false}
    style={{
      width: '220px',
      height: '220px',
      margin: '60px auto',
      position: 'relative',
      zIndex: 1000,
      touchAction: 'none',           // disable swipe/drag
      userSelect: 'none',            // disable text/image selection
      WebkitUserDrag: 'none' as any, // disable image dragging in Safari
    }}
  >
    <div
      data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
      draggable={false}
    />
  </div>
);

export default Widget;
