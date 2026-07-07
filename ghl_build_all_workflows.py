"""
SVA GHL Workflow Batch Builder
===============================
Runs all 13 remaining workflows (SVA Reply Router was already built).
Uses Playwright to interact with GHL's AI Builder for each one.

Run:
    python ghl_build_all_workflows.py

The script opens a visible browser (headless=False) so you can watch.
Each workflow is built via the AI Builder, renamed, and published.
Estimated run time: 15-20 minutes.
"""

import asyncio, os, re
from playwright.async_api import async_playwright, Page
from dotenv import load_dotenv

load_dotenv()

GHL_URL   = "https://app.gohighlevel.com"
LOC_ID    = os.getenv("GHL_LOCATION_ID", "u1lprxdJy1vmuaHEVJRM")
AVA_API   = os.getenv("AVA_API_URL", "https://ava-studio-api-production.up.railway.app")
CALENDLY  = os.getenv("CALENDLY_URL", "https://calendly.com/aivoice/call")

WORKFLOWS = [
    {
        "name": "SVA Main Outreach — Segment A",
        "prompt": (
            "Create a workflow called 'SVA Main Outreach — Segment A'. "
            "Trigger: Tag Added = 'Claude Outreach Sent'. No re-entry. "
            "Filter: Contact has email. "
            "Step 1: Wait 1 hour. "
            "Step 2: Send email with subject 'missed calls' about missing calls costing the business money. "
            "Step 3: Wait 3 days. If no 'replied positive' tag: Send SMS about missed calls. "
            "Step 4: Wait 4 days. If no 'replied positive' tag: Send email. "
            "Step 5: Wait 7 days. If no reply: Send SMS breakup. Add tag 'sequence_complete'. "
            "Publish workflow."
        ),
    },
    {
        "name": "SVA Positive Reply Handler",
        "prompt": (
            "Create a workflow called 'SVA Positive Reply Handler'. "
            "Trigger: Tag Added = 'replied positive'. No re-entry. "
            "Filter: Tag 'meeting booked' NOT present. "
            f"Step 1: Send email with calendar link {CALENDLY}. "
            "Step 2: Wait 30 min. Send SMS with calendar link. "
            "Step 3: Wait 24 hrs. If no 'meeting booked' tag: Send SMS nudge. "
            "Step 4: Wait 48 hrs. If no 'meeting booked' tag: Send email. "
            "Publish workflow."
        ),
    },
    {
        "name": "SVA Marketing Audit + Demo Delivery",
        "prompt": (
            "Create a workflow called 'SVA Marketing Audit + Demo Delivery'. "
            "Trigger: Tag Added = 'audit requested'. No re-entry. "
            "Filter: Tag 'demo delivered' NOT present. "
            "Step 1: Add tag 'demo in progress'. "
            "Step 2: Internal notification to team. "
            f"Step 3: Outbound webhook POST to {AVA_API}/dispatch with contact data JSON. "
            "Step 4: Wait 12 minutes. "
            "Step 5: If custom field 'demo_url' is not empty: Send email 'built you a custom demo'. "
            "Step 6: Wait 30 min. Send SMS with demo URL. "
            "Step 7: Add tag 'demo delivered'. Remove tags 'demo in progress' and 'audit requested'. "
            "Step 8: Move opportunity to 'Demo Sent' stage. "
            "Publish workflow."
        ),
    },
    {
        "name": "SVA Demo Follow-Up (48hr)",
        "prompt": (
            "Create a workflow called 'SVA Demo Follow-Up (48hr)'. "
            "Trigger: Tag Added = 'demo delivered'. No re-entry. "
            "Filter: No 'meeting booked' tag. "
            "Wait 48hrs. If 'meeting booked' present: Stop. "
            "Send AI-written follow-up SMS about the demo. "
            "Wait 3 days. If 'meeting booked' present: Stop. Send email about the demo. "
            "Wait 3 days. If 'meeting booked' present: Stop. Send SMS about demo coming down. "
            "Add tag 'demo sequence complete'. Publish."
        ),
    },
    {
        "name": "SVA Lead Enrichment Agent",
        "prompt": (
            "Create a workflow called 'SVA Lead Enrichment Agent'. "
            "Trigger: Contact Created. No re-entry. "
            "Wait 5 min. "
            "Use AI to research the company and update contact custom fields. "
            "Create opportunity in SVA Cold Outreach Pipeline at 'Contacted' stage. "
            "Publish workflow."
        ),
    },
    {
        "name": "SVA Pre-Meeting Brief",
        "prompt": (
            "Create a workflow called 'SVA Pre-Meeting Brief'. "
            "Trigger: Appointment Status = Confirmed. Allow re-entry: Yes. "
            "AI generate pre-meeting brief about the prospect. "
            "Send brief via internal notification email. "
            "Send SMS that brief is ready. Publish workflow."
        ),
    },
    {
        "name": "SVA Post-Call Follow-Up",
        "prompt": (
            "Create a workflow called 'SVA Post-Call Follow-Up'. "
            "Trigger: Appointment Status = Showed. Re-entry: Yes. "
            "Wait 30 min. AI write casual follow-up email. "
            "Send AI-generated email. Wait 24 hrs. "
            "If opportunity NOT Won: Send SMS follow-up. "
            "Move opportunity to 'Meeting Held' stage. Publish."
        ),
    },
    {
        "name": "SVA No-Show Recovery",
        "prompt": (
            "Create a workflow called 'SVA No-Show Recovery'. "
            "Trigger: Appointment Status = No Show. Re-entry: Yes. "
            f"Wait 10 min. Send SMS to reschedule with {CALENDLY}. "
            "Wait 24 hrs. If no new meeting: Send email 'missed you today'. "
            "Wait 3 days. If still no reschedule: Add tag 'no show recovery'. Publish."
        ),
    },
    {
        "name": "SVA Stale Deal Nudge",
        "prompt": (
            "Create a workflow called 'SVA Stale Deal Nudge'. "
            "Trigger: Opportunity Stage Changed. Re-entry: Yes. "
            "Wait 7 days. If opportunity has NOT changed stage AND not Won or Lost: "
            "AI write nudge email. Send it. Internal notification. Publish."
        ),
    },
    {
        "name": "SVA Won Client Onboarding",
        "prompt": (
            "Create a workflow called 'SVA Won Client Onboarding'. "
            "Trigger: Opportunity Stage Changed = Won. No re-entry. "
            "Add tag 'active client'. Move to SVA Clients pipeline 'Onboarding' stage. "
            "Send welcome email with next steps. "
            "Send internal notification about new client. "
            "Create task to set up Ava system within 48 hours. Publish."
        ),
    },
    {
        "name": "SVA 90-Day Reactivation",
        "prompt": (
            "Create a workflow called 'SVA 90-Day Reactivation'. "
            "Trigger: Tag Added = 'reactivate'. Re-entry: Yes every 90 days. "
            "Filter: NOT 'active client' AND NOT 'do not contact'. "
            "AI write re-engagement SMS. Send it. "
            "Wait 48 hrs. If no reply: AI write re-engagement email. Send it. "
            "Wait 3 days. If no reply: Add 'sequence complete', remove 'reactivate'. Publish."
        ),
    },
    {
        "name": "SVA Dispatch Trigger (SMS Command)",
        "prompt": (
            "Create a workflow called 'SVA Dispatch Trigger (SMS Command)'. "
            "Trigger: Inbound SMS received. Re-entry: Yes. "
            "Filter: Message sender is a specific phone number. "
            f"Step: Outbound webhook POST to {AVA_API}/dispatch with SMS content as JSON. "
            "Send SMS confirmation. Publish."
        ),
    },
    {
        "name": "SVA Content Autopilot",
        "prompt": (
            "Create a workflow called 'SVA Content Autopilot'. "
            "Trigger: Recurring every Monday at 7:00 AM. Re-entry: Yes. "
            "AI generate weekly content calendar for social media platforms. "
            "Send full content calendar via email. "
            "Send SMS that content calendar is ready. Publish."
        ),
    },
]


async def wait_for_ai_build(frame, timeout_secs: int = 90):
    """Wait for GHL AI to finish building (Working... disappears)."""
    for _ in range(timeout_secs // 2):
        await asyncio.sleep(2)
        working = await frame.locator("text=Working").count()
        if working == 0:
            return True
    return False


async def answer_clarifying_questions(frame, page):
    """Auto-answer any clarifying questions by picking the first option."""
    for _ in range(5):
        await asyncio.sleep(1)
        questions = await frame.locator(".radio-group, [role='radiogroup'], .clarification").count()
        if questions == 0:
            break
        options = await frame.locator("label input[type='radio'], li[role='option']").all()
        if options:
            await options[0].click()
            await asyncio.sleep(500 / 1000)
        # Look for Next / Continue / Submit button
        for btn_text in ("Next", "Continue", "Submit", "Skip"):
            btn = frame.locator(f"button:has-text('{btn_text}')")
            if await btn.count() > 0:
                await btn.first.click()
                await asyncio.sleep(1)
                break


async def rename_workflow(frame, page, new_name: str):
    """Click pencil icon and rename the workflow."""
    await page.mouse.click(750, 20)
    await asyncio.sleep(0.8)
    inp = frame.locator("#cmp-header__txt--edit-workflow-name-parent input")
    if await inp.count() > 0:
        await inp.first.clear()
        await inp.first.fill(new_name)
        await page.keyboard.press("Enter")
        await asyncio.sleep(0.5)
        print(f"  ✓ Renamed to: {new_name}")


async def publish_workflow(frame):
    """Toggle the publish switch."""
    toggle = frame.locator(".hl-toggle, [role='switch']").first()
    if await toggle.count() > 0:
        await toggle.click()
        await asyncio.sleep(1)
        print("  ✓ Published")


async def build_workflow(page, wf: dict) -> bool:
    """Build one workflow via the GHL AI Builder."""
    frame = page.frame_locator("iframe").first

    print(f"\n[BUILD] {wf['name']}")

    # Click Create Workflow → Build Using AI (or use the top "Build using AI" btn)
    await frame.locator("button").filter(has_text="Create Workflow").first.click()
    await asyncio.sleep(1)
    await frame.get_by_text("Build Using AI").click()
    await asyncio.sleep(2)

    # New workflow page loaded — click "Build using AI" button inside the canvas
    build_btn = frame.locator("button:has-text('Build using AI'), button:has-text('Build Using AI')")
    if await build_btn.count() > 0:
        await build_btn.first.click()
        await asyncio.sleep(1)

    # Type the workflow prompt into the AI chat input
    chat_input = frame.locator("textarea, input[placeholder*='automate'], input[placeholder*='workflow']").first
    await chat_input.fill(wf["prompt"])
    await asyncio.sleep(0.3)

    # Submit (Enter or send button)
    send_btn = frame.locator("button[type='submit'], button:has-text('Send'), button svg[data-icon='paper-plane']").first
    if await send_btn.count() > 0:
        await send_btn.click()
    else:
        await page.keyboard.press("Enter")

    await asyncio.sleep(2)

    # Answer any clarifying questions, then wait for build
    await answer_clarifying_questions(frame, page)
    done = await wait_for_ai_build(frame, timeout_secs=90)
    if not done:
        print(f"  ! Timed out waiting for AI build")

    await asyncio.sleep(1)

    # Rename + publish
    current_url = page.url
    if "/workflow/" in current_url:
        await rename_workflow(frame, page, wf["name"])
        await publish_workflow(frame)
        return True

    print(f"  ! Did not navigate to workflow editor — skipping rename/publish")
    return False


async def configure_ghl_webhook(page):
    """Navigate to GHL settings and configure the Ava Studio webhook."""
    print("\n[WEBHOOK] Configuring GHL Webhook...")
    await page.goto(
        f"https://app.gohighlevel.com/location/{LOC_ID}/settings/webhooks",
        wait_until="domcontentloaded",
    )
    await asyncio.sleep(3)

    frame = page.frame_locator("iframe").first

    # Look for "Add New Webhook" or "Create Webhook" button
    for btn_text in ("Add New Webhook", "Create Webhook", "Add Webhook", "New Webhook"):
        btn = frame.locator(f"button:has-text('{btn_text}')")
        if await btn.count() > 0:
            await btn.first.click()
            await asyncio.sleep(1.5)
            break

    # Fill webhook name
    name_input = frame.locator("input[placeholder*='name' i], input[name*='name' i]").first
    if await name_input.count() > 0:
        await name_input.fill("Ava Studio Real-Time Sync")
        await asyncio.sleep(0.3)

    # Fill webhook URL
    url_input = frame.locator("input[placeholder*='url' i], input[type='url'], input[name*='url' i]").first
    if await url_input.count() > 0:
        await url_input.fill(f"{AVA_API}/webhooks/ghl")
        await asyncio.sleep(0.3)

    # Try to check required events
    for event_label in ("Contact Tag Added", "Inbound Message", "Appointment Booked",
                        "Opportunity Stage Changed", "Contact Created", "ContactTagAdded",
                        "InboundMessage", "AppointmentBooked"):
        cb = frame.locator(f"label:has-text('{event_label}') input[type='checkbox'], input[value*='{event_label}']")
        if await cb.count() > 0:
            try:
                await cb.first.check()
            except Exception:
                pass

    # Save
    for save_text in ("Save", "Create", "Add"):
        save = frame.locator(f"button:has-text('{save_text}')").last
        if await save.count() > 0:
            await save.click()
            await asyncio.sleep(1.5)
            print("  ✓ Webhook configured")
            return True

    print("  ! Could not save webhook — check manually")
    return False


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=False, args=["--no-sandbox"])
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900},
                                        permissions=["clipboard-read", "clipboard-write"])
        page = await ctx.new_page()

        # Navigate to GHL workflows
        print("[INIT] Navigating to GHL...")
        await page.goto(
            f"https://app.gohighlevel.com/v2/location/{LOC_ID}/automation/workflows?listTab=all",
            wait_until="domcontentloaded",
        )
        await asyncio.sleep(4)

        # Check if logged in
        if "login" in page.url.lower() or "signin" in page.url.lower():
            print("[AUTH] Please log in manually in the browser window, then press Enter here...")
            input()
            await asyncio.sleep(2)

        built = []
        failed = []

        for wf in WORKFLOWS:
            try:
                ok = await build_workflow(page, wf)
                if ok:
                    built.append(wf["name"])
                else:
                    failed.append(wf["name"])
                # Go back to workflow list
                await page.goto(
                    f"https://app.gohighlevel.com/v2/location/{LOC_ID}/automation/workflows?listTab=all",
                    wait_until="domcontentloaded",
                )
                await asyncio.sleep(2)
            except Exception as e:
                print(f"  ! Error building {wf['name']}: {e}")
                failed.append(wf["name"])
                await page.goto(
                    f"https://app.gohighlevel.com/v2/location/{LOC_ID}/automation/workflows?listTab=all",
                    wait_until="domcontentloaded",
                )
                await asyncio.sleep(2)

        # Configure webhook
        try:
            await configure_ghl_webhook(page)
        except Exception as e:
            print(f"  ! Webhook error: {e}")

        print("\n" + "=" * 60)
        print("BATCH BUILD COMPLETE")
        print("=" * 60)
        print(f"Built ({len(built)}): {', '.join(built)}")
        print(f"Failed ({len(failed)}): {', '.join(failed) if failed else 'None'}")
        print("\nBrowser stays open for 30s so you can review...")
        await asyncio.sleep(30)
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
