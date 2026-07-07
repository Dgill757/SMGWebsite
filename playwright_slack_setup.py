"""
SUMMIT OS — Slack App Setup via Playwright
Creates the "Ava Studio" Slack app, gets webhook URL + bot token,
writes them to all .env files and Railway automatically.

Setup: Add to .env (optional — if not set, manual login prompt):
  SLACK_EMAIL=your@slack.email
  SLACK_PASSWORD=yourpassword

Run: python playwright_slack_setup.py
"""
import os, re, time, subprocess
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv

load_dotenv()

SLACK_EMAIL    = os.getenv("SLACK_EMAIL", "")
SLACK_PASSWORD = os.getenv("SLACK_PASSWORD", "")
RAILWAY_URL    = "https://ava-studio-api-production.up.railway.app"
SS_DIR         = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")

ENV_FILES = [
    os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"),
    r"C:\Users\DanGi\outreach\.env",
    r"C:\Users\DanGi\scripts\.env",
]


def upsert_env(key, value):
    for ef in ENV_FILES:
        if not os.path.exists(ef):
            continue
        try:
            with open(ef, "r") as f:
                content = f.read()
            if f"{key}=" in content:
                content = re.sub(rf"^{key}=.*$", f"{key}={value}", content, flags=re.MULTILINE)
            else:
                content = content.rstrip("\n") + f"\n{key}={value}\n"
            with open(ef, "w") as f:
                f.write(content)
            print(f"    Updated {ef}")
        except Exception as e:
            print(f"    Could not update {ef}: {e}")


def ss(page, name):
    os.makedirs(SS_DIR, exist_ok=True)
    path = os.path.join(SS_DIR, f"slack_{name}_{int(time.time())}.png")
    try:
        page.screenshot(path=path)
    except Exception:
        pass


def login(page):
    page.goto("https://api.slack.com/apps", wait_until="networkidle", timeout=20000)
    time.sleep(2)
    if "Your Apps" in page.content() or page.locator('a:has-text("Create New App")').count() > 0:
        print("[SLACK] Already logged in")
        return
    if SLACK_EMAIL and SLACK_PASSWORD:
        try:
            # Slack login flow
            page.click('a:has-text("Sign in")', timeout=5000)
            time.sleep(1)
            page.fill('#email', SLACK_EMAIL)
            page.click('#submit_btn')
            time.sleep(1)
            page.fill('#password', SLACK_PASSWORD)
            page.click('#submit_btn')
            page.wait_for_url("**/apps**", timeout=15000)
            print("[SLACK] ✓ Logged in")
            return
        except Exception as e:
            print(f"[SLACK] Auto-login failed: {e}")
    print("\n[SLACK] Please log in to api.slack.com manually in the browser.")
    print("        Add SLACK_EMAIL + SLACK_PASSWORD to .env to automate next time.")
    input("        Press Enter when logged in...\n")
    page.goto("https://api.slack.com/apps", wait_until="networkidle")


def get_or_create_app(page) -> str | None:
    """Returns app page URL after creating or finding 'Ava Studio' app."""
    page.goto("https://api.slack.com/apps", wait_until="networkidle")
    time.sleep(2)

    # Check if app exists
    app_link = page.locator('a:has-text("Ava Studio"), [data-app-name="Ava Studio"]').first
    if app_link.count() > 0:
        print("[SLACK] 'Ava Studio' app found — opening")
        app_link.click()
        time.sleep(2)
        return page.url

    # Create new app
    print("[SLACK] Creating 'Ava Studio' app...")
    try:
        page.click('a:has-text("Create New App"), button:has-text("Create New App")')
        time.sleep(1)
        # Choose "From scratch"
        from_scratch = page.locator('text="From scratch", button:has-text("From scratch")').first
        if from_scratch.count() > 0:
            from_scratch.click()
            time.sleep(1)
        # Fill name
        page.fill('[placeholder*="App Name"], input[name*="app"]', "Ava Studio")
        time.sleep(0.5)
        # Pick workspace (first available)
        try:
            ws_select = page.locator('select, [role="listbox"], .c-select__control').first
            if ws_select.count() > 0:
                ws_select.click()
                time.sleep(0.5)
                # Pick first workspace option
                option = page.locator('[role="option"]').first
                if option.count() > 0:
                    option.click()
                    time.sleep(0.5)
        except Exception:
            print("[SLACK] Could not auto-select workspace — please select manually")
            input("Select your workspace in the dropdown, then press Enter...")

        page.click('button:has-text("Create App")')
        time.sleep(2)
        print("[SLACK] ✓ App created")
        return page.url
    except Exception as e:
        print(f"[SLACK] App creation error: {e}")
        ss(page, "create_error")
        input("[SLACK] Please create 'Ava Studio' app manually, then press Enter...")
        return page.url


def setup_incoming_webhook(page, app_url: str) -> str | None:
    """Enable incoming webhooks and create one for #ava-dispatch. Returns webhook URL."""
    print("[SLACK] Setting up Incoming Webhook...")
    try:
        page.click('text="Incoming Webhooks"', timeout=5000)
        time.sleep(1)
    except Exception:
        page.goto(app_url.rstrip("/") + "/incoming-webhooks", wait_until="networkidle")
        time.sleep(2)

    # Enable toggle
    toggle = page.locator('.c-toggle__knob, input[type="checkbox"]').first
    try:
        if toggle.count() > 0:
            checked = toggle.get_attribute("aria-checked") or toggle.is_checked()
            if not checked or checked == "false":
                toggle.click()
                time.sleep(1)
    except Exception:
        pass

    # Add webhook to workspace
    try:
        page.click('a:has-text("Add New Webhook"), button:has-text("Add New Webhook")')
        time.sleep(2)
        # Search for #ava-dispatch
        search = page.locator('[placeholder*="channel"], [placeholder*="Search"]').first
        if search.count() > 0:
            search.fill("ava-dispatch")
            time.sleep(1)
            option = page.locator('text="#ava-dispatch", [data-channel-name="ava-dispatch"]').first
            if option.count() > 0:
                option.click()
                time.sleep(0.5)
            else:
                print("[SLACK] #ava-dispatch not found — create that channel in Slack first!")
                print("        Go to Slack → + New Channel → name it 'ava-dispatch'")
                input("        Press Enter after creating #ava-dispatch...")
                search.fill("ava-dispatch")
                time.sleep(1)
                page.locator('text="#ava-dispatch"').first.click()
                time.sleep(0.5)
        page.click('button:has-text("Allow")')
        time.sleep(2)
    except Exception as e:
        print(f"[SLACK] Webhook add error: {e}")

    # Capture webhook URL
    ss(page, "webhook")
    for sel in ['code:has-text("hooks.slack.com")', 'input[value*="hooks.slack.com"]',
                '[class*="webhook-url"] code', '.copy-url code']:
        try:
            el = page.locator(sel).first
            if el.count() > 0:
                url = el.text_content() or el.get_attribute("value") or ""
                url = url.strip()
                if url.startswith("https://hooks.slack.com"):
                    print(f"[SLACK] ✓ Webhook URL captured")
                    return url
        except Exception:
            pass
    print("[SLACK] Could not auto-capture webhook URL")
    url = input("[SLACK] Paste the webhook URL from the page (starts with https://hooks.slack.com): ").strip()
    return url if url.startswith("https://") else None


def setup_oauth_scopes(page, app_url: str) -> str | None:
    """Add bot token scopes and install app. Returns bot token."""
    print("[SLACK] Setting up OAuth scopes...")
    try:
        page.click('text="OAuth & Permissions"', timeout=5000)
    except Exception:
        page.goto(app_url.rstrip("/") + "/oauth", wait_until="networkidle")
    time.sleep(2)

    scopes = ["channels:history", "channels:read", "chat:write", "commands", "users:read"]
    for scope in scopes:
        try:
            page.click('button:has-text("Add an OAuth Scope")')
            time.sleep(0.3)
            inp = page.locator('[placeholder*="Search"], [class*="scope"] input').first
            if inp.count() > 0:
                inp.fill(scope)
                time.sleep(0.3)
                page.locator(f'text="{scope}"').first.click()
                time.sleep(0.3)
                print(f"  ✓ Scope: {scope}")
        except Exception:
            pass  # Scope may already be added

    # Install to workspace
    try:
        page.click('button:has-text("Install to Workspace"), a:has-text("Reinstall")')
        time.sleep(2)
        page.click('button:has-text("Allow")')
        time.sleep(2)
    except Exception as e:
        print(f"[SLACK] Install error: {e}")

    # Get bot token
    ss(page, "oauth")
    for sel in ['code:has-text("xoxb-")', 'input[value*="xoxb-"]']:
        try:
            el = page.locator(sel).first
            if el.count() > 0:
                token = (el.text_content() or el.get_attribute("value") or "").strip()
                if token.startswith("xoxb-"):
                    print("[SLACK] ✓ Bot token captured")
                    return token
        except Exception:
            pass
    print("[SLACK] Could not auto-capture bot token")
    token = input("[SLACK] Paste the Bot User OAuth Token (starts with xoxb-): ").strip()
    return token if token.startswith("xoxb-") else None


def setup_slash_commands(page, app_url: str):
    print("[SLACK] Creating slash commands...")
    commands = [
        ("/demo",   "Build a demo for any roofing company",  "[website url]"),
        ("/audit",  "Run a marketing audit",                 "[url]"),
        ("/status", "System health check for all agents",    ""),
        ("/scrape", "Trigger Apollo scraper for a city",     "[city state]"),
    ]
    try:
        page.click('text="Slash Commands"', timeout=5000)
        time.sleep(1)
        for cmd, desc, hint in commands:
            try:
                page.click('button:has-text("Create New Command")')
                time.sleep(1)
                page.fill('[placeholder*="Command"], input[name="command"]', cmd)
                page.fill('[placeholder*="URL"], input[name="url"]', f"{RAILWAY_URL}/slack/command")
                page.fill('[placeholder*="Description"], input[name="description"]', desc)
                if hint:
                    page.fill('[placeholder*="Hint"], input[name="usage_hint"]', hint)
                page.click('button:has-text("Save")')
                time.sleep(1)
                print(f"  ✓ {cmd}")
            except Exception as e:
                print(f"  ✗ {cmd}: {e}")
    except Exception as e:
        print(f"[SLACK] Slash commands: {e}")


def push_to_railway(webhook: str | None, token: str | None):
    if webhook:
        r = subprocess.run(["railway", "variables", "set", f"SLACK_WEBHOOK_URL={webhook}"],
                           capture_output=True, text=True)
        print(f"[RAILWAY] SLACK_WEBHOOK_URL: {'✓' if r.returncode == 0 else '✗ ' + r.stderr[:40]}")
    if token:
        r = subprocess.run(["railway", "variables", "set", f"SLACK_BOT_TOKEN={token}"],
                           capture_output=True, text=True)
        print(f"[RAILWAY] SLACK_BOT_TOKEN: {'✓' if r.returncode == 0 else '✗ ' + r.stderr[:40]}")
    if webhook or token:
        print("[RAILWAY] Run 'railway up' to activate Slack in the backend")


def main():
    os.makedirs(SS_DIR, exist_ok=True)
    creds = {"webhook": None, "token": None}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=40)
        page = browser.new_context(viewport={"width": 1440, "height": 900}).new_page()

        login(page)
        app_url = get_or_create_app(page)

        if app_url:
            creds["webhook"] = setup_incoming_webhook(page, app_url)
            creds["token"]   = setup_oauth_scopes(page, app_url)
            setup_slash_commands(page, app_url)

        browser.close()

    # Save to .env files
    if creds["webhook"]:
        upsert_env("SLACK_WEBHOOK_URL", creds["webhook"])
    if creds["token"]:
        upsert_env("SLACK_BOT_TOKEN", creds["token"])

    # Push to Railway
    push_to_railway(creds["webhook"], creds["token"])

    # Write results
    with open("SLACK_SETUP_RESULTS.txt", "w") as f:
        f.write("SLACK APP SETUP RESULTS\n" + "="*40 + "\n\n")
        f.write(f"Webhook URL: {'✓ saved to .env' if creds['webhook'] else '✗ NOT captured'}\n")
        f.write(f"Bot Token:   {'✓ saved to .env' if creds['token'] else '✗ NOT captured'}\n\n")
        f.write("NEXT STEPS:\n")
        f.write("1. Go to Slack → invite @Ava Studio to #ava-dispatch\n")
        f.write("2. Run: railway up\n")
        f.write("3. Test in Slack: /status\n")

    print(f"\n[SLACK] Done. Webhook: {'✓' if creds['webhook'] else '✗'} | Token: {'✓' if creds['token'] else '✗'}")
    print("         Results: SLACK_SETUP_RESULTS.txt")


if __name__ == "__main__":
    main()
