
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure the widget script is loaded
const loadWidgetScript = () => {
  const existingScript = document.querySelector('script[src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"]');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
    script.async = true;
    document.head.appendChild(script);
  }
};

// Load widget script when document is ready
document.addEventListener('DOMContentLoaded', loadWidgetScript);
// Also try to load it now in case the event has already fired
loadWidgetScript();

createRoot(document.getElementById("root")!).render(<App />);
