import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import RevenueSection from '@/components/RevenueSection';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import TestimonialsSection from '@/components/TestimonialsSection';
import MissedCallCalculator from '@/components/ROICalculator';
import HowAvaWorks from '@/components/HowAvaWorks';
import DemoCallsSection from '@/components/DemoCallsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import CalendarDialog from '@/components/CalendarDialog';
import Widget from '@/components/Widget';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';
import { SEO, getOrganizationSchema, getFAQSchema } from '@/lib/seo';
import { IntegrationMarquee } from '@/components/IntegrationMarquee';
import { AvaComparison } from '@/components/AvaComparison';
import { AnimatedStats } from '@/components/AnimatedStats';
import { RoofingTestimonials } from '@/components/RoofingTestimonials';
import { TrackRecord } from '@/components/TrackRecord';

const Index = () => {
  const location = useLocation();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [ctaDismissed, setCtaDismissed] = React.useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [location.pathname, location.hash]);

  const faqs = [
    {
      question: 'What is SummitVoiceAI?',
      answer: 'SummitVoiceAI is an advanced AI voice assistant solution specifically designed for service businesses that helps capture every call, qualify leads, and book appointments 24/7 without human intervention.',
    },
    {
      question: 'How much can my business save with SummitVoiceAI?',
      answer: 'Most businesses save 60-80% compared to traditional receptionist costs. Our clients typically see ROI within the first month and savings of $30,000-$50,000 annually.',
    },
    {
      question: 'Does SummitVoiceAI integrate with my existing systems?',
      answer: 'Yes, SummitVoiceAI seamlessly integrates with most popular CRM systems, scheduling software, and business management tools including Salesforce, Google Calendar, Microsoft Outlook, and industry-specific platforms.',
    },
    {
      question: 'How accurate is the voice recognition?',
      answer: 'Our AI voice technology achieves over 95% accuracy in understanding caller requests, questions, and information across various accents and background noise conditions.',
    },
  ];

  return (
    <>
      <SEO
        title="Summit Voice AI — AI Voice Receptionist for Roofing Companies"
        description="Ava answers every call 24/7, books roofing appointments automatically, and syncs your CRM. Trusted by 42+ roofing companies. $84M+ in client revenue recovered annually. Try Ava free — no credit card required."
        keywords={[
          'ai receptionist for roofing companies', 'voice ai roofing', 'missed call recovery roofing',
          'ai call answering roofing', 'roofing lead follow up automation', 'summit voice ai',
          'ava ai receptionist', 'roofing crm automation', '24/7 roofing receptionist',
          'pool company ai receptionist', 'lawn care ai answering service', 'hvac ai receptionist',
          'real estate ai lead response', 'law firm ai receptionist', 'home service business ai',
          'ai receptionist canada', 'us and canada ai voice agent', 'revenue recovery roofing',
          'roofing appointment booking ai', 'service business automation',
          'estimate follow up automation', 'database reactivation roofing',
          'google review automation roofing', 'voice AI', 'AI receptionist', 'virtual receptionist',
        ]}
        schema={[getOrganizationSchema(), getFAQSchema(faqs)]}
      />

      <div style={{ background: '#000000', minHeight: '100vh', overflowX: 'hidden', paddingTop: 'var(--page-top)' }}>
        <HeroSection />
        <IntegrationMarquee />
        <AvaComparison />
        <AnimatedStats />
        <TrackRecord />
        <Widget />
        <RevenueSection />
        <HowItWorks />
        <UseCases />
        <SectionErrorBoundary label="HowAvaWorks">
          <HowAvaWorks />
        </SectionErrorBoundary>
        <SectionErrorBoundary label="DemoCallsSection">
          <DemoCallsSection />
        </SectionErrorBoundary>
        <RoofingTestimonials />
        <TestimonialsSection />
        <MissedCallCalculator />
        <PricingSection onOpenCalendar={() => setCalendarOpen(true)} />
        <FAQSection />

        {!ctaDismissed && (
          <div className="sticky-mobile-cta">
            <button
              className="sticky-cta-btn"
              onClick={() => {
                const container = document.querySelector('.wcw-state-container') as HTMLElement | null;
                if (container) container.click();
                const section = document.getElementById('experience-ava');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              🎙️ Talk to Ava — Free Demo
            </button>
            <button
              className="sticky-dismiss-btn"
              onClick={() => setCtaDismissed(true)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <CalendarDialog open={calendarOpen} setOpen={setCalendarOpen} />
      </div>
    </>
  );
};

export default Index;
