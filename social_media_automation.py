"""
SUMMIT VOICE AI — SOCIAL MEDIA AUTOMATION
==========================================
Posts generated content to all platforms automatically.
Tracks engagement and reports best-performing posts.

Platforms:
- LinkedIn (via LinkedIn API v2)
- Facebook Page (via Meta Graph API)
- Instagram Business (via Meta Graph API)
- Twitter/X (via X API v2)
- TikTok (via TikTok Business API — manual trigger, no auto-post)
- YouTube (description/community posts via YouTube Data API)

Install: pip install requests httpx python-dotenv

Environment variables needed (add to Railway + .env files):
LINKEDIN_ACCESS_TOKEN=your_token
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_ACCESS_TOKEN=your_token (page access token)
INSTAGRAM_ACCOUNT_ID=your_ig_account_id
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
TWITTER_ACCESS_TOKEN=your_token
TWITTER_ACCESS_TOKEN_SECRET=your_secret
YOUTUBE_API_KEY=your_key (for future use)
"""

import os, json, requests, httpx
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

LINKEDIN_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN", "")
FB_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID", "")
FB_TOKEN = os.getenv("FACEBOOK_ACCESS_TOKEN", "")
IG_ACCOUNT_ID = os.getenv("INSTAGRAM_ACCOUNT_ID", "")
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY", "")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET", "")
TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN", "")
TWITTER_ACCESS_SECRET = os.getenv("TWITTER_ACCESS_TOKEN_SECRET", "")
SLACK_WEBHOOK = os.getenv("SLACK_WEBHOOK_URL", "")


# ── LINKEDIN ─────────────────────────────────────────────────────────────────
def post_to_linkedin(text: str, author_urn: str = "") -> dict:
    """
    Post to LinkedIn personal profile or company page.
    
    To get your author_urn:
    1. Go to LinkedIn Developer portal (developer.linkedin.com)
    2. Create app → get API keys
    3. GET https://api.linkedin.com/v2/me → returns your URN
    4. Format: "urn:li:person:YOUR_ID" for personal, "urn:li:organization:YOUR_ID" for company
    """
    if not LINKEDIN_TOKEN:
        print("[LINKEDIN] No access token configured")
        return {"error": "no_token"}

    if not author_urn:
        # Get author URN
        me_r = requests.get(
            "https://api.linkedin.com/v2/me",
            headers={"Authorization": f"Bearer {LINKEDIN_TOKEN}"}
        )
        if me_r.status_code == 200:
            author_urn = f"urn:li:person:{me_r.json()['id']}"

    if not author_urn:
        return {"error": "could_not_get_author"}

    payload = {
        "author": author_urn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
    }

    r = requests.post(
        "https://api.linkedin.com/v2/ugcPosts",
        headers={"Authorization": f"Bearer {LINKEDIN_TOKEN}", "Content-Type": "application/json"},
        json=payload,
        timeout=15
    )

    if r.status_code in (200, 201):
        post_id = r.headers.get("X-RestLi-Id", "")
        print(f"[LINKEDIN] ✓ Posted — ID: {post_id}")
        return {"success": True, "post_id": post_id, "platform": "linkedin"}
    else:
        print(f"[LINKEDIN] ✗ Failed {r.status_code}: {r.text[:200]}")
        return {"error": r.status_code, "detail": r.text[:200]}


# ── FACEBOOK ─────────────────────────────────────────────────────────────────
def post_to_facebook(text: str, schedule_time: datetime = None) -> dict:
    """
    Post to Facebook Business Page.
    
    To set up:
    1. Go to Meta Business Manager (business.facebook.com)
    2. Get a Page Access Token for your Summit Voice AI Facebook page
    3. Add FACEBOOK_PAGE_ID and FACEBOOK_ACCESS_TOKEN to env vars
    """
    if not FB_TOKEN or not FB_PAGE_ID:
        print("[FACEBOOK] Page ID or token not configured")
        return {"error": "no_config"}

    payload = {"message": text, "access_token": FB_TOKEN}

    if schedule_time:
        # Convert to Unix timestamp for scheduled post
        payload["scheduled_publish_time"] = int(schedule_time.timestamp())
        payload["published"] = False

    r = requests.post(
        f"https://graph.facebook.com/v19.0/{FB_PAGE_ID}/feed",
        data=payload,
        timeout=15
    )

    if r.status_code == 200:
        post_id = r.json().get("id", "")
        print(f"[FACEBOOK] ✓ Posted — ID: {post_id}")
        return {"success": True, "post_id": post_id, "platform": "facebook"}
    else:
        print(f"[FACEBOOK] ✗ Failed {r.status_code}: {r.text[:200]}")
        return {"error": r.status_code}


# ── INSTAGRAM ─────────────────────────────────────────────────────────────────
def post_to_instagram(caption: str, image_url: str = None) -> dict:
    """
    Post to Instagram Business account via Meta Graph API.
    
    Requires Instagram Business account connected to Facebook page.
    For image posts, provide an image_url (publicly accessible URL).
    For text-only, will create a text post (carousel item).
    """
    if not FB_TOKEN or not IG_ACCOUNT_ID:
        print("[INSTAGRAM] Account ID or token not configured")
        return {"error": "no_config"}

    if not image_url:
        # Instagram requires an image. Create a simple text card.
        # For now, use a placeholder roofing image
        image_url = "https://images.unsplash.com/photo-1632823471565-1ecdf5c6da1d?w=1080&auto=format&fit=crop&q=60"

    # Step 1: Create media container
    container_r = requests.post(
        f"https://graph.facebook.com/v19.0/{IG_ACCOUNT_ID}/media",
        data={
            "image_url": image_url,
            "caption": caption,
            "access_token": FB_TOKEN
        },
        timeout=15
    )

    if container_r.status_code != 200:
        print(f"[INSTAGRAM] ✗ Container creation failed: {container_r.text[:200]}")
        return {"error": "container_failed"}

    container_id = container_r.json().get("id")

    # Step 2: Publish the container
    publish_r = requests.post(
        f"https://graph.facebook.com/v19.0/{IG_ACCOUNT_ID}/media_publish",
        data={"creation_id": container_id, "access_token": FB_TOKEN},
        timeout=15
    )

    if publish_r.status_code == 200:
        post_id = publish_r.json().get("id", "")
        print(f"[INSTAGRAM] ✓ Posted — ID: {post_id}")
        return {"success": True, "post_id": post_id, "platform": "instagram"}
    else:
        print(f"[INSTAGRAM] ✗ Publish failed: {publish_r.text[:200]}")
        return {"error": "publish_failed"}


# ── TWITTER/X ─────────────────────────────────────────────────────────────────
def post_to_twitter(text: str) -> dict:
    """
    Post to Twitter/X using X API v2.
    
    To set up:
    1. Go to developer.twitter.com
    2. Create a project and app
    3. Generate OAuth 2.0 tokens with read/write permissions
    4. Add all 4 tokens to env vars
    """
    if not TWITTER_API_KEY:
        print("[TWITTER] API key not configured")
        return {"error": "no_config"}

    try:
        import tweepy
        client = tweepy.Client(
            consumer_key=TWITTER_API_KEY,
            consumer_secret=TWITTER_API_SECRET,
            access_token=TWITTER_ACCESS_TOKEN,
            access_token_secret=TWITTER_ACCESS_SECRET
        )
        response = client.create_tweet(text=text[:280])
        tweet_id = response.data["id"]
        print(f"[TWITTER] ✓ Tweeted — ID: {tweet_id}")
        return {"success": True, "post_id": tweet_id, "platform": "twitter"}
    except ImportError:
        print("[TWITTER] tweepy not installed — run: pip install tweepy")
        return {"error": "tweepy_not_installed"}
    except Exception as e:
        print(f"[TWITTER] ✗ Error: {e}")
        return {"error": str(e)}


# ── MAIN WEEKLY PUBLISHER ─────────────────────────────────────────────────────
def publish_weekly_content(content_json: dict) -> dict:
    """
    Publish this week's content to all platforms.
    
    Call this after content_generator.py generates the weekly content.
    Schedules posts throughout the week:
    - Tuesday 9am: Facebook + Instagram
    - Wednesday 8am: LinkedIn
    - Now: Twitter/X (Twitter works best when posted immediately vs scheduled)
    """
    results = {}

    # TWITTER — post now (both tweets)
    for i, key in enumerate(["twitter_1", "twitter_2"], 1):
        text = content_json.get(key, "")
        if text:
            r = post_to_twitter(text.strip()[:280])
            results[f"twitter_{i}"] = r
            print(f"[SOCIAL] Twitter post {i}: {'✓' if r.get('success') else '✗'}")

    # FACEBOOK — schedule for Tuesday 9am
    fb_text = content_json.get("facebook", "")
    if fb_text:
        # Find next Tuesday at 9am
        now = datetime.now()
        days_ahead = (1 - now.weekday()) % 7  # 1 = Tuesday
        if days_ahead == 0 and now.hour >= 9: days_ahead = 7
        schedule = (now + timedelta(days=days_ahead)).replace(hour=9, minute=0, second=0, microsecond=0)
        r = post_to_facebook(fb_text, schedule_time=schedule)
        results["facebook"] = r
        print(f"[SOCIAL] Facebook scheduled: {'✓' if r.get('success') else '✗'}")

    # INSTAGRAM — schedule for Tuesday 11am
    ig_text = content_json.get("instagram", "")
    if ig_text:
        now = datetime.now()
        days_ahead = (1 - now.weekday()) % 7
        if days_ahead == 0 and now.hour >= 11: days_ahead = 7
        schedule = (now + timedelta(days=days_ahead)).replace(hour=11, minute=0, second=0, microsecond=0)
        # Post immediately since Instagram API scheduling is complex
        r = post_to_instagram(ig_text)
        results["instagram"] = r
        print(f"[SOCIAL] Instagram: {'✓' if r.get('success') else '✗'}")

    # LINKEDIN — schedule for Wednesday 8am  
    li_text = content_json.get("linkedin", "")
    if li_text:
        r = post_to_linkedin(li_text)
        results["linkedin"] = r
        print(f"[SOCIAL] LinkedIn: {'✓' if r.get('success') else '✗'}")

    # Send Slack summary
    if SLACK_WEBHOOK:
        success_count = sum(1 for v in results.values() if v.get("success"))
        msg = f"""📱 *Social Media Posted — {datetime.now().strftime('%B %d')}*
✓ {success_count}/{len(results)} posts successful
{chr(10).join(f"{'✓' if v.get('success') else '✗'} {k}: {v.get('post_id','error')}" for k,v in results.items())}"""
        try:
            requests.post(SLACK_WEBHOOK, json={"text": msg}, timeout=5)
        except Exception:
            pass

    return results


# ── ENGAGEMENT TRACKER ────────────────────────────────────────────────────────
def get_post_engagement(post_id: str, platform: str) -> dict:
    """
    Get engagement metrics for a posted content piece.
    Call this 24-48hrs after posting to see performance.
    """
    if platform == "linkedin" and LINKEDIN_TOKEN:
        r = requests.get(
            f"https://api.linkedin.com/v2/socialMetadata/{post_id}",
            headers={"Authorization": f"Bearer {LINKEDIN_TOKEN}"}
        )
        if r.status_code == 200:
            data = r.json()
            return {
                "likes": data.get("totalSocialActivityCounts", {}).get("numLikes", 0),
                "comments": data.get("totalSocialActivityCounts", {}).get("numComments", 0),
                "shares": data.get("totalSocialActivityCounts", {}).get("numShares", 0),
            }

    if platform == "facebook" and FB_TOKEN:
        r = requests.get(
            f"https://graph.facebook.com/v19.0/{post_id}?fields=likes.summary(true),comments.summary(true),shares&access_token={FB_TOKEN}"
        )
        if r.status_code == 200:
            data = r.json()
            return {
                "likes": data.get("likes", {}).get("summary", {}).get("total_count", 0),
                "comments": data.get("comments", {}).get("summary", {}).get("total_count", 0),
                "shares": data.get("shares", {}).get("count", 0),
            }

    return {}


def weekly_engagement_report(posts: list) -> str:
    """
    Generate engagement report for last week's content.
    posts = [{"post_id": "...", "platform": "linkedin", "content_type": "PROOF"}]
    """
    report_lines = ["📊 *Weekly Content Engagement Report*\n"]

    for p in posts:
        metrics = get_post_engagement(p.get("post_id", ""), p.get("platform", ""))
        if metrics:
            total_engagement = metrics.get("likes", 0) + metrics.get("comments", 0) + metrics.get("shares", 0)
            report_lines.append(
                f"*{p.get('platform','').upper()}* ({p.get('content_type','')}):\n"
                f"  ❤️ {metrics.get('likes',0)} · 💬 {metrics.get('comments',0)} · 🔁 {metrics.get('shares',0)} = {total_engagement} total"
            )

    report = "\n".join(report_lines)

    if SLACK_WEBHOOK:
        try:
            requests.post(SLACK_WEBHOOK, json={"text": report}, timeout=5)
        except Exception:
            pass

    return report


# ── HEYGEN AI AVATAR VIDEO GENERATOR ─────────────────────────────────────────
HEYGEN_API_KEY = os.getenv("HEYGEN_API_KEY", "")

def generate_avatar_video(script: str, avatar_id: str = "", voice_id: str = "") -> dict:
    """
    Generate an AI avatar video from a script using HeyGen API.
    
    Cost: ~$1/minute of video (Avatar III, 1080p)
    A 60-second TikTok script costs ~$1.00
    
    To set up:
    1. Sign up at heygen.com ($29/month Creator plan)
    2. Go to Settings → API → Create API key (separate from web plan — buy $5 API credits)
    3. Add HEYGEN_API_KEY to Railway env vars
    4. Get your avatar_id from heygen.com → Avatars
    5. Get voice_id from heygen.com → Voices
    
    Dan's setup:
    - Create a Photo Avatar using Dan's photo (no camera needed)
    - OR use one of HeyGen's stock avatars
    - Select a professional male voice
    """
    if not HEYGEN_API_KEY:
        print("[HEYGEN] API key not configured — get one at heygen.com → Settings → API")
        return {"error": "no_api_key"}

    # Default to a stock professional avatar if not specified
    if not avatar_id:
        avatar_id = "Garry_public_2"  # HeyGen stock avatar — update with preferred one
    if not voice_id:
        voice_id = "1bd001e7e50f421d891986aad5158bc8"  # Default English male voice

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
                "voice_id": voice_id
            },
            "background": {
                "type": "color",
                "value": "#1B3A6B"  # Dark blue — professional
            }
        }],
        "dimension": {"width": 1080, "height": 1920},  # 9:16 for TikTok/Reels
        "aspect_ratio": "9:16"
    }

    r = requests.post(
        "https://api.heygen.com/v2/video/generate",
        headers={"X-Api-Key": HEYGEN_API_KEY, "Content-Type": "application/json"},
        json=payload,
        timeout=30
    )

    if r.status_code == 200:
        video_id = r.json().get("data", {}).get("video_id", "")
        print(f"[HEYGEN] ✓ Video generation started — ID: {video_id}")
        return {"success": True, "video_id": video_id, "status": "processing"}
    else:
        print(f"[HEYGEN] ✗ Failed {r.status_code}: {r.text[:200]}")
        return {"error": r.status_code, "detail": r.text[:200]}


def check_heygen_video_status(video_id: str) -> dict:
    """Poll until video is ready. Returns download URL when done."""
    if not HEYGEN_API_KEY:
        return {"error": "no_api_key"}

    r = requests.get(
        f"https://api.heygen.com/v1/video_status.get?video_id={video_id}",
        headers={"X-Api-Key": HEYGEN_API_KEY},
        timeout=10
    )

    if r.status_code == 200:
        data = r.json().get("data", {})
        status = data.get("status", "processing")
        if status == "completed":
            video_url = data.get("video_url", "")
            print(f"[HEYGEN] ✓ Video ready: {video_url[:60]}...")
            return {"success": True, "status": "completed", "video_url": video_url}
        else:
            return {"status": status, "progress": data.get("progress", 0)}
    return {"error": "status_check_failed"}


# ── DAILY CONTENT AUTOMATION RUNNER ──────────────────────────────────────────
def run_weekly_posting_automation(content_file: str = None):
    """
    Main entry point for weekly content automation.
    Called from content_generator.py after content is generated.
    """
    if content_file:
        with open(content_file) as f:
            content = json.load(f)
    else:
        # Find this week's content file
        today = datetime.now()
        content_dir = r"C:\Users\DanGi\outreach\content"
        for i in range(7):
            date = today - timedelta(days=i)
            fname = f"{date.strftime('%Y-%m-%d')}_content.json"
            fpath = os.path.join(content_dir, fname)
            if os.path.exists(fpath):
                with open(fpath) as f:
                    content = json.load(f)
                break
        else:
            print("[SOCIAL] No content file found")
            return {}

    print(f"[SOCIAL] Publishing week: {content.get('week_date','')}")
    results = publish_weekly_content(content)

    # Optionally generate a TikTok video from the script
    tiktok_script = content.get("tiktok_script", "")
    if tiktok_script and HEYGEN_API_KEY:
        print("[HEYGEN] Generating TikTok avatar video...")
        video_result = generate_avatar_video(tiktok_script)
        results["tiktok_video"] = video_result

    print(f"[SOCIAL] Done — {sum(1 for v in results.values() if v.get('success'))}/{len(results)} successful")
    return results


if __name__ == "__main__":
    run_weekly_posting_automation()
