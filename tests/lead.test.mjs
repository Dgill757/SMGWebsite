// Run with: npm test   (Node 22.18+ strips TypeScript types natively)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, normalizePhone, FIELD_IDS } from '../api/lead.ts';

const ENV = { GHL_PIT: 'pit-test-token-not-real', GHL_LOCATION_ID: 'loc_test_123' };
const NOW = new Date('2026-11-21T15:00:00.000Z');

function makeReq(body, overrides = {}) {
  return {
    method: 'POST',
    headers: {
      host: 'www.summitvoiceai.com',
      origin: 'https://www.summitvoiceai.com',
      'x-forwarded-for': overrides.ip || '203.0.113.9',
      ...(overrides.headers || {}),
    },
    body,
    ...(overrides.method ? { method: overrides.method } : {}),
  };
}

function makeRes() {
  const res = {
    statusCode: 200,
    body: undefined,
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(c) {
      this.statusCode = c;
      return this;
    },
    json(b) {
      this.body = b;
    },
  };
  return res;
}

/** Mock GHL: records every call, returns a contact id for upsert, ok for the rest. */
function mockGhl({ failUpsert = false, failStatus = 500 } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    const call = { url, method: init.method, headers: init.headers, body: JSON.parse(init.body) };
    calls.push(call);
    if (url.endsWith('/contacts/upsert')) {
      if (failUpsert) return { ok: false, status: failStatus, json: async () => ({ message: 'down' }) };
      return { ok: true, status: 200, json: async () => ({ new: true, contact: { id: 'contact_abc' } }) };
    }
    return { ok: true, status: 200, json: async () => ({ ok: true }) };
  };
  return { calls, fetchImpl };
}

function setup(opts = {}) {
  const ghl = mockGhl(opts.ghl);
  const logs = [];
  const handler = createHandler({
    env: opts.env || ENV,
    fetchImpl: ghl.fetchImpl,
    now: () => NOW,
    log: (e) => logs.push(e),
    retryDelayMs: 0,
    ...(opts.rateLimit ? { rateLimit: opts.rateLimit } : {}),
  });
  return { handler, ghl, logs };
}

const VALID = {
  name: 'Jane Roofer',
  email: 'jane+test@example.com',
  phone: '(410) 555-0142',
  company: 'Jane Roofing LLC',
  vertical: 'roofing',
  form: 'free-website-preview',
  offerInterest: 'front-office',
  missedCallsPerDay: '3',
  avgJobValue: '$9,500',
  smsConsent: false,
  attribution: { utm_source: 'google', utm_campaign: 'spring', gclid: 'abc123', landingPage: '/for/roofing' },
};

test('valid lead: upsert without tags, then tags, then note, correct headers and fields', async () => {
  const { handler, ghl, logs } = setup();
  const res = makeRes();
  await handler(makeReq(VALID), res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
  assert.equal(logs.length, 0);
  assert.equal(ghl.calls.length, 3);

  const [upsert, tags, note] = ghl.calls;
  assert.equal(upsert.url, 'https://services.leadconnectorhq.com/contacts/upsert');
  assert.equal(upsert.headers.Authorization, `Bearer ${ENV.GHL_PIT}`);
  assert.equal(upsert.headers.Version, '2021-07-28');
  assert.equal('tags' in upsert.body, false, 'upsert body must not contain tags');
  assert.equal(upsert.body.locationId, ENV.GHL_LOCATION_ID);
  assert.equal(upsert.body.firstName, 'Jane');
  assert.equal(upsert.body.lastName, 'Roofer');
  assert.equal(upsert.body.phone, '+14105550142');

  const byId = Object.fromEntries(upsert.body.customFields.map((f) => [f.id, f.field_value]));
  assert.equal(byId[FIELD_IDS.vertical], 'roofing');
  assert.equal(byId[FIELD_IDS.offerInterest], 'front-office');
  assert.equal(byId[FIELD_IDS.missedCallsPerDay], 3);
  assert.equal(byId[FIELD_IDS.avgJobValue], 9500);
  assert.match(byId[FIELD_IDS.sourceDetail], /utm_source=google/);
  assert.match(byId[FIELD_IDS.sourceDetail], /landing=\/for\/roofing/);
  assert.match(byId[FIELD_IDS.sourceDetail], /gclid=abc123/);
  assert.equal(FIELD_IDS.consentDate in byId, false);

  assert.equal(tags.url, 'https://services.leadconnectorhq.com/contacts/contact_abc/tags');
  assert.deepEqual(tags.body.tags, ['src-website', 'inbound-lead']);

  assert.equal(note.url, 'https://services.leadconnectorhq.com/contacts/contact_abc/notes');
  assert.match(note.body.body, /Jane Roofer/);
  assert.match(note.body.body, /SMS consent checkbox: not checked/);
});

test('landscaping and pool map to "other" on the GHL vertical field', async () => {
  for (const vertical of ['landscaping', 'pool']) {
    const { handler, ghl } = setup();
    await handler(makeReq({ ...VALID, vertical }), makeRes());
    const byId = Object.fromEntries(ghl.calls[0].body.customFields.map((f) => [f.id, f.field_value]));
    assert.equal(byId[FIELD_IDS.vertical], 'other');
    assert.match(ghl.calls[2].body.body, new RegExp(`Vertical: ${vertical}`));
  }
});

test('consent checked: consent-form-opt-in tag is added and consent is recorded', async () => {
  const { handler, ghl } = setup();
  const res = makeRes();
  await handler(
    makeReq({ ...VALID, smsConsent: true, consentText: 'By checking this box, I agree to receive text messages...' }),
    res,
  );
  assert.equal(res.statusCode, 200);
  assert.deepEqual(ghl.calls[1].body.tags, ['src-website', 'inbound-lead', 'consent-form-opt-in']);
  const byId = Object.fromEntries(ghl.calls[0].body.customFields.map((f) => [f.id, f.field_value]));
  assert.equal(byId[FIELD_IDS.consentBasis], 'form-opt-in');
  assert.equal(byId[FIELD_IDS.consentDate], '2026-11-21');
  assert.match(ghl.calls[2].body.body, /SMS consent checkbox: CHECKED/);
  assert.match(ghl.calls[2].body.body, /Consent wording shown: By checking this box/);
});

test('missing consent: no consent tag and no consent fields', async () => {
  const { handler, ghl } = setup();
  await handler(makeReq({ ...VALID, smsConsent: false }), makeRes());
  assert.equal(ghl.calls[1].body.tags.includes('consent-form-opt-in'), false);
  const ids = ghl.calls[0].body.customFields.map((f) => f.id);
  assert.equal(ids.includes(FIELD_IDS.consentBasis), false);
  assert.equal(ids.includes(FIELD_IDS.consentDate), false);
});

test('consent checked without a phone number is rejected, never tagged', async () => {
  const { handler, ghl } = setup();
  const res = makeRes();
  await handler(makeReq({ ...VALID, phone: '', smsConsent: true }), res);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body.fields, ['phone']);
  assert.equal(ghl.calls.length, 0);
});

test('honeypot: pretends success and never calls GHL', async () => {
  const { handler, ghl } = setup();
  const res = makeRes();
  await handler(makeReq({ ...VALID, fax: 'http://spam.example' }), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
  assert.equal(ghl.calls.length, 0);
});

test('rate limit: the sixth request from one IP in the window gets 429', async () => {
  const { handler } = setup();
  const statuses = [];
  for (let i = 0; i < 6; i++) {
    const res = makeRes();
    await handler(makeReq(VALID, { ip: '198.51.100.7' }), res);
    statuses.push(res.statusCode);
  }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);

  const other = makeRes();
  await handler(makeReq(VALID, { ip: '198.51.100.8' }), other);
  assert.equal(other.statusCode, 200, 'a different IP is not limited');
});

test('GHL failure: user still gets success, structured error is logged without tokens or full PII', async () => {
  const { handler, ghl, logs } = setup({ ghl: { failUpsert: true, failStatus: 500 } });
  const res = makeRes();
  await handler(makeReq(VALID), res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
  assert.equal(ghl.calls.length, 2, 'upsert retried once, then stopped');
  assert.equal(logs.length, 1);
  assert.equal(logs[0].event, 'ghl_lead_failure');
  assert.equal(logs[0].step, 'upsert');
  assert.equal(logs[0].status, 500);
  const logged = JSON.stringify(logs);
  assert.equal(logged.includes(ENV.GHL_PIT), false);
  assert.equal(logged.includes('jane+test@example.com'), false);
  assert.equal(logged.includes('555-0142'), false);
  assert.equal(logs[0].emailDomain, 'example.com');
});

test('GHL network error is also soft', async () => {
  const logs = [];
  const handler = createHandler({
    env: ENV,
    fetchImpl: async () => {
      throw new Error('connect ETIMEDOUT');
    },
    log: (e) => logs.push(e),
    retryDelayMs: 0,
  });
  const res = makeRes();
  await handler(makeReq(VALID), res);
  assert.equal(res.statusCode, 200);
  assert.equal(logs[0].step, 'upsert');
  assert.equal(logs[0].status, 0);
});

test('missing env vars: soft success and a config error is logged', async () => {
  const { handler, ghl, logs } = setup({ env: {} });
  const res = makeRes();
  await handler(makeReq(VALID), res);
  assert.equal(res.statusCode, 200);
  assert.equal(ghl.calls.length, 0);
  assert.equal(logs[0].step, 'config');
});

test('rejects non-POST, cross-origin, missing origin and invalid input', async () => {
  const { handler, ghl } = setup();

  let res = makeRes();
  await handler(makeReq(VALID, { method: 'GET' }), res);
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, 'POST');

  res = makeRes();
  await handler(makeReq(VALID, { headers: { origin: 'https://evil.example' } }), res);
  assert.equal(res.statusCode, 403);

  res = makeRes();
  await handler(makeReq(VALID, { headers: { origin: '', referer: '' } }), res);
  assert.equal(res.statusCode, 403);

  res = makeRes();
  await handler(makeReq({ ...VALID, email: 'not-an-email' }), res);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body.fields, ['email']);

  res = makeRes();
  await handler(makeReq({ ...VALID, phone: '123' }), res);
  assert.equal(res.statusCode, 400);

  assert.equal(ghl.calls.length, 0);
});

test('normalizePhone', () => {
  assert.equal(normalizePhone('(410) 555-0142'), '+14105550142');
  assert.equal(normalizePhone('1-410-555-0142'), '+14105550142');
  assert.equal(normalizePhone('+44 20 7946 0958'), '+442079460958');
  assert.equal(normalizePhone('12345'), null);
});
