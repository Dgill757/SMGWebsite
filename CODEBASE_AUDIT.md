# SUMMIT OS - CODEBASE AUDIT
**Date:** 2026-07-06 | **Session:** Autonomous Operator Full Audit
**Auditor:** Claude (Chief Operating Agent)

---

## EXECUTIVE SUMMARY

The system is in better shape than the directive assumed. Several "missing" pieces already exist:
/dispatch exists, /agents/status exists with Supabase fallback, the activity feed exists,
premium_website_generator_v2.py exists and meets the Roof EZ quality standard, and the deployed
dashboard (v6) already wires every tab to real API endpoints.

The real problems found:

1. **BLOCKER: Anthropic API credits depleted.** Verified live - API returns HTTP 400
   "credit balance is too low". Demo machine dies at step 2 (brand extraction). Only Dan can fix
   (billing action). See BLOCKERS.txt.
2. **Railway runs ava_demo_studio_api.py, NOT ava_demo_studio_COMPLETE_API.py.**
   Both Procfile and railway.json point to ava_demo_studio_api:app. The COMPLETE_API file is a
   stale, older variant (52KB vs 72KB) - all fixes must go into ava_demo_studio_api.py.
3. **Duplicate route registrations** in the live API: /outreach/stats and /outreach/hot-leads
   are each defined twice. Starlette serves the FIRST registration, so the newer authenticated
   "V5" versions (lines ~1155/~1196) were dead code that looked live. (Removed this session.)
4. **Demo state is memory-only.** demo_store dies on every Railway restart -> status polling 404s
   mid-build. Supabase has a demos_built table (the dashboard already writes to it) but the API
   never persisted there. (Fixed this session.)
5. **index.html (deployed) == summit_os_v6.html. v7 and v8 are NEWER** (June 24/25) and were
   never promoted. Not auto-promoting - v6 is the verified-working deploy target; Dan should review
   v7/v8 before switching.
6. **SECURITY - Supabase RLS disabled on 10 tables** (scraper_runs, outreach_runs, hot_leads,
   ghl_activity, agent_status, demos, activity_log, morning_intelligence, business_analysis,
   website_build_queue). The anon key is embedded in the public dashboard HTML, so anyone who
   views source can read/write those tables. Needs policies designed before enabling RLS or the
   dashboard breaks. See BLOCKERS.txt #2.
7. **SECURITY - live credentials in plain files:** .env (all keys), PASSWORDS.txt,
   ghl_enrich_businesses.py (hardcoded GHL private token), test_demo_long.py (hardcoded AVA
   key). Must be excluded/sanitized before any GitHub push (standing rule: never commit API keys).

---

## PYTHON FILES

### ava_demo_studio_api.py - THE LIVE RAILWAY API (72KB, 1419 lines)
- **What it does:** FastAPI app. Demo machine (scrape -> brand extract -> audit -> build site ->
  deploy Vercel -> update GHL -> deliver email/SMS), ingest endpoints for local scripts, dashboard
  read endpoints, agent status store, activity feed, WebSocket push, GHL webhook.
- **APIs called:** Firecrawl (scrape), Anthropic (Haiku extraction + audit), Vercel v13
  (deployments), GHL (contacts/conversations/opportunities), Supabase REST.
- **Broken/suboptimal (fixed this session):**
  - Bare r.json() in deploy_to_vercel (L385) and GHL contact fetch (L472) - crash on empty/
    non-JSON responses (the original Firecrawl-bug pattern). scrape_website was already guarded.
  - Status-guarded but parse-unsafe .json() at L729, L827, L851-856, L876.
  - /demos/{id}/status had no Supabase fallback (404 after restart).
  - build_demo_task never persisted progress to Supabase.
  - /dispatch only handled demo + status; no audit, no scrape.
  - No startup schema check.
  - Duplicate dead routes (see summary #3).
  - generate_audit used Haiku - customer-facing 450-550 word audit deserves Sonnet
    (per cost policy: extraction=Haiku, audits+content=Sonnet).
- **Endpoint inventory (live file):** /health, /demos/create, /demos/{id}/status, /demos,
  /dispatch, /ingest/scraper-run, /ingest/outreach-run, /ingest/replies, /scraper/stats,
  /outreach/stats, /outreach/hot-leads, /analytics/summary, /analytics/scraper-runs,
  /analytics/outreach-runs, /analytics/demos, /analytics/activity-feed (new), /ghl/pipeline/stats,
  /ghl/replies/recent, /ws, /webhooks/ghl, /agents/status (GET+POST), /agents/status/{id},
  /agents/health-summary, /activity/feed, /activity/log, /content/recent, /intelligence/morning,
  /ceo/summary, /clients/list, /businesses/by-date, /businesses/dates,
  /businesses/analysis/{id}, /businesses/stats.
- **Tested:** /health responds (Railway live). Demo build fails at step 2 - Anthropic credits.
  Supabase-backed endpoints return real data (activity_log 1,555 rows, agent_status 28 rows).
  hot_leads/scraper_runs/demos are EMPTY tables -> those endpoints return zeros until scripts post.

### ava_demo_studio_COMPLETE_API.py - STALE, NOT DEPLOYED
Older variant. Uses Sonnet for audit (L234) but lacks the newer V5 dashboard endpoints.
**Action: left untouched; treat as archive. Do not edit - confusion risk.**

### premium_website_generator_v2.py - MEETS QUALITY STANDARD (verified, no changes)
- Barlow Condensed (weights up to 900) via Google Fonts: YES
- Three.js r134 orange particle hero (#F97316 default secondary): YES
- GSAP 3.12.2 + ScrollTrigger CDN: YES
- Lenis smooth scroll (studio-freight 1.0.42): YES
- Sections: navbar, hero (badge+stats), trust bar, service tabs, gallery, before/after,
  about (metrics), reviews, contact form, footer = 8+ required sections: YES
- Pulsing orange elements + tel: CTAs + sticky mobile CTA bar: YES
- Thinker voice widget injection via widget_key: YES
The live API already imports generate_world_class_roofing_site from it.

### C:\Users\DanGi\outreach\daily_outreach.py - MAIN SCRAPER (runs 6:00 AM daily)
- Apify Google-Maps scrape -> filter roofing cos -> Apollo enrichment -> GHL contact create ->
  Haiku-personalized email send -> state.json city cursor -> Slack (webhook unset).
- **Missing:** lead scoring. (Added this session - additive only: score_lead(), GHL
  lead_score custom field, "Hot Prospect 80+" tag, score-descending sort, fail-safe demo-build
  trigger for 80+ scorers with websites.)
- Note: fields available for scoring are Apify fields (reviewsCount, _website, _email,
  totalScore rating) - the directive's estimated_revenue/employee_count do not exist in
  this data source; scoring adapted accordingly.

### content_generator.py - Monday 7 AM weekly content
- Good pillar/hook rotation structure. **Was:** Haiku with voice rules inline in user prompt.
- **Fixed:** added CONTENT_SYSTEM_PROMPT (Dan voice, non-negotiable rules) as a proper system
  param + upgraded model to claude-sonnet-4-6 (content = complex writing per cost policy).

### research_agent.py - Tue/Thu 6:30 AM
- Firecrawl searches + competitor page checks + Haiku synthesis -> SummitVault + Slack.
- Uses Firecrawl **v0** endpoints (deprecated but still responding) - flagged, not changed.
- **Fixed:** added check_reddit_buying_signals() per directive + wired into main run.

### Other scripts (audited, no changes unless noted)
| File | Purpose | State |
|---|---|---|
| ceo_weekly_report.py | Sunday 8pm pipeline report (Sonnet) | OK - needs credits |
| client_manager.py | Sunday 7pm client health emails (Haiku) | OK - needs credits |
| morning_ceo_briefing.py | Daily 7am Slack brief | Blocked on Slack webhook |
| heygen_agent.py | Monday 7:30am avatar video | Blocked on HEYGEN_API_KEY |
| rvm_agent.py | Mon-Fri 10:30am voicemail drops | Blocked on Slybroadcast creds |
| social_media_automation.py | Post to platforms | Blocked on LinkedIn/FB tokens |
| system_watchdog.py | Agent self-healing monitor | Designed as Railway worker - not deployed |
| template_cloner_FIXED.py | GitHub template cloning | Blocked on GITHUB_TOKEN |
| no_website_builder.py | Segment B no-site builds | Logic already merged into live API |
| voice_ai_automation_v2.py | Thinker agent setup via Playwright | Manual 15-min session needed |
| playwright_slack_setup.py | Slack app creation | Manual 15-min session needed |
| websocket_additions.py | WS code | Already merged into live API |
| test_demo.py / test_demo_long.py | Demo machine smoke tests | Work - currently fail at step 2 (credits) |
| ghl_enrich_businesses.py | Backfill Supabase from GHL | Hardcoded GHL token (sanitized this session) |

---

## DASHBOARD (index.html = summit_os_v6)
- **Tabs:** BRIEF, TEAM, PIPELINE, CONTENT, CLIENTS, DEMOS, FINANCE, INTEL - ALL wired to real
  endpoints (/ceo/summary, /agents/status, /activity/feed, /businesses/*, /demos/create + polling,
  /clients/list, /outreach/hot-leads, /intelligence/morning) + direct Supabase reads.
- **Real buttons:** Build Demo Site (posts /demos/create + 10-step progress polling), Deploy Agent,
  Unblock Agent, SDR analysis, Free Site, expense CRUD. The "loadSkill placeholder buttons"
  problem from the directive belonged to v4 - already solved in v6.
- **Placeholder data:** FINANCE forecast rows are static math (fine); INTEL headlines fall back to
  cached defaults when morning_intelligence is empty.
- **Missing (fixed):** lead-score badges on hot leads with HIGH VALUE flag for 80+.
- **Known risk:** client-side password (ava2026 in source) + AVA API key + Supabase anon key
  visible in HTML. Acceptable per current architecture; the RLS fix is the real gate.
- v7/v8 exist and are newer - review before promoting.

## GHL WORKFLOWS (workflow_ai_agent_prompts.txt)
6 workflows prompted: Reply Router, Segment A follow-ups (Day 3/7/14), Positive Reply Handler,
Audit+Demo Delivery, Demo Follow-up, No-Website Auto Build.
- Quality: decent voice compliance, but $9,500 anchor inconsistent, positive-reply handler never
  offers to build a demo on the spot, and there was NO pre-meeting brief workflow and NO
  post-meeting / stale-deal / onboarding prompts.
- **Fixed:** workflow_ai_agent_prompts_v2.txt written with 9 upgraded prompts.

## SUPABASE (project omdpkeaqgtizakdfughq) - 16 tables, verified live
scraper_runs(0) outreach_runs(11) hot_leads(0) ghl_activity(0) clients(4) agent_status(28)
demos(0) activity_log(1555) content_library(14) morning_intelligence(7) scraped_businesses(5411)
business_analysis(123) expenses(8) free_sites(1) demos_built(1) website_build_queue(130)
- RLS disabled on 10 tables (see summary #6).
- The directive's "demo_builds" table does not exist - the real table is **demos_built**;
  all new persistence targets demos_built.

## DEPLOYMENT SURFACES
- Railway: https://ava-studio-api-production.up.railway.app (live, runs ava_demo_studio_api.py)
- Vercel: index.html static -> dashboard.summitvoiceai.com (vercel.json present)
- GitHub: github.com/Dgill757/SMGWebsite - repo not initialized locally; push requires
  sanitization first (see summary #7).
