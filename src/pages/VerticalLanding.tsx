import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { SEO, getOrganizationSchema } from '@/lib/seo';
import LeadForm from '@/components/leads/LeadForm';
import { CardSection, ComplianceNote, FormCard, LandingHero, LandingShell, ListSection } from '@/components/leads/LandingParts';
import { NOT_LIST, VERTICALS, VERTICAL_SLUGS } from '@/data/verticals';
import { SITE_URL } from '@/data/seoRoutes';
import { COMPANY } from '@/data/company';
import NotFound from './NotFound';

const VerticalLanding: React.FC = () => {
  const { vertical } = useParams<{ vertical: string }>();
  const config = vertical ? VERTICALS[vertical.toLowerCase()] : undefined;

  if (!config) return <NotFound />;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `AI receptionist and lead follow-up for ${config.label.toLowerCase()} companies`,
    description: config.metaDescription,
    url: `${SITE_URL}/for/${config.slug}`,
    provider: { '@type': 'Organization', name: 'Summit Voice AI', url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'United States' },
  };

  return (
    <>
      <SEO
        title={config.metaTitle}
        description={config.metaDescription}
        canonical={`/for/${config.slug}`}
        schema={[getOrganizationSchema(), serviceSchema]}
      />
      <LandingShell>
        <LandingHero
          eyebrow={config.eyebrow}
          headline={config.headline}
          sub={config.sub}
          scene={config.scene}
          form={
            <FormCard title={config.formTitle} sub={config.formSub}>
              <LeadForm
                form={`vertical-${config.slug}`}
                vertical={config.vertical}
                offerInterest="undecided"
                fields={{ company: true, serviceArea: true, message: true }}
                submitLabel={config.submitLabel}
                messageLabel={config.messageLabel}
                bookingKind="discovery"
              />
            </FormCard>
          }
        />

        <CardSection heading="Where the jobs slip away" items={config.pains} />
        <CardSection
          heading="What we set up for you"
          intro="Plain and simple. We build it, we set it up, and we show you what it is doing."
          items={config.fixes}
        />
        <ListSection heading="What this is not" items={NOT_LIST} />

        <section style={{ maxWidth: 1180, margin: '0 auto', padding: '1rem 1.5rem 3rem' }}>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.72)', margin: 0 }}>
            Other trades:{' '}
            {VERTICAL_SLUGS.filter((s) => s !== config.slug).map((s, i, arr) => (
              <React.Fragment key={s}>
                <Link to={`/for/${s}`} style={{ color: '#00D9FF', textDecoration: 'underline' }}>
                  {VERTICALS[s].label}
                </Link>
                {i < arr.length - 1 ? ', ' : ''}
              </React.Fragment>
            ))}
            .
          </p>
        </section>

        <ComplianceNote>
          {COMPANY.brand}, {COMPANY.address}. Any call and lead numbers are examples, not predictions, guarantees or typical
          results. Text messages are sent only if you check the box on the form. Message and data rates may apply. Reply STOP to
          opt out or HELP for help. Our demo line uses an automated assistant and calls may be recorded. See our{' '}
          <Link to="/privacy-policy" style={{ color: '#00D9FF' }}>
            Privacy Policy
          </Link>
          ,{' '}
          <Link to="/terms-of-service" style={{ color: '#00D9FF' }}>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/sms-terms" style={{ color: '#00D9FF' }}>
            SMS Terms
          </Link>
          .
        </ComplianceNote>
      </LandingShell>
    </>
  );
};

export default VerticalLanding;
