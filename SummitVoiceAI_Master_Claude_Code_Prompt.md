# SummitVoiceAI — Master Claude Code Prompt
### Complete Site Overhaul: summitvoiceai.com + revenuerecovery.summitvoiceai.com

> **How to use this file:** Open Claude Code in VS Code, paste the entire contents
> of the prompt section below (starting at WORKING DIRECTORY) into the Claude Code
> chat. Run it in one pass. Do not skip phases.

---

## Pre-Flight Checklist (Do These Before Pasting the Prompt)

- [ ] Open VS Code with this folder as the root:
  `C:\Users\DanGi\Downloads\SummitVoiceAI\MyCompanies\SummitVoiceAi\SMG_WEBSITE_MAIN\SMGWebsite-main\SMGWebsite-main`
- [ ] Confirm `./summitvoiceai-landing/` subfolder is present
- [ ] Confirm `/public/logos/` exists with 14 logo PNG files
- [ ] Have your real Calendly booking URL ready to paste after the prompt runs
- [ ] Have your GHL booking page URL ready for the FinalCTA "Book a Strategy Call" button

---

## Manual Actions Required AFTER the Prompt Runs

1. Replace `VITE_CALENDAR_URL` in `summitvoiceai-landing/.env` with your real Calendly link
2. Update the `"Book a Strategy Call →"` href in `src/components/FinalCTA.tsx` to your real booking URL
3. If Manus images failed to download, manually save them from `https://summitvoic-tna9mud4.manus.space/` → right-click → Save Image → `summitvoiceai-landing/client/public/images/`
4. Deploy landing page to Vercel as a **NEW project** (separate from main site):
   - Root directory: `summitvoiceai-landing`
   - Build command: `cd client && npm install && npm run build`
   - Output directory: `client/dist`
   - Env var: `VITE_CALENDAR_URL` = your booking URL
5. Add domain in Vercel: `revenuerecovery.summitvoiceai.com`
6. Add CNAME in GoDaddy: `revenuerecovery` → `cname.vercel-dns.com`
7. Once both sites are live, verify pricing matches on both
8. Update the Revenue Recovery nav link href in `Navbar.tsx` once the subdomain is live

---

## The Complete Prompt

```
WORKING DIRECTORY:
C:\Users\DanGi\Downloads\SummitVoiceAI\MyCompanies\SummitVoiceAi\SMG_WEBSITE_MAIN\SMGWebsite-main\SMGWebsite-main

Open this entire folder in VS Code before running.
You are working on TWO codebases inside this directory simultaneously.

CODEBASE A — MAIN WEBSITE (root .)
  Deployed: summitvoiceai.com
  GitHub: https://github.com/Dgill757/SMGWebsite
  Push branch: main (force push allowed)
  Stack: Vite + React + TypeScript + Tailwind

CODEBASE B — REVENUE RECOVERY LANDING PAGE (./summitvoiceai-landing/)
  Deployed: revenuerecovery.summitvoiceai.com
  GitHub: https://github.com/Dgill757/summitvoiceai-landing (public)
  Stack: Vite + React + TypeScript + Tailwind

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAFETY RULES — READ BEFORE TOUCHING ANYTHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NEVER delete any existing component file without explicit instruction.
2. NEVER restructure the whole page layout or reorder sections unless instructed.
3. NEVER change any working visual system (particle Ava, ambient background,
   gradient system, marquee animations) unless the section says to.
4. ALL changes must be surgical: targeted edits to specific files.
5. After every phase, run npm run build. STOP if build fails.
6. When in doubt about a component's structure, READ IT FIRST.
7. Do not add new npm dependencies beyond what Phase 0 specifies.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS CONTEXT — SOURCE OF TRUTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPANY: SummitVoiceAI / Summit Marketing Group
FOUNDER: Dan Gill
PRODUCT: "Ava" — AI voice + automation system
MISSION: $100K MRR solo operation. Full automation required.

PRIMARY ICP: Roofing contractors / business owners, US-based,
$1M–$10M+ annually. Secondary: home services, healthcare, real estate.
Lead ALWAYS with roofing. Never dilute to generic.

FLAGSHIP OFFER: The Summit Revenue Recovery System™
  Implementation: $3,000 one-time
  Monthly: $1,497/month
  Annual prepay: $16,500 + implementation

OFFICIAL THREE-TIER PRICING (update EVERYWHERE on both sites):

  TIER 1 — SummitVoice AI Capture™
    $697/month + $1,500 implementation
    USE AS: Downsell only. Not the advertised offer.
    Features: 24/7 AI receptionist, basic qualification, calendar
    booking, call summaries, basic CRM integration, missed-call
    recovery, monthly reporting.

  TIER 2 — Summit Revenue Recovery System™  ← PRIMARY / MOST POPULAR
    $1,497/month + $3,000 implementation
    USE AS: The main offer. Center card. Featured.
    Features: Everything in Capture PLUS advanced missed-call recovery,
    speed-to-lead follow-up, SMS/email nurturing, Estimate Rescue System™,
    Review Growth Engine, website conversational AI, CRM/calendar
    workflows, initial database reactivation campaign, Revenue Recovery
    Scorecard, monthly optimization, quarterly reactivation campaigns,
    Revenue Recovery Script Vault.

  TIER 3 — Summit AI Growth Engine™
    $2,497/month + $5,000 implementation
    USE AS: Enterprise upsell. Right card.
    Features: Everything in Recovery PLUS outbound AI calling, multiple
    campaigns, larger database programs, multi-location support, advanced
    custom integrations, additional AI agents, higher usage, priority
    support, monthly strategy session, advanced reporting.

CORE MESSAGE (use verbatim across both sites):
  "Before you spend another dollar generating opportunities,
   let's make sure you're monetizing the ones you've already paid for."

THE REVENUE RECOVERY LOOP™ — Core mechanism. Brand it everywhere:
  CAPTURE → RESPOND → FOLLOW UP → REACTIVATE → BOOK → REVIEW → OPTIMIZE

PRIMARY CTA (one CTA, used everywhere):
  Main site: "🎙️ Talk to Ava Now — It's Free"
  Landing page: "Book My Free Revenue Leak Audit"

DOCUMENTED PROOF (use ONLY these facts, never invent):
  - Teo Roofing: 582 appointments in 12 months via Ava
    At 55% close rate, avg $13,100/job = $4,190,400+ recovered
  - One roofing database campaign: ~4,000 existing leads
    → ~294 appointments → ~$200,000 attributable reported revenue
    Broader engagement: ~600 appointments total
  - 42+ active businesses on platform
  - $84M+ in client revenue recovered annually across active clients
  - 100% call answer rate, <1 second answer time
  - Named clients (can be used): Teo Roofing, Stonewall Roofing,
    Black Label Roofing, Impact Roofing, Proof Roofing

IMPLEMENTATION GUARANTEE (official language, use verbatim):
  "If the client completes onboarding, provides required access, and
   meets agreed prerequisites, and Summit has not deployed the agreed
   Revenue Recovery infrastructure within 30 days, Summit continues
   implementation at no management fee until the agreed system is live.
   If after the first 60 days Summit cannot point to measurable recovered
   conversations, appointments, opportunities or documented improvements
   in response/follow-up performance, Summit will personally review the
   account and build an additional recovery campaign at Summit's cost."
  Disclaimer: "Terms and prerequisites apply. This is a deployment
  guarantee, not a guarantee of leads, appointments, sales or revenue."

SCARCITY (real, use it):
  "We accept no more than 5 new roofing companies per month due to
   custom call flows, scripts, CRM configuration and database work."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 0 — INSTALL ALL SKILLS AND DEPENDENCIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run ALL of these before touching any code.
These install skills and tools that improve output quality
throughout the rest of this prompt.

From the main project root:

  # Core npm packages for animations and number display
  npm install framer-motion
  npm install @number-flow/react

  # emilkowalski/skill — animation + interaction design intelligence
  # Makes hover states, transitions, and micro-interactions professional
  npx -y skills add emilkowalski/skill --agent claude-code --global

  # 21st.dev Magic — 1,300+ premium React components on demand
  npx -y @21st-dev/magic@latest

  # Playwright — browser automation for visual QA after build
  npx playwright install chromium

  # Context7 — always-current library docs (stops stale API usage)
  npx -y @upstash/context7-mcp@latest 2>/dev/null || true

  # UI/UX Pro Max — design intelligence (57 UI styles, 95 palettes)
  npm install -g uipro-cli 2>/dev/null || true
  uipro init --ai claude --global 2>/dev/null || true

  # Firecrawl — website ripper for asset extraction
  npm install -g firecrawl-cli 2>/dev/null || true

  # Perfect Web Clone skill — DOM-level site cloner
  mkdir -p "$env:USERPROFILE\.claude\skills" 2>/dev/null || mkdir -p ~/.claude/skills 2>/dev/null || true
  git clone https://github.com/ericshang98/perfect-web-clone-skill.git ~/.claude/skills/perfect-web-clone 2>/dev/null || true

  # Impeccable design skill
  npx impeccable install 2>/dev/null || true

  # sanyuan-skills — expert code review before shipping
  npx skills add sanyuan-skills 2>/dev/null || true

  # agent-browser — Vercel browser skill for auto-QA
  npx skills add agent-browser 2>/dev/null || true

  # supermemory — fast memory engine, reduces token re-reads
  npx skills add supermemory 2>/dev/null || true

Note: Skills marked with 2>/dev/null || true will not stop execution
if they fail. Log any failures but continue to the next install.
The critical installs are framer-motion, @number-flow/react,
emilkowalski/skill, and @21st-dev/magic.

Then inside the landing page directory:

  cd summitvoiceai-landing
  npm install
  npm install framer-motion
  cd ..

Confirm critical installs completed before proceeding.
Do NOT install GSAP, Three.js, or any additional animation libraries.
Keep the dependency footprint minimal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — READ EVERYTHING BEFORE WRITING ANYTHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read these files completely before making any change:

MAIN SITE:
  src/pages/Index.tsx
  src/components/HeroSection.tsx
  src/components/Navbar.tsx
  src/components/PricingSection.tsx
  src/components/FAQSection.tsx
  src/components/AnimatedStats.tsx
  src/components/AvaComparison.tsx
  src/components/TrackRecord.tsx
  src/components/RoofingTestimonials.tsx
  src/components/IntegrationMarquee.tsx
  src/components/FinalCTA.tsx
  src/components/RevenueSection.tsx
  src/components/DemoCallsSection.tsx
  src/index.css
  index.html

LANDING PAGE:
  summitvoiceai-landing/client/src/pages/Home.tsx
  summitvoiceai-landing/client/src/index.css
  summitvoiceai-landing/client/src/App.tsx
  summitvoiceai-landing/client/index.html
  summitvoiceai-landing/package.json

After reading, output a BRIEF INTERNAL AUDIT noting for each codebase:
  - Components that are working and must NOT be changed
  - Files that need targeted copy updates
  - Pricing that is wrong
  - Missing components that need to be created
  - Any build errors present before you started

Then proceed immediately. Do not ask for approval on the audit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — MAIN WEBSITE: TARGETED UPDATES ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rule for this entire phase: make the minimum change needed.
If something is already correct — leave it alone.
If a section is working visually — do NOT restructure it.
Only update copy, pricing, and missing pieces.

════════════════════════════════════════════
2A — index.html (root) — SEO FIX
════════════════════════════════════════════

Open index.html at the project root.

The current meta tags are generic and point to the wrong canonical
domain (summitaivoice.com). Update the following tags while keeping
all existing <script>, <link rel="stylesheet">, font preloads, and
any Vite-generated tags exactly as they are. Only replace the
meta content values listed:

  <title>Summit Voice AI — AI Voice Receptionist for Roofing Companies</title>

  <meta name="description" content="Ava answers every call 24/7,
  books roofing appointments automatically, and syncs your CRM.
  Trusted by 42+ roofing companies. $84M+ in client revenue recovered
  annually. Try Ava free — no credit card required." />

  <meta name="keywords" content="ai receptionist for roofing companies,
  voice ai roofing, missed call recovery roofing, ai call answering roofing,
  roofing lead follow up automation, summit voice ai, ava ai receptionist,
  roofing crm automation, 24/7 roofing receptionist" />

  <meta property="og:title"
    content="Summit Voice AI — Never Miss Another Roofing Lead" />

  <meta property="og:description"
    content="Ava answers every call, books appointments, and syncs your
    CRM 24/7. Trusted by 42+ roofing companies. $84M+ recovered annually." />

  <meta property="og:url" content="https://www.summitvoiceai.com" />
  <meta property="og:site_name" content="Summit Voice AI" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title"
    content="Summit Voice AI — AI Voice Receptionist for Roofing Companies" />
  <meta name="twitter:description"
    content="Every missed call is a job going to your competitor.
    Ava answers 24/7. Trusted by 42+ roofing companies." />

  <link rel="canonical" href="https://www.summitvoiceai.com" />

  <meta name="robots"
    content="index, follow, max-snippet:-1,
    max-image-preview:large, max-video-preview:-1" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="author" content="Dan Gill — Summit Marketing Group" />

════════════════════════════════════════════
2B — ALERT BAR (Index.tsx)
════════════════════════════════════════════

Find the alert bar div in Index.tsx (search for text containing
"ROOFING COMPANY MISSES" or similar).

Replace its entire element with exactly this:

  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: '40px',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(18,0,0,0.97)',
    borderBottom: '1px solid rgba(239,68,68,0.22)',
    padding: '0 12px',
    backdropFilter: 'blur(8px)',
  }}>
    <span style={{
      fontSize: 'clamp(0.58rem, 2.4vw, 0.72rem)',
      letterSpacing: 'clamp(0.03em, 0.5vw, 0.09em)',
      fontWeight: 700,
      color: 'rgba(252,165,165,0.95)',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      lineHeight: 1,
    }}>
      THE AVERAGE ROOFING COMPANY MISSES 67% OF THEIR CALLS
    </span>
  </div>

Then in Navbar.tsx: find the outermost nav/header element.
If it has top: 0 or top-0, change it to top: '40px' or top-[40px].
This pushes the navbar below the alert bar.

In src/index.css, add or update:
  :root { --page-top: 112px; }
  @media (max-width: 768px) { :root { --page-top: 80px; } }

════════════════════════════════════════════
2C — HERO SECTION (HeroSection.tsx)
════════════════════════════════════════════

READ HeroSection.tsx completely first.
Make ONLY these targeted changes:

HEADLINE GRADIENT:
  Find the H1 element containing "Every Missed Call Is a Job
  Going to Your Competitor".
  If it does NOT already have a white-to-cyan gradient, add:
    style={{
      background: 'linear-gradient(135deg,
        #ffffff 0%, #ffffff 45%, #00D9FF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}
  If it already has this gradient, leave it alone.

EYEBROW BADGE:
  Find the trust badge pill (contains "42+" or similar).
  Ensure it reads: "Trusted by 42+ Roofing Companies Across the US"
  If it says "11+" change to "42+".

SUBHEADLINE:
  Find the subtitle/subheadline paragraph below the H1.
  Replace its text with:
    "Ava answers every call 24/7, books appointments automatically,
     follows up with unsold estimates, reactivates old leads —
     and syncs everything to your CRM. At a fraction of the cost
     of a receptionist."

SOCIAL PROOF LINE:
  Find if there is a social proof line between the subheadline
  and the CTA buttons. If NOT present, add one:
    <p style={{
      fontSize: '0.82rem',
      fontStyle: 'italic',
      color: 'rgba(0,217,255,0.75)',
      margin: '0 0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
    }}>
      🏆 Teo Roofing booked 582 appointments in 12 months.
      That's $4.1M+ recovered from one AI receptionist.
    </p>

TRUST PILLS:
  Below the CTA buttons, find or add three trust pills:
    "✓ No credit card required"
    "✓ Live in 48–72 hours"
    "✓ Cancel anytime"
  Style: small text, muted gray, inline flex, cyan checkmarks.

MOBILE GAP FIX:
  Read the file carefully. Find the ROOT CAUSE of the blank gap
  above the hero content on mobile. Common causes:
    a) minHeight: '100vh' — change to minHeight: 'auto' for mobile
    b) Internal container paddingTop > 40px
    c) Ava particle canvas with fixed large height

  ONLY target what you find. Do not guess. Apply:
  In src/index.css:
    @media (max-width: 768px) {
      .hero-section-wrapper { padding-top: 0 !important;
                               min-height: auto !important; }
      canvas { max-height: 280px !important; }
    }
  Add className="hero-section-wrapper" to HeroSection's
  outermost div if it doesn't already have it.

AVA PARTICLE FIGURE: Do NOT touch it. Do not remove it.
Do not replace it. Leave the existing particle system intact.

════════════════════════════════════════════
2D — PRICING SECTION (PricingSection.tsx)
════════════════════════════════════════════

Read PricingSection.tsx. Update ONLY the pricing values and
feature lists. Do NOT change the visual card layout.

TIER 1 card:
  Name: "SummitVoice AI Capture™"
  Price: $697/month
  Setup: $1,500 implementation
  Features:
    - 24/7 AI receptionist
    - Basic lead qualification
    - Calendar booking
    - Call summaries
    - Basic CRM integration
    - Missed-call recovery
    - Monthly reporting
  CTA: "Book a Revenue Audit" (routes to booking, not purchase)

TIER 2 card (FEATURED / center / largest):
  Name: "Summit Revenue Recovery System™"
  Badge: "Most Popular"
  Price: $1,497/month
  Setup: $3,000 implementation
  Note below price: "First year: $20,964 total investment"
  Features:
    - Everything in AI Capture
    - Advanced missed-call recovery
    - Speed-to-lead engine
    - SMS + email nurturing
    - Estimate Rescue System™
    - Review Growth Engine
    - Website conversational AI
    - CRM/calendar workflows
    - Initial database reactivation
    - Revenue Recovery Scorecard
    - Monthly optimization sessions
    - Quarterly reactivation campaigns
    - Revenue Recovery Script Vault
  CTA: "Book My Revenue Leak Audit"

TIER 3 card:
  Name: "Summit AI Growth Engine™"
  Price: $2,497/month
  Setup: $5,000 implementation
  Features:
    - Everything in Revenue Recovery
    - Outbound AI calling
    - Multiple active campaigns
    - Large database programs
    - Multi-location support
    - Advanced custom integrations
    - Additional AI agents
    - Higher usage allowances
    - Priority support
    - Monthly strategy session
    - Advanced reporting + optimization
  CTA: "Book a Strategy Call"

Visual rules (enforce these):
  - Tier 2: border color rgba(0,217,255,0.5),
    box-shadow 0 0 40px rgba(0,217,255,0.1),
    scale: slightly larger if card supports it
  - Tiers 1 & 3: standard border, no glow, normal scale
  - All CTAs scroll to booking or audit — NOT direct purchase
  - Add annual option note: "Save with annual prepay — $16,500/year"

════════════════════════════════════════════
2E — FAQ SECTION (FAQSection.tsx)
════════════════════════════════════════════

Read FAQSection.tsx. Find the FAQ data array.
Replace ALL questions and answers with these 6.
Do NOT change the accordion/expand JSX structure — only the data:

  Q: "Will Ava sound robotic to my roofing customers?"
  A: "No. Ava uses the same voice AI trusted by Fortune 500 companies.
     Most callers never realize they're talking to AI — they experience
     a fast, professional, helpful conversation. You can hear Ava live
     on this page right now."

  Q: "What happens when a customer calls after hours or during a storm?"
  A: "Ava answers in under 1 second, 24/7/365 — including Sunday nights,
     holidays, and peak storm season when your phones won't stop ringing.
     Every call answered. Every lead captured. Every appointment booked
     automatically."

  Q: "How does Ava sync with ServiceTitan or my existing CRM?"
  A: "Ava integrates with ServiceTitan, Jobber, HubSpot, GoHighLevel, and
     5,000+ other tools via Zapier and Make. Every call note, lead, and
     booked appointment syncs automatically. Zero manual data entry."

  Q: "How long does setup take for my roofing company?"
  A: "Most clients are live within 48–72 hours. We handle everything —
     voice training, CRM integration, call routing, and scheduling rules.
     You don't touch a line of code."

  Q: "What's the ROI compared to hiring a receptionist?"
  A: "A full-time receptionist costs $45,000–$65,000/year and still
     misses after-hours calls. Ava costs as little as $16/day, answers
     100% of calls, and pays for itself the moment it books the first job
     your receptionist would have missed. Teo Roofing recovered $4.1M+
     in year one."

  Q: "I'm not a roofing company — can Ava still work for my business?"
  A: "Absolutely. We serve home service businesses, healthcare clinics,
     real estate teams, pool companies, landscapers, and more. If you
     have inbound calls and leads you're losing, Ava solves that —
     regardless of your industry."

════════════════════════════════════════════
2F — ANIMATED STATS (AnimatedStats.tsx)
════════════════════════════════════════════

Read the file. Update ONLY the text values:

  Stat 1: value=$84M+
    label="Client Revenue Recovered"
    subLabel="In annual revenue across active clients"

  Stat 2: value=582
    label="Appointments Booked"
    subLabel="One client. One year. Teo Roofing."

  Stat 3: value=100%
    label="Call Answer Rate"
    subLabel="24/7/365 — Ava never misses"

  Stat 4: value=42+
    label="Active Companies"
    subLabel="Roofing, home services & more"

Update Teo Roofing callout text to:
  "🏆 Teo Roofing — 582 appointments booked in 12 months via Ava.
   At a 55% close rate averaging $13,100/job, that's $4,190,400+
   in recovered revenue. From one AI receptionist. Now replicated
   across 42+ companies."

Section heading: "What Happens When Roofing Companies Add Ava"

════════════════════════════════════════════
2G — TRACK RECORD (TrackRecord.tsx)
════════════════════════════════════════════

If TrackRecord.tsx exists, update values only:
  $240M+ — "Total revenue recovered, 4 years"
  21,000+ — "Total appointments booked by AI"
  42+ — "Active companies"
  4 Years — "Documented results since 2022"

If TrackRecord.tsx does NOT exist, create it:

---START FILE: src/components/TrackRecord.tsx---
import React, { useState, useEffect, useRef } from 'react';

function CountUp({ end, prefix='', suffix='', delay=0 }: {
  end: number; prefix?: string; suffix?: string; delay?: number;
}) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started)
        setTimeout(()=>setStarted(true), delay); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started, delay]);
  useEffect(() => {
    if (!started) return;
    let start: number|null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts-start)/2400,1);
      const eased = 1-Math.pow(1-p,3);
      setVal(Math.floor(eased*end));
      if (p<1) requestAnimationFrame(tick); else setVal(end);
    };
    requestAnimationFrame(tick);
  }, [started, end]);
  return <div ref={ref}>{prefix}{val.toLocaleString()}{suffix}</div>;
}

const items = [
  {end:240,prefix:'$',suffix:'M+',
   label:'Total Revenue Recovered',sub:'Across all clients, 4 years'},
  {end:21000,suffix:'+',
   label:'Appointments Booked by AI',sub:'Zero human effort required'},
  {end:42,suffix:'+',
   label:'Active Companies',sub:'Roofing, home services & more'},
  {end:4,suffix:' Years',
   label:'Proven Track Record',sub:'Documented results since 2022'},
];

export function TrackRecord() {
  return (
    <section style={{
      padding:'80px 24px',
      borderTop:'1px solid rgba(0,217,255,0.07)',
      background:'linear-gradient(180deg,rgba(0,217,255,0.025) 0%,transparent 100%)',
    }}>
      <div style={{maxWidth:'1000px',margin:'0 auto',textAlign:'center'}}>
        <p style={{fontSize:'0.7rem',letterSpacing:'0.14em',fontWeight:700,
          color:'rgba(0,217,255,0.65)',marginBottom:'12px',
          textTransform:'uppercase'}}>
          4 Years of Documented Results
        </p>
        <h2 style={{fontSize:'clamp(1.8rem,4vw,2.7rem)',fontWeight:900,
          color:'#fff',lineHeight:1.15,margin:'0 0 14px'}}>
          The Cumulative Track Record
        </h2>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:'0.9rem',
          maxWidth:'500px',margin:'0 auto 52px',lineHeight:1.7}}>
          Every client. Every call. Every year since 2022.
          Not projections — documented results.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
          gap:'2px',background:'rgba(0,217,255,0.07)',
          borderRadius:'20px',overflow:'hidden',
          border:'1px solid rgba(0,217,255,0.12)'}}
          className="tr-grid">
          {items.map((item,i)=>(
            <div key={i} style={{padding:'40px 20px',
              background:'rgba(0,8,16,0.85)',textAlign:'center'}}>
              <div style={{fontSize:'clamp(1.6rem,3.5vw,2.6rem)',
                fontWeight:900,color:'#00D9FF',letterSpacing:'-0.02em',
                lineHeight:1,marginBottom:'10px',
                textShadow:'0 0 24px rgba(0,217,255,0.35)'}}>
                <CountUp end={item.end} prefix={item.prefix||''}
                  suffix={item.suffix||''} delay={i*200} />
              </div>
              <div style={{fontSize:'0.85rem',fontWeight:700,
                color:'rgba(255,255,255,0.85)',marginBottom:'4px'}}>
                {item.label}
              </div>
              <div style={{fontSize:'0.7rem',
                color:'rgba(255,255,255,0.35)',fontWeight:500}}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
        <p style={{marginTop:'20px',fontSize:'0.7rem',
          color:'rgba(255,255,255,0.2)',letterSpacing:'0.03em'}}>
          Revenue figures based on client-reported close rates and average
          job values across live deployments since 2022.
        </p>
      </div>
      <style>{`
        @media(max-width:640px){.tr-grid{
          grid-template-columns:1fr 1fr!important;}}
      `}</style>
    </section>
  );
}
---END FILE---

Then in Index.tsx:
  Add import: import { TrackRecord } from '@/components/TrackRecord';
  Place <TrackRecord /> immediately after <AnimatedStats />

════════════════════════════════════════════
2H — REVENUE SECTION (RevenueSection.tsx)
════════════════════════════════════════════

This section tells a different story from AnimatedStats —
per-company daily averages, not totals.

Read RevenueSection.tsx. Update ONLY the stat values:

  Stat 1: "7" — "Calls Answered Per Day"
    sub: "Per active client — every call, every time"

  Stat 2: "3" — "Appointments Booked Daily"
    sub: "~45% of answered calls convert to bookings"

  Stat 3: "$11,500" — "Avg. Job Value Captured"
    sub: "Based on roofing industry averages"

  Stat 4: "As little as $16/day" — "Total Cost of Ava"
    sub: "vs. $180+/day for a receptionist"

Section heading: "What Ava Does For Each Client, Every Day"
Section sub: "Per-client daily averages across 42+ active deployments.
Not totals — what each individual company experiences."

════════════════════════════════════════════
2I — DUPLICATE STATS CLEANUP
════════════════════════════════════════════

The following sections ALL tell different parts of the data story.
Ensure NO two sections show the same 4 numbers:

  AnimatedStats  → annual totals ($84M+, 582, 100%, 42+)
  TrackRecord    → 4-year cumulative ($240M+, 21K+, 42+, 4 yrs)
  RevenueSection → per-company daily (7, 3, $11.5K, $16/day)

If SocialProofBar exists in Index.tsx and shows the same 4 numbers
as AnimatedStats, remove ONLY its JSX from Index.tsx and its import.
Do NOT delete SocialProofBar.tsx.

════════════════════════════════════════════
2J — INTEGRATION MARQUEE (IntegrationMarquee.tsx)
════════════════════════════════════════════

Replace the entire file content with:

---START FILE: src/components/IntegrationMarquee.tsx---
import React from 'react';

const integrations = [
  {name:'ServiceTitan', logo:'/logos/service-titan-logo-cropped.png'},
  {name:'Jobber',       logo:'/logos/jobber-logo-cropped.png'},
  {name:'HubSpot',      logo:'/logos/hubspot-logo-cropped.png'},
  {name:'GoHighLevel',  logo:'/logos/GHL-logo-cropped.png'},
  {name:'Zapier',       logo:'/logos/zapier-logo-cropped.png'},
  {name:'Make',         logo:'/logos/make.come-logo-cropped.png'},
  {name:'Google Calendar',logo:'/logos/google-calendar-logo-cropped.png'},
  {name:'Twilio',       logo:'/logos/twilio-logo-cropped.png'},
  {name:'Salesforce',   logo:'/logos/salesforce-logo-cropped.png'},
  {name:'Outlook',      logo:'/logos/outlook-logo-cropped.png'},
  {name:'Slack',        logo:'/logos/slack-logo-cropped.png'},
  {name:'AccuLynx',     logo:'/logos/Acculynx-logo-cropped.png'},
  {name:'Roof Link',    logo:'/logos/roof-link-logo-cropped.png'},
  {name:'Housecall Pro',logo:'/logos/housecall-logo-cropped.png'},
];
const items=[...integrations,...integrations,...integrations];

export function IntegrationMarquee() {
  return (
    <div style={{padding:'32px 0 28px',overflow:'hidden',
      borderTop:'1px solid rgba(255,255,255,0.04)',
      borderBottom:'1px solid rgba(255,255,255,0.04)',
      position:'relative'}}>
      <div style={{position:'absolute',top:0,left:0,width:'120px',
        height:'100%',background:'linear-gradient(to right,rgba(0,8,16,1),transparent)',
        zIndex:2,pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,right:0,width:'120px',
        height:'100%',background:'linear-gradient(to left,rgba(0,8,16,1),transparent)',
        zIndex:2,pointerEvents:'none'}}/>
      <p style={{textAlign:'center',fontSize:'0.67rem',letterSpacing:'0.14em',
        color:'rgba(0,217,255,0.55)',fontWeight:700,marginBottom:'20px',
        textTransform:'uppercase'}}>
        Integrates With Tools You Already Use
      </p>
      <div style={{display:'flex',width:'max-content',
        animation:'im-scroll 38s linear infinite'}}
        onMouseEnter={e=>(e.currentTarget as HTMLDivElement)
          .style.animationPlayState='paused'}
        onMouseLeave={e=>(e.currentTarget as HTMLDivElement)
          .style.animationPlayState='running'}>
        {items.map((item,i)=>(
          <div key={i} style={{display:'inline-flex',alignItems:'center',
            gap:'8px',padding:'8px 18px',margin:'0 6px',
            border:'1px solid rgba(255,255,255,0.08)',borderRadius:'999px',
            background:'rgba(255,255,255,0.03)',whiteSpace:'nowrap',
            flexShrink:0}}>
            <img src={item.logo} alt={item.name}
              style={{width:'20px',height:'20px',objectFit:'contain',
                borderRadius:'3px',display:'block'}}
              onError={e=>{
                (e.currentTarget as HTMLImageElement).style.display='none';
              }}/>
            <span style={{fontSize:'0.78rem',fontWeight:600,
              color:'rgba(255,255,255,0.72)'}}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
      <style>{`@keyframes im-scroll{
        0%{transform:translateX(0)}
        100%{transform:translateX(-33.333%)}
      }`}</style>
    </div>
  );
}
---END FILE---

════════════════════════════════════════════
2K — AvaComparison.tsx
════════════════════════════════════════════

If AvaComparison.tsx exists and renders correctly — verify only
that the content uses the correct numbers (≤$30K missed job cost,
$16/day Ava cost, 582 appointments Teo stat) then leave it alone.

If it does NOT exist or is not wired in Index.tsx, create and wire it:

---START FILE: src/components/AvaComparison.tsx---
import React from 'react';

const before=[
  {icon:'📵',text:'Calls go to voicemail — 70% of after-hours leads never call back'},
  {icon:'💸',text:'Lose $3,000–$30,000+ per missed job while competitors answer'},
  {icon:'🌙',text:'Zero coverage on weekends, evenings, holidays, and storm nights'},
  {icon:'🗂️',text:'Manually log every lead into your CRM — or it just gets lost'},
  {icon:'🤷',text:'No visibility into how many leads you\'re losing every week'},
  {icon:'💵',text:'Pay $45K–$65K/year for a receptionist who still can\'t work 24/7'},
];
const after=[
  {icon:'✅',text:'Every call answered in under 1 second — 24/7/365 including storms'},
  {icon:'💰',text:'Every lead captured, qualified, and booked before they hang up'},
  {icon:'📅',text:'3 appointments booked per day on average — zero human involvement'},
  {icon:'🔄',text:'Auto-syncs every call, note, and booking to ServiceTitan, HubSpot, GHL'},
  {icon:'🏆',text:'Teo Roofing: 582 appointments in 12 months = $4,190,400+ recovered'},
  {icon:'💵',text:'Costs as little as $16/day vs. $180+/day for a receptionist'},
];

export function AvaComparison(){
  return(
    <section style={{padding:'80px 24px',maxWidth:'1100px',margin:'0 auto'}}>
      <div style={{textAlign:'center',marginBottom:'52px'}}>
        <p style={{fontSize:'0.7rem',letterSpacing:'0.14em',
          color:'rgba(0,217,255,0.7)',fontWeight:700,marginBottom:'14px',
          textTransform:'uppercase'}}>The Difference Is Immediate</p>
        <h2 style={{fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:900,
          color:'#fff',lineHeight:1.2,margin:'0 0 14px'}}>
          Your Roofing Business,{' '}
          <span style={{background:'linear-gradient(135deg,#00D9FF,#7C3AED)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Before and After Ava
          </span>
        </h2>
        <p style={{color:'rgba(255,255,255,0.42)',fontSize:'0.88rem',
          maxWidth:'560px',margin:'0 auto',lineHeight:1.7}}>
          Teo Roofing booked 582 appointments in 12 months and recovered
          $4.1M+ in revenue they would have left on the table.
          This is now standard across 42+ companies.
        </p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}
        className="ac-grid">
        <div style={{background:'rgba(239,68,68,0.04)',
          border:'1px solid rgba(239,68,68,0.18)',
          borderRadius:'18px',padding:'28px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',
            marginBottom:'22px'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',
              background:'#EF4444',boxShadow:'0 0 8px rgba(239,68,68,0.8)'}}/>
            <span style={{fontSize:'0.72rem',fontWeight:800,
              letterSpacing:'0.1em',color:'rgba(239,68,68,0.9)',
              textTransform:'uppercase'}}>Without Ava</span>
          </div>
          {before.map((x,i)=>(
            <div key={i} style={{display:'flex',gap:'10px',
              alignItems:'flex-start',
              marginBottom:i<before.length-1?'10px':0,
              padding:'10px 12px',borderRadius:'10px',
              background:'rgba(239,68,68,0.025)'}}>
              <span style={{fontSize:'1rem',flexShrink:0}}>{x.icon}</span>
              <span style={{fontSize:'0.83rem',
                color:'rgba(255,255,255,0.58)',lineHeight:1.55}}>
                {x.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{background:'rgba(0,217,255,0.04)',
          border:'1px solid rgba(0,217,255,0.22)',
          borderRadius:'18px',padding:'28px',
          boxShadow:'0 0 40px rgba(0,217,255,0.05)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',
            marginBottom:'22px'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',
              background:'#00D9FF',boxShadow:'0 0 10px rgba(0,217,255,0.9)'}}/>
            <span style={{fontSize:'0.72rem',fontWeight:800,
              letterSpacing:'0.1em',color:'#00D9FF',
              textTransform:'uppercase'}}>With Ava</span>
          </div>
          {after.map((x,i)=>(
            <div key={i} style={{display:'flex',gap:'10px',
              alignItems:'flex-start',
              marginBottom:i<after.length-1?'10px':0,
              padding:'10px 12px',borderRadius:'10px',
              background:'rgba(0,217,255,0.025)'}}>
              <span style={{fontSize:'1rem',flexShrink:0}}>{x.icon}</span>
              <span style={{fontSize:'0.83rem',
                color:'rgba(255,255,255,0.82)',lineHeight:1.55}}>
                {x.text}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:640px){.ac-grid{
        grid-template-columns:1fr!important;}}`}</style>
    </section>
  );
}
---END FILE---

If not in Index.tsx, add:
  import { AvaComparison } from '@/components/AvaComparison';
  Place <AvaComparison /> after <IntegrationMarquee /> and
  before <AnimatedStats />.

════════════════════════════════════════════
2L — FINAL CTA (FinalCTA.tsx)
════════════════════════════════════════════

If FinalCTA.tsx exists and is wired in Index.tsx before <Footer />:
  Verify primary button text: "🎙️ Talk to Ava — It's Free"
  Verify it scrolls to #experience-ava and triggers .wcw-state-container
  Update secondary link label to "Book a Strategy Call →"
  Leave everything else alone.

If FinalCTA.tsx does NOT exist or is NOT in Index.tsx, create it:

---START FILE: src/components/FinalCTA.tsx---
import React from 'react';

export function FinalCTA() {
  const handleDemo = () => {
    const section = document.getElementById('experience-ava');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const btn = document.querySelector(
        '.wcw-state-container') as HTMLElement;
      if (btn) btn.click();
    }, 700);
  };
  return (
    <section style={{
      padding:'100px 24px 120px',textAlign:'center',
      position:'relative',overflow:'hidden',
      borderTop:'1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',
        background:'radial-gradient(ellipse 70% 50% at 50% 50%,rgba(0,217,255,0.07) 0%,transparent 70%)'}}/>
      <div style={{position:'relative',zIndex:1,
        maxWidth:'680px',margin:'0 auto'}}>
        <p style={{fontSize:'0.7rem',letterSpacing:'0.14em',fontWeight:700,
          color:'rgba(0,217,255,0.65)',marginBottom:'16px',
          textTransform:'uppercase'}}>Your Next Move</p>
        <h2 style={{fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:900,
          color:'#fff',lineHeight:1.15,margin:'0 0 18px'}}>
          Every Call You Miss Tonight Is{' '}
          <span style={{background:'linear-gradient(135deg,#00D9FF,#7C3AED)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            a Job You're Giving Away.
          </span>
        </h2>
        <p style={{color:'rgba(255,255,255,0.42)',fontSize:'1rem',
          maxWidth:'460px',margin:'0 auto 40px',lineHeight:1.75}}>
          Talk to Ava right now. No credit card, no sales call.
          Hear exactly what your customers will experience —
          live, in 30 seconds.
        </p>
        <div style={{display:'flex',gap:'14px',justifyContent:'center',
          flexWrap:'wrap',marginBottom:'28px'}}>
          <button onClick={handleDemo} style={{
            padding:'17px 38px',
            background:'linear-gradient(135deg,#00D9FF 0%,#7C3AED 100%)',
            border:'none',borderRadius:'14px',color:'#000',
            fontSize:'1rem',fontWeight:800,cursor:'pointer',
            letterSpacing:'0.02em',
            boxShadow:'0 6px 30px rgba(0,217,255,0.28)',
            transition:'transform 0.2s,box-shadow 0.2s',
          }}
          onMouseEnter={e=>{
            (e.currentTarget as HTMLElement).style.transform='translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow='0 10px 40px rgba(0,217,255,0.42)';
          }}
          onMouseLeave={e=>{
            (e.currentTarget as HTMLElement).style.transform='translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow='0 6px 30px rgba(0,217,255,0.28)';
          }}>
            🎙️ Talk to Ava — It's Free
          </button>
          <a href="#" style={{
            padding:'17px 30px',background:'transparent',
            border:'1px solid rgba(0,217,255,0.28)',borderRadius:'14px',
            color:'rgba(255,255,255,0.75)',fontSize:'1rem',fontWeight:600,
            cursor:'pointer',textDecoration:'none',display:'inline-block',
            transition:'border-color 0.2s,color 0.2s',
          }}
          onMouseEnter={e=>{
            (e.currentTarget as HTMLElement).style.borderColor='rgba(0,217,255,0.6)';
            (e.currentTarget as HTMLElement).style.color='#fff';
          }}
          onMouseLeave={e=>{
            (e.currentTarget as HTMLElement).style.borderColor='rgba(0,217,255,0.28)';
            (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.75)';
          }}>
            Book a Strategy Call →
          </a>
        </div>
        <div style={{display:'flex',gap:'20px',justifyContent:'center',
          flexWrap:'wrap'}}>
          {['No credit card','Live in 48–72 hours','Cancel anytime']
            .map((x,i)=>(
            <span key={i} style={{fontSize:'0.75rem',
              color:'rgba(255,255,255,0.3)',fontWeight:500}}>
              <span style={{color:'#00D9FF',marginRight:'5px'}}>✓</span>{x}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
---END FILE---

Add to Index.tsx:
  import { FinalCTA } from '@/components/FinalCTA';
  Place <FinalCTA /> as the LAST section before <Footer />.

════════════════════════════════════════════
2M — FRAMER-MOTION ANIMATIONS
════════════════════════════════════════════

Add this reusable FadeUp component to each file that needs
scroll animations. Add the import and component definition
at the top of each file:

  import { motion, useInView } from 'framer-motion';
  import { useRef } from 'react';

  function FadeUp({ children, delay=0, className='' }: {
    children: React.ReactNode; delay?: number; className?: string;
  }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
      <motion.div ref={ref} className={className}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay,
          ease: [0.23, 1, 0.32, 1] }}>
        {children}
      </motion.div>
    );
  }

Apply FadeUp wrapping in these components:
  AnimatedStats.tsx  → wrap each stat card, delay={index * 0.1}
  AvaComparison.tsx  → left column delay=0, right column delay=0.15
  TrackRecord.tsx    → wrap each grid cell, delay={index * 0.18}
  FinalCTA.tsx       → wrap the inner content div, delay=0

Do NOT add FadeUp to HeroSection — hero content appears immediately.
Do NOT add it to Navbar or alert bar.

Add to src/index.css:
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

════════════════════════════════════════════
2N — NAVBAR LINK (Navbar.tsx)
════════════════════════════════════════════

Add one new nav link to the main navigation:
  Label: "Revenue Recovery ↗"
  href: "https://revenuerecovery.summitvoiceai.com"
  target: "_blank"
  rel: "noopener noreferrer"
  Style: color #00D9FF to distinguish it as a featured external link

Place it between "Pricing" and "FAQ" in the nav order.

════════════════════════════════════════════
2O — VIDEO THUMBNAILS (DemoCallsSection.tsx)
════════════════════════════════════════════

Find all <video> elements. For each one:
  1. Add preload="metadata"
  2. Add playsInline attribute
  3. Append #t=0.1 to the src URL
     src="https://example.com/v.mp4" → src="https://example.com/v.mp4#t=0.1"

Reorder demos: any demo with "Roofing" in the title goes first.
"AI Realtor Demo" moves to position 2 or later.

⛔ HARD STOP — MAIN SITE BUILD CHECK
  Run: npm run build
  If 0 errors → continue to Phase 3.
  If errors → list every error and STOP completely.
  Do NOT push broken code.

  If build passes:
    git add -A
    git commit -m "feat: roofing ICP update — pricing, hero, FAQ, SEO, framer-motion, marquee, FinalCTA"
    git push origin main --force

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — LANDING PAGE: summitvoiceai-landing/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Working directory for this phase: ./summitvoiceai-landing/

This page has one job: Get a roofing company owner to book a
Revenue Leak Audit. The visitor is skeptical. They've seen
marketing. They care about money, not technology.

The psychological funnel is fixed and non-negotiable:
  1. Problem: "I miss calls. Follow-up isn't perfect."
  2. Reframe: "That's not a lead problem. It's leakage."
  3. Their numbers: Calculator makes it THEIR money, not abstract
  4. Conservative math: 1 extra job/month justifies this entirely
  5. Solution: Revenue Recovery Loop™ closes every leak
  6. Proof: Teo Roofing, 4K-lead campaign, real documented results
  7. Offer: $3K + $1,497/month, guaranteed implementation
  8. Action: Book the audit — low risk, high value

════════════════════════════════════════════
3A — MANUS CLEANUP
════════════════════════════════════════════

Step 1: Delete Manus artifacts
  rm -rf client/public/__manus__/
  Delete: client/src/components/ManusDialog.tsx

Step 2: In client/src/App.tsx
  Remove any import of ManusDialog
  Remove any <ManusDialog /> JSX element

Step 3: Localize all images

  Create: client/public/images/

  Download these and save with these filenames.
  If a download fails, note it and move on — do NOT stop.

    https://manus.im/manus-storage/summitvoiceai-logo-mark_efe1147e.png
    → client/public/images/logo-mark.png

    https://manus.im/manus-storage/summitvoiceai-hero-roof-ops_92a9006c.png
    → client/public/images/hero-roof.png

    https://manus.im/manus-storage/summitvoiceai-roof-detail_1f7b2e1f.png
    → client/public/images/roof-detail.png

    https://manus.im/manus-storage/summitvoiceai-operations-surface_a8e2dd2e.png
    → client/public/images/operations-surface.png

    https://manus.im/manus-storage/summitvoiceai-roof-finished-home_c3604f92.png
    → client/public/images/roof-finished-home.png

  Also copy logo files from parent:
    If ../../public/logos/ exists, copy the entire folder to
    client/public/logos/

Step 4: Update ALL /manus-storage/ path references

  In client/src/pages/Home.tsx:
    Replace all /manus-storage/summitvoiceai-* paths
    with their /images/ equivalents.

  In client/src/index.css:
    Replace all url("/manus-storage/...") references:
    summitvoiceai-hero-roof-ops → /images/hero-roof.png
    summitvoiceai-operations-surface → /images/operations-surface.png
    summitvoiceai-roof-finished-home → /images/roof-finished-home.png

════════════════════════════════════════════
3B — HERO VISUAL FIX ("floating head")
════════════════════════════════════════════

In client/src/index.css, find .hero-image.
Replace its background property with:

  .hero-image {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg,
        #07111e 0%,
        rgba(7,17,30,0.96) 50%,
        rgba(7,17,30,0.55) 100%),
      linear-gradient(180deg,
        rgba(7,17,30,0) 30%,
        #07111e 100%),
      url("/images/hero-roof.png") center 25% / cover;
    filter: saturate(0.78) contrast(1.08) brightness(0.7);
  }

The heavy gradient overlay ensures the image becomes a dark
atmospheric texture behind the content, not a visible person.
If the image didn't download, the gradients still look great on
their own — the background-color fallback (#07111e) handles it.

════════════════════════════════════════════
3C — COPY UPDATES (Home.tsx)
════════════════════════════════════════════

READ Home.tsx completely first. The existing design is GOOD.
The visual direction ("Signal & Steel") is correct — keep it.
The dark navy + cyan aesthetic is correct — keep it.
The hero board (pipeline UI) is correct — keep it.
The leaking bucket funnel visual is correct — keep it.
The 7-node loop section is correct — keep it.
The accordion systems cards are correct — keep it.

Make ONLY these targeted copy changes:

CHANGE 1 — Hero SectionLabel:
  Find: "For roofing companies investing in lead flow"
  Replace: "For roofing companies already spending money on leads"

CHANGE 2 — Hero lead paragraph:
  Find the .hero-lead paragraph.
  Replace its text content with:
    "SummitVoiceAI installs a done-for-you AI Revenue Recovery System
     that helps roofing companies answer calls 24/7, respond to new
     leads immediately, follow up with unsold estimates, reactivate old
     leads, book appointments automatically — and systematically generate
     reviews. Before you spend another dollar generating opportunities,
     let's make sure you're monetizing the ones you've already paid for."

CHANGE 3 — Hero microcopy below CTA:
  Find .microcopy or small text below the primary CTA button.
  Replace or update to:
    "✓ No obligation  ✓ No CRM replacement  ✓ No lead package required"

CHANGE 4 — Hero footnote second line:
  Find .hero-footnote p element.
  Replace text with:
    "Before you buy another lead, make sure you're monetizing
     the ones you've already paid for."

CHANGE 5 — Leak section h2:
  Replace with:
    "You may not have a lead problem.
     You may have a <em>revenue leakage problem.</em>"
  (em tag is already styled cyan in the existing CSS — use it)

CHANGE 6 — Intro-side paragraphs in leak section:
  Replace paragraph content with:
    "Roofers spend thousands generating calls, leads, estimates,
     and referrals. Then opportunities leak through missed calls,
     slow response, no follow-up, cold estimates, forgotten CRM leads,
     and no review requests. Buying more leads simply pours more
     water into a leaking bucket."

CHANGE 7 — Database section data-quote:
  Find .data-quote element. Replace text with:
    "If nobody works the database, you've already decided the outcome.
     Zero get recovered by your system — because there is no system."

CHANGE 8 — Loop section node descriptions:
  Find the 7-item array. Update descriptions ONLY (keep titles):
    CAPTURE: "Every call, form, website conversation and opportunity enters the system."
    RESPOND: "New prospects receive immediate communication before they call your competitor."
    FOLLOW UP: "Qualified prospects who don't respond stay in intelligent follow-up."
    REACTIVATE: "Old leads, estimates, no-shows and past customers re-enter a conversation."
    BOOK: "Interested homeowners are routed toward a real appointment or sales conversation."
    REVIEW: "Completed customers enter systematic review-request workflows."
    OPTIMIZE: "Performance is measured so the next bottleneck can be identified and fixed."

CHANGE 9 — Systems section descriptions:
  SYSTEM 01 features: "Revenue Leak Audit, 24/7 AI Receptionist,
    Missed-Call Recovery, Speed-to-Lead"
  SYSTEM 02 features: "Database Reactivation, Estimate Rescue System™,
    No-Show Recovery, Dormant Lead Campaigns"
  SYSTEM 03 features: "SMS nurture, Email nurture, AI-assisted calling,
    Appointment reminders, CRM workflows"
  SYSTEM 04 features: "Review Growth Engine, CRM/calendar infrastructure,
    Performance monitoring, Optimization roadmap"

CHANGE 10 — Guarantee section:
  h2: "We guarantee the implementation — not your sales team."
  Body text (replace entire):
    "If you complete onboarding, provide required access, and meet
     agreed prerequisites, and Summit has not deployed the agreed
     Revenue Recovery infrastructure within 30 days, Summit continues
     implementation at no management fee until the agreed system is live.
     If after the first 60 days Summit cannot point to measurable recovered
     conversations, appointments, opportunities or documented improvements
     in response and follow-up performance, Summit will personally review
     the account and build an additional recovery campaign at Summit's cost."
  <small> disclaimer:
    "Terms and prerequisites apply. This is a deployment guarantee,
     not a guarantee of leads, appointments, sales or revenue."

CHANGE 11 — Pricing values:
  const MONTHLY_FEE = 1497 (keep as-is)
  const IMPLEMENTATION_FEE = 3000 (keep as-is)
  Card 1: currency(697), implementation: currency(1500)
  Card 2: currency(1497) FEATURED, implementation: currency(3000)
  Card 3: currency(2497), implementation: currency(5000)
  Card 2 name: "Summit Revenue Recovery System™"
  Card 3 name: "Summit AI Growth Engine™"

CHANGE 12 — FAQ data:
  Replace with the same 6 roofing-specific Q&As from Phase 2E.
  Keep the <details>/<summary> structure intact.

CHANGE 13 — Booking section h2:
  "Before you buy another lead,
   <em>find out what's happening to the ones you already have.</em>"

CHANGE 14 — Email report section:
  Keep existing. It's good.

════════════════════════════════════════════
3D — PROOF SECTION (Home.tsx)
════════════════════════════════════════════

Find .asset-placeholder div.
Replace the ENTIRE asset-placeholder div with:

  <div style={{
    marginTop:'27px',padding:'24px',
    background:'rgba(0,212,255,0.06)',
    border:'1px solid rgba(0,212,255,0.3)',
  }}>
    <div style={{fontSize:'9px',letterSpacing:'0.13em',
      textTransform:'uppercase',color:'#7ee8fa',
      fontWeight:700,marginBottom:'14px'}}>
      🏆 Documented Client Result — Teo Roofing
    </div>
    <div style={{fontFamily:'"Barlow Condensed",sans-serif',
      fontSize:'clamp(22px,4vw,32px)',fontWeight:700,
      color:'#00d4ff',lineHeight:0.9,marginBottom:'12px',
      textTransform:'uppercase'}}>
      582 appointments.<br/>
      <span style={{color:'#fff'}}>$4,190,400+</span> recovered.
    </div>
    <p style={{fontSize:'12px',color:'#9bbdce',margin:0,lineHeight:1.6}}>
      Teo Roofing ran the Summit Revenue Recovery System for 12 months.
      Ava answered every call 24/7. At a 55% close rate on jobs
      averaging $13,100 — that's over $4.1M in revenue that would
      have gone to voicemail. Now replicated across 42+ companies.
    </p>
    <div style={{marginTop:'14px',display:'flex',gap:'12px',
      flexWrap:'wrap'}}>
      {['582 Appointments','$4.1M+ Recovered','12 Months',
        '1 AI Receptionist'].map((x,i)=>(
        <div key={i} style={{padding:'5px 12px',
          background:'rgba(0,212,255,0.1)',
          border:'1px solid rgba(0,212,255,0.25)',
          fontSize:'10px',fontWeight:700,color:'#7ee8fa',
          letterSpacing:'0.08em'}}>
          {x}
        </div>
      ))}
    </div>
  </div>

════════════════════════════════════════════
3E — CALCULATOR ROI SECTION (Home.tsx)
════════════════════════════════════════════

This is the most critical conversion section on the entire landing page.
The calculator ALREADY EXISTS in Home.tsx with good inputs and real-time
calculation. What it is currently MISSING is the full psychological
sequence AFTER the results display.

The existing calc object already computes ALL of these — use them directly:
  calc.daily, calc.weekly, calc.monthly, calc.annual,
  calc.tenPercent, calc.oneJobAnnual, calc.oneJobRatio,
  calc.jobsToFee, calc.monthlyFeePercent, calc.everyTwoMonths,
  calc.everyTwoMonthsRatio, calc.lowContacts, calc.highContacts,
  calc.lowRevenue, calc.highRevenue

These variables are already defined in Home.tsx — do NOT redefine:
  currency(), number(), jobValue, databaseSize, missedCalls,
  closeOutOfTen, MONTHLY_FEE, IMPLEMENTATION_FEE,
  scrollToBooking, ArrowUpRight

Find the calculator-results div in Home.tsx.
Inside it, AFTER the existing math-panel div (or after the math-toggle
button if math-panel is conditionally rendered), ADD this entire block.
Do NOT replace any existing calculator code — only ADD after it:

  {/* ── ROI SEQUENCE — DO NOT REMOVE OR REORDER ── */}
  <div style={{
    marginTop:'28px',paddingTop:'22px',
    borderTop:'1px solid rgba(175,211,241,0.14)',
  }}>

    <div style={{
      fontFamily:'"Barlow Condensed",sans-serif',
      fontSize:'clamp(18px,2.5vw,24px)',fontWeight:700,
      textTransform:'uppercase',color:'#fff',
      lineHeight:0.95,marginBottom:'16px',
    }}>
      We don't need to recover all of that.<br/>
      <span style={{color:'#00d4ff'}}>
        We don't even need to come close.
      </span>
    </div>

    {/* A — 10% Scenario */}
    <div style={{
      marginBottom:'10px',padding:'14px',
      background:'rgba(0,212,255,0.08)',
      border:'1px solid rgba(0,212,255,0.22)',
    }}>
      <span style={{
        fontSize:'9px',letterSpacing:'0.12em',textTransform:'uppercase',
        color:'#7ee8fa',fontWeight:700,display:'block',marginBottom:'5px',
      }}>A / Even 10% recovery scenario</span>
      <strong style={{
        fontFamily:'"Barlow Condensed",sans-serif',
        fontSize:'clamp(32px,4vw,44px)',color:'#00d4ff',
        display:'block',lineHeight:0.9,marginBottom:'6px',
      }}>
        {currency(calc.tenPercent)}
      </strong>
      <small style={{color:'#89a8bc',fontSize:'10px',lineHeight:1.45}}>
        Illustrative annual gross revenue if 10% of the modeled
        opportunity were ultimately recovered and sold. Not a guarantee.
        Not every missed call is a qualified lead.
      </small>
    </div>

    {/* B — One Job Per Month */}
    <div style={{
      padding:'14px',marginBottom:'10px',
      background:'rgba(0,212,255,0.04)',
      border:'1px solid rgba(175,211,241,0.18)',
    }}>
      <span style={{
        fontSize:'9px',letterSpacing:'0.12em',textTransform:'uppercase',
        color:'#89a8bc',fontWeight:700,display:'block',marginBottom:'10px',
      }}>
        B / Forget the big number — what if Summit helped you
        recover just 1 extra sold job per month?
      </span>
      <div style={{
        display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',
      }} className="roi-grid">
        <div>
          <span style={{fontSize:'9px',color:'#7a97aa',display:'block',
            marginBottom:'3px',textTransform:'uppercase',
            letterSpacing:'0.07em'}}>1 job / month</span>
          <strong style={{fontFamily:'"Barlow Condensed",sans-serif',
            fontSize:'clamp(20px,3vw,28px)',color:'#eaf8ff'}}>
            {currency(jobValue)}
          </strong>
        </div>
        <div>
          <span style={{fontSize:'9px',color:'#7a97aa',display:'block',
            marginBottom:'3px',textTransform:'uppercase',
            letterSpacing:'0.07em'}}>Annualized revenue</span>
          <strong style={{fontFamily:'"Barlow Condensed",sans-serif',
            fontSize:'clamp(20px,3vw,28px)',color:'#eaf8ff'}}>
            {currency(calc.oneJobAnnual)}
          </strong>
        </div>
        <div>
          <span style={{fontSize:'9px',color:'#7a97aa',display:'block',
            marginBottom:'3px',textTransform:'uppercase',
            letterSpacing:'0.07em'}}>Revenue-to-fee</span>
          <strong style={{fontFamily:'"Barlow Condensed",sans-serif',
            fontSize:'clamp(20px,3vw,28px)',color:'#68e6ff'}}>
            {calc.oneJobRatio.toFixed(1)}×
          </strong>
          <small style={{fontSize:'8px',color:'#7a97aa',display:'block'}}>
            illustrative — not ROI
          </small>
        </div>
      </div>
    </div>

    {/* Payback View */}
    <div style={{
      padding:'12px 14px',marginBottom:'10px',
      background:'rgba(5,16,28,0.8)',
      border:'1px solid rgba(175,211,241,0.1)',
    }}>
      <p style={{margin:0,fontSize:'12px',color:'#a9bfcc',lineHeight:1.6}}>
        Using your numbers, approximately{' '}
        <strong style={{color:'#eaf8ff'}}>
          {calc.jobsToFee.toFixed(1)} average-value sold jobs
        </strong>
        {' '}would equal your entire first-year Summit investment
        on a gross-revenue basis. That's not{' '}
        {Math.ceil(calc.jobsToFee)} per month.
        That's {Math.ceil(calc.jobsToFee)} across the whole year.
        Everything after that is additional gross revenue relative
        to Summit's fees — before considering your job costs.
      </p>
    </div>

    {/* C — One Job Every Two Months */}
    <div style={{
      padding:'12px 14px',marginBottom:'10px',
      background:'rgba(255,168,100,0.04)',
      border:'1px solid rgba(255,168,100,0.15)',
    }}>
      <span style={{
        fontSize:'9px',letterSpacing:'0.12em',textTransform:'uppercase',
        color:'#f0b37d',fontWeight:700,display:'block',marginBottom:'6px',
      }}>
        C / What if it only helped with 1 extra job every 2 months?
      </span>
      <div style={{display:'flex',alignItems:'baseline',gap:'12px',
        flexWrap:'wrap',marginBottom:'6px'}}>
        <strong style={{fontFamily:'"Barlow Condensed",sans-serif',
          fontSize:'clamp(24px,3.5vw,36px)',color:'#ffd1aa'}}>
          {currency(calc.everyTwoMonths)}
        </strong>
        <span style={{fontSize:'10px',color:'#eba672'}}>6 jobs / year</span>
        <span style={{fontSize:'10px',color:'#9db1c0'}}>
          {calc.everyTwoMonthsRatio.toFixed(1)}× revenue-to-fee
          vs. first-year investment
        </span>
      </div>
      <small style={{fontSize:'10px',color:'#9db1c0',lineHeight:1.5}}>
        Illustrative only. The system doesn't need to turn your company
        upside down. It needs to help your existing sales machine
        become slightly less wasteful.
      </small>
    </div>

    {/* Database Teaser */}
    <div style={{
      padding:'12px 14px',marginBottom:'10px',
      background:'rgba(0,212,255,0.03)',
      border:'1px solid rgba(0,212,255,0.12)',
    }}>
      <span style={{
        fontSize:'9px',letterSpacing:'0.12em',textTransform:'uppercase',
        color:'#7ee8fa',fontWeight:700,display:'block',marginBottom:'6px',
      }}>
        And we haven't even looked inside your CRM yet.
      </span>
      <p style={{margin:'0 0 8px',fontSize:'11px',
        color:'#8ea7b8',lineHeight:1.6}}>
        You told us you have{' '}
        <strong style={{color:'#dff8ff'}}>
          {number(databaseSize)} old leads
        </strong>
        {' '}in your database. At a hypothetical 3% reactivation rate,
        that's{' '}
        <strong style={{color:'#dff8ff'}}>
          {number(calc.lowContacts)} reactivated conversations
        </strong>.
        At 16%, that's{' '}
        <strong style={{color:'#dff8ff'}}>
          {number(calc.highContacts)}
        </strong>.
        Illustrative range:{' '}
        <strong style={{color:'#a5efff'}}>
          {currency(calc.lowRevenue)} – {currency(calc.highRevenue)}
        </strong>.
      </p>
      <strong style={{color:'#dff8ff',fontSize:'12px',display:'block'}}>
        If nobody works the database, you've already decided the outcome.
        Zero get recovered — because there is no system.
      </strong>
    </div>

    {/* The Real Question + CTA */}
    <div style={{
      padding:'18px',marginBottom:'0',
      background:'linear-gradient(135deg,rgba(8,24,41,0.9),rgba(10,31,53,0.8))',
      border:'1px solid rgba(175,211,241,0.22)',
    }}>
      <div style={{fontFamily:'"Barlow Condensed",sans-serif',
        fontSize:'clamp(16px,2.2vw,20px)',fontWeight:700,
        textTransform:'uppercase',color:'#fff',
        lineHeight:1.05,marginBottom:'8px'}}>
        So here's the real question:
      </div>
      <div style={{fontFamily:'"Barlow Condensed",sans-serif',
        fontSize:'clamp(14px,2vw,17px)',textTransform:'uppercase',
        color:'#00d4ff',lineHeight:1.15,marginBottom:'13px'}}>
        Do you need more leads —<br/>
        or do you need to stop wasting<br/>
        the ones you already paid for?
      </div>
      <p style={{margin:'0 0 15px',fontSize:'11px',
        color:'#9bb3c4',lineHeight:1.6}}>
        You don't need to believe every number above. Cut it in half.
        Cut it by 75%. Cut it by 90%. If there's still enough opportunity
        left to matter, it's worth finding out where the leaks actually are.
        That's exactly why we don't ask you to buy based on a calculator.
        We ask you to let us look at the actual business.
      </p>
      <button type="button" className="cta-button"
        style={{width:'100%'}} onClick={scrollToBooking}>
        <span>Book My Free Revenue Leak Audit</span>
        <ArrowUpRight size={18} strokeWidth={2.6} aria-hidden="true"/>
      </button>
      <p style={{margin:'9px 0 0',fontSize:'10px',
        color:'#7a97aa',textAlign:'center'}}>
        Even if we never work together, you'll know what
        deserves your attention first.
      </p>
    </div>

    {/* Legal Disclaimer */}
    <div style={{
      marginTop:'14px',padding:'12px',
      background:'rgba(5,16,28,0.6)',
      border:'1px solid rgba(175,211,241,0.08)',
      display:'flex',gap:'9px',alignItems:'flex-start',
    }}>
      <span style={{color:'#71a9bf',fontSize:'13px',flexShrink:0}}>⚑</span>
      <p style={{margin:0,fontSize:'10px',color:'#7f99aa',lineHeight:1.55}}>
        These figures are hypothetical estimates based solely on
        information entered by the user. They are not projections or
        guarantees of revenue, appointments, leads, profit or sales.
        Not every missed call is a qualified opportunity. Actual outcomes
        depend on lead quality, sales process, market conditions, service
        area, pricing, database age, customer intent, operational capacity
        and other factors.
      </p>
    </div>

  </div>
  {/* ── END ROI SEQUENCE ── */}

Add to client/src/index.css:
  @media(max-width:560px){
    .roi-grid{ grid-template-columns:1fr 1fr!important; }
    .roi-grid>div:last-child{ grid-column:1/-1; }
  }

════════════════════════════════════════════
3F — FRAMER-MOTION (Home.tsx)
════════════════════════════════════════════

Add at top of Home.tsx (merge useRef with existing import if present):
  import { motion, useInView } from 'framer-motion';
  import { useRef } from 'react';

Add FadeUp component BEFORE the Home() function definition:

  function FadeUp({ children, delay=0, className='' }: {
    children: React.ReactNode; delay?: number; className?: string;
  }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
      <motion.div ref={ref} className={className}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}>
        {children}
      </motion.div>
    );
  }

Apply FadeUp wrapping:
  hero-copy div          → delay=0
  hero-board div         → delay=0.18
  leak-aside             → delay=0.15
  Each scenario-card     → delay={index * 0.1}
  Each loop-node         → delay={index * 0.07}
  database-panel         → delay=0.2
  Each system-card       → delay={index * 0.08}
  proof-copy             → delay=0.12
  booking-form-wrap      → delay=0.15

IMPORTANT: The Home() function uses useState and useMemo for
the live calculator. Framer-motion additions must not break
the reactive behavior. Test that sliders update all results
in real time after adding animations.

════════════════════════════════════════════
3G — VERCEL CONFIG AND SEO
════════════════════════════════════════════

Create summitvoiceai-landing/vercel.json:
  {
    "buildCommand": "cd client && npm install && npm run build",
    "outputDirectory": "client/dist",
    "framework": "vite",
    "rewrites": [{"source":"/(.*)", "destination":"/index.html"}],
    "headers": [{
      "source":"/(.*)",
      "headers": [
        {"key":"X-Frame-Options","value":"SAMEORIGIN"},
        {"key":"X-Content-Type-Options","value":"nosniff"}
      ]
    }]
  }

Create summitvoiceai-landing/.env:
  VITE_CALENDAR_URL=https://calendly.com/summitvoiceai/revenue-audit

Create summitvoiceai-landing/client/.env.example:
  VITE_CALENDAR_URL=https://your-calendly-link-here.com

In summitvoiceai-landing/client/index.html, update <head>:
  <title>Roofing Revenue Leak Audit | SummitVoiceAI</title>
  <meta name="description" content="Find out where roofing jobs are
  disappearing before spending another dollar on leads. Book your free
  Revenue Leak Audit. Trusted by 42+ roofing companies."/>
  <meta property="og:title"
    content="Stop Losing Roofing Jobs You Already Paid to Acquire"/>
  <meta property="og:description"
    content="SummitVoiceAI installs done-for-you AI revenue recovery
    for roofing companies. $84M+ recovered. 42+ clients."/>
  <meta property="og:url"
    content="https://revenuerecovery.summitvoiceai.com"/>
  <link rel="canonical"
    href="https://revenuerecovery.summitvoiceai.com"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

⛔ HARD STOP — LANDING PAGE BUILD CHECK
  cd summitvoiceai-landing
  npm run build

  If 0 errors → continue.
  If errors → list every error and STOP.
  Do NOT push broken code.

  If build passes:
    git add -A
    git commit -m "feat: complete landing page — copy, ROI sequence, proof, pricing, Manus cleanup, framer-motion"
    git push origin main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — FINAL AUDIT REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After both builds pass, output this structured report:

MAIN SITE (summitvoiceai.com):
  ✓ Files changed: [list every file]
  ✓ index.html canonical domain fixed (summitvoiceai.com)
  ✓ Alert bar: "67% of their calls"
  ✓ Hero headline gradient: white → cyan
  ✓ Hero mobile gap: [fixed / root cause found: describe it]
  ✓ Eyebrow badge: 42+ confirmed
  ✓ Social proof line: Teo Roofing added
  ✓ Trust pills: 3 pills below CTA
  ✓ Pricing: all 3 tiers updated ($697/$1,497/$2,497)
  ✓ FAQ: 6 roofing-specific questions
  ✓ Duplicate stats: none remaining
  ✓ AnimatedStats heading updated
  ✓ TrackRecord: created or updated
  ✓ RevenueSection: per-company daily averages
  ✓ FinalCTA: wired before footer
  ✓ Revenue Recovery nav link: added to Navbar
  ✓ Video thumbnails: #t=0.1 added
  ✓ Framer-motion: applied to 4 components
  ✓ prefers-reduced-motion: added to CSS

LANDING PAGE (revenuerecovery.summitvoiceai.com):
  ✓ Files changed: [list every file]
  ✓ Manus cleanup: ManusDialog removed, __manus__ deleted
  ✓ Images downloaded: [list which succeeded]
  ✓ Images needing manual replacement: [list which failed]
  ✓ Hero floating head: fixed via gradient overlay
  ✓ Hero lead paragraph: updated
  ✓ Hero microcopy: updated
  ✓ Leak section: copy updated
  ✓ Loop descriptions: all 7 updated
  ✓ Systems descriptions: all 4 updated
  ✓ Proof section: Teo Roofing data added (asset-placeholder replaced)
  ✓ Calculator ROI sequence: all 5 sub-sections added
  ✓ Guarantee: official language applied
  ✓ Pricing: 3 tiers aligned ($697/$1,497/$2,497)
  ✓ FAQ: 6 roofing-specific questions
  ✓ Framer-motion: applied to 9 elements
  ✓ vercel.json: created
  ✓ .env: created with placeholder calendar URL
  ✓ SEO meta: updated

MANUAL ACTIONS REQUIRED:
  1. Replace VITE_CALENDAR_URL in summitvoiceai-landing/.env
     with your real Calendly booking link
  2. Update "Book a Strategy Call →" href in FinalCTA.tsx
     to your actual booking page URL
  3. If Manus images failed, manually save from live Manus preview:
     https://summitvoic-tna9mud4.manus.space/
     Right-click each image → Save → client/public/images/
  4. Deploy landing page to Vercel as a NEW project:
     - Root directory: summitvoiceai-landing
     - Build: cd client && npm install && npm run build
     - Output: client/dist
     - Env var: VITE_CALENDAR_URL = your booking URL
  5. Add domain in Vercel: revenuerecovery.summitvoiceai.com
  6. Add CNAME in GoDaddy: revenuerecovery → cname.vercel-dns.com
  7. Once live: verify pricing matches on both sites
  8. Once live: update Revenue Recovery nav link href in Navbar.tsx

ISSUES NOTICED BUT NOT FIXED: [list any]
NEXT STEPS RANKED BY PRIORITY: [list top 3]
```

---

## Reference: Official Pricing (Both Sites Must Match)

| Tier | Name | Monthly | Setup |
|------|------|---------|-------|
| 1 — Downsell | SummitVoice AI Capture™ | $697/mo | $1,500 |
| 2 — **PRIMARY** | **Summit Revenue Recovery System™** | **$1,497/mo** | **$3,000** |
| 3 — Enterprise | Summit AI Growth Engine™ | $2,497/mo | $5,000 |

Annual prepay option (Tier 2): $16,500 + implementation

---

## Reference: Documented Proof Points (Use Only These)

| Fact | Source |
|------|--------|
| 582 appointments in 12 months | Teo Roofing, via Ava |
| $4,190,400+ recovered | Teo Roofing, 55% close × avg $13,100/job |
| ~294 appointments → ~$200K revenue | One roofing database campaign, ~4,000 leads |
| ~600 total appointments | Broader engagement, same client |
| 42+ active businesses | Platform-wide, current |
| $84M+ annually | Client revenue recovered across active clients |
| 100% call answer rate | Platform-wide, <1 second |
| Named clients | Teo Roofing, Stonewall, Black Label, Impact, Proof Roofing |

---

## Reference: Brand Voice Rules

- Lead with **roofing**. Secondary: home services, healthcare, real estate.
- Never say "revolutionize," "leverage," "unlock exponential growth."
- Speak contractor: clear, concrete, economic.
- Every stat needs a disclaimer: "illustrative," "not a guarantee," "actual results vary."
- One dominant CTA per page. No scattered conversion paths.
- Core line (use verbatim): *"Before you spend another dollar generating opportunities, let's make sure you're monetizing the ones you've already paid for."*

---

*Generated for Dan Gill / Summit Marketing Group — SummitVoiceAI*
*summitvoiceai.com | revenuerecovery.summitvoiceai.com*
