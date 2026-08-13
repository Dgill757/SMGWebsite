
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  schema?: object | object[];
}

const defaultTitle = "SummitVoiceAI - #1 AI Voice Assistant for Service Businesses";
const defaultDescription = "Transform your service business with SummitVoiceAI's cutting-edge AI voice assistant. Capture every call, qualify leads, and book appointments 24/7 with our advanced voice AI technology.";
const defaultKeywords = [
  "voice AI",
  "AI receptionist",
  "AI voice assistant",
  "virtual receptionist",
  "AI call answering",
  "automated scheduling",
  "lead qualification",
  "business voice AI",
  "CRM integration",
  "24/7 call handling"
];
const defaultOgImage = "/images/og-image.jpg";
const siteUrl = "https://summitaivoice.com";

export const SEO: React.FC<SEOProps> = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = defaultKeywords,
  ogImage = defaultOgImage,
  canonical = "",
  noIndex = false,
  schema
}) => {
  const metaTitle = title;
  const metaDescription = description;
  const metaKeywords = keywords.join(", ");
  const metaOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical.startsWith('/') ? '' : '/'}${canonical}` : siteUrl;
  
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
      
      {/* Version Tag */}
      <meta name="version" content="v10.0.0" />
      
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
      
      {/* HTML Comment for Version */}
      <script type="application/comment">
        {/* Powered by SummitVoiceAI v10.0.0 */}
      </script>
    </Helmet>
  );
};

// Organization schema for consistent branding
export const getOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SummitVoiceAI",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "sameAs": [
      "https://www.facebook.com/daniel.gill.iii",
      "https://x.com/SMG_Biz_Growth",
      "https://www.instagram.com/summit_marketing_group_/",
      "https://www.linkedin.com/company/summitmarketing-business-growth"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+12404740668",
      "contactType": "customer service",
      "availableLanguage": ["English"]
    },
    "description": "SummitVoiceAI provides AI voice assistant solutions for service businesses, handling calls, scheduling appointments, and qualifying leads 24/7."
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
      "name": "SummitVoiceAI",
      "url": siteUrl
    },
    "url": `${siteUrl}/industries/${industryName.toLowerCase().replace(/\s+/g, '-')}`,
    "image": `${siteUrl}/images/industries/${industryName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
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
