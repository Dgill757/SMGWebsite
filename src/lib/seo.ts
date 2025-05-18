
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
  schema?: any;
  keywords?: string;
  industry?: string;
}

interface SchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  industryName?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

/**
 * Generates a breadcrumb schema for the page
 */
const generateBreadcrumbSchema = (industry?: string) => {
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://summitaivoice.com"
    }
  ];

  if (industry) {
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Industries",
      "item": "https://summitaivoice.com/industries"
    });

    items.push({
      "@type": "ListItem",
      "position": 3,
      "name": `${industry}`,
      "item": `https://summitaivoice.com/industries/${industry.toLowerCase().replace(/\s+/g, '-')}`
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
};

/**
 * Generates organization schema markup
 */
const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Summit Marketing Group",
    "url": "https://summitaivoice.com",
    "logo": "https://summitaivoice.com/lovable-uploads/c99219ee-c2be-4e58-a89a-ddb88e9a7695.png",
    "sameAs": [
      "https://www.facebook.com/daniel.gill.iii",
      "https://x.com/SMG_Biz_Growth",
      "https://www.instagram.com/summit_marketing_group_/",
      "https://www.linkedin.com/company/summitmarketing-business-growth"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+12404740668",
      "contactType": "sales",
      "availableLanguage": "English"
    }
  };
};

/**
 * Generates service schema markup
 */
const generateServiceSchema = (props: SchemaProps) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": `Voice AI Assistant for ${props.industryName || "Businesses"}`,
    "name": props.title,
    "description": props.description,
    "provider": {
      "@type": "Organization",
      "name": "Summit Marketing Group",
      "url": "https://summitaivoice.com"
    },
    "url": props.url,
    "image": props.image || "https://summitaivoice.com/lovable-uploads/c99219ee-c2be-4e58-a89a-ddb88e9a7695.png",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    }
  };
};

/**
 * Generates FAQ schema markup
 */
const generateFaqSchema = (faqs: { question: string; answer: string }[]) => {
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

/**
 * SEO component that handles all meta tags including schema
 */
const SEO = ({ 
  title, 
  description, 
  canonical = "https://summitaivoice.com", 
  image = "/lovable-uploads/c99219ee-c2be-4e58-a89a-ddb88e9a7695.png", 
  type = "website",
  schema,
  keywords = "",
  industry
}: SEOProps) => {
  const url = canonical;
  const siteName = "SummitVoiceAI";
  
  // Generate schemas
  const schemas = [];
  
  // Always include organization schema
  schemas.push(generateOrganizationSchema());
  
  // Add breadcrumb schema
  schemas.push(generateBreadcrumbSchema(industry));
  
  // Add custom schema if provided
  if (schema) {
    schemas.push(schema);
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org markup */}
      {schemas.map((schemaObj, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(schemaObj)}
        </script>
      ))}
    </Helmet>
  );
};

export {
  SEO,
  generateServiceSchema,
  generateFaqSchema
};
