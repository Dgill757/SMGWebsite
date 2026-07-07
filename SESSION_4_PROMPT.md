# CLAUDE CODE — SESSION 4 PROMPT
# "Wire everything, upgrade AI agents, deploy fully, finish"
# 
# BEFORE PASTING: Complete Dan's 3 manual steps first (see DAN_DO_FIRST below)
# THEN paste this entire prompt into Claude Code.
# 
# Read CLAUDE.md, SYSTEM_LIVE.txt, SYSTEM_COMPLETE.txt first.
# Check what's already done. Then execute everything below.

---

## PART 0: VERIFY CURRENT STATE

Run these checks first. Log results.

```bash
# Is Railway deployed?
curl https://ava-studio-api-production.up.railway.app/health
# Expected: {"status":"ok"} — if timeout, it needs railway up

# Is the demo machine working?
curl -X POST https://ava-studio-api-production.up.railway.app/demos/create \
  -H "Content-Type: application/json" \
  -d '{"website_url":"https://google.com","client_name":"Test","send_delivery":false}'

# How many GHL workflows are published vs draft?
# Use GHL MCP: list all workflows, report published/draft count
```

---

## PART 1: UPGRADE DEMO MACHINE TEMPLATES

The current demo builder produces a basic dark page. Upgrade it using Dan's GitHub templates.

### 1A. Add template_cloner.py to the deployment folder

The file is already in the folder. Wire it into the API:

In `ava_demo_studio_COMPLETE_API.py`, find:
```python
html = build_homepage(brand, "", req.widget_key)
```

Replace with:
```python
try:
    from template_cloner import clone_and_customize_template
    html = await clone_and_customize_template(brand, req.widget_key)
except ImportError:
    html = build_homepage(brand, "", req.widget_key)
```

Also add `GITHUB_TOKEN` to Railway if Dan has one:
```bash
railway variables set GITHUB_TOKEN=ghp_[DAN_GITHUB_PAT_IF_HE_HAS_ONE]
```

Dan's 3 GitHub roofing template repos to try (in order):
1. `Dgill757/Roofing-Template2`
2. `Dgill757/roofing-template-roofez`
3. `Dgill757/Roofing-Website-Template`

### 1B. Read the vibe-coding guide for website quality context

Read: `C:\Users\DanGi\Downloads\SummitVoiceAiWorkflowsandDemoMachine\vibe-coding-roofing-guide.html`
Extract the design principles, color palettes, component patterns, and copy formulas.
Store as a variable `VIBE_GUIDE` and reference it in the template customization prompt.

The key instruction to add to the Claude customization prompt:
```
Apply these design standards from the vibe-coding guide:
- Hero section: Large bold headline, strong CTA above fold, trust signals visible
- Colors: Use the company's actual extracted brand color throughout  
- Services: Card grid with icons, not a plain list
- Social proof: Review count + stars prominently displayed
- CTAs: Phone number clickable tel: link in multiple places
- Mobile: Hamburger menu, single column, touch-friendly buttons
- Voice widget: Fixed bottom-right, with a subtle "Talk to Ava" label above it
```

### 1C. Redeploy Railway with updated code

```bash
cd C:\Users\DanGi\Downloads\SummitVoiceAiWorkflowsandDemoMachine
railway up
```

### 1D. Run a real test with an actual roofing company

Pick a real roofing company URL (not a placeholder).
Build a demo. Open the deployed URL. 
Confirm it looks like a real professional website cloned from Dan's template.

---

## PART 2: UPGRADE ALL WORKFLOWS TO USE GHL AI AGENT

The 8 draft workflows + the 7 published ones need updating.
Replace static if/else reply handling with GHL's native AI Intent Detection + AI Agent action.

### For EVERY workflow that handles inbound replies:

Remove: Static "If/Else: message contains 'yes'" branches
Replace with: 

**Step 1 — AI Intent Detection action:**
- Action: "AI Intent Detection"
- Input: {{message.body}}
- This creates 3 automatic branches: POSITIVE / NEGATIVE / NONE

**POSITIVE branch:**
Instead of static "send email with Calendly link", use:

**AI Agent action (GPT-5.2 Low Thinking):**
```
You are Ava, the AI assistant for Summit Voice AI.

A roofing business owner just replied positively to Dan's outreach.
Here is the full context:

Contact name: {{contact.firstName}} {{contact.lastName}}
Company: {{contact.companyName}}
City: {{contact.city}}, {{contact.state}}
Phone: {{contact.phone}}
Google reviews: {{contact.google_reviews}}
Their message: {{message.body}}
Demo URL (if built): {{contact.demo_url}}
Message history summary: {{conversation.summary}}
Current pipeline stage: {{opportunity.stage}}

Your job: Respond to this person with a short, human, non-salesy reply.
Rules:
- Under 120 words
- No em dashes. Use "..." for pauses.
- Match their energy — if they're casual, be casual
- If demo_url exists: reference it and invite them to check it out
- If no demo: ask what's their website so we can build one for them
- Always offer the calendar link: calendly.com/aivoice/call
- Sign off as: —dan

Tools you can use: Send SMS, Send Email, Add Tag, Update Contact Field

Execute the appropriate response now. Do not just draft it — SEND IT.
```

**NEGATIVE branch:**
AI Agent action:
```
Contact {{contact.firstName}} at {{contact.companyName}} replied negatively.
Their message: {{message.body}}

1. Send a graceful exit SMS: "got it {{contact.firstName}} — no problem at all. good luck with the season. —dan"
2. Add tag: "not interested"
3. Remove tags: "claude outreach sent", "replied positive"  
4. Update pipeline stage to: "Lost / Nurture"
```

**NONE branch:**
AI Agent action:
```
Contact {{contact.firstName}} replied with an unclear message: {{message.body}}

Analyze their reply and do ONE of the following:
- If it's a question about price: Reply with "starts at $16/day. one recovered job pays for the whole month. worth 15 min to show you how it works? calendly.com/aivoice/call —dan"
- If it's a question about what it does: Reply explaining Ava handles calls 24/7, books jobs, follows up leads — like a receptionist that never sleeps
- If it's about competitors or alternatives: Reply with why this is different (roofing-specific, not generic)
- If genuinely unclear: Flag for Dan — add tag "manual response needed", send internal notification with the message

Execute the appropriate action now.
```

### Specific workflows to upgrade (in GHL UI after Claude Code preps the prompts):

Claude Code: prepare the exact AI Agent instruction text for each workflow.
Save them to a file: `workflow_ai_agent_prompts.txt` in the folder.
Dan will paste them into the GHL UI.

Workflows to upgrade:
1. SVA Reply Router (replace entire if/else tree with AI Intent Detection → AI Agent)
2. SVA Main Outreach — Segment A (replace Day 3/7/14 static follow-ups with AI-written ones)
3. SVA Positive Reply Handler (replace static Calendly message with AI-generated one)
4. SVA Marketing Audit + Demo Delivery (replace static email template with AI Agent)
5. SVA Demo Follow-Up (replace static follow-up with AI Agent that checks if demo was viewed)
6. SVA No Website — Auto Build (replace static "we built you a site" with AI Agent)

---

## PART 3: DEPLOY DASHBOARD TO CUSTOM SUBDOMAIN

### 3A. Update the dashboard Vercel project

In `ava_studio_FINAL.html`, update the API URL:
```javascript
const API = window.AVA_API_URL || 'https://ava-studio-api-production.up.railway.app';
```

Redeploy to Vercel:
```bash
vercel --prod
```

### 3B. Add custom domain in Vercel

Navigate: vercel.com → ava-demo-studio project → Settings → Domains → Add

Add: `avadashboard.summitvoiceai.com`

Vercel will give you DNS records to add. Two options:
- **If Dan controls summitvoiceai.com DNS**: Add CNAME record: `avadashboard` → `cname.vercel-dns.com`
- **If using Namecheap/GoDaddy**: Log into registrar, find DNS settings, add the CNAME

After DNS propagates (5 min to 48 hrs): dashboard is live at `https://avadashboard.summitvoiceai.com`

### 3C. Disable Vercel password protection

vercel.com → ava-demo-studio → Settings → Deployment Protection → Disable
(Or: set to "Bypass for Automation" with a custom header)

This makes demo pages publicly accessible so prospects can actually see them.

---

## PART 4: SET UP SLACK APP (COMPLETE STEP-BY-STEP)

Create a Slack app that gives Dan a `#ava-dispatch` channel he can type commands into 
from his phone and receive all outreach notifications from.

### 4A. Create the Slack App

1. Go to: https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. App Name: "Ava Studio"
4. Pick workspace: [Dan's workspace]
5. Click "Create App"

### 4B. Configure the app

In the left sidebar of the app settings:

**Incoming Webhooks** (for notifications TO Slack):
- Toggle ON
- Click "Add New Webhook to Workspace"
- Choose channel: #ava-dispatch (create if needed)
- Click Allow
- COPY THE WEBHOOK URL — add to Railway:
  ```bash
  railway variables set SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...
  ```

**Bot Token Scopes** (for reading messages FROM Slack):
- Click "OAuth & Permissions" in left sidebar
- Scroll to "Scopes" → "Bot Token Scopes"
- Add these scopes:
  - `channels:history` (read messages)
  - `channels:read` (list channels)
  - `chat:write` (send messages)
  - `commands` (slash commands)
  - `users:read` (identify who's sending)

**Slash Commands** (so Dan can type /build, /demo, etc.):
- Click "Slash Commands" in left sidebar
- Click "Create New Command"
- Command: `/demo`
- Request URL: `https://ava-studio-api-production.up.railway.app/slack/command`
- Short Description: "Build a demo for any roofing company"
- Usage hint: `[url] [company name]`
- Save
- Repeat for: `/audit`, `/scrape`, `/status`

**Event Subscriptions** (to receive messages):
- Click "Event Subscriptions"
- Toggle Enable Events ON
- Request URL: `https://ava-studio-api-production.up.railway.app/slack/events`
- Under "Subscribe to bot events": add `message.channels`
- Save

**Install the app**:
- Click "Install to Workspace" → Allow
- Copy the "Bot User OAuth Token" (starts with xoxb-)
- Add to Railway:
  ```bash
  railway variables set SLACK_BOT_TOKEN=xoxb-...
  ```

### 4C. Add Slack endpoints to Railway API

In `ava_demo_studio_COMPLETE_API.py`, add these endpoints:

```python
@app.post("/slack/events")
async def slack_events(request: Request):
    """Receives messages from Slack channel and routes to Dispatch."""
    body = await request.json()
    
    # URL verification challenge (Slack sends this when you first set up events)
    if body.get("type") == "url_verification":
        return {"challenge": body["challenge"]}
    
    event = body.get("event", {})
    
    # Only process actual messages, not bot messages
    if event.get("type") == "message" and not event.get("bot_id"):
        text = event.get("text", "").strip()
        user = event.get("user", "")
        channel = event.get("channel", "")
        
        if text:
            # Route to dispatch
            cmd_parts = text.lower().split()
            command = cmd_parts[0] if cmd_parts else ""
            url = cmd_parts[1] if len(cmd_parts) > 1 else ""
            
            response_text = "Processing..."
            
            if command in ["build", "demo"] and url:
                response_text = f"✦ Demo build started for `{url}`\nETA: ~9 minutes. I'll notify you when it's live."
                # Trigger demo build
                asyncio.create_task(trigger_demo_from_slack(url, text))
            elif command == "audit" and url:
                response_text = f"📊 Audit started for `{url}`\nResults in ~2 minutes."
            elif command == "status":
                active = len([d for d in demo_store.values() if isinstance(d, dict) and d.get("status") == "done"])
                response_text = f"System status: 🟢 Online\nDemos built: {active}\nAPI: Railway ✅"
            elif command == "scrape":
                response_text = f"🔍 Scraper triggered for `{' '.join(cmd_parts[1:])}`"
            else:
                response_text = "Commands: `demo [url]` · `audit [url]` · `scrape [city]` · `status`"
            
            # Reply in Slack
            async with httpx.AsyncClient() as client:
                await client.post(
                    "https://slack.com/api/chat.postMessage",
                    headers={"Authorization": f"Bearer {os.getenv('SLACK_BOT_TOKEN')}"},
                    json={"channel": channel, "text": response_text}
                )
    
    return {"ok": True}


@app.post("/slack/command")
async def slack_slash_command(request: Request):
    """Handles /demo /audit /scrape slash commands from Slack."""
    form = await request.form()
    command = form.get("command", "")
    text = form.get("text", "")
    
    if command == "/demo" and text:
        asyncio.create_task(trigger_demo_from_slack(text.split()[0], text))
        return {"response_type": "in_channel", 
                "text": f"✦ Building demo for `{text.split()[0]}`... ETA 9 minutes."}
    elif command == "/status":
        return {"response_type": "ephemeral", "text": "System: 🟢 Online"}
    
    return {"response_type": "ephemeral", "text": "Processing..."}


async def trigger_demo_from_slack(url: str, original_text: str):
    """Trigger a demo build from Slack command and post result back."""
    company = " ".join(original_text.split()[1:]) if len(original_text.split()) > 1 else ""
    
    # Build the demo
    r = await api_self_call("/demos/create", {
        "website_url": url if url.startswith("http") else f"https://{url}",
        "client_name": company or "Roofing Company",
        "send_delivery": False
    })
    
    demo_id = r.get("demo_id") if r else None
    if not demo_id:
        await slack_notify(f"❌ Demo build failed for `{url}`")
        return
    
    # Poll until done
    for _ in range(60):
        await asyncio.sleep(10)
        status_r = await api_self_call(f"/demos/{demo_id}/status")
        if status_r and status_r.get("status") == "done":
            demo_url = status_r.get("demo_url", "")
            await slack_notify(f"✅ Demo live for `{url}`\n🔗 {demo_url}")
            return
        elif status_r and status_r.get("status") == "error":
            await slack_notify(f"❌ Demo failed for `{url}`: {status_r.get('message')}")
            return
    
    await slack_notify(f"⏱ Demo for `{url}` is taking longer than expected. Check Railway logs.")


async def slack_notify(message: str):
    """Send a message to #ava-dispatch."""
    webhook = os.getenv("SLACK_WEBHOOK_URL")
    if not webhook:
        return
    async with httpx.AsyncClient() as client:
        await client.post(webhook, json={"text": message})
```

After adding endpoints, redeploy:
```bash
railway redeploy
```

Then complete Slack app setup: go back to api.slack.com → Event Subscriptions → verify the URL is working.

---

## PART 5: VAYNE.IO LINKEDIN INTEGRATION

Vayne.io (vayne.io) has a full REST API for LinkedIn Sales Navigator scraping.
Requires: LinkedIn Sales Navigator ($99/month) + Vayne starter ($29/month).

**Recommendation for Dan:**
Vayne is excellent for LinkedIn-specific enrichment but LinkedIn has minimal roofing contractor presence.
Primary strategy: Use Apollo for bulk roofing lead discovery.
Add Vayne for LinkedIn MESSAGE outreach to roofing owners who ARE on LinkedIn.

### Add to daily_outreach.py — LinkedIn enrichment layer:

```python
VAYNE_API_KEY = os.getenv("VAYNE_API_KEY", "")

async def enrich_with_linkedin_vayne(company_name: str, domain: str) -> dict:
    """
    Uses Vayne API to find LinkedIn profile for a roofing company owner.
    Only called after Apollo finds the contact - adds LinkedIn URL for outreach.
    """
    if not VAYNE_API_KEY:
        return {}
    
    async with httpx.AsyncClient() as client:
        # Search for the company on LinkedIn via Vayne
        r = await client.post(
            "https://api.vayne.io/v1/orders",  # Verify exact endpoint at vayne.io/en/api-documentation
            headers={
                "Authorization": f"Bearer {VAYNE_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "type": "company",
                "urls": [f"https://www.linkedin.com/search/results/companies/?keywords={company_name}+roofing"]
            },
            timeout=30
        )
        
        if r.status_code == 200:
            data = r.json()
            return {"linkedin_data": data}
    
    return {}
```

To enable: Add `VAYNE_API_KEY` to Railway and both .env files.
Start with their free tier (200 profiles/month) to test before committing.

---

## PART 6: DAILY AUTOMATED CONTENT GENERATION

Add this to the daily operations system. Runs every Monday at 7am via the existing Task Scheduler.

### 6A. Add content_generator.py to the scripts folder

```python
# C:\Users\DanGi\scripts\content_generator.py
"""
Daily/Weekly content generator for Summit Voice AI.
Runs Monday 7am via Task Scheduler.
Generates content for all 5 platforms and saves to GHL Social Planner.
"""
import os, json, requests
from anthropic import Anthropic
from datetime import datetime

ai = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
GHL_TOKEN = os.getenv("GHL_PRIVATE_TOKEN")
GHL_LOCATION = os.getenv("GHL_LOCATION_ID")

CONTENT_PROMPT = """
You are the content strategist for Summit Voice AI, owned by Dan Gill III.
Dan spent 10 years in roofing before building AI systems specifically for roofing contractors.
He is not a tech bro — he is a former roofer who built the tool he wished he had.

Generate this week's content for all 5 platforms. Use the 5 content pillars:
- MONEY LEAK: The revenue roofing owners are losing (missed calls, slow follow-up, no reviews)
- MINDSET SHIFT: Challenging how they think about their business
- THE SYSTEM: How the AI actually works (demystify it)
- THE PROOF: Results, data, math (the $9,500 avg job × missed calls math)
- THE COMPETITION: Why this beats hiring a receptionist or using a call center

TODAY'S DATE: {date}
FOCUS PILLAR THIS WEEK: {pillar}
SPECIFIC HOOK/STAT TO USE: {hook}

Generate:

LINKEDIN POST (1)
Format: Hook → Problem → Insight → CTA
Length: 150-300 words
Voice: Peer-to-peer roofing owner energy, not a marketer

FACEBOOK POST (1)  
Format: Story-driven, conversational
Length: 100-200 words
Voice: Casual, like talking to another contractor

INSTAGRAM CAPTION (1)
Hook line must stop the scroll
Length: 80-150 words + 5 relevant hashtags

TWITTER/X POSTS (2)
Sharp, contrarian, under 240 characters each
Make them thought-provoking or counterintuitive

TIKTOK SCRIPT (1)
45-90 seconds
Raw, direct, from-the-field energy
Open with the most surprising stat or claim
No scripted feel

KEY FACTS TO USE (weave in naturally):
- 67% of calls to small businesses go unanswered
- Average roofing job: $9,500
- Missing 3-5 calls/day = $50-100K/year walking out the door
- Ava answers calls, books jobs, follows up, requests reviews — 24/7
- As little as $16/day
- calendly.com/aivoice/call

NEVER:
- Sound salesy or promotional
- Use "game-changing" or "revolutionary" 
- Start a post with "Are you..."
- Use em dashes
- Use exclamation points more than once per post

FORMAT YOUR RESPONSE AS JSON:
{{
  "week": "{date}",
  "pillar": "{pillar}",
  "linkedin": "...",
  "facebook": "...",
  "instagram": "...",
  "twitter_1": "...",
  "twitter_2": "...",
  "tiktok_script": "..."
}}
"""

PILLARS = ["MONEY LEAK", "MINDSET SHIFT", "THE SYSTEM", "THE PROOF", "THE COMPETITION"]
HOOKS = [
    "3-5 missed calls per day = $50-100K/year in lost jobs",
    "67% of calls to small businesses go unanswered",
    "Your competitor answered. You didn't. They got the job.",
    "A receptionist costs $40K/year. This costs $16/day.",
    "The phone rings when you're on the roof. Every time.",
]

def generate_weekly_content():
    week_num = datetime.now().isocalendar()[1]
    pillar = PILLARS[week_num % len(PILLARS)]
    hook = HOOKS[week_num % len(HOOKS)]
    
    prompt = CONTENT_PROMPT.format(
        date=datetime.now().strftime("%B %d, %Y"),
        pillar=pillar,
        hook=hook
    )
    
    msg = ai.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    raw = msg.content[0].text.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    
    try:
        content = json.loads(raw)
        
        # Save to file
        filename = f"C:\\Users\\DanGi\\outreach\\content\\{datetime.now().strftime('%Y-%m-%d')}_content.json"
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, "w") as f:
            json.dump(content, f, indent=2)
        
        # Send briefing to Dan via Slack
        slack_msg = f"""📅 *This Week's Content Calendar Ready*
Pillar: {pillar}

*LinkedIn:*
{content.get('linkedin', '')[:300]}...

*TikTok Hook:*
{content.get('tiktok_script', '')[:200]}...

Full calendar saved to: {filename}"""

        requests.post(os.getenv("SLACK_WEBHOOK_URL", ""), 
                     json={"text": slack_msg}, timeout=5)
        
        print(f"[CONTENT] Generated and saved for week {week_num}")
        return content
        
    except json.JSONDecodeError as e:
        print(f"[CONTENT] Parse error: {e}")
        return None

if __name__ == "__main__":
    generate_weekly_content()
```

### 6B. Add to Task Scheduler

Task name: Summit Content Generator
Schedule: Every Monday at 7:00 AM
Action: `python C:\Users\DanGi\scripts\content_generator.py`

---

## PART 7: DAILY OUTREACH NOTIFICATION (SLACK SUMMARY)

Add this to the END of `ghl_daily_outreach.py` so Dan gets a Slack message every day:

```python
def send_daily_slack_summary(stats):
    """Send daily outreach summary to #ava-dispatch."""
    webhook = os.getenv("SLACK_WEBHOOK_URL", "")
    if not webhook:
        return
    
    emoji = "🔥" if stats.get("positive_replies", 0) > 0 else "📊"
    
    message = f"""{emoji} *Daily Outreach Summary — {datetime.now().strftime('%b %d')}*

📤 Emails sent: {stats.get('emails_sent', 0)}
💬 SMS sent: {stats.get('sms_sent', 0)}
✅ Positive replies: {stats.get('positive_replies', 0)}
🚫 Unsubscribes: {stats.get('unsubscribes', 0)}
📍 City: {stats.get('city', 'Unknown')} ({stats.get('city_index', 0)}/365)
👤 New contacts added: {stats.get('contacts_created', 0)}

{f"🔥 *HOT LEADS: Check Reply Feed!*" if stats.get('positive_replies', 0) > 0 else ""}
Dashboard: https://avadashboard.summitvoiceai.com"""
    
    requests.post(webhook, json={"text": message}, timeout=5)

# Add this call at the end of run_daily_outreach():
# send_daily_slack_summary(stats)
```

---

## PART 8: FINAL VERIFICATION CHECKLIST

Run all checks. Log pass/fail for each.

```
[ ] Railway: /health returns {"status":"ok"}
[ ] Demo build: real roofing URL → polished website in <10 min
[ ] Website quality: looks like Dan's GitHub template (not generic HTML)
[ ] Voice widget: appears in bottom right of demo page
[ ] Dashboard: loads at https://avadashboard.summitvoiceai.com
[ ] Dashboard WebSocket: shows "● Live" in top bar
[ ] Slack: message to #ava-dispatch triggers demo build
[ ] Slack: daily outreach summary arrives at 9am
[ ] GHL: all 15 workflows published
[ ] GHL: AI Intent Detection in Reply Router workflow
[ ] GHL: AI Agent writes dynamic responses (not static templates)
[ ] Content generator: produces JSON with all 5 platforms on Monday
[ ] Ingest endpoints: scraper posts update dashboard home stats
[ ] Hot lead: positive reply appears in Reply Feed within 15 min
```

---

## WRITE FINAL_COMPLETE.txt

Create: `C:\Users\DanGi\Downloads\SummitVoiceAiWorkflowsandDemoMachine\FINAL_COMPLETE.txt`

Include:
- Every URL (Railway, Vercel, Dashboard)
- Slack setup status
- Workflows: published count
- Daily schedule (what runs when)
- HOW TO USE: step-by-step for Dan's daily workflow
- Revenue projection at current outreach volume
