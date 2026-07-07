# Directive: Summit Voice AI — Full GHL Build
# Save to: C:\Users\DanGi\projects\antigravity-workspace\directives\summit_ghl_build.md
# This directive tells Claude exactly how to build the complete GHL automation system.

## OBJECTIVE
Build the complete Summit Voice AI GHL automation empire from scratch.
When complete, Dan shows up to meetings that are already booked on his calendar.
Everything else runs automatically.

## WHAT YOU'RE BUILDING

Total deliverables:
- 10 custom contact fields
- 3 pipelines with correct stages
- 14 fully published GHL workflows
- 1 content system (Ask AI persona)
- All tags verified/created
- Apollo MCP replacing Apify in daily_outreach.py
- 3 script additions (ingest endpoints) to local Python scripts

---

## PHASE 1: PREREQUISITES (GHL API via MCP — no browser needed)

Use GHL MCP tools to create all custom fields and pipeline stages.

### Custom Contact Fields to Create
Navigate to: GHL → Settings → Custom Fields → Create Field

| Field Name (Key) | Display Name | Type |
|---|---|---|
| demo_url | Demo URL | URL |
| demo_generated_date | Demo Generated Date | Date |
| marketing_audit_text | Marketing Audit | Text Area |
| audit_score_total | Audit Score | Number |
| website_url | Website URL | URL |
| firecrawl_completed | Firecrawl Done | Checkbox |
| homepage_deployed | Homepage Deployed | Checkbox |
| google_reviews | Google Review Count | Number |
| segment | Outreach Segment | Text |
| voice_agent_key | Voice Agent Widget Key | Text |

### Pipelines to Verify/Create

**Pipeline 1: SVA Cold Outreach Pipeline**
Stages (in order):
1. Contacted
2. Replied
3. Interested
4. Audit Requested
5. Demo Sent
6. Meeting Booked
7. Meeting Held
8. Proposal Sent
9. Won
10. Lost / Nurture

**Pipeline 2: SVA Demo Machine**
Stages:
1. Build Requested
2. Building
3. Demo Live
4. Viewed
5. Responded

**Pipeline 3: SVA Clients**
Stages:
1. Onboarding
2. Active
3. At Risk
4. Churned

### Tags to Verify Exist (Create if Missing)
- "Claude Outreach Sent"
- "Replied - Hot Lead"
- "audit requested"
- "demo requested"
- "demo in progress"
- "demo delivered"
- "meeting booked"
- "not interested"
- "opted out"
- "fb_ad_running"
- "segment_a" through "segment_e"

---

## PHASE 2: BUILD 14 WORKFLOWS (Playwright → GHL Workflow Builder)

### HOW TO BUILD EACH WORKFLOW

For each workflow:
1. Navigate to: GHL → Automation → Workflows → + New Workflow
2. Click "Use AI to Build" (the AI Builder button — top of the workflow creator)
3. Type the workflow description from below
4. Review the generated workflow
5. Adjust any steps that need tweaking
6. Click Publish
7. Take a screenshot and save to /tmp/screenshots/workflow_[name].png
8. Log: "✓ Workflow [name] published"

If AI Builder is not available, build manually using the trigger and actions described.

---

### WORKFLOW 1: SVA Main Outreach — Segment A

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Tag Added = 'Claude Outreach Sent'. Filter: Contact has email. Wait 1 hour. Send email with subject 'missed calls' and body: 'hey {{contact.firstName}}, quick question — what happens when a customer calls your roofing business and nobody answers? most of the time? they call the next guy. roofing owners miss 3–5 calls a day. that's $50–100K walking out the door every year. i built something that fixes this 24/7. worth a quick look? —dan'. Wait 3 days. If no reply tag exists: Send SMS: 'Hey {{contact.firstName}} — sent you an email about missed calls costing roofing businesses $50-100k/yr. Still relevant? Happy to show you what we built. — Dan'. Wait 4 days. If no reply: Send email subject 'the calls you are not getting' body: '{{contact.firstName}}, the phones you are missing are not going to voicemail. they are going to your competitor. 3-5 calls a day × $9,500 average job × 365 days. the math is brutal. built a fix for this. 15 minutes and you will see it. calendly.com/aivoice/call —dan'. Wait 7 days. If no reply: Send SMS breakup: 'hey {{contact.firstName}}... last message from me. if the missed call problem ever gets bad enough to want to fix it — calendly.com/aivoice/call — dan. reply stop to opt out.'. Add tag: sequence_complete."

**Allow re-entry:** No
**Status after build:** Published

---

### WORKFLOW 2: SVA Reply Router

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Inbound Message Received (email or SMS). Use AI step with GPT-4o: 'Classify this reply from a roofing business owner: {{message.body}}. Return ONLY one word: positive, negative, or nurture. Positive = they want to see something, are interested, asked a question about the product, or agreed to a call. Negative = not interested, stop, unsubscribe, or hostile. Nurture = unclear, asking a question unrelated to buying, or needs more information.' If AI output contains 'positive': Add tag 'Replied - Hot Lead', Add tag 'replied positive', Move opportunity to pipeline stage 'Interested', Send internal notification to Dan: 'HOT LEAD: {{contact.firstName}} at {{contact.companyName}} replied positive. Message: {{message.body}}'. If AI output contains 'negative': Add tag 'not interested', Remove from all active sequences, Send graceful exit SMS: 'Got it {{contact.firstName}} — no worries at all. If anything changes, the door is open. — Dan'. If AI output contains 'nurture': Add tag 'nurture reply', Send internal notification: 'NURTURE REPLY needs manual response: {{contact.firstName}} — {{message.body}}'."

**Allow re-entry:** Yes (every message)
**Status after build:** Published

---

### WORKFLOW 3: SVA Positive Reply Handler

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Tag Added = 'replied positive'. Filter: Tag 'meeting booked' NOT present AND tag 'demo delivered' NOT present. Immediately: Send email subject 'here is your calendar link' body: 'hey {{contact.firstName}}, glad this is on your radar. here is the link to grab 15 minutes: calendly.com/aivoice/call — no prep needed. just show up. —dan'. Wait 30 minutes. Send SMS: 'Hey {{contact.firstName}} — just sent you a calendar link. 15 minutes, no prep. calendly.com/aivoice/call — Dan'. Wait 24 hours. If tag 'meeting booked' NOT present: Send SMS: 'hey {{contact.firstName}} — still open to that 15 min chat? calendly.com/aivoice/call — dan'. Wait 48 hours. If tag 'meeting booked' NOT present: Send email subject 'still got a spot for you' body: '{{contact.firstName}}, if the timing is off, totally fine. but if this is still on your mind — calendly.com/aivoice/call — dan'."

**Allow re-entry:** No
**Status after build:** Published

---

### WORKFLOW 4: SVA Marketing Audit + Demo Delivery

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Tag Added = 'audit requested'. Filter: Tag 'demo delivered' NOT present. Step 1: Add tag 'demo in progress'. Step 2: Internal notification to Dan: 'DEMO MACHINE STARTED for {{contact.companyName}} — website: {{contact.website_url}}. Railway API will build demo automatically.'. Step 3: Send outbound webhook to https://YOUR-RAILWAY-URL.up.railway.app/dispatch with JSON body: {command: 'demo', url: '{{contact.website_url}}', contact_id: '{{contact.id}}', company: '{{contact.companyName}}'}. Step 4: Wait 12 minutes. Step 5: If custom field demo_url is not empty: Send email subject 'built you a custom demo' body: 'hey {{contact.firstName}}, I rebuilt {{contact.companyName}} homepage. it now has a live AI voice receptionist built right into the site. your customers can call, ask questions, or book an estimate directly through the page 24/7 without you touching anything. i also ran a full marketing audit. the short version: there is real recoverable revenue sitting in missed calls right now. here is your custom demo: {{contact.demo_url}} takes 2 minutes to see. dan'. Wait 30 minutes. Send SMS: 'hey {{contact.firstName}}... i rebuilt {{contact.companyName}} homepage with a live voice ai already running. here it is: {{contact.demo_url}} -- 2 min to see it. worth it? reply stop to opt out.'. Add tag 'demo delivered'. Remove tag 'demo in progress'. Remove tag 'audit requested'. Move opportunity to stage 'Demo Sent'. Internal notification: 'DEMO DELIVERED to {{contact.companyName}} at {{contact.email}}'."

**Allow re-entry:** No
**Status after build:** Published

---

### WORKFLOW 5: SVA Demo Follow-Up (48hr)

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Tag Added = 'demo delivered'. Filter: Tag 'meeting booked' NOT present. Wait 48 hours. If tag 'meeting booked' IS present: Stop workflow. Use AI step to write a one-sentence follow-up SMS for {{contact.firstName}} at {{contact.companyName}} who received a custom homepage demo 48 hours ago at {{contact.demo_url}}. Casual, human, no pitch. Under 120 characters. No em dashes. Reference the demo specifically. Send the AI-generated SMS. Wait 3 days. If tag 'meeting booked' IS present: Stop. Send email subject 'still got your demo' body: 'hey {{contact.firstName}}, the demo I built for {{contact.companyName}} is still live. if you missed it: {{contact.demo_url}}. one thing i did not mention — the audit i ran showed {{contact.companyName}} is likely losing over $50K a month in missed call revenue. the demo shows exactly what plugging that leak looks like. still worth 2 minutes? dan'. Wait 3 days. If tag 'meeting booked' IS present: Stop. Send SMS: 'hey {{contact.firstName}}... going to take down the demo i built for {{contact.companyName}} soon. if you want to see it before i do: {{contact.demo_url}} -- reply stop to opt out.'. Add tag 'demo sequence complete'."

**Allow re-entry:** No
**Status after build:** Published

---

### WORKFLOW 6: SVA Lead Enrichment Agent

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Contact Created or Contact Tag Added = 'new lead'. Wait 5 minutes (allow data to settle). Use AI step: 'Research this roofing company and enrich their contact record. Company: {{contact.companyName}}. Location: {{contact.city}}, {{contact.state}}. Website: {{contact.website}}. Find and return JSON with: estimated_revenue, employee_count, years_in_business, specialty_services, google_review_count, facebook_presence, has_website_chatbot, runs_google_ads, runs_facebook_ads, yelp_rating. Use web search if needed.' Update contact fields with AI output. Add appropriate segment tag based on profile (segment_a through segment_e). Create opportunity in SVA Cold Outreach Pipeline at stage 'Contacted'."

**Allow re-entry:** No
**Status after build:** Published

---

### WORKFLOW 7: SVA Pre-Meeting Brief

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Appointment Status = Confirmed. Filter: Calendar is any Summit Voice AI calendar. Immediately: Use AI step to generate a 300-word pre-meeting brief for Dan: 'Dan is about to meet with {{contact.firstName}} {{contact.lastName}}, owner of {{contact.companyName}} in {{contact.city}}, {{contact.state}}. Website: {{contact.website_url}}. Google reviews: {{contact.google_reviews}}. Notes from CRM: {{contact.notes}}. Write a focused pre-call brief covering: 1) What they care about most (based on their profile), 2) Likely objections to prepare for, 3) Key talking points specific to their business, 4) Questions to ask to understand their current setup, 5) Recommended close strategy. Keep it punchy. Dan has 10 years in roofing. Write peer-to-peer.' Send brief to Dan via internal email notification. Send Dan SMS: 'Pre-meeting brief ready for {{contact.firstName}} at {{contact.companyName}} — check email.'"

**Allow re-entry:** Yes
**Status after build:** Published

---

### WORKFLOW 8: SVA Post-Call Follow-Up

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Appointment Status = Showed or Call Status = Completed. Wait 30 minutes. Use AI step: 'Write a follow-up email from Dan Gill at Summit Voice AI to {{contact.firstName}} at {{contact.companyName}}. This is after a sales call they just had. Warm, direct, Hormozi-style. No em dashes. Short. Reference that they spoke today. Next step is either: sending proposal, scheduling a follow-up, or closing. Include one of these CTAs based on context. Subject line: lowercase, max 6 words.' Send the AI-generated email. Wait 24 hours. If opportunity stage is NOT 'Won' and NOT 'Proposal Sent': Send SMS: 'hey {{contact.firstName}} — following up on our conversation. any questions on your end? — dan'. Move opportunity to stage 'Meeting Held'."

**Allow re-entry:** Yes
**Status after build:** Published

---

### WORKFLOW 9: SVA No-Show Recovery

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Appointment Status = No Show. Wait 10 minutes. Send SMS: 'hey {{contact.firstName}} — looks like something came up. no worries. want to reschedule? calendly.com/aivoice/call — dan'. Wait 24 hours. If tag 'meeting booked' NOT present for new meeting: Send email subject 'missed you today' body: 'hey {{contact.firstName}}, missed you on the call today. completely understand — things come up. still happy to show you what we built whenever timing is better. grab 15 minutes when you are ready: calendly.com/aivoice/call —dan'. Wait 3 days. If still no reschedule: Add tag 'no show recovery', Remove from active sequences temporarily."

**Allow re-entry:** Yes
**Status after build:** Published

---

### WORKFLOW 10: SVA Stale Deal Nudge

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Opportunity Stage Changed. Wait 7 days. If opportunity has NOT changed stage in 7 days AND stage is not Won or Lost: Use AI to write a brief nudge message for Dan to send to {{contact.firstName}} at {{contact.companyName}} — stage is currently {{opportunity.stage}}. Casual, not pushy. Under 100 words. Subject line 6 words max. Send as email. Internal notification to Dan: 'Stale deal — {{contact.companyName}} has been in {{opportunity.stage}} for 7 days. Nudge sent.'"

**Allow re-entry:** Yes
**Status after build:** Published

---

### WORKFLOW 11: SVA Won Client Onboarding

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Opportunity Stage Changed = Won. Immediately: Add tag 'active client'. Move contact to SVA Clients pipeline stage 'Onboarding'. Send welcome email subject 'welcome to summit voice ai' body: 'hey {{contact.firstName}}, welcome aboard. here is what happens next: 1. we set up your Ava voice AI system in the next 48 hours. 2. you will get a test link to hear your AI receptionist before it goes live. 3. we will schedule a 15-min onboarding call to review settings. any questions before then, reply here. excited to show you what this does for {{contact.companyName}}. —dan'. Send Dan internal notification: 'NEW CLIENT: {{contact.companyName}} — {{contact.firstName}} {{contact.lastName}} — {{contact.phone}} — MRR: check'. Create task for Dan: 'Set up Ava system for {{contact.companyName}} — due in 48 hours'."

**Allow re-entry:** No
**Status after build:** Published

---

### WORKFLOW 12: SVA 90-Day Reactivation

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Tag Added = 'reactivate'. Filter: Tag 'active client' NOT present AND Tag 'do not contact' NOT present. Use AI step to write a re-engagement SMS: 'Write a 1-sentence reactivation SMS from Dan Gill at Summit Voice AI to {{contact.firstName}} at {{contact.companyName}}. They showed interest 90+ days ago but did not move forward. One sentence. Casual. Reference something specific to roofing. No pitch. Just re-open the conversation.' Send AI-generated SMS. Wait 48 hours. If no reply: Use AI to write a re-engagement email subject line and body referencing their company specifically. Send email. Wait 3 days. If no reply: Add tag 'sequence complete'. Remove tag 'reactivate'."

**Allow re-entry:** Yes (every 90 days)
**Status after build:** Published

---

### WORKFLOW 13: SVA Dispatch Trigger (SMS Command)

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Inbound SMS Received. Filter: From number matches Dan's personal cell phone number. Use AI step: 'Dan sent this command via SMS: {{message.body}}. Parse it and return JSON only, no other text: {command: demo or audit or scrape or status or help, url: website URL if present or empty string, contact_id: GHL contact ID if present or empty string, company: company name if mentioned or empty string}'. Send outbound webhook to https://YOUR-RAILWAY-URL.up.railway.app/dispatch with the parsed JSON. Send Dan SMS confirmation: 'Dispatch received: {{message.body}} — processing now.'"

**Allow re-entry:** Yes
**Status after build:** Published

---

### WORKFLOW 14: SVA Content Autopilot

**AI Builder Prompt:**
"Create a workflow for Summit Voice AI. Trigger: Recurring Schedule — every Monday at 7:00 AM. Use AI step with this prompt: 'You are the content strategist for Summit Voice AI, owned by Dan Gill III. Dan spent 10 years in roofing before building AI systems for roofing contractors. Write this week's full content for all 5 platforms. For each piece: Platform, Pillar (Money Leak / Mindset Shift / The System / The Proof / The Competition), Post copy, Image direction. FACEBOOK (2 posts, 150-300 words, conversational). INSTAGRAM (2 posts, 100-200 words, hook in first 2 lines). LINKEDIN (2 posts, 200-400 words, peer-to-peer owner voice). TWITTER/X (3 posts, under 250 chars, sharp and contrarian). TIKTOK (1 script, 45-90 seconds, raw and direct). Key stats: 67% of calls go unanswered. $9,500 avg job. 1,095-1,825 missed calls/year. $1.56M-$8.67M annual missed revenue. As little as $16/day. CTA: calendly.com/aivoice/call. Voice: Alex Hormozi for the trades. Short punchy sentences. No fluff. No corporate speak. No pitch. Teach and provoke. Write for owners not employees.'. Send Dan email with full content calendar attached. Send Dan SMS: 'This weeks content calendar is ready — check email.'"

**Allow re-entry:** Yes (weekly)
**Status after build:** Published

---

## PHASE 3: SET UP SOCIAL CONTENT SYSTEM (Playwright → GHL Ask AI)

1. Navigate to: GHL → Marketing → Social Media → Ask AI (or Content AI)
2. Find the Persona / System Prompt field
3. Clear existing content
4. Paste the full MASTER PROMPT from SummitVoiceAI_GHL_Social_Content_System.md
5. Save
6. Test with: "Write me a LinkedIn post about missed calls costing roofing businesses money"
7. Screenshot result

---

## PHASE 4: APOLLO MIGRATION (Replace Apify)

### Update daily_outreach.py

Add this function to use Apollo MCP instead of Apify:

```python
def search_apollo_roofing_leads(city: str, state: str, count: int = 50) -> list:
    """
    Replaces Apify Google Maps scraping.
    Uses Apollo MCP to find roofing company owners with verified emails.
    Call this from Claude Code session with Apollo MCP connected.
    """
    # This runs via Claude Code with Apollo MCP
    # Prompt: "Search Apollo for roofing company owners in {city}, {state}.
    #          Filter: title contains owner OR president OR CEO OR founder.
    #          Industry: roofing contractors. Employee count: 1-50.
    #          Limit: {count}. Return: name, email, phone, company, website, city."
    pass  # Claude Code fills this in during the session
```

### Cost Comparison
- Apify: $35/month for scraping only (no emails)
- Apollo Professional: $99/month includes 2,000 verified contacts WITH owner emails
- Action: Cancel Apify when Apollo is confirmed working

---

## PHASE 5: SCRIPT WIRING (Add 10 lines to 3 scripts)

### Add to BOTH .env files:
```
AVA_API_KEY=generate-a-random-32-char-string
AVA_API_URL=https://YOUR-RAILWAY-URL.up.railway.app
```

### Add to end of daily_outreach.py (after send_slack_notification):
```python
try:
    import json as _json, requests as _req
    _state = {}
    try:
        with open("state.json") as _f: _state = _json.load(_f)
    except: pass
    _req.post(os.getenv("AVA_API_URL","") + "/ingest/scraper-run",
        json={**stats, "city_index": _state.get("city_index", 0)},
        timeout=8, headers={"X-API-Key": os.getenv("AVA_API_KEY","")})
    print("  [Ava Studio] Stats posted")
except Exception as _e:
    print(f"  [Ava Studio] Post failed: {_e}")
```

### Add to end of ghl_daily_outreach.py:
```python
try:
    import requests as _req
    _req.post(os.getenv("AVA_API_URL","") + "/ingest/outreach-run",
        json={"date": datetime.now().strftime("%Y-%m-%d"),
              "emails_sent": emails_sent, "sms_sent": sms_sent,
              "contacts_processed": total_processed, "skipped": skipped, "errors": errors},
        timeout=8, headers={"X-API-Key": os.getenv("AVA_API_KEY","")})
except Exception as _e:
    log.warning("Ava Studio post failed: %s", _e)
```

### Add to ghl_reply_monitor.py (inside alert loop + after loop):
```python
# Inside loop - collect:
_ava_replies = []  # declare before loop
_ava_replies.append({"contact_id": contact_id, "name": contact_name,
    "company": company_name, "snippet": reply_body[:200],
    "timestamp": datetime.utcnow().isoformat()})

# After loop - post:
if _ava_replies:
    try:
        import requests as _req
        _req.post(os.getenv("AVA_API_URL","") + "/ingest/replies",
            json={"replies": _ava_replies}, timeout=8,
            headers={"X-API-Key": os.getenv("AVA_API_KEY","")})
    except Exception as _e:
        log.warning("Ava Studio reply post: %s", _e)
```

---

## PHASE 6: VERIFICATION CHECKLIST

After completing all phases, verify each:

```
[ ] All 10 custom fields exist in GHL → Settings → Custom Fields
[ ] All 3 pipelines exist with correct stage names
[ ] All 14 workflows are Published (not draft)
[ ] Workflow 1 fires when you add tag "Claude Outreach Sent" to a test contact
[ ] Workflow 2 fires when you send a test inbound reply
[ ] Workflow 4 fires when you add tag "audit requested" to a test contact
[ ] Social content system Ask AI returns content matching Dan's voice
[ ] daily_outreach.py posts stats to /ingest/scraper-run successfully
[ ] ghl_reply_monitor.py posts to /ingest/replies successfully
[ ] Screenshots saved for all 14 workflows at /tmp/screenshots/
[ ] Summary log saved at /tmp/build_summary.txt
```

---

## ERROR HANDLING

If GHL AI Builder is unavailable:
- Fall back to manual workflow creation
- Use the triggers and actions described above step by step
- Log the fallback

If a workflow fails to publish:
- Screenshot the error
- Save as /tmp/screenshots/ERROR_workflow_[name].png
- Log the error
- Continue with next workflow
- Report all errors at end

If GHL MCP rate limits:
- Wait 10 seconds between API calls
- Retry failed calls up to 3 times
- Log rate limit hits

---

## OUTPUT CONTRACT

When complete, generate a file at C:\Users\DanGi\outreach\BUILD_COMPLETE.txt:

```
Summit Voice AI GHL Build — Completion Report
Built: [timestamp]

WORKFLOWS PUBLISHED: [list]
WORKFLOWS FAILED: [list with errors]
CUSTOM FIELDS CREATED: [list]
PIPELINES CREATED: [list]
SCRIPT ADDITIONS COMPLETED: [list]
APOLLO MIGRATION: [status]

NEXT MANUAL STEPS (if any):
[list anything that couldn't be automated]

ESTIMATED TIME TO FIRST AUTOMATIC OUTREACH: [X hours]
```
