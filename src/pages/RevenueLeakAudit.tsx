import React from 'react';
import { Link } from 'react-router-dom';
import { SEO, getOrganizationSchema } from '@/lib/seo';
import LeadForm from '@/components/leads/LeadForm';
import { CardSection, ComplianceNote, FormCard, LandingHero, LandingShell, ListSection } from '@/components/leads/LandingParts';
import { ROUTE_META } from '@/data/seoRoutes';
import { COMPANY } from '@/data/company';

const meta = ROUTE_META['/revenue-leak-audit'];

const RevenueLeakAudit: React.FC = () => (
  <>
    <SEO
      title={meta.title}
      description={meta.description}
      canonical="/revenue-leak-audit"
      schema={[getOrganizationSchema()]}
    />
    <LandingShell>
      <LandingHero
        eyebrow="For roofing contractors"
        headline="Where are jobs slipping away from your roofing company?"
        sub="A short audit using your own numbers. We look at missed calls, unsold estimates, and old leads, and show you what the math says on cautious assumptions you can change."
        bullets={[
          'We check the three places jobs usually slip: calls nobody answered, estimates that went quiet, and old leads nobody followed up.',
          'You get a plain one-page summary of what we found, based on what you tell us and what we can verify.',
          "No pitch deck. If the math says it's small, we'll tell you.",
        ]}
        form={
          <FormCard title="Request my audit" sub="About five minutes. Rough numbers are fine.">
            <LeadForm
              form="revenue-leak-audit"
              vertical="roofing"
              offerInterest="revenue-engine"
              fields={{ company: true, website: true, qualification: true, databaseSize: true, message: true }}
              submitLabel="Request my audit"
              messageLabel="What would you most like to fix? (missed calls, estimate follow-up, old leads, reviews, website, not sure)"
              bookingKind="discovery"
              thankYouBody="I'll review your numbers and send your summary by email. If you'd like to go through it together, pick a 15 minute slot. No pressure."
            />
          </FormCard>
        }
      />

      <ListSection
        heading="What we need from you"
        intro="About five minutes."
        items={[
          'Rough calls per day and how many go unanswered',
          'Average job value',
          'Your close rate, roughly',
          'About how many old leads and estimates you have',
          'Optional: your website, so we can check what we can verify from the outside',
        ]}
      />

      <ListSection
        heading="What you get"
        items={[
          'A one-page summary with your numbers, the assumptions we used, and what we would look at first',
          'A conservative estimate of contract value in play, labeled as arithmetic on your inputs, not a prediction',
          'A short call to walk through it if you want one',
        ]}
      />

      <CardSection
        heading="How we treat the numbers"
        items={[
          {
            title: 'Cautious assumptions',
            body: 'We use cautious assumptions and show every one of them, so you can change them.',
          },
          {
            title: 'Signed is not collected',
            body: 'A signed contract is not collected revenue and is not profit. A recovered lead is not a signed job.',
          },
          {
            title: 'No promises',
            body: 'Nothing in the audit is a promise of results. It is arithmetic on what you tell us.',
          },
        ]}
      />

      <ComplianceNote>
        {COMPANY.brand}, {COMPANY.address}. By submitting this form you agree to be contacted by email about your audit. Text
        messages are sent only if you check the text message box. Message frequency varies. Message and data rates may apply.
        Reply STOP to opt out or HELP for help. You can unsubscribe from emails at any time. The audit uses the numbers you
        provide and stated assumptions. Any figures are illustrations, not predictions, guarantees, or typical results. Signed
        contract value is not collected revenue or profit.{' '}
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
        .
      </ComplianceNote>
    </LandingShell>
  </>
);

export default RevenueLeakAudit;
