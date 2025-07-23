
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

const defaultTitle = "SummitVoiceAI - #1 AI Voice Assistant for Service Businesses | Never Miss a Lead";
const defaultDescription = "Transform your service business with SummitVoiceAI's cutting-edge AI voice assistant. Capture every call, qualify leads, and book appointments 24/7. Increase revenue by 40% with our human-like AI receptionist that works around the clock.";
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
  "24/7 call handling",
  "service business AI",
  "missed call prevention",
  "appointment booking AI",
  "lead capture automation",
  "phone answering service",
  "conversational AI",
  "business automation",
  "customer service AI",
  "HVAC AI assistant",
  "plumbing AI receptionist",
  "real estate AI",
  "healthcare AI assistant",
  "legal AI receptionist",
  "automotive AI",
  "professional services AI",
  "landscaping AI",
  "home services AI",
  "AI for small business",
  "voice technology",
  "speech recognition",
  "natural language processing",
  "intelligent call routing",
  "automated customer service",
  "AI appointment scheduling",
  "voice-powered CRM",
  "smart phone system",
  "business phone AI",
  "call center automation",
  "virtual phone assistant",
  "AI customer support",
  "automated lead nurturing",
  "voice AI platform",
  "business communication AI",
  "intelligent virtual assistant",
  "conversational commerce",
  "voice-first business",
  "AI sales assistant",
  "automated follow-up",
  "smart scheduling",
  "voice analytics",
  "call intelligence"
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
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="SummitVoiceAI" />
      <meta name="generator" content="SummitVoiceAI v10.0.0" />
      <meta name="application-name" content="SummitVoiceAI" />
      <meta name="msapplication-TileColor" content="#7C3AED" />
      <meta name="theme-color" content="#7C3AED" />
      
      {/* Business-Specific Meta Tags */}
      <meta name="business-type" content="SaaS, AI Technology, Voice AI, Business Automation" />
      <meta name="target-audience" content="Service Businesses, Small Business Owners, Entrepreneurs" />
      <meta name="service-area" content="United States, Global" />
      <meta name="industry" content="AI Voice Technology, Business Communication, Customer Service Automation" />
      
      {/* Performance Hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.youtube.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Additional Twitter Tags */}
      <meta name="twitter:site" content="@SMG_Biz_Growth" />
      <meta name="twitter:creator" content="@SMG_Biz_Growth" />
      <meta name="twitter:domain" content="summitaivoice.com" />
      
      {/* LinkedIn Meta Tags */}
      <meta property="og:article:author" content="https://www.linkedin.com/company/summitmarketing-business-growth" />
      <meta property="article:publisher" content="https://www.linkedin.com/company/summitmarketing-business-growth" />
      
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
    "alternateName": "Summit Voice AI",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "image": `${siteUrl}/images/og-image.jpg`,
    "foundingDate": "2023",
    "founder": {
      "@type": "Person",
      "name": "Daniel Gill",
      "jobTitle": "CEO & Founder"
    },
    "legalName": "Summit Marketing Group LLC",
    "slogan": "The #1 AI Voice Assistant for Service Businesses",
    "keywords": "AI Voice Assistant, Virtual Receptionist, Business Automation, Lead Qualification, Appointment Scheduling",
    "industry": "AI Voice Technology",
    "numberOfEmployees": "10-50",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "MD",
      "addressLocality": "Maryland"
    },
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
      "email": "dan@summitmktggroup.com",
      "availableLanguage": ["English"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    },
    "description": "SummitVoiceAI provides AI voice assistant solutions for service businesses, handling calls, scheduling appointments, and qualifying leads 24/7. Our human-like AI receptionist never misses a call and increases business revenue by up to 40%.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "name": "AI Voice Assistant Service",
      "description": "24/7 AI voice assistant for service businesses",
      "priceRange": "$$$",
      "availability": "https://schema.org/InStock"
    }
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

// Software Application schema for SummitVoiceAI
export const getSoftwareApplicationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SummitVoiceAI",
    "alternateName": "Summit Voice AI Platform",
    "description": "AI-powered voice assistant platform for service businesses. Never miss a call, qualify leads automatically, and book appointments 24/7 with our human-like AI receptionist.",
    "url": siteUrl,
    "downloadUrl": siteUrl,
    "image": `${siteUrl}/images/og-image.jpg`,
    "screenshot": `${siteUrl}/images/dashboard-screenshot.jpg`,
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "AI Voice Assistant",
    "operatingSystem": "Web-based",
    "softwareVersion": "10.0.0",
    "releaseDate": "2024-01-01",
    "datePublished": "2024-01-01",
    "dateModified": "2024-01-23",
    "author": {
      "@type": "Organization",
      "name": "SummitVoiceAI"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SummitVoiceAI",
      "url": siteUrl
    },
    "offers": {
      "@type": "Offer",
      "name": "SummitVoiceAI Plans",
      "description": "Flexible pricing plans for businesses of all sizes",
      "priceRange": "$97-$297",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "eligibleRegion": {
        "@type": "Country",
        "name": "United States"
      }
    },
    "featureList": [
      "24/7 AI call answering",
      "Lead qualification automation",
      "Appointment scheduling",
      "CRM integration",
      "Multi-language support",
      "Real-time analytics",
      "Custom voice training",
      "Call recording and transcription"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "SummitVoiceAI transformed our HVAC business. We went from missing 30% of calls to capturing every lead. Revenue increased by 45% in just 3 months!"
      }
    ],
    "keywords": "AI voice assistant, virtual receptionist, business automation, lead qualification, appointment scheduling, call answering service"
  };
};

// WebSite schema for enhanced search features
export const getWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SummitVoiceAI",
    "alternateName": "Summit Voice AI",
    "url": siteUrl,
    "description": "The #1 AI Voice Assistant platform for service businesses. Never miss a call, qualify leads automatically, and increase revenue with our 24/7 AI receptionist.",
    "inLanguage": "en-US",
    "copyrightYear": "2024",
    "copyrightHolder": {
      "@type": "Organization",
      "name": "SummitVoiceAI"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SummitVoiceAI"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/?s={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "SummitVoiceAI"
    }
  };
};

// Breadcrumb schema generator
export const getBreadcrumbSchema = (breadcrumbs: {name: string, url: string}[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

// Article schema for blog posts and industry pages
export const getArticleSchema = (
  title: string,
  description: string,
  url: string,
  image: string,
  datePublished: string,
  dateModified: string
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Organization",
      "name": "SummitVoiceAI"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SummitVoiceAI",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };
};

export default SEO;
