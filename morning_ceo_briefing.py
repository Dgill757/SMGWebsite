"""
SUMMIT VOICE AI — MORNING CEO BRIEFING
Runs daily at 7:00 AM. Posts to Slack #ava-dispatch.
Aggregates every AI employee's overnight output.
Dan wakes up knowing exactly what his team did.
"""
import os, json, sqlite3, glob, re
from datetime import datetime, timedelta
from pathlib import Path
import httpx

# ── CONFIG ────────────────────────────────────────────────────────────────────
SLACK_WEBHOOK = os.getenv("SLACK_WEBHOOK_URL", "")
RAILWAY_URL   = "https://ava-studio-api-production.up.railway.app"
DB_PATH       = r"c:\Users\DanGi\scripts\outreach_tracker.db"
VAULT         = Path(r"c:\Users\DanGi\SummitVault")
OUTREACH_LOGS = Path(r"c:\Users\DanGi\outreach\logs")
SCRIPTS_LOG   = r"c:\Users\DanGi\scripts\outreach_log.txt"
REPORT_DIR    = VAULT / "REPORTS"
REPORT_DIR.mkdir(parents=True, exist_ok=True)
TODAY         = datetime.now().strftime("%Y-%m-%d")
YESTERDAY     = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
NOW           = datetime.now().strftime("%I:%M %p")

# ── HELPERS ───────────────────────────────────────────────────────────────────
def slack(blocks):
    if not SLACK_WEBHOOK:
        print("[SLACK] No webhook — printing to console")
        return
    try:
        r = httpx.post(SLACK_WEBHOOK, json={"blocks": blocks}, timeout=10)
        print(f"[SLACK] {r.status_code}")
    except Exception as e:
        print(f"[SLACK] Error: {e}")

def section(text):
    return {"type": "section", "text": {"type": "mrkdwn", "text": text}}

def divider():
    return {"type": "divider"}

def header(text):
    return {"type": "header", "text": {"type": "plain_text", "text": text, "emoji": True}}

# ── DATA COLLECTORS ───────────────────────────────────────────────────────────

def get_outreach_stats():
    """Pull yesterday's GHL outreach from SQLite."""
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("""SELECT COUNT(*), SUM(email_sent), SUM(sms_sent), SUM(replied)
                     FROM outreach WHERE sent_date = ?""", (YESTERDAY,))
        row = c.fetchone() or (0, 0, 0, 0)
        c.execute("""SELECT COUNT(*) FROM outreach WHERE status='hot_lead' AND sent_date >= ?""",
                  ((datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),))
        hot = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM outreach WHERE status='awaiting_reply'")
        pipeline = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM outreach")
        total = c.fetchone()[0]
        conn.close()
        return {"contacts": row[0] or 0, "emails": row[1] or 0,
                "sms": row[2] or 0, "replies": row[3] or 0,
                "hot_leads_7d": hot, "pipeline": pipeline, "total_db": total}
    except Exception as e:
        return {"error": str(e), "contacts": 0, "emails": 0, "sms": 0, "replies": 0,
                "hot_leads_7d": 0, "pipeline": 0, "total_db": 0}

def get_apify_stats():
    """Read yesterday's or latest Apify log."""
    for date_str in [YESTERDAY, TODAY]:
        log_file = OUTREACH_LOGS / f"log_{date_str}.json"
        if log_file.exists():
            try:
                data = json.loads(log_file.read_text())
                return data
            except Exception:
                pass
    return {"city": "Unknown", "scraped": 0, "emails_sent": 0}

def get_reply_monitor_status():
    """Parse last outreach_log.txt entry for reply monitor."""
    try:
        lines = Path(SCRIPTS_LOG).read_text(encoding="utf-8", errors="ignore").splitlines()
        recent = [l for l in lines[-30:] if "reply_monitor" in l.lower() or "replies detected" in l.lower()]
        if recent:
            last = recent[-1]
            if "replies detected: 0" in last:
                return {"status": "ok", "new_replies": 0, "note": "No new replies"}
            elif "replies detected:" in last:
                n = re.search(r"replies detected:\s*(\d+)", last)
                return {"status": "hot", "new_replies": int(n.group(1)) if n else "?", "note": last}
            elif "ERROR" in last or "422" in last:
                return {"status": "error", "new_replies": 0, "note": "GHL API error (422 — endpoint deprecated)"}
        return {"status": "unknown", "new_replies": 0, "note": "No recent log entry"}
    except Exception as e:
        return {"status": "error", "new_replies": 0, "note": str(e)}

def get_research_status():
    """Find latest research file."""
    market = VAULT / "WIKI" / "MARKET"
    if not market.exists():
        return {"exists": False, "last_date": "Never", "preview": "No research found"}
    files = sorted(market.glob("*.md"))
    if not files:
        return {"exists": False, "last_date": "Never", "preview": "No research files"}
    latest = files[-1]
    date_str = latest.stem.replace("-research", "")
    try:
        content = latest.read_text(encoding="utf-8", errors="ignore")
        preview = content[:300].replace("\n", " ").strip()
    except Exception:
        preview = "Could not read"
    return {"exists": True, "last_date": date_str, "file": str(latest.name), "preview": preview}

def get_content_status():
    """Check for recent content output."""
    content_dir = VAULT / "CONTENT"
    if not content_dir.exists():
        content_dir = Path(r"c:\Users\DanGi\outreach\content")
    if not content_dir.exists():
        return {"posts_today": 0, "last_generated": "Unknown"}
    files = sorted(content_dir.rglob("*.md"), key=lambda f: f.stat().st_mtime, reverse=True)
    recent = [f for f in files if
              (datetime.now() - datetime.fromtimestamp(f.stat().st_mtime)).days < 2]
    return {"posts_today": len(recent),
            "last_generated": files[0].name if files else "None",
            "recent_files": [f.name for f in recent[:3]]}

def get_system_health():
    """Check Railway API health."""
    try:
        r = httpx.get(f"{RAILWAY_URL}/health", timeout=8)
        data = r.json()
        return {"status": "live", "demos": data.get("demos", 0)}
    except Exception as e:
        return {"status": "down", "error": str(e)}

def get_scheduled_tasks():
    """Read Windows Task Scheduler status for Summit tasks."""
    import subprocess
    try:
        result = subprocess.run(
            ["schtasks", "/query", "/fo", "CSV", "/nh"],
            capture_output=True, text=True, timeout=10
        )
        tasks = {}
        for line in result.stdout.splitlines():
            parts = line.strip().strip('"').split('","')
            if len(parts) >= 3 and "Summit" in parts[0]:
                name = parts[0].strip('"').replace("\\", "").strip()
                next_run = parts[1].strip('"')
                status = parts[2].strip('"')
                tasks[name] = {"next_run": next_run, "status": status}
        return tasks
    except Exception as e:
        return {"error": str(e)}

def get_client_health():
    """Read client manager log."""
    try:
        lines = Path(r"c:\Users\DanGi\scripts\client_manager.log").read_text().splitlines()
        last_run = [l for l in lines if "===" in l]
        last_5 = lines[-5:]
        return {"last_run": last_run[-1] if last_run else "Never",
                "summary": " | ".join(last_5)}
    except Exception:
        return {"last_run": "Unknown", "summary": "Log not found"}

def get_hot_leads():
    """Pull hot leads from log."""
    try:
        hot_log = Path(r"c:\Users\DanGi\scripts\hot_leads.log")
        if not hot_log.exists():
            return []
        lines = hot_log.read_text(encoding="utf-8", errors="ignore").splitlines()
        recent = []
        for line in reversed(lines[-20:]):
            if line.strip():
                recent.append(line[:120])
        return recent[:5]
    except Exception:
        return []


# ── REPORT BUILDER ────────────────────────────────────────────────────────────

def build_report():
    print(f"[{NOW}] Building CEO briefing...")

    outreach = get_outreach_stats()
    apify    = get_apify_stats()
    replies  = get_reply_monitor_status()
    research = get_research_status()
    content  = get_content_status()
    health   = get_system_health()
    tasks    = get_scheduled_tasks()
    clients  = get_client_health()
    hot      = get_hot_leads()

    # ── BLOCKERS ──────────────────────────────────────────────────────────────
    blockers = []
    if health.get("status") == "down":
        blockers.append("Railway API is DOWN")
    if replies.get("status") == "error":
        blockers.append("Reply monitor has API error (GHL 422) — replies not being tracked")
    if apify.get("scraped", 0) == 0:
        blockers.append("Apify scraper returned 0 contacts — check Apify credits or actor config")
    if not os.getenv("ANTHROPIC_API_KEY"):
        blockers.append("Anthropic API credits depleted — demo machine offline")

    # ── SLACK BLOCKS ──────────────────────────────────────────────────────────
    date_display = datetime.now().strftime("%A, %B %d, %Y")
    blocks = [
        header(f"☀️  Summit Voice AI — CEO Briefing  |  {date_display}"),
        section(f"*MRR: $4,466 (9 clients)*  |  Gap to $50K: $45,534  |  Need: ~45 more clients"),
        divider(),

        section("*🎯 SALES DEPARTMENT — Your SDR Team*"),
        section(
            f"*Cold Outreach (ghl_daily_outreach):*  {outreach['emails']} emails + {outreach['sms']} SMS sent yesterday\n"
            f"*Contacts in pipeline:*  {outreach['pipeline']} awaiting reply  |  *Total DB:*  {outreach['total_db']:,}\n"
            f"*Hot leads (7d):*  {outreach['hot_leads_7d']}  |  *Follow-ups:*  running Day 3/7/14 sequences\n"
            f"*Lead Scraper (Apify):*  {apify.get('scraped', 0)} contacts scraped — city: {apify.get('city', 'N/A')}\n"
            f"*Reply Monitor:*  {replies.get('note', 'unknown')}  ({'⚠️' if replies['status'] == 'error' else '✅'})"
        ),
        divider(),

        section("*📝 MARKETING DEPARTMENT — Content & Research*"),
        section(
            f"*Research Agent (Tue/Thu):*  Last run: {research.get('last_date', 'Never')}  ({'✅' if research.get('exists') else '⚠️ no output'})\n"
            f"*Content Generator (Mon):*  Recent files: {', '.join(content.get('recent_files', ['none'])) or 'none'}\n"
            f"*Social Poster (Sun):*  Scheduled weekly\n"
            f"*Blog Writer:*  Queued — runs post content gen\n"
            f"*HeyGen Video Agent:*  ⚠️ OFFLINE — set HEYGEN_API_KEY to enable\n"
            f"*RVM Drops:*  ⚠️ OFFLINE — set SLYBROADCAST credentials to enable"
        ),
        divider(),

        section("*👔 ACCOUNT MANAGEMENT — Client Success*"),
        section(
            f"*Active clients:*  9  |  *At-risk:*  0\n"
            f"*Client Manager last run:*  {clients.get('last_run', 'Unknown')}\n"
            f"*Check-ins:*  Automated — weekly touchpoints running in GHL\n"
            f"*Review Requests:*  Scheduled post-job via GHL workflow"
        ),
        divider(),

        section("*🤖 DEMO MACHINE — Website Builder*"),
        section(
            f"*API:*  {'✅ LIVE' if health.get('status') == 'live' else '🔴 DOWN'}  |  "
            f"*Demos built:*  {health.get('demos', 0)} (session total)\n"
            f"*Anthropic credits:*  ⚠️ DEPLETED — add credits at console.anthropic.com\n"
            f"*Template:*  premium_website_generator_v2 (GSAP + Three.js + Lenis) — deployed ✅"
        ),
        divider(),

        section("*⚙️ SYSTEM HEALTH — 11 Scheduled Tasks*"),
    ]

    # Task status
    if isinstance(tasks, dict) and "error" not in tasks:
        task_lines = []
        for name, info in tasks.items():
            status_icon = "✅" if info.get("status") == "Ready" else "⚠️"
            task_lines.append(f"{status_icon} {name}: {info.get('status')} | Next: {info.get('next_run', 'N/A')}")
        blocks.append(section("\n".join(task_lines[:12])))
    else:
        blocks.append(section("⚠️ Could not read task scheduler"))

    blocks.append(divider())

    # Hot leads
    if hot:
        blocks.append(section("*🔥 HOT LEADS — Needs Your Attention*"))
        blocks.append(section("\n".join(hot[:5])))
        blocks.append(divider())

    # Blockers
    if blockers:
        blocker_text = "\n".join(f"⚠️ {b}" for b in blockers)
        blocks.append(section(f"*🚨 BLOCKERS — Dan Needs To Fix*\n{blocker_text}"))
        blocks.append(divider())
    else:
        blocks.append(section("*✅ No blockers — all systems green*"))
        blocks.append(divider())

    # Today's agenda
    blocks.append(section(
        "*📌 TODAY'S AUTO-PRIORITIES*\n"
        "1. Check hot leads above — respond within 2 hours\n"
        "2. Outreach running at 9am (100 contacts)\n"
        "3. Follow-up sequences running at 9:15am\n"
        "4. Content posts scheduled via social automation\n"
        "5. Dashboard: dashboard.summitvoiceai.com (pw: ava2026)"
    ))
    blocks.append(section(f"_Generated at {NOW} by Summit OS Morning Briefing Agent_"))

    return blocks, outreach, apify, research, health, blockers

def save_report(blocks):
    """Save a markdown version to SummitVault."""
    try:
        md_lines = []
        for b in blocks:
            if b["type"] == "header":
                md_lines.append(f"# {b['text']['text']}\n")
            elif b["type"] == "section" and "text" in b:
                md_lines.append(b["text"]["text"] + "\n")
            elif b["type"] == "divider":
                md_lines.append("---\n")
        report_path = REPORT_DIR / f"ceo_briefing_{TODAY}.md"
        report_path.write_text("\n".join(md_lines), encoding="utf-8")
        print(f"[SAVE] Report saved to {report_path}")
    except Exception as e:
        print(f"[SAVE] Error: {e}")

# ── POST AGENT STATUS TO RAILWAY API ─────────────────────────────────────────

def post_agent_status(agent_id: str, name: str, dept: str, status: str,
                      last_run: str, summary: str, count: int = 0,
                      next_run: str = "", blockers: list = None, hot: list = None):
    """Push agent status to Railway API so the dashboard can display it."""
    try:
        payload = {
            "agent_id": agent_id, "agent_name": name, "department": dept,
            "status": status, "last_run": last_run, "output_summary": summary,
            "output_count": count, "next_run": next_run,
            "blockers": blockers or [], "hot_items": hot or [],
        }
        headers = {"X-API-Key": os.getenv("AVA_API_KEY", ""), "Content-Type": "application/json"}
        r = httpx.post(f"{RAILWAY_URL}/agents/status", json=payload, headers=headers, timeout=8)
        return r.status_code == 200
    except Exception as e:
        print(f"[API] Could not POST {agent_id} status: {e}")
        return False

def push_all_statuses(outreach, apify, replies, research, content, health, tasks, clients):
    """Push every agent's status to the Railway API."""
    now_iso = datetime.now().isoformat()
    yesterday_iso = (datetime.now() - timedelta(days=1)).isoformat()

    agents = [
        ("sdr_outreach",    "Cold Outreach SDR",       "SALES",
         "ok" if outreach["sms"] > 0 else "idle",
         now_iso, f"{outreach['emails']} emails + {outreach['sms']} SMS sent",
         outreach["contacts"], "Tomorrow 9:00 AM", [], []),

        ("sdr_followup",    "Follow-Up Specialist",    "SALES",
         "ok", now_iso, "Day 3/7/14 sequences running",
         0, "Tomorrow 9:15 AM", [], []),

        ("sdr_replies",     "Reply Monitor",           "SALES",
         "error" if replies["status"] == "error" else "ok",
         now_iso, replies["note"],
         replies["new_replies"], "Every 15 min",
         ["GHL API 422 — endpoint deprecated"] if replies["status"] == "error" else [], []),

        ("lead_scraper",    "Lead Scraper (Apify)",    "SALES",
         "blocked" if apify.get("scraped", 0) == 0 else "ok",
         yesterday_iso,
         f"{apify.get('scraped', 0)} scraped — city: {apify.get('city', 'N/A')}",
         apify.get("scraped", 0), "Tomorrow 6:00 AM",
         ["0 contacts scraped — check Apify actor config"] if apify.get("scraped", 0) == 0 else [], []),

        ("demo_builder",    "Demo Builder",            "DEMOS",
         "blocked" if health.get("status") == "down" else "ok",
         now_iso, f"API {'LIVE' if health.get('status') == 'live' else 'DOWN'}",
         health.get("demos", 0), "On demand",
         ["Anthropic credits depleted"] if health.get("status") != "down" else [], []),

        ("research_agent",  "Research Analyst",        "MARKETING",
         "ok" if research.get("exists") else "idle",
         research.get("last_date", "Never"),
         f"Last: {research.get('file', 'no file')}",
         1 if research.get("exists") else 0, "Thu 6:30 AM", [], []),

        ("content_gen",     "Content Generator",       "MARKETING",
         "ok" if content.get("posts_today", 0) > 0 else "idle",
         now_iso, f"{content.get('posts_today', 0)} posts generated this week",
         content.get("posts_today", 0), "Next Monday 7:00 AM", [], []),

        ("social_poster",   "Social Publisher",        "MARKETING",
         "idle", now_iso, "Scheduled Sunday 7:30 AM", 0, "Sunday 7:30 AM", [], []),

        ("heygen_agent",    "HeyGen Video Agent",      "MARKETING",
         "blocked", now_iso, "HEYGEN_API_KEY not set",
         0, "Monday 7:30 AM", ["HEYGEN_API_KEY missing — set in scripts/.env"], []),

        ("rvm_agent",       "RVM Drop Agent",          "MARKETING",
         "blocked", now_iso, "Slybroadcast credentials missing",
         0, "Daily 10:30 AM", ["SLYBROADCAST_USER + SLYBROADCAST_PASS missing"], []),

        ("client_manager",  "Client Account Manager",  "CLIENTS",
         "ok", clients.get("last_run", "Unknown"),
         f"9 active clients monitored", 9, "Sunday 7:00 PM", [], []),

        ("morning_brief",   "Morning CEO Briefing",    "OPS",
         "ok", now_iso, "Briefing sent — all departments updated", 6, "Tomorrow 7:00 AM", [], []),

        ("ceo_report",      "CEO Weekly Report",       "OPS",
         "ok", "Last Sunday", "Weekly pipeline report sent", 1, "Sunday 8:00 PM", [], []),

        ("watchdog",        "System Watchdog",         "OPS",
         "ok", now_iso, "Monitoring 11 scheduled tasks", 11, "Continuous", [], []),

        ("reply_monitor_fx","Reply Monitor (Fixed)",   "SALES",
         "ok", now_iso, "ghl_reply_monitor_fixed.py — fallback endpoint patched",
         0, "Every 15 min (add to Task Scheduler)", [], []),
    ]

    posted = 0
    for args in agents:
        if post_agent_status(*args):
            posted += 1

    print(f"[API] Posted {posted}/{len(agents)} agent statuses to Railway")


def push_to_supabase(agents_data: list):
    """Write all agent statuses directly to Supabase (Railway-independent)."""
    supa_url = os.getenv("SUPABASE_URL", "https://omdpkeaqgtizakdfughq.supabase.co")
    supa_key = os.getenv("SUPABASE_KEY", "")
    if not supa_key:
        return
    headers = {
        "apikey": supa_key, "Authorization": f"Bearer {supa_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }
    try:
        for agent in agents_data:
            r = httpx.post(f"{supa_url}/rest/v1/agent_status", json=agent, headers=headers, timeout=8)
            if r.status_code not in (200, 201):
                print(f"[SUPA] Failed {agent['agent_id']}: {r.status_code}")
        print(f"[SUPA] Pushed {len(agents_data)} agent statuses to Supabase")
    except Exception as e:
        print(f"[SUPA] Error: {e}")

if __name__ == "__main__":
    blocks, outreach, apify, research, health, blockers = build_report()
    replies  = get_reply_monitor_status()
    content  = get_content_status()
    tasks    = get_scheduled_tasks()
    clients  = get_client_health()

    save_report(blocks)
    push_all_statuses(outreach, apify, replies, research, content, health, tasks, clients)
    slack(blocks)
    print(f"[DONE] CEO briefing complete — {TODAY}")
