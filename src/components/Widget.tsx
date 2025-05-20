
import React from 'react';
import RawHtmlBlock from './RawHtmlBlock';

const Widget: React.FC = () => (
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

export default Widget;
