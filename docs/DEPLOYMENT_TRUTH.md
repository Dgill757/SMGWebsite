# DEPLOYMENT TRUTH

**Purpose:** the failure mode that hurts you most isn't a bug — it's *believing something is
running when it isn't.* Your last audit found a security fix you thought was live while the deploy
config pointed at the old file the whole time. This document is the antidote: for every piece of
deployed infrastructure, here is **what you probably think is running** vs **what is actually
running**, and whether they match.

**Last verified:** 2026-07-20. Re-check this whenever you change a deploy config.

**How to read the verdict column:** ✅ match · ⚠️ mismatch or unverified · 🔴 wrong/dangerous.

---

## 1. Vercel — the dashboard

| | |
|---|---|
| **What you likely think** | "My dashboard deploys from the repo. `vercel.json` in the root controls it." |
| **What's actually true** | The live site at `avastudio.summitvoiceai.com` is served from the **`vercel_deploy/` subfolder**, which has its own linked Vercel project (`vercel_deploy/.vercel/`, gitignored so it's invisible in the repo). The **root `vercel.json` was orphaned** and pointed at the *old insecure* `index.html`. |
| **How I verified** | Fetched the live URL's raw source. Title = `Summit OS — CEO Command Center` (the secure v8 file), it uses the `/db/` proxy, and contains **no** database key and **no** plaintext password. That matches `vercel_deploy/index.html`, not the root file. |
| **Verdict** | ✅ **The GOOD dashboard is live.** My first-draft audit said "the wrong one may be live" — that was wrong; verifying against the live site corrected it. This is exactly why we check live, not local. |
| **The real risk (now fixed)** | The root `index.html` (insecure v6, with a Supabase key + password `ava2026` in the source) still existed in the public repo, and the root `vercel.json` was configured to deploy it. If you'd ever run `vercel --prod` from the repo root, you'd have replaced the good dashboard with the insecure one. **Fixed in commit `e571835`:** insecure file archived, root `vercel.json` repointed at the secure file. |
| **You should verify yourself** | Open `avastudio.summitvoiceai.com`, right-click → View Source, Ctrl+F for `eyJ` and `PASS=`. Both should be absent. (I confirmed this on 2026-07-20.) |

**Open question only you can answer:** how do you actually deploy the dashboard today — do you run
`vercel` from inside `vercel_deploy/`, or does Vercel auto-deploy from a connected GitHub repo? If
it's GitHub auto-deploy, tell me which project and branch, because then the *root* config matters
and we need to make the connected project build `vercel_deploy/index.html`.

---

## 2. Railway — the API

| | |
|---|---|
| **What you likely think** | "Railway runs my API. Both files look like the API." |
| **What's actually true** | Railway runs **`ava_demo_studio_api.py`** (confirmed: `Procfile` and `railway.json` both say `uvicorn ava_demo_studio_api:app`). The other file, **`ava_demo_studio_COMPLETE_API.py`, is stale and runs nowhere** — a trap for a future edit. |
| **Verdict** | ✅ Deploy target is unambiguous and correct. ⚠️ But the stale twin is a landmine — an edit there would silently do nothing. |
| **Important** | The security hardening I just wrote (commit `9ee214b`) is **in the code but NOT live** until you deploy Railway. See the runbook below. Until you deploy, `/dispatch` is still open, `/demos/create` is still unauthenticated, and CORS is still `*`. |
| **You should verify yourself** | After deploying: `curl https://ava-studio-api-production.up.railway.app/health` returns ok, then the verification commands in the runbook. |

---

## 3. GitHub — the repository

| | |
|---|---|
| **What you likely think** | "My code is on GitHub. The secrets are gitignored." |
| **What's actually true** | Repo `github.com/Dgill757/SMGWebsite` is **public** (returns HTTP 200 unauthenticated). Current `.env` is correctly gitignored. **But three credentials are baked into git history** (commit `4e26cd0` and others) and history is public: the Supabase anon JWT (~7 times), the AVA API key `101226ee…` (~12 times), and the GHL private token `pit-a1c9342a…` (once). |
| **Verdict** | 🔴 Secrets are in public git history. |
| **The critical truth** | **Making the repo private does NOT fix this.** Anyone who already cloned or forked it keeps the history, and private repos can be made public by accident later. Git history rewriting (BFG/filter-repo) can scrub it, but the only *reliable* fix is **rotating every exposed key** so the leaked values become worthless. Rotation is mandatory; history-scrubbing is optional cleanup on top. |
| **Exposed → action** | Supabase anon JWT → already inert via RLS (anon has zero access); rotate JWT secret only if you want belt-and-suspenders. AVA API key → rotate (see runbook). GHL token → rotate (see runbook). No real `sk-ant-` Anthropic key is in history (only a placeholder `sk-ant-NEWKEY`), which is good. |

---

## 4. Supabase — the database

| | |
|---|---|
| **What you likely think** | "RLS is on, the anon key is revoked, the database is locked down." |
| **What's actually true** | Per `SUPABASE_RLS.sql` (applied 2026-07-06), RLS is enabled on 10 tables and the wide-open anon policies were dropped, so the anon key has zero access. The dashboard reaches data only through the Railway `/db` proxy (which uses the service key server-side and enforces a table allowlist). |
| **Verdict** | ✅ Architecture is correct **if the SQL was actually applied to the live project.** The file says it was applied via the Supabase MCP; I could not independently confirm against the live database in this session. |
| **You should verify yourself** | Supabase dashboard → your project → **Authentication → Policies** (or **Database → Tables**, look for the RLS shield icon). Confirm RLS shows **enabled** on: `hot_leads`, `scraper_runs`, `outreach_runs`, `ghl_activity`, `agent_status`, `demos`, `activity_log`, `morning_intelligence`, `business_analysis`, `website_build_queue`. If any shows disabled, that table is exposed. |

---

## 5. Windows Task Scheduler — the agent fleet (⚠️ the big one)

| | |
|---|---|
| **What you likely think** | "My automations run every day. The business runs itself." |
| **What's actually true** | Per `OPS_MANUAL.md`, ~11 scheduled jobs run on **your personal PC** via Windows Task Scheduler (6am scraper, 9am outreach, 9:15 follow-ups, reply monitor every 15 min, weekly content, research, client manager, weekly report, etc.). **They only run while your PC is powered on and awake.** Several are also marked BLOCKED in the ops manual (Slack webhook, Slybroadcast RVM, HeyGen) and silently do nothing. |
| **Verdict** | 🔴 "Runs itself" is not true. It "runs itself *while your laptop is open.*" Close the lid for a trip and scraping, follow-ups, and reply monitoring stop — with no alert telling you they stopped. |
| **Scripts also live outside this repo** | The actual scheduled copies are in `C:\Users\DanGi\scripts\` and `C:\Users\DanGi\outreach\` (per your global instructions), **not** in this repo. So the repo is not the source of truth for what's scheduled — the two local folders are. That split is itself a risk. |
| **The fix** | This is Package 1 (get the business off your laptop + a heartbeat that tells you when a job fails). It's promoted ahead of Jarvis for good reason. Not started yet — flagged here so the truth is on record. |

---

## 6. Things you may believe are working that aren't

- **"The morning briefing runs at 7am."** Per the ops manual it's **BLOCKED** — it needs a Slack
  webhook that was never set. Verify: check whether you actually receive it. If not, it's dead.
- **"RVM drops and HeyGen videos run."** Both marked **BLOCKED** pending credentials. Assume off
  until you confirm.
- **"`/dispatch` is protected now."** Not until you deploy Railway (code is written, commit
  `9ee214b`, not live).
- **"Making the GitHub repo private handled the leaked keys."** No — see section 3. Rotation is
  the only real fix.
- **"There's one dashboard and one API."** There are ~9 archived dashboard versions and a stale
  second API file. Only `vercel_deploy/index.html` and `ava_demo_studio_api.py` are live.

---

## Re-verification checklist (run this monthly)

1. Live dashboard View Source → no `eyJ`, no `PASS=`.
2. `curl <railway>/health` → ok; `curl -X POST <railway>/demos/create` with no key → 401.
3. Supabase → RLS enabled on all 10 tables.
4. GitHub → is the repo still public? Are rotated keys truly rotated?
5. Do you actually receive the morning briefing? If not, it's not running.
6. Are the Task Scheduler jobs green in Task Scheduler, and did they run today?
