# SUMMIT OS — MASTER PLAN

**For:** Dan Gill · Summit Voice AI
**Written:** 2026-07-20
**Status:** Plan only. No code written yet. Read this top to bottom, then tell me what to change.

**The one-line goal we are building toward:** you wake up, open Summit OS, and in sixty
seconds you know what the business did overnight, who needs you, and the single
highest-leverage thing to do today. Then you go sell.

I read the whole JARVIS build guide and your entire Summit OS codebase before writing this.
Where the guide and reality disagree, I say so. Where your plan is too big, I say so.
I am not going to flatter the code. You asked for the truth, so here it is.

---

## TABLE OF CONTENTS

1. [Current State — what Summit OS actually is today](#1-current-state)
2. [The Audit — everything wrong, ranked](#2-the-audit)
3. [The Rebrand Plan — orange to arc-reactor cyan](#3-the-rebrand-plan)
4. [The Jarvis Integration Plan — where it lives, how data flows](#4-the-jarvis-integration-plan)
5. [Build Sequence — ordered, testable work packages](#5-build-sequence)
6. [Everything I Need From You](#6-everything-i-need-from-you)
7. [Honest Pushback — where the plan is wrong](#7-honest-pushback)
8. [The One Thing — if you only build one piece this week](#8-the-one-thing)

---

## 1. CURRENT STATE

### The plain-English version

Summit OS is three separate things wearing one name:

1. **A dashboard** — a single web page (`index.html`) hosted on Vercel at
   `avastudio.summitvoiceai.com`. You log in with a password and see tabs: CEO brief, clients,
   agents, content, pipeline, demos, builds.
2. **An API** — one Python file (`ava_demo_studio_api.py`) running on Railway. It's the engine
   behind the "demo machine" (scrape a roofer's site → audit it → build a demo site → deploy it →
   text/email the roofer), plus all the read endpoints the dashboard calls.
3. **An agent fleet** — about 30 Python scripts that run on *your own PC* on a Windows Task
   Scheduler timer (6am scraper, 9am outreach, reply monitor every 15 min, weekly content, etc.).
   These write their results up to Supabase and GHL, which the dashboard then reads.

The database (Supabase Postgres) is the shared memory that ties the three together.

### The architecture map

```
   YOUR PC (always-on tasks)            THE CLOUD                        YOU
   ─────────────────────────            ─────────                        ───
   Windows Task Scheduler                                          browser →
     6am  Apollo scraper          ┌──────────────────┐            avastudio
     9am  outreach (100/day)      │  VERCEL           │            .summit
     9:15 follow-ups              │  index.html       │◄───────────voiceai.com
     :15  reply monitor           │  (dashboard SPA)  │
     Mon  content generator       └────────┬─────────┘
     etc.                                  │ fetch()
        │                                  ▼
        │ writes            ┌──────────────────────────────┐
        └──────────────────►│  RAILWAY                      │
        │                   │  ava_demo_studio_api.py       │
        │                   │  FastAPI · ~1,860 lines       │
        │                   │  demo machine + read/write API│
        │                   └───────────┬──────────────────┘
        │                               │ service key
        ▼                               ▼
   ┌───────────────────────────────────────────────┐
   │  SUPABASE (Postgres)                            │
   │  leads · demos · voice_agents · scraper_runs    │
   │  outreach_runs · hot_leads · ghl_activity       │
   │  agent_status · activity_log · clients · content│
   └───────────────────────────────────────────────┘
        ▲
        │ (separately) GoHighLevel CRM — 315k contacts, pipelines, workflows
```

### The concrete facts

| Layer | What it is | Where |
|---|---|---|
| **Frontend** | Single-file HTML + vanilla JavaScript. No React, no build step, no framework. Colors are already CSS variables in a `:root` block. | `index.html` (root, = "v6"), and a newer secure copy at `vercel_deploy/index.html` (= "v8") |
| **Backend** | One FastAPI file. ~50 endpoints. Auth = a shared password sent as `x-api-key`. Demo machine runs as background tasks. | `ava_demo_studio_api.py` on Railway |
| **Database** | Supabase Postgres, ~12 tables. RLS (row-level security) was switched on 2026-07-06. | Supabase project `omdpkeaqgtizakdfughq` |
| **Agents** | ~30 Python scripts, scheduled locally on your PC via Task Scheduler. | Repo root + `C:\Users\DanGi\scripts\` |
| **CRM** | GoHighLevel — contacts, pipelines, 15 workflows. | External SaaS |
| **Deploy** | Vercel (static frontend) + Railway (API). Both auto-restart. | `vercel.json`, `railway.json`, `Procfile` |

### What the codebase looks like from the outside

88 tracked files. Roughly 11 different versions of the dashboard HTML (`summit_os.html`,
`summit_os_v3` through `v8`, `ava_studio_FINAL.html`, `index.html`, `vercel_deploy/index.html`).
Two versions of the API (`ava_demo_studio_api.py` live, `ava_demo_studio_COMPLETE_API.py` stale).
Three copies of `template_cloner`. Dozens of status/handoff notes (`EVERYTHING_DONE.txt`,
`EVERYTHING_DONE_V2.txt`, `SYSTEM_LIVE.txt`, `BUILD_COMPLETE.txt`…). This is the normal residue
of building fast and solo. It's not dangerous, but it makes the repo hard to reason about, and it
will make a technical buyer wince. We clean it in the build sequence.

---

## 2. THE AUDIT

Ranked by how much it matters. I'm not softening these.

### 🔴 CRITICAL — fix before anything else

**A1. Two dashboards exist and the wrong one may be live.**
Your `vercel.json` at the repo root says "build and serve `index.html`." That root `index.html`
is the *old v6* dashboard. It talks **directly to Supabase** using a hardcoded key and gates
entry with a password written in plain JavaScript: `var PASS='ava2026'`. Anyone who opens the
page, right-clicks, and picks "View Source" can read that password. That is not a lock. It's a
sign that says "lock."

The *secure* dashboard is the separate file `vercel_deploy/index.html` (v8). It has no database
key in it — it routes everything through the Railway API, which checks the password on the
server where nobody can see it. That is the correct design.

**The problem: your repo is configured to deploy the insecure one.** Depending on how you last
ran `vercel`, either (a) the insecure v6 is live and the client-side password is your only gate,
or (b) the secure v8 is live and root `index.html` is just misleading dead weight. Either way,
one file has to win and the other has to go. This is finding #1 for a reason.

**A2. The Supabase database key is published in a public GitHub repo.**
Your repo `github.com/Dgill757/SMGWebsite` is public. The file `index.html` in it contains the
Supabase "anon" key in plain text. The good news: you revoked that key's access on 2026-07-06
(RLS lockdown), so today it can't read or write anything — it's a dead key. The bad news: it
should never have been committed, and it's still sitting in your git history for anyone to find.
Dead keys teach bad habits and a technical buyer will find it in thirty seconds.

**A3. The `/dispatch` endpoint has no authentication.**
Anyone who knows your Railway URL can send it a command to build a demo site. Each demo build
burns Firecrawl credits, Anthropic credits, and a Vercel deploy. There's no rate limit and no
key check on that route. A bored person with your URL could run your Anthropic bill to zero in an
afternoon. It's currently unauthenticated on purpose (GHL workflows call it), but it needs a
shared secret in the URL or header that GHL sends and strangers don't have.

**A4. Your live GHL private token needs rotating — and it's in your global instructions file.**
Your prior audit flagged that the GoHighLevel token was exposed in the public dashboard HTML for
weeks (~June 25 onward). It was removed from the page, but the note says it was never rotated. A
GHL token is the key to 315,000 contacts and your pipelines. It must be regenerated. Separately,
that same token is sitting in plain text in your global `CLAUDE.md` instructions file — which is
convenient for you but is exactly the kind of file that gets shared or screenshotted.

### 🟠 SERIOUS — fix soon, before Jarvis touches anything

**A5. CORS is wide open.** The API sets `allow_origins=["*"]`, meaning any website on the
internet is allowed to make browser calls to your API. Combined with the password-in-header auth,
this widens the blast radius of a leaked password. Lock it to your own domains.

**A6. Auth is a shared password, not real user accounts.** There is one password for the whole
system. That's tolerable for a solo founder today. It is *not* tolerable once Jarvis can send
emails, spend money, and act on your CRM — because a leaked password then equals someone
operating your business. Jarvis needs real login (Supabase Auth is already in your stack and is
the cheapest path).

**A7. Demo build state lives only in memory.** When Railway restarts (which it does), any
in-progress demo build loses its status and the dashboard shows a 404 mid-build. Your last
session added a Supabase fallback for this, which helps, but the core pattern is still fragile.
Not urgent, but it's the kind of thing that looks broken to a client watching a demo generate.

### 🟡 WORTH DOING — hygiene and cost

**A8. Massive duplication.** ~11 dashboard versions, 2 API versions, 3 `template_cloner`
copies, `voice_ai_automation` + `_v2`, `premium_website_generator` + `_v2`. Nobody, including a
future you, can tell which file is real. Pick the live one, archive the rest into an `/archive`
folder (don't delete — you may want the history), and commit that as its own cleanup.

**A9. Documentation sprawl.** ~25 overlapping status/handoff `.txt`/`.md` files at the root.
They contradict each other because they were snapshots in time. Collapse them into one `README.md`
and one `OPS_MANUAL.md` (which you already have and is genuinely good), archive the rest.

**A10. The agent fleet is single-machine.** Every scheduled agent runs on *your PC*. If your
PC is off, asleep, or you're travelling, the business stops scraping, stops following up, stops
monitoring replies. This is the biggest hidden fragility in the whole system, and it directly
contradicts "everything else must run without me." Not a Jarvis problem to solve today, but flag
it: the agents should move to cloud cron (Railway or a scheduled job runner) eventually.

### 🟢 GENUINELY GOOD — leave it alone

- The **demo machine** is a real, working, valuable pipeline. Don't touch its core.
- The **fail-closed auth helper** (`verify_api_key` raising 503 when no password is configured
  instead of falling back to a default) is correctly designed. Good instinct.
- **Model routing** (Haiku for extraction, Sonnet for customer-facing) is the right cost pattern
  and keeps your Anthropic bill at ~$6–12/month. Keep it.
- **OPS_MANUAL.md** is clear and accurate. It's the one doc worth keeping as-is.
- Moving the dashboard to route DB writes **through the API with a service key** (the v8/`/db`
  proxy design) is exactly right. That's the pattern Jarvis should use too.

---

## 3. THE REBRAND PLAN

### The good news you weren't expecting

Your dashboard **already uses design tokens.** Every color is defined once in a `:root` CSS block
and referenced everywhere as `var(--acc)`, `var(--bg)`, etc. That is precisely the structure the
JARVIS brief asks for. So the rebrand is mostly **changing about 15 values in one place**, not
hunting through thousands of lines. This is a half-day job, not a week.

### What actually has to change

**Step 1 — Swap the token values.** In the live dashboard's `:root` block, replace the current
palette with the arc-reactor palette:

| Token | Old (orange/black) | New (arc reactor) |
|---|---|---|
| `--bg` | `#0D0D12` | `#070B14` |
| `--s1` / surfaces | `#13131A`, `#1A1A24`, `#22222E` | `#0E1626`, `#111C30`, panels |
| `--acc` (primary) | `#E8612C` orange | `#3BE8FF` cyan |
| accent hover | — | `#1D9FB8` |
| `--grn` | `#22C55E` | `#41F5A0` |
| `--yel` (warning) | `#F59E0B` | `#FFB020` amber |
| `--red` | `#EF4444` | `#FF6B6B` |
| `--txt` / `--txt2` / `--txt3` | white ramps | `#E7EEFA` / `#8DA0BF` / `#5F718F` |
| borders | `rgba(255,255,255,.07)` | `#1B2942` / `#26405F` |

**Step 2 — Hunt the stragglers.** A handful of colors are hardcoded *outside* the token block —
mostly badge colors (LinkedIn blue `#0A66C2`, a pink `#EC4899`, an indigo `#6366F1`) and the six
literal `232,97,44` orange RGBA values used for shadows and glows. I'll find every one and either
tokenize it or convert it. I'll give you the exact list of what changed.

**Step 3 — Add the fonts.** Load Chakra Petch (headings), keep Inter (body), add JetBrains Mono
(data/labels). One `<link>` tag. Then point headings at Chakra Petch and data labels at the mono
font.

**Step 4 — Add the HUD texture (optional, tasteful).** The faint grid overlay, the slow
scanline, corner brackets on panels, scroll-reveal. All of it copied conceptually from the JARVIS
HTML's CSS. All of it wrapped in `@media (prefers-reduced-motion: reduce)` so it turns off for
anyone who needs it. This is the part that makes it *feel* like a command center instead of an
admin panel. It's cosmetic and reversible.

### How we keep it safe and reversible

- **One commit, nothing else in it.** The rebrand is its own commit with a message like
  `style: arc-reactor rebrand (colors only, no logic)`. If you hate it, one `git revert` and it's
  gone, with zero risk to any feature.
- **Keep the old palette.** I'll leave the old orange values in the file as a commented-out block
  labelled `/* LEGACY PALETTE — delete after 2 weeks if the rebrand sticks */`. Instant manual
  rollback without even touching git.
- **Contrast check.** Dark themes fail accessibility easily. Cyan `#3BE8FF` on navy `#070B14` is
  strong (passes). The risk color is `--muted-2` `#5F718F` on the darkest background — I'll verify
  every text/background pair hits at least the readable threshold and bump any that don't. Clients
  see these screens; they need to be legible.
- **No logic touched.** If I find a place where a color is tangled into JavaScript logic (e.g. a
  status color computed in code), I stop and tell you before refactoring it. The audit didn't find
  any — the color logic is all in CSS — but I'll confirm as I go.

### What could break

Almost nothing, because we're only changing color values. The one real risk: if the *insecure* root
`index.html` is what's live (finding A1), and I rebrand the *secure* `vercel_deploy` version, your
rebrand won't appear until we also fix which file deploys. **So A1 gets resolved first, then the
rebrand.** That ordering matters.

---

## 4. THE JARVIS INTEGRATION PLAN

### First, an honest reconciliation of two conflicting specs

You gave me two documents and they describe **two different products**:

- `PROJECT_JARVIS_Complete_Build.html` describes a **standalone Windows app** — an Electron orb
  floating on your desktop, a local Python server, Obsidian on your machine. It lives on your PC.
- `JARVIS_SUMMIT_OS_PROMPTS.md` describes a **tab inside the Summit OS web dashboard** — you sign
  in on the web and talk to it there.

These can't both be the primary home without building the brain twice. **My recommendation: the
web tab is the product; the desktop orb is a "maybe later" toy.** Reason: the web dashboard is
where you already start your morning, it works from any device, and it needs real auth anyway. The
floating desktop orb is the coolest demo and the least useful daily. We build the brain once, as a
service, and the web tab is its first face. (More on this in Pushback.)

### Where the Jarvis service lives

**A new, separate module — not bolted into the 1,860-line demo API.**

```
   ┌─────────────────────────────────────────────────────────┐
   │  SUMMIT OS DASHBOARD (Vercel)                             │
   │  + new authenticated "JARVIS" tab                         │
   │    · particle orb (Three.js, WebGL, CSS fallback)         │
   │    · streaming chat + push-to-talk mic                    │
   │    · live system panel (clients, agents, who-needs-reply) │
   └───────────────┬─────────────────────────────────────────┘
                   │ WebSocket + HTTPS
                   ▼
   ┌─────────────────────────────────────────────────────────┐
   │  JARVIS SERVICE (new — own folder, own Railway service)   │
   │    /jarvis/chat   text in, streamed answer out            │
   │    /jarvis/voice  audio in, audio out                     │
   │    /jarvis/stream WebSocket: orb state + tokens           │
   │    brain (Claude tool loop) · confirmation gate           │
   │    memory engine (reads the vault)                        │
   └──────┬───────────────────────────────┬──────────────────┘
          │ reuses                          │ reads/writes
          ▼                                 ▼
   ┌────────────────────┐          ┌──────────────────────────┐
   │ EXISTING demo API   │          │  MEMORY VAULT             │
   │ /clients /agents    │          │  markdown files           │
   │ /dispatch etc.      │          │  identity · rules ·        │
   │ (Jarvis calls these │          │  business · voice ·        │
   │  as read-only tools)│          │  clients · memory · logs  │
   └────────────────────┘          └──────────────────────────┘
                                     GHL · Calendar · Email (tools)
```

**Why a separate service, not a module in the existing API:** the demo API is already a single
1,860-line file doing five jobs. Jarvis is a big new brain with tool-calling, streaming, memory,
and a confirmation gate. Jamming it into the same file makes both unmaintainable and means a bug
in Jarvis can take down your demo machine. Separate services fail independently. They share the
same database and Jarvis calls the demo API's existing endpoints as tools.

### The memory vault — one important correction

The brief wants Jarvis's memory in an **Obsidian vault of markdown files**. Obsidian-on-your-PC
works great for a desktop app, but a **cloud web tab and phone/text channels can't reach files on
your sleeping laptop.** So the vault has to live somewhere always-on.

Recommendation: the vault is **markdown files in a git repo / cloud storage the Jarvis service can
read**, and you *optionally* mirror it into Obsidian on your PC for human browsing. Same files,
same format, no lock-in — just hosted where the always-on service can actually read them. This is a
small change to the plan that makes the phone and text channels possible at all.

### Data flow per channel

| Channel | Path | Notes |
|---|---|---|
| **UI chat** | browser → `/jarvis/chat` (WS stream back) → brain → tools → answer | The daily driver. Build this first. |
| **Voice (browser)** | mic → Groq Whisper (speech→text) → same brain → ElevenLabs (text→voice) → speaker | Adds ~2 API keys. Nice, not essential. |
| **Text (Telegram)** | Telegram → long-poll → same brain → reply | Locked to your chat ID. Cheap, genuinely useful from your pocket. |
| **Phone (Twilio)** | call → Twilio → always-on service → same brain → spoken reply | Highest cost, highest security risk. **Cut from v1.** |
| **Scheduled agents** | cron → agent → writes vault + notifies you | This is the actual leverage. |

Every channel funnels into **one brain, one tool set, one confirmation gate.** No duplicated logic.

### What existing code we reuse

- **All the read endpoints** (`/clients`, `/agents/status`, `/analytics/activity-feed`,
  `/ghl/replies/recent`) become Jarvis's read-only tools directly. Zero rewrite.
- **`morning_ceo_briefing.py`** already assembles a briefing — it becomes the backbone of the
  Morning Briefing agent instead of being rebuilt.
- **The `/db` proxy pattern** from the v8 dashboard is exactly how Jarvis should touch Supabase.
- **Model routing config** carries over unchanged.

### Database changes needed

Small. New tables, all with RLS on from day one:

- `jarvis_conversations` (id, user, started_at) and `jarvis_messages` (role, content, tool_calls,
  created_at) — so chat history persists and is searchable.
- `jarvis_pending_actions` (action, preview, status, created_at) — the approve/reject queue that
  makes the confirmation gate real.
- `jarvis_memory` is *files*, not a table — but if we add vector search later, one `embeddings`
  table.

### The risk list

| Risk | Mitigation |
|---|---|
| Jarvis sends something it shouldn't | The confirmation gate is one shared function every action tool must call. Read-only runs free; anything that sends/spends/deletes previews and waits for your explicit yes. Non-negotiable, built first. |
| A leaked password now = someone operating your business | Real auth (Supabase Auth) before any action tool ships. |
| Runaway API cost from a loop | Hard per-day spend cap + the gate on bulk actions. Alert at a threshold you set. |
| New service takes down the demo machine | Separate service, separate deploy. They only share the database. |
| Memory returns noise instead of signal | Start with always-loaded small core files (identity, rules, business summary) + on-demand file reads. Add vector search only if simple retrieval proves too blunt. |

---

## 5. BUILD SEQUENCE

Each package is independently shippable and has a test you can run yourself. Do them in order.
**Packages 0–2 are not Jarvis — they're the cleanup and safety that Jarvis has to stand on.**
Skipping them means building the fun part on a cracked foundation.

### Package 0 — Resolve which dashboard is live + kill the exposed key
- Decide: the secure v8 (`/db` proxy, no key in HTML) is the keeper. Make `vercel.json` deploy
  *that* file. Archive root `index.html`.
- Remove the dead Supabase key from the tracked file so it's not in the public repo going forward.
- **Verify:** open your live dashboard URL, View Source, search for `eyJ` and `PASS=`. Neither
  should appear. Log in — it still works.

### Package 1 — Close the critical security holes
- Add a shared secret to `/dispatch` (GHL sends it, strangers don't have it).
- Lock CORS to `summitvoiceai.com` domains.
- Rotate the GHL token; move it out of `CLAUDE.md` into environment variables only.
- **Verify:** I give you a one-line `curl` that tries to hit `/dispatch` without the secret — it
  should return 401. Your GHL workflows keep working.

### Package 2 — Repo cleanup (its own commit)
- Move the ~10 stale dashboards, the stale API, the duplicate cloners, and the ~20 redundant
  status docs into `/archive`. Keep one README, one OPS_MANUAL.
- **Verify:** `git ls-files` at the root is short and every file is one you can explain.

### Package 3 — The rebrand
- Section 3 above, one commit, old palette kept commented out.
- **Verify:** open the dashboard. It's cyan-on-navy, every tab still works, text is readable.
  `git revert` puts orange back if you hate it.

### Package 4 — Real auth
- Swap the client-side password for Supabase Auth (real login). One account: you.
- **Verify:** log out, try the old password in the URL — denied. Log in with your real
  account — works.

### Package 5 — The memory vault + business context
- Create the vault structure (hosted where the service can read it). Seed identity, rules,
  business context, writing-voice files. Ingest your Sales Playbook and best outreach emails so
  Jarvis writes in your voice.
- **Verify:** ask Jarvis (via a test script) "how do I write cold outreach?" — it should answer in
  your rules (short sentences, no em dashes, no product name on first touch).

### Package 6 — The Jarvis brain + read-only tools (no actions yet)
- The service, the chat endpoint, streaming, memory wiring, and *only* the read-only tools
  (business status, who-needs-a-reply, calendar, running builds).
- **Verify:** `curl` the health endpoint, then ask it "give me a business briefing" — you get a
  real, accurate rundown drawn from your live data.

### Package 7 — The Jarvis tab in the UI
- The new tab: orb, streaming chat, push-to-talk, live system panel. Additive — touches no
  existing page.
- **Verify:** log in, open the Jarvis tab, watch the orb go idle→thinking→speaking as it answers.

### Package 8 — The confirmation gate + first action tools
- The shared gate function. Then draft-a-reply and send-a-reply (the two that matter most), each
  gated.
- **Verify:** ask it to draft a reply — it shows a preview and waits. Approve — it sends. Try to
  make it send without approving — it refuses. This is the most important test in the whole build.

### Package 9 — The Morning Briefing agent
- Reuse `morning_ceo_briefing.py`. Daily 6am: calendar, urgent email, GHL conversations awaiting
  reply ranked by lead score, agent health, running builds. Written to the vault + sent to you.
- **Verify:** run it manually once, read the output. Does it actually tell you who needs you?

### Package 10 — Telegram channel
- Same brain, locked to your chat ID, proactive notifications when something needs your yes.
- **Verify:** text the bot from your phone, get a real answer. Have a friend text it — ignored.

### Package 11+ — Everything else, only if you still want it
- More agents (pipeline watch, content engine, prospect researcher, weekly review).
- Browser voice. Phone channel. Desktop orb. Each is optional and bolts on.

---

## 6. EVERYTHING I NEED FROM YOU

This is the section you said you cared about most. It's a checklist. Do exactly these, in order.
I've marked which package each unblocks so you can do them just-in-time instead of all at once.

### Before Package 0–2 (security & cleanup)

1. **Confirm the live dashboard URL.** Tell me the exact address you open every morning
   (I believe it's `avastudio.summitvoiceai.com`, but confirm). Package 0 needs this.
2. **Confirm the live Railway API URL.** I see `ava-studio-api-production.up.railway.app` in the
   code — confirm that's current.
3. **Decide: is this GitHub repo public or private, and can it become private?** It's public now.
   If it can be private, that removes a whole class of risk instantly. If clients or investors need
   to see it, keep it public and we scrub it instead. Your call — tell me which.
4. **Rotate the GHL token.** Go to GoHighLevel → Settings → **Private Integrations** (or
   Business Profile → API) → find the current token → **regenerate/revoke** → create a new one.
   Paste the new one into Railway's environment variables (see #8), *not* into any file. Then tell
   me it's done so I can confirm nothing still references the old one.

### Before Package 4 (real auth)

5. **Confirm you're OK using Supabase Auth for login.** It's already in your stack and free. The
   alternative is a paid auth provider, which I don't think you need. Default: Supabase Auth.
   Say yes or name a preference.
6. **Pick your login email.** Which email do you want to sign into Summit OS with?
   (`dangill@summitmarketinggroup.co`?)

### Before Package 5 (the memory vault)

7. **Export your Claude conversation history** (optional but high-value). In claude.ai:
   your initials (bottom-left) → **Settings** → **Privacy** → **Export data**. You'll get an email
   with a ZIP link that expires in 24 hours. Download it, unzip to
   `C:\Users\DanGi\Downloads\claude-export\`. This is what lets Jarvis know your past decisions.
8. **Gather your source material** into one folder, `C:\Users\DanGi\Downloads\jarvis-ingest\`:
   - Summit Voice AI Sales Playbook (PDF)
   - Your 5–10 best-performing outreach emails (for voice learning)
   - ICP notes, offer docs, pricing sheets
   - Any SOPs or training material you want it to know
9. **Decide where the vault lives.** My recommendation: a private git repo the Jarvis service can
   read, mirrored into Obsidian on your PC for browsing. If you'd rather it be pure-local Obsidian
   and skip the phone/text channels, tell me — that's a valid, simpler choice.

### Before Package 6 (the brain)

10. **Anthropic API key with credits.** You already have one (the system runs on it). Confirm
    auto-reload is on at console.anthropic.com → Billing, set to a monthly cap you're comfortable
    with. Jarvis will use more than the agents do.
11. **Confirm which environment variables are already set in Railway.** In the Railway dashboard →
    your service → **Variables**, screenshot or list what's there. I need to know what exists
    (`ANTHROPIC_API_KEY`, `GHL_PRIVATE_TOKEN`, `SUPABASE_URL`, `SUPABASE_KEY`, `AVA_API_KEY`,
    `DASHBOARD_PASSWORDS`) before I add the Jarvis service's variables.

### Before Package 9–10 (agents + Telegram) — get these only when we reach them

12. **Calendar access.** Which calendar do you live in — Google or Outlook? (Changes how I wire
    the calendar tool.)
13. **Email access.** Same question — Gmail or Outlook? Jarvis reads and drafts, never sends
    unattended.
14. **Telegram bot** (10 minutes, when we reach Package 10): install Telegram, message
    **@BotFather**, send `/newbot`, follow prompts, copy the token. Then message **@userinfobot**
    to get your numeric chat ID. Both go into Railway variables. I'll walk you through it live.

### Optional / later

15. **Groq API key** (free) — for browser voice. console.groq.com → API Keys.
16. **ElevenLabs API key + voice ID** (free tier) — for the British voice. elevenlabs.io.
17. **Twilio** — only if you decide you want the phone channel, which I recommend cutting from v1.

**That's the whole list.** Nothing here requires you to write code or understand it. Where a step
says "paste into Railway variables," I'll show you the exact screen.

---

## 7. HONEST PUSHBACK

You asked for truth over agreement. Here it is.

**1. You're describing a $50k product to solve a problem two agents already solve.**
The full JARVIS vision — desktop orb, browser voice, Telegram, a real phone number, seven
scheduled agents, a vector-search memory brain — is genuinely cool and it's also mostly a
distraction from the one outcome you actually named: *know what happened overnight, who needs you,
what to do today, then go sell.* That outcome is a **morning briefing plus a reply-triage queue.**
You already have `morning_ceo_briefing.py` and reply monitoring. Ninety percent of the value is in
finishing those two things well. The orb is the last ten percent, and it's the ten percent that
takes the most time.

**2. The desktop Electron orb and the web Jarvis tab are two different products. Pick one.**
Building both means building and maintaining the brain, the voice pipeline, and the UI twice.
Build the web tab. It works from any device, it's where you already start your day, and it forces
the real-auth work you need anyway. Keep the desktop orb on a wish list.

**3. The phone channel is the worst effort-to-value trade in the plan. Cut it from v1.**
A public phone number wired to a system that can act on your business is the single most dangerous
surface you could build, and it needs three separate security layers to be safe. For a solo
founder, "call my own computer from an airport" is a fantasy feature you'll use twice and then
stop. Telegram gives you 90% of the "reach it from my pocket" value at 5% of the risk and cost.
Build Telegram, skip Twilio, revisit in six months if you genuinely miss it.

**4. Voice is a demo feature, not a work feature.** Talking to an orb is impressive for about a
week. Then you'll realize typing is faster and you can do it in a meeting without looking insane.
Build the text chat solidly first. Add voice later if you still want it. Don't let the voice
pipeline (two more API keys, headphone echo problems, streaming TTS complexity) block the tab from
shipping.

**5. The thing you're underestimating: your agents all run on your laptop.** You said everything
must run without you. It doesn't — it runs without you *only while your PC is on.* Travel for three
days with your laptop closed and the scraper, the outreach, the follow-ups, and the reply monitor
all silently stop. No orb fixes that. Moving the agent fleet to cloud cron is more valuable to your
"$100k as one person" goal than anything in the JARVIS brief. I'd put it above voice and phone.

**6. What's genuinely right in your plan:** the confirmation gate as a single shared function; the
vault-as-markdown for memory; reusing your existing endpoints as tools; building read-only before
action tools; and the instinct to audit before building. Those are the load-bearing good decisions
and I wouldn't change any of them.

---

## 8. THE ONE THING

**If you build only one piece in the next week, build the Morning Briefing + "Who Needs a Reply"
queue — delivered to the dashboard and to Telegram — with drafts written in your voice.**

Here's the reasoning, in your own decision-filter terms ("does this directly add clients?"):

- **Speed of reply is the #1 lever on closing roofing leads.** A lead that gets a response in five
  minutes books far more often than one that waits an hour. Right now, you find out who replied
  when you happen to check. If Jarvis hands you a ranked list every morning and every two hours —
  hottest leads first, a draft already written in your voice, one tap to send — you respond faster
  and you book more calls. More booked calls is the entire game.
- **It uses what you already have.** `morning_ceo_briefing.py`, the reply monitor, the GHL data,
  the lead scores — they exist. This is assembly and polish, not a from-scratch build.
- **It's the literal outcome you asked for.** "Wake up, open Summit OS, in sixty seconds know what
  happened, who needs me, and the highest-leverage thing to do." That *is* the morning briefing.
  Everything else in the JARVIS brief is decoration on top of this.
- **It's the safest first build.** Reading data and drafting replies (that you approve before
  sending) has almost no downside risk, so it's the right place to prove the whole Jarvis pattern
  before we ever give it the power to spend money or send things unattended.

The orb, the voice, the phone number — those make it *feel* like Iron Man. This makes you *money*.
Build the money one first. We can make it glow afterward.

---

## WHAT HAPPENS NEXT

Nothing, until you tell me to. This is a plan, not a mandate. Read it, push back on anything that's
wrong, and answer the questions in Section 6 that unblock Package 0. When you're ready, we start
with Package 0 (resolve the live dashboard + kill the exposed key) because it's the fastest, safest
win and it clears the runway for the rebrand and everything after.

My one strong recommendation: **do Packages 0–2 this week regardless of whether you ever build
Jarvis.** They're security and cleanup you need either way, and right now there's a public repo
with a database key in it and an unauthenticated endpoint that can spend your money. That's worth a
few hours no matter what we build next.
