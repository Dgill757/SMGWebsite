
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
import CalendarDialog from "@/components/CalendarDialog";
import { useState } from 'react';

const Index = () => {
  const location = useLocation();
  const [calendarOpen, setCalendarOpen] = useState(false);
  
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
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main>
        {/* Pass calendar modal controls to Hero and Pricing */}
        <HeroSection calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} />
        
        <BenefitsSection />
        <HowItWorks />
        <UseCases />
        <TestimonialsSection />
        <PricingSection onOpenCalendar={() => setCalendarOpen(true)} />
        <FAQSection />
        <CalendarDialog open={calendarOpen} setOpen={setCalendarOpen} />
      </main>
    </div>
  );
};

export default Index;
