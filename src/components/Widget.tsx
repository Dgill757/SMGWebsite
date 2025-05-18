
import React from 'react';

const Widget: React.FC = () => {
  return (
    <div className="widget-container">
      <div
        data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
        style={{
          width: '220px',
          height: '220px',
          margin: '60px auto',       // centers it with some breathing room
        }}
      />
    </div>
  );
};

export default Widget;
