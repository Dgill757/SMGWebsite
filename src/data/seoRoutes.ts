/**
 * Per-route SEO metadata. Pure data (no React) so the build step can also use it
 * to write route-specific HTML for crawlers that do not run JavaScript.
 */
import { VERTICALS } from './verticals';

export interface RouteMeta {
  title: string;
  description: string;
  noIndex?: boolean;
}

export const SITE_URL = 'https://www.summitvoiceai.com';

export const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    title: 'Summit Voice AI | AI Voice Receptionist for Roofing Companies',
    description:
      'Summit Voice AI answers your calls when you cannot, books appointments and follows up with leads for roofing and home service contractors. Hear a live demo.',
  },
  '/industries': {
    title: 'Industries We Serve | Summit Voice AI',
    description:
      'Summit Voice AI builds call answering and lead follow-up for roofing, HVAC, plumbing, landscaping, pool and other home service businesses.',
  },
  '/articles': {
    title: 'Articles for Service Businesses | Summit Voice AI',
    description:
      'Practical reads on missed calls, lead follow-up and AI call answering for contractors and service businesses.',
  },
  '/free-website-preview': {
    title: 'Free Website Preview for Roofers | Summit Voice AI',
    description:
      'Get a free preview of a new roofing website with your company name and service area, plus a roofing receptionist demo you can call. No card, no contract.',
  },
  '/revenue-leak-audit': {
    title: 'Revenue Leak Audit for Roofing Companies | Summit Voice AI',
    description:
      'A short audit using your own numbers. We look at missed calls, quiet estimates and old leads, and show the math on cautious assumptions you can change.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Summit Voice AI',
    description: 'How Summit Voice AI collects, uses and protects your information, including text message data.',
  },
  '/terms-of-service': {
    title: 'Terms of Service | Summit Voice AI',
    description: 'The terms that apply when you use the Summit Voice AI website and services.',
  },
  '/sms-terms': {
    title: 'SMS Terms and Conditions | Summit Voice AI',
    description:
      'Program details for the Summit Voice AI text message program: message types, frequency, rates, and how to opt out with STOP or get help with HELP.',
  },
  '/cookie-policy': {
    title: 'Cookie Policy | Summit Voice AI',
    description: 'How the Summit Voice AI website uses cookies and similar tools.',
  },
  '/gdpr-compliance': {
    title: 'GDPR Compliance | Summit Voice AI',
    description: 'How Summit Voice AI handles personal data and privacy requests.',
  },
};

for (const v of Object.values(VERTICALS)) {
  ROUTE_META[`/for/${v.slug}`] = { title: v.metaTitle, description: v.metaDescription };
}

export const metaFor = (path: string): RouteMeta | undefined => ROUTE_META[path.replace(/\/+$/, '') || '/'];
