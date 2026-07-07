"""
NO-WEBSITE DEMO BUILDER
=======================
Add this function to ava_demo_studio_COMPLETE_API.py

When a Segment B (no website) contact triggers the build,
there's no URL to scrape. This function builds a professional
roofing homepage from just their company name + city + GHL data.

Deployed to: summit-demo-[slug].vercel.app
"""

async def build_homepage_no_website(company_name: str, city: str, state: str,
                                     phone: str = "", owner_name: str = "",
                                     google_reviews: int = 0) -> dict:
    """
    Generates a complete roofing homepage with NO website to scrape from.
    Uses Claude to generate realistic content from company name + location.
    Returns: {html, brand, audit_text}
    """
    # Step 1: Generate brand identity from company name + location
    brand_prompt = f"""You are building a website for a roofing company.
Company name: {company_name}
City: {city}, {state}
Owner: {owner_name or 'the owner'}
Phone: {phone or 'call for estimate'}
Google reviews: {google_reviews}

Generate their brand identity. Return ONLY valid JSON (no markdown):
{{
  "company_name": "{company_name}",
  "tagline": "a compelling 6-8 word tagline for a roofing company in {city}",
  "primary_color": "#hex — pick a strong professional color (dark blue, forest green, charcoal, burgundy, etc.)",
  "secondary_color": "#hex — lighter accent that complements",
  "services": ["Roof Replacement", "Storm Damage Repair", "Gutters & Fascia", "Emergency Repairs", "Free Estimates", "Insurance Claims"],
  "city": "{city}",
  "state": "{state}",
  "phone": "{phone}",
  "logo_url": "",
  "about": "2 sentence description of {company_name} as a trusted local roofing contractor in {city}",
  "review_count": {google_reviews},
  "years_in_business": 8
}}"""

    msg = ai.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{"role": "user", "content": brand_prompt}]
    )
    raw = msg.content[0].text.strip().replace("```json", "").replace("```", "").strip()
    brand = json.loads(raw)

    # Step 2: Generate marketing audit (same logic, no website score)
    audit_prompt = f"""Write a marketing audit for {company_name} in {city}, {state}.
Owner's first name: {owner_name.split()[0] if owner_name else 'there'}
They currently have NO website.
Google reviews: {google_reviews}

Include:
1. CALL CAPTURE SCORE (X/10) — likely 3-4 since no website
2. SPEED-TO-LEAD SCORE (X/10) — likely 2-3
3. REVIEW VELOCITY SCORE (X/10) — based on {google_reviews} reviews
4. WEBSITE CONVERSION SCORE — 0/10 (no website exists yet)
5. AFTER-HOURS COVERAGE — No
6. REVENUE AT RISK: 1,095-1,825 missed calls/yr × $9,500 avg job = $1.56M-$8.67M/year at risk
7. TOP 3 REVENUE LEAKS (no website is #1)
8. 90-DAY FIX: We built them a website with AI voice receptionist already installed

Address to {owner_name.split()[0] if owner_name else 'the owner'} directly.
350-450 words. Professional. End: "Your new website is ready. We built it for {company_name} specifically."
NO pricing. NO pitch. Diagnose and prescribe only."""

    audit_msg = ai.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=900,
        messages=[{"role": "user", "content": audit_prompt}]
    )
    audit_text = audit_msg.content[0].text

    # Step 3: Build the homepage HTML
    html = build_homepage(brand, "", None)  # No widget key yet — injected after voice AI step

    return {"html": html, "brand": brand, "audit_text": audit_text}


# ── UPDATE build_demo_task TO HANDLE no_website FLAG ─────────────────────────
# In the existing build_demo_task function, add this check at the top of the scraping step:

NO_WEBSITE_DEMO_PATCH = '''
# Add this check inside build_demo_task() AFTER getting the request:

if getattr(req, 'no_website', False) or not req.website_url:
    # No website — build from company name + GHL contact data
    update(1, "scraping", "No website found — building from company info")
    
    # Get contact data for city/state/phone/owner
    contact = {}
    if req.contact_id:
        async with httpx.AsyncClient() as client:
            r = await client.get(
                f"{GHL_BASE}/contacts/{req.contact_id}",
                headers={"Authorization": f"Bearer {GHL_TOKEN}", "Version": "2021-04-15"},
            )
            contact = r.json().get("contact", {})
    
    city = contact.get("city", "")
    state = contact.get("state", "")
    phone = contact.get("phone", "")
    owner = contact.get("firstName", "") + " " + contact.get("lastName", "")
    reviews = contact.get("customFields", {}).get("google_reviews", 0)
    
    update(2, "building", "Generating brand identity from company info")
    result = await build_homepage_no_website(
        req.client_name, city, state, phone.strip(), owner.strip(), int(reviews or 0)
    )
    brand = result["brand"]
    homepage_html = result["html"]
    audit = result["audit_text"]
    
    # Skip to deployment step
    update(5, "deploying", "Deploying homepage to Vercel")
    slug = re.sub(r"[^a-z0-9]", "-", req.client_name.lower())[:28].strip("-")
    demo_url = await deploy_to_vercel(slug, homepage_html)
    
    # Continue with voice AI and delivery...
    # [rest of the function continues normally]
'''


# ── ADD TO CreateDemoRequest schema ──────────────────────────────────────────
# Add this field to the existing CreateDemoRequest Pydantic model:
# no_website: bool = False
# 
# So the GHL Workflow 15 webhook can POST:
# {"contact_id": "...", "website_url": "", "client_name": "...", "no_website": true}
