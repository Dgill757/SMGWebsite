
import React from 'react';

const Widget: React.FC = () => {
  // no need to re-inject the script here since we did it in index.html
  return (
    <div
      data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"
      style={{
        width: '220px',
        height: '220px',
        margin: '60px auto',       // centers it with some breathing room
      }}
    />
  );
};

export default Widget;
