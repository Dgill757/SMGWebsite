SUMMIT OS OPERATIONS MANUAL
=============================
Updated: 2026-07-06 (Autonomous Operator session)

DAILY AUTOMATED SCHEDULE (Windows Task Scheduler, this machine)
  06:00 AM   Apollo/Apify Scout  - scrapes next city (city 25/365), scores every
             lead 0-100, tags "Hot Prospect 80+", queues silent demo builds for
             80+ scorers with websites
  07:00 AM   Morning CEO briefing (Slack - BLOCKED until webhook set)
  09:00 AM   Outreach Manager - 100 emails + SMS (Mon-Fri), highest scores first
  09:15 AM   Follow-Up - Day 3/7/14 sequences (Mon-Fri)
  Every 15m  Reply Classifier - tags hot leads, writes hot_leads.log
  10:30 AM   RVM drops (Mon-Fri - BLOCKED until Slybroadcast creds)
  Monday 7am Content Creator - week of content in Dan's voice (Sonnet)
  Mon 7:30am HeyGen avatar video (BLOCKED until HEYGEN_API_KEY)
  Tue/Thu 6:30am Research Analyst - market intel + Reddit buying signals
  Sun 7pm    Client Manager - per-client health emails
  Sun 8pm    CEO Weekly Report

DAN'S 5-MINUTE MORNING ROUTINE
  1. Open https://avastudio.summitvoiceai.com  (pw: summit2026)
     NOTE: this is the CEO dashboard. dashboard.summitvoiceai.com is the
     separate Knowledge Dashboard.
  2. BRIEF tab - hot leads at top (80+ scores show "HIGH VALUE" badge)
  3. Click "Build Demo Site" for any positive reply that lacks a demo
  4. Check calendar. Done.

COMMANDS (POST to Railway /dispatch, or via GHL workflow webhooks)
  {"command":"demo","url":"...","company":"...","contact_id":"..."}
      -> full 10-step demo in ~9 min, delivered by email+SMS
      -> add "deliver":false to build silently (attaches URL to contact only)
  {"command":"audit","url":"...","company":"..."}   -> Sonnet marketing audit
  {"command":"status"}                              -> system health
  {"command":"scrape","city":"..."}                 -> scraper info (runs locally)
  Endpoint: https://ava-studio-api-production.up.railway.app/dispatch

GHL PIPELINE FLOW
  Contacted -> Replied -> Interested -> Audit Requested -> Demo Sent
  -> Meeting Booked -> Meeting Held -> Proposal Sent -> Won -> Client

AUTOMATED TRIGGERS (workflow_ai_agent_prompts_v2.txt - paste into GHL)
  "audit requested" tag    -> demo machine builds + delivers (~9 min)
  Appointment confirmed    -> pre-meeting brief emailed to Dan (WF7, incl.
                              objection reframes keyed to the $9,500 math)
  Appointment showed       -> post-call follow-up in 30 min (WF8)
  7 days silent            -> stale-deal nudge (WF9)
  "segment_b" / no website -> homepage built automatically (WF6)

LEAD SCORING (runs inside daily_outreach.py)
  Base 50. +20 if >100 reviews / +15 if <10 reviews / +25 if NO website /
  +10 if email found / +5 if 4.5+ stars with 20+ reviews.
  -10 if >500 reviews / -20 if franchise.
  80+ = "Hot Prospect 80+" tag + automatic silent demo build.
  Score stored on GHL contact field lead_score; shown on dashboard.

MODEL ROUTING (cost policy - see COST_ANALYSIS.md)
  Extraction/personalization -> claude-haiku-4-5
  Customer-facing audits + weekly content -> claude-sonnet-4-6
  Anthropic spend: ~$6-12/month at current volume.

COST BREAKDOWN (monthly)
  Apollo $99 | Railway ~$5-20 | Vercel free | Anthropic ~$6-12 |
  Firecrawl free tier | Apify ~$5-15  => TOTAL ~$120-150/mo vs $4,466 MRR

DEPLOY PROCEDURES
  Railway API:   railway up --detach   (from this folder; verify /health)
  Dashboard:     cd vercel_deploy && vercel --prod --yes --token <VERCEL_TOKEN>
                 (vercel_deploy\index.html is the LIVE dashboard = summit_os_v8)
  GitHub:        branch "summit-os" on github.com/Dgill757/SMGWebsite
                 (main holds the marketing website - do NOT force-push over it)

WHAT'S NEEDED TO COMPLETE SETUP (see BLOCKERS.txt + MISSING_INTEGRATIONS.txt)
  1. Anthropic credits ($20-50 + auto-reload)  -> unblocks demo machine TODAY
  2. ROTATE the GHL private token (it was publicly exposed on the dashboard
     until this session -- regenerate in GHL -> Private Integrations, then
     update .env, outreach\.env, Railway, and scripts\)
  3. Supabase RLS policies (do with Claude, ~30 min)
  4. Slack webhook (playwright_slack_setup.py, 15 min)
  5. Paste workflow_ai_agent_prompts_v2.txt into GHL workflows (10 min)
  6. Thinker Learn Session (voice_ai_automation_v2.py, 15 min)

REVENUE PATH
  Current: $4,466 MRR (9 clients)
  $25K MRR: ~51 clients at $497 or ~31 at $797
  $50K MRR: ~101 at $497 or ~63 at $797
  At 2 new clients/week: $25K in ~21 weeks, $50K in ~42 weeks.
  Accelerators: RVM drops to the 315K CRM list, higher demo volume
  (fix credits!), pre-meeting briefs to lift close rate.
