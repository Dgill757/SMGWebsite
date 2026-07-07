"""
Summit Voice AI — Daily Content Generator
Save to: C:/Users/DanGi/scripts/content_generator.py

Runs every Monday at 7:00 AM via Windows Task Scheduler.
Generates a full week of content for LinkedIn, Facebook, Instagram, Twitter, TikTok.
Saves to C:/Users/DanGi/outreach/content/[date]_content.json
Sends summary to Slack #ava-dispatch.
"""

import os, json, requests
from anthropic import Anthropic
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

ai = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
SLACK_WEBHOOK = os.getenv("SLACK_WEBHOOK_URL", "")

CONTENT_SYSTEM_PROMPT = """You are writing social content for Dan Gill III,
founder of Summit Voice AI. Dan spent 10 years in roofing before building
this company. He writes like he's texting another roofer, not marketing to one.

VOICE RULES (non-negotiable):
- Short sentences. Max 12 words per sentence.
- No em dashes. Use ... for pauses.
- No corporate words: leverage, synergy, game-changing, revolutionary
- Lowercase subject lines only
- Specific beats vague: "3 missed calls" not "missed calls"
- Always includes one of these stats: 67% / $9,500 / $16/day / $50-100K/yr
- CTA is always: calendly.com/aivoice/call or a direct question
- Former roofer energy -- he's been on the roof, he knows what they deal with

CONTENT PILLARS (rotate weekly):
Week 1: MONEY LEAK -- the revenue roofers are losing right now
Week 2: MINDSET SHIFT -- challenge how they think about their business
Week 3: THE SYSTEM -- how Ava actually works (demystify the AI)
Week 4: THE PROOF -- results, data, math
Week 5: THE COMPETITION -- why this beats a receptionist"""

PILLARS = [
    "MONEY LEAK",
    "MINDSET SHIFT",
    "THE SYSTEM",
    "THE PROOF",
    "THE COMPETITION",
]

HOOKS = [
    ("3-5 missed calls per day", "At $9,500 avg job that's $50-100K/year walking out the door"),
    ("67% of calls go unanswered", "Your competitor answered. You didn't. They got the job."),
    ("A receptionist costs $40K/year", "This costs $16/day and never calls in sick"),
    ("The phone rings when you're on the roof", "Every. Single. Time."),
    ("Most roofers don't have a follow-up system", "The ones who do win 2-3x more jobs from the same leads"),
]

PROMPT = """You are the content strategist for Summit Voice AI.

Owner context: Dan Gill III. Former roofer. 10 years in the trades.
Now builds AI systems for roofing contractors — specifically because he lived the problem.
He is not a tech marketer. He is a roofer who got tired of watching owners lose money.

This week's focus: {pillar}
Hook to anchor content around: {hook_a} — {hook_b}
Today's date: {date}

Create content for 5 platforms. Apply these rules to every post:
- Write like you're texting another contractor, not writing an ad
- No em dashes. Use ... for pauses.
- Lowercase is fine. Sentence case is fine. Title case is NOT fine.
- Never start a sentence with "Are you..."
- Never use "game-changing", "revolutionary", "leverage", "unlock"
- No exclamation points except once per post maximum
- Be specific. "3 calls" beats "calls". "$9,500" beats "money".
- The CTA is always either: calendly.com/aivoice/call OR a direct question back to the reader

KEY STATS (use them naturally):
- 67% of calls to small roofing businesses go unanswered
- Average roofing job value: $9,500
- Missed calls per day: 3-5 (industry average)
- Annual missed revenue: $1.56M to $8.67M
- Ava: answers calls, books jobs, follows up, gets reviews. 24/7. Starts at $16/day.

---

LINKEDIN POST:
Hook line (3-8 words, bold if markdown supported)
2-3 short paragraphs
End with 1 question or CTA
150-250 words
Voice: Owner talking to owners. Peer level. Not a pitch.

---

FACEBOOK POST:
More personal/story-driven
Could start with "this happened on a job site..." or similar
100-200 words
Voice: Conversational contractor

---

INSTAGRAM CAPTION:
First line MUST stop the scroll — surprising stat or provocation
3-4 short staccato lines
1 line CTA
5 hashtags at end
80-150 words total (not counting hashtags)

---

TWITTER POST 1:
Under 240 characters
Counterintuitive or contrarian angle
No hashtags

---

TWITTER POST 2:
Under 240 characters
Pure math or stat-based
No hashtags

---

TIKTOK SCRIPT:
45-75 seconds spoken
Open with the most surprising or provocative claim
Raw, direct, from the roof
Like Dan is talking to camera in his truck
No "hey guys" opener
End with a question that prompts comments
Include [PAUSE], [CUT], [HOLD ON SCREEN] direction cues

---

Return ONLY valid JSON with no markdown fences:
{{
  "week_date": "{date}",
  "pillar": "{pillar}",
  "hook": "{hook_a}",
  "linkedin": "...",
  "facebook": "...",
  "instagram": "...",
  "twitter_1": "...",
  "twitter_2": "...",
  "tiktok_script": "...",
  "best_post_this_week": "linkedin or facebook or instagram or tiktok"
}}"""


def generate_weekly_content():
    week_num = datetime.now().isocalendar()[1]
    pillar = PILLARS[week_num % len(PILLARS)]
    hook_a, hook_b = HOOKS[week_num % len(HOOKS)]
    date_str = datetime.now().strftime("%B %d, %Y")

    print(f"[CONTENT] Generating week {week_num} — pillar: {pillar}")

    prompt = PROMPT.format(
        pillar=pillar,
        hook_a=hook_a,
        hook_b=hook_b,
        date=date_str,
    )

    msg = ai.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        system=CONTENT_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = msg.content[0].text.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    try:
        content = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"[CONTENT] JSON parse error: {e}")
        print(f"Raw output: {raw[:500]}")
        return None

    # Save to file
    output_dir = r"C:\Users\DanGi\outreach\content"
    os.makedirs(output_dir, exist_ok=True)
    filename = os.path.join(output_dir, f"{datetime.now().strftime('%Y-%m-%d')}_content.json")

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2, ensure_ascii=False)

    print(f"[CONTENT] Saved to {filename}")

    # Send Slack notification
    if SLACK_WEBHOOK:
        linkedin_preview = content.get("linkedin", "")[:200]
        tiktok_hook = content.get("tiktok_script", "")[:150]
        best = content.get("best_post_this_week", "linkedin")

        slack_msg = f"""📅 *Weekly Content Calendar Ready — {date_str}*

*Pillar this week:* {pillar}
*Anchor hook:* {hook_a}
*Best post of the week:* {best.upper()}

*LinkedIn preview:*
{linkedin_preview}...

*TikTok script hook:*
{tiktok_hook}...

📁 Full calendar: `{filename}`
🖥️ Dashboard: https://avadashboard.summitvoiceai.com → Dispatch to schedule"""

        try:
            requests.post(SLACK_WEBHOOK, json={"text": slack_msg}, timeout=8)
            print("[CONTENT] Slack notification sent")
        except Exception as e:
            print(f"[CONTENT] Slack notification failed: {e}")

    return content


if __name__ == "__main__":
    result = generate_weekly_content()
    if result:
        print(f"\n[DONE] Content generated successfully")
        print(f"Best post this week: {result.get('best_post_this_week', 'linkedin').upper()}")
        print(f"\nLinkedIn preview:\n{result.get('linkedin', '')[:300]}...")
    else:
        print("[FAILED] Content generation failed")

