# CLAUDE CODE — SESSION 3 PROMPT
# "Build pipelines + workflows + upgrade website generator"
# Paste this into Claude Code (Antigravity) after restarting the session.
# GHL MCP is now active. Railway + Vercel are live.
# Read CLAUDE.md and SYSTEM_LIVE.txt first.

You are finishing the Summit Voice AI build. Railway is live at the URL in SYSTEM_LIVE.txt.
GHL MCP is now active after this restart. Do everything in order. Don't stop.

---

## PART 1: UPGRADE THE WEBSITE GENERATOR (do this first)

The current homepage builder in Railway generates a basic dark HTML page.
We're replacing it with a template cloner that uses Dan's real GitHub repos.

### 1A: Add template_cloner.py to Railway

Copy template_cloner.py from this folder into the Railway deployment.
The key change in ava_demo_studio_COMPLETE_API.py:

Find this function call in build_demo_task():
```python
html = build_homepage(brand, "", req.widget_key)
```

Replace it with:
```python
from template_cloner import clone_and_customize_template
html = await clone_and_customize_template(brand, req.widget_key)
```

Also add GITHUB_TOKEN to Railway env vars (helps with rate limits, optional):
```bash
railway variables set GITHUB_TOKEN=your_github_token_if_you_have_one
```

After adding the file and updating the import, redeploy:
```bash
railway redeploy
```

### 1B: Test the upgraded website builder

Run a demo build with the new template:
```bash
curl -X POST https://ava-studio-api-production.up.railway.app/demos/create \
  -H "Content-Type: application/json" \
  -d '{"website_url":"https://peakroofingdallas.com","client_name":"Peak Roofing Dallas","send_delivery":false}'
```

Poll until done. The demo_url should now show a professional, polished website
cloned from Dan's GitHub template with the company name + colors + content replaced.

Open the URL. If it looks professional → move to Part 2.
If GitHub is unreachable → the fallback premium generator runs automatically.

---

## PART 2: BUILD GHL PIPELINES (GHL MCP)

Use GHL MCP tools to create the 3 pipelines.

### Pipeline 1: "SVA Cold Outreach Pipeline"
Create with these stages IN THIS ORDER:
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

### Pipeline 2: "SVA Demo Machine"
Stages: Build Requested → Building → Demo Live → Viewed → Responded

### Pipeline 3: "SVA Clients"
Stages: Onboarding → Active → At Risk → Churned

Log each pipeline ID after creation.

---

## PART 3: BUILD ALL 15 WORKFLOWS (GHL MCP + ghl_next_session_runner.py)

Run the pre-built script with all workflow prompts:
```bash
python ghl_next_session_runner.py
```

This builds workflows 1-14. After it completes, build workflow 15 via GHL MCP:

**WORKFLOW 15: "SVA No Website — Auto Build"**
Trigger: Tag Added = "segment_b"
Allow re-entry: No

Build these steps:
1. Wait 30 minutes
2. Action: Webhook (outbound)
   URL: https://ava-studio-api-production.up.railway.app/demos/create
   Method: POST
   Body (JSON):
   {
     "contact_id": "{{contact.id}}",
     "website_url": "",
     "client_name": "{{contact.companyName}}",
     "no_website": true,
     "send_delivery": false
   }
3. Wait 12 minutes
4. IF/ELSE branch: Custom Field "demo_url" is not empty
   
   YES BRANCH:
   a. Add Tag: "demo pre-built"
   b. Send Email:
      Subject: "built your company a website"
      Body: hey {{contact.firstName}},

      noticed {{contact.companyName}} doesn't have a website.

      went ahead and built one for you. took about 10 minutes.

      it also has a live AI voice receptionist built in — answers calls, books jobs, follows up leads. 24/7.

      here it is: {{contact.demo_url}}

      if you want to keep it, we can talk. if not, no worries — it's yours either way.

      —dan
   
   c. Wait 30 minutes
   d. Send SMS: "hey {{contact.firstName}}... went ahead and built {{contact.companyName}} a free website with AI voice built in. here: {{contact.demo_url}} -- worth a look? reply stop to opt out."
   e. Wait 48 hours → IF tag "replied positive" NOT present → Send SMS: "hey {{contact.firstName}} — site is still live: {{contact.demo_url}} -- dan"
   
   NO BRANCH:
   a. Internal notification: "Demo build FAILED for {{contact.companyName}} — check Railway logs"

---

## PART 4: CONFIGURE GHL WEBHOOK

Use GHL MCP or navigate via Playwright to:
GHL → Settings → Integrations → Webhooks → Create New Webhook

Settings:
- Name: "Ava Studio Real-Time Sync"
- URL: https://ava-studio-api-production.up.railway.app/webhooks/ghl
- Events to enable:
  ✅ Contact Tag Added
  ✅ Inbound Message
  ✅ Appointment Booked
  ✅ Opportunity Stage Changed
  ✅ Contact Created

This wires GHL events to the Ava Studio dashboard in real time.

---

## PART 5: REPLACE voice_ai_automation.py WITH v2

Copy voice_ai_automation_v2.py from the folder to Railway:
1. Rename it to voice_ai_automation.py (replacing the old version)
2. The v2 has exact Thinker steps based on Dan's described flow
3. Add it to the Railway deployment

Then test it:
```bash
python voice_ai_automation.py
```

It will open a browser window (headless=False on first run so Dan can see it).
If it fails, check the screenshot at /tmp/thinker_debug*.png.

Ask Dan: "What is the exact URL you visit to log into your Thinker Voice AI platform?"
(This is the THINKER_URL env var — if it's not set in Railway yet, set it now.)

---

## PART 6: UPDATE DASHBOARD TO SHOW REAL PIPELINES

After the GHL pipelines are created, update the Ava Studio dashboard
to pull live pipeline data instead of the hardcoded LOCAL.pipeline fallback.

The dashboard already has this API call wired:
```javascript
const pipeline = await api('/ghl/pipeline/stats');
```

Make sure /ghl/pipeline/stats in Railway returns the real GHL pipeline counts.
Test: open studio.summitvoiceai.com (or the Vercel URL) → GHL Pipeline page
→ stages should show real contact counts.

---

## PART 7: END-TO-END FULL SYSTEM TEST

Run through this complete flow:

1. Pick a real roofing company (use a real URL, not peakroofingdallas.com again)
   Example: find one in Dallas or Houston that has a website but no AI

2. Run a demo build:
   ```bash
   curl -X POST https://ava-studio-api-production.up.railway.app/demos/create \
     -H "Content-Type: application/json" \
     -d '{"website_url":"https://[REAL-ROOFER].com","client_name":"[COMPANY NAME]","send_delivery":false}'
   ```

3. Watch it build. Poll status until done.

4. Open the demo URL. Verify:
   ✅ Looks like a real professional website (not generic AI output)
   ✅ Company name is correct throughout
   ✅ Phone number is correct
   ✅ Services listed make sense for their business
   ✅ City/location is correct
   ✅ Voice widget appears in bottom right corner (if Thinker is configured)

5. If the website looks great → the demo machine is ready to send to real prospects.

---

## PART 8: WRITE FINAL BUILD SUMMARY

Create SYSTEM_COMPLETE.txt:

```
SUMMIT VOICE AI — FULL SYSTEM OPERATIONAL
==========================================
Date: [timestamp]

RAILWAY: https://ava-studio-api-production.up.railway.app ✅
DASHBOARD: https://[vercel-url] ✅
SUPABASE: Connected ✅
GHL WEBHOOK: Configured ✅

WEBSITE GENERATOR: Template cloner + Claude customization ✅
Demo quality: [describe what the test site looked like]

VOICE AI (THINKER):
  - Selectors: [Confirmed / Needs Learn Session]
  - Test agent created: [Yes / No]

WORKFLOWS BUILT:
  [list each with ✅ or ❌]

PIPELINES:
  SVA Cold Outreach Pipeline: [X stages] ✅
  SVA Demo Machine: [X stages] ✅
  SVA Clients: [X stages] ✅

WHAT DAN NEEDS TO DO MANUALLY:
[Only real remaining items]

NEXT STEPS TO MAXIMIZE RESULTS:
1. Thinker Learn Session (if voice AI selectors not yet confirmed)
2. Test sending a real demo to a real roofing prospect
3. Watch the first workflow fire from an actual reply
```

---

## IF YOU HIT BLOCKERS

**GitHub fetch returns 404 for template repos:**
The fallback premium generator runs automatically — no action needed.
The sites will still look excellent.

**GHL MCP workflow creation errors:**
If workflow builder via API fails, fall back to Playwright:
Navigate GHL → Automation → Workflows → New Workflow → Use AI Builder
Then type each workflow description from summit_ghl_build_directive.md

**Thinker URL not in Railway:**
Ask Dan: "What URL do you visit to log into your Voice AI platform?"
Set it: railway variables set THINKER_URL="https://[that-url]"

**GHL pipeline creation via MCP fails:**
Fall back to GHL REST API directly using the GHL_PRIVATE_TOKEN.
The pipeline.write scope issue from last session is resolved with GHL MCP.

---

## ONE QUESTION FOR DAN BEFORE PART 5

"Dan — two things I need to set up your Thinker automation:

1. What is the URL you visit to log into your Voice AI platform?
   (Not app.thinker.ai — YOUR specific platform URL)

2. When you create an agent, does it ask you to add a phone number during setup,
   or is that done separately after the agent is created?
   Just want to make sure I wire the phone association step correctly."
