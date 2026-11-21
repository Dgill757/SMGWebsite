/**
 * Company facts used on legal and lead pages.
 * Anything that is not confirmed is a visible [FILL IN] placeholder on purpose.
 * Resolve every placeholder before this branch is merged (see GHL_INTEGRATION.md).
 */
export const COMPANY = {
  brand: 'Summit Voice AI',
  /** Exact legal entity name is not confirmed. Do not guess. */
  legalEntity: '[FILL IN: exact legal entity name]',
  /** Same address Dan's legal drafts use. Confirm it is where mail is received. */
  address: '12410 Milestone Center Drive #600, Germantown, MD 20876',
  /** Phone the live site footer already publishes. Confirm it is answered. */
  phone: '757-329-5913',
  phoneHref: 'tel:+17573295913',
  /** Support email the live site footer already publishes. Confirm it is monitored. */
  supportEmail: 'support@summitvoiceai.com',
  effectiveDate: '[FILL IN: effective date]',
  siteUrl: 'https://www.summitvoiceai.com',
} as const;

/** GoHighLevel booking pages from website-ghl-map.json. */
export const BOOKING_LINKS = {
  /** Sales call. */
  discovery: 'https://link.dlgsolution.com/widget/bookings/sv-discovery',
  /** Live AI demo. */
  demo: 'https://link.dlgsolution.com/widget/bookings/sv-live-demo',
} as const;

export type BookingKind = keyof typeof BOOKING_LINKS;

/** Exact wording required by the carrier and A2P campaign. Do not edit without updating the campaign. */
export const SMS_CONSENT_TEXT =
  'By checking this box, I agree to receive text messages from Summit Voice AI about my inquiry and our services. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase. See our Privacy Policy and Terms.';
