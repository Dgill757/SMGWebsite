
// SEO utility functions
import { Helmet } from 'react-helmet-async';
import React from 'react';

// SEO Types
export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
  ogImage?: string;
  schemaMarkup?: object | object[];
}

// Generate basic schema markup for the organization
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Summit Marketing Group',
    url: 'https://summitaivoice.com',
    logo: 'https://summitaivoice.com/lovable-uploads/c99219ee-c2be-4e58-a89a-ddb88e9a7695.png',
    sameAs: [
      'https://www.facebook.com/daniel.gill.iii',
      'https://x.com/SMG_Biz_Growth',
      'https://www.instagram.com/summit_marketing_group_/',
      'https://www.linkedin.com/company/summitmarketing-business-growth',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+12404740668',
      contactType: 'sales',
      availableLanguage: 'English',
    },
  };
};

// Generate service schema for industry-specific pages
export const generateServiceSchema = (name: string, description: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'SummitVoiceAI',
      url: 'https://summitaivoice.com',
    },
    areaServed: 'United States',
    serviceType: 'Voice AI Assistant',
  };
};

// Generate FAQ schema from a list of questions and answers
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

// Generate breadcrumb schema
export const generateBreadcrumbSchema = (breadcrumbs: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
};

// Main SEO component that uses react-helmet-async
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  keywords,
  ogType = 'website',
  ogImage = '/lovable-uploads/c99219ee-c2be-4e58-a89a-ddb88e9a7695.png',
  schemaMarkup,
}) => {
  const fullTitle = title.includes('SummitVoiceAI') 
    ? title 
    : `${title} | SummitVoiceAI`;

  return (
    <Helmet>
      {/* Basic tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="SummitVoiceAI" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org markup */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};
