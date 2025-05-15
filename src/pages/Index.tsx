
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CalendarDialog from "@/components/CalendarDialog";
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import DemoSection from '@/components/DemoSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import Widget from '@/components/Widget';
import { SEO, generateOrganizationSchema } from '@/lib/seo';

const Index = () => {
  const location = useLocation();
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, [location.pathname, location.hash]);

  // Define SEO properties for the homepage
  const seoTitle = "Summit Voice AI - #1 Voice AI Solution for Service Businesses";
  const seoDescription = "Transform your service business with Summit Voice AI's cutting-edge AI solutions. Featuring AI receptionists, automated scheduling, and seamless CRM integration.";
  const keywords = [
    "voice ai for business",
    "ai receptionist",
    "virtual receptionist",
    "business automation",
    "smart scheduling",
    "CRM integration",
    "service business automation",
    "Summit Voice AI",
    "voice technology",
    "automated customer service",
    "AI customer support"
  ];
  
  // Define schema markup for the homepage
  const schemaMarkup = [
    generateOrganizationSchema(),
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://summitaivoice.com",
      "name": seoTitle,
      "description": seoDescription,
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://summitaivoice.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
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
    }
  ];

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={keywords}
        canonical="https://summitaivoice.com"
        schemaMarkup={schemaMarkup}
      />
      
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <main>
          {/* Pass calendar modal controls to Hero and Pricing */}
          <HeroSection calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} />
          
          {/* Our new widget placeholder */}
          <Widget />
          
          <BenefitsSection />
          <HowItWorks />
          <UseCases />
          <DemoSection />
          <TestimonialsSection />
          <PricingSection onOpenCalendar={() => setCalendarOpen(true)} />
          <FAQSection />
          <CalendarDialog open={calendarOpen} setOpen={setCalendarOpen} />
        </main>
      </div>
    </>
  );
};

export default Index;
