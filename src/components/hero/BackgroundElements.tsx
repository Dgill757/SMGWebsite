
import React from 'react';

const BackgroundElements = () => {
  return (
    <>
      <div className="absolute inset-0 neural-bg opacity-40 z-0"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-voiceai-primary/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-voiceai-secondary/20 rounded-full filter blur-3xl"></div>
    </>
  );
};

export default BackgroundElements;
