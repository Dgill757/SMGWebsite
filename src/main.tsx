
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add ThinkrrWebWidget to global Window interface
declare global {
  interface Window {
    ThinkrrWebWidget?: {
      init: (config: { key: string }) => void;
    };
  }
}

createRoot(document.getElementById("root")!).render(<App />);
