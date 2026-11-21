import React from 'react';
import { Link } from 'react-router-dom';
import { SEO, getOrganizationSchema } from '@/lib/seo';
import LeadForm from '@/components/leads/LeadForm';
import { ComplianceNote, FormCard, LandingHero, LandingShell, ListSection, TextSection } from '@/components/leads/LandingParts';
import { ROUTE_META } from '@/data/seoRoutes';
import { COMPANY } from '@/data/company';

const meta = ROUTE_META['/free-website-preview'];

const FreeWebsitePreview: React.FC = () => (
  <>
    <SEO
      title={meta.title}
      description={meta.description}
      canonical="/free-website-preview"
      schema={[getOrganizationSchema()]}
    />
    <LandingShell>
      <LandingHero
        eyebrow="For roofing contractors"
        headline="See your new roofing website before you pay for anything."
        sub="Tell us about your company. We'll build a preview with your name and service area, plus a roofing receptionist demo you can call yourself."
        bullets={[
          'A preview built for your company, not a template with a blank name.',
          'A demo phone number you can call to hear how a roofing-specific AI receptionist handles a leak call.',
          "No card, no contract. If you like it, we'll talk about next steps. If you don't, that's fine.",
        ]}
        form={
          <FormCard title="Send me my preview" sub="Seven quick fields. I build these by hand, so give me a little time.">
            <LeadForm
              form="free-website-preview"
              vertical="roofing"
              offerInterest="front-office"
              fields={{ company: true, website: true, serviceArea: true, message: true }}
              submitLabel="Send me my preview"
              messageLabel="Anything we should know? (optional)"
              bookingKind="discovery"
              thankYouBody="I'll review your company and send your preview by email. I build these by hand, so give me a little time. I'll tell you honestly what I can and can't show you. Want to talk it through sooner? Pick a time."
            />
          </FormCard>
        }
      />

      <TextSection heading="Who's behind this">
        I'm Dan. I came up in roofing and now I build systems for roofers. I'd rather show you something than send you another pitch. Fill this out and I'll send the preview to you.
      </TextSection>

      <ListSection
        heading="What this is, and what it is not"
        items={[
          'A preview is free. It is not a live website.',
          'Putting a site live, hosting it, and answering your real phone calls require a written agreement that you read and accept first.',
          'A preview is not a contract and carries no obligation.',
        ]}
      />

      <ComplianceNote>
        {COMPANY.brand}, {COMPANY.address}. By submitting this form you agree to be contacted by email about your preview. Text
        messages are sent only if you check the text message box. Message frequency varies. Message and data rates may apply.
        Reply STOP to opt out or HELP for help. You can unsubscribe from emails at any time. The demo phone line uses an
        automated assistant and calls may be recorded. Your information is used to prepare your preview and follow up with you.
        We do not sell your contact information.{' '}
        <Link to="/privacy-policy" style={{ color: '#00D9FF' }}>
          Privacy Policy
        </Link>
        ,{' '}
        <Link to="/terms-of-service" style={{ color: '#00D9FF' }}>
          Terms of Service
        </Link>
        ,{' '}
        <Link to="/sms-terms" style={{ color: '#00D9FF' }}>
          SMS Terms
        </Link>
        . A preview is not a contract. Production hosting, management and phone service require a written agreement.
      </ComplianceNote>
    </LandingShell>
  </>
);

export default FreeWebsitePreview;
