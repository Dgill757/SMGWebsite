"""
THINKER VOICE AI AUTOMATION  (v2 — Web Agent mode)
====================================================
Automates agent creation on app.summitvoiceai.com (Thinker platform).

Flow Dan uses:
1. Log in
2. Add Agent → Web and Phone (web agents need no phone number)
3. Agent name = company name
4. Train from website URL
5. Select voice (Marissa preferred, Susan fallback)
6. Click "Select Agent"
7. AI co-pilot fills identity fields
8. Agent Training → Web Agent → enter Vercel demo URL
9. Extract widget key from embed code

SELECTORS: all selectors in SEL are best-guess CSS.
Run the Claude Desktop Learn Session to confirm exact selectors.
See LEARN_SESSION_PROMPT at bottom of this file.
"""

import os, re, asyncio
from playwright.async_api import async_playwright, Page, Browser
from dotenv import load_dotenv

load_dotenv()

def _ensure_https(url: str) -> str:
    """Guarantee URL has a protocol prefix."""
    if not url:
        return url
    return url if url.startswith("http") else f"https://{url}"

THINKER_URL   = _ensure_https(os.getenv("THINKER_URL", ""))
THINKER_EMAIL = os.getenv("THINKER_EMAIL", "")
THINKER_PASS  = os.getenv("THINKER_PASSWORD", "")

PREFERRED_VOICES = ["Marissa", "Susan"]

SEL = {
    # Login
    "login_email":        'input[type="email"], input[name="email"]',
    "login_password":     'input[type="password"], input[name="password"]',
    "login_submit":       'button[type="submit"]',

    # Dashboard
    "add_agent_btn":      'button:has-text("Add Agent"), [data-action="add-agent"], button:has-text("New Agent"), button:has-text("Create Agent")',

    # Agent type (web-only — no phone)
    "web_phone_option":   'text="Web and Phone", [data-type="web-phone"], button:has-text("Web and Phone"), text="Web Agent", button:has-text("Web Agent")',

    # Setup form
    "agent_name_input":   'input[placeholder*="agent name" i], input[name*="name" i], input[placeholder*="name" i]',
    "agent_role_input":   'input[placeholder*="role" i], textarea[placeholder*="role" i]',
    "website_url_input":  'input[placeholder*="website" i], input[placeholder*="url" i], input[type="url"]',

    # Voice selection
    "voice_dropdown":     'select[name*="voice" i], [data-testid="voice-select"], button:has-text("Select Voice")',
    "voice_option":       'option:has-text("Marissa"), [data-voice="marissa"], li:has-text("Marissa"), option:has-text("Susan"), li:has-text("Susan")',

    # Identity / AI co-pilot
    "identity_name":      'input[placeholder*="representative" i], input[placeholder*="agent name" i], input[name*="identity" i]',
    "identity_title":     'input[placeholder*="title" i], input[name*="title" i]',
    "identity_company":   'input[placeholder*="company" i], input[name*="company" i]',
    "copilot_btn":        'button:has-text("AI Co-pilot"), button:has-text("Fill"), [data-action="copilot"]',

    # Agent training / web agent
    "agent_training_tab": 'text="Agent Training", [data-tab="training"], a:has-text("Training")',
    "web_agent_tab":      'text="Web Agent", [data-tab="web-agent"], button:has-text("Web Agent")',
    "web_agent_url":      'input[placeholder*="website" i], input[placeholder*="domain" i]',
    "save_btn":           'button:has-text("Save"), button[type="submit"]:has-text("Save")',
    "select_agent_btn":   'button:has-text("Select Agent"), button:has-text("Select"), [data-action="select"]',

    # Widget embed code
    "embed_code_area":    'textarea[class*="embed" i], [data-testid="embed-code"], pre:has-text("data-widget-key"), code:has-text("data-widget-key")',
    "copy_embed_btn":     'button:has-text("Copy"), button:has-text("Copy Code"), [data-action="copy"]',
}


async def login_to_thinker(page: Page) -> bool:
    """Login to the Thinker platform. Returns True if successful."""
    try:
        await page.goto(THINKER_URL, wait_until="networkidle", timeout=15000)

        if any(x in page.url for x in ["dashboard", "agents", "home", "app"]):
            print("[THINKER] Already logged in")
            return True

        await page.fill(SEL["login_email"], THINKER_EMAIL)
        await page.fill(SEL["login_password"], THINKER_PASS)
        await page.click(SEL["login_submit"])
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)

        if any(x in page.url for x in ["login", "signin", "auth"]):
            print("[THINKER] Login may have failed — check credentials")
            return False

        print("[THINKER] Login successful")
        return True

    except Exception as e:
        print(f"[THINKER] Login error: {e}")
        return False


async def select_best_voice(page: Page) -> str:
    """Select Marissa, fall back to Susan."""
    for voice_name in PREFERRED_VOICES:
        try:
            option = page.locator(f'option:has-text("{voice_name}")')
            if await option.count() > 0:
                await option.select_option(label=voice_name)
                print(f"[THINKER] Voice selected: {voice_name}")
                return voice_name

            item = page.locator(f'li:has-text("{voice_name}"), [data-voice="{voice_name.lower()}"]')
            if await item.count() > 0:
                await item.click()
                print(f"[THINKER] Voice selected: {voice_name}")
                return voice_name
        except Exception:
            continue

    print("[THINKER] Could not select preferred voice — using default")
    return "default"


async def get_widget_key(page: Page) -> str | None:
    """Extract data-widget-key from the embed code area."""
    try:
        for loc in [
            page.locator('textarea:has-text("data-widget-key")'),
            page.locator('pre:has-text("data-widget-key")'),
            page.locator('code:has-text("data-widget-key")'),
            page.locator('[class*="embed"]:has-text("data-widget-key")'),
        ]:
            if await loc.count() > 0:
                text = await loc.text_content() or ""
                m = re.search(r'data-widget-key=["\']([^"\']+)["\']', text)
                if m:
                    return m.group(1)

        copy_btn = page.locator(SEL["copy_embed_btn"])
        if await copy_btn.count() > 0:
            await copy_btn.click()
            await page.wait_for_timeout(500)
            clipboard_text = await page.evaluate("navigator.clipboard.readText()")
            if clipboard_text:
                m = re.search(r'data-widget-key=["\']([^"\']+)["\']', clipboard_text)
                if m:
                    return m.group(1)

    except Exception as e:
        print(f"[THINKER] Widget key extraction error: {e}")

    return None


async def create_thinker_agent(
    company_name: str,
    website_url: str,
    deployed_demo_url: str = "",
    headless: bool = True,
) -> str | None:
    """
    Full Thinker web-agent-only creation flow.
    Returns the widget_key string, or None if failed.
    No phone number needed for web agents.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless, args=["--no-sandbox"])
        ctx = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            permissions=["clipboard-read", "clipboard-write"],
        )
        page = await ctx.new_page()

        try:
            if not await login_to_thinker(page):
                await browser.close()
                return None

            print("[THINKER] Looking for Add Agent button...")
            add_btn = page.locator(SEL["add_agent_btn"])
            await add_btn.wait_for(timeout=10000)
            await add_btn.first.click()
            await page.wait_for_timeout(1500)

            print("[THINKER] Selecting agent type...")
            web_opt = page.locator(SEL["web_phone_option"])
            if await web_opt.count() > 0:
                await web_opt.first.click()
                await page.wait_for_timeout(1000)

            print(f"[THINKER] Setting agent name: {company_name}")
            name_input = page.locator(SEL["agent_name_input"])
            if await name_input.count() > 0:
                await name_input.first.fill(company_name)
                await page.wait_for_timeout(300)

            if website_url:
                print(f"[THINKER] Training URL: {website_url}")
                url_input = page.locator(SEL["website_url_input"])
                if await url_input.count() > 0:
                    await url_input.first.fill(website_url)
                    await page.wait_for_timeout(300)

            await select_best_voice(page)

            select_btn = page.locator(SEL["select_agent_btn"])
            if await select_btn.count() > 0:
                await select_btn.first.click()
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(2000)

            # AI copilot or manual identity fill
            copilot_btn = page.locator(SEL["copilot_btn"])
            if await copilot_btn.count() > 0:
                await copilot_btn.first.click()
                await page.wait_for_timeout(2000)

            for sel, val in {
                SEL["identity_name"]:    f"Ava — {company_name} Receptionist",
                SEL["identity_title"]:   "AI Receptionist",
                SEL["identity_company"]: company_name,
            }.items():
                try:
                    f = page.locator(sel)
                    if await f.count() > 0 and await f.first.is_visible():
                        await f.first.fill(val)
                        await page.wait_for_timeout(200)
                except Exception:
                    pass

            print("[THINKER] Navigating to Agent Training → Web Agent...")
            training_tab = page.locator(SEL["agent_training_tab"])
            if await training_tab.count() > 0:
                await training_tab.first.click()
                await page.wait_for_timeout(1000)

            web_agent_tab = page.locator(SEL["web_agent_tab"])
            if await web_agent_tab.count() > 0:
                await web_agent_tab.first.click()
                await page.wait_for_timeout(1000)

            url_to_use = deployed_demo_url or website_url
            if url_to_use:
                print(f"[THINKER] Web Agent URL: {url_to_use}")
                wa_url = page.locator(SEL["web_agent_url"])
                if await wa_url.count() > 0:
                    await wa_url.first.fill(url_to_use)
                    await page.wait_for_timeout(300)

            save_btn = page.locator(SEL["save_btn"])
            if await save_btn.count() > 0:
                await save_btn.first.click()
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(2000)

            print("[THINKER] Extracting widget key...")
            widget_key = await get_widget_key(page)

            if widget_key:
                print(f"[THINKER] ✓ Widget key: {widget_key[:20]}...")
                await browser.close()
                return widget_key
            else:
                slug = company_name[:15].replace(" ", "-")
                await page.screenshot(path=f"/tmp/thinker_debug_{slug}.png")
                print("[THINKER] Could not extract widget key — screenshot saved")

        except Exception as e:
            print(f"[THINKER] Error: {e}")
            try:
                await page.screenshot(path="/tmp/thinker_error.png")
            except Exception:
                pass

        await browser.close()
        return None


LEARN_SESSION_PROMPT = """
Watch me create a Voice AI agent on my Thinker platform.
Record every selector, button text, URL, and wait time.

After I complete the flow, update the SEL dictionary in voice_ai_automation.py.

Flow:
1. Log into: {THINKER_URL}
2. Click "Add Agent"
3. Select agent type (Web and Phone OR Web Agent)
4. Agent name, website URL for training
5. Select voice — Marissa or Susan
6. Click "Select Agent"
7. AI co-pilot OR manual: representative name, title, company
8. Agent Training → Web Agent tab → enter URL
9. Save → find embed code with data-widget-key
10. Copy widget key

For each step: exact CSS selector or visible text, wait time (ms), conditions to check.
"""


async def test_single_agent():
    """Test creating one agent — run this to verify selectors work."""
    print("=== THINKER TEST RUN ===")
    print(f"Platform: {THINKER_URL}")
    print(f"Email: {THINKER_EMAIL}")

    if not THINKER_URL:
        print("ERROR: THINKER_URL not set in .env")
        return

    key = await create_thinker_agent(
        company_name="Test Roofing Co",
        website_url="https://google.com",
        headless=False,
    )

    if key:
        print(f"✅ Success! Widget key: {key}")
    else:
        print("❌ Failed — check /tmp/thinker_debug*.png for screenshots")
        print("Next: Run Claude Desktop Learn Session to capture exact selectors")


if __name__ == "__main__":
    asyncio.run(test_single_agent())
