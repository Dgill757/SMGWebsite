
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { COMPANY } from '@/data/company';
import { ROUTE_META, SITE_URL } from '@/data/seoRoutes';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  schema?: object | object[];
}

const defaultTitle = ROUTE_META['/'].title;
const defaultDescription = ROUTE_META['/'].description;
const defaultKeywords = [
  "ai receptionist for roofing companies",
  "voice ai roofing",
  "missed call recovery roofing",
  "ai call answering roofing",
  "roofing lead follow up automation",
  "summit voice ai",
  "ava ai receptionist",
  "roofing crm automation",
  "24/7 roofing receptionist"
];
const defaultOgImage = "/lovable-uploads/c99219ee-c2be-4e58-a89a-ddb88e9a7695.png";
const siteUrl = SITE_URL;

export const SEO: React.FC<SEOProps> = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = defaultKeywords,
  ogImage = defaultOgImage,
  canonical,
  noIndex = false,
  schema
}) => {
  const { pathname } = useLocation();
  const metaTitle = title;
  const metaDescription = description;
  const metaKeywords = keywords.join(", ");
  const metaOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  const canonicalPath = canonical ?? pathname;
  const trimmedPath = canonicalPath.replace(/\/+$/, '');
  const canonicalUrl = trimmedPath ? `${siteUrl}${trimmedPath.startsWith('/') ? '' : '/'}${trimmedPath}` : siteUrl;
  
  // Handle schema being either a single object or an array of objects
  const schemaArray = schema ? (Array.isArray(schema) ? schema : [schema]) : [];
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaOgImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="SummitVoiceAI" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaOgImage} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Schema.org JSON-LD */}
      {schemaArray.map((schemaObj, index) => (
        <script 
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(schemaObj) 
          }}
        />
      ))}
      
    </Helmet>
  );
};

// Organization schema for consistent branding
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": "Summit Voice AI",
    "alternateName": "SummitVoiceAI",
    "url": siteUrl,
    "logo": `${siteUrl}/lovable-uploads/c99219ee-c2be-4e58-a89a-ddb88e9a7695.png`,
    "sameAs": [
      "https://www.facebook.com/daniel.gill.iii",
      "https://x.com/SMG_Biz_Growth",
      "https://www.instagram.com/summit_marketing_group_/",
      "https://www.linkedin.com/company/summitmarketing-business-growth"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+17573295913",
      "email": COMPANY.supportEmail,
      "contactType": "customer service",
      "availableLanguage": ["English"]
    },
    "description": "Summit Voice AI builds AI call answering and lead follow-up for roofing and home service contractors."
  };
};

// LocalBusiness (ProfessionalService) schema. Address and phone come from COMPANY and need Dan's confirmation.
export const getLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#localbusiness`,
    "name": "Summit Voice AI",
    "url": siteUrl,
    "image": `${siteUrl}/lovable-uploads/c99219ee-c2be-4e58-a89a-ddb88e9a7695.png`,
    "telephone": "+17573295913",
    "email": COMPANY.supportEmail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "12410 Milestone Center Drive #600",
      "addressLocality": "Germantown",
      "addressRegion": "MD",
      "postalCode": "20876",
      "addressCountry": "US"
    },
    "areaServed": { "@type": "Country", "name": "United States" },
    "description": "AI call answering and lead follow-up for roofing and home service contractors."
  };
};

// Service schema generator for industry pages
export const getServiceSchema = (
  industryName: string,
  description: string,
  areaName = "United States"
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": `AI Voice Assistant for ${industryName}`,
    "name": `SummitVoiceAI for ${industryName}`,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "Summit Voice AI",
      "url": siteUrl
    },
    "url": `${siteUrl}/industries/${industryName.toLowerCase().replace(/\s+/g, '-')}`,
    "areaServed": {
      "@type": "Country",
      "name": areaName
    }
  };
};

// FAQ schema generator
export const getFAQSchema = (faqs: {question: string, answer: string}[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export default SEO;
