# ════════════════════════════════════════════════════════════════════════════
# SUMMIT OS — DEFINITIVE AGENT FLEET + SYSTEM BRIEF
# THE COMPLETE AUTONOMOUS BUSINESS OPERATING SYSTEM
# Version 3.0 — Incorporates ALL sessions, ALL files, ALL guides
#
# PASTE THIS INTO VS CODE CLAUDE CODE — READ EVERY FILE FIRST THEN EXECUTE
# ════════════════════════════════════════════════════════════════════════════

## READ THESE FILES IN ORDER BEFORE DOING ANYTHING:
# 1. THE_MASTER_GUIDE.md
# 2. CLAUDE_md_for_antigravity.md (or CLAUDE.md)
# 3. EVERYTHING_DONE.txt / SYSTEM_LIVE.txt
# 4. .env (what keys are present?)
# 5. workflow_ai_agent_prompts.txt
# 6. DEFINITIVE_FINAL_PROMPT.md (all 15 workflow specs)
# 7. SummitVoiceAI_Sales_Playbook.pdf (business intelligence)
# 8. AI_Content_Marketing_System_Guide.docx (4-MCP content system)
# 9. roofez-clone.html (THIS IS THE QUALITY STANDARD FOR DEMO WEBSITES)
# 10. roofing-complete-master-guide.html (cinematic builder system + section prompts)

## CRITICAL CONTEXT FROM UPLOADED FILES:

### WEBSITE QUALITY STANDARD (roofez-clone.html):
# Barlow Condensed + Barlow fonts. Navy #0D1F3C, Orange #F7941D.
# Top bar with phone + CTA. Sticky nav with dropdown menus.
# Full-screen hero with parallax overlay, eyebrow badge, condensed H1, pills.
# Animated pulse phone button. Service tabs with content switching.
# Who We Serve grid with hover lift. Cities/service area grid.
# About section with floating badge. Reviews grid (navy/light bg).
# Orange CTA strip. 4-column footer. Fully responsive.
# → Every demo we build must look like THIS. Professional. Real company quality.

### CINEMATIC BUILDER SYSTEM (from master guide):
# Hard rules for demo sites:
# - NO placeholder text anywhere — real content everywhere
# - Storm damage insurance section on all demo sites
# - Sticky mobile CTA bar (phone + free inspection)
# - Instant quote calculator
# - Service tabs
# - Cities/service area grid
# - Before/after project gallery
# - 5-star reviews section

### SALES PLAYBOOK INTELLIGENCE:
# ROI Math: $9,500 avg job × 1,095-1,825 missed calls/yr = $1.56M-$8.67M recoverable
# Breakeven: 1 recovered job at entry price
# Target segments: Storm/Insurance (#1), Emergency Repair (#2), Residential Re-Roofing (#3)
# 3-tier offer: $1,497+$497/mo | $2,997+$797/mo | $4,997+$997/mo
# Top objection reframes memorized and available as skill

### CONTENT SYSTEM (AI_Content_Marketing_System_Guide.docx):
# 4 MCPs: Buffer + Higgsfield + Meta Ads + ScrapeCreators (Ad Library)
# Buffer: $6/mo/channel — schedules to X, LinkedIn, Facebook, Instagram, Threads
# Higgsfield: $10-20/mo — AI image + video generation (30+ models)
# ScrapeCreators: $20/mo — Facebook Ad Library competitor research
# Meta Ads MCP: Campaign build from Claude Desktop
# Total cost: $86-96/month for complete content marketing operation
# → This system is LIVE via Claude Desktop MCPs (not Railway scripts)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE 20-AGENT FLEET — COMPLETE EMPLOYEE ROSTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TIER 0 — ORCHESTRATOR (manages and monitors all other agents):
  Agent 0: SUMMIT ORCHESTRATOR
  → Runs in Railway as background process
  → Monitors all 19 agents for health, failures, missed runs
  → Self-healing: retries failed jobs, alerts Dan if something needs attention
  → Posts system health to Slack #ava-ops every 4 hours
  → Dashboard heartbeat: updates /health every 60 seconds

TIER 1 — OUTREACH & LEAD GEN (daily automated revenue engine):
  Agent 1: APOLLO SCOUT (daily_outreach.py, 6am)
    → Apollo Professional: 47-100 new roofing owner leads daily
    → Rotating 365 US cities — city 26 now
    → Enriches: name, email, phone, company, website, city, state, LinkedIn
    → Tags by segment A-E in GHL automatically
    → Posts batch stats to Railway

  Agent 2: OUTREACH MANAGER (ghl_daily_outreach.py, Mon-Fri 9am)
    → 100 personalized emails + 100 SMS per day
    → Segment-specific messaging (different templates A/B/C/D/E)
    → Tracks: opens, clicks, replies per segment
    → Never contacts: opted out, not interested, active client

  Agent 3: REPLY CLASSIFIER (ghl_reply_monitor.py, every 15min)
    → Polls GHL for all new replies
    → GHL AI Intent Detection: positive/negative/nurture/unclear
    → Positive → tags "Replied - Hot Lead" → real-time dashboard alert
    → Auto-triggers demo build workflow via "audit requested" tag
    → Posts to Supabase hot_leads table

  Agent 4: FOLLOW-UP SPECIALIST (ghl_followup.py, Mon-Fri 9:15am)
    → Day 3/7/14 sequences from outreach_tracker.db
    → RVM drops on Day 3 non-responders (via Slybroadcast API integration)
    → Re-engagement for email openers who didn't reply (GHL open tracking)

TIER 2 — DEMO MACHINE (revenue conversion engine):
  Agent 5: DEMO BUILDER (Railway API, auto-triggered)
    → Triggered by "audit requested" tag in GHL
    → 10-step pipeline: Firecrawl → brand extract → GitHub template clone
    → Template: clones Dan's ACTUAL GitHub repos (Roofing-Template2 etc)
    → Barlow Condensed font, navy/orange scheme, full cinematic quality
    → HARD RULES: no placeholder text, storm section, mobile CTA bar, tabs
    → Deploys to summit-demo-[slug].vercel.app
    → Creates Thinker voice agent (Marissa/Susan)
    → GHL contact updated: demo_url, voice_agent_key fields
    → Email + SMS delivery with demo link
    STATUS: DEPLOYED — needs template_cloner_FIXED.py swap + GITHUB_TOKEN

  Agent 6: MARKETING AUDITOR (part of demo pipeline)
    → 450-word personalized audit per prospect
    → Scores: Call Capture, Speed-to-Lead, Review Velocity, Website Conversion
    → Revenue at risk calculation: $1.56M-$8.67M formula
    → Top 3 revenue leaks specific to their business
    → 90-day fix plan
    → Delivered with every demo

  Agent 7: VOICE AI CREATOR (voice_ai_automation_v2.py, Playwright)
    → Logs into THINKRR.ai automatically
    → Creates named agent with Marissa voice (Susan fallback)
    → Trains on deployed demo URL
    → Extracts widget key → injects into homepage
    STATUS: Needs Thinker Learn Session (15 min one-time)

TIER 3 — CLIENT SUCCESS (delivery and retention):
  Agent 8: ONBOARDING MANAGER (GHL Workflow 11)
    → Fires automatically when opportunity stage = Won
    → Day 1: welcome email + onboarding checklist
    → Day 2: Ava setup confirmation
    → Day 7: Week 1 report with calls answered, bookings, reviews
    → Creates Asana/task for Dan if manual setup needed

  Agent 9: CLIENT ACCOUNT MANAGER (Railway scheduled, weekly)
    → Pulls client data from Supabase (active clients table)
    → Generates weekly performance report per client
    → Emails client: calls answered, bookings made, reviews requested
    → Flags any client with declining engagement (churn risk)
    → Sends Dan churn risk alerts via Slack

  Agent 10: REVIEW ACCELERATOR (GHL automation)
    → After every job completion (triggered by GHL stage change)
    → 3-touch SMS review request sequence
    → Tracks review count growth per client
    → Reports: stars added this month per client

TIER 4 — CONTENT & MARKETING:
  Agent 11: CONTENT CREATOR (content_generator.py, Monday 7am)
    → Generates: LinkedIn, Facebook, Instagram, Twitter x2, TikTok script
    → Rotates 5 content pillars weekly
    → Hormozi voice, specific stats, no em dashes
    → Saves to vault + Slack preview

  Agent 12: SOCIAL PUBLISHER (social_media_automation.py)
    → Posts to all platforms on schedule
    → LinkedIn: Wednesday 8am via LinkedIn API
    → Facebook: Tuesday 9am via Meta Graph API
    → Instagram: Tuesday 11am via Meta Graph API
    → Twitter: immediately when content is generated
    → GHL Social Planner: backup scheduling
    → Tracks engagement: reports best-performing post weekly

  Agent 13: HEYGEN AVATAR (heygen_agent.py — NEW)
    → Takes Monday's TikTok script
    → Generates 60-90 second AI avatar video via HeyGen API
    → $1/minute — ~$1 per TikTok video
    → Saves to vault CONTENT/VIDEOS/[date]/
    → Can also generate: client testimonial videos, case study videos
    STATUS: Needs HEYGEN_API_KEY

  Agent 14: AD INTELLIGENCE (Claude Desktop — ScrapeCreators MCP)
    → Weekly competitor ad scraping via Facebook Ad Library
    → Finds: who's running ads, ad copy, offers, targeting
    → Generates counter-messaging for Summit Voice AI campaigns
    → Runs via Claude Desktop (not Railway — MCP-based)

TIER 5 — INTELLIGENCE & RESEARCH:
  Agent 15: RESEARCH ANALYST (research_agent.py, Tue/Thu 6:30am)
    → Voice AI news + roofing industry trends
    → Reddit roofing discussions — buying signals
    → Competitor website monitoring
    → Synthesized intel brief → vault + Slack

  Agent 16: MORNING BRIEF (Railway, daily 7am)
    → Pipeline snapshot + hot leads
    → Demos built yesterday + calls booked
    → MRR update + revenue forecast
    → Top 3 actions for today
    → Delivered to Slack #ava-dispatch

  Agent 17: CEO WEEKLY REPORT (Railway, Sunday 8pm)
    → Pulls: outreach sent, replies, demos, calls, closed, MRR
    → Runs Sales Playbook CEO Report Prompt analysis
    → Identifies biggest pipeline leak
    → Recommends single action for biggest MRR impact this week
    → Email to dangill@summitmarketinggroup.co

TIER 6 — OPERATIONS & SELF-MANAGEMENT:
  Agent 18: VAULT KEEPER (Obsidian + Claude Code, nightly)
    → Runs at midnight via Claude Routines (or local cron)
    → Compacts and indexes vault entries
    → Archives raw notes to wiki articles
    → Cross-references competitor intelligence with content calendar
    → Reconciles contradictions in knowledge base
    → Rebuilds _index.md

  Agent 19: SYSTEM WATCHDOG (Railway background process)
    → Monitors all agent heartbeats
    → Detects: script failures, API errors, Railway down, GHL webhook failures
    → Self-healing: retries on failure, queues for later if API unavailable
    → Posts to Slack #ava-ops: "⚠️ AGENT 3 MISSED RUN — retrying" or "✅ All agents healthy"
    → Dashboard shows live health indicators for all 20 agents

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTE THESE TASKS IN ORDER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

────────────────────────────────────────────────────────────────────────────
TASK 1: FIX THE DEMO WEBSITE QUALITY — CRITICAL
────────────────────────────────────────────────────────────────────────────

The current demo builder generates mediocre HTML. We have roofez-clone.html
as the quality standard. Every demo must match this quality level.

Step 1: Read roofez-clone.html completely and extract:
  - Full CSS (save to: demo_quality_css_reference.txt)
  - Layout structure
  - Font choices (Barlow Condensed, Barlow)
  - Color scheme (navy #0D1F3C, orange #F7941D)
  - All sections: top-bar, nav with dropdowns, hero, services tabs, who-grid,
    cities grid, about with badge, reviews grid, CTA strip, 4-col footer,
    floating phone button

Step 2: Read roofing-complete-master-guide.html and extract:
  - Cinematic Builder System sections
  - Hard rules for every demo
  - Section build prompts (sticky mobile bar, storm damage section,
    instant quote calculator, before/after gallery)

Step 3: Upgrade template_cloner_FIXED.py with the RoofEZ quality standard:

The new premium_homepage_generator function must produce a homepage that:
  ✓ Uses Barlow Condensed + Barlow fonts (import from Google Fonts)
  ✓ Navy #0D1F3C + Orange #F7941D color scheme (or brand colors if extracted)
  ✓ Has a top bar with phone number and "Free Estimate" CTA button
  ✓ Has sticky nav with dropdown menus (About, Services, Reviews, Contact)
  ✓ Has full-screen hero with: eyebrow badge, Barlow Condensed H1, 
    hero divider, sub-text, primary + outline CTAs, service pills,
    floating stat badges
  ✓ Has tabbed services section (Roof Replacement, Storm Damage, Gutters,
    Metal Roofing, Emergency, New Construction)
  ✓ Has "Who We Serve" section (residential, commercial, storm, new construction)
  ✓ Has service area cities grid (based on company's actual city + nearby)
  ✓ Has about section with floating "X+ Years" badge
  ✓ Has 3-card reviews section
  ✓ Has orange CTA strip ("Ready to stop missing calls?")
  ✓ Has 4-column footer with logo, services links, hours, contact info
  ✓ Has fixed pulsing phone button (bottom right)
  ✓ Has sticky mobile CTA bar (bottom, phone + free inspection)
  ✓ Has storm damage + insurance claim section
  ✓ Voice widget injected with "Talk to Ava" label
  ✓ NO placeholder text anywhere — all real company-specific content
  ✓ All company info replaced: name, phone, city, services, years, reviews

Save the upgraded template_cloner_FIXED.py to this folder AND to Railway.

Step 4: Test it:
```bash
curl -X POST https://ava-studio-api-production.up.railway.app/demos/create \
  -H "Content-Type: application/json" \
  -d '{"website_url":"https://www.johnstonroofingcompany.com","client_name":"Johnston Roofing","send_delivery":false}'
```
Poll until done. Open the URL. 
Does it look like roofez-clone.html quality? YES/NO.
If YES: Website quality issue is FIXED.
If NO: Iterate on the generator until the quality matches.

Write DEMO_QUALITY_TEST.txt with the demo URL and a YES/NO quality verdict.

────────────────────────────────────────────────────────────────────────────
TASK 2: BUILD THE SUMMIT OS DASHBOARD (FINAL VERSION)
────────────────────────────────────────────────────────────────────────────

The dashboard at summit_os.html needs to be upgraded to show all 20 agents.
Build a new version that is dramatically better than what exists.

Requirements for the final dashboard:
  
SECTION A — AGENT FLEET STATUS:
  Show all 20 agents in a grid:
  - Agent name, role, tier
  - Status indicator: ● RUNNING / ○ IDLE / ⚠ ERROR / ↻ RETRYING
  - Last run time + next scheduled run
  - Today's output count (leads scraped, emails sent, demos built, etc.)
  - Click to view agent's latest output or trigger it manually

SECTION B — LIVE METRICS (top of page, always visible):
  - Daily leads scraped: [N] in [city]
  - Emails + SMS sent today: [N]
  - Hot leads right now: [N] (red if > 0)
  - Demos live: [N]
  - Calls booked today: [N]
  - MRR: $[N] of $100K goal ([%] progress bar)

SECTION C — SKILL RUNNER (center area):
  - All 64 skills organized by domain with skill buttons
  - Prompt input area with RUN button
  - Output display area (shows agent output in real-time)
  - Recent runs history (last 10)

SECTION D — PIPELINE FLOW:
  - Visual pipeline: Contacted → Replied → Interested → Demo Sent → Booked → Won
  - Count at each stage
  - Click any stage to see contacts in it

SECTION E — VAULT PULSE (right panel):
  - Recent vault activity (files created/updated)
  - Research agent last brief preview
  - Competitor intel summary
  - Content calendar for this week

SECTION F — REVENUE TRACKER:
  - Current MRR: $4,466
  - Target: $100,000
  - Progress bar with milestone markers ($25K, $50K, $75K, $100K)
  - Clients by tier (Tier 1/2/3 count and MRR)
  - New MRR this week
  - Revenue forecast (when do we hit $25K/$50K/$100K at current pace?)

PASSWORD: summit2026
API: https://ava-studio-api-production.up.railway.app

Build this as a single HTML file: summit_os_v3.html
Deploy to Vercel: vercel --prod (use index.html copy)

────────────────────────────────────────────────────────────────────────────
TASK 3: BUILD THE 3 MISSING AGENTS
────────────────────────────────────────────────────────────────────────────

Build these 3 new Python files:

A) heygen_agent.py — AI Avatar Video Generator
   
   Takes TikTok script from content generator output.
   Calls HeyGen API v2 to generate 60-90 second avatar video.
   Uses avatar_id from HEYGEN_AVATAR_ID env var (or default stock avatar).
   Polls until complete (max 10 minutes).
   Downloads video to vault: SummitVault/CONTENT/VIDEOS/[date]/tiktok_[date].mp4
   Sends Slack notification with video URL.
   Add to Task Scheduler: Monday 7:30am (after content_generator.py).

   Environment variables needed:
   HEYGEN_API_KEY=[get from heygen.com → Settings → API]
   HEYGEN_AVATAR_ID=[optional — default to stock avatar]
   HEYGEN_VOICE_ID=[optional — default to English male professional]

   Cost note: ~$1 per 60-second video. Add to .env file instructions.

B) ceo_weekly_report.py — Sunday CEO Report

   Runs every Sunday at 8pm.
   Pulls from Supabase: 
     - outreach_runs: emails_sent, sms_sent, city scraped (last 7 days)
     - hot_leads: positive replies this week
     - ghl_activity: demos_built, calls_booked
     - clients table (if exists): MRR, new clients
   
   Uses Sales Playbook CEO Report prompt:
   "Here are my numbers this week... Analyse my pipeline. Tell me where I'm 
   leaking money and what to focus on next week."
   
   Target benchmarks from Sales Playbook:
   - Outreach → Reply rate: 3-8% healthy, below 2% = fix opening line
   - Reply → Call booked: 20-40% healthy
   - Call → Demo shown: 70%+ healthy  
   - Demo → Proposal: 60%+ healthy
   - Proposal → Signed: 30-50% healthy
   
   Outputs formatted email to dangill@summitmarketinggroup.co
   Also posts summary to Slack #ava-dispatch
   Saves full report to: SummitVault/ANALYTICS/WEEKLY/[date]-ceo-report.md

C) system_watchdog.py — Self-Healing Monitor

   Runs as continuous background process on Railway (separate Procfile worker).
   Polls every 5 minutes.
   
   Checks:
   - Railway API /health endpoint (self-check)
   - Supabase: last scraper_run timestamp (should be today if Mon-Fri)
   - Supabase: last outreach_run timestamp (should be today if Mon-Fri)
   - Supabase: last hot_leads check (should be within 20 min)
   - GHL API: simple contact count check (validates token)
   - Vercel dashboard URL: HTTP 200?
   
   Self-healing actions:
   - If scraper missed today (after 6:30am weekday): POST to Slack + log
   - If outreach missed today (after 9:30am weekday): POST to Slack + log
   - If Railway has been down > 5 min: immediate Slack alert
   - If GHL token invalid: immediate Slack alert with fix instructions
   
   Posts to Slack #ava-ops (different from #ava-dispatch):
   - Every 4 hours: ✅ All 20 agents healthy
   - Immediately on any issue: ⚠️ [agent name] needs attention — [reason]
   
   Dashboard heartbeat: POST to /health/agents with agent statuses every 60s

Add system_watchdog.py to Procfile:
```
web: uvicorn ava_demo_studio_COMPLETE_API:app --host 0.0.0.0 --port $PORT
worker: python system_watchdog.py
```

────────────────────────────────────────────────────────────────────────────
TASK 4: UPGRADE THE OBSIDIAN VAULT WITH FULL INTELLIGENCE
────────────────────────────────────────────────────────────────────────────

The vault needs to be the complete business brain. Set up now.

1. Run setup_vault.ps1:
```powershell
.\setup_vault.ps1
```

2. Copy CLAUDE.md (renamed from SUMMIT_VAULT_CLAUDE.md):
```powershell
Copy-Item "SUMMIT_VAULT_CLAUDE.md" "C:\Users\DanGi\SummitVault\CLAUDE.md" -Force
```

3. Copy the Sales Playbook intelligence to vault:
```powershell
$target = "C:\Users\DanGi\SummitVault\WIKI\PLAYBOOKS"
New-Item -ItemType Directory -Force -Path $target | Out-Null
```
Extract from SummitVoiceAI_Sales_Playbook.pdf and save as:
SummitVault/WIKI/PLAYBOOKS/SALES_PLAYBOOK.md

Include all:
- Market intelligence table (pain points → costs → Ava's answer)
- All key numbers (67%, $9,500, 74%, etc.)
- 7 AI prompts (niche domination, offer builder, objection destroyer, etc.)
- 3-tier pricing ($497/$797/$997)
- Objection reframes (memorized)
- 30-day sprint calendar
- CEO report benchmarks

4. Extract from AI_Content_Marketing_System_Guide.docx and save as:
SummitVault/WIKI/PLAYBOOKS/CONTENT_MARKETING_GUIDE.md

5. Create: SummitVault/WIKI/TECH/SYSTEM_ARCHITECTURE.md
   Document the full 20-agent architecture, what each does, when it runs,
   what inputs/outputs it has.

6. Update CLAUDE.md in vault to include:
   - All 20 agents and their purposes
   - Sales playbook stats (so every Claude session has them)
   - Website quality standard reference (roofez-clone.html style = Barlow Condensed, navy/orange)
   - Content marketing system (4 MCPs, Buffer + Higgsfield + Meta + ScrapeCreators)

────────────────────────────────────────────────────────────────────────────
TASK 5: FIX ALL 15 GHL WORKFLOWS TO PRODUCTION QUALITY
────────────────────────────────────────────────────────────────────────────

Using GHL MCP, audit every workflow:

For each of the 15 workflows:
1. Check if Published (Active) vs Draft
2. Check if trigger is correct
3. Check if all actions are present
4. Check if AI agent prompts are the versions from workflow_ai_agent_prompts.txt

If any workflow is Draft or empty → rebuild from DEFINITIVE_FINAL_PROMPT.md

Upgrade Workflow 2 (SVA Main Outreach — Segment A) with Sales Playbook messaging:
Current Day 0 email is OK. Upgrade to use:
- Subject line personalization: "[First name], are you losing storm calls in [City]?"
- Day 3 SMS: reference specific pain (storm season, after-hours)
- Day 7 email: social proof angle ("a roofer in [nearby city]...")
- Day 14: permission-based close ("last message from me...")

Add Workflow 16 NEW — SVA Segment B Storm Surge:
Trigger: Tag Added = "segment_c" (companies running ads = spending money)
Actions:
1. AI Agent: Research the contact's Google Ads presence and current ad copy
2. Write personalized email: "Saw your ad in [city]..." angle
3. Different value prop: they're already spending on ads, Ava captures the leads
   that ads bring in but nobody answers
4. SMS follow-up 24 hours later

Add Workflow 17 NEW — SVA Direct Mail Trigger:
Trigger: Tag Added = "direct_mail_target"
Actions:
1. Custom Webhook → Railway /dispatch → command: "direct_mail"
2. Railway generates PostGrid API call with prospect info
3. Postcard printed + mailed to company address
4. GHL contact tagged "mail_sent" with date
5. Follow-up sequence: email Day 7 after mail is sent

Report: final workflow count, published vs draft.

────────────────────────────────────────────────────────────────────────────
TASK 6: SET UP CLAUDE DESKTOP MCP CONTENT SYSTEM
────────────────────────────────────────────────────────────────────────────

The AI_Content_Marketing_System_Guide.docx describes a 4-MCP Claude Desktop
system. This runs SEPARATELY from Railway (on Dan's laptop in Claude Desktop).

Create: CLAUDE_DESKTOP_SETUP.md in this folder with these exact steps:

1. Install Claude Desktop: claude.ai/download
2. Install Node.js LTS: nodejs.org

3. Get API tokens:
   - Buffer: buffer.com → publish.buffer.com/settings/api → create token
   - Higgsfield: higgsfield.ai → create account → get MCP URL
   - ScrapeCreators: scrapecreators.com → sign up → copy API key
   - Meta Ads: claude.ai settings → Connectors → Meta Ads → Connect

4. Create config file at: %APPDATA%\Claude\claude_desktop_config.json

Write the EXACT config with all 4 MCPs:
```json
{
  "mcpServers": {
    "buffer": {
      "command": "npx",
      "args": ["-y", "@buffer/mcp-server"],
      "env": {
        "BUFFER_API_TOKEN": "[BUFFER_TOKEN_FROM_STEP_3]"
      }
    },
    "higgsfield": {
      "type": "url",
      "url": "https://mcp.higgsfield.ai/mcp",
      "name": "Higgsfield"
    },
    "scrapecreators-adlibrary": {
      "command": "npx",
      "args": ["-y", "@scrapecreators/facebook-ad-library"],
      "env": {
        "SCRAPECREATORS_API_KEY": "[SCRAPECREATORS_KEY_FROM_STEP_3]"
      }
    }
  }
}
```
Note: Meta Ads MCP is added via Claude Desktop Settings → Connectors → Meta Ads

5. IMPORTANT: Fully quit and relaunch Claude Desktop (not just close window)
6. Verify: New chat in Claude Desktop → you should see Buffer, Higgsfield,
   Meta Ads, Ad Library tools available

Write the 5 master Claude Desktop prompts from the guide:

PROMPT 1 — COMPETITOR RESEARCH:
"Use the Facebook Ad Library to find all roofing companies running Facebook ads
in [city]. For each: screenshot the ad, extract: company name, offer, hook,
CTA. Identify the most common angles. Tell me what they're NOT saying that
Summit Voice AI could own."

PROMPT 2 — WEEKLY CONTENT GENERATION + SCHEDULING:
"Generate this week's Summit Voice AI social content. Pillar: [auto-rotate].
Use Higgsfield to generate 1 image per platform. Use Buffer to schedule:
Facebook Tuesday 9am, Instagram Tuesday 11am, LinkedIn Wednesday 8am,
Twitter immediately. Dan's voice: former roofer, Hormozi-style, specific stats,
no em dashes. CTA: calendly.com/aivoice/call"

PROMPT 3 — AD CAMPAIGN BUILD:
"Use Meta Ads MCP to build a new Facebook/Instagram campaign for Summit Voice AI.
Audience: roofing contractors and business owners in [city].
Budget: $10/day. Objective: Lead Generation.
Creative: [paste HeyGen video URL or Higgsfield image].
Copy: [use Sales Playbook 15-second hook].
Landing page: summitvoiceai.com"

PROMPT 4 — CONTENT REPURPOSING:
"Take this week's LinkedIn post [paste it] and repurpose it into:
- 3 Twitter posts (under 240 chars each)
- 1 Instagram caption with 5 hashtags
- 1 TikTok script (45-75 seconds)
Use Higgsfield to generate a supporting image. Schedule all via Buffer."

PROMPT 5 — MONTHLY PERFORMANCE REVIEW:
"Pull last month's performance from Buffer (engagement data).
Which post performed best on each platform?
What topic/angle got the most engagement?
Generate 4 variations of the top-performing post.
Schedule them to run twice next month via Buffer."

────────────────────────────────────────────────────────────────────────────
TASK 7: CLIENT FULFILLMENT SYSTEM
────────────────────────────────────────────────────────────────────────────

Summit Voice AI has 9 active clients. Build their management system.

Create: supabase_clients_schema.sql

Table: clients
  id, ghl_contact_id, company_name, phone, email, tier (1/2/3),
  mrr, setup_date, ava_agent_id, widget_key, website_url, demo_url,
  thinker_url, status (onboarding/active/at-risk/churned),
  calls_answered_total, bookings_made_total, reviews_requested_total,
  last_report_sent, notes

Run in Supabase SQL Editor.

Create: client_manager.py
  → Runs weekly (Sunday 7pm, before CEO report)
  → Pulls client data from Supabase
  → For each active client:
    - Pulls their Ava call stats from Thinker API (if available)
    - Generates weekly performance summary (calls answered, bookings, reviews)
    - Creates personalized weekly email: "Week in Review — [company]"
    - Flags at-risk clients (declining stats, 2+ weeks of low usage)
    - Alerts Dan to at-risk clients via Slack with recommended action
  → Posts aggregate stats to dashboard (/ingest/client-stats)
  → Saves each client report to: SummitVault/CLIENTS/ACTIVE/[company]/[date]-report.md

This makes Dan look like a 10-person team to his clients.

────────────────────────────────────────────────────────────────────────────
TASK 8: SLYBROADCAST RVM INTEGRATION (Add This Channel)
────────────────────────────────────────────────────────────────────────────

The Sales Playbook identifies ringless voicemail drops as a major untapped channel.
Response rate: 3-8% callback. Cost: $0.05-0.09/drop. 500-1,000/day capacity.

Create: rvm_agent.py

Pre-recorded voicemail script (30 seconds):
"Hey [Name], Dan here with Summit Voice AI — sent you a message last week.
I help roofing companies answer every call they miss on the job.
If that's ever a thing for you, call me back at [GHL NUMBER].
Takes 10 minutes to show you what it does. Have a great day."

Logic:
  → Runs Mon-Fri at 10:30am (after outreach batch)
  → Pulls contacts from GHL who: received Day-0 email, no reply, 3 days ago
  → Drops RVM via Slybroadcast API to max 200 contacts/day
  → Tags contacts in GHL: "rvm_sent"
  → Logs to outreach_tracker.db

Environment variables:
SLYBROADCAST_USER=[slybroadcast.com account email]
SLYBROADCAST_PASS=[slybroadcast.com password]
SLYBROADCAST_CAMPAIGN_ID=[pre-recorded voicemail campaign ID]
GHL_FORWARD_NUMBER=[the GHL number Dan uses for outreach]

Slybroadcast API docs:
POST https://www.mobile-sphere.com/gateway/vmb.php
  c_uid=[user], c_password=[pass], c_phone=[number], c_record_audio=[campaign_id]

Add to Task Scheduler: Mon-Fri 10:30am

────────────────────────────────────────────────────────────────────────────
TASK 9: DEPLOY EVERYTHING AND FINAL STATUS REPORT
────────────────────────────────────────────────────────────────────────────

1. Deploy upgraded Railway (with new template_cloner, watchdog, client manager):
```bash
railway up
```

2. Deploy upgraded Vercel dashboard (summit_os_v3.html):
```bash
cp summit_os_v3.html index.html
vercel --prod
```

3. Copy new scripts to Dan's machine:
```powershell
$dest = "C:\Users\DanGi\scripts"
Copy-Item "heygen_agent.py" "$dest\heygen_agent.py" -Force
Copy-Item "ceo_weekly_report.py" "$dest\ceo_weekly_report.py" -Force
Copy-Item "rvm_agent.py" "$dest\rvm_agent.py" -Force
Copy-Item "client_manager.py" "$dest\client_manager.py" -Force
```

4. Add Task Scheduler entries:
```powershell
# HeyGen avatar video (Monday 7:30am)
$a = New-ScheduledTaskAction -Execute "python" -Argument "C:\Users\DanGi\scripts\heygen_agent.py"
$t = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At "7:30AM"
Register-ScheduledTask "Summit HeyGen Avatar" -Action $a -Trigger $t -Force

# RVM drops (Mon-Fri 10:30am)
$a = New-ScheduledTaskAction -Execute "python" -Argument "C:\Users\DanGi\scripts\rvm_agent.py"
$t = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Mon,Tue,Wed,Thu,Fri -At "10:30AM"
Register-ScheduledTask "Summit RVM Drops" -Action $a -Trigger $t -Force

# CEO Report (Sunday 8pm)
$a = New-ScheduledTaskAction -Execute "python" -Argument "C:\Users\DanGi\scripts\ceo_weekly_report.py"
$t = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At "8:00PM"
Register-ScheduledTask "Summit CEO Report" -Action $a -Trigger $t -Force

# Client Manager (Sunday 7pm)
$a = New-ScheduledTaskAction -Execute "python" -Argument "C:\Users\DanGi\scripts\client_manager.py"
$t = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At "7:00PM"
Register-ScheduledTask "Summit Client Manager" -Action $a -Trigger $t -Force
```

5. Final test: run demo quality test, verify dashboard shows 20 agents,
   verify Slack receives message from /status command.

6. Write: SUMMIT_OS_COMPLETE.txt

```
SUMMIT OS — ALL 20 AGENTS OPERATIONAL
Date: [timestamp]

CORE INFRASTRUCTURE:
✓/✗ Railway API live: [URL]
✓/✗ Dashboard live: [URL] (password: summit2026)
✓/✗ Supabase connected
✓/✗ GHL connected (315K contacts)
✓/✗ Obsidian vault: C:\Users\DanGi\SummitVault

DEMO WEBSITE QUALITY:
✓/✗ Template uses roofez-clone.html standard (Barlow fonts, navy/orange, full sections)
✓/✗ GITHUB_TOKEN added to Railway
✓/✗ Test demo URL: [URL] — Quality: PASS/FAIL

ACTIVE AGENTS (running without you):
Agent 1: Apollo Scout ✓/✗ — [last run / next run]
Agent 2: Outreach Manager ✓/✗
Agent 3: Reply Classifier ✓/✗
Agent 4: Follow-Up Specialist ✓/✗
Agent 5: Demo Builder ✓/✗
Agent 6: Marketing Auditor ✓/✗
Agent 7: Voice AI Creator ✓/✗ (needs Thinker Learn Session)
Agent 8: Onboarding Manager ✓/✗
Agent 9: Client Account Manager ✓/✗
Agent 10: Review Accelerator ✓/✗
Agent 11: Content Creator ✓/✗
Agent 12: Social Publisher ✓/✗
Agent 13: HeyGen Avatar ✓/✗ (needs HEYGEN_API_KEY)
Agent 14: Ad Intelligence ✓/✗ (Claude Desktop MCPs — see CLAUDE_DESKTOP_SETUP.md)
Agent 15: Research Analyst ✓/✗
Agent 16: Morning Brief ✓/✗
Agent 17: CEO Weekly Report ✓/✗
Agent 18: Vault Keeper ✓/✗ (needs Obsidian + Claude Routines)
Agent 19: System Watchdog ✓/✗
Agent 20 (Orchestrator): ✓/✗

GHL WORKFLOWS: [X]/17 published

WHAT DAN STILL NEEDS TO DO (copy this list):
Time estimate: [X] minutes total
1. [Item] — [time] — [file for instructions]
...

DAN'S DAILY ROUTINE:
Morning: Check Slack #ava-dispatch (7am brief is there)
          Open dashboard.summitvoiceai.com
          Any hot leads? → they've already been replied to automatically
          Any calls booked? → pre-meeting brief is in your email
Shows up to the meeting. Closes the deal.
```

════════════════════════════════════════════════════════════════════════════
DAN'S ONLY REMAINING MANUAL ITEMS (after this session):
════════════════════════════════════════════════════════════════════════════

After Claude Code executes the tasks above, here are the ONLY things
Dan ever has to do manually (one-time setup):

1. GHL — Publish any remaining draft workflows (10 min, GHL UI)
2. GHL — Paste AI agent prompts into 6 workflows (10 min, workflow_ai_agent_prompts.txt)
3. Slack app setup (10 min, SLACK_SETUP_STEPS.txt)
4. Thinker Learn Session (15 min, THINKER_LEARN_SESSION.md) — lets Agent 7 run
5. DNS CNAME record (5 min, DNS_RECORDS_FINAL.txt)
6. Claude Desktop MCPs (15 min, CLAUDE_DESKTOP_SETUP.md) — lets Agent 14 run
7. GITHUB_TOKEN — get from github.com, add to Railway (5 min)
8. HEYGEN_API_KEY — get from heygen.com, add to Railway (5 min)
9. Social media tokens (30 min if not done — LinkedIn/FB/Twitter developer apps)
10. Slybroadcast account — slybroadcast.com, pre-record 30-sec voicemail (10 min)

Total: ~2 hours of one-time setup. After that: zero manual work.
