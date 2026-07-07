# Summit Voice AI — Full AI Agent Empire Build Guide
### Replace Every Employee. Automate Everything. Run on Autopilot.
**Updated: April 9, 2026 — Includes Claude Managed Agents (just launched)**

---

## WHAT JUST DROPPED — READ THIS FIRST

Yesterday Anthropic launched **Claude Managed Agents** (April 8, 2026).

This is the biggest announcement in AI agent history for a solo operator like you.

Here's what it means in plain English:

- You define the task, the tools, the rules
- Claude runs it on Anthropic's own infrastructure
- It runs for **hours** without you touching it
- It uses **MCP servers** to connect to GHL, Gmail, LinkedIn, Facebook — everything
- Multiple agents can spin up and **direct other agents** to parallelize work
- Sessions persist even through disconnections
- You don't need to host anything

Your buddy's Claude doing GHL work via Dispatch? That's one agent, one session, one task at a time. Managed Agents means you spin up an **entire workforce** that runs on schedule every single day.

**This is the unlock. Everything below shows you exactly how to build it.**

---

## THE FULL STACK YOU'RE BUILDING

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE MANAGED AGENTS                     │
│              (Orchestrator / Command Center)                  │
└────────────┬──────────┬──────────┬──────────┬───────────────┘
             │          │          │          │
     ┌───────▼──┐  ┌────▼────┐  ┌─▼──────┐  ┌▼──────────┐
     │ GHL MCP  │  │LinkedIn │  │Facebook│  │ Instagram │
     │ Agent    │  │ Agent   │  │ Agent  │  │ Agent     │
     │ (primary)│  │(20/day) │  │(20/day)│  │(20/day)   │
     └───────┬──┘  └─────────┘  └────────┘  └───────────┘
             │
     ┌───────▼──────────────────────────────────────┐
     │            GoHighLevel Sub-Account            │
     │         (Summit Marketing Group)              │
     │                                               │
     │  315,000 Contacts → Pull 100/day              │
     │  Send Email + SMS per contact                 │
     │  Log activity back to contact                 │
     │  Create opportunities in pipeline            │
     │  Book appointments → Calendly                │
     └───────────────────────────────────────────────┘
```

---

## PHASE 1: CONNECT CLAUDE DESKTOP TO GHL VIA MCP
### Do This First — It's Your Foundation

### Step 1: Generate Your GHL Private Integration Token

1. Log into **GoHighLevel → Summit Marketing Group sub-account**
2. Go to **Settings → Private Integrations**
3. Click **Create New Integration**
4. Name it: `Claude MCP Agent`
5. Enable these scopes:
   - ✅ View/Edit Contacts
   - ✅ View/Edit Conversations
   - ✅ View/Edit Calendars
   - ✅ View/Edit Opportunities/Pipelines
   - ✅ View/Edit Tags
   - ✅ View Custom Fields
   - ✅ Send SMS
   - ✅ Send Email
   - ✅ View Workflows
6. Click **Create** — copy the token **immediately** (shown only once)
7. Go to **Settings → Business Profile** — copy your **Location ID**

Save both somewhere safe:
```
PIT Token: pit-XXXXXXXXXX
Location ID: u1lprxdJy1vmuaHEVJRM
```

---

### Step 2: Connect GHL MCP to Claude Desktop

**Option A — Official GHL MCP (recommended, easiest)**

Open Claude Desktop config file:
- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add this block:

```json
{
  "mcpServers": {
    "ghl": {
      "url": "https://services.leadconnectorhq.com/mcp/",
      "headers": {
        "Authorization": "Bearer YOUR_PIT_TOKEN_HERE",
        "locationId": "u1lprxdJy1vmuaHEVJRM"
      }
    }
  }
}
```

Replace `YOUR_PIT_TOKEN_HERE` with your actual token. Save. Restart Claude Desktop.

**Option B — Community MCP with 461 tools (more powerful)**

```bash
# Clone the extended GHL MCP repo
git clone https://github.com/BusyBee3333/Go-High-Level-MCP-2026-Complete.git
cd Go-High-Level-MCP-2026-Complete
npm install

# Create .env file
echo "GHL_API_KEY=your_pit_token_here" > .env
echo "GHL_LOCATION_ID=u1lprxdJy1vmuaHEVJRM" >> .env

# Build
npm run build
```

Then add to claude_desktop_config.json:
```json
{
  "mcpServers": {
    "ghl-full": {
      "command": "node",
      "args": ["/path/to/Go-High-Level-MCP-2026-Complete/dist/server.js"],
      "env": {
        "GHL_API_KEY": "your_pit_token",
        "GHL_LOCATION_ID": "u1lprxdJy1vmuaHEVJRM"
      }
    }
  }
}
```

**GitHub:** https://github.com/mastanley13/GoHighLevel-MCP (269 tools)
**Extended:** https://github.com/BusyBee3333/Go-High-Level-MCP-2026-Complete (461 tools)
**Official GHL docs:** https://marketplace.gohighlevel.com/docs/other/mcp/index.html
**Setup tutorial:** https://automatedmarketer.net/how-to-connect-claude-code-to-gohighlevel-using-mcp-step-by-step-setup/

---

### Step 3: Test It

Open Claude Desktop. Type:

```
Pull the first 10 contacts from my GHL sub-account and show me their name, phone, email, and last contact date.
```

If it works — you're connected. GHL is now fully controllable via natural language.

---

## PHASE 2: INSTALL CLAUDE CODE (YOUR AGENT BUILDER)

Claude Code is the CLI tool where you build and run your actual agent workflows.

### Install

```bash
npm install -g @anthropic-ai/claude-code
```

### Authenticate

```bash
anthropic auth login
```

Browser opens → log in with your Anthropic account.

### Enable Agent Teams (Multi-Agent Mode)

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Add this to your `.bashrc` or `.zshrc` so it persists.

Or add to Claude Code's `settings.json`:
```json
{
  "agentTeams": true,
  "model": "claude-opus-4-6"
}
```

**Claude Code docs:** https://code.claude.com/docs/en/sub-agents

---

## PHASE 3: BUILD YOUR OUTREACH AGENT (THE MONEY MAKER)

This is your daily GHL outreach machine. 100 contacts/day, email + SMS, auto-logged.

### Create Your CLAUDE.md (Agent Brain File)

Create a folder: `C:\Users\DanGi\outreach\summit-agent\`

Create `CLAUDE.md` inside it:

```markdown
# Summit Voice AI — Outreach Agent

## Who I Am
I am Dan Gill's AI outreach agent for Summit Voice AI / Summit Marketing Group.
I sell Ava, an AI voice receptionist, to roofing businesses at $497-997/month.

## My Voice & Style
- Direct. Short sentences.
- Never salesy. Never template-feeling.
- Hormozi-style value framing.
- Roofing owner to roofing owner energy.
- No em dashes. Use ellipses.
- Lowercase subject lines.
- Proper sentence caps everywhere else.
- No product name (Ava) on first touch.

## Key Numbers I Always Use
- Average roofing job: $9,500
- Missed calls per year: 1,095–1,825
- Annual missed revenue: $1.56M–$8.67M
- "You're missing 3–8 calls a day"
- "That's $50–100K walking out the door every year"
- Booking link: calendly.com/aivoice/call
- Pricing: as little as $16/day

## Daily Task
1. Pull 100 uncontacted or cold contacts from GHL tagged as roofing businesses
2. For each contact: send 1 email + 1 SMS using the approved templates
3. Log the outreach activity back to the contact record
4. If contact has replied, flag for manual review and DO NOT send
5. If contact has opted out, skip
6. Create an opportunity in the pipeline for each newly contacted lead
7. At end of run, generate a summary report of today's activity

## GHL Credentials
- Location ID: u1lprxdJy1vmuaHEVJRM
- MCP server connected via config
```

### Create Your Email Template File

`C:\Users\DanGi\outreach\summit-agent\templates\email_day0.txt`

```
subject: missed calls

hey [first name],

quick question — what happens when a customer calls your roofing business and nobody answers?

most of the time? they call the next guy on the list.

roofing owners are missing 3–8 calls a day without realizing it. that's anywhere from $50–100k walking out the door every year based on a $9,500 average job.

i've been in roofing for 10 years. i know how it is. you're on a job, you can't pick up, the phone rings and you hope they leave a voicemail.

they don't.

i built something that fixes this. worth a quick look?

—dan
```

### Create Your SMS Template File

`C:\Users\DanGi\outreach\summit-agent\templates\sms_day0.txt`

```
Hey [first name] — quick question. What do you do when a customer calls and you can't answer? I built something for roofing businesses that handles this. Worth a 15 min call? — Dan
```

### Create the Agent Script

`C:\Users\DanGi\outreach\summit-agent\run_outreach.md`

```markdown
# Daily Outreach Run

## Task
Run today's outreach batch against my GoHighLevel CRM.

## Steps

### 1. Pull contacts
- Search GHL contacts with tag: "roofing"
- Filter: last_contacted is null OR last_contacted > 14 days ago
- Filter: opted_out = false
- Limit: 100 contacts
- Sort by: date_added descending

### 2. For each contact
- Substitute [first name] in email and SMS templates
- Send email using GHL conversations API
- Send SMS using GHL SMS API
- Add tag: "outreach_day0_[today's date]"
- Log a note: "Outreach Day 0 — email + SMS sent [timestamp]"
- Create opportunity in pipeline "Cold Outreach" stage "New Lead" if not exists

### 3. Skip if
- Contact has replied in last 14 days
- Contact has tag: "opted_out" or "not_interested" or "do_not_contact"
- Contact has no phone number AND no email

### 4. End of run report
Generate a summary:
- Contacts processed: X
- Emails sent: X
- SMS sent: X
- Skipped (opted out): X
- Skipped (recently contacted): X
- New opportunities created: X
```

### Run It

Navigate to your agent folder:
```bash
cd C:\Users\DanGi\outreach\summit-agent
claude
```

Then type:
```
Run the daily outreach batch. Use run_outreach.md as your task guide. Reference CLAUDE.md for voice and context. Templates are in /templates folder. Connect to GHL via MCP and process all 100 contacts.
```

Watch it work. GHL will show the sent messages and logged notes in real time.

---

## PHASE 4: SCHEDULE IT DAILY (HANDS-OFF MODE)

### Option A — Windows Task Scheduler (Simplest)

1. Open **Task Scheduler** on your Windows machine
2. Click **Create Basic Task**
3. Name: `Summit Daily Outreach`
4. Trigger: **Daily** → 8:00 AM
5. Action: **Start a Program**
6. Program: `cmd.exe`
7. Arguments:
```
/c "cd C:\Users\DanGi\outreach\summit-agent && claude --print "Run the daily outreach batch. Use run_outreach.md as your task guide." > C:\Users\DanGi\outreach\logs\outreach_log_%date%.txt 2>&1"
```

### Option B — Claude Code SDK (Programmatic, More Reliable)

Install the SDK:
```bash
npm install @anthropic-ai/claude-code-sdk
```

Create `C:\Users\DanGi\outreach\scheduler.js`:

```javascript
const { query } = require("@anthropic-ai/claude-code-sdk");
const fs = require("fs");
const path = require("path");

async function runDailyOutreach() {
  const today = new Date().toISOString().split("T")[0];
  const logFile = path.join(__dirname, "logs", `outreach_${today}.txt`);
  
  console.log(`Starting daily outreach run: ${today}`);
  
  const prompt = `
    Navigate to C:\\Users\\DanGi\\outreach\\summit-agent
    Run the daily outreach batch as specified in run_outreach.md
    Use CLAUDE.md for voice and context
    Templates are in the templates folder
    Connect to GHL via MCP and process 100 contacts
    When done, print a summary report
  `;

  let output = "";
  
  for await (const message of query({ prompt, options: { maxTurns: 50 } })) {
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if (block.type === "text") {
          output += block.text + "\n";
        }
      }
    }
  }
  
  fs.writeFileSync(logFile, output);
  console.log(`Outreach complete. Log saved to ${logFile}`);
}

runDailyOutreach().catch(console.error);
```

Schedule it with:
```bash
node scheduler.js
```

Or add to Windows Task Scheduler pointing to `node C:\Users\DanGi\outreach\scheduler.js`

### Option C — Claude Managed Agents (Most Powerful, New as of 4/8/26)

This runs on Anthropic's infrastructure. No local machine needed.

```bash
# Install the SDK with managed agents beta
npm install @anthropic-ai/sdk

# Create your managed agent
```

```javascript
const Anthropic = require("@anthropic-ai/sdk");
const client = new Anthropic();

// Create the agent (do this once)
async function createOutreachAgent() {
  const agent = await client.beta.agents.create({
    name: "Summit Daily Outreach Agent",
    model: "claude-opus-4-6",
    system_prompt: `
      You are Dan Gill's daily outreach agent for Summit Voice AI.
      Every day you pull 100 roofing contacts from GHL CRM (Location ID: u1lprxdJy1vmuaHEVJRM)
      and send them personalized emails and SMS messages following the approved templates.
      
      Voice: Direct. Short. Hormozi-style. No em dashes. Lowercase subjects.
      Key stat: roofing owners miss 1,095-1,825 calls/year = $1.56M-$8.67M lost revenue.
      Booking link: calendly.com/aivoice/call
      
      Always log activity back to the contact. Always skip opted-out contacts.
      Always create opportunities for new contacts.
    `,
    tools: [
      // Your GHL MCP tools will be connected here
    ],
    mcp_servers: [
      {
        type: "url",
        url: "https://services.leadconnectorhq.com/mcp/",
        name: "ghl-crm",
        headers: {
          "Authorization": "Bearer YOUR_PIT_TOKEN",
          "locationId": "u1lprxdJy1vmuaHEVJRM"
        }
      }
    ]
  }, {
    headers: { "anthropic-beta": "managed-agents-2026-04-01" }
  });
  
  console.log("Agent created:", agent.id);
  return agent.id;
}

// Run a session (schedule this daily)
async function runDailySession(agentId) {
  const session = await client.beta.agents.sessions.create(agentId, {
    initial_message: "Run today's outreach batch. Pull 100 roofing contacts, send email + SMS, log activity, create opportunities. Generate end-of-run report."
  }, {
    headers: { "anthropic-beta": "managed-agents-2026-04-01" }
  });
  
  console.log("Session started:", session.id);
  
  // Poll for completion
  let status = session.status;
  while (status !== "completed" && status !== "failed") {
    await new Promise(r => setTimeout(r, 5000));
    const updated = await client.beta.agents.sessions.get(agentId, session.id, {
      headers: { "anthropic-beta": "managed-agents-2026-04-01" }
    });
    status = updated.status;
    console.log("Status:", status);
  }
  
  return session;
}
```

**Docs:** https://platform.claude.com/docs/en/managed-agents/overview

---

## PHASE 5: FOLLOW-UP SEQUENCE AUTOMATION

After Day 0 outreach, automate follow-ups using GHL Workflows + Claude for personalization.

### Create These GHL Workflow Triggers

**Workflow 1: Reply Detection**
- Trigger: Contact replies (email or SMS)
- Action: Remove tag "outreach_day0"
- Action: Add tag "replied_positive" OR "replied_negative" (Claude classifies via AI step)
- Action: If positive → add to pipeline "Interested" stage
- Action: If positive → send Calendly link: `calendly.com/aivoice/call`
- Action: Notify Dan via internal notification

**Workflow 2: No Reply Day 3 Follow-up**
- Trigger: Contact has tag "outreach_day0_[date]" AND 3 days have passed AND no reply
- Action: Send Day 3 SMS:
```
Hey [first name] — sent you an email a few days back about missed calls costing roofing businesses $50-100k/year. Still relevant? Happy to show you what we built. — Dan
```

**Workflow 3: Day 7 Email**
- Trigger: 7 days since Day 0 tag, no reply
- Action: Send email:
```
subject: the calls you're not getting

[first name],

the phones you're missing aren't going to voicemail.

they're going to your competitor.

3-8 calls a day × $9,500 average job × 365 days.

the math is brutal.

built a fix for this. 15 minutes and you'll see it.

[calendly link]

—dan
```

---

## PHASE 6: SOCIAL MEDIA AGENT (LinkedIn/Instagram/Facebook)

**Important note:** Social automation carries ToS risk on Meta platforms. Start slow — 5-10/day — then scale up. LinkedIn is most tolerant.

### LinkedIn Agent (via Browser Automation)

Install Playwright for browser control:
```bash
npm install playwright
npx playwright install
```

Create `C:\Users\DanGi\outreach\linkedin-agent\run_linkedin.md`:

```markdown
# LinkedIn Daily Outreach

## Task
Send 20 connection requests or messages to roofing business owners on LinkedIn.

## For Connection Requests (cold)
Search: "roofing" "owner" OR "president" OR "CEO" site:linkedin.com
Filter: 2nd degree connections
Send connection request with note:
"Hey [name] — fellow industry person here. Building something for roofing businesses around missed calls and follow-up. Would love to connect and share what we found."

## For Existing Connections (warm)
Filter: connections in roofing industry not yet messaged
Send:
"Hey [name] — been meaning to reach out. You running into the issue where jobs fall through because calls don't get answered? We've been working on this for a while. Worth a quick chat?"

## Limit: 20 per day total (connections + messages combined)
## Log all activity in linkedin_log.csv
```

### Facebook Ad Library Scraper Agent

This is high-value — people running ads are spending money = they want more leads.

```markdown
# Facebook Ad Library Outreach

## Task
Find roofing businesses currently running Facebook ads and add them to GHL CRM.

## Steps
1. Go to: https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=roofing&search_type=keyword_unordered
2. Scroll through active roofing ads
3. For each: note the business name, page URL, ad copy
4. Search for their business contact info (website, phone, email)
5. Create contact in GHL with:
   - Tag: "fb_ad_running" + "high_intent"
   - Note: "Running Facebook ad as of [date]: [ad description]"
   - Source: "Facebook Ad Library"
6. Add to outreach queue for Day 0 sequence

## Volume: 20 new contacts per day
## These contacts get a slightly different first message referencing their ads
```

Custom first touch for Ad Library leads:
```
subject: saw your ads

hey [first name],

noticed you're running ads for [business name]. respect the hustle.

running ads but missing inbound calls from those leads is a brutal combination. every unanswered call is money you already paid for.

built something that handles this 24/7. works while you're on the roof.

worth a look?

—dan
```

---

## PHASE 7: CONTENT CREATION AGENT

Run this separately from outreach — 1x/week or daily depending on your goals.

### Create content agent skill file

`C:\Users\DanGi\outreach\content-agent\CLAUDE.md`:

```markdown
# Summit Voice AI Content Agent

## My Job
Create weekly content for LinkedIn, Facebook, Instagram, and email list.
Dan's brand: roofing industry veteran who built AI for roofers.
Voice: direct, no fluff, story-driven, Hormozi-influenced.

## Content Pillars
1. Missed revenue / missed calls (primary hook)
2. Industry insight — how roofing businesses operate
3. Client wins and case studies
4. Behind the scenes building Summit Voice AI
5. Contrarian takes on AI in trades/field services

## Formats
- LinkedIn: 3x/week — 150-300 word posts, no hashtags, story format
- Facebook: 5x/week — mix of posts + group engagement comments
- Instagram: 3x/week — short caption + CTA, save for later angle
- Email: 1x/week — story + value + soft sell

## Key Stats to Use
- 67% of calls to small businesses go unanswered
- $9,500 average roofing job
- 1,095–1,825 missed calls/year
- $1.56M–$8.67M annual missed revenue
- "as little as $16/day"

## Always End With
A soft call to action: "want to see how it works?" → calendly.com/aivoice/call
```

Run it:
```bash
cd C:\Users\DanGi\outreach\content-agent
claude
```

Prompt:
```
Create this week's full content calendar:
- 3 LinkedIn posts (Mon/Wed/Fri)
- 5 Facebook posts
- 3 Instagram captions
- 1 email newsletter

Use CLAUDE.md for voice and brand rules. Output each piece in a separate file in /output folder with the platform and date in the filename.
```

---

## PHASE 8: FULL AGENT TEAM ARCHITECTURE

This is the complete system once everything is running.

### Agent Roster

| Agent | Job | Runs | Tool |
|-------|-----|------|------|
| **Outreach Commander** | Orchestrates all agents, reviews daily reports | Daily 7am | Claude Managed Agents |
| **GHL Email/SMS Agent** | 100 contacts/day email + SMS | Daily 8am | GHL MCP |
| **LinkedIn Agent** | 20 DMs/connections per day | Daily 9am | Browser automation |
| **Facebook Agent** | 20 DMs + group posts | Daily 9:30am | Browser automation |
| **Instagram Agent** | 20 DMs | Daily 10am | Browser automation |
| **Ad Library Scout** | Find 20 businesses running ads | Daily 8am | Browser + GHL MCP |
| **Reply Handler** | Classify replies, route positive to Dan, route negative to exit | Real-time | GHL Webhook + Claude |
| **Content Creator** | Weekly content for all platforms | Sunday 9am | Claude Code |
| **Appointment Setter** | Follow up with warm leads, push Calendly | Daily 2pm | GHL MCP |
| **Daily Report Agent** | Summarize all activity, highlight top opportunities | Daily 6pm | GHL MCP |

### Enable Agent Teams in Claude Code

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
claude
```

Prompt to spawn your full team:
```
Spawn an agent team to run Summit Voice AI's daily operations:

Team Lead: Daily Ops Commander — orchestrates all work, reviews reports

Teammate 1 — GHL Outreach Agent: Pull 100 roofing contacts from GHL, send email + SMS using approved templates, log activity. Use GHL MCP tools. Reference /outreach/templates for message copy.

Teammate 2 — Ad Library Scout: Scrape Facebook Ad Library for active roofing businesses, add them to GHL with tag "fb_ad_running", prepare for tomorrow's outreach queue.

Teammate 3 — Content Creator: Create today's LinkedIn post and Facebook post. Use /content-agent/CLAUDE.md for brand voice. Save outputs to /content/output/[today's date]/

Have all teammates report back to Team Lead when complete. Team Lead generates daily summary report.
```

---

## PHASE 9: GITHUB REPOS AND RESOURCES — EVERYTHING THAT'S WORKING

### GHL + Claude Automation
- **GHL MCP Official docs:** https://marketplace.gohighlevel.com/docs/other/mcp/index.html
- **GHL MCP setup guide (step-by-step):** https://automatedmarketer.net/how-to-connect-claude-code-to-gohighlevel-using-mcp-step-by-step-setup/
- **GitHub — 269 GHL tools:** https://github.com/mastanley13/GoHighLevel-MCP
- **GitHub — 461 GHL tools (extended):** https://github.com/BusyBee3333/Go-High-Level-MCP-2026-Complete

### Claude Managed Agents
- **Official announcement:** https://claude.com/blog/claude-managed-agents
- **API docs:** https://platform.claude.com/docs/en/managed-agents/overview
- **Get multi-agent access (research preview):** http://claude.com/form/claude-managed-agents

### Claude Code — Agent Teams & Multi-Agent
- **Sub-agents docs:** https://code.claude.com/docs/en/sub-agents
- **Agent Teams guide:** https://claudefa.st/blog/guide/agents/agent-teams
- **Ultimate Claude Code guide (GitHub):** https://github.com/FlorianBruniaux/claude-code-ultimate-guide
- **Multi-agent orchestration options:** https://shipyard.build/blog/claude-code-multi-agent/
- **Multiclaude (multi-session):** https://github.com/dlorenc/multiclaude

### Business Automation with Agents
- **Agentic marketing agency playbook:** https://stormy.ai/blog/build-agentic-marketing-agency-claude-code-2026
- **Social media manager agent system:** https://wealthytent.com/claude-code-8
- **Marketer's guide to Claude Code 2026:** https://stormy.ai/blog/2026-marketers-guide-to-claude-code-agentic-automation

### Your Buddy's Reference
- **stevenflanagan1/Claude-Code-Content-Team:** https://github.com/stevenflanagan1/Claude-Code-Content-Team
- **NicholasSpisak/second-brain:** https://github.com/NicholasSpisak/second-brain

### Other Useful MCPs to Add
- **Gmail MCP** — your already have it connected → for monitoring replies
- **Calendly MCP** — you already have it connected → booking confirmation automation
- **Apollo MCP** — you already have it connected → pull new roofing contacts when needed

---

## PHASE 10: COST BREAKDOWN

| Tool | Cost | What You Get |
|------|------|-------------|
| Claude Max | $200/mo | Unlimited agent runs, Opus 4.6, Agent Teams |
| Claude Managed Agents | API usage based | ~$0.10-0.30 per full outreach session |
| GHL | Already paying | 315K contacts, email, SMS, pipelines |
| Apollo.io | $99-149/mo | Fresh contacts when you need more |
| **Total** | **~$350-400/mo** | **Full AI workforce running 24/7** |

Daily output at scale:
- 100 GHL emails + 100 GHL SMS = 200 outreach touchpoints
- 20 LinkedIn + 20 FB + 20 IG = 60 social touchpoints
- 20 high-intent Ad Library leads added to CRM
- Total: **280 new touches per day, 7 days/week = 1,960/week**

At even a 1% booking rate → 19-20 sales calls per week.
At 20% close rate → 3-4 new clients/week.
At $497 minimum → $1,500-2,000 MRR added per week.

---

## YOUR IMMEDIATE NEXT 5 ACTIONS

**Right now, today:**

1. **Generate your GHL Private Integration Token** (10 min)
   - Settings → Private Integrations → Create New → copy token

2. **Add GHL MCP to Claude Desktop config** (5 min)
   - Use the JSON block from Phase 1, Step 2

3. **Test by asking Claude Desktop:** "Pull my last 10 GHL contacts" (2 min)

4. **Create your CLAUDE.md and templates folder** (20 min)
   - Copy the templates from Phase 3 above
   - Customize with your actual voice and any tweaks

5. **Run first manual outreach batch** (watch it work)
   - Open Claude Desktop or Claude Code
   - Paste the outreach prompt from Phase 3

Once that first manual run works → automate the schedule using Phase 4.

---

## TEACH MODE / SCREEN SHARE FLOW

Your buddy's Claude watched him work and documented the process. You can do the same.

When you're ready to have Claude learn your exact process:

**Prompt to start teach mode:**
```
I want to show you exactly how I manually do outreach in GoHighLevel so you can replicate it perfectly. I'm going to screen share and walk through one complete outreach sequence on a real contact — every click, every field, every step. Watch what I do, ask questions if anything is unclear, and document it as a complete automation blueprint that we'll use to build the n8n workflow and GHL automation. Ready?
```

Then walk through it live. Claude builds the blueprint from observation, not from your memory.

---

## DONE.

You now have everything:
- GHL MCP → Claude Desktop connected and working
- Daily outreach agent → 100 contacts, email + SMS
- Follow-up sequences → Day 3, Day 7, Day 14
- Social agents → LinkedIn, FB, IG, Ad Library
- Content creation agent → weekly autopilot
- Agent Teams → full AI workforce running in parallel
- Claude Managed Agents → cloud-hosted, runs without your machine
- Full cost breakdown and ROI math
- Every GitHub repo and link you need
- Step-by-step from zero to running

The technology is all here. The leads are in your CRM.
Now go build it.
