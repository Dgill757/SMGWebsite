import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '@/components/HeroSection';
import RevenueSection from '@/components/RevenueSection';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import TestimonialsSection from '@/components/TestimonialsSection';
import MissedCallCalculator from '@/components/ROICalculator';
import HowAvaWorks from '@/components/HowAvaWorks';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import CalendarDialog from '@/components/CalendarDialog';
import Widget from '@/components/Widget';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';
import { SEO, getOrganizationSchema, getLocalBusinessSchema } from '@/lib/seo';
import { ROUTE_META } from '@/data/seoRoutes';
import { IntegrationMarquee } from '@/components/IntegrationMarquee';
import { AvaComparison } from '@/components/AvaComparison';

// Below-the-fold, non-critical sections — code-split so they don't block
// initial render/hydration of the hero and above-the-fold content.
const AnimatedStats = lazy(() => import('@/components/AnimatedStats').then(m => ({ default: m.AnimatedStats })));
const TrackRecord = lazy(() => import('@/components/TrackRecord').then(m => ({ default: m.TrackRecord })));
const RoofingTestimonials = lazy(() => import('@/components/RoofingTestimonials').then(m => ({ default: m.RoofingTestimonials })));
const DemoCallsSection = lazy(() => import('@/components/DemoCallsSection'));

const SectionFallback = () => <div style={{ height: 400 }} />;

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

  return (
    <>
      <SEO
        title={ROUTE_META['/'].title}
        description={ROUTE_META['/'].description}
        canonical="/"
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
        schema={[getOrganizationSchema(), getLocalBusinessSchema()]}
      />

      <div style={{ background: '#000000', minHeight: '100vh', overflowX: 'hidden', paddingTop: 'var(--page-top)' }}>
        <HeroSection />
        <IntegrationMarquee />
        <AvaComparison />
        <Suspense fallback={<SectionFallback />}>
          <AnimatedStats />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <TrackRecord />
        </Suspense>
        <Widget />
        <RevenueSection />
        <HowItWorks />
        <UseCases />
        <SectionErrorBoundary label="HowAvaWorks">
          <HowAvaWorks />
        </SectionErrorBoundary>
        <SectionErrorBoundary label="DemoCallsSection">
          <Suspense fallback={<SectionFallback />}>
            <DemoCallsSection />
          </Suspense>
        </SectionErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <RoofingTestimonials />
        </Suspense>
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
