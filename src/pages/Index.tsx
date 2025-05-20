
import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import DemoSection from '@/components/DemoSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import { useLocation } from 'react-router-dom';
import CalendarDialog from "@/components/CalendarDialog";
import Widget from '@/components/Widget';
import { SEO, getOrganizationSchema, getFAQSchema } from '@/lib/seo';

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

    // Force widget visibility after initial load
    setTimeout(() => {
      const widgetDiv = document.querySelector('[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]');
      if (widgetDiv && widgetDiv instanceof HTMLElement) {
        widgetDiv.style.display = 'block';
        widgetDiv.style.visibility = 'visible';
        widgetDiv.style.opacity = '1';
      }
    }, 1000);
  }, [location.pathname, location.hash]);

  // FAQ data for schema
  const faqs = [
    {
      question: "What is SummitVoiceAI?",
      answer: "SummitVoiceAI is an advanced AI voice assistant solution specifically designed for service businesses that helps capture every call, qualify leads, and book appointments 24/7 without human intervention."
    },
    {
      question: "How much can my business save with SummitVoiceAI?",
      answer: "Most businesses save 60-80% compared to traditional receptionist costs. Our clients typically see ROI within the first month and savings of $30,000-$50,000 annually."
    },
    {
      question: "Does SummitVoiceAI integrate with my existing systems?",
      answer: "Yes, SummitVoiceAI seamlessly integrates with most popular CRM systems, scheduling software, and business management tools including Salesforce, Google Calendar, Microsoft Outlook, and industry-specific platforms."
    },
    {
      question: "How accurate is the voice recognition?",
      answer: "Our AI voice technology achieves over 95% accuracy in understanding caller requests, questions, and information across various accents and background noise conditions."
    }
  ];

  return (
    <>
      <SEO 
        title="SummitVoiceAI - #1 AI Voice Assistant for Service Businesses | Never Miss a Call"
        description="Transform your service business with SummitVoiceAI's cutting-edge AI voice assistant. Capture every call, qualify leads, and book appointments 24/7—increase revenue by 40% with our AI receptionist technology."
        keywords={[
          "AI voice assistant", 
          "virtual receptionist", 
          "voice AI for business",
          "AI call answering",
          "automated scheduling",
          "24/7 call handling",
          "lead qualification AI",
          "phone automation",
          "business voice assistant",
          "AI receptionist"
        ]}
        schema={[getOrganizationSchema(), getFAQSchema(faqs)]}
      />
      
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <main>
          {/* Pass calendar modal controls to Hero */}
          <HeroSection calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} />
          
          {/* Widget component placed immediately after HeroSection */}
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
