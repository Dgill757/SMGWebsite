"""
SUMMIT VOICE AI — HeyGen AI Avatar Video Generator
Runs Monday 7:30am (after content_generator.py at 7am).
Reads Monday's TikTok script → generates 60-90 sec avatar video via HeyGen API v2.
Downloads video → saves to SummitVault/CONTENT/VIDEOS/[date]/
Sends Slack notification with video URL.

Environment variables required:
  HEYGEN_API_KEY      — from heygen.com → Settings → API
  HEYGEN_AVATAR_ID    — optional, defaults to stock avatar
  HEYGEN_VOICE_ID     — optional, defaults to English male professional
  SLACK_WEBHOOK_URL   — for notifications
  AVA_API_KEY         — for Railway ingest

Cost: ~$1 per 60-second video.
"""

import os, json, time, glob, requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

HEYGEN_API_KEY   = os.getenv("HEYGEN_API_KEY", "")
AVATAR_ID        = os.getenv("HEYGEN_AVATAR_ID", "")
VOICE_ID         = os.getenv("HEYGEN_VOICE_ID", "")
SLACK_WEBHOOK    = os.getenv("SLACK_WEBHOOK_URL", "")
AVA_API_URL      = os.getenv("AVA_API_URL", "https://ava-studio-api-production.up.railway.app")
AVA_API_KEY      = os.getenv("AVA_API_KEY", os.getenv("AVA_API_KEY", ""))
VAULT_DIR        = r"C:\Users\DanGi\SummitVault\CONTENT\VIDEOS"
CONTENT_DIR      = r"C:\Users\DanGi\outreach\content"

HEYGEN_BASE      = "https://api.heygen.com"
LOG_FILE         = r"C:\Users\DanGi\scripts\heygen_agent.log"

# Fallback stock avatar if none set
DEFAULT_AVATAR_ID = "Angela-inblackskirt-20220820"
DEFAULT_VOICE_ID  = "1bd001e7e50f421d891986aad5158bc8"  # English male professional


def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def get_tiktok_script() -> str | None:
    """Read this week's TikTok script from the content generator output."""
    today = datetime.now().strftime("%Y-%m-%d")
    # Try today's file first, then find most recent
    patterns = [
        os.path.join(CONTENT_DIR, f"{today}_content.json"),
        os.path.join(CONTENT_DIR, "*_content.json"),
    ]
    for pattern in patterns:
        files = sorted(glob.glob(pattern), reverse=True)
        if files:
            try:
                with open(files[0]) as f:
                    data = json.load(f)
                script = data.get("tiktok_script") or data.get("tiktok") or data.get("content", {}).get("tiktok_script")
                if script:
                    log(f"Loaded TikTok script from {files[0]} ({len(script)} chars)")
                    return script
            except Exception as e:
                log(f"Failed to read {files[0]}: {e}")
    log("No TikTok script found — using default promotional script")
    return None


def get_fallback_script() -> str:
    return """Hey roofing contractors — quick question. How many calls are you missing every single day while you're on the job?

The average roofing company misses 3 to 5 calls per day. At ninety-five hundred dollars per job, that's fifty to a hundred thousand dollars walking out the door every year.

I built Summit Voice AI to fix that. Ava answers every call, twenty-four seven. Books inspections. Handles the first conversation.

You just show up to the jobs that are already sold.

It's sixteen dollars a day. One job pays for the whole year.

Check us out at Summit Voice AI dot com."""


def generate_video(script: str) -> str | None:
    """Submit video generation job to HeyGen API v2. Returns video_id."""
    if not HEYGEN_API_KEY:
        log("ERROR: HEYGEN_API_KEY not set — skipping video generation")
        return None

    avatar_id = AVATAR_ID or DEFAULT_AVATAR_ID
    voice_id  = VOICE_ID  or DEFAULT_VOICE_ID

    payload = {
        "video_inputs": [{
            "character": {
                "type": "avatar",
                "avatar_id": avatar_id,
                "avatar_style": "normal"
            },
            "voice": {
                "type": "text",
                "input_text": script,
                "voice_id": voice_id,
                "speed": 1.0
            },
            "background": {
                "type": "color",
                "value": "#0D1F3C"
            }
        }],
        "dimension": {"width": 1080, "height": 1920},  # TikTok vertical
        "aspect_ratio": "9:16",
        "test": False
    }

    try:
        r = requests.post(
            f"{HEYGEN_BASE}/v2/video/generate",
            headers={"X-Api-Key": HEYGEN_API_KEY, "Content-Type": "application/json"},
            json=payload,
            timeout=30
        )
        data = r.json()
        if data.get("error"):
            log(f"HeyGen API error: {data['error']}")
            return None
        video_id = data.get("data", {}).get("video_id")
        log(f"Video job submitted — ID: {video_id}")
        return video_id
    except Exception as e:
        log(f"Failed to submit video job: {e}")
        return None


def poll_video(video_id: str, max_wait: int = 600) -> str | None:
    """Poll until video is complete. Returns download URL or None."""
    log(f"Polling video {video_id} (max {max_wait}s)...")
    start = time.time()
    while time.time() - start < max_wait:
        try:
            r = requests.get(
                f"{HEYGEN_BASE}/v1/video_status.get?video_id={video_id}",
                headers={"X-Api-Key": HEYGEN_API_KEY},
                timeout=15
            )
            data = r.json().get("data", {})
            status = data.get("status", "")
            log(f"  Status: {status}")
            if status == "completed":
                return data.get("video_url")
            if status == "failed":
                log(f"Video generation failed: {data.get('error', 'unknown')}")
                return None
        except Exception as e:
            log(f"Poll error: {e}")
        time.sleep(20)
    log(f"Timeout waiting for video {video_id}")
    return None


def download_video(url: str, date_str: str) -> str | None:
    """Download video to vault."""
    dest_dir = os.path.join(VAULT_DIR, date_str)
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, f"tiktok_{date_str}.mp4")
    try:
        r = requests.get(url, timeout=120, stream=True)
        with open(dest, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        size_mb = os.path.getsize(dest) / 1024 / 1024
        log(f"Downloaded: {dest} ({size_mb:.1f} MB)")
        return dest
    except Exception as e:
        log(f"Download failed: {e}")
        return None


def send_slack(video_url: str, local_path: str, date_str: str):
    if not SLACK_WEBHOOK:
        return
    msg = {
        "text": f"🎬 *HeyGen TikTok Video Ready — {date_str}*\n"
                f"Download: {video_url}\n"
                f"Saved: `{local_path}`\n"
                f"Platform: TikTok · 9:16 vertical · 60-90 seconds"
    }
    try:
        requests.post(SLACK_WEBHOOK, json=msg, timeout=10)
    except Exception:
        pass


def main():
    date_str = datetime.now().strftime("%Y-%m-%d")
    log(f"=== HeyGen Avatar Agent — {date_str} ===")

    script = get_tiktok_script() or get_fallback_script()
    log(f"Script length: {len(script)} chars")

    video_id = generate_video(script)
    if not video_id:
        log("Exiting — no video ID returned")
        return

    video_url = poll_video(video_id)
    if not video_url:
        log("Exiting — video never completed")
        return

    local_path = download_video(video_url, date_str)

    send_slack(video_url, local_path or "download failed", date_str)
    log(f"Done. Video URL: {video_url}")


if __name__ == "__main__":
    main()
