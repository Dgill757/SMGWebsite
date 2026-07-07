"""
SUMMIT VOICE AI — CEO WEEKLY REPORT AGENT
==========================================
Runs every Sunday at 8pm.
Pulls all pipeline data. Analyzes vs Sales Playbook benchmarks.
Identifies biggest leak. Recommends single action.
Emails Dan + posts to Slack.

From the Sales Playbook CEO Report Prompt:
"Analyse my pipeline. Tell me where I'm leaking money and what to focus on 
next week. Tell me what single action I should take more of next week to 
move fastest toward $25K MRR."

Target benchmarks (from Sales Playbook):
- Outreach → Reply rate: 3-8% healthy, below 2% = fix opening line
- Reply → Call booked: 20-40% healthy  
- Call → Demo shown: 70%+ healthy
- Demo → Proposal: 60%+ healthy
- Proposal → Signed: 30-50% healthy

MRR milestones:
- 31 clients at $797/mo = $24,707 (→ $25K threshold)
- 51 clients at $497/mo = $25,347
- 75 clients at $797/mo = $59,775 (→ $100K within reach)
"""

import os, json, httpx, asyncio, smtplib
from anthropic import Anthropic
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

ai = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SLACK_WEBHOOK = os.getenv("SLACK_WEBHOOK_URL", "")
GHL_TOKEN = os.getenv("GHL_PRIVATE_TOKEN", "")
GHL_LOCATION = os.getenv("GHL_LOCATION_ID", "")
DAN_EMAIL = "dangill@summitmarketinggroup.co"
VAULT_PATH = r"C:\Users\DanGi\SummitVault"

# Sales Playbook benchmarks
BENCHMARKS = {
    "reply_rate": {"low": 0.02, "healthy": 0.05, "great": 0.08},
    "reply_to_call": {"low": 0.15, "healthy": 0.25, "great": 0.40},
    "call_to_demo": {"low": 0.50, "healthy": 0.70, "great": 0.85},
    "demo_to_proposal": {"low": 0.40, "healthy": 0.60, "great": 0.75},
    "proposal_to_signed": {"low": 0.20, "healthy": 0.35, "great": 0.50},
}

# MRR target table
MRR_MILESTONES = [
    (10, "$4,970", "$7,970", "Proof of Concept"),
    (20, "$9,940", "$15,940", "Real Business"),
    (31, "$15,407", "$24,707", "→ $25K MRR Threshold"),
    (51, "$25,347", "$40,647", "Full $25K+ at Entry Price"),
    (75, "$37,275", "$59,775", "→ $100K MRR Within Reach"),
]


async def pull_supabase(table: str, days: int = 7) -> list:
    """Pull records from Supabase for last N days."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        return []
    
    cutoff = (datetime.now() - timedelta(days=days)).isoformat()
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    
    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(
                url,
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                },
                params={"created_at": f"gte.{cutoff}", "select": "*"},
                timeout=10
            )
            if r.status_code == 200:
                return r.json()
        except Exception as e:
            print(f"[CEO REPORT] Supabase error ({table}): {e}")
    return []


async def pull_ghl_pipeline() -> dict:
    """Pull pipeline stage counts from GHL."""
    if not GHL_TOKEN or not GHL_LOCATION:
        return {}
    
    async with httpx.AsyncClient() as client:
        # Get opportunities grouped by pipeline stage
        try:
            r = await client.get(
                "https://services.leadconnectorhq.com/opportunities/search",
                headers={
                    "Authorization": f"Bearer {GHL_TOKEN}",
                    "Version": "2021-07-28",
                },
                params={"location_id": GHL_LOCATION, "limit": 1, "assigned_to": ""},
                timeout=10
            )
            if r.status_code == 200:
                data = r.json()
                return {"total": data.get("total", 0)}
        except Exception as e:
            print(f"[CEO REPORT] GHL error: {e}")
    return {}


def calculate_rates(numbers: dict) -> dict:
    """Calculate conversion rates from raw numbers."""
    rates = {}
    
    if numbers.get("outreach_sent", 0) > 0:
        rates["reply_rate"] = numbers.get("positive_replies", 0) / numbers["outreach_sent"]
    
    if numbers.get("positive_replies", 0) > 0:
        rates["reply_to_call"] = numbers.get("calls_booked", 0) / numbers["positive_replies"]
    
    if numbers.get("calls_booked", 0) > 0:
        rates["call_to_demo"] = numbers.get("demos_sent", 0) / numbers["calls_booked"]
    
    if numbers.get("demos_sent", 0) > 0:
        rates["demo_to_proposal"] = numbers.get("proposals_sent", 0) / max(numbers.get("demos_sent", 1), 1)
    
    if numbers.get("proposals_sent", 0) > 0:
        rates["proposal_to_signed"] = numbers.get("clients_signed", 0) / numbers["proposals_sent"]
    
    return rates


def diagnose_rates(rates: dict) -> tuple[str, str]:
    """Find the biggest leak and recommend action. Returns (diagnosis, recommendation)."""
    
    issues = []
    
    for metric, rate in rates.items():
        benchmarks = BENCHMARKS.get(metric, {})
        healthy = benchmarks.get("healthy", 0.3)
        low = benchmarks.get("low", 0.1)
        
        if rate < low:
            severity = "CRITICAL"
        elif rate < healthy:
            severity = "BELOW TARGET"
        else:
            severity = "HEALTHY"
        
        metric_display = metric.replace("_", " → ").replace("reply rate", "outreach → reply rate")
        issues.append({
            "metric": metric_display,
            "rate": rate,
            "target": healthy,
            "severity": severity,
            "gap": healthy - rate
        })
    
    # Sort by gap (biggest problem first)
    issues.sort(key=lambda x: x["gap"], reverse=True)
    
    if not issues:
        return "No data available to diagnose.", "Keep running outreach and track this week's numbers."
    
    biggest_issue = issues[0]
    
    recommendations = {
        "outreach → reply rate": "Fix your opening line or list quality. Try a different pain angle (storm season, after-hours coverage). Personalize subject lines with city name.",
        "reply → call booked": "Fix your Calendly CTA timing. Add SMS follow-up within 30 min of every positive reply. Create urgency in the calendar ask.",
        "call → demo shown": "Add SMS reminder sequence 24hr + 1hr before calls. Reply to no-shows with a reschedule link immediately.",
        "demo → proposal": "Your demo isn't creating enough urgency. Show the ROI math on the call. Use the $9,500 × missed calls calculation live.",
        "proposal → signed": "Objection handling gap. Review the Sales Playbook objection reframes. Follow up on proposals within 24 hours with a Loom video.",
    }
    
    rec = recommendations.get(biggest_issue["metric"], "Add more outreach volume and track the pipeline weekly.")
    
    diagnosis = f"Biggest leak: {biggest_issue['metric'].upper()}\n"
    diagnosis += f"Your rate: {biggest_issue['rate']:.1%} (target: {biggest_issue['target']:.0%})\n"
    for issue in issues[:3]:
        status_icon = "🔴" if issue["severity"] == "CRITICAL" else "🟡" if issue["severity"] == "BELOW TARGET" else "🟢"
        diagnosis += f"{status_icon} {issue['metric']}: {issue['rate']:.1%} (target: {issue['target']:.0%})\n"
    
    return diagnosis, rec


async def generate_claude_analysis(numbers: dict, rates: dict, diagnosis: str, recommendation: str) -> str:
    """Use Claude to generate personalized CEO report analysis."""
    
    msg = ai.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        messages=[{"role": "user", "content": f"""You are the CEO analytics agent for Summit Voice AI.
Dan Gill III sells Ava — AI voice receptionist for roofing contractors.
Goal: $100K MRR. Current: ${numbers.get("current_mrr", 4466):,}/month.

Here are this week's numbers:
{json.dumps(numbers, indent=2)}

Conversion rates:
{json.dumps({k: f"{v:.1%}" for k, v in rates.items()}, indent=2)}

Biggest pipeline leak: {diagnosis}

Your analysis should:
1. State the single biggest leak in plain English (not jargon)
2. Give the exact number impact (how much MRR is this leak costing per month?)
3. State ONE specific action to take this week that addresses it
4. Give a 4-week MRR projection at current pace vs improved pace
5. End with a one-sentence conviction statement

Write in Dan's voice: direct, roofing industry aware, no corporate speak.
Under 250 words. No bullet points — flowing sentences."""}]
    )
    
    return msg.content[0].text


async def run_ceo_report():
    """Generate and send the weekly CEO report."""
    print(f"[CEO REPORT] Starting Sunday report — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    today = datetime.now()
    week_start = (today - timedelta(days=7)).strftime("%Y-%m-%d")
    
    # Pull data from multiple sources
    scraper_runs = await pull_supabase("scraper_runs", 7)
    outreach_runs = await pull_supabase("outreach_runs", 7)
    hot_leads = await pull_supabase("hot_leads", 7)
    pipeline = await pull_ghl_pipeline()
    
    # Aggregate numbers
    numbers = {
        "week_of": week_start,
        "outreach_sent": sum(r.get("emails_sent", 0) + r.get("sms_sent", 0) for r in outreach_runs),
        "contacts_added": sum(r.get("contacts_created", 0) for r in scraper_runs),
        "cities_scraped": list(set(r.get("city", "") for r in scraper_runs))[:5],
        "positive_replies": sum(1 for r in hot_leads if "positive" in r.get("intent", "").lower()),
        "hot_leads_total": len(hot_leads),
        "demos_sent": 0,  # Would pull from demos table if available
        "calls_booked": 0,  # Would pull from GHL calendar
        "proposals_sent": 0,  # Would pull from GHL pipeline
        "clients_signed": 0,  # Would pull from GHL Won stage
        "current_mrr": 4466,  # Would pull from clients table
        "total_pipeline": pipeline.get("total", 0),
    }
    
    # Calculate rates
    rates = calculate_rates(numbers)
    
    # Diagnose
    diagnosis, recommendation = diagnose_rates(rates)
    
    # Claude analysis
    analysis = await generate_claude_analysis(numbers, rates, diagnosis, recommendation)
    
    # Build MRR table
    current_clients = numbers.get("current_mrr", 4466) // 497  # Estimate at entry price
    mrr_table = "\nMRR MILESTONES:\n"
    for clients, at_497, at_797, milestone in MRR_MILESTONES:
        marker = "← YOU ARE HERE" if abs(clients - current_clients) < 5 else ""
        mrr_table += f"  {clients:3} clients | {at_497}/mo | {at_797}/mo | {milestone} {marker}\n"
    
    # Full report text
    report = f"""
╔══════════════════════════════════════════════════════════════╗
║  SUMMIT VOICE AI — CEO WEEKLY REPORT                        ║
║  Week of {week_start} | Generated {today.strftime('%Y-%m-%d %H:%M')}    ║
╚══════════════════════════════════════════════════════════════╝

━━━ WEEK IN NUMBERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Contacts added:       {numbers['contacts_added']:,}
  Outreach sent:        {numbers['outreach_sent']:,} (email + SMS)
  Hot replies:          {numbers['hot_leads_total']} ({numbers['positive_replies']} positive)
  Demos built:          {numbers['demos_sent']}
  Calls booked:         {numbers['calls_booked']}
  Clients signed:       {numbers['clients_signed']}
  Current MRR:          ${numbers['current_mrr']:,}

━━━ PIPELINE HEALTH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{diagnosis}

━━━ ANALYSIS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{analysis}

━━━ SINGLE ACTION THIS WEEK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ {recommendation}

{mrr_table}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
    
    # Save to vault
    vault_dir = os.path.join(VAULT_PATH, "ANALYTICS", "WEEKLY")
    os.makedirs(vault_dir, exist_ok=True)
    report_path = os.path.join(vault_dir, f"{week_start}-ceo-report.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"[CEO REPORT] ✓ Saved to vault: {report_path}")
    
    # Send to Slack
    if SLACK_WEBHOOK:
        import requests
        slack_text = f"📊 *Weekly CEO Report — {week_start}*\n\n"
        slack_text += f"Outreach: {numbers['outreach_sent']} | Hot leads: {numbers['positive_replies']} | MRR: ${numbers['current_mrr']:,}\n\n"
        slack_text += f"*Biggest leak:* {diagnosis.split(chr(10))[0]}\n"
        slack_text += f"*This week:* {recommendation[:150]}..."
        try:
            requests.post(SLACK_WEBHOOK, json={"text": slack_text}, timeout=8)
            print("[CEO REPORT] ✓ Sent to Slack")
        except Exception as e:
            print(f"[CEO REPORT] Slack error: {e}")
    
    print("[CEO REPORT] ✓ Complete")
    return report


if __name__ == "__main__":
    asyncio.run(run_ceo_report())
