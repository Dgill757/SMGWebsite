/**
 * Marketing attribution capture. Stored in sessionStorage only (first party,
 * cleared when the tab closes). Every access is wrapped because storage can
 * throw in private mode.
 */
const KEY = 'svai_attribution_v1';

const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPage?: string;
  pageUrl?: string;
}

function read(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}') as Attribution;
  } catch {
    return {};
  }
}

function write(value: Attribution) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable, attribution for this visit is simply not kept */
  }
}

const cap = (v: string | null | undefined, n = 300) => (v ? v.slice(0, n) : undefined);

/** Call once on app load, and again on every route change (cheap). */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  const stored = read();
  const next: Attribution = { ...stored };
  const url = new URL(window.location.href);

  // First touch: landing page and referrer are recorded once per session.
  if (!next.landingPage) {
    next.landingPage = cap(url.pathname + url.search, 500);
    const ref = document.referrer;
    if (ref && !ref.startsWith(window.location.origin)) next.referrer = cap(ref, 500);
  }

  // Latest paid touch wins for UTM and click ids.
  for (const p of PARAMS) {
    const v = cap(url.searchParams.get(p));
    if (v) next[p] = v;
  }

  write(next);
}

/** Attribution to send with a lead, plus the page the form was on. */
export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  return { ...read(), pageUrl: cap(window.location.pathname + window.location.search, 500) };
}
