"""
SUMMIT VOICE AI — Client Account Manager (Agent 9)
Runs every Sunday at 7:00 PM (before CEO report at 8pm).

For each active client:
  1. Pulls their weekly stats (calls, bookings, reviews)
  2. Calculates engagement score (1-10)
  3. Flags at-risk clients (declining stats or low usage)
  4. Generates personalized weekly performance email
  5. Sends via GHL
  6. Alerts Dan via Slack for at-risk clients
  7. Posts aggregate stats to Railway
  8. Saves reports to SummitVault/CLIENTS/ACTIVE/[company]/

This makes Dan look like a 10-person team to his clients.
"""

import os, json, httpx, asyncio
from anthropic import Anthropic
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

ai              = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
SUPABASE_URL    = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY    = os.getenv("SUPABASE_KEY", "")
GHL_TOKEN       = os.getenv("GHL_PRIVATE_TOKEN", "")
GHL_BASE        = os.getenv("GHL_BASE_URL", "https://services.leadconnectorhq.com")
GHL_LOCATION    = os.getenv("GHL_LOCATION_ID", "u1lprxdJy1vmuaHEVJRM")
SLACK_WEBHOOK   = os.getenv("SLACK_WEBHOOK_URL", "")
AVA_API_URL     = os.getenv("AVA_API_URL", "https://ava-studio-api-production.up.railway.app")
AVA_API_KEY     = os.getenv("AVA_API_KEY", "")
VAULT_BASE      = r"C:\Users\DanGi\SummitVault\CLIENTS\ACTIVE"
LOG_FILE        = r"C:\Users\DanGi\scripts\client_manager.log"


def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


# ── SUPABASE HELPERS ──────────────────────────────────────────────────────────

async def get_active_clients(client: httpx.AsyncClient) -> list:
    if not SUPABASE_URL:
        return []
    r = await client.get(
        f"{SUPABASE_URL}/rest/v1/clients?status=eq.active&order=company_name",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
        timeout=15
    )
    return r.json() if r.status_code == 200 else []


async def get_client_stats(client: httpx.AsyncClient, client_id: str) -> dict:
    """Get this week's stats. Tries client_weekly_stats, falls back to defaults."""
    if not SUPABASE_URL:
        return {}
    week_start = (datetime.now() - timedelta(days=7)).date().isoformat()
    r = await client.get(
        f"{SUPABASE_URL}/rest/v1/client_weekly_stats?client_id=eq.{client_id}&week_of=gte.{week_start}&order=week_of.desc&limit=1",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"},
        timeout=15
    )
    rows = r.json() if r.status_code == 200 else []
    return rows[0] if rows else {}


async def flag_churn_risk(client: httpx.AsyncClient, client_id: str, reason: str):
    await client.patch(
        f"{SUPABASE_URL}/rest/v1/clients?id=eq.{client_id}",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
                 "Content-Type": "application/json", "Prefer": "return=minimal"},
        json={"churn_risk_flag": True, "churn_risk_reason": reason, "status": "at-risk"},
        timeout=10
    )


async def save_weekly_stat(client: httpx.AsyncClient, client_id: str, stats: dict):
    payload = {"client_id": client_id, "week_of": datetime.now().date().isoformat(), **stats}
    await client.post(
        f"{SUPABASE_URL}/rest/v1/client_weekly_stats",
        headers={"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
                 "Content-Type": "application/json", "Prefer": "return=minimal"},
        json=payload,
        timeout=10
    )


# ── ENGAGEMENT SCORE ──────────────────────────────────────────────────────────

def calc_engagement_score(stats: dict) -> int:
    """Score 1-10 based on call activity, bookings, and review requests."""
    score = 5  # baseline
    calls = stats.get("calls_answered", 0)
    bookings = stats.get("bookings_made", 0)
    reviews = stats.get("reviews_requested", 0)

    if calls >= 20:   score += 2
    elif calls >= 10: score += 1
    elif calls == 0:  score -= 3

    if bookings >= 3:  score += 2
    elif bookings >= 1: score += 1

    if reviews >= 5:  score += 1

    return max(1, min(10, score))


def is_at_risk(stats: dict, prev_stats: dict | None = None) -> tuple[bool, str]:
    """Detect churn signals."""
    calls = stats.get("calls_answered", 0)
    bookings = stats.get("bookings_made", 0)
    score = calc_engagement_score(stats)

    if score <= 3:
        return True, f"Low engagement score: {score}/10 — only {calls} calls answered this week"
    if calls == 0 and bookings == 0:
        return True, "Zero activity this week — Ava may not be answering calls"
    if prev_stats:
        prev_calls = prev_stats.get("calls_answered", 0)
        if prev_calls > 0 and calls < prev_calls * 0.3:
            return True, f"Call volume dropped 70%+ ({prev_calls} → {calls})"
    return False, ""


# ── REPORT GENERATION ─────────────────────────────────────────────────────────

async def generate_weekly_email(c_data: dict, stats: dict) -> tuple[str, str]:
    """Generate personalized weekly performance email for the client."""
    company = c_data.get("company_name", "your company")
    contact = c_data.get("contact_name", "there")
    calls   = stats.get("calls_answered", 0)
    bookings = stats.get("bookings_made", 0)
    reviews = stats.get("reviews_requested", 0)
    score   = calc_engagement_score(stats)
    week    = datetime.now().strftime("%B %d, %Y")

    prompt = f"""Write a weekly performance email from Dan Gill at Summit Voice AI to a roofing client.

Client: {contact} at {company}
Week of: {week}

Performance this week:
- Calls answered by Ava: {calls}
- Bookings made: {bookings}
- Review requests sent: {reviews}
- Engagement score: {score}/10

Write a short, professional email (under 200 words):
- Subject line: "Your Ava Report — Week of {week}" (lowercase)
- Tone: warm but businesslike, Dan's voice (direct, no fluff)
- Highlight what's working
- If bookings are low: suggest they check their calendar availability in Ava
- If calls are low: mention Ava is ready whenever they're ready to forward the number
- End with: "Any questions, just reply. —dan"
- No em dashes — use "..." instead

Return ONLY the email body (no subject line). Start with "Hey {contact},"."""

    try:
        msg = ai.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=400,
            messages=[{"role": "user", "content": prompt}]
        )
        body = msg.content[0].text.strip()
        subject = f"your ava report — week of {datetime.now().strftime('%b %d').lower()}"
        return subject, body
    except Exception as e:
        log(f"Email generation failed for {company}: {e}")
        subject = f"your ava report — week of {datetime.now().strftime('%b %d').lower()}"
        body = f"""Hey {contact},

Quick week-in-review for {company}:

Calls answered: {calls}
Bookings made: {bookings}
Reviews requested: {reviews}

Ava is active and ready. If call volume is lower than expected, double-check that your business number is forwarding to the Ava line.

Any questions, just reply. —dan"""
        return subject, body


async def send_ghl_email(client: httpx.AsyncClient, c_data: dict, subject: str, body: str):
    """Send email via GHL."""
    if not c_data.get("ghl_contact_id") or not GHL_TOKEN:
        return
    headers = {"Authorization": f"Bearer {GHL_TOKEN}", "Version": "2021-04-15",
               "Content-Type": "application/json"}
    try:
        r = await client.post(
            f"{GHL_BASE}/conversations/messages/outbound",
            headers=headers,
            json={"type": "Email", "contactId": c_data["ghl_contact_id"],
                  "subject": subject, "body": body, "locationId": GHL_LOCATION},
            timeout=15
        )
        log(f"  Email sent to {c_data.get('company_name')} — status {r.status_code}")
    except Exception as e:
        log(f"  Email failed for {c_data.get('company_name')}: {e}")


def save_report_to_vault(c_data: dict, stats: dict, email_body: str):
    company_slug = c_data.get("company_name", "unknown").lower().replace(" ", "-")
    week_str = datetime.now().strftime("%Y-%m-%d")
    dest_dir = os.path.join(VAULT_BASE, company_slug)
    os.makedirs(dest_dir, exist_ok=True)
    report_path = os.path.join(dest_dir, f"{week_str}-report.md")
    content = f"""# Weekly Report — {c_data.get('company_name')}
**Week of {week_str}**

## Stats
- Calls answered: {stats.get('calls_answered', 0)}
- Bookings made: {stats.get('bookings_made', 0)}
- Reviews requested: {stats.get('reviews_requested', 0)}
- Engagement score: {calc_engagement_score(stats)}/10
- Status: {c_data.get('status', 'active')}
- Tier: {c_data.get('tier', 1)} (${c_data.get('mrr', 497)}/mo)

## Email Sent
{email_body}
"""
    with open(report_path, "w") as f:
        f.write(content)


async def send_slack_alert(http: httpx.AsyncClient, company: str, reason: str):
    if not SLACK_WEBHOOK:
        return
    msg = {"text": f"⚠️ *Churn Risk: {company}*\n{reason}\n→ Reach out today before they cancel."}
    try:
        await http.post(SLACK_WEBHOOK, json=msg, timeout=10)
    except Exception:
        pass


# ── MAIN ──────────────────────────────────────────────────────────────────────

async def main():
    date_str = datetime.now().strftime("%Y-%m-%d")
    log(f"=== Client Account Manager — {date_str} ===")

    async with httpx.AsyncClient() as http:
        clients = await get_active_clients(http)
        log(f"Found {len(clients)} active clients")

        total_calls = 0
        total_bookings = 0
        at_risk_count = 0

        for c in clients:
            company = c.get("company_name", "Unknown")
            log(f"Processing: {company}")

            stats = await get_client_stats(http, c.get("id", ""))
            if not stats:
                stats = {"calls_answered": 0, "bookings_made": 0, "reviews_requested": 0}

            total_calls    += stats.get("calls_answered", 0)
            total_bookings += stats.get("bookings_made", 0)

            risk, reason = is_at_risk(stats)
            if risk:
                log(f"  ⚠ At risk: {reason}")
                await flag_churn_risk(http, c.get("id", ""), reason)
                await send_slack_alert(http, company, reason)
                at_risk_count += 1

            subject, body = await generate_weekly_email(c, stats)
            await send_ghl_email(http, c, subject, body)
            save_report_to_vault(c, stats, body)

        log(f"Done. Processed {len(clients)} clients. At-risk: {at_risk_count}")
        log(f"Total calls answered: {total_calls}, bookings: {total_bookings}")

        # Post aggregate to Railway
        try:
            await http.post(
                f"{AVA_API_URL}/ingest/client-stats",
                headers={"X-API-Key": AVA_API_KEY, "Content-Type": "application/json"},
                json={"clients": len(clients), "total_calls": total_calls,
                      "total_bookings": total_bookings, "at_risk": at_risk_count},
                timeout=10
            )
        except Exception:
            pass


if __name__ == "__main__":
    asyncio.run(main())
