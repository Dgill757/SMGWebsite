---
name: morning-brief
description: Generate the Summit Voice AI daily morning brief. Pulls live data from Railway API, GHL pipeline, and hot_leads.log. Sends to Slack #ava-dispatch and saves to vault.
triggers: morning brief, daily brief, what happened overnight, briefing, daily report
schedule: daily at 07:00 AM
---

# Morning Brief

## Purpose
Dan wakes up to a complete picture of Summit Voice AI operations.
No manual checking. Everything surfaced in one message.

## Data Sources

1. **Railway API** → GET /analytics/summary
   - leadsToday, leadsCity, cityIndex
   - emailsToday, smsToday
   - posReplies, callsBooked, demosBuilt

2. **GHL Pipeline** → GET /contacts with pipeline filter
   - Count per stage: Contacted, Replied, Interested, Demo Sent, Meeting Booked, Won

3. **hot_leads.log** → Read `C:\Users\DanGi\scripts\hot_leads.log`
   - Last 24 hours entries only
   - Extract: company names, message snippets, timestamps

4. **Supabase** → SELECT from hot_leads WHERE received_at > yesterday
   - Any positive replies not yet actioned?

5. **Vault** → Check ANALYTICS/DAILY/ for yesterday's brief
   - Compare to find changes

## Output Format

```
╔═══════════════════════════════════════════════════════╗
║   SUMMIT OS — MORNING BRIEF · {{DATE}} · {{TIME}}     ║
║   Day {{X}} of {{quarter}} · {{daysLeft}} days to $50K ║
╚═══════════════════════════════════════════════════════╝

🎯 TODAY'S PRIORITY
{{single most important action — highest revenue impact}}

📊 YESTERDAY'S NUMBERS
  Leads scraped:     {{N}} in {{city}} (city {{X}}/365)
  Emails + SMS:      {{N}} sent
  Hot replies:       {{N}} (positive)
  Demos built:       {{N}}
  Calls booked:      {{N}}
  MRR (est.):        ${{N}}

🔥 HOT LEADS NEEDING ACTION
{{list each positive reply with: company, snippet, time, demo built? Y/N}}
{{if none: "No hot leads — outreach running, replies expected today"}}

📋 PIPELINE SNAPSHOT
  Contacted:       {{N}}    Replied:      {{N}}
  Interested:      {{N}}    Demo Sent:    {{N}}
  Meeting Booked:  {{N}}    Won:          {{N}}

⚡ SUGGESTED ACTIONS (by revenue impact)
1. {{specific action — e.g., "Build demo for Peak Exteriors — replied positive 2hrs ago"}}
2. {{specific action}}
3. {{specific action}}

📅 TODAY'S SCHEDULE
  {{any Calendly calls booked today}}
  {{upcoming demo deliveries}}

🚧 ERRORS/BLOCKERS
  {{any script failures, API errors, failed demo builds}}
  {{if none: "All systems operational"}}
```

## Delivery
1. POST to Slack: SLACK_WEBHOOK_URL with formatted message
2. Save to vault: `SummitVault/ANALYTICS/DAILY/{{date}}-brief.md`
3. POST to Railway: `/ingest/outreach-run` with today's stats if available
4. Return summary to terminal

## On Failure
If Railway API offline: use last known stats from vault + local log files.
Never skip the brief — always deliver something, even partial.
