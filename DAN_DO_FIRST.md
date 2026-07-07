# DAN — DO THESE 3 THINGS FIRST (before Session 4)
# Total time: ~15 minutes

---

## STEP 1: PUBLISH THE 8 DRAFT WORKFLOWS (10 minutes)

Claude Code confirmed 8 workflows are drafted but not published.
Each one needs a 2-click toggle + Save.

1. Go to: GHL → Automation → Workflows
2. Sort by: Status = Draft
3. For each draft workflow:
   a. Click to open it
   b. Find the toggle at the top right (says "Draft" or has a toggle switch)
   c. Toggle it to ACTIVE/Published
   d. Click Save or Publish button
   e. Confirm the status shows "Active"
4. Repeat for all 8 draft workflows

The 8 workflows that need publishing (from the build report):
- Check your GHL workflows list — they should be clearly labeled Draft

---

## STEP 2: DEPLOY RAILWAY (1 minute)

The Railway project exists but the code isn't deployed yet. Run this in terminal:

```
cd C:\Users\DanGi\Downloads\SummitVoiceAiWorkflowsandDemoMachine
railway up
```

If it asks you to log in: `railway login` first (opens browser).

When it finishes, Railway shows a URL like:
`https://ava-studio-api-production.up.railway.app`

Test it: open that URL + /health in your browser.
Should show: `{"status":"ok","service":"Ava Demo Studio API"}`

---

## STEP 3: DISABLE VERCEL AUTH ON DEMO PROJECT (2 minutes)

When demos are built, they go to Vercel URLs. If Vercel auth is on,
prospects get a login page instead of the demo. 

1. Go to: vercel.com
2. Find project: ava-demo-studio (the one where demos deploy)
3. Click Settings → Deployment Protection
4. Set to: "Disabled" or "Only Vercel Dashboard"
5. Save

---

## STEP 4: TELL ME YOUR THINKER URL

Before Session 4 starts, answer this one question:

"What is the exact URL you go to when you log into your voice AI platform (THINKRR.ai)?"

It should look like: https://app.thinkrr.ai or https://dashboard.thinkrr.ai or similar.
Check your browser history or bookmarks.

This is the final piece needed to automate voice agent creation.

---

## ALSO GOOD TO HAVE (not blocking)

- Your LinkedIn Sales Navigator: Do you have it? (needed for Vayne)
- Your GitHub Personal Access Token (optional but increases template fetch rate limits)
  Get at: github.com → Settings → Developer settings → Personal access tokens → Classic → Generate
  Scopes needed: just `repo` (read)
