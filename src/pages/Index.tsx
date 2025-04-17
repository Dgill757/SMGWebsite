
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
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

    // Load the voice AI widget script
    const script = document.createElement('script');
    script.src = "https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js";
    script.async = true;
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main>
        <HeroSection />
        
        {/* Voice AI Widget container */}
        <div className="py-8">
          <div className="container mx-auto">
            <div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"></div>
          </div>
        </div>
        
        <BenefitsSection />
        <HowItWorks />
        <UseCases />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
      </main>
    </div>
  );
};

export default Index;
