---
name: build-demo
description: Build a complete demo for any roofing company. Scrapes website, rebuilds homepage using GitHub template, creates voice AI agent, delivers via GHL. The complete 10-step Summit Voice AI demo machine.
triggers: build demo, build [url], create demo, generate demo, demo machine
---

# Build Demo

## Purpose
Build a complete, personalized demo for a roofing company prospect.
Result: Professional homepage with their branding + live Thinker voice AI widget, deployed to Vercel, delivered via GHL email + SMS.

## Steps

1. **Scrape** — Use Firecrawl API to crawl the website. Extract: HTML, markdown, metadata.

2. **Extract Brand** — Use Claude Haiku to extract:
   - company_name, tagline, primary_color, secondary_color
   - services (up to 8), city, state, phone, logo_url
   - about (2 sentences), review_count, years_in_business

3. **Fetch Template** — Clone from GitHub in this order:
   - Try: Dgill757/Roofing-Template2
   - Try: Dgill757/roofing-template-roofez
   - Try: Dgill757/Roofing-Website-Template
   - Fallback: generate premium homepage using vibe guide standards

4. **Customize** — Use Claude Sonnet to replace all placeholder content:
   - Every company name → extracted company_name
   - All phone numbers → extracted phone
   - All cities/locations → extracted city, state
   - Services list → extracted services
   - Hero headline → extracted tagline
   - Colors → extracted primary_color

5. **Generate Audit** — 450-word marketing audit:
   - Call Capture Score (1-10)
   - Speed-to-Lead Score (1-10)
   - Review Velocity Score (1-10)
   - Website Conversion Score (1-10)
   - After-Hours Coverage (yes/no)
   - Revenue At Risk: 1,095-1,825 missed calls × $9,500 × 15-50% close rate = $1.56M-$8.67M/yr
   - Top 3 Revenue Leaks
   - 90-Day Fix plan
   - End: "Your demo is ready: [DEMO_URL]"

6. **Deploy** — POST to Vercel API. Get URL: `summit-demo-[slug].vercel.app`

7. **Create Voice Agent** — Playwright automation:
   - Login to THINKRR.ai
   - Add Agent → Web and Phone
   - Agent name = company_name
   - Train from website URL
   - Select voice: Marissa (preferred) or Susan (fallback)
   - Agent Training → Web Agent URL = deployed demo URL
   - Extract data-widget-key

8. **Inject Widget** — Add Thinker script + widget div to deployed homepage. Add "Talk to Ava" label. Redeploy.

9. **Update GHL** — POST to GHL API:
   - Update contact: demo_url, demo_generated_date custom fields
   - Add tag: "demo delivered"
   - Move opportunity to "Demo Sent" stage

10. **Deliver** — Send via GHL:
    - Email: Subject "built you a custom demo" (see template below)
    - SMS: 120 chars max, include demo URL
    - Internal notification to Dan
    - POST to /ingest/scraper-run for dashboard

## Email Template
```
hey {{firstName}},

i rebuilt {{company}}'s homepage.

it now has a live AI voice receptionist built right into the site. your customers can call, ask questions, or book an estimate directly through the page 24/7 without you touching anything.

i also ran a full marketing audit. the short version: there's real recoverable revenue sitting in missed calls right now.

here's your custom demo: {{demo_url}}

takes 2 minutes to see.

—dan
```

## SMS Template
```
hey {{firstName}}... i rebuilt {{company}}'s homepage with a live voice ai already running. here it is: {{demo_url}} -- 2 min to see it. worth it? reply stop to opt out.
```

## Output
Save to: `SummitVault/DEMOS/BUILT/{{date}}-{{slug}}.md`
Contents: company name, demo URL, brand colors, audit text, widget key, delivery status

## Error Handling
- Firecrawl timeout → retry once, then use no-website-build skill
- GitHub fetch fails → use fallback premium generator
- Thinker fails → continue without widget (add placeholder comment in HTML)
- GHL delivery fails → log error, notify Dan, save demo URL to vault
