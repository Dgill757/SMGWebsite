
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import DemoSection from '@/components/DemoSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import CalendarDialog from "@/components/CalendarDialog";
import Widget from '@/components/Widget';
import { SEO, generateServiceSchema } from '@/lib/seo';

const Index = () => {
  const location = useLocation();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Always scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Check for hash or state from navigation
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        } else if (location.hash === '#widget' && widgetRef.current) {
          widgetRef.current.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 500);
    } else if (location.state && location.state.scrollTo) {
      // Handle state-based scroll targets (from navigation)
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        } else if (location.state.scrollTo === 'widget' && widgetRef.current) {
          widgetRef.current.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, [location.pathname, location.hash, location.state]);

  // Home page schema for service business
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Summit Voice AI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "199.00",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "254"
    },
    "description": "AI-powered voice assistant for service businesses. Handles calls, schedules appointments, and follows up with customers automatically."
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title="Summit Voice AI - #1 Voice AI Solution for Service Businesses"
        description="Transform your service business with AI-powered voice assistants. Our AI receptionist handles calls, schedules appointments, and qualifies leads 24/7. Try Summit Voice AI today."
        keywords="voice ai for business, ai receptionist, virtual receptionist, business automation, smart scheduling, CRM integration, service business automation"
        schema={homePageSchema}
      />
      <main>
        {/* Pass calendar modal controls to Hero and Pricing */}
        <HeroSection calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} />
        
        {/* Our widget placeholder with ref for scrolling */}
        <div id="widget" ref={widgetRef}>
          <Widget />
        </div>
        
        <div id="features">
          <BenefitsSection />
        </div>
        
        <div id="how-it-works">
          <HowItWorks />
        </div>
        
        <div id="use-cases">
          <UseCases />
        </div>
        
        <DemoSection />
        
        <TestimonialsSection />
        
        <div id="pricing">
          <PricingSection onOpenCalendar={() => setCalendarOpen(true)} />
        </div>
        
        <FAQSection />
        <CalendarDialog open={calendarOpen} setOpen={setCalendarOpen} />
      </main>
    </div>
  );
};

export default Index;
