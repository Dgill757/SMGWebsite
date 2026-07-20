# PACKAGE 0 — YOUR ACTION RUNBOOK

Everything in Package 0 that only you can do. Do these in order. Each has a "why" and a
"how to verify." Nothing here needs you to write code.

---

## ACTION 1 — Rotate the GHL private token (most important)

**Why:** your GoHighLevel token (`pit-a1c9342a…`) was in public dashboard HTML for weeks and is in
public git history. It's the key to 315,000 contacts and your pipelines. It must be replaced so the
leaked value becomes worthless.

**How:**
1. Go to **app.gohighlevel.com** → log in.
2. Left sidebar → **Settings** (bottom) → **Private Integrations** (in some accounts it's under
   **Business Profile → API Keys / Integrations**).
3. Find the existing integration/token whose value starts `pit-a1c9342a`. Click it → **Delete /
   Revoke**. Confirm.
4. Click **Create new integration** → give it a name (e.g. `summit-api`) → grant the same scopes
   (Contacts, Conversations, Opportunities, Social Planner) → **Create**.
5. Copy the new token (starts `pit-`).

**Then update it everywhere it's used — 2 places:**
- **Railway:** dashboard → your API service → **Variables** → edit `GHL_PRIVATE_TOKEN` → paste new
  value → save (Railway auto-redeploys).
- **Your global `CLAUDE.md`** (`C:\Users\DanGi\.claude\CLAUDE.md`): it currently has the old token
  in plain text. Replace it with the new one, or better, replace it with the text
  `(stored in Railway env GHL_PRIVATE_TOKEN)` so it's never in a file again.
- Any local scripts in `C:\Users\DanGi\scripts\` or `C:\Users\DanGi\outreach\` that read the token
  from `.env` — just update the `.env` value; no code change.

**Verify:** in the dashboard, load a tab that shows GHL data (pipeline/replies). If it still loads,
the new token works. If it 401s, a scope is missing — recreate with all scopes.

---

## ACTION 2 — Rotate the AVA API key / dashboard access code

**Why:** the AVA key `101226ee…` (also your old dashboard login code) is in public git history 12
times. Anyone with it can call your API.

**How:**
1. Pick a new strong value (random, 24+ chars). You can generate one: in PowerShell run
   `python -c "import secrets; print(secrets.token_hex(24))"`.
2. **Railway** → API service → **Variables**:
   - Set `AVA_API_KEY` to the new value (this is what local scripts use).
   - Set `DASHBOARD_PASSWORDS` to a comma-separated list of the login code(s) you'll type into the
     dashboard. Make this different from `AVA_API_KEY`. Example: `DASHBOARD_PASSWORDS=<your-new-code>`.
   - Save (auto-redeploys).
3. Update the `.env` on your PC (and in `C:\Users\DanGi\scripts\`) so local scripts send the new
   `AVA_API_KEY`.

**Verify:** open the dashboard, log in with the new code — works. Try the old code `ava2026` — it's
rejected.

---

## ACTION 3 — Supabase anon key (low urgency — already inert)

**Why:** the anon JWT is in public history, but RLS already revoked its access, so it can read/write
nothing. Optional to rotate.

**If you want belt-and-suspenders:** Supabase dashboard → **Project Settings → API → JWT Settings →
Rotate JWT secret.** ⚠️ This invalidates **all** keys (anon *and* service). After rotating you must
update `SUPABASE_KEY` (service key) in Railway and in every local script's `.env`, or everything
that touches the DB breaks. Only do this if you're ready to update all of them in one sitting.
Otherwise, leave it — it's already harmless.

---

## ACTION 4 — Deploy the API hardening (coordinated — read fully first)

The security code I wrote (commit `9ee214b`) is **not live until you deploy Railway.** But one part
is a breaking change if done in the wrong order. Do it like this:

**Step 1 — deploy the new code.** Push/deploy the repo to Railway (however you normally do — likely
Railway auto-deploys from GitHub on push, or you run `railway up`). This immediately gives you:
- `/dispatch`: rate limiting + daily build cap + URL validation (non-breaking — your GHL workflows
  keep working).
- `/demos/create`: now requires the key (your dashboard already sends it — non-breaking).
- 12 read endpoints: now require the key (dashboard sends it — non-breaking).
- CORS locked to your dashboard domains.

**Step 2 — verify nothing broke.**
- Open the dashboard — every tab still loads. (If a tab breaks, tell me which; likely a CORS origin
  I need to add to `ALLOWED_ORIGINS`.)
- `curl -X POST https://ava-studio-api-production.up.railway.app/demos/create -H "Content-Type: application/json" -d '{}'`
  → should return **401** (no key). Good.
- Your GHL demo/audit triggers still fire (build a test demo through the normal flow).

**Step 3 — (optional, later) fully lock `/dispatch`.** Right now `/dispatch` still accepts
unauthenticated calls (just rate-limited and capped). To require a key on it too:
1. In **every GHL workflow** that POSTs to `.../dispatch`, add a custom header
   `x-api-key: <your AVA_API_KEY>` to the webhook action.
2. Update the local `daily_outreach.py` (in `C:\Users\DanGi\outreach\`) to send the same header.
3. Only after both are done: set Railway variable `DISPATCH_REQUIRE_KEY=1` and redeploy.
4. Verify a GHL trigger still builds a demo. If it does, `/dispatch` is now fully locked.

Do Step 3 only when you have 20 minutes to update the callers. Steps 1–2 are the urgent part.

---

## ACTION 5 — Check your Anthropic spend around the "credit too low" error

**Why:** you hit an HTTP 400 "credit balance too low," and `/dispatch` was unauthenticated and could
burn credits. We want to know: normal usage, or abuse? I can't see your Anthropic billing from here —
here's exactly where to look.

**How:**
1. Go to **console.anthropic.com** → sign in.
2. Left sidebar → **Usage** (or **Billing → Usage**).
3. Set the date range to the two weeks around when you got the error.
4. Look at the **daily** cost/token graph. You're looking for:
   - **Normal:** a steady, low daily line (~$0.20–0.60/day matches the ~$6–12/month the ops manual
     expects), maybe a spike on a heavy build day.
   - **Abuse:** a sudden cliff — one day (or a few hours) far above every other day, especially
     outside your working hours or on a day you weren't building demos.
5. Also check **Billing → Activity/Invoices** for the exact date the balance hit zero.

**What to tell me:** the shape of that graph (steady vs one big spike, and roughly the date). From
that I can tell you whether it reads as organic growth or someone hammering `/dispatch`. Either way,
the rate limit + daily cap I just added prevents a repeat.

**Also turn on the safety net:** Billing → enable **Auto-reload** with a **monthly cap** you're
comfortable with (e.g. $50). That way Jarvis and the agents never die mid-task, but a runaway can't
drain your card.

---

## Quick status of what's already done (code side, by me)

| Item | State |
|---|---|
| Insecure dashboards archived, deploy config repointed | ✅ committed `e571835` |
| API auth + rate limit + CORS hardening | ✅ committed `9ee214b` — **needs your Railway deploy** |
| `security_check.py` scrubbed of real secrets | ✅ committed `5d5c0d1` |
| Deployment-truth audit written | ✅ `docs/DEPLOYMENT_TRUTH.md` |
| GHL / AVA key rotation | ⏳ **you** — Actions 1 & 2 |
| Railway deploy of the hardening | ⏳ **you** — Action 4 |
| Anthropic usage check | ⏳ **you** — Action 5 |
