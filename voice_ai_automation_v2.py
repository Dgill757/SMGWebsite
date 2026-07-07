"""
THINKER VOICE AI AUTOMATION
============================
Playwright automation based on the exact steps Dan described:

1. Go to Thinker website
2. Click "Add Agent"  
3. Click "Web and Phone"
4. Fill agent role / agent name
5. Train from website URL
6. Associate phone number
7. Select voice (Marissa or Susan)
8. Click "Select Agent"
9. AI co-pilot fills identity fields
10. Agent Training → Web Agent → enter Vercel URL
11. Get code snippet → inject into homepage

SELECTORS NOTE: All selectors marked # LEARN are placeholders.
Run the Claude Desktop Learn Session to populate them.
The function will work immediately once selectors are confirmed.
"""

import os, re, asyncio
from playwright.async_api import async_playwright, Page, Browser
from dotenv import load_dotenv

load_dotenv()

THINKER_URL   = os.getenv("THINKER_URL", "")
THINKER_EMAIL = os.getenv("THINKER_EMAIL", "")
THINKER_PASS  = os.getenv("THINKER_PASSWORD", "")

# ── VOICES Dan uses ───────────────────────────────────────────────────────────
PREFERRED_VOICES = ["Marissa", "Susan"]

# ── SELECTORS MAP ─────────────────────────────────────────────────────────────
# These are populated by the Claude Desktop Learn Session.
# Run: see LEARN_SESSION_PROMPT below for exact instructions.
# Until then, they work as best-guess CSS selectors.

SEL = {
    # Login page
    "login_email":        'input[type="email"], input[name="email"]',
    "login_password":     'input[type="password"], input[name="password"]',
    "login_submit":       'button[type="submit"]',

    # Dashboard — Add Agent button
    "add_agent_btn":      'button:has-text("Add Agent"), [data-action="add-agent"], button:has-text("New Agent"), button:has-text("Create Agent")',

    # Agent type selection
    "web_phone_option":   'text="Web and Phone", [data-type="web-phone"], button:has-text("Web and Phone")',

    # Agent setup form
    "agent_name_input":   'input[placeholder*="agent name" i], input[name*="name" i], input[placeholder*="name" i]',
    "agent_role_input":   'input[placeholder*="role" i], textarea[placeholder*="role" i]',
    "website_url_input":  'input[placeholder*="website" i], input[placeholder*="url" i], input[type="url"]',
    "phone_select":       'select[name*="phone" i], [data-testid="phone-select"]',

    # Voice selection
    "voice_dropdown":     'select[name*="voice" i], [data-testid="voice-select"], button:has-text("Select Voice")',
    "voice_option":       (
        'option:has-text("Marissa"), [data-voice="marissa"], '
        'li:has-text("Marissa"), option:has-text("Susan"), li:has-text("Susan")'
    ),

    # AI copilot / identity fields
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

    # Widget code
    "embed_code_area":    'textarea[class*="embed" i], [data-testid="embed-code"], pre:has-text("data-widget-key"), code:has-text("data-widget-key")',
    "copy_embed_btn":     'button:has-text("Copy"), button:has-text("Copy Code"), [data-action="copy"]',
}


async def login_to_thinker(page: Page) -> bool:
    """Login to the Thinker platform. Returns True if successful."""
    try:
        await page.goto(THINKER_URL, wait_until="networkidle", timeout=15000)
        
        # Check if already logged in
        if any(x in page.url for x in ["dashboard", "agents", "home", "app"]):
            print("[THINKER] Already logged in")
            return True

        # Fill login form
        await page.fill(SEL["login_email"], THINKER_EMAIL)
        await page.fill(SEL["login_password"], THINKER_PASS)
        await page.click(SEL["login_submit"])
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(2000)

        # Verify we're past login
        if any(x in page.url for x in ["login", "signin", "auth"]):
            print("[THINKER] Login may have failed — check credentials")
            return False

        print("[THINKER] Login successful")
        return True

    except Exception as e:
        print(f"[THINKER] Login error: {e}")
        return False


async def select_best_voice(page: Page) -> str:
    """Try to select Marissa, fall back to Susan, return selected voice name."""
    for voice_name in PREFERRED_VOICES:
        try:
            # Try option element
            option = page.locator(f'option:has-text("{voice_name}")')
            if await option.count() > 0:
                await option.select_option(label=voice_name)
                print(f"[THINKER] Voice selected: {voice_name}")
                return voice_name
            
            # Try clickable list item
            item = page.locator(f'li:has-text("{voice_name}"), [data-voice="{voice_name.lower()}"]')
            if await item.count() > 0:
                await item.click()
                print(f"[THINKER] Voice selected: {voice_name}")
                return voice_name

        except Exception:
            continue
    
    print(f"[THINKER] Could not select preferred voice — using default")
    return "default"


async def get_widget_key(page: Page) -> str | None:
    """Extract the widget key from the embed code on the page."""
    try:
        # Try to find embed code area
        embed_locators = [
            page.locator('textarea:has-text("data-widget-key")'),
            page.locator('pre:has-text("data-widget-key")'),
            page.locator('code:has-text("data-widget-key")'),
            page.locator('[class*="embed"]:has-text("data-widget-key")'),
        ]

        for loc in embed_locators:
            if await loc.count() > 0:
                embed_text = await loc.text_content() or ""
                match = re.search(r'data-widget-key=["\']([^"\']+)["\']', embed_text)
                if match:
                    return match.group(1)

        # Try copy button then read clipboard
        copy_btn = page.locator(SEL["copy_embed_btn"])
        if await copy_btn.count() > 0:
            await copy_btn.click()
            await page.wait_for_timeout(500)
            # Try to read from clipboard via JS
            clipboard_text = await page.evaluate("navigator.clipboard.readText()")
            if clipboard_text:
                match = re.search(r'data-widget-key=["\']([^"\']+)["\']', clipboard_text)
                if match:
                    return match.group(1)

    except Exception as e:
        print(f"[THINKER] Widget key extraction error: {e}")

    return None


async def create_thinker_agent(
    company_name: str,
    website_url: str,
    city: str = "",
    phone: str = "",
    owner_name: str = "the team",
    deployed_demo_url: str = "",
    headless: bool = True
) -> str | None:
    """
    Full Thinker agent creation flow.
    Returns the widget_key string, or None if failed.

    Based on Dan's exact steps:
    1. Add Agent → Web and Phone
    2. Agent name = company name
    3. Train from website URL
    4. Phone association
    5. Select voice (Marissa or Susan)
    6. AI copilot fills identity
    7. Agent Training → Web Agent URL = deployed demo URL
    8. Extract and return widget key
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless, args=["--no-sandbox"])
        ctx = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            permissions=["clipboard-read", "clipboard-write"],
        )
        page = await ctx.new_page()

        try:
            # STEP 1: Login
            if not await login_to_thinker(page):
                await browser.close()
                return None

            # STEP 2: Click "Add Agent"
            print("[THINKER] Looking for Add Agent button...")
            add_btn = page.locator(SEL["add_agent_btn"])
            await add_btn.wait_for(timeout=10000)
            await add_btn.first.click()
            await page.wait_for_timeout(1500)

            # STEP 3: Click "Web and Phone"
            print("[THINKER] Selecting Web and Phone agent type...")
            web_phone = page.locator(SEL["web_phone_option"])
            if await web_phone.count() > 0:
                await web_phone.first.click()
                await page.wait_for_timeout(1000)

            # STEP 4: Agent name
            print(f"[THINKER] Setting agent name: {company_name}")
            name_input = page.locator(SEL["agent_name_input"])
            if await name_input.count() > 0:
                await name_input.first.fill(company_name)
                await page.wait_for_timeout(300)

            # STEP 5: Website URL for training
            if website_url:
                print(f"[THINKER] Adding website URL: {website_url}")
                url_input = page.locator(SEL["website_url_input"])
                if await url_input.count() > 0:
                    await url_input.first.fill(website_url)
                    await page.wait_for_timeout(300)

            # STEP 6: Select voice
            await select_best_voice(page)

            # STEP 7: Click "Select Agent" or continue
            select_btn = page.locator(SEL["select_agent_btn"])
            if await select_btn.count() > 0:
                await select_btn.first.click()
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(2000)

            # STEP 8: AI Copilot fills identity
            # Try clicking copilot button first
            copilot_btn = page.locator(SEL["copilot_btn"])
            if await copilot_btn.count() > 0:
                await copilot_btn.first.click()
                await page.wait_for_timeout(2000)

            # Fill identity fields directly as backup
            identity_fields = {
                SEL["identity_name"]: f"Ava — {company_name} Receptionist",
                SEL["identity_title"]: "AI Receptionist",
                SEL["identity_company"]: company_name,
            }
            for selector, value in identity_fields.items():
                try:
                    field = page.locator(selector)
                    if await field.count() > 0 and await field.first.is_visible():
                        await field.first.fill(value)
                        await page.wait_for_timeout(200)
                except Exception:
                    pass

            # STEP 9: Agent Training → Web Agent
            print("[THINKER] Navigating to Agent Training...")
            training_tab = page.locator(SEL["agent_training_tab"])
            if await training_tab.count() > 0:
                await training_tab.first.click()
                await page.wait_for_timeout(1000)

            web_agent_tab = page.locator(SEL["web_agent_tab"])
            if await web_agent_tab.count() > 0:
                await web_agent_tab.first.click()
                await page.wait_for_timeout(1000)

            # STEP 10: Enter Vercel demo URL as web agent URL
            demo_url_to_use = deployed_demo_url or website_url
            if demo_url_to_use:
                print(f"[THINKER] Setting web agent URL: {demo_url_to_use}")
                wa_url = page.locator(SEL["web_agent_url"])
                if await wa_url.count() > 0:
                    await wa_url.first.fill(demo_url_to_use)
                    await page.wait_for_timeout(300)

            # Save
            save_btn = page.locator(SEL["save_btn"])
            if await save_btn.count() > 0:
                await save_btn.first.click()
                await page.wait_for_load_state("networkidle")
                await page.wait_for_timeout(2000)

            # STEP 11: Extract widget key
            print("[THINKER] Extracting widget key...")
            widget_key = await get_widget_key(page)

            if widget_key:
                print(f"[THINKER] ✓ Widget key: {widget_key[:20]}...")
                await browser.close()
                return widget_key
            else:
                # Take screenshot to help debug
                await page.screenshot(path=f"/tmp/thinker_debug_{company_name[:15].replace(' ','-')}.png")
                print(f"[THINKER] Could not extract widget key — screenshot saved for debugging")

        except Exception as e:
            print(f"[THINKER] Error: {e}")
            try:
                await page.screenshot(path="/tmp/thinker_error.png")
            except Exception:
                pass

        await browser.close()
        return None


# ══════════════════════════════════════════════════════════════════════════════
# CLAUDE DESKTOP LEARN SESSION PROMPT
# ══════════════════════════════════════════════════════════════════════════════
#
# Paste this into Claude Desktop (with computer use enabled).
# Then go through the Thinker flow manually while Claude watches.
# Claude will write the exact selectors and timing for every step.

LEARN_SESSION_PROMPT = """
I need you to watch me create a Voice AI agent in my Thinker platform.
Learn every selector, button, URL, wait time, and input field.

After I finish the complete flow, update the SEL dictionary in voice_ai_automation.py
with the exact selectors for every element I interact with.

The flow I'm about to do:
1. Log into: {THINKER_URL}
2. Click "Add Agent"
3. Select "Web and Phone" agent type
4. Fill in: agent name, website URL for training
5. Select voice — Marissa or Susan (whichever I pick)
6. Click "Select Agent"
7. Use AI co-pilot OR manually fill: representative name, title, company name
8. Navigate to Agent Training
9. Click "Web Agent" tab
10. Enter a website URL
11. Save
12. Find the embed code with data-widget-key
13. Copy the widget key

For each step, give me:
- The exact CSS selector OR text content I can use with Playwright
- The wait time after the action (in milliseconds)
- Any conditions to check before proceeding

After observing, give me the complete updated SEL dictionary.
Then test it by running: python voice_ai_automation.py
It should create a test agent and return the widget key.

Starting the flow now — watch carefully.
"""


# ── Quick test ────────────────────────────────────────────────────────────────
async def test_single_agent():
    """Test creating one agent. Run this to verify selectors work."""
    print("=== THINKER TEST RUN ===")
    print(f"Platform: {THINKER_URL}")
    print(f"Email: {THINKER_EMAIL}")

    if not THINKER_URL:
        print("ERROR: THINKER_URL not set in .env")
        return

    key = await create_thinker_agent(
        company_name="Test Roofing Co",
        website_url="https://google.com",
        city="Dallas",
        phone="555-1234",
        headless=False,   # Show browser so you can see what's happening
    )

    if key:
        print(f"✅ Success! Widget key: {key}")
    else:
        print("❌ Failed — check /tmp/thinker_debug*.png for screenshots")
        print("Next step: Run Claude Desktop Learn Session to capture exact selectors")


if __name__ == "__main__":
    asyncio.run(test_single_agent())
