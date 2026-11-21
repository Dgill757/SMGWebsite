/**
 * POST /api/lead
 *
 * Receives website lead submissions and routes them into GoHighLevel (GHL):
 *   1. upsert the contact (no tags in the upsert body, by design)
 *   2. add tags with the dedicated tags endpoint
 *   3. write a note with the full submission
 *
 * Credentials come ONLY from the environment: GHL_PIT and GHL_LOCATION_ID.
 * Fail soft: if GHL is down the visitor still gets a success response and a
 * structured error is logged on the server (no tokens, no full PII).
 *
 * This file is intentionally self-contained (no relative imports) so it runs
 * unchanged on the Vercel Node runtime and under `node --test`.
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Types (minimal on purpose, so we do not need @vercel/node)
// ---------------------------------------------------------------------------

type Env = Record<string, string | undefined>;
type HeaderValue = string | string[] | undefined;

export interface LeadRequest {
  method?: string;
  headers: Record<string, HeaderValue>;
  body?: unknown;
  socket?: { remoteAddress?: string };
}

export interface LeadResponse {
  status(code: number): LeadResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string | number): void;
}

type FetchLike = (url: string, init: {
  method: string;
  headers: Record<string, string>;
  body: string;
  signal?: AbortSignal;
}) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

export interface HandlerOptions {
  env?: Env;
  fetchImpl?: FetchLike;
  now?: () => Date;
  log?: (entry: Record<string, unknown>) => void;
  rateLimit?: { max: number; windowMs: number };
  retryDelayMs?: number;
  requestTimeoutMs?: number;
}

// ---------------------------------------------------------------------------
// GHL constants (ids come from clients/summit-voice-ai/data/website-ghl-map.json)
// ---------------------------------------------------------------------------

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

export const FIELD_IDS = {
  vertical: 'tPG5MSHzlLz4UDOQERpz', // SV - Vertical (SINGLE_OPTIONS)
  sourceDetail: '5U8VRvw8TYBurr7GLRas', // SV - Source Detail (TEXT)
  offerInterest: '9LeJKGZp32l41QGOkcTF', // SV - Offer Interest (SINGLE_OPTIONS)
  inboundCallsPerDay: '4uQaTeyJbSojf5S9YfVF', // SV - Inbound Calls Per Day
  missedCallsPerDay: 'nj4VtbQRjCgxWyunaQ3A', // SV - Missed Calls Per Day
  avgJobValue: 'sVm7fwWC2iJ1LQjSMg9t', // SV - Avg Job Value (MONETORY)
  closeRatePct: '2jBHznNAj34zOJAg8ezT', // SV - Close Rate Pct
  databaseSize: 'x33d4IsF9dyE2jBMCoWh', // SV - Database Size
  consentDate: 'HB4BPFbsczTxe1hKzydA', // SV - Consent Date (DATE)
  consentBasis: 'SKOCsmwrg8zaX0cP9GDm', // SV - Consent Basis (SINGLE_OPTIONS)
} as const;

export const ALWAYS_TAGS = ['src-website', 'inbound-lead'] as const;
export const CONSENT_TAG = 'consent-form-opt-in';

/** The SV - Vertical field only has these options. Anything else maps to "other". */
const GHL_VERTICAL_OPTIONS = ['roofing', 'hvac', 'plumbing', 'electrical', 'gutters', 'siding', 'windows', 'other'];

const SITE_VERTICALS = ['roofing', 'hvac', 'plumbing', 'landscaping', 'pool', 'electrical', 'gutters', 'siding', 'windows', 'other'] as const;
const OFFER_INTERESTS = ['undecided', 'answer', 'front-office', 'revenue-engine', 'prove-it'] as const;

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

const emptyToUndefined = (v: unknown) => (v === '' || v === null ? undefined : v);
const optStr = (max: number) => z.preprocess(emptyToUndefined, z.string().trim().max(max).optional());
const optNum = (min: number, max: number) =>
  z.preprocess((v) => {
    if (v === '' || v === null || v === undefined) return undefined;
    if (typeof v === 'string') return Number(v.replace(/[$,\s%]/g, ''));
    return v;
  }, z.number().finite().min(min).max(max).optional());

const attributionSchema = z
  .object({
    utm_source: optStr(200),
    utm_medium: optStr(200),
    utm_campaign: optStr(200),
    utm_term: optStr(200),
    utm_content: optStr(200),
    gclid: optStr(300),
    fbclid: optStr(300),
    referrer: optStr(500),
    landingPage: optStr(500),
    pageUrl: optStr(500),
  })
  .partial();

export const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: optStr(40),
  company: optStr(150),
  website: optStr(200),
  serviceArea: optStr(120),
  message: optStr(2000),
  vertical: z.preprocess(emptyToUndefined, z.enum(SITE_VERTICALS).optional()),
  form: z.preprocess(emptyToUndefined, z.string().regex(/^[a-z0-9-]{1,60}$/).default('website')),
  offerInterest: z.preprocess(emptyToUndefined, z.enum(OFFER_INTERESTS).optional()),
  inboundCallsPerDay: optNum(0, 10000),
  missedCallsPerDay: optNum(0, 10000),
  avgJobValue: optNum(0, 10_000_000),
  closeRatePct: optNum(0, 100),
  databaseSize: optNum(0, 100_000_000),
  smsConsent: z.boolean().optional().default(false),
  consentText: optStr(1200),
  attribution: attributionSchema.optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Returns an E.164 number or null. US numbers only unless a + prefix is given. */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (trimmed.startsWith('+')) return digits.length >= 10 && digits.length <= 15 ? `+${digits}` : null;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function header(req: LeadRequest, name: string): string {
  const v = req.headers[name];
  return (Array.isArray(v) ? v[0] : v) || '';
}

function clientIp(req: LeadRequest): string {
  const fwd = header(req, 'x-forwarded-for').split(',')[0].trim();
  return fwd || header(req, 'x-real-ip') || req.socket?.remoteAddress || 'unknown';
}

function hostOf(value: string): string {
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return '';
  }
}

/** Same-origin only: Origin (or Referer) host must match the request host or ALLOWED_ORIGINS. */
export function isSameOrigin(req: LeadRequest, env: Env): boolean {
  const source = header(req, 'origin') || header(req, 'referer');
  const sourceHost = hostOf(source);
  if (!sourceHost) return false;
  const requestHost = (header(req, 'x-forwarded-host') || header(req, 'host')).split(',')[0].trim().toLowerCase();
  if (requestHost && sourceHost === requestHost) return true;
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => hostOf(s.trim()) || s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(sourceHost);
}

function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string, nowMs: number): { limited: boolean; retryAfterSec: number } => {
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (!v.some((t) => nowMs - t < windowMs)) hits.delete(k);
    }
    const recent = (hits.get(key) || []).filter((t) => nowMs - t < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return { limited: true, retryAfterSec: Math.max(1, Math.ceil((windowMs - (nowMs - recent[0])) / 1000)) };
    }
    recent.push(nowMs);
    hits.set(key, recent);
    return { limited: false, retryAfterSec: 0 };
  };
}

const clean = (s: string | undefined, max = 500) =>
  (s || '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .slice(0, max);

function splitName(full: string): { firstName: string; lastName?: string } {
  const parts = full.trim().split(/\s+/);
  const firstName = parts.shift() || full.trim();
  const lastName = parts.join(' ');
  return lastName ? { firstName, lastName } : { firstName };
}

function sourceDetail(lead: LeadInput): string {
  const a = lead.attribution || {};
  const pairs: [string, string | undefined][] = [
    ['form', lead.form],
    ['landing', a.landingPage],
    ['page', a.pageUrl],
    ['utm_source', a.utm_source],
    ['utm_medium', a.utm_medium],
    ['utm_campaign', a.utm_campaign],
    ['utm_term', a.utm_term],
    ['utm_content', a.utm_content],
    ['gclid', a.gclid],
    ['fbclid', a.fbclid],
    ['referrer', a.referrer],
  ];
  return pairs
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${clean(v, 200)}`)
    .join('; ')
    .slice(0, 900);
}

export function buildCustomFields(lead: LeadInput, today: string): { id: string; field_value: string | number }[] {
  const fields: { id: string; field_value: string | number }[] = [];
  const add = (id: string, value: string | number | undefined) => {
    if (value !== undefined && value !== '') fields.push({ id, field_value: value });
  };
  if (lead.vertical) add(FIELD_IDS.vertical, GHL_VERTICAL_OPTIONS.includes(lead.vertical) ? lead.vertical : 'other');
  add(FIELD_IDS.sourceDetail, sourceDetail(lead));
  add(FIELD_IDS.offerInterest, lead.offerInterest);
  add(FIELD_IDS.inboundCallsPerDay, lead.inboundCallsPerDay);
  add(FIELD_IDS.missedCallsPerDay, lead.missedCallsPerDay);
  add(FIELD_IDS.avgJobValue, lead.avgJobValue);
  add(FIELD_IDS.closeRatePct, lead.closeRatePct);
  add(FIELD_IDS.databaseSize, lead.databaseSize);
  if (lead.smsConsent) {
    add(FIELD_IDS.consentBasis, 'form-opt-in');
    add(FIELD_IDS.consentDate, today);
  }
  return fields;
}

export function buildNote(lead: LeadInput, meta: { submittedAt: string; ip: string; phone?: string | null }): string {
  const a = lead.attribution || {};
  const line = (label: string, value: unknown) =>
    value === undefined || value === null || value === '' ? null : `${label}: ${clean(String(value), 2000)}`;
  const lines = [
    `Website lead (form: ${lead.form})`,
    line('Submitted (UTC)', meta.submittedAt),
    line('Name', lead.name),
    line('Email', lead.email),
    line('Phone', meta.phone || lead.phone),
    line('Company', lead.company),
    line('Website', lead.website),
    line('Service area', lead.serviceArea),
    line('Vertical', lead.vertical),
    line('Offer interest', lead.offerInterest),
    line('Inbound calls per day', lead.inboundCallsPerDay),
    line('Missed calls per day', lead.missedCallsPerDay),
    line('Average job value', lead.avgJobValue),
    line('Close rate pct', lead.closeRatePct),
    line('Old leads and estimates on file', lead.databaseSize),
    line('Message', lead.message),
    '',
    'Attribution',
    line('Landing page', a.landingPage),
    line('Page URL', a.pageUrl),
    line('Referrer', a.referrer),
    line('utm_source', a.utm_source),
    line('utm_medium', a.utm_medium),
    line('utm_campaign', a.utm_campaign),
    line('utm_term', a.utm_term),
    line('utm_content', a.utm_content),
    line('gclid', a.gclid),
    line('fbclid', a.fbclid),
    '',
    `SMS consent checkbox: ${lead.smsConsent ? 'CHECKED' : 'not checked'}`,
  ];
  if (lead.smsConsent) {
    lines.push(
      line('Consent recorded (UTC)', meta.submittedAt) as string,
      line('Consent page', a.pageUrl || a.landingPage) as string,
      line('Consent IP', meta.ip) as string,
      line('Consent wording shown', lead.consentText) as string,
    );
  }
  return lines.filter((l) => l !== null).join('\n');
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export function createHandler(options: HandlerOptions = {}) {
  const getEnv = () => options.env ?? (typeof process !== 'undefined' ? (process.env as Env) : {});
  const fetchImpl: FetchLike = options.fetchImpl ?? ((url, init) => fetch(url, init) as ReturnType<FetchLike>);
  const now = options.now ?? (() => new Date());
  const log =
    options.log ?? ((entry: Record<string, unknown>) => console.error(JSON.stringify(entry)));
  const rl = options.rateLimit ?? { max: 5, windowMs: 10 * 60 * 1000 };
  const retryDelayMs = options.retryDelayMs ?? 500;
  const timeoutMs = options.requestTimeoutMs ?? 4000;
  const limiter = createRateLimiter(rl.max, rl.windowMs);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function ghlCall(
    env: Env,
    path: string,
    body: unknown,
    allowRetry: boolean,
  ): Promise<{ ok: boolean; status: number; data: unknown }> {
    const attempts = allowRetry ? 2 : 1;
    let last: { ok: boolean; status: number; data: unknown } = { ok: false, status: 0, data: null };
    for (let i = 0; i < attempts; i++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetchImpl(`${GHL_BASE}${path}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.GHL_PIT}`,
            Version: GHL_VERSION,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        let data: unknown = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }
        last = { ok: res.ok, status: res.status, data };
        if (res.ok || (res.status !== 429 && res.status < 500)) return last;
      } catch {
        last = { ok: false, status: 0, data: null };
      } finally {
        clearTimeout(timer);
      }
      if (i < attempts - 1) await sleep(retryDelayMs);
    }
    return last;
  }

  return async function handler(req: LeadRequest, res: LeadResponse): Promise<void> {
    const env = getEnv();
    const requestId = globalThis.crypto?.randomUUID?.() ?? String(Date.now());
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({ ok: false, error: 'method_not_allowed' });
      return;
    }

    if (!isSameOrigin(req, env)) {
      res.status(403).json({ ok: false, error: 'forbidden' });
      return;
    }

    const limit = limiter(clientIp(req), now().getTime());
    if (limit.limited) {
      res.setHeader('Retry-After', limit.retryAfterSec);
      res.status(429).json({ ok: false, error: 'rate_limited' });
      return;
    }

    let raw: unknown = req.body;
    if (typeof raw === 'string') {
      if (raw.length > 20_000) {
        res.status(413).json({ ok: false, error: 'too_large' });
        return;
      }
      try {
        raw = JSON.parse(raw);
      } catch {
        raw = null;
      }
    }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      res.status(400).json({ ok: false, error: 'invalid_body' });
      return;
    }
    if (JSON.stringify(raw).length > 20_000) {
      res.status(413).json({ ok: false, error: 'too_large' });
      return;
    }

    // Honeypot: real visitors never see this field. Pretend success, do nothing.
    const honeypot = (raw as Record<string, unknown>).fax;
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      res.status(200).json({ ok: true });
      return;
    }

    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) {
      const fields = Array.from(new Set(parsed.error.issues.map((i) => String(i.path[0] ?? 'body'))));
      res.status(400).json({ ok: false, error: 'invalid', fields });
      return;
    }
    const lead = parsed.data;

    let phone: string | null = null;
    if (lead.phone) {
      phone = normalizePhone(lead.phone);
      if (!phone) {
        res.status(400).json({ ok: false, error: 'invalid', fields: ['phone'] });
        return;
      }
    }
    if (lead.smsConsent && !phone) {
      res.status(400).json({ ok: false, error: 'invalid', fields: ['phone'] });
      return;
    }

    const failure = (step: string, status: number, extra: Record<string, unknown> = {}) =>
      log({
        level: 'error',
        event: 'ghl_lead_failure',
        requestId,
        step,
        status,
        form: lead.form,
        vertical: lead.vertical,
        emailDomain: lead.email.split('@')[1],
        smsConsent: lead.smsConsent,
        ...extra,
      });

    try {
      if (!env.GHL_PIT || !env.GHL_LOCATION_ID) {
        failure('config', 0, { reason: 'GHL_PIT or GHL_LOCATION_ID is not set' });
        res.status(200).json({ ok: true });
        return;
      }

      const submittedAt = now().toISOString();
      const upsert = await ghlCall(
        env,
        '/contacts/upsert',
        {
          locationId: env.GHL_LOCATION_ID,
          ...splitName(lead.name),
          email: lead.email,
          ...(phone ? { phone } : {}),
          ...(lead.company ? { companyName: lead.company } : {}),
          ...(lead.website ? { website: lead.website } : {}),
          source: 'summitvoiceai.com',
          customFields: buildCustomFields(lead, submittedAt.slice(0, 10)),
          // No "tags" key on purpose: tags in an upsert body can overwrite the contact's tag set.
        },
        true,
      );

      const contactId = (upsert.data as { contact?: { id?: string } } | null)?.contact?.id;
      if (!upsert.ok || !contactId) {
        failure('upsert', upsert.status);
        res.status(200).json({ ok: true });
        return;
      }

      const tags: string[] = [...ALWAYS_TAGS];
      if (lead.smsConsent) tags.push(CONSENT_TAG);
      const tagRes = await ghlCall(env, `/contacts/${encodeURIComponent(contactId)}/tags`, { tags }, true);
      if (!tagRes.ok) failure('tags', tagRes.status);

      const noteRes = await ghlCall(
        env,
        `/contacts/${encodeURIComponent(contactId)}/notes`,
        { body: buildNote(lead, { submittedAt, ip: clientIp(req), phone }) },
        true,
      );
      if (!noteRes.ok) failure('note', noteRes.status);
    } catch {
      failure('unexpected', 0);
    }

    res.status(200).json({ ok: true });
  };
}

const handler = createHandler();
export default handler;
