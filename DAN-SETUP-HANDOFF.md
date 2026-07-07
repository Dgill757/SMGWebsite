# Antigravity System Handoff — Dan's Setup Guide

**What this is:** A complete duplication of Richard's Claude Code + Antigravity AI setup. By the end of this guide you'll have the exact same system — same skills, same MCP tools, same knowledge base, same workspace structure, same global instructions.

**Time to complete:** ~1.5–2 hours (mostly waiting for installs and API key approvals)

---

## What You're Getting

| Component | What it does |
|---|---|
| Claude Code | AI coding assistant CLI + desktop app (the main interface) |
| Playwright MCP | Browser automation — Claude controls a live browser |
| Perplexity MCP | Web search and research inside Claude |
| Gemini MCP | Gemini as a worker (vision, multimodal, video analysis) |
| Creator-RAG MCP | Knowledge base — searchable YouTube transcripts (Nick Saraev courses) |
| 18 Skills | Pre-built workflows: lead scraping, cold email, content repurposing, etc. |
| Antigravity Workspace | 3-layer architecture: directives → orchestration → execution |
| CLAUDE.md | Global instructions that prime every Claude session with context |

---

## Step 1 — Install the Basics

### Claude Code Desktop App
Download from **claude.ai/code** — install it, sign in with your Anthropic account.

If you don't have an Anthropic account, create one at console.anthropic.com. Claude Code requires a Pro or API subscription.

### Node.js
Download from **nodejs.org** — get v18 or newer. Run `node -v` in terminal to verify.

### Python
Download from **python.org** — get 3.10 or newer. Run `python --version` in terminal to verify.

### VS Code (if not installed)
Download from **code.visualstudio.com**.

**VS Code Extension:** Open VS Code → Extensions (Ctrl+Shift+X) → Search "Claude Code" → Install the Anthropic extension. This embeds Claude Code directly in VS Code with clickable file links.

---

## Step 2 — Create Your API Keys

You need these accounts. Get each API key and save it somewhere — you'll paste them into `.env` files below.

| Service | Used For | Where to sign up | Free tier? |
|---|---|---|---|
| Anthropic | Claude Code itself | console.anthropic.com | Pay per token |
| OpenAI | Creator-RAG embeddings | platform.openai.com | $5 free credit |
| Pinecone | Creator-RAG vector database | pinecone.io | Free (1 index) |
| Perplexity | Web search MCP | perplexity.ai/api | Pay per call |
| Google (Gemini) | Gemini MCP | aistudio.google.com | Free tier |
| Vayne | LinkedIn lead scraping | usevayne.com | Paid |
| AnyMailFinder | Email enrichment | anymailfinder.com | Paid |
| Instantly | Cold email campaigns | instantly.ai | Paid |
| Webshare | Proxy for scraping | webshare.io | Free tier |

**You do NOT need all of these on day one.** Priority order:
1. OpenAI + Pinecone (for creator-RAG knowledge base — most useful daily)
2. Perplexity (cheap, extremely useful for research)
3. Gemini (free, great for vision/video tasks)
4. Playwright works with no API key — just needs Edge/Chrome installed
5. Vayne + AnyMailFinder + Instantly only if you'll do lead scraping / cold email outreach

---

## Step 3 — Set Up the Creator-RAG Knowledge Base

This is a local Python server that runs the Nick Saraev knowledge base. It lets Claude search through YouTube transcripts from Nick's courses.

### 3a — Clone or copy the project

Create the folder structure:
```
C:\Users\<yourname>\projects\creator-rag\
```

Copy all files from Richard's `C:\Users\richa\projects\creator-rag\` into your folder.
(Richard will zip and send this to you, or you can clone it from the shared repo if one exists.)

### 3b — Install Python dependencies

Open terminal in the creator-rag folder:
```bash
pip install -r requirements.txt
```

If there's no requirements.txt, install manually:
```bash
pip install mcp fastmcp openai pinecone-client python-dotenv requests
```

### 3c — Create the .env file

In `C:\Users\<yourname>\projects\creator-rag\` create a file called `.env`:

```
OPENAI_API_KEY=your_openai_key_here
PINECONE_API_KEY=your_pinecone_key_here
PINECONE_INDEX_NAME=creator-rag
WEBSHARE_PROXY_USERNAME=your_webshare_username
WEBSHARE_PROXY_PASSWORD=your_webshare_password
```

### 3d — Create a Pinecone index

1. Log into pinecone.io
2. Create a new index named `creator-rag`
3. Dimensions: **1536** (matches OpenAI text-embedding-ada-002)
4. Metric: **cosine**

### 3e — Ingest the knowledge base

Once your index is created and `.env` is configured, ingest the Nick Saraev YouTube videos by telling Claude Code:
```
Ingest this YouTube video into the creator-rag knowledge base: [youtube URL]
```

Richard will share his list of ingested videos so you can batch-ingest the same content.

---

## Step 4 — Configure All MCP Servers

MCP servers are plugins that give Claude Code extra tools. They're configured in a single file.

**Create or edit:** `C:\Users\<yourname>\.mcp.json`

```json
{
  "mcpServers": {
    "creator-rag": {
      "command": "C:/Users/<yourname>/projects/creator-rag/venv/Scripts/python.exe",
      "args": [
        "C:/Users/<yourname>/projects/creator-rag/server.py"
      ]
    },
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--browser",
        "msedge"
      ]
    },
    "perplexity": {
      "command": "npx",
      "args": [
        "-y",
        "server-perplexity-ask"
      ],
      "env": {
        "PERPLEXITY_API_KEY": "your_perplexity_key_here"
      }
    },
    "gemini": {
      "command": "npx",
      "args": [
        "-y",
        "@fre4x/gemini"
      ],
      "env": {
        "GEMINI_API_KEY": "your_gemini_key_here"
      }
    }
  }
}
```

**Replace `<yourname>` with your Windows username throughout.**

> **Using Chrome instead of Edge?** Replace `"msedge"` with `"chrome"`.

> **Python path note:** If you're not using a venv, the path for creator-rag is just:
> `"command": "python"` and `"args": ["C:/Users/<yourname>/projects/creator-rag/server.py"]`

**Test each MCP works:**
- Playwright: Ask Claude "open a browser and go to google.com" — a browser window should open
- Perplexity: Ask Claude "search the web for today's AI news" — it should return live results
- Gemini: Ask Claude "use Gemini to describe this image: [attach an image]"
- Creator-RAG: Ask Claude "search the knowledge base for tips on Claude Code MCP servers"

---

## Step 5 — Install the 18 Skills

Skills are pre-built workflows that Claude can invoke with a slash command.

### 5a — Copy the skills folder

Copy Richard's entire `C:\Users\richa\.claude\skills\` folder to:
```
C:\Users\<yourname>\.claude\skills\
```

You should have these 18 skill folders:
```
agent-chatrooms/
amazon-shopping/
cold-email-campaigns/        ← requires Instantly API key
content-repurposer/
follow-up-nurture/
inbox-cleaner/
invoice-extractor/
lead-scraper/                ← requires Vayne + AnyMailFinder + Google Sheets API
meeting-notes/
model-chat/
prompt-contracts/
reverse-prompting/
stochastic-multi-agent-consensus/
subagent-verification-loops/
thumbnail-generator/
video-to-action/
website-builder/
wework-booking/
```

### 5b — Update skill-level .env files

Some skills have their own `.env` files with API keys. After copying the folder, update these:

**`lead-scraper/.env`:**
```
VAYNE_API_KEY=your_vayne_key
ANYMAILFINDER_API_KEY=your_anymailfinder_key
GOOGLE_APPLICATION_CREDENTIALS=config/credentials.json
```

**`cold-email-campaigns/.env`** (if it has one):
```
INSTANTLY_API_KEY=your_instantly_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### 5c — How to use skills

In Claude Code, type `/` to see available skills. For example:
- `/lead-scraper` — starts the LinkedIn lead scraping workflow
- `/cold-email-campaigns` — creates cold email campaigns in Instantly
- `/content-repurposer` — repurposes content across formats
- `/website-builder` — builds landing pages

---

## Step 6 — Set Up the Antigravity Workspace

### 6a — Create the folder structure

```
C:\Users\<yourname>\projects\antigravity-workspace\
  directives\
  executions\
  tmp\
```

### 6b — Create the 3 directive files

**`directives\agents.md`** — paste this exactly:

```markdown
# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- Basically just SOPs written in Markdown, live in `directives/`
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- This is you. Your job: intelligent routing.
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings
- You're the glue between intent and execution.

**Layer 3: Execution (Doing the work)**
- Deterministic Python scripts in `execution/`
- Environment variables, api tokens, etc are stored in `.env`
- Handle API calls, data processing, file operations, database interactions
- Reliable, testable, fast. Use scripts instead of manual work.

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. The solution is push complexity into deterministic code.

## Operating Principles

**1. Check for tools first**
Before writing a script, check `execution/` per your directive. Only create new scripts if none exist.

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the script and test it again
- Update the directive with what you learned

**3. Update directives as you learn**
Directives are living documents. When you discover API constraints, better approaches, common errors — update the directive.

## File Organization

- `.tmp/` — All intermediate files. Never commit, always regenerated.
- `execution/` — Python scripts (the deterministic tools)
- `directives/` — SOPs in Markdown (the instruction set)
- `.env` — Environment variables and API keys

## Built-in Directive Triggers

| Trigger phrases | Directive to load |
|----------------|-------------------|
| "build me a website", "let's build a website", "build a landing page" | `~/projects/antigravity-workspace/directives/website_builder.md` |
```

**`directives\daily_briefing.md`** — paste this exactly:

```markdown
# Daily Briefing — Antigravity Startup Routine

Run this at the start of every work session.

## YOUR JOB
Surface exactly what needs focus today. Be a filter, not a firehose.
One clear priority. No fluff.

## STEPS

1. **Check sprint position**
   - Note the current date and how many days into your current sprint/goal period.
   - State whether you're on track, ahead, or behind on your primary metric.

2. **Review active projects** (in priority order)
   - [Add your projects here as you build them]

3. **Surface today's single most important action**
   - The one thing that, if done, moves the needle most on revenue.

4. **Flag blockers**
   - Anything that will slow progress if not resolved today.

## OUTPUT CONTRACT

Respond in this format only:

---
📅 DAY [X] OF [SPRINT LENGTH] | [X] DAYS REMAINING

🎯 TODAY'S PRIORITY
[Single sentence — the most important thing to do today]

📋 PROJECT PULSE
[One line per active project with status]

🚧 BLOCKERS
[List or "None"]

✅ NON-NEGOTIABLES SCHEDULED?
[Your non-negotiables]: [yes / no / partial]
---
```

**`directives\reviewer.md`** — paste this exactly:

```markdown
# Reviewer Subagent — Antigravity

You are a reviewer. You have no context about how the work you are reviewing was produced.
Treat it like you found it on the internet. You have zero bias toward it.

## YOUR JOB

Review the deliverable passed to you and answer three questions:
1. Is it correct and complete?
2. Are there any errors, gaps, or inconsistencies?
3. Is there anything that would embarrass the business or confuse a client if they saw it?

## REVIEW CHECKLIST

- [ ] Does it do what was asked?
- [ ] Are there logical errors or contradictions?
- [ ] Is the tone appropriate for the audience (client-facing vs internal)?
- [ ] Are there missing steps or assumptions that aren't stated?
- [ ] Would a non-expert understand it?
- [ ] Is there anything that could be simplified without losing quality?

## OUTPUT CONTRACT

Respond in this format only:

---
VERDICT: [APPROVED / NEEDS_REVISION]

ISSUES:
- [Issue 1 — be specific, not vague]
- (or "None" if approved)

SUGGESTED FIXES:
- [Fix for Issue 1]
- (or "N/A" if approved)
---

Pass your output to the resolver if NEEDS_REVISION. Stop if APPROVED.
```

---

## Step 7 — Create Your CLAUDE.md

This is the most important file. It loads automatically at the start of every Claude Code session and primes Claude with your full context — who you are, what you do, how you work.

**Location:** `C:\Users\<yourname>\.claude\CLAUDE.md`

Start with this template, then fill in your own details:

```markdown
# Global Agent Instructions — [Your Name] / [Your Company]

These rules apply to every project and session.

---

## WHO I AM

[Your name, location, and role. What you're building. Your primary goal.]

## COMPANY

[Company name, what it does, who you serve, core problems you solve.]

## DECISION FILTER

Before any recommendation:
1. Does this accelerate revenue now? If no, deprioritize.
2. Is it operationally realistic?
3. Does it serve the actual goal?

## HOW I WORK BEST

[Your working style, what you need help with, what to avoid.]

## COMMUNICATION STYLE

- Direct and concise — no preamble
- Flag tradeoffs clearly
- When corrected, note it and adjust

## WORKSPACE

Primary workspace: `~/projects/antigravity-workspace/`
- `directives/` — SOPs and instructions
- `executions/` — Python scripts
- `tmp/` — scratch pad

## MCP SERVERS

| Server | Purpose |
|---|---|
| `creator-rag` | Nick Saraev knowledge base |
| `playwright` | Browser automation |
| `perplexity` | Web research |
| `gemini` | Gemini vision/multimodal |

## ACTIVE PROJECTS

| Project | Description |
|---|---|
| creator-rag | Nick Saraev YouTube knowledge base |

## AGENT OPERATING RULES

- Always use specific prompts
- Run `/context` to check window usage, `/compact` to compress when near limit
- Reviewer subagent runs automatically on any client-facing deliverable
```

**Key tip:** The more specific and honest your CLAUDE.md is, the better every session gets. Add your actual projects, your actual pain points, your actual goals. This is what makes Richard's setup feel like a personal assistant rather than a generic chatbot.

---

## Step 8 — Create Your MANUAL.md

This is the canonical reference for your own setup. Update it whenever you add anything.

**Location:** `C:\Users\<yourname>\projects\antigravity-workspace\MANUAL.md`

```markdown
# Antigravity Setup Manual

Last updated: [today's date]

## MCP Servers
- creator-rag: ~/projects/creator-rag/ (Pinecone + OpenAI embeddings, Nick Saraev knowledge base)
- playwright: npx @playwright/mcp@latest (browser automation)
- perplexity: npx server-perplexity-ask (web research)
- gemini: npx @fre4x/gemini (Gemini vision/multimodal)

## Skills (18 installed)
Located at ~/.claude/skills/
agent-chatrooms, amazon-shopping, cold-email-campaigns, content-repurposer,
follow-up-nurture, inbox-cleaner, invoice-extractor, lead-scraper,
meeting-notes, model-chat, prompt-contracts, reverse-prompting,
stochastic-multi-agent-consensus, subagent-verification-loops,
thumbnail-generator, video-to-action, website-builder, wework-booking

## Workspace
~/projects/antigravity-workspace/
- directives/ — SOPs and instructions
- executions/ — Python scripts
- tmp/ — scratch pad

## Projects
- creator-rag: ~/projects/creator-rag/ — Nick Saraev knowledge base
```

---

## Step 9 — Verify Everything Works

Run through this checklist in a new Claude Code session:

```
[ ] Claude Code opens and responds
[ ] Type /lead-scraper — does it show the skill?
[ ] Type /cold-email-campaigns — does it show the skill?
[ ] Ask "open google.com in a browser" — does Edge open?
[ ] Ask "search the web for Claude Code MCP" — does Perplexity return results?
[ ] Ask "search the knowledge base for agentic workflows" — does creator-rag respond?
[ ] Ask "run the daily briefing" — does it output the formatted briefing?
```

---

## File Map — What Lives Where

```
C:\Users\<yourname>\
  .mcp.json                          ← MCP server config (all 4 servers)
  .claude\
    CLAUDE.md                        ← Global instructions (loaded every session)
    skills\
      cold-email-campaigns\
      lead-scraper\
      content-repurposer\
      ... (15 more skill folders)

C:\Users\<yourname>\projects\
  antigravity-workspace\
    MANUAL.md                        ← Your canonical setup reference
    directives\
      agents.md                      ← 3-layer architecture instructions
      daily_briefing.md              ← Morning startup routine
      reviewer.md                    ← Subagent reviewer template
    executions\                      ← Python scripts go here
    tmp\                             ← Scratch pad (auto-cleared)
  creator-rag\
    server.py                        ← MCP server entry point
    .env                             ← OpenAI + Pinecone keys
    query.py
    ingest_youtube.py
    requirements.txt
```

---

## API Keys Reference Sheet

Print this and fill it in as you collect keys:

```
Anthropic (Claude Code):     ____________________________________
OpenAI (creator-rag):        ____________________________________
Pinecone (creator-rag):      ____________________________________
Perplexity (MCP):            ____________________________________
Gemini (MCP):                ____________________________________
Vayne (lead-scraper):        ____________________________________
AnyMailFinder (lead-scraper):____________________________________
Instantly (cold email):      ____________________________________
Webshare proxy user:         ____________________________________
Webshare proxy pass:         ____________________________________
```

---

## Skills Reference — What Each One Does

| Skill | Trigger | What it does | APIs needed |
|---|---|---|---|
| agent-chatrooms | /agent-chatrooms | Multi-agent discussion panels | Anthropic only |
| amazon-shopping | /amazon-shopping | Research and find Amazon products | Playwright |
| cold-email-campaigns | /cold-email-campaigns | Create campaigns in Instantly from client brief | Instantly + Anthropic |
| content-repurposer | /content-repurposer | Repurpose content (podcast → tweets, blog, etc.) | Anthropic only |
| follow-up-nurture | /follow-up-nurture | Build follow-up sequences | Anthropic only |
| inbox-cleaner | /inbox-cleaner | Triage and clean email inbox | Playwright |
| invoice-extractor | /invoice-extractor | Extract data from invoice PDFs | Anthropic only |
| lead-scraper | /lead-scraper | LinkedIn scrape + email enrichment → Google Sheet | Vayne + AnyMailFinder + Google |
| meeting-notes | /meeting-notes | Summarize meeting transcripts | Anthropic only |
| model-chat | /model-chat | Chat with any model (Opus, Sonnet, Haiku) | Anthropic only |
| prompt-contracts | /prompt-contracts | Build structured prompts with output contracts | Anthropic only |
| reverse-prompting | /reverse-prompting | Generate a prompt from an example output | Anthropic only |
| stochastic-multi-agent-consensus | /stochastic-multi-agent-consensus | Multi-agent voting/consensus on decisions | Anthropic only |
| subagent-verification-loops | /subagent-verification-loops | Build self-verifying agent pipelines | Anthropic only |
| thumbnail-generator | /thumbnail-generator | Generate YouTube thumbnail concepts | Gemini |
| video-to-action | /video-to-action | Extract action items from video transcripts | creator-rag or transcript |
| website-builder | /website-builder | Build landing pages from a brief | Anthropic + Playwright |
| wework-booking | /wework-booking | Book WeWork rooms | Playwright |

---

## Common First-Session Commands

```
"Run the daily briefing"
"Search the knowledge base for [topic]"
"Open a browser and go to [url]"
"Use perplexity to research [topic]"
"Use gemini to analyze this image: [attach image]"
"/lead-scraper"
"/cold-email-campaigns"
```

---

## Questions? 

Contact Richard: richard@nexuscai.com
```

---

*Assembled by NexusCai — duplicating Richard's Antigravity setup for Dan.*
