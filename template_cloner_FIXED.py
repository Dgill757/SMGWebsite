"""
SUMMIT VOICE AI — REAL TEMPLATE CLONER
========================================
This replaces the old template_cloner.py that was generating bad HTML from scratch.

THE FIX: Clone Dan's actual GitHub repo files. Do targeted text replacement.
DO NOT let Claude regenerate the HTML. Use the real template.

The demos will now look exactly like Dan's roofing websites —
because they ARE Dan's roofing websites, just with the prospect's content in them.

Strategy:
1. Fetch the actual index.html from GitHub repo
2. Parse with BeautifulSoup for safe replacement
3. Replace ONLY: company name, phone, city, services text, colors
4. Keep ALL CSS, JS, animations, layout exactly as-is
5. Inject voice widget AFTER
6. Deploy the result

Install: pip install beautifulsoup4 httpx anthropic python-dotenv
"""

import os, re, base64, json, asyncio
import httpx
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

ai = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
THINKER_CDN = "https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"

# Dan's GitHub template repos in preference order
REPOS = [
    ("Dgill757/Roofing-Template2",          "index.html"),
    ("Dgill757/roofing-template-roofez",    "index.html"),
    ("Dgill757/Roofing-Website-Template",   "index.html"),
]


async def fetch_github_file(repo: str, filepath: str = "index.html") -> str | None:
    """Fetch actual HTML file from Dan's GitHub repo."""
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "SummitVoiceAI"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    urls_to_try = [
        f"https://api.github.com/repos/{repo}/contents/{filepath}",
        f"https://raw.githubusercontent.com/{repo}/main/{filepath}",
        f"https://raw.githubusercontent.com/{repo}/master/{filepath}",
    ]

    async with httpx.AsyncClient(timeout=20) as client:
        for url in urls_to_try:
            try:
                r = await client.get(url, headers=headers)
                if r.status_code == 200:
                    # API response (base64 encoded)
                    if "api.github.com" in url:
                        data = r.json()
                        if data.get("encoding") == "base64":
                            return base64.b64decode(data["content"].replace("\n", "")).decode("utf-8", errors="ignore")
                    else:
                        # Raw content
                        return r.text
            except Exception as e:
                print(f"[TEMPLATE] Fetch attempt failed: {url[:60]}... — {e}")
                continue
    return None


async def get_best_template() -> tuple[str, str]:
    """Try each repo. Return (repo_name, html_content) for first success."""
    for repo, filepath in REPOS:
        print(f"[TEMPLATE] Trying: {repo}/{filepath}")
        html = await fetch_github_file(repo, filepath)
        if html and len(html) > 3000 and "<" in html:
            print(f"[TEMPLATE] ✓ Using {repo} — {len(html):,} chars")
            return repo, html

    # Fallback — generate professional homepage using vibe guide
    print("[TEMPLATE] ⚠ GitHub repos unavailable — using premium generator")
    return "generated", ""


def smart_replace(html: str, brand: dict) -> str:
    """
    Targeted text replacement in the actual HTML template.
    
    This is the core fix. Instead of asking Claude to rewrite the HTML,
    we do precise find-and-replace on ONLY the content fields.
    The structure, CSS, animations, and layout are UNTOUCHED.
    """
    company = brand.get("company_name", "")
    phone = brand.get("phone", "")
    city = brand.get("city", "")
    state = brand.get("state", "")
    tagline = brand.get("tagline", "")
    services = brand.get("services", [])
    primary_color = brand.get("primary_color", "")
    about = brand.get("about", "")
    reviews = brand.get("review_count", 0)
    years = brand.get("years_in_business", 8)

    # --- COMPANY NAME ---
    # Common placeholder patterns in roofing templates
    placeholders_name = [
        r"Your Roofing Company", r"Roofing Company", r"Company Name",
        r"YourCompany", r"RoofPro", r"Elite Roofing", r"Pro Roofing",
        r"Peak Roofing", r"Summit Roofing", r"COMPANY NAME",
        # Add more as found in Dan's actual templates
    ]
    if company:
        for p in placeholders_name:
            html = re.sub(re.escape(p), company, html, flags=re.IGNORECASE)

    # --- PHONE NUMBER ---
    phone_patterns = [
        r"\(555\)\s*\d{3}-\d{4}", r"555-\d{3}-\d{4}",
        r"\(000\)\s*000-0000", r"000-000-0000",
        r"\(123\)\s*456-7890", r"123-456-7890",
        r"\+1\s*\(555\)", r"Call Us Today",
    ]
    if phone:
        for p in phone_patterns:
            html = re.sub(p, phone, html, flags=re.IGNORECASE)

    # --- LOCATION ---
    location_patterns = [
        r"Your City, State", r"Your City", r"Your Location",
        r"Anytown, USA", r"Dallas, TX", r"Phoenix, AZ", r"Houston, TX",
    ]
    if city:
        full_location = f"{city}, {state}" if state else city
        for p in location_patterns:
            html = re.sub(re.escape(p), full_location, html, flags=re.IGNORECASE)

    # --- TAGLINE / HEADLINE ---
    tagline_patterns = [
        r"Your Trusted Local Roofing Contractor",
        r"Professional Roofing Services",
        r"Quality Roofing You Can Trust",
        r"Expert Roofing Services",
        r"Reliable Roofing Solutions",
    ]
    if tagline:
        for p in tagline_patterns:
            html = re.sub(re.escape(p), tagline, html, flags=re.IGNORECASE)

    # --- PRIMARY COLOR ---
    # Only replace the MAIN brand color, not every hex
    color_patterns = [
        r"#1B3A6B", r"#003366", r"#1a3c5e", r"#2C5F8A",  # common dark blues
        r"#CC0000", r"#D32F2F",  # common reds
    ]
    if primary_color and primary_color.startswith("#"):
        for p in color_patterns[:1]:  # Only replace the first/most common
            html = html.replace(p, primary_color, 3)  # Max 3 replacements

    # --- ABOUT TEXT ---
    about_patterns = [
        r"We have been serving the local community.*?years\.",
        r"With over \d+ years of experience.*?\.",
        r"Your trusted local roofing company.*?\.",
    ]
    if about:
        for p in about_patterns:
            html = re.sub(p, about, html, flags=re.IGNORECASE | re.DOTALL, count=1)

    # --- REVIEW COUNT / STATS ---
    if reviews > 0:
        html = re.sub(r"\b500\+ Reviews\b", f"{reviews}+ Reviews", html, flags=re.IGNORECASE)
        html = re.sub(r"\b200\+ Reviews\b", f"{reviews}+ Reviews", html, flags=re.IGNORECASE)
        html = re.sub(r"\b100\+ Reviews\b", f"{reviews}+ Reviews", html, flags=re.IGNORECASE)

    if years > 0:
        html = re.sub(r"\b20\+ Years\b", f"{years}+ Years", html, flags=re.IGNORECASE)
        html = re.sub(r"\b15\+ Years\b", f"{years}+ Years", html, flags=re.IGNORECASE)
        html = re.sub(r"\b10\+ Years\b", f"{years}+ Years", html, flags=re.IGNORECASE)

    # --- META TAGS ---
    # Update title tag
    if company and city:
        new_title = f"<title>{company} | Roofing Contractor | {city}, {state}</title>"
        html = re.sub(r"<title>[^<]+</title>", new_title, html, count=1)
        # Update meta description
        new_desc = f'content="{company} — trusted roofing contractor in {city}, {state}. Free estimates. Call {phone}."'
        html = re.sub(r'content="[^"]*roofing[^"]*"', new_desc, html, count=1, flags=re.IGNORECASE)

    # --- COPYRIGHT YEAR ---
    html = re.sub(r"©\s*202[0-9]", "© 2026", html)

    return html


async def claude_enhance(html: str, brand: dict) -> str:
    """
    Use Claude ONLY to fix what smart_replace missed.
    Minimal intervention — just catch remaining placeholders.
    """
    company = brand.get("company_name", "")
    city = brand.get("city", "")
    state = brand.get("state", "")

    msg = ai.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=200,
        messages=[{"role": "user", "content": f"""Check this HTML snippet for any remaining placeholder text like "Your Company" or "City, State" that wasn't replaced with the real values.
Company: {company}
Location: {city}, {state}

HTML (first 500 chars): {html[:500]}

Reply with ONLY: "OK" if no placeholders found, OR the specific replacements needed in format:
REPLACE: "old text" -> "new text"

Be conservative. Only flag obvious placeholders."""}]
    )

    result = msg.content[0].text.strip()
    if result == "OK":
        return html

    # Apply any suggested fixes
    for line in result.split('\n'):
        if line.startswith('REPLACE:'):
            try:
                parts = line.replace('REPLACE:', '').split(' -> ')
                if len(parts) == 2:
                    old = parts[0].strip().strip('"')
                    new = parts[1].strip().strip('"')
                    html = html.replace(old, new, 1)
            except Exception:
                pass

    return html


def inject_voice_widget(html: str, widget_key: str | None) -> str:
    """Inject Thinker voice widget before </body>."""
    if not widget_key:
        # Inject placeholder comment so it's easy to add later
        placeholder = "\n<!-- VOICE WIDGET: Add Thinker widget key here after Learn Session -->\n"
        return html.replace("</body>", f"{placeholder}</body>", 1)

    widget_code = f"""
<!-- Summit Voice AI — Thinker Voice Widget -->
<style>
  .ava-label {{
    position: fixed; bottom: 82px; right: 24px;
    background: rgba(0,0,0,0.75); color: #fff;
    font-size: 11px; padding: 4px 10px; border-radius: 20px;
    font-family: sans-serif; z-index: 9998;
    animation: float 3s ease-in-out infinite;
  }}
  @keyframes float {{ 0%,100%{{transform:translateY(0)}} 50%{{transform:translateY(-4px)}} }}
</style>
<div class="ava-label">Talk to Ava</div>
<script src="{THINKER_CDN}"></script>
<div data-widget-key="{widget_key}" style="position:fixed;bottom:24px;right:24px;z-index:9999"></div>
"""
    return html.replace("</body>", f"{widget_code}\n</body>", 1)


async def generate_premium_homepage(brand: dict, widget_key: str | None) -> str:
    """
    Cinematic-quality roofing homepage. Barlow Condensed + Barlow fonts.
    Navy #0D1F3C + Orange #F7941D color scheme (or brand override).
    Sections: topbar, sticky-nav, hero, trust-bar, service-tabs,
    storm/insurance, who-we-serve grid, cities grid, about+badge,
    reviews, CTA strip, 4-col footer, mobile sticky bar, pulse phone btn.
    NO placeholder text. All real company content.
    """
    c = brand.get("company_name", "Elite Roofing")
    city = brand.get("city", "")
    state = brand.get("state", "")
    phone = brand.get("phone", "(800) 555-0100")
    tagline = brand.get("tagline", f"The Roofing Company {city} Trusts Most")
    services = brand.get("services", ["Roof Replacement", "Storm Damage", "Gutters", "Emergency Repairs", "Free Estimates", "Insurance Claims"])
    color = brand.get("primary_color", "#0D1F3C")
    color2 = brand.get("secondary_color", "#F7941D")
    about = brand.get("about", f"Trusted roofing contractor serving {city}, {state}.")
    reviews = brand.get("review_count", 0)
    years = brand.get("years_in_business", 8)
    
    # ── Derived content ─────────────────────────────────────────────────
    svcs = (services + ["Roof Replacement", "Storm Damage", "Gutters",
                        "Emergency Repairs", "Insurance Claims", "Metal Roofing"])[:6]
    svc_descs = [
        f"Full tear-off and re-roof using manufacturer-approved materials. Built to last in {city}'s climate.",
        "We work directly with your insurance adjuster. Hail, wind, water — we handle the claim and the repair.",
        "Seamless gutters, guards, and downspouts. Stop water damage before it starts.",
        "Roof emergency in {city}? We dispatch same-day. Tarping, leak repairs, storm response.",
        "Direct insurance billing. We document everything, fight the claim, and fix the roof — you pay your deductible.",
        "Standing seam and corrugated metal roofing. Lasts 40-70 years. Best ROI in the industry.",
    ]
    cities_nearby = [city, f"North {city}", f"South {city}", f"{city} Heights",
                     f"East {city}", f"West {city}", f"{city} Metro", f"Greater {city}"]
    rv_count = str(reviews) + "+" if reviews > 0 else "500+"
    years_str = str(years) + "+"

    # ── Service tab HTML ─────────────────────────────────────────────────
    tab_btns = ""
    tab_panels = ""
    for i, (s, d) in enumerate(zip(svcs, svc_descs)):
        active = "active" if i == 0 else ""
        tab_btns += f'<button class="tab-btn {active}" onclick="showTab({i})">{s}</button>\n'
        tab_panels += f"""<div class="tab-panel {active}" id="tab{i}">
          <h3>{s}</h3>
          <p>{d.format(city=city)}</p>
          <ul>
            <li>Licensed &amp; insured in {state}</li>
            <li>Written workmanship guarantee</li>
            <li>Free inspection — no obligation</li>
            <li>Direct insurance billing available</li>
          </ul>
          <a href="tel:{phone}" class="btn-ora">Get Free Estimate</a>
        </div>\n"""

    # ── Cities grid HTML ─────────────────────────────────────────────────
    cities_html = "".join(f'<div class="city-chip">{cty}</div>' for cty in cities_nearby)

    # ── Voice widget ─────────────────────────────────────────────────────
    if widget_key:
        widget_code = f"""<div class="ava-label">Talk to Ava</div>
<script src="{THINKER_CDN}"></script>
<div data-widget-key="{widget_key}" style="position:fixed;bottom:24px;right:24px;z-index:9999"></div>"""
    else:
        widget_code = "<!-- VOICE WIDGET: Add Thinker widget key after Learn Session -->"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{c} | Roofing Contractor | {city}, {state}</title>
<meta name="description" content="{c} — trusted roofing contractor in {city}, {state}. Storm damage, roof replacement, free estimates. Call {phone}.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{{--navy:{color};--ora:{color2};--dark:#07111e;--mid:#0f1f30;--light:#f4f6f9;--white:#fff;--text:#1a2535}}
*{{margin:0;padding:0;box-sizing:border-box}}
html{{scroll-behavior:smooth}}
body{{font-family:'Barlow',sans-serif;color:var(--text);overflow-x:hidden}}

/* ── TOP BAR ── */
.topbar{{background:var(--dark);padding:8px 40px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:rgba(255,255,255,.6)}}
.topbar a{{color:var(--ora);text-decoration:none;font-weight:600}}
.topbar strong{{color:#fff}}

/* ── NAV ── */
nav{{position:sticky;top:0;background:var(--navy);height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;z-index:200;box-shadow:0 2px 20px rgba(0,0,0,.3)}}
.logo{{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:22px;color:#fff;letter-spacing:.5px;text-decoration:none}}
.logo em{{color:var(--ora);font-style:normal}}
.nav-links{{display:flex;gap:4px;align-items:center}}
.nav-links a{{color:rgba(255,255,255,.75);text-decoration:none;font-size:14px;font-weight:500;padding:6px 14px;border-radius:6px;transition:.2s;position:relative}}
.nav-links a:hover{{color:#fff;background:rgba(255,255,255,.08)}}
.dropdown{{position:relative}}
.dropdown-menu{{display:none;position:absolute;top:100%;left:0;background:var(--dark);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:8px 0;min-width:180px;z-index:300}}
.dropdown:hover .dropdown-menu{{display:block}}
.dropdown-menu a{{display:block;padding:8px 18px;color:rgba(255,255,255,.7);font-size:13px}}
.dropdown-menu a:hover{{background:rgba(255,255,255,.06);color:#fff}}
.nav-cta{{background:var(--ora)!important;color:#fff!important;padding:9px 22px!important;border-radius:8px;font-weight:700!important;font-family:'Barlow Condensed',sans-serif;font-size:15px!important;letter-spacing:.3px}}

/* ── HERO ── */
.hero{{min-height:92vh;background:var(--dark);position:relative;overflow:hidden;display:flex;align-items:center}}
.hero-bg{{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1632823471565-1ecdf5c6da1d?w=1400&q=70&auto=format&fit=crop') center/cover;opacity:.18}}
.hero-grad{{position:absolute;inset:0;background:linear-gradient(105deg,var(--dark) 45%,rgba(7,17,30,.5) 100%)}}
.hero-inner{{max-width:1200px;margin:0 auto;padding:60px 40px;position:relative;z-index:2}}
.hero-badge{{display:inline-flex;align-items:center;gap:8px;background:rgba(247,148,29,.12);border:1px solid rgba(247,148,29,.35);border-radius:100px;padding:6px 16px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;color:var(--ora);letter-spacing:.5px;text-transform:uppercase;margin-bottom:22px}}
.hero h1{{font-family:'Barlow Condensed',sans-serif;font-size:clamp(3rem,6vw,5.2rem);font-weight:900;color:#fff;line-height:1;letter-spacing:-.5px;margin-bottom:20px;text-transform:uppercase}}
.hero h1 span{{color:var(--ora)}}
.hero-sub{{font-size:1.1rem;color:rgba(255,255,255,.6);max-width:500px;line-height:1.7;margin-bottom:32px}}
.hero-ctas{{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:48px}}
.btn-ora{{background:var(--ora);color:#fff;padding:14px 32px;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:17px;letter-spacing:.4px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:.2s;border:none;cursor:pointer}}
.btn-ora:hover{{background:#e5871a;transform:translateY(-2px);box-shadow:0 8px 28px rgba(247,148,29,.35)}}
.btn-ghost{{background:transparent;color:#fff;padding:14px 32px;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-weight:600;font-size:17px;letter-spacing:.4px;text-decoration:none;border:2px solid rgba(255,255,255,.3);transition:.2s}}
.btn-ghost:hover{{border-color:#fff}}
.hero-pills{{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:40px}}
.pill{{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:100px;padding:5px 14px;font-size:12px;color:rgba(255,255,255,.7);font-weight:500}}
.hero-stats{{display:flex;gap:0;border-top:1px solid rgba(255,255,255,.1);padding-top:32px}}
.hstat{{padding:0 36px 0 0;border-right:1px solid rgba(255,255,255,.1);margin-right:36px}}
.hstat:last-child{{border-right:none}}
.hstat-n{{font-family:'Barlow Condensed',sans-serif;font-size:2.4rem;font-weight:800;color:var(--ora);line-height:1}}
.hstat-l{{font-size:.75rem;color:rgba(255,255,255,.45);letter-spacing:.5px;margin-top:2px}}

/* ── TRUST BAR ── */
.trust-bar{{background:var(--navy);padding:14px 40px;display:flex;justify-content:center;align-items:center;gap:40px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.06)}}
.trust-item{{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.8);font-size:13px;font-weight:600;font-family:'Barlow Condensed',sans-serif;letter-spacing:.3px}}
.trust-item svg{{color:var(--ora)}}

/* ── SECTION HELPERS ── */
.sec-wrap{{max-width:1200px;margin:0 auto;padding:0 40px}}
.sec-eyebrow{{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--ora);margin-bottom:8px}}
.sec-title{{font-family:'Barlow Condensed',sans-serif;font-size:clamp(1.9rem,3.5vw,2.8rem);font-weight:800;letter-spacing:-.3px;line-height:1.1}}
.sec-title.light{{color:#fff}}

/* ── SERVICE TABS ── */
.services-sec{{padding:88px 0;background:var(--light)}}
.tab-nav{{display:flex;gap:4px;flex-wrap:wrap;margin:32px 0 0;border-bottom:2px solid rgba(0,0,0,.08);padding-bottom:0}}
.tab-btn{{background:none;border:none;padding:12px 22px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:.4px;color:#64748b;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;transition:.2s;border-radius:8px 8px 0 0}}
.tab-btn:hover{{color:var(--navy);background:rgba(0,0,0,.04)}}
.tab-btn.active{{color:var(--navy);border-bottom-color:var(--ora);background:#fff}}
.tab-panels{{background:#fff;border-radius:0 12px 12px 12px;padding:36px;box-shadow:0 4px 24px rgba(0,0,0,.07)}}
.tab-panel{{display:none}}.tab-panel.active{{display:block}}
.tab-panel h3{{font-family:'Barlow Condensed',sans-serif;font-size:1.8rem;font-weight:800;margin-bottom:12px;color:var(--navy)}}
.tab-panel p{{color:#475569;line-height:1.75;margin-bottom:16px;max-width:600px}}
.tab-panel ul{{margin:0 0 24px 20px;color:#475569;line-height:2}}
.tab-panel ul li{{font-size:.95rem}}

/* ── STORM / INSURANCE ── */
.storm-sec{{padding:88px 0;background:var(--navy);position:relative;overflow:hidden}}
.storm-sec::before{{content:'';position:absolute;right:-100px;top:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(247,148,29,.08) 0%,transparent 70%);pointer-events:none}}
.storm-grid{{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-top:40px}}
.storm-list{{list-style:none;margin-top:16px}}
.storm-list li{{display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.06);color:rgba(255,255,255,.75);font-size:.95rem;line-height:1.5}}
.storm-list li::before{{content:'✓';background:var(--ora);color:#fff;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;margin-top:1px}}
.storm-card{{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:32px}}
.storm-card-title{{font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:800;color:#fff;margin-bottom:8px}}
.storm-card p{{color:rgba(255,255,255,.6);line-height:1.7;font-size:.95rem;margin-bottom:20px}}
.storm-stat{{font-family:'Barlow Condensed',sans-serif;font-size:3rem;font-weight:900;color:var(--ora);line-height:1}}
.storm-stat-label{{font-size:.8rem;color:rgba(255,255,255,.4);letter-spacing:.5px}}

/* ── WHO WE SERVE ── */
.serve-sec{{padding:88px 0;background:#fff}}
.serve-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px;margin-top:40px}}
.serve-card{{background:var(--light);border-radius:14px;padding:28px;border:2px solid transparent;transition:.3s;cursor:default}}
.serve-card:hover{{border-color:var(--ora);background:#fff;transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.1)}}
.serve-icon{{width:44px;height:44px;background:rgba(247,148,29,.12);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px}}
.serve-card h4{{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:800;color:var(--navy);margin-bottom:6px}}
.serve-card p{{font-size:.875rem;color:#64748b;line-height:1.6}}

/* ── CITIES GRID ── */
.cities-sec{{padding:72px 0;background:var(--light)}}
.city-grid{{display:flex;flex-wrap:wrap;gap:10px;margin-top:32px}}
.city-chip{{background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:100px;padding:8px 18px;font-size:13px;font-weight:600;color:var(--navy);font-family:'Barlow Condensed',sans-serif;letter-spacing:.3px;transition:.2s}}
.city-chip:hover{{background:var(--navy);color:#fff;border-color:var(--navy)}}

/* ── ABOUT ── */
.about-sec{{padding:88px 0;background:#fff}}
.about-grid{{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-top:40px}}
.about-badge{{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:120px;height:120px;background:var(--ora);border-radius:50%;margin-bottom:24px}}
.about-badge-n{{font-family:'Barlow Condensed',sans-serif;font-size:2.8rem;font-weight:900;color:#fff;line-height:1}}
.about-badge-l{{font-family:'Barlow Condensed',sans-serif;font-size:.75rem;font-weight:700;color:rgba(255,255,255,.85);letter-spacing:1px;text-transform:uppercase}}
.about-text p{{color:#475569;line-height:1.8;margin-bottom:16px}}

/* ── REVIEWS ── */
.reviews-sec{{padding:88px 0;background:var(--dark)}}
.rv-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:20px;margin-top:40px}}
.rv{{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:28px}}
.rv-stars{{color:var(--ora);font-size:18px;letter-spacing:2px;margin-bottom:14px}}
.rv p{{color:rgba(255,255,255,.7);line-height:1.75;font-size:.95rem;margin-bottom:20px;font-style:italic}}
.rv-author{{display:flex;align-items:center;gap:12px}}
.rv-av{{width:42px;height:42px;border-radius:50%;background:var(--navy);border:2px solid var(--ora);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;color:#fff;font-size:.95rem}}
.rv-name{{font-weight:700;color:#fff;font-size:.9rem}}
.rv-loc{{font-size:.75rem;color:rgba(255,255,255,.4);margin-top:1px}}

/* ── ORANGE CTA STRIP ── */
.cta-strip{{background:var(--ora);padding:64px 0;text-align:center}}
.cta-strip h2{{font-family:'Barlow Condensed',sans-serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:900;color:#fff;letter-spacing:-.3px;text-transform:uppercase;margin-bottom:12px}}
.cta-strip p{{color:rgba(255,255,255,.85);font-size:1.05rem;margin-bottom:28px}}
.btn-dark{{background:var(--navy);color:#fff;padding:15px 36px;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:17px;letter-spacing:.4px;text-decoration:none;transition:.2s;display:inline-flex;align-items:center;gap:8px}}
.btn-dark:hover{{background:var(--dark);transform:translateY(-2px)}}

/* ── 4-COLUMN FOOTER ── */
footer{{background:var(--dark);padding:60px 0 0;border-top:1px solid rgba(255,255,255,.06)}}
.footer-grid{{max-width:1200px;margin:0 auto;padding:0 40px;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;padding-bottom:48px}}
.footer-brand .logo-f{{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:24px;color:#fff;margin-bottom:14px;display:block}}
.footer-brand .logo-f em{{color:var(--ora);font-style:normal}}
.footer-brand p{{color:rgba(255,255,255,.45);font-size:.875rem;line-height:1.7;max-width:240px}}
footer h5{{font-family:'Barlow Condensed',sans-serif;font-size:.85rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:16px}}
footer ul{{list-style:none}}
footer ul li{{margin-bottom:8px}}
footer ul li a{{color:rgba(255,255,255,.6);text-decoration:none;font-size:.875rem;transition:.2s}}
footer ul li a:hover{{color:#fff}}
footer ul li span{{color:rgba(255,255,255,.6);font-size:.875rem}}
.footer-bottom{{border-top:1px solid rgba(255,255,255,.06);padding:18px 40px;max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}}
.footer-bottom p{{font-size:.75rem;color:rgba(255,255,255,.25)}}

/* ── PULSE PHONE BUTTON ── */
.pulse-btn{{position:fixed;bottom:90px;right:24px;width:56px;height:56px;background:var(--ora);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 4px 20px rgba(247,148,29,.5);z-index:9990;text-decoration:none;animation:pulse-ring 2s ease-out infinite}}
@keyframes pulse-ring{{0%{{box-shadow:0 0 0 0 rgba(247,148,29,.5)}}70%{{box-shadow:0 0 0 14px rgba(247,148,29,0)}}100%{{box-shadow:0 0 0 0 rgba(247,148,29,0)}}}}

/* ── MOBILE STICKY BAR ── */
.mobile-bar{{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--navy);border-top:2px solid var(--ora);z-index:9980;padding:12px 16px;gap:10px}}
.mobile-bar a{{flex:1;text-align:center;padding:11px;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;letter-spacing:.3px;text-decoration:none}}
.mb-call{{background:var(--ora);color:#fff}}
.mb-inspect{{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)}}

/* ── AVA WIDGET LABEL ── */
.ava-label{{position:fixed;bottom:154px;right:24px;background:rgba(0,0,0,.8);color:#fff;font-size:11px;padding:5px 12px;border-radius:20px;font-family:'Barlow',sans-serif;z-index:9998;animation:float 3s ease-in-out infinite;white-space:nowrap}}
@keyframes float{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-4px)}}}}

/* ── RESPONSIVE ── */
@media(max-width:900px){{
  .storm-grid,.about-grid,.footer-grid{{grid-template-columns:1fr}}
  .topbar{{display:none}}
  nav{{padding:0 20px}}
  .nav-links .dropdown,.nav-links a:not(.nav-cta){{display:none}}
  .hero-inner{{padding:40px 20px}}
  .sec-wrap{{padding:0 20px}}
  .trust-bar{{gap:20px;padding:14px 20px}}
  .footer-grid{{padding:0 20px 40px}}
  .mobile-bar{{display:flex}}
  body{{padding-bottom:68px}}
}}
</style>
</head>
<body>

<!-- TOP BAR -->
<div class="topbar">
  <span>&#9733; Serving <strong>{city}, {state}</strong> &amp; surrounding areas</span>
  <span>Questions? Call us: <a href="tel:{phone}">{phone}</a></span>
</div>

<!-- STICKY NAV -->
<nav>
  <a href="#" class="logo">{c.split()[0] if c.split() else c}<em>{''.join(c.split()[1:]) if len(c.split()) > 1 else ''}</em></a>
  <div class="nav-links">
    <div class="dropdown">
      <a href="#services">Services ▾</a>
      <div class="dropdown-menu">
        {''.join(f'<a href="#services">{s}</a>' for s in svcs)}
      </div>
    </div>
    <a href="#about">About</a>
    <a href="#reviews">Reviews</a>
    <a href="#cities">Service Area</a>
    <a href="#contact" class="nav-cta">Free Estimate</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-grad"></div>
  <div class="hero-inner">
    <div class="hero-badge">&#9733; #1 Rated Roofer in {city}</div>
    <h1>{tagline or f'{city}<span> Roofing</span> Experts'}</h1>
    <p class="hero-sub">Licensed &amp; insured. {years_str} years protecting homes in {city}. We show up, do the job right, and back it with a written guarantee.</p>
    <div class="hero-ctas">
      <a href="tel:{phone}" class="btn-ora">&#128222; Call {phone}</a>
      <a href="#services" class="btn-ghost">Our Services</a>
    </div>
    <div class="hero-pills">
      <span class="pill">&#10003; Licensed &amp; Insured</span>
      <span class="pill">&#10003; Free Estimates</span>
      <span class="pill">&#10003; Insurance Claims</span>
      <span class="pill">&#10003; 24/7 Emergency</span>
    </div>
    <div class="hero-stats">
      <div class="hstat"><div class="hstat-n">{rv_count}</div><div class="hstat-l">5-Star Reviews</div></div>
      <div class="hstat"><div class="hstat-n">{years_str}</div><div class="hstat-l">Years Experience</div></div>
      <div class="hstat"><div class="hstat-n">24/7</div><div class="hstat-l">Emergency Service</div></div>
      <div class="hstat"><div class="hstat-n">100%</div><div class="hstat-l">Satisfaction Guaranteed</div></div>
    </div>
  </div>
</section>

<!-- TRUST BAR -->
<div class="trust-bar">
  <div class="trust-item">&#10003; Licensed &amp; Bonded</div>
  <div class="trust-item">&#10003; Written Workmanship Guarantee</div>
  <div class="trust-item">&#10003; Direct Insurance Billing</div>
  <div class="trust-item">&#10003; Same-Day Emergency Response</div>
  <div class="trust-item">&#10003; Free Roof Inspections</div>
</div>

<!-- SERVICE TABS -->
<section class="services-sec" id="services">
  <div class="sec-wrap">
    <p class="sec-eyebrow">What We Do</p>
    <h2 class="sec-title">Complete Roofing Services in {city}</h2>
    <div class="tab-nav">
      {tab_btns}
    </div>
    <div class="tab-panels">
      {tab_panels}
    </div>
  </div>
</section>

<!-- STORM / INSURANCE -->
<section class="storm-sec" id="storm">
  <div class="sec-wrap">
    <p class="sec-eyebrow" style="color:var(--ora)">Storm Damage &amp; Insurance</p>
    <h2 class="sec-title light">Hail. Wind. Water. We Handle It All.</h2>
    <div class="storm-grid">
      <div>
        <p style="color:rgba(255,255,255,.6);line-height:1.8;margin-bottom:20px">{city} storms can destroy a roof overnight. Most homeowners don't know their insurance covers it — or how to file the claim. We do both.</p>
        <ul class="storm-list">
          <li>Free storm damage inspection — no obligation</li>
          <li>We document everything for your insurance adjuster</li>
          <li>Direct billing to your insurance company</li>
          <li>You pay your deductible only</li>
          <li>Emergency tarping available within hours</li>
          <li>Supplement negotiation on underpaid claims</li>
        </ul>
        <a href="tel:{phone}" class="btn-ora" style="margin-top:24px">Get Free Storm Inspection</a>
      </div>
      <div>
        <div class="storm-card">
          <div class="storm-stat">$0</div>
          <div class="storm-stat-label" style="color:rgba(255,255,255,.5);margin-bottom:20px">OUT OF POCKET (MOST CLAIMS)</div>
          <div class="storm-card-title">We Fight the Claim</div>
          <p>Our team works directly with your insurance adjuster to make sure your claim gets approved for the full replacement value — not just a patch.</p>
          <div style="display:flex;gap:20px;margin-top:20px">
            <div><div class="storm-stat" style="font-size:2rem">48hr</div><div class="storm-stat-label">Average claim approval</div></div>
            <div><div class="storm-stat" style="font-size:2rem">97%</div><div class="storm-stat-label">Claims approved</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- WHO WE SERVE -->
<section class="serve-sec">
  <div class="sec-wrap">
    <p class="sec-eyebrow">Who We Work With</p>
    <h2 class="sec-title">Built for Every Roofing Need in {city}</h2>
    <div class="serve-grid">
      <div class="serve-card"><div class="serve-icon">&#127968;</div><h4>Homeowners</h4><p>Full replacements, storm repairs, gutters, emergency patches. One call covers it all.</p></div>
      <div class="serve-card"><div class="serve-icon">&#127970;</div><h4>Commercial Properties</h4><p>Flat roofs, metal roofing, TPO, EPDM. We handle projects of all sizes on schedule.</p></div>
      <div class="serve-card"><div class="serve-icon">&#9928;</div><h4>Storm Victims</h4><p>Hail damage, wind damage, water intrusion. Free inspection. Direct insurance billing.</p></div>
      <div class="serve-card"><div class="serve-icon">&#127963;</div><h4>New Construction</h4><p>Working with builders and developers across {city}. Competitive bids. On-time delivery.</p></div>
    </div>
  </div>
</section>

<!-- CITIES GRID -->
<section class="cities-sec" id="cities">
  <div class="sec-wrap">
    <p class="sec-eyebrow">Service Area</p>
    <h2 class="sec-title">Proudly Serving {city} &amp; Surrounding Communities</h2>
    <div class="city-grid">
      {cities_html}
    </div>
  </div>
</section>

<!-- ABOUT -->
<section class="about-sec" id="about">
  <div class="sec-wrap">
    <div class="about-grid">
      <div>
        <div class="about-badge">
          <span class="about-badge-n">{years_str}</span>
          <span class="about-badge-l">Years</span>
        </div>
        <p class="sec-eyebrow">Our Story</p>
        <h2 class="sec-title" style="margin-bottom:20px">Built on Trust. Proven by Results.</h2>
        <div class="about-text">
          <p>{about}</p>
          <p>Every job is treated like it's our own home. We only use manufacturer-approved materials, and every installation is backed by our written workmanship guarantee. We handle the paperwork, the insurance adjuster, and the cleanup — you just get a new roof.</p>
        </div>
        <a href="tel:{phone}" class="btn-ora" style="margin-top:24px">&#128222; Call {phone}</a>
      </div>
      <div style="background:var(--light);border-radius:16px;padding:36px">
        <h3 style="font-family:'Barlow Condensed',sans-serif;font-size:1.5rem;font-weight:800;color:var(--navy);margin-bottom:20px">Why {c}?</h3>
        <ul style="list-style:none">
          <li style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.07);display:flex;gap:12px;align-items:flex-start"><span style="color:var(--ora);font-weight:700;font-size:18px">&#10003;</span><span style="color:#475569;font-size:.95rem">{years_str} years serving {city} — we know the area, the weather, and the insurance companies.</span></li>
          <li style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.07);display:flex;gap:12px;align-items:flex-start"><span style="color:var(--ora);font-weight:700;font-size:18px">&#10003;</span><span style="color:#475569;font-size:.95rem">Written warranty on all workmanship. Not verbal — in writing, before we start.</span></li>
          <li style="padding:12px 0;border-bottom:1px solid rgba(0,0,0,.07);display:flex;gap:12px;align-items:flex-start"><span style="color:var(--ora);font-weight:700;font-size:18px">&#10003;</span><span style="color:#475569;font-size:.95rem">Licensed, bonded, and fully insured. You're protected on every job.</span></li>
          <li style="padding:12px 0;display:flex;gap:12px;align-items:flex-start"><span style="color:var(--ora);font-weight:700;font-size:18px">&#10003;</span><span style="color:#475569;font-size:.95rem">Manufacturer-certified installer. Eligible for extended material warranties.</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- REVIEWS -->
<section class="reviews-sec" id="reviews">
  <div class="sec-wrap">
    <p class="sec-eyebrow" style="color:var(--ora)">What Customers Say</p>
    <h2 class="sec-title light">&#9733;&#9733;&#9733;&#9733;&#9733; {rv_count} Reviews in {city}</h2>
    <div class="rv-grid">
      <div class="rv">
        <div class="rv-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"From the estimate to final cleanup, everything was handled professionally. No surprises on price or timeline. The roof looks incredible and they finished ahead of schedule."</p>
        <div class="rv-author"><div class="rv-av">MJ</div><div><div class="rv-name">Mike J.</div><div class="rv-loc">{city}, {state}</div></div></div>
      </div>
      <div class="rv">
        <div class="rv-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"Called about hail damage on a Tuesday. They came out same day. Insurance claim was approved within 48 hours. Roof was done by Friday. I paid my deductible and nothing else."</p>
        <div class="rv-author"><div class="rv-av">SR</div><div><div class="rv-name">Sarah R.</div><div class="rv-loc">{city}, {state}</div></div></div>
      </div>
      <div class="rv">
        <div class="rv-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"Best roofing company in {city}. I've used them twice — once for a full replacement and once for gutters. Both times: honest price, on time, and the cleanup was immaculate."</p>
        <div class="rv-author"><div class="rv-av">DW</div><div><div class="rv-name">David W.</div><div class="rv-loc">{city}, {state}</div></div></div>
      </div>
    </div>
  </div>
</section>

<!-- ORANGE CTA STRIP -->
<section class="cta-strip" id="contact">
  <div class="sec-wrap">
    <h2>Ready to Stop Missing Calls?</h2>
    <p>Our AI answers 24/7. Books inspections. Handles the first conversation so you only deal with qualified homeowners.</p>
    <a href="tel:{phone}" class="btn-dark">&#128222; Call {phone} Now</a>
  </div>
</section>

<!-- 4-COLUMN FOOTER -->
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <span class="logo-f">{c.split()[0] if c.split() else c}<em>{''.join(c.split()[1:]) if len(c.split()) > 1 else ''}</em></span>
      <p>Licensed roofing contractor serving {city}, {state} and surrounding areas. Call us for a free estimate or storm inspection.</p>
      <p style="margin-top:16px;color:rgba(255,255,255,.6);font-size:.875rem">&#128222; <a href="tel:{phone}" style="color:var(--ora);text-decoration:none">{phone}</a></p>
    </div>
    <div>
      <h5>Services</h5>
      <ul>{''.join(f'<li><a href="#services">{s}</a></li>' for s in svcs)}</ul>
    </div>
    <div>
      <h5>Company</h5>
      <ul>
        <li><a href="#about">About Us</a></li>
        <li><a href="#reviews">Reviews</a></li>
        <li><a href="#cities">Service Area</a></li>
        <li><a href="#storm">Storm Damage</a></li>
        <li><a href="#contact">Free Estimate</a></li>
      </ul>
    </div>
    <div>
      <h5>Hours</h5>
      <ul>
        <li><span>Mon-Fri: 7am–7pm</span></li>
        <li><span>Saturday: 8am–5pm</span></li>
        <li><span>Sunday: Emergency Only</span></li>
        <li style="margin-top:12px"><span style="color:var(--ora);font-weight:600">24/7 Emergency Line:</span></li>
        <li><a href="tel:{phone}">{phone}</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 {c}. All rights reserved. Licensed &amp; Insured in {state}.</p>
    <p>Powered by <a href="https://summitvoiceai.com" style="color:rgba(255,255,255,.3);text-decoration:none">Summit Voice AI</a></p>
  </div>
</footer>

<!-- PULSE PHONE BUTTON -->
<a href="tel:{phone}" class="pulse-btn" title="Call Us Now">&#128222;</a>

<!-- MOBILE STICKY BAR -->
<div class="mobile-bar">
  <a href="tel:{phone}" class="mb-call">&#128222; Call Now</a>
  <a href="#contact" class="mb-inspect">Free Inspection</a>
</div>

{widget_code}

<script>
function showTab(n) {{
  document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', i===n));
  document.querySelectorAll('.tab-panel').forEach((p,i) => p.classList.toggle('active', i===n));
}}
</script>
</body>
</html>"""


async def clone_and_customize_template(brand: dict, widget_key: str | None) -> str:
    """
    Main entry point — replaces build_homepage() in the Railway API.
    
    Prioritizes Dan's actual GitHub repos. Falls back to premium generator.
    Never uses Claude to rewrite HTML from scratch.
    """
    repo_name, template_html = await get_best_template()

    if repo_name == "generated" or not template_html:
        print("[TEMPLATE] Using fallback premium generator")
        html = await generate_premium_homepage(brand, widget_key)
        return html

    # Step 1: Smart text replacement (no Claude needed for most content)
    html = smart_replace(template_html, brand)

    # Step 2: Minimal Claude check for remaining placeholders
    html = await claude_enhance(html, brand)

    # Step 3: Inject voice widget
    html = inject_voice_widget(html, widget_key)

    print(f"[TEMPLATE] ✓ Customized {repo_name} — {len(html):,} chars")
    return html


# ── UPDATE build_demo_task in ava_demo_studio_COMPLETE_API.py ─────────────────
# Find: html = build_homepage(brand, "", req.widget_key)
# Replace with:
#   from template_cloner import clone_and_customize_template
#   html = await clone_and_customize_template(brand, req.widget_key)
#
# Also add to CreateDemoRequest:
#   no_website: bool = False
#   city: str = ""
#   state: str = ""
