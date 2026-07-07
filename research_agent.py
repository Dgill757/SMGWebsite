"""
SUMMIT VOICE AI — DAILY RESEARCH AGENT
========================================
Runs daily to gather intelligence on:
- Voice AI news for the trades/roofing industry
- Roofing industry trends and news
- Competitor monitoring (AI tools targeting roofing)
- Reddit discussions about roofing + AI
- YouTube trends in roofing/contractor content
- Apollo lead quality updates

Schedule: Every Tuesday and Thursday at 6:30am (odd days so it doesn't conflict with scraper)
Output: Saves to SummitVault/WIKI/MARKET/[date]-research.md + sends to Slack
"""

import os, httpx, json, asyncio
from anthropic import Anthropic
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

ai = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
SLACK_WEBHOOK = os.getenv("SLACK_WEBHOOK_URL", "")
FIRECRAWL_KEY = os.getenv("FIRECRAWL_API_KEY", "")
VAULT_PATH = r"C:\Users\DanGi\SummitVault"


# ── RESEARCH SOURCES ──────────────────────────────────────────────────────────

RESEARCH_QUERIES = {
    "voice_ai_roofing": [
        "AI voice receptionist for roofing contractors 2026",
        "roofing company phone AI automation",
        "missed calls roofing business AI",
    ],
    "competitors": [
        "AI tools for roofing contractors site:producthunt.com",
        "roofing CRM AI automation 2026",
        "Smith.ai GoHighLevel roofing",
    ],
    "roofing_industry": [
        "roofing industry news 2026",
        "roofing contractor marketing trends",
        "storm damage roofing season forecast 2026",
    ],
    "reddit_roofing": [
        "site:reddit.com roofing contractor technology AI",
        "site:reddit.com r/Roofing automation software",
    ],
}

COMPETITOR_URLS = [
    "https://smith.ai",
    "https://www.myjennai.com",
    "https://www.jobber.com/roofing",
    "https://www.servicetitan.com",
]


async def firecrawl_search(query: str, limit: int = 3) -> list:
    """Use Firecrawl to search the web and return summaries."""
    if not FIRECRAWL_KEY:
        return []

    async with httpx.AsyncClient(timeout=20) as client:
        try:
            r = await client.post(
                "https://api.firecrawl.dev/v0/search",
                headers={"Authorization": f"Bearer {FIRECRAWL_KEY}", "Content-Type": "application/json"},
                json={"query": query, "limit": limit, "scrapeOptions": {"formats": ["markdown"]}}
            )
            if r.status_code == 200:
                return r.json().get("data", [])
        except Exception as e:
            print(f"[RESEARCH] Firecrawl search error: {e}")
    return []


async def check_competitor_pages() -> list:
    """Briefly check competitor homepages for major changes."""
    results = []
    if not FIRECRAWL_KEY:
        return results

    async with httpx.AsyncClient(timeout=20) as client:
        for url in COMPETITOR_URLS:
            try:
                r = await client.post(
                    "https://api.firecrawl.dev/v0/scrape",
                    headers={"Authorization": f"Bearer {FIRECRAWL_KEY}", "Content-Type": "application/json"},
                    json={"url": url, "formats": ["markdown"], "actions": [], "onlyMainContent": True}
                )
                if r.status_code == 200:
                    md = r.json().get("data", {}).get("markdown", "")[:1500]
                    results.append({"url": url, "content": md})
            except Exception:
                pass
    return results


async def check_reddit_buying_signals() -> list:
    """Look for roofers actively asking about phone answering / AI solutions."""
    queries = [
        "roofing contractor phone answering site:reddit.com",
        "roofing business missing calls site:reddit.com",
        "r/Roofing AI receptionist",
        "roofing CRM automation 2026 site:reddit.com",
    ]
    signals = []
    for q in queries:
        results = await firecrawl_search(q, limit=2)
        for r in results:
            if any(w in r.get("markdown", "").lower()
                   for w in ["answer", "miss", "call", "phone", "ai", "automat"]):
                signals.append({
                    "url": r.get("url"),
                    "snippet": r.get("markdown", "")[:300],
                    "signal_type": "reddit_buying",
                })
    return signals


async def synthesize_research(raw_results: dict) -> str:
    """Use Claude to synthesize all research into actionable intelligence."""
    
    # Format research data for Claude
    research_text = json.dumps(raw_results, indent=2)[:6000]  # Keep within context

    msg = ai.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1200,
        messages=[{"role": "user", "content": f"""You are the research agent for Summit Voice AI, a company selling AI voice receptionist to roofing contractors.

Here is today's research data gathered from web searches:
{research_text}

Synthesize this into a concise intelligence brief. Include:

1. **VOICE AI NEWS** (2-3 bullet points about voice AI trends relevant to roofing)

2. **COMPETITOR INTEL** (what are the main AI tools targeting roofing? pricing? positioning?)

3. **ROOFING INDUSTRY** (any seasonal trends, market news, or opportunities for Summit Voice AI?)

4. **CONTENT OPPORTUNITIES** (based on trending topics, what should Summit Voice AI post about this week?)

5. **MARKET GAP** (is there anything competitors are NOT doing that Summit Voice AI could capitalize on?)

6. **ACTION FOR DAN** (1-2 specific things Dan should do based on this research)

Keep each section to 2-3 sentences. Be direct. Skip anything not actionable.
Format as plain text with the headers above."""}]
    )

    return msg.content[0].text


async def run_research_agent():
    """Main research runner. Call this on a schedule."""
    print(f"[RESEARCH] Starting daily research — {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    raw_results = {}

    # 1. Voice AI searches
    print("[RESEARCH] Searching for voice AI news...")
    for query in RESEARCH_QUERIES["voice_ai_roofing"]:
        results = await firecrawl_search(query)
        if results:
            raw_results[query] = [{"url": r.get("url", ""), "content": r.get("markdown", "")[:800]} for r in results]

    # 2. Competitor intel
    print("[RESEARCH] Checking competitors...")
    comp_data = await check_competitor_pages()
    if comp_data:
        raw_results["competitors"] = comp_data

    # 3. Industry news
    print("[RESEARCH] Industry news...")
    for query in RESEARCH_QUERIES["roofing_industry"]:
        results = await firecrawl_search(query, limit=2)
        if results:
            raw_results[f"industry_{query[:20]}"] = [{"url": r.get("url", ""), "content": r.get("markdown", "")[:600]} for r in results]

    # 3b. Reddit buying signals (roofers actively asking about phone/AI right now)
    print("[RESEARCH] Checking Reddit for buying signals...")
    try:
        signals = await check_reddit_buying_signals()
        if signals:
            raw_results["reddit_buying_signals"] = signals
            print(f"[RESEARCH] {len(signals)} Reddit buying signals found")
    except Exception as e:
        print(f"[RESEARCH] Reddit signal check failed: {e}")

    # 4. Synthesize
    print("[RESEARCH] Synthesizing with Claude...")
    intel_brief = await synthesize_research(raw_results)

    # 5. Save to vault
    date_str = datetime.now().strftime("%Y-%m-%d")
    vault_path = os.path.join(VAULT_PATH, "WIKI", "MARKET", f"{date_str}-research.md")
    os.makedirs(os.path.dirname(vault_path), exist_ok=True)

    with open(vault_path, "w", encoding="utf-8") as f:
        f.write(f"# Research Brief — {date_str}\n\n")
        f.write(intel_brief)
        f.write(f"\n\n---\n*Generated by Summit OS Research Agent*\n")

    print(f"[RESEARCH] ✓ Saved to vault: {vault_path}")

    # 6. Post to Slack
    if SLACK_WEBHOOK:
        slack_msg = f"""🔍 *Summit OS — Research Brief · {date_str}*

{intel_brief[:1500]}

Full report: `{vault_path}`"""
        import requests as req
        try:
            req.post(SLACK_WEBHOOK, json={"text": slack_msg}, timeout=8)
            print("[RESEARCH] ✓ Sent to Slack #ava-dispatch")
        except Exception as e:
            print(f"[RESEARCH] Slack error: {e}")

    return intel_brief


# ── REDDIT MONITOR ────────────────────────────────────────────────────────────
async def monitor_reddit_roofing() -> list:
    """
    Monitor Reddit for roofing + AI discussions.
    Uses Firecrawl to search Reddit without API keys.
    """
    subreddits = ["r/Roofing", "r/ContractorTalk", "r/smallbusiness"]
    results = []

    for sub in subreddits:
        query = f"site:reddit.com {sub} AI automation phone"
        posts = await firecrawl_search(query, limit=2)
        for p in posts:
            if "reddit.com" in p.get("url", ""):
                results.append({
                    "subreddit": sub,
                    "url": p.get("url"),
                    "snippet": p.get("markdown", "")[:300]
                })

    if results:
        # Check if any represent buying signals
        msg = ai.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            messages=[{"role": "user", "content": f"""These are Reddit posts about roofing and AI/automation:

{json.dumps(results, indent=2)[:2000]}

Is there anyone asking about:
- Phone answering automation for roofing?
- Missing calls?
- CRM or AI tools for roofing?

If yes, list the URL and why it's relevant. If no, just say "No buying signals."
Keep it very brief."""}]
        )
        return {"reddit_results": results, "analysis": msg.content[0].text}

    return {}


# ── SCHEDULER TASK ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if not SLACK_WEBHOOK or "YOUR_SLACK" in SLACK_WEBHOOK:
        print("[RESEARCH] SLACK_WEBHOOK_URL not set -- brief saves to vault only. See MISSING_INTEGRATIONS.txt")
    asyncio.run(run_research_agent())

# Add to Windows Task Scheduler:
# Task name: Summit Research Agent  
# Schedule: Tue/Thu at 6:30 AM
# Action: python C:\Users\DanGi\scripts\research_agent.py

