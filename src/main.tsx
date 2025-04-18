
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure the widget script is loaded properly
const loadWidgetScript = () => {
  const existingScript = document.querySelector('script[src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"]');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
    script.async = true;
    document.head.appendChild(script);
  }
};

// Load widget script immediately
loadWidgetScript();

// Also load on DOMContentLoaded as a backup
document.addEventListener('DOMContentLoaded', () => {
  loadWidgetScript();
  // Force scroll to top on page load
  window.scrollTo(0, 0);
});

createRoot(document.getElementById("root")!).render(<App />);
