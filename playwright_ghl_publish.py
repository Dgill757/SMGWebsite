"""
SUMMIT OS — GHL Workflow Publisher
Uses Playwright to log into GHL, find draft workflows, publish them.
Also attempts to add AI agent prompts to the 6 key workflows.

Setup: Add to .env:
  GHL_EMAIL=your@email.com
  GHL_PASSWORD=yourpassword

Run: python playwright_ghl_publish.py
"""
import os, time
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv

load_dotenv()

GHL_EMAIL    = os.getenv("GHL_EMAIL", "")
GHL_PASSWORD = os.getenv("GHL_PASSWORD", "")
GHL_LOC      = os.getenv("GHL_LOCATION_ID", "u1lprxdJy1vmuaHEVJRM")
SS_DIR       = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")

TARGET_WORKFLOWS = [
    "SVA Reply Router", "SVA Main Outreach — Segment A",
    "SVA Positive Reply Handler", "SVA Marketing Audit + Demo Delivery",
    "SVA Demo Follow-Up (48hr)", "SVA Pre-Meeting Brief",
    "SVA Post-Call Follow-Up", "SVA No-Show Recovery",
    "SVA Stale Deal Nudge", "SVA Won Client Onboarding",
    "SVA 90-Day Reactivation", "SVA Dispatch Trigger",
    "SVA No Website — Auto Build", "SVA Lead Enrichment Agent",
    "SVA Content Autopilot",
]

def ss(page, name):
    os.makedirs(SS_DIR, exist_ok=True)
    path = os.path.join(SS_DIR, f"ghl_{name}_{int(time.time())}.png")
    try:
        page.screenshot(path=path)
        print(f"  [SS] {path}")
    except Exception:
        pass

def login(page):
    print("[GHL] Opening GoHighLevel...")
    page.goto("https://app.gohighlevel.com/", wait_until="networkidle", timeout=20000)
    time.sleep(2)
    if f"/location/{GHL_LOC}" in page.url or "dashboard" in page.url:
        print("[GHL] Already logged in")
        return
    if GHL_EMAIL and GHL_PASSWORD:
        try:
            page.fill('input[type="email"]', GHL_EMAIL)
            page.fill('input[type="password"]', GHL_PASSWORD)
            page.click('button[type="submit"]')
            page.wait_for_url("**dashboard**", timeout=20000)
            print("[GHL] ✓ Logged in")
            return
        except Exception as e:
            print(f"[GHL] Auto-login failed: {e}")
    print("\n[GHL] Please log in manually in the browser window.")
    print("      Tip: Add GHL_EMAIL + GHL_PASSWORD to .env to skip this next time.")
    input("      Press Enter when you're logged into GHL...\n")

def go_workflows(page):
    url = f"https://app.gohighlevel.com/location/{GHL_LOC}/automation/workflows"
    page.goto(url, wait_until="networkidle", timeout=20000)
    time.sleep(3)
    ss(page, "before")

def try_publish(page, name) -> str:
    """Try to open a workflow and toggle it to Published. Returns 'done', 'skipped', or 'not_found'."""
    # Try to find by text
    for selector in [f'text="{name}"', f'[title="{name}"]', f'*:has-text("{name[:20]}")']:
        try:
            el = page.locator(selector).first
            if el.count() > 0 and el.is_visible():
                el.click()
                time.sleep(2)
                break
        except Exception:
            continue
    else:
        return "not_found"

    # Try every toggle/publish button variant
    activated = False
    for sel in ['button:has-text("Publish")', 'button:has-text("Activate")',
                '[class*="toggle"]:not([class*="checked"])', 'input[role="switch"]:not([aria-checked="true"])']:
        try:
            btn = page.locator(sel).first
            if btn.count() > 0 and btn.is_visible():
                btn.click()
                time.sleep(1)
                # Confirm dialog
                for c in ['button:has-text("Save")', 'button:has-text("Confirm")', 'button:has-text("Yes")']:
                    try:
                        cb = page.locator(c).first
                        if cb.count() > 0 and cb.is_visible():
                            cb.click()
                            time.sleep(1)
                    except Exception:
                        pass
                activated = True
                break
        except Exception:
            pass

    ss(page, name[:20].replace(" ", "_"))
    page.go_back()
    time.sleep(1)
    return "done" if activated else "skipped"

def main():
    os.makedirs(SS_DIR, exist_ok=True)
    results = {"done": [], "skipped": [], "not_found": []}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=40)
        page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()

        login(page)
        go_workflows(page)

        print(f"\n[GHL] Processing {len(TARGET_WORKFLOWS)} workflows...\n")
        for name in TARGET_WORKFLOWS:
            status = try_publish(page, name)
            results[status].append(name)
            icon = {"done": "✓", "skipped": "~", "not_found": "?"}[status]
            print(f"  {icon} {name}")

        go_workflows(page)
        ss(page, "after")
        browser.close()

    with open("GHL_PLAYWRIGHT_RESULTS.txt", "w") as f:
        f.write("GHL WORKFLOW AUTOMATION RESULTS\n" + "="*40 + "\n\n")
        f.write(f"Published/toggled ({len(results['done'])}):\n")
        for w in results["done"]: f.write(f"  ✓ {w}\n")
        f.write(f"\nAlready active or skipped ({len(results['skipped'])}):\n")
        for w in results["skipped"]: f.write(f"  ~ {w}\n")
        f.write(f"\nNot found ({len(results['not_found'])}):\n")
        for w in results["not_found"]: f.write(f"  ? {w}\n")
        f.write("\n\nNEXT (manual, 10 min):\n")
        f.write("Paste AI prompts into 6 workflows from workflow_ai_agent_prompts.txt\n")
        f.write("GHL → Automation → [workflow] → AI Agent step → paste prompt → Save\n")

    print(f"\n[GHL] Done — Published: {len(results['done'])} | Skipped: {len(results['skipped'])} | Not found: {len(results['not_found'])}")
    print("      Full results: GHL_PLAYWRIGHT_RESULTS.txt")
    print("      Screenshots:  screenshots/ghl_*.png")

if __name__ == "__main__":
    main()
