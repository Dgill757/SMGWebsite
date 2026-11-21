# GHL integration, audit and setup

Branch: `ghl-integration`. Nothing here is merged to `main`. Written 2026-11-21.

This file has two jobs: what the site looked like before this branch (audit), and how the new lead pipeline works and how to turn it on.

---

## 1. Audit of the site as found (main at `83bcdf7`)

### 1.1 Every lead entry point

| # | Where | What it did | Status now |
|---|---|---|---|
| 1 | Footer "Get in Touch" form (on every route) | `fetch` POST to a Make.com webhook (`hook.us1.make.com/...`). Success was shown even when the webhook returned an error. No consent box. | Replaced by `LeadForm` posting to `/api/lead` |
| 2 | Navbar "Get Started" (desktop and mobile) | Link to `calendly.com/aivoice/call` | Opens lead form, then GHL discovery booking link |
| 3 | Hero "Request Demo" | Calendly inline widget in a custom modal (`CalendlyModal`) | Opens lead form (demo flow), then GHL demo booking link. `CalendlyModal.tsx` deleted |
| 4 | FinalCTA "Book a Strategy Call" (home only) | Calendly link | Lead form, discovery |
| 5 | Pricing, 3 tier buttons and "Talk to Our Team" | Calendly link. The `onOpenCalendar` prop from `Index` was never used | Lead form, discovery |
| 6 | ROI calculator "Book a Demo", FAQ "Book a Free Demo" | Calendly link | Lead form, demo |
| 7 | Industry page "Get Started", industry `CtaSection` (2 buttons) | Calendly link | Lead form |
| 8 | Articles list CTA, article detail (2 CTAs) | Calendly link | Lead form, demo |
| 9 | Raw HTML inside `articles.ts` (static article body) | Calendly link, cannot use React | Plain link to GHL demo booking page |
| 10 | `CalendarDialog` (mounted on home, never opened) | iframe of a different GHL calendar (`widget/booking/RttNV383...`) | Iframe now points at the discovery booking page. Still never opened (dead code, not removed) |
| 11 | Voice demo widget (Thinkrr script in `index.html`, `Widget.tsx`, `SummitWidget.tsx`, "Talk to Ava" buttons) | Live AI demo call. Captures no contact info, so demo callers never reach GHL | Not changed (marked DO NOT MODIFY). See decisions |
| 12 | `tel:+17573295913`, `mailto:support@summitvoiceai.com` in footer | Click to call and email | Unchanged |
| 13 | `revenuerecovery.summitvoiceai.com` link in nav | Separate site | Unchanged. Not audited here |
| 14 | Mobile sticky "Talk to Ava, Free Demo" button | Scrolls to the voice widget | Unchanged |

Not present: live chat, any other form, newsletter signup.

### 1.2 Analytics and pixels

None. No GA4, GTM, Meta pixel, Google Ads tag, Clarity or Hotjar anywhere in `index.html` or `src`. The draft privacy policy assumes Meta and Google tags exist. Until they are installed there is no conversion tracking, and paid traffic to the new pages cannot be measured outside GHL. UTM, gclid and fbclid are now captured into GHL, which is the only attribution record.

### 1.3 SEO state (before)

- Every route had `<link rel="canonical">` pointing at the home page (the `SEO` component defaulted `canonical` to the site root). Googlebot renders JS so Helmet partly fixed it, but static HTML and any non-JS crawler saw the home canonical on every page.
- `index.html` shipped `SoftwareApplication` JSON-LD with `aggregateRating` 4.8 from 254 ratings and a `$199` price. Neither is sourced. This is a structured-data policy risk, not just a copy issue.
- Home page FAQ JSON-LD contained invented numbers ("ROI within the first month", "$30,000-$50,000 annually", "over 95% accuracy").
- Organization schema logo URL (`/images/logo.png`) did not exist. Two different phone numbers (240-474-0668 in schema, 757-329-5913 in the footer).
- Meta description claimed "Trusted by 42+ roofing companies. $84M+ in client revenue recovered annually."
- Placeholder meta: `apple-itunes-app app-id=myAppStoreID`, `google-play-app app-id=myPackageName`, a second viewport tag, `geo.position` for a place that is not the business, a `target` meta listing law firms and healthcare.
- `robots.txt` allow-listed pages that do not exist (`/features`, `/pricing`, `/contact`, `/demo`, `/about`, `/testimonials`) and had Yandex-only `Clean-param`.
- Policy pages had no `<title>` or description of their own. Industry pages had no canonical.
- `sitemap.xml` had 15 URLs, none of the new pages.

### 1.4 Performance

- Single entry JS chunk was 708 kB (218 kB gzip). Now 297 kB (85 kB gzip) plus cacheable vendor chunks (react 214 kB, motion 125 kB, radix 101 kB). Total bytes on first load are similar, but repeat visits and route changes are much cheaper.
- `public/` is 40 MB: four demo videos (35 MB, already `preload="none"` and lazy mounted, good), two 1.2 MB `.glb` files and a 760 KB `ava-face.png` that are only referenced by `src/_archive` (dead weight in the deploy, not shipped to visitors).
- `DemoSection.tsx` references four `.mp4` files that do not exist (`Roofing-Demo.mp4` etc., only the `-compressed` files exist). The component is not imported anywhere.
- Full-page animated backgrounds, WebGL and cursor tracking run on every route (`AmbientBackground`, `GlobalAtmosphere`, mousemove listener). Not changed, no visual changes were allowed. Worth a Lighthouse pass on a mid-range phone.

### 1.5 Accessibility

- `PolicyLayout` rendered its own `Navbar` and `Footer` while `App` also renders them, so the four policy pages had two navbars and two footers (duplicate landmarks, duplicate form fields, and the page title sat under the fixed navbar). Fixed.
- Footer text and placeholders were 25 to 45 percent white on near-black (below WCAG AA). Raised to 55 to 60 percent.
- Marquee logos used the brand name as alt text next to the same text label. Now decorative (`alt=""`).
- Footer form inputs had no labels (placeholders only). New form has real labels (visually hidden in the compact footer and dialog).
- Inputs had `outline: none` with no replacement focus style. New fields show a cyan focus ring.

### 1.6 Console errors and broken links

I could not run a browser in this session (the shared automation Chrome profile was already in use, and I did not want to disturb it). What I did instead: `npm run build` (passes), `tsc` on the app (clean), and a server-side render of every new page plus the footer and privacy page with `react-dom/server` (all render, the consent checkbox is present and unchecked). **Console errors and Lighthouse numbers still need a manual pass** on the preview deployment.

Found statically:
- `SummitWidget.tsx` logs `console.error("Logo failed")` on image errors, and `NotFound` logs a console error on every 404 (intentional, noisy).
- `npm run lint` has 20 errors on `main` already (`any` types and a conditional hook in `ArticleDetail.tsx`, empty interfaces in two shadcn files, `require()` in `tailwind.config.ts`). None are from this branch. Lint on this branch: 20 errors, same as main.
- Broken asset references: only `DemoSection.tsx` (dead code, above).
- Internal links checked by reading: all `Link` targets resolve to defined routes.

### 1.7 Questionable content I did not change (needs Dan)

These are existing, visible claims I could not source. I did not remove them and did not copy them into any new page.

- "42+ roofing companies" (`HeroSection`, `SocialProofBar`, `AnimatedStats`, `AvaComparison`, `RevenueSection`, `RoofingTestimonials`, `TestimonialsSection`) and "$84M+" (`SocialProofBar`). Dan's own notes say there are 2 active clients.
- Testimonials in `RoofingTestimonials.tsx` and `TestimonialsSection.tsx`, including "582 appointments in 12 months" and "$4 million", attributed to "Teo" and unnamed "Owner"s. Needs written permission and a source, or removal.
- Footer badges "SOC 2 Type II", "HIPAA Compliant", "GDPR Ready". No evidence in the repo. HIPAA and SOC 2 claims carry legal exposure.
- Pricing section shows three tiers ($697, $1,497 and $2,497 per month with $1,500, $3,000 and $5,000 implementation fees) that do not match the current offer ladder in the master brief (Answer $297, Front Office $497, Revenue Engine $1,497 plus setup, Prove It). Check before sending paid traffic.
- "67% of calls go unanswered" banner and "Join hundreds of home service companies" in article CTAs.
- Industry pages (`IndustryPage.tsx`) carry HIPAA, statistics and testimonial blocks for healthcare, legal and others.
- The existing Terms, Privacy, Cookie and GDPR pages are old drafts ("Summit AI, a division of Summit Marketing Group") with different contact emails (`dan@summitmktggroup.com`). The Cookie policy lists "Calendly integrations". They are not the reviewed drafts in `clients/summit-voice-ai/docs/legal`. I only added an SMS section to the privacy policy, as asked.
- Existing copy uses em dashes in several places (for example the footer tagline). The no-em-dash rule was applied to everything I wrote, not retrofitted.

---

## 2. What this branch adds

### 2.1 Lead flow

```
Visitor -> LeadForm (footer, dialog, landing pages)
        -> POST /api/lead  (Vercel Node function, same origin only)
              1. POST https://services.leadconnectorhq.com/contacts/upsert   (no tags key in the body)
              2. POST /contacts/{id}/tags     src-website, inbound-lead, + consent-form-opt-in only if the box was checked
              3. POST /contacts/{id}/notes    full submission, attribution, consent record
        -> Thank-you state with the GHL booking link (discovery or demo)
```

Behaviour of `api/lead.ts`:

- POST only (405 otherwise). Origin or Referer host must match the request host, or `ALLOWED_ORIGINS`.
- Honeypot field `fax`. If filled, returns success and does nothing.
- Per-IP rate limit: 5 requests per 10 minutes, in memory per function instance. This is best effort on serverless. Upgrade to Upstash or Vercel KV if you see abuse.
- Zod validation. 400 returns only field names. Phone must normalise to E.164. Consent checked with no phone is rejected (never tags without a number).
- One retry on 429, 5xx or network error for each GHL call, 4 second timeout.
- **Fail soft:** if GHL fails or the env vars are missing, the visitor still sees success and the server logs one JSON line, for example `{"level":"error","event":"ghl_lead_failure","step":"upsert","status":500,"form":"...","emailDomain":"example.com",...}`. Tokens, names, full emails and phones are never logged. Trade-off: a lead sent while GHL is down is lost (see decisions).
- Reads `GHL_PIT` and `GHL_LOCATION_ID` from the environment only.

### 2.2 New and changed routes

| Route | Purpose | form id sent | vertical | offerInterest |
|---|---|---|---|---|
| `/for/roofing` `/for/hvac` `/for/plumbing` `/for/landscaping` `/for/pool` | Config-driven in `src/data/verticals.ts`. Add a vertical by adding an entry | `vertical-<slug>` | slug | undecided |
| `/free-website-preview` | Page 1 copy from `07-landing-pages-copy.md` | `free-website-preview` | roofing | front-office |
| `/revenue-leak-audit` | Page 2 copy, with qualification numbers | `revenue-leak-audit` | roofing | revenue-engine |
| `/sms-terms` | From the SMS draft, Part A only | n/a | n/a | n/a |

Prove It and Front Office pages (pages 3 and 4 in the copy file) were not requested and are not built.

### 2.3 Mapping table (form field to GHL)

| Form field | GHL destination | Notes |
|---|---|---|
| name | `firstName`, `lastName` | split on first space |
| email | `email` | lowercased |
| phone | `phone` | normalised to E.164, US 10 digit assumed |
| company | `companyName` | |
| website | `website` | |
| service area | note only | no custom field exists |
| message | note only | |
| vertical | custom field `SV - Vertical` (`tPG5MSHzlLz4UDOQERpz`) | landscaping and pool are sent as `other` because the field has no such option. The real value is kept in the note |
| form id, landing page, page URL, utm_*, gclid, fbclid, referrer | custom field `SV - Source Detail` (`5U8VRvw8TYBurr7GLRas`), also in the note | one line, `key=value; ...` |
| offerInterest | `SV - Offer Interest` (`9LeJKGZp32l41QGOkcTF`) | |
| calls per day | `SV - Inbound Calls Per Day` (`4uQaTeyJbSojf5S9YfVF`) | audit page |
| missed calls per day | `SV - Missed Calls Per Day` (`nj4VtbQRjCgxWyunaQ3A`) | audit page |
| average job value | `SV - Avg Job Value` (`sVm7fwWC2iJ1LQjSMg9t`) | `$` and commas stripped |
| close rate | `SV - Close Rate Pct` (`2jBHznNAj34zOJAg8ezT`) | |
| old leads and estimates | `SV - Database Size` (`x33d4IsF9dyE2jBMCoWh`) | audit page |
| SMS box checked | tag `consent-form-opt-in`, plus `SV - Consent Basis` = `form-opt-in` (`SKOCsmwrg8zaX0cP9GDm`) and `SV - Consent Date` (`HB4BPFbsczTxe1hKzydA`) | only when checked. The note stores time, page, IP and the exact wording shown |
| always | tags `src-website`, `inbound-lead`; upsert `source` = `summitvoiceai.com` | no legacy trigger tags are added |

Consent Basis and Consent Date were not in the task list. I added them because the SMS draft (B3.8) asks for the date to be stored. Delete those two lines in `buildCustomFields` if you do not want them.

The PIT cannot create opportunities (scope limited to contacts). Your GHL rules say every contact-creating workflow also creates an opportunity, so build one GHL workflow triggered by the tag `inbound-lead`: create or update the opportunity, notify you, and (if you want) send the consent confirmation text only to contacts that also have `consent-form-opt-in`.

---

## 3. Setup

### 3.1 Create the Private Integration Token (PIT)

1. In the Summit Voice AI sub-account (not the agency): Settings, Private Integrations, Create new integration.
2. Name it `Website lead endpoint`.
3. Scopes: **contacts.write** and **contacts.readonly** only. Nothing else. (Notes and tags are covered by contacts.write.)
4. Copy the token once. Never paste it in chat, code or a commit.
5. The location id is in the sub-account URL or Settings, Business Profile. The map file `clients/summit-voice-ai/data/website-ghl-map.json` names the env var `GHL_LOCATION_ID`.

### 3.2 Set the two Vercel env vars

Dashboard: Vercel, project `smg-website`, Settings, Environment Variables. Add for Production and Preview:

- `GHL_PIT` = the token
- `GHL_LOCATION_ID` = the location id
- optional `ALLOWED_ORIGINS` = extra hosts, comma separated

Or CLI: `vercel env add GHL_PIT production` (it prompts, so the value never lands in shell history). Redeploy afterwards, env changes only apply to new deployments. See `.env.example` for names only.

### 3.3 Test with a plus-address

1. Open the preview deployment of this branch, go to `/free-website-preview`.
2. Submit with email `yourname+svtest1@yourdomain.com`, your own mobile, **leave the SMS box unchecked**.
3. In GHL find the contact. Expect: tags `src-website`, `inbound-lead` only; custom fields vertical, source detail, offer interest set; a note with the submission.
4. Submit again with `+svtest2`, box **checked**. Expect the extra tag `consent-form-opt-in`, Consent Basis and Consent Date set, and the consent wording in the note.
5. Check `?utm_source=test&utm_campaign=plus` on the landing URL shows up in Source Detail.
6. Try the footer form and the "Get Started" dialog. Try with the PIT wrong on a preview: the page should still say success and Vercel function logs should show `ghl_lead_failure`.
7. Delete the test contacts in GHL afterwards.

Local checks: `npm test` runs 12 Node tests with mocked fetch (valid lead, landscaping and pool mapping, consent tag, no consent tag, consent without phone, honeypot, rate limit, GHL 500, network error, missing env, non-POST and cross-origin, phone normalising). Needs Node 22.18 or newer (native type stripping), the project uses 22 LTS.

### 3.4 Rollback

- Safest and fastest: in Vercel, Deployments, find the last production deployment before the merge, Promote to Production (instant, no code change).
- Or revert the merge commit on `main`.
- The old Calendly links and Make webhook are in git history only, they are not kept as a fallback. If you want a fallback, keep the Make webhook alive and add a second `fetch` in `api/lead.ts` failure path.
- `vercel.json` now excludes `/api/` from the SPA rewrite. If you roll back only that file, `/api/lead` will return the HTML shell.

---

## 4. Decisions and facts needed from Dan

Blocking before merge:

1. **Legal entity name** and **effective dates**. `src/data/company.ts` has visible `[FILL IN]` placeholders that render on `/sms-terms`.
2. Confirm **757-329-5913** is answered and **support@summitvoiceai.com** is monitored, and that both match the A2P brand registration. I used them because the live footer already publishes them. The old JSON-LD had 240-474-0668, which I dropped.
3. Confirm the **Germantown, MD address** (from your legal drafts) is real and receives mail. It is used in compliance footers, `/sms-terms` and LocalBusiness JSON-LD.
4. Counsel review of `/sms-terms`, the new privacy section and the landing page footers. Nothing on these pages is presented as legal advice.
5. Create the GHL workflow on tag `inbound-lead` (opportunity, notification, confirmation text for consented contacts).

Product and copy:

6. Add `landscaping` and `pool` as options on the `SV - Vertical` field so they stop mapping to `other`, then change `GHL_VERTICAL_OPTIONS` in `api/lead.ts`.
7. Decide what to do about unsourced social proof, badges and the pricing section (section 1.7). I would remove the SOC 2 and HIPAA badges first.
8. Years in roofing: the landing pages say only "I came up in roofing" because your notes say 10 and 5 years while the brief says 15 and 6.
9. No proof blocks, turnaround promise, scarcity, or prices were added to the new pages (the copy file marks them as needing real proof or your decision).
10. Lost-lead risk: if GHL is down, the lead is only a masked log line. Options: a durable queue (Vercel KV or Upstash), a second send to a Make webhook, or an email via Resend.
11. The voice demo widget captures no contact details. Consider asking for name and number before the demo call so demo callers land in GHL.
12. Install GA4 and the Meta pixel if you want paid-traffic measurement, then update the privacy and cookie pages to match what is installed.
13. Prove It and Front Office landing pages (copy exists) can be added to `src/pages` in the same pattern.
