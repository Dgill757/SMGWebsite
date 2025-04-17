
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import GDPRCompliance from "./pages/GDPRCompliance";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Check if script already exists to avoid duplicate additions
    const existingScript = document.getElementById('summit-voice-widget-script');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
      script.async = true;
      script.id = 'summit-voice-widget-script';
      
      script.onload = () => {
        if (window.hasOwnProperty('SummitVoiceWidget')) {
          // @ts-ignore - The widget might not be typed
          if (typeof window.SummitVoiceWidget?.init === 'function') {
            // @ts-ignore
            window.SummitVoiceWidget.init();
            console.log('Summit Voice Widget initialized');
          }
        }
      };
      
      document.head.appendChild(script);
    }

    // No cleanup function that tries to remove the script
    // This avoids the "Node.removeChild" error
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/gdpr-compliance" element={<GDPRCompliance />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
