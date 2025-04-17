
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WebWidget from '@/components/WebWidget';
import BenefitsSection from '@/components/BenefitsSection';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Summit Voice AI - #1 Voice AI Solution for Service Businesses";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transform your service business with Summit Voice AI\'s cutting-edge AI solutions. Featuring AI receptionists, automated scheduling, and seamless CRM integration.');
    }

    window.scrollTo(0, 0);
    
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }

    // Remove any existing widget script to avoid duplicates
    const existingScript = document.querySelector('script[src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"]');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }

    // Add the script
    const script = document.createElement('script');
    script.src = 'https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js';
    script.async = true;
    script.id = 'summit-voice-widget-script';
    
    // Add an onload handler to initialize the widget when the script loads
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

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <WebWidget />
        <BenefitsSection />
        <HowItWorks />
        <UseCases />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
