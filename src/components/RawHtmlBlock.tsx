
import React, { useRef, useEffect } from 'react';

interface RawHtmlBlockProps {
  html: string;
  className?: string;
  id?: string;
}

const RawHtmlBlock: React.FC<RawHtmlBlockProps> = ({ html, className = '', id = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      // Parse and insert HTML
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      
      // Append all child nodes
      const fragment = document.createDocumentFragment();
      [...template.content.childNodes].forEach(node => {
        fragment.appendChild(node.cloneNode(true));
      });
      
      containerRef.current.appendChild(fragment);
    }
  }, [html]);

  return <div ref={containerRef} className={className} id={id} />;
};

export default RawHtmlBlock;
