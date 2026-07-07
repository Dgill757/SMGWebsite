"""
ROOFING WEBSITE TEMPLATE CLONER
================================
Replaces the basic build_homepage() function in ava_demo_studio_COMPLETE_API.py.

Strategy: Clone Dan's best GitHub roofing template, use Claude to do
intelligent content replacement, inject Thinker voice widget, deploy to Vercel.
Result: A polished, professional demo in ~60 seconds that looks like a real website.

HOW TO INTEGRATE:
1. Add these functions to ava_demo_studio_COMPLETE_API.py
2. In build_demo_task(), replace the call to build_homepage() with
   await clone_and_customize_template(brand, widget_key)
3. Set GITHUB_TOKEN in Railway env vars (optional, increases rate limits)
"""

import os, json, re, base64, httpx
from anthropic import Anthropic

ai = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")  # optional, increases rate limit

# ── Dan's GitHub template repos (in preference order) ────────────────────────
# Claude Code will test all three and pick the one with the richest index.html
TEMPLATE_REPOS = [
    "Dgill757/Roofing-Template2",
    "Dgill757/roofing-template-roofez",
    "Dgill757/Roofing-Website-Template",
]

# Thinker CDN script URL — update this when Thinker updates their embed code
THINKER_CDN = "https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"


async def fetch_template_from_github(repo: str, filepath: str = "index.html") -> str | None:
    """Fetch a file from Dan's GitHub template repos."""
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(
            f"https://api.github.com/repos/{repo}/contents/{filepath}",
            headers=headers,
        )
        if r.status_code == 200:
            data = r.json()
            if data.get("encoding") == "base64":
                return base64.b64decode(data["content"].replace("\n", "")).decode("utf-8", errors="ignore")
    return None


async def get_best_template() -> tuple[str, str]:
    """
    Try each of Dan's template repos and return (repo_name, html_content)
    for the first one that has a valid index.html.
    Falls back to the premium Claude-generated template if all fail.
    """
    for repo in TEMPLATE_REPOS:
        html = await fetch_template_from_github(repo)
        if html and len(html) > 2000 and "<html" in html.lower():
            print(f"[TEMPLATE] Using {repo}")
            return repo, html

    # Fallback: generate premium template from scratch
    print("[TEMPLATE] GitHub templates unavailable — generating premium template")
    return "generated", ""


async def clone_and_customize_template(brand: dict, widget_key: str | None) -> str:
    """
    Main function. Replaces build_homepage().
    1. Fetches Dan's GitHub template
    2. Uses Claude to do intelligent content replacement
    3. Injects voice AI widget
    4. Returns final HTML ready to deploy
    """
    repo, template_html = await get_best_template()

    company = brand.get("company_name", "Roofing Company")
    city = brand.get("city", "")
    state = brand.get("state", "")
    phone = brand.get("phone", "")
    tagline = brand.get("tagline", f"The Roofers {city} Trusts Most")
    services = brand.get("services", ["Roof Replacement", "Storm Damage Repair", "Gutters", "Free Estimates"])
    about = brand.get("about", f"Trusted roofing contractor serving {city}.")
    primary_color = brand.get("primary_color", "#1B3A6B")
    reviews = brand.get("review_count", 0)
    years = brand.get("years_in_business", 8)
    logo_url = brand.get("logo_url", "")

    if repo == "generated" or not template_html:
        # Generate a premium full-page HTML directly with Claude
        return await generate_premium_homepage(brand, widget_key)

    # Claude does the intelligent replacement
    customize_prompt = f"""You are customizing a roofing company website template.

TEMPLATE HTML (modify this):
{template_html[:12000]}

COMPANY DATA to inject:
- Company name: {company}
- City: {city}, {state}
- Phone: {phone}
- Tagline: {tagline}
- Services: {', '.join(services[:8])}
- About: {about}
- Brand color (primary): {primary_color}
- Logo URL: {logo_url if logo_url else 'none'}
- Google reviews: {reviews}
- Years in business: {years}

INSTRUCTIONS:
1. Replace ALL placeholder company names (Roofing Co, Your Company, Company Name, etc.) with: {company}
2. Replace ALL placeholder cities/locations with: {city}, {state}
3. Replace ALL placeholder phone numbers with: {phone}
4. Replace the main headline/tagline with: {tagline}
5. Replace service list items with the actual services provided
6. Replace the about/description text with the company about text
7. Update the brand color — replace the template's primary color with: {primary_color}
8. If there's a logo image src, replace with: {logo_url if logo_url else '/logo.png'}
9. Replace any generic stats: use {reviews} reviews, {years} years in business, Licensed & Insured, 24/7 Service
10. Replace copyright year and footer company name with {company}
11. Remove any "demo" or "template" watermarks
12. In the meta title: use "{company} | Roofing Contractor | {city} {state}"
13. Keep ALL existing CSS, JavaScript, and external library links EXACTLY as-is
14. Keep the overall page structure — don't redesign, just replace content

DESIGN STANDARDS (apply throughout):
- Hero: Large bold headline, strong CTA above fold, trust signals (Licensed/Insured/Guarantee) visible
- Colors: Use the brand primary color ({primary_color}) consistently for CTAs, highlights, and accents
- Services: Card grid with emojis/icons as card headers, not a plain list
- Social proof: Star rating + review count prominently displayed near the top or hero
- CTAs: Phone number as a clickable tel: link in at least 3 places (nav, hero, footer)
- Mobile: Nav links hidden behind hamburger, single-column layout, touch-friendly buttons (min 44px)
- Voice widget: Fixed bottom-right corner with a small "Talk to Ava" label floating just above it

VOICE AI WIDGET INJECTION:
At the END of the <body> tag (just before </body>), add EXACTLY this code:
<script src="{THINKER_CDN}"></script>
{f'<div style="position:fixed;bottom:24px;right:24px;z-index:9999"><div style="text-align:center;margin-bottom:6px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.5px;text-shadow:0 1px 3px rgba(0,0,0,0.5)">Talk to Ava</div><div data-widget-key="{widget_key}"></div></div>' if widget_key else '<!-- voice widget: no key yet -->'}

Return ONLY the complete modified HTML. No explanation. No markdown. Just the HTML."""

    msg = ai.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=16000,
        messages=[{"role": "user", "content": customize_prompt}]
    )

    customized_html = msg.content[0].text.strip()

    # Strip any accidental markdown fences
    if customized_html.startswith("```"):
        customized_html = re.sub(r"^```\w*\n?", "", customized_html)
        customized_html = re.sub(r"\n?```$", "", customized_html)

    return customized_html


async def generate_premium_homepage(brand: dict, widget_key: str | None) -> str:
    """
    Fallback: Generate a world-class roofing homepage using Claude + vibe-coding principles.
    This is triggered when GitHub is unreachable.
    Uses the same aesthetic quality as Dan's best templates.
    """
    company = brand.get("company_name", "Elite Roofing")
    city = brand.get("city", "")
    state = brand.get("state", "")
    phone = brand.get("phone", "Call for Estimate")
    tagline = brand.get("tagline", "")
    services = brand.get("services", ["Roof Replacement", "Storm Damage", "Gutters", "Emergency Repairs"])
    about = brand.get("about", "")
    color = brand.get("primary_color", "#1B3A6B")
    color2 = brand.get("secondary_color", "#F97316")
    reviews = brand.get("review_count", 0)
    years = brand.get("years_in_business", 8)
    logo_url = brand.get("logo_url", "")

    widget_code = ""
    if widget_key:
        widget_code = f"""<script src="{THINKER_CDN}"></script>
<div data-widget-key="{widget_key}" style="position:fixed;bottom:24px;right:24px;z-index:9999"></div>"""

    services_items = "\n".join([f"""
        <div class="service-card">
            <div class="service-icon">🏠</div>
            <h3>{s}</h3>
            <p>Licensed professionals. Backed by our written guarantee.</p>
        </div>""" for s in services[:6]])

    review_stars = "★★★★★" if reviews > 0 else "★★★★★"
    review_text = f"{reviews}+ 5-star reviews" if reviews > 0 else "5-star rated"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{company} | Roofing Contractor | {city} {state}</title>
<meta name="description" content="{company} — trusted roofing contractor in {city}, {state}. Roof replacement, storm damage, gutters. Free estimates. Call {phone}.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root {{
  --primary: {color};
  --accent: {color2};
  --dark: #0f1923;
  --text: #1a1a2e;
  --light: #f8f9fa;
  --white: #ffffff;
  --shadow: 0 4px 24px rgba(0,0,0,.12);
  --shadow-lg: 0 12px 48px rgba(0,0,0,.18);
}}

*{{margin:0;padding:0;box-sizing:border-box}}
html{{scroll-behavior:smooth}}
body{{font-family:'Open Sans',sans-serif;color:var(--text);overflow-x:hidden}}

/* NAV */
.nav{{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(15,25,35,.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.06);transition:all .3s}}
.nav-inner{{max-width:1200px;margin:0 auto;padding:0 32px;height:72px;display:flex;align-items:center;justify-content:space-between}}
.logo-wrap{{display:flex;align-items:center;gap:12px;text-decoration:none}}
.logo-icon{{width:44px;height:44px;background:var(--accent);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px}}
.logo-text{{font-family:'Montserrat',sans-serif;font-weight:800;font-size:1.1rem;color:var(--white);letter-spacing:-.3px}}
.logo-text span{{color:var(--accent)}}
.nav-links{{display:flex;align-items:center;gap:32px}}
.nav-links a{{color:rgba(255,255,255,.75);text-decoration:none;font-size:.875rem;font-weight:500;transition:color .2s}}
.nav-links a:hover{{color:var(--white)}}
.nav-cta{{background:var(--accent);color:var(--white)!important;padding:10px 24px;border-radius:8px;font-weight:600!important}}
.nav-cta:hover{{opacity:.9}}

/* HERO */
.hero{{min-height:100vh;background:linear-gradient(135deg,var(--dark) 0%,#1B2C3E 60%,#0d1b2a 100%);display:flex;align-items:center;padding-top:72px;position:relative;overflow:hidden}}
.hero::before{{content:'';position:absolute;top:0;right:0;width:60%;height:100%;background:url('https://images.unsplash.com/photo-1632823471565-1ecdf5c6da1d?w=900&auto=format&fit=crop&q=60') center/cover no-repeat;opacity:.15}}
.hero::after{{content:'';position:absolute;top:0;right:0;width:60%;height:100%;background:linear-gradient(to right,var(--dark),transparent)}}
.hero-inner{{max-width:1200px;margin:0 auto;padding:80px 32px;position:relative;z-index:1}}
.hero-label{{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:100px;padding:6px 16px;font-size:.8rem;color:rgba(255,255,255,.8);margin-bottom:28px;letter-spacing:.5px}}
.hero-label::before{{content:'✓';background:var(--accent);width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;color:white}}
.hero h1{{font-family:'Montserrat',sans-serif;font-size:clamp(2.4rem,5.5vw,4.2rem);font-weight:900;line-height:1.05;color:var(--white);max-width:680px;margin-bottom:24px;letter-spacing:-.03em}}
.hero h1 strong{{color:var(--accent)}}
.hero p{{font-size:1.1rem;color:rgba(255,255,255,.65);max-width:540px;line-height:1.75;margin-bottom:40px}}
.hero-actions{{display:flex;gap:16px;flex-wrap:wrap;align-items:center}}
.btn-primary{{background:var(--accent);color:white;padding:16px 36px;border-radius:10px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:1rem;text-decoration:none;transition:all .25s;box-shadow:0 4px 20px rgba(0,0,0,.25)}}
.btn-primary:hover{{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.3)}}
.btn-secondary{{background:transparent;color:white;padding:16px 36px;border-radius:10px;font-family:'Montserrat',sans-serif;font-weight:600;font-size:1rem;text-decoration:none;border:2px solid rgba(255,255,255,.25);transition:all .25s}}
.btn-secondary:hover{{border-color:white;background:rgba(255,255,255,.08)}}
.hero-stats{{display:flex;gap:40px;margin-top:56px;padding-top:40px;border-top:1px solid rgba(255,255,255,.1)}}
.hero-stat{{text-align:left}}
.hero-stat-num{{font-family:'Montserrat',sans-serif;font-size:2rem;font-weight:800;color:var(--accent);line-height:1}}
.hero-stat-lbl{{font-size:.8rem;color:rgba(255,255,255,.55);margin-top:4px;letter-spacing:.3px}}

/* TRUST BAR */
.trust{{background:var(--primary);padding:18px 0}}
.trust-inner{{max-width:1200px;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap}}
.trust-item{{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.85);font-size:.875rem;font-weight:500}}
.trust-item svg{{flex-shrink:0}}

/* SERVICES */
.services{{padding:96px 0;background:var(--light)}}
.services-inner{{max-width:1200px;margin:0 auto;padding:0 32px}}
.section-header{{text-align:center;margin-bottom:56px}}
.section-tag{{font-size:.75rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:12px}}
.section-title{{font-family:'Montserrat',sans-serif;font-size:clamp(1.75rem,3.5vw,2.5rem);font-weight:800;color:var(--text);letter-spacing:-.02em}}
.services-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}}
.service-card{{background:white;border-radius:16px;padding:32px;border:1px solid rgba(0,0,0,.07);transition:all .3s;cursor:default}}
.service-card:hover{{transform:translateY(-6px);box-shadow:var(--shadow-lg);border-color:var(--accent)}}
.service-icon{{font-size:2rem;margin-bottom:16px}}
.service-card h3{{font-family:'Montserrat',sans-serif;font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:8px}}
.service-card p{{font-size:.9rem;color:#64748b;line-height:1.6}}

/* SOCIAL PROOF */
.proof{{padding:96px 0;background:var(--dark)}}
.proof-inner{{max-width:1200px;margin:0 auto;padding:0 32px}}
.reviews-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-top:56px}}
.review-card{{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px}}
.review-stars{{color:var(--accent);font-size:1.1rem;margin-bottom:12px;letter-spacing:2px}}
.review-text{{color:rgba(255,255,255,.75);line-height:1.7;font-size:.95rem;margin-bottom:20px}}
.review-author{{display:flex;align-items:center;gap:12px}}
.review-avatar{{width:40px;height:40px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:700;color:white;font-size:.9rem;font-family:'Montserrat',sans-serif}}
.review-name{{font-weight:600;color:white;font-size:.9rem}}
.review-location{{font-size:.8rem;color:rgba(255,255,255,.45)}}

/* ABOUT */
.about{{padding:96px 0;background:white}}
.about-inner{{max-width:1200px;margin:0 auto;padding:0 32px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}}
.about-content .section-tag{{text-align:left}}
.about-content .section-title{{text-align:left;margin-bottom:24px}}
.about-content p{{color:#475569;line-height:1.8;margin-bottom:20px}}
.about-checklist{{list-style:none;display:flex;flex-direction:column;gap:12px;margin:28px 0}}
.about-checklist li{{display:flex;align-items:center;gap:10px;font-weight:500;color:var(--text)}}
.about-checklist li::before{{content:'✓';background:var(--accent);color:white;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;flex-shrink:0}}
.about-visual{{background:linear-gradient(135deg,var(--primary) 0%,#0d1b2a 100%);border-radius:20px;padding:40px;position:relative;overflow:hidden}}
.about-visual::after{{content:'';position:absolute;top:-40%;right:-20%;width:300px;height:300px;background:radial-gradient(circle,rgba(255,255,255,.06) 0%,transparent 70%);pointer-events:none}}
.about-visual-stats{{display:grid;grid-template-columns:1fr 1fr;gap:20px;position:relative;z-index:1}}
.av-stat{{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:20px}}
.av-stat-num{{font-family:'Montserrat',sans-serif;font-size:2rem;font-weight:800;color:var(--accent);line-height:1;margin-bottom:4px}}
.av-stat-lbl{{font-size:.8rem;color:rgba(255,255,255,.55);letter-spacing:.3px}}

/* CTA */
.cta{{padding:96px 0;background:linear-gradient(135deg,var(--primary) 0%,#0d1b2a 100%);position:relative;overflow:hidden}}
.cta::before{{content:'';position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M0 60L60 0" stroke="rgba(255,255,255,.04)" stroke-width="1" fill="none"/></svg>') repeat}}
.cta-inner{{max-width:800px;margin:0 auto;padding:0 32px;text-align:center;position:relative;z-index:1}}
.cta h2{{font-family:'Montserrat',sans-serif;font-size:clamp(1.75rem,4vw,3rem);font-weight:800;color:white;margin-bottom:16px;letter-spacing:-.02em}}
.cta p{{font-size:1.1rem;color:rgba(255,255,255,.7);margin-bottom:40px;line-height:1.6}}
.cta-phone{{display:inline-flex;align-items:center;gap:10px;background:white;color:var(--primary);padding:18px 40px;border-radius:12px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:1.25rem;text-decoration:none;transition:all .25s;margin-bottom:16px;box-shadow:var(--shadow-lg)}}
.cta-phone:hover{{transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.3)}}
.cta-note{{font-size:.875rem;color:rgba(255,255,255,.5)}}

/* FOOTER */
footer{{background:#0a0f1a;padding:40px 0;border-top:1px solid rgba(255,255,255,.07)}}
.footer-inner{{max-width:1200px;margin:0 auto;padding:0 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}}
.footer-brand{{font-family:'Montserrat',sans-serif;font-weight:700;color:rgba(255,255,255,.6);font-size:.9rem}}
.footer-brand span{{color:var(--accent)}}
.footer-note{{font-size:.75rem;color:rgba(255,255,255,.2)}}

/* VOICE WIDGET */
.voice-badge{{position:fixed;bottom:100px;right:24px;background:var(--primary);color:white;border-radius:100px;padding:8px 16px;font-size:.75rem;font-weight:600;box-shadow:var(--shadow-lg);z-index:9998;animation:float 3s ease-in-out infinite}}
@keyframes float{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-6px)}}}}

@media(max-width:900px){{
  .nav-links{{display:none}}
  .hero-inner{{padding:60px 24px}}
  .hero-stats{{gap:24px;flex-wrap:wrap}}
  .about-inner{{grid-template-columns:1fr}}
  .about-visual{{display:none}}
  .trust-inner{{gap:20px}}
}}
</style>
</head>
<body>

<nav class="nav">
  <div class="nav-inner">
    <a href="#" class="logo-wrap">
      <div class="logo-icon">🏠</div>
      <div class="logo-text">{company.split()[0]}<span>{' '.join(company.split()[1:]) if len(company.split())>1 else ''}</span></div>
    </a>
    <div class="nav-links">
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#reviews">Reviews</a>
      <a href="#contact" class="nav-cta">Free Estimate</a>
    </div>
  </div>
</nav>

<section class="hero">
  <div class="hero-inner">
    <div class="hero-label">Serving {city}, {state} &amp; Surrounding Areas</div>
    <h1>{tagline if tagline else f'The Roofing Company <strong>{city}</strong> Trusts Most'}</h1>
    <p>Licensed, bonded, and insured. {years}+ years protecting homes in {city}. We show up, do the job right, and back it with a written guarantee.</p>
    <div class="hero-actions">
      <a href="tel:{phone}" class="btn-primary">📞 Call for Free Estimate</a>
      <a href="#services" class="btn-secondary">View Our Services</a>
    </div>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-num">{reviews if reviews > 0 else '200'}+</div>
        <div class="hero-stat-lbl">{review_stars} Reviews</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num">{years}+</div>
        <div class="hero-stat-lbl">Years in Business</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num">24/7</div>
        <div class="hero-stat-lbl">Emergency Service</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num">100%</div>
        <div class="hero-stat-lbl">Satisfaction Guarantee</div>
      </div>
    </div>
  </div>
</section>

<div class="trust">
  <div class="trust-inner">
    <div class="trust-item"><svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(255,255,255,.6)"><path d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1L2 5.4l4.2-.8L8 1z"/></svg>Licensed &amp; Insured</div>
    <div class="trust-item"><svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(255,255,255,.6)"><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.6)" stroke-width="1.5" fill="none"/><path d="M5 8l2 2 4-4" stroke="rgba(255,255,255,.6)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>Written Guarantee</div>
    <div class="trust-item"><svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(255,255,255,.6)"><path d="M8 1a5 5 0 0 0-5 5v2.5L1.5 11h13L13 8.5V6a5 5 0 0 0-5-5zm0 14a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2z"/></svg>24/7 Emergency Response</div>
    <div class="trust-item"><svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(255,255,255,.6)"><path d="M2 3h12v10H2zM2 6h12M6 6v7"/></svg>Works With All Insurance</div>
    <div class="trust-item"><svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(255,255,255,.6)"><path d="M1 8h2M13 8h2M8 1v2M8 13v2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4"/></svg>Free Estimates</div>
  </div>
</div>

<section class="services" id="services">
  <div class="services-inner">
    <div class="section-header">
      <p class="section-tag">What We Do</p>
      <h2 class="section-title">Complete Roofing Services</h2>
    </div>
    <div class="services-grid">
      {services_items}
    </div>
  </div>
</section>

<section class="proof" id="reviews">
  <div class="proof-inner">
    <div class="section-header">
      <p class="section-tag" style="color:var(--accent)">What Homeowners Say</p>
      <h2 class="section-title" style="color:white">{review_stars} {reviews if reviews > 0 else '5-Star'} Rated in {city}</h2>
    </div>
    <div class="reviews-grid">
      <div class="review-card">
        <div class="review-stars">★★★★★</div>
        <p class="review-text">"From the estimate to the final cleanup, everything was handled professionally. No surprises. The roof looks incredible and they finished ahead of schedule."</p>
        <div class="review-author"><div class="review-avatar">MJ</div><div><div class="review-name">Mike J.</div><div class="review-location">{city}, {state}</div></div></div>
      </div>
      <div class="review-card">
        <div class="review-stars">★★★★★</div>
        <p class="review-text">"Called about storm damage and they came out same day. Insurance claim was smooth, price was fair, and the workmanship is top quality. Highly recommend."</p>
        <div class="review-author"><div class="review-avatar">SR</div><div><div class="review-name">Sarah R.</div><div class="review-location">{city}, {state}</div></div></div>
      </div>
      <div class="review-card">
        <div class="review-stars">★★★★★</div>
        <p class="review-text">"Best roofing company I've dealt with in 20 years of homeownership. Honest, on time, and the cleanup was immaculate. Will use them again without hesitation."</p>
        <div class="review-author"><div class="review-avatar">DW</div><div><div class="review-name">David W.</div><div class="review-location">{city}, {state}</div></div></div>
      </div>
    </div>
  </div>
</section>

<section class="about" id="about">
  <div class="about-inner">
    <div class="about-content">
      <p class="section-tag">Why Choose Us</p>
      <h2 class="section-title">Built on Trust.<br>Proven by Results.</h2>
      <p>{about if about else f"{company} has been protecting homes in {city} for over {years} years. We are a family-owned operation — not a national franchise — which means you talk to the owner, not a call center."}</p>
      <p>Every job is treated like it's our own home. We only use manufacturer-approved materials, and every install is backed by our written workmanship guarantee.</p>
      <ul class="about-checklist">
        <li>Factory-certified installation on all major brands</li>
        <li>Written workmanship guarantee on every job</li>
        <li>Direct insurance billing — we handle the paperwork</li>
        <li>Same-day estimates, same-week starts available</li>
      </ul>
      <a href="tel:{phone}" class="btn-primary" style="display:inline-flex;align-items:center;gap:8px;margin-top:8px">📞 {phone or 'Call for Free Estimate'}</a>
    </div>
    <div class="about-visual">
      <div class="about-visual-stats">
        <div class="av-stat"><div class="av-stat-num">{years}+</div><div class="av-stat-lbl">Years in Business</div></div>
        <div class="av-stat"><div class="av-stat-num">{reviews if reviews > 0 else '500'}+</div><div class="av-stat-lbl">Jobs Completed</div></div>
        <div class="av-stat"><div class="av-stat-num">100%</div><div class="av-stat-lbl">Guarantee</div></div>
        <div class="av-stat"><div class="av-stat-num">24/7</div><div class="av-stat-lbl">Emergency Line</div></div>
      </div>
    </div>
  </div>
</section>

<section class="cta" id="contact">
  <div class="cta-inner">
    <h2>Ready to Get Started?</h2>
    <p>Talk to our AI assistant right now — it can answer questions, give you a ballpark estimate, and schedule your free on-site inspection. Available 24/7.</p>
    <a href="tel:{phone}" class="cta-phone">📞 {phone or 'Call for Free Estimate'}</a>
    <p class="cta-note">Or talk to our AI receptionist below — available right now, 24/7</p>
  </div>
</section>

<footer>
  <div class="footer-inner">
    <div class="footer-brand">{company.split()[0]}<span>{''.join(company.split()[1:])}</span> &copy; 2026</div>
    <div class="footer-note">Powered by Summit Voice AI — summitvoiceai.com</div>
  </div>
</footer>

<!-- VOICE AI WIDGET (Thinker) -->
{widget_code}

</body>
</html>"""
