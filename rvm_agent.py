"""
SUMMIT VOICE AI — Ringless Voicemail Drop Agent (Agent RVM)
Runs Mon-Fri at 10:30 AM.

Pulls contacts from GHL who: received Day-0 email, no reply, 3 days ago.
Drops pre-recorded 30-second RVM via Slybroadcast API.
Max 200 drops/day (cost: ~$10-18/day at $0.05-0.09/drop).
Tags contacts in GHL: "rvm_sent" so no duplicates.
Logs everything to outreach_tracker.db.

Pre-recorded voicemail script (30 seconds):
  "Hey [Name], Dan here with Summit Voice AI.
   Sent you a message last week about missed calls.
   At $9,500 a job, missing 3-5 calls a day adds up fast.
   If that's something you want to fix, call me back.
   Takes 10 minutes to show you what it does. Have a great day."

Environment variables:
  SLYBROADCAST_USER         — your slybroadcast.com account email
  SLYBROADCAST_PASS         — your slybroadcast.com password
  SLYBROADCAST_CAMPAIGN_ID  — pre-recorded voicemail campaign ID
  GHL_FORWARD_NUMBER        — the GHL number Dan uses for outreach (callback number)
  GHL_PRIVATE_TOKEN
  GHL_LOCATION_ID
"""

import os, sqlite3, time, requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

SLY_USER        = os.getenv("SLYBROADCAST_USER", "")
SLY_PASS        = os.getenv("SLYBROADCAST_PASS", "")
SLY_CAMPAIGN_ID = os.getenv("SLYBROADCAST_CAMPAIGN_ID", "")
GHL_NUMBER      = os.getenv("GHL_FORWARD_NUMBER", "")
GHL_TOKEN       = os.getenv("GHL_PRIVATE_TOKEN", "")
GHL_LOCATION    = os.getenv("GHL_LOCATION_ID", "u1lprxdJy1vmuaHEVJRM")
GHL_BASE        = "https://services.leadconnectorhq.com"
DB_PATH         = r"C:\Users\DanGi\scripts\outreach_tracker.db"
LOG_FILE        = r"C:\Users\DanGi\scripts\rvm_agent.log"
MAX_DROPS       = 200


def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def get_rvm_targets() -> list[dict]:
    """
    Pull contacts from outreach_tracker.db who:
    - Received initial outreach 3+ days ago
    - Have not replied (no_reply = 1 or replied = 0)
    - Have not received an RVM yet (rvm_sent IS NULL or 0)
    - Have not opted out
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cutoff = (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d")
        rows = conn.execute("""
            SELECT contact_id, first_name, phone, company, city, state
            FROM outreach_log
            WHERE date_sent <= ?
              AND (replied = 0 OR replied IS NULL)
              AND (opted_out = 0 OR opted_out IS NULL)
              AND (rvm_sent = 0 OR rvm_sent IS NULL)
              AND phone IS NOT NULL
              AND phone != ''
            ORDER BY date_sent DESC
            LIMIT ?
        """, (cutoff, MAX_DROPS)).fetchall()
        conn.close()
        return [dict(r) for r in rows]
    except Exception as e:
        log(f"DB error: {e}")
        return []


def drop_rvm(phone: str, first_name: str) -> bool:
    """
    Drop a ringless voicemail via Slybroadcast API.
    POST to https://www.mobile-sphere.com/gateway/vmb.php
    Returns True if successful.
    """
    if not SLY_USER or not SLY_PASS or not SLY_CAMPAIGN_ID:
        log("  Missing Slybroadcast credentials — skipping")
        return False

    # Clean phone: digits only, 10 digits
    clean = "".join(c for c in phone if c.isdigit())
    if len(clean) == 11 and clean.startswith("1"):
        clean = clean[1:]
    if len(clean) != 10:
        log(f"  Invalid phone {phone} — skipping")
        return False

    try:
        r = requests.post(
            "https://www.mobile-sphere.com/gateway/vmb.php",
            data={
                "c_uid":           SLY_USER,
                "c_password":      SLY_PASS,
                "c_phone":         clean,
                "c_record_audio":  SLY_CAMPAIGN_ID,
                "c_callerID":      GHL_NUMBER or clean,
            },
            timeout=20
        )
        response_text = r.text.strip()
        success = response_text.startswith("ok") or response_text == "0"
        log(f"  RVM {clean} ({first_name}): {response_text}")
        return success
    except Exception as e:
        log(f"  RVM drop error for {phone}: {e}")
        return False


def tag_ghl_contact(contact_id: str):
    """Add 'rvm_sent' tag to GHL contact."""
    if not contact_id or not GHL_TOKEN:
        return
    try:
        requests.post(
            f"{GHL_BASE}/contacts/{contact_id}/tags",
            headers={"Authorization": f"Bearer {GHL_TOKEN}", "Version": "2021-04-15",
                     "Content-Type": "application/json"},
            json={"tags": ["rvm_sent"], "locationId": GHL_LOCATION},
            timeout=10
        )
    except Exception as e:
        log(f"  GHL tag error: {e}")


def mark_rvm_sent(contact_id: str):
    """Mark contact as RVM sent in outreach_tracker.db."""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.execute("UPDATE outreach_log SET rvm_sent = 1, rvm_sent_date = ? WHERE contact_id = ?",
                     (datetime.now().strftime("%Y-%m-%d"), contact_id))
        conn.commit()
        conn.close()
    except Exception as e:
        log(f"  DB update error: {e}")


def main():
    today = datetime.now().strftime("%Y-%m-%d")
    log(f"=== RVM Agent — {today} ===")

    if not SLY_USER or not SLY_CAMPAIGN_ID:
        log("SKIP: Slybroadcast credentials not configured")
        log("Get credentials at: slybroadcast.com → Settings → API")
        log("Add to .env: SLYBROADCAST_USER, SLYBROADCAST_PASS, SLYBROADCAST_CAMPAIGN_ID")
        return

    targets = get_rvm_targets()
    log(f"Targets eligible for RVM: {len(targets)}")

    if not targets:
        log("No eligible targets today")
        return

    dropped   = 0
    failed    = 0
    skipped   = 0

    for contact in targets[:MAX_DROPS]:
        phone      = contact.get("phone", "")
        first_name = contact.get("first_name", "there")
        contact_id = contact.get("contact_id", "")

        success = drop_rvm(phone, first_name)

        if success:
            tag_ghl_contact(contact_id)
            mark_rvm_sent(contact_id)
            dropped += 1
        else:
            failed += 1

        time.sleep(1.5)  # rate limit: ~40 drops/minute max

    log(f"Done. Dropped: {dropped} | Failed: {failed} | Skipped: {skipped}")
    log(f"Estimated cost: ${dropped * 0.07:.2f} (~$0.07/drop avg)")


if __name__ == "__main__":
    main()
