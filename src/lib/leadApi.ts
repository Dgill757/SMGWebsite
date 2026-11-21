import { getAttribution } from '@/lib/attribution';
import { SMS_CONSENT_TEXT } from '@/data/company';

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  serviceArea?: string;
  message?: string;
  vertical?: string;
  form: string;
  offerInterest?: string;
  inboundCallsPerDay?: string;
  missedCallsPerDay?: string;
  avgJobValue?: string;
  closeRatePct?: string;
  databaseSize?: string;
  smsConsent: boolean;
  /** Honeypot. Must stay empty. */
  fax?: string;
}

export interface LeadResult {
  ok: boolean;
  reason?: 'invalid' | 'rate_limited' | 'network' | 'server';
  fields?: string[];
}

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        consentText: payload.smsConsent ? SMS_CONSENT_TEXT : undefined,
        attribution: getAttribution(),
      }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 429) return { ok: false, reason: 'rate_limited' };
    if (res.status === 400) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, reason: 'invalid', fields: data.fields };
    }
    return { ok: false, reason: 'server' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
