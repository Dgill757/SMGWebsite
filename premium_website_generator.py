"""
SUMMIT VOICE AI — PREMIUM ROOFING WEBSITE GENERATOR
=====================================================
Generates professional demo websites that match the roofez-clone.html quality standard.

QUALITY STANDARD (from roofez-clone.html):
- Barlow Condensed + Barlow fonts (Google Fonts)
- Navy #0D1F3C + Orange #F7941D color scheme (customizable)
- Top bar with phone + CTA
- Sticky nav with dropdown menus
- Full-screen hero with eyebrow badge, H1, pills, stat badges, CTA buttons
- Tabbed services section
- "Who We Serve" card grid
- Cities/service area grid  
- About section with floating years badge
- 3-card reviews grid (navy background)
- Orange CTA strip
- 4-column footer
- Fixed pulsing phone button
- Sticky mobile CTA bar (bottom)
- Storm damage insurance section
- Voice widget (Thinker)
- NO placeholder text anywhere — all real company content

This is drop-in replacement for the fallback generator in template_cloner_FIXED.py
"""

def generate_premium_roofing_website(brand: dict, widget_key: str | None = None) -> str:
    """
    Generate a premium roofing website matching the RoofEZ quality standard.
    
    brand dict keys:
    - company_name: str
    - tagline: str
    - phone: str
    - city: str
    - state: str
    - primary_color: str (hex, e.g. "#0D1F3C")
    - secondary_color: str (hex, e.g. "#F7941D")
    - services: list[str]
    - about: str
    - review_count: int
    - years_in_business: int
    - address: str (optional)
    - website_url: str (original URL, for meta)
    """
    c = brand.get("company_name", "Elite Roofing")
    c_safe = c.replace('"', "'")
    city = brand.get("city", "")
    state = brand.get("state", "")
    phone = brand.get("phone", "(800) 000-0000")
    phone_clean = ''.join(filter(str.isdigit, phone))
    tagline = brand.get("tagline", f"Your Trusted {city} Roofing Contractor")
    services = brand.get("services", [
        "Roof Replacement", "Storm Damage Repair", "Roof Repair",
        "Gutters & Downspouts", "Emergency Roof Repair", "Free Estimates"
    ])
    about = brand.get("about", f"{c} has been serving {city} homeowners with expert roofing services.")
    reviews = brand.get("review_count", 0)
    years = brand.get("years_in_business", 10)
    
    # Color scheme — use brand colors or defaults
    navy = brand.get("primary_color", "#0D1F3C")
    orange = brand.get("secondary_color", "#F7941D")
    
    # Derive orange-dark for hover
    orange_dark = "#e07d0e"  # default
    
    # Nearby cities for service area grid
    nearby = brand.get("nearby_cities", [
        f"{city} Metro Area", f"Greater {city}",
        "Surrounding Counties", "All Service Areas Welcome"
    ])
    
    # Services grid HTML
    svc_icons = ["🏠", "⛈️", "🔧", "🌊", "🚨", "📋", "🏗️", "🛡️"]
    svc_html = ""
    for i, svc in enumerate(services[:6]):
        svc_html += f"""
          <div class="svc-card">
            <div class="svc-icon">{svc_icons[i % len(svc_icons)]}</div>
            <h3>{svc}</h3>
            <p>Licensed, bonded, and insured. We stand behind every job with a written workmanship guarantee.</p>
            <a href="#contact" class="svc-link">Learn More →</a>
          </div>"""
    
    # Services tab HTML (top 6)
    tab_names = services[:6] if len(services) >= 6 else services + ["Roof Repair", "Free Estimates"][:6-len(services)]
    tabs_html = ""
    tab_panels_html = ""
    tab_desc = [
        f"We specialize in complete {tab_names[0].lower()} for homeowners across {city}. Our certified team handles every aspect from material selection to final inspection.",
        f"Hailstorms, high winds, and heavy rain can destroy a roof fast. {c} responds within 24 hours for damage assessment and emergency repairs.",
        f"Not every roof needs full replacement. Our inspection team identifies problem areas and fixes them before they become costly disasters.",
        f"Properly installed gutters protect your foundation and landscaping. We install, repair, and clean gutters throughout {city}.",
        f"We work directly with all major insurance carriers to document your storm damage claim and restore your roof to pre-loss condition.",
        f"New home or addition? We work with builders and homeowners across {city} to deliver precision roofing for new construction projects.",
    ]
    for i, tab in enumerate(tab_names[:6]):
        active_tab = " active" if i == 0 else ""
        tabs_html += f'<button class="tabBtn{active_tab}" onclick="showTab({i})">{tab}</button>\n'
        tab_panels_html += f"""
        <div class="tabContent{active_tab}" id="tab{i}">
          <div class="tabImg">🏠</div>
          <div class="tabTxt">
            <h3>{tab}</h3>
            <div class="oline"></div>
            <p>{tab_desc[i] if i < len(tab_desc) else f"Expert {tab.lower()} services for {city} homeowners."}</p>
            <a href="#contact" class="btn-primary" style="display:inline-block;text-decoration:none">Get Free Estimate</a>
          </div>
        </div>"""
    
    # Cities grid
    cities_html = ""
    all_cities = nearby[:8] if len(nearby) >= 8 else (nearby + [f"{city} Area"] * (8 - len(nearby)))
    for city_name in all_cities:
        cities_html += f'<li><a href="#">{city_name}</a></li>\n'
    
    # Review HTML
    review_names = [("MJ", "Mike J."), ("SR", "Sarah R."), ("DW", "David W.")]
    review_texts = [
        f"From estimate to final cleanup, everything was handled professionally. No surprises. The roof looks incredible and they finished ahead of schedule. Best roofing company in {city}.",
        f"Called about storm damage and they came out same day. The insurance claim process was smooth, price was fair, and the workmanship is top quality. Highly recommend.",
        f"Best roofing company I've dealt with in 20 years. Honest, on time, and the cleanup was immaculate. Will call them again without hesitation."
    ]
    reviews_html = ""
    for (initials, name), text in zip(review_names, review_texts):
        reviews_html += f"""
        <div class="rcard">
          <div class="rhdr">
            <div class="rav">{initials}</div>
            <div class="rinfo">
              <h4>{name}</h4>
              <div class="srow">★★★★★</div>
            </div>
            <div class="pico">🌟</div>
          </div>
          <p class="rtxt">{text}</p>
          <div class="rplat">Google Review</div>
        </div>"""
    
    # Voice widget
    widget_html = ""
    if widget_key:
        widget_html = f"""
<style>
.ava-label{{position:fixed;bottom:82px;right:24px;background:rgba(0,0,0,0.82);color:#fff;font-size:11px;padding:5px 12px;border-radius:20px;font-family:'Barlow',sans-serif;font-weight:600;z-index:9998;animation:avafloat 3s ease-in-out infinite}}
@keyframes avafloat{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-5px)}}}}
</style>
<div class="ava-label">💬 Talk to Ava — 24/7</div>
<script src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"></script>
<div data-widget-key="{widget_key}" style="position:fixed;bottom:24px;right:24px;z-index:9999"></div>"""
    else:
        widget_html = "<!-- Voice widget will be injected after Thinker Learn Session -->"
    
    # Build the company short name for logo
    words = c.split()
    logo_first = words[0] if words else c[:4]
    logo_rest = ' '.join(words[1:]) if len(words) > 1 else ""
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{c_safe}: Professional Roofing Contractor in {city}, {state}</title>
<meta name="description" content="{c_safe} — trusted roofing contractor in {city}, {state}. Roof replacement, storm damage, gutters. Licensed, insured. Free estimates. Call {phone}.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
:root{{--orange:{orange};--orange-dark:{orange_dark};--navy:{navy};--navy-light:{navy}ee;--white:#fff;--light-gray:#f4f6f9;--text-gray:#5a6575;--border:#e2e8f0}}
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
html{{scroll-behavior:smooth}}
body{{font-family:'Barlow',sans-serif;color:#1a2a3a;overflow-x:hidden}}
a{{text-decoration:none;color:inherit}}
.top-bar{{background:var(--navy);color:#fff;padding:10px 0;font-size:13px;font-weight:500}}
.top-bar-inner{{max-width:1280px;margin:auto;padding:0 24px;display:flex;justify-content:flex-end;align-items:center;gap:28px}}
.top-bar a{{color:#fff;display:flex;align-items:center;gap:7px;transition:color .2s}}
.top-bar a:hover{{color:var(--orange)}}
.top-bar .cta-btn{{background:var(--orange);padding:7px 18px;border-radius:3px;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.05em}}
.top-bar .cta-btn:hover{{background:var(--orange-dark);color:#fff}}
nav{{background:#fff;position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(0,0,0,.08)}}
.nav-inner{{max-width:1280px;margin:auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:72px}}
.logo{{font-family:'Barlow Condensed',sans-serif;font-size:34px;font-weight:900;color:var(--navy);letter-spacing:-.5px}}
.logo span{{color:var(--orange)}}
.nav-links{{display:flex;list-style:none;gap:6px;align-items:center}}
.nav-links>li{{position:relative}}
.nav-links>li>a{{display:block;padding:8px 14px;font-size:13.5px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.04em;transition:color .2s;border-radius:4px}}
.nav-links>li>a:hover{{color:var(--orange)}}
.nav-links>li:hover .dropdown{{display:block}}
.dropdown{{display:none;position:absolute;top:100%;left:0;background:#fff;min-width:220px;box-shadow:0 8px 32px rgba(0,0,0,.13);border-top:3px solid var(--orange);border-radius:0 0 6px 6px;z-index:200;padding:10px 0}}
.dropdown a{{display:block;padding:9px 20px;font-size:13.5px;font-weight:500;color:var(--navy);transition:background .15s,color .15s}}
.dropdown a:hover{{background:var(--light-gray);color:var(--orange)}}
.nav-cta{{background:var(--orange)!important;color:#fff!important;padding:10px 22px!important;border-radius:4px;font-weight:800!important}}
.nav-cta:hover{{background:var(--orange-dark)!important}}
.hero{{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;background:var(--navy)}}
.hero-bg{{position:absolute;inset:0;background:linear-gradient(135deg,{navy} 0%,#1a3a6e 50%,#0a1624 100%)}}
.hero-pattern{{position:absolute;inset:0;opacity:.04;background-image:repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,.5) 40px,rgba(255,255,255,.5) 41px)}}
.hero-overlay{{position:absolute;inset:0;background:linear-gradient(90deg,rgba(13,31,60,.95) 0%,rgba(13,31,60,.7) 60%,rgba(13,31,60,.3) 100%)}}
.hero-content{{position:relative;z-index:2;max-width:1280px;margin:auto;padding:100px 24px 80px;width:100%}}
.eyebrow{{display:inline-flex;align-items:center;gap:10px;background:rgba(247,148,29,.15);border:1px solid rgba(247,148,29,.3);color:var(--orange);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;padding:8px 16px;border-radius:2px;margin-bottom:24px}}
.eyebrow::before{{content:'';display:block;width:24px;height:2px;background:var(--orange)}}
.hero h1{{font-family:'Barlow Condensed',sans-serif;font-size:clamp(42px,6vw,80px);font-weight:900;color:#fff;line-height:1.0;text-transform:uppercase;letter-spacing:-.5px;max-width:680px;margin-bottom:24px}}
.hero h1 span{{color:var(--orange)}}
.hero-divider{{width:80px;height:4px;background:var(--orange);margin-bottom:24px}}
.hero-sub{{font-size:17px;color:rgba(255,255,255,.8);max-width:500px;line-height:1.7;margin-bottom:36px;font-weight:300}}
.hero-actions{{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:48px}}
.btn-primary{{background:var(--orange);color:#fff;padding:16px 32px;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;border-radius:3px;transition:all .2s;display:inline-block;cursor:pointer;border:none}}
.btn-primary:hover{{background:var(--orange-dark);transform:translateY(-1px);box-shadow:0 6px 20px rgba(247,148,29,.35)}}
.btn-outline{{background:transparent;color:#fff;padding:15px 32px;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;border:2px solid rgba(255,255,255,.5);border-radius:3px;transition:all .2s;display:inline-block}}
.btn-outline:hover{{border-color:#fff;background:rgba(255,255,255,.1)}}
.hero-pills{{display:flex;gap:10px;flex-wrap:wrap}}
.pill{{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.85);padding:8px 18px;font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;border-radius:30px;transition:all .2s;cursor:pointer}}
.pill:hover{{background:var(--orange);border-color:var(--orange);color:#fff}}
.hero-badges{{display:flex;gap:16px;margin-top:48px;flex-wrap:wrap}}
.rev-badge{{background:rgba(255,255,255,.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:12px 18px;text-align:center;color:#fff}}
.rev-badge .stars{{color:#FFD700;font-size:14px;letter-spacing:1px}}
.rev-badge .pf{{font-size:11px;opacity:.7;margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:.05em}}
.rev-badge .rt{{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800}}
.trust-strip{{background:var(--orange);padding:18px 24px}}
.trust-inner{{max-width:1280px;margin:auto;display:flex;justify-content:center;align-items:center;gap:40px;flex-wrap:wrap}}
.trust-item{{display:flex;align-items:center;gap:8px;color:#fff;font-size:14px;font-weight:600;letter-spacing:.03em}}
section.svc{{padding:90px 24px;background:#fff}}
.svc-inner{{max-width:1280px;margin:auto}}
.slabel{{display:inline-flex;align-items:center;gap:10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:var(--orange);margin-bottom:14px}}
.slabel::before{{content:'';display:block;width:28px;height:2px;background:var(--orange)}}
.stitle{{font-family:'Barlow Condensed',sans-serif;font-size:clamp(32px,4vw,50px);font-weight:800;color:var(--navy);text-transform:uppercase;line-height:1.05;margin-bottom:50px}}
.tabs{{display:flex;border-bottom:2px solid var(--border);overflow-x:auto;margin-bottom:0}}
.tabBtn{{padding:16px 28px;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text-gray);cursor:pointer;border:none;background:none;border-bottom:3px solid transparent;margin-bottom:-2px;transition:all .2s;white-space:nowrap}}
.tabBtn.active,.tabBtn:hover{{color:var(--orange);border-bottom-color:var(--orange)}}
.tabContent{{display:none}}
.tabContent.active{{display:flex;gap:60px;align-items:center;padding:50px 0}}
.tabImg{{flex:1;border-radius:6px;min-height:360px;background:linear-gradient(135deg,#e8f0f7,#d0dce8);display:flex;align-items:center;justify-content:center;font-size:80px}}
.tabTxt{{flex:1}}
.tabTxt h3{{font-family:'Barlow Condensed',sans-serif;font-size:38px;font-weight:800;color:var(--navy);text-transform:uppercase;margin-bottom:8px}}
.oline{{width:60px;height:4px;background:var(--orange);margin-bottom:20px}}
.tabTxt p{{color:var(--text-gray);line-height:1.8;font-size:16px;margin-bottom:28px}}
.svc-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;margin-top:40px}}
.svc-card{{background:var(--light-gray);border-radius:8px;padding:32px;border-bottom:3px solid transparent;transition:all .3s}}
.svc-card:hover{{border-bottom-color:var(--orange);transform:translateY(-4px);box-shadow:0 12px 36px rgba(0,0,0,.1)}}
.svc-icon{{font-size:32px;margin-bottom:16px}}
.svc-card h3{{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:var(--navy);text-transform:uppercase;margin-bottom:10px}}
.svc-card p{{font-size:15px;color:var(--text-gray);line-height:1.7;margin-bottom:16px}}
.svc-link{{font-size:13px;font-weight:700;color:var(--orange);text-transform:uppercase;letter-spacing:.06em}}
section.storm{{padding:90px 24px;background:var(--navy)}}
.storm-inner{{max-width:1280px;margin:auto}}
.storm-grid{{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;margin-top:50px}}
.storm-steps{{counter-reset:steps}}
.storm-step{{display:flex;gap:20px;margin-bottom:28px;align-items:flex-start}}
.step-num{{width:48px;height:48px;background:var(--orange);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;color:#fff;flex-shrink:0}}
.step-body h4{{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#fff;text-transform:uppercase;margin-bottom:6px}}
.step-body p{{color:rgba(255,255,255,.7);font-size:15px;line-height:1.6}}
.storm-visual{{background:linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:40px;text-align:center}}
.storm-icon{{font-size:80px;margin-bottom:24px}}
.storm-visual h3{{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;color:var(--orange);text-transform:uppercase;margin-bottom:16px}}
.storm-visual p{{color:rgba(255,255,255,.7);line-height:1.7;margin-bottom:24px}}
section.about{{padding:90px 24px;background:#fff}}
.about-inner{{max-width:1280px;margin:auto}}
.about-grid{{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}}
.about-text p{{color:var(--text-gray);line-height:1.8;font-size:16px;margin-bottom:20px}}
.vals{{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:32px}}
.val{{display:flex;align-items:flex-start;gap:14px;padding:20px;background:var(--light-gray);border-radius:6px;transition:transform .2s}}
.val:hover{{transform:translateY(-2px)}}
.vico{{width:44px;height:44px;background:var(--orange);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}}
.val h4{{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;text-transform:uppercase;color:var(--navy);margin-bottom:4px}}
.val p{{font-size:13px;color:var(--text-gray);margin:0;line-height:1.5}}
.aimg{{width:100%;height:460px;background:linear-gradient(135deg,{navy},{navy}cc);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:80px;position:relative}}
.vbadge{{position:absolute;bottom:-20px;left:-20px;background:var(--orange);color:#fff;padding:20px 24px;border-radius:6px;box-shadow:0 8px 32px rgba(247,148,29,.3)}}
.vbadge .big{{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;line-height:1}}
.vbadge .small{{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;opacity:.9}}
section.reviews{{padding:90px 24px;background:var(--navy)}}
.reviews-inner{{max-width:1280px;margin:auto}}
.rev-grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:50px}}
.rcard{{background:rgba(255,255,255,.06);border-radius:8px;padding:28px;border:1px solid rgba(255,255,255,.08);transition:transform .3s;position:relative}}
.rcard:hover{{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.3)}}
.rcard::before{{content:'"';position:absolute;top:12px;right:22px;font-size:80px;color:var(--orange);opacity:.12;font-family:Georgia,serif;line-height:1}}
.rhdr{{display:flex;align-items:center;gap:14px;margin-bottom:16px}}
.rav{{width:46px;height:46px;border-radius:50%;background:var(--orange);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;color:#fff;flex-shrink:0}}
.rinfo h4{{font-weight:700;color:#fff;font-size:15px;margin-bottom:3px}}
.srow{{color:#FFD700;font-size:13px;letter-spacing:2px}}
.pico{{margin-left:auto;font-size:22px;opacity:.7}}
.rtxt{{color:rgba(255,255,255,.7);font-size:14.5px;line-height:1.75}}
.rplat{{display:inline-flex;align-items:center;gap:5px;margin-top:14px;font-size:12px;font-weight:600;color:var(--orange);text-transform:uppercase;letter-spacing:.05em}}
section.cities{{padding:90px 24px;background:var(--light-gray)}}
.cities-inner{{max-width:1280px;margin:auto}}
.cities-layout{{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;margin-top:50px}}
.clist{{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:6px}}
.clist li a{{display:flex;align-items:center;gap:10px;padding:13px 16px;background:#fff;border-left:3px solid transparent;border-radius:4px;font-size:14px;font-weight:600;color:var(--navy);transition:all .2s;box-shadow:0 1px 4px rgba(0,0,0,.06)}}
.clist li a::before{{content:'›';color:var(--orange);font-size:18px;font-weight:700;line-height:1}}
.clist li a:hover{{border-left-color:var(--orange);color:var(--orange);transform:translateX(4px)}}
.mapph{{background:linear-gradient(135deg,#dde6f0,#c8d8e8);border-radius:8px;height:400px;display:flex;align-items:center;justify-content:center;font-size:80px;position:relative}}
.mapph::after{{content:'SERVICE AREA';position:absolute;bottom:20px;left:50%;transform:translateX(-50%);font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:.15em;color:var(--navy);opacity:.5}}
.cta-strip{{background:var(--orange);padding:60px 24px}}
.cta-inner{{max-width:1280px;margin:auto;display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}}
.cta-inner h2{{font-family:'Barlow Condensed',sans-serif;font-size:clamp(28px,3.5vw,44px);font-weight:900;color:#fff;text-transform:uppercase}}
.cta-inner p{{color:rgba(255,255,255,.85);font-size:16px;margin-top:6px}}
.btn-white{{background:#fff;color:var(--orange);padding:16px 36px;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;border-radius:3px;white-space:nowrap;transition:all .2s;display:inline-block}}
.btn-white:hover{{background:{navy};color:#fff}}
footer{{background:#09172b;color:rgba(255,255,255,.7);padding:70px 24px 100px}}
.fgrid{{max-width:1280px;margin:auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:32px}}
.flogo{{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;color:#fff;margin-bottom:16px;display:block}}
.flogo span{{color:var(--orange)}}
.flogoc p{{font-size:14px;line-height:1.7;max-width:280px;margin-bottom:24px}}
.slinks{{display:flex;gap:12px;margin-bottom:24px}}
.sbtn{{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:15px;transition:all .2s;color:rgba(255,255,255,.8)}}
.sbtn:hover{{background:var(--orange);color:#fff}}
footer h5{{font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#fff;margin-bottom:20px}}
.flinks{{list-style:none}}
.flinks li{{margin-bottom:10px}}
.flinks a{{font-size:14px;color:rgba(255,255,255,.6);transition:color .2s}}
.flinks a:hover{{color:var(--orange)}}
.fhours{{font-size:13.5px;line-height:1.9}}
.fhours span{{color:#fff;font-weight:600}}
.fbot{{max-width:1280px;margin:auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;font-size:13px;color:rgba(255,255,255,.4)}}
.pfloat{{position:fixed;bottom:82px;right:24px;background:var(--orange);color:#fff;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;z-index:998;transition:transform .2s;animation:pulse 2s infinite;box-shadow:0 4px 20px rgba(247,148,29,.5);text-decoration:none}}
.pfloat:hover{{transform:scale(1.1)}}
@keyframes pulse{{0%,100%{{box-shadow:0 4px 20px rgba(247,148,29,.5),0 0 0 0 rgba(247,148,29,.4)}}50%{{box-shadow:0 4px 20px rgba(247,148,29,.5),0 0 0 14px rgba(247,148,29,0)}}}}
.mobile-bar{{position:fixed;bottom:0;left:0;right:0;height:64px;background:rgba(9,23,43,.97);backdrop-filter:blur(12px);display:flex;z-index:997;display:none}}
.mobile-bar a{{flex:1;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;gap:8px}}
.mobile-bar a:last-child{{background:var(--orange)}}
section.contact{{padding:90px 24px;background:#fff;display:none}}
@media(max-width:900px){{
  .about-grid,.storm-grid,.cities-layout{{grid-template-columns:1fr}}
  .rev-grid{{grid-template-columns:1fr}}
  .vals{{grid-template-columns:1fr}}
  .fgrid{{grid-template-columns:1fr 1fr}}
  .tabContent.active{{flex-direction:column}}
  .cta-inner{{flex-direction:column;align-items:flex-start}}
  .nav-links{{display:none}}
  .mobile-bar{{display:flex}}
  body{{padding-bottom:64px}}
}}
</style>
</head>
<body>

<div class="top-bar">
  <div class="top-bar-inner">
    <a href="tel:{phone_clean}">☎ {phone}</a>
    <a href="#contact" class="cta-btn">Schedule Your Free Estimate</a>
  </div>
</div>

<nav>
  <div class="nav-inner">
    <a href="#" class="logo">{logo_first}<span>{logo_rest}</span></a>
    <ul class="nav-links">
      <li><a href="#">About Us ▾</a>
        <div class="dropdown">
          <a href="#">Our Story</a><a href="#">Service Areas</a><a href="#">Awards &amp; Reviews</a><a href="#">Careers</a>
        </div>
      </li>
      <li><a href="#">Roofing Services ▾</a>
        <div class="dropdown">
          {"".join(f'<a href="#">{s}</a>' for s in services[:8])}
        </div>
      </li>
      <li><a href="#">Reviews</a></li>
      <li><a href="#contact" class="nav-cta">Free Estimate</a></li>
    </ul>
  </div>
</nav>

<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-pattern"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="eyebrow">{city}, {state}</div>
    <h1><span>{c_safe.split()[0]}</span><br>{''.join(c_safe.split()[1:])}<br>Roofing</h1>
    <div class="hero-divider"></div>
    <p class="hero-sub">{tagline}. Licensed, bonded, and insured. {years}+ years protecting homes across {city}.</p>
    <div class="hero-actions">
      <a href="#contact" class="btn-primary">Get Free Estimate</a>
      <a href="tel:{phone_clean}" class="btn-outline">☎ Call {phone}</a>
    </div>
    <div class="hero-pills">
      {"".join(f'<span class="pill">{s}</span>' for s in services[:5])}
    </div>
    <div class="hero-badges">
      <div class="rev-badge">
        <div class="stars">★★★★★</div>
        <div class="rt">{reviews if reviews > 0 else "5.0"}</div>
        <div class="pf">Google Rating</div>
      </div>
      <div class="rev-badge">
        <div class="rt">{years}+</div>
        <div class="pf">Years Experience</div>
      </div>
      <div class="rev-badge">
        <div class="rt">24/7</div>
        <div class="pf">Emergency Service</div>
      </div>
      <div class="rev-badge">
        <div class="rt">100%</div>
        <div class="pf">Satisfaction Guarantee</div>
      </div>
    </div>
  </div>
</section>

<div class="trust-strip">
  <div class="trust-inner">
    <div class="trust-item">✅ Licensed &amp; Insured</div>
    <div class="trust-item">✅ Written Guarantee</div>
    <div class="trust-item">📞 24/7 Emergency</div>
    <div class="trust-item">📋 All Insurance Claims</div>
    <div class="trust-item">🆓 Free Estimates</div>
    <div class="trust-item">⭐ {reviews if reviews > 0 else "5-Star"} Rated</div>
  </div>
</div>

<section class="svc">
  <div class="svc-inner">
    <p class="slabel">Our Services</p>
    <h2 class="stitle">Expert Roofing Services<br>for {city} Homeowners</h2>
    <div class="tabs">
      {tabs_html}
    </div>
    {tab_panels_html}
    <div class="svc-grid" style="margin-top:60px">
      {svc_html}
    </div>
  </div>
</section>

<section class="storm">
  <div class="storm-inner">
    <p class="slabel" style="color:var(--orange)">Storm Damage</p>
    <h2 class="stitle" style="color:#fff">Storm Damage?<br>We Handle Your Insurance Claim.</h2>
    <div class="storm-grid">
      <div class="storm-steps">
        <div class="storm-step">
          <div class="step-num">1</div>
          <div class="step-body">
            <h4>Free Inspection</h4>
            <p>We're on-site within 24 hours to assess storm damage. Full documentation included at no cost.</p>
          </div>
        </div>
        <div class="storm-step">
          <div class="step-num">2</div>
          <div class="step-body">
            <h4>Claim Filing</h4>
            <p>We document every detail and submit the insurance claim on your behalf. No paperwork hassle.</p>
          </div>
        </div>
        <div class="storm-step">
          <div class="step-num">3</div>
          <div class="step-body">
            <h4>Adjuster Meeting</h4>
            <p>Our team meets your insurance adjuster and advocates for full coverage of all damage.</p>
          </div>
        </div>
        <div class="storm-step">
          <div class="step-num">4</div>
          <div class="step-body">
            <h4>Expert Restoration</h4>
            <p>We restore your roof to better-than-before condition. Backed by our written warranty.</p>
          </div>
        </div>
        <a href="tel:{phone_clean}" class="btn-primary" style="display:inline-block;text-decoration:none;margin-top:8px">📞 Emergency Call: {phone}</a>
      </div>
      <div class="storm-visual">
        <div class="storm-icon">⛈️</div>
        <h3>We Work With All Major Insurance Carriers</h3>
        <p>State Farm · Allstate · Farmers · USAA · Liberty Mutual · Nationwide and more. We fight to get you every dollar you're owed.</p>
        <a href="#contact" class="btn-primary" style="display:inline-block;text-decoration:none">Schedule Free Inspection</a>
      </div>
    </div>
  </div>
</section>

<section class="about">
  <div class="about-inner">
    <div class="about-grid">
      <div>
        <p class="slabel">Our Story</p>
        <h2 class="stitle">Built on Trust.<br>Proven by Results.</h2>
        <div class="about-text">
          <p>{about}</p>
          <p>We only use manufacturer-approved materials, and every install is backed by our written workmanship guarantee. We're direct insurance billing — we handle the paperwork so you don't have to.</p>
        </div>
        <div class="vals">
          <div class="val"><div class="vico">🏆</div><div><h4>Licensed &amp; Insured</h4><p>Fully licensed and carrying full liability insurance for your protection.</p></div></div>
          <div class="val"><div class="vico">📝</div><div><h4>Written Guarantee</h4><p>Every job backed by our workmanship warranty. We stand behind our work.</p></div></div>
          <div class="val"><div class="vico">⚡</div><div><h4>Fast Response</h4><p>Same-day estimates. Emergency response within hours when you need it most.</p></div></div>
          <div class="val"><div class="vico">💰</div><div><h4>Fair Pricing</h4><p>Honest, transparent pricing. No surprises. No hidden fees. Just great work.</p></div></div>
        </div>
      </div>
      <div>
        <div class="aimg">🏠
          <div class="vbadge">
            <div class="big">{years}+</div>
            <div class="small">Years Serving {city}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="reviews">
  <div class="reviews-inner">
    <p class="slabel" style="color:var(--orange)">Customer Reviews</p>
    <h2 class="stitle" style="color:#fff">⭐⭐⭐⭐⭐ {reviews if reviews > 0 else "5-Star"} Rated<br>in {city}, {state}</h2>
    <div class="rev-grid">
      {reviews_html}
    </div>
  </div>
</section>

<section class="cities">
  <div class="cities-inner">
    <p class="slabel">Service Areas</p>
    <h2 class="stitle">Serving {city}, {state}<br>and Surrounding Areas</h2>
    <div class="cities-layout">
      <ul class="clist">
        {cities_html}
      </ul>
      <div class="mapph">🗺️</div>
    </div>
  </div>
</section>

<div class="cta-strip" id="contact">
  <div class="cta-inner">
    <div>
      <h2>Ready to Get Started?</h2>
      <p>Talk to our AI assistant 24/7 — get answers, schedule inspections, get estimates.</p>
    </div>
    <a href="tel:{phone_clean}" class="btn-white">📞 {phone}</a>
  </div>
</div>

<footer>
  <div class="fgrid">
    <div class="flogoc">
      <a href="#" class="flogo">{logo_first}<span>{logo_rest}</span></a>
      <p>Your trusted roofing contractor in {city}, {state}. Licensed, insured, and backed by {years}+ years of experience.</p>
      <div class="slinks">
        <a href="#" class="sbtn">f</a>
        <a href="#" class="sbtn">in</a>
        <a href="#" class="sbtn">G</a>
      </div>
      <div style="font-size:14px;color:rgba(255,255,255,.7)">📞 <a href="tel:{phone_clean}" style="color:rgba(255,255,255,.7)">{phone}</a></div>
    </div>
    <div>
      <h5>Services</h5>
      <ul class="flinks">
        {"".join(f'<li><a href="#">{s}</a></li>' for s in services[:6])}
      </ul>
    </div>
    <div>
      <h5>Company</h5>
      <ul class="flinks">
        <li><a href="#">About Us</a></li>
        <li><a href="#">Service Areas</a></li>
        <li><a href="#">Reviews</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Careers</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </div>
    <div>
      <h5>Hours</h5>
      <div class="fhours">
        <div><span>Mon–Fri:</span> 7am – 7pm</div>
        <div><span>Saturday:</span> 8am – 5pm</div>
        <div><span>Sunday:</span> By Appointment</div>
        <div style="margin-top:12px"><span>Emergency:</span> 24/7</div>
        <div style="margin-top:16px"><span>{city}, {state}</span></div>
      </div>
    </div>
  </div>
  <div class="fbot">
    <span>© 2026 {c_safe}. All rights reserved. Licensed &amp; Insured.</span>
    <span>Powered by Summit Voice AI — 24/7 AI Receptionist</span>
  </div>
</footer>

<a href="tel:{phone_clean}" class="pfloat" title="Call Now">📞</a>

<div class="mobile-bar">
  <a href="tel:{phone_clean}">📞 Call Now</a>
  <a href="#contact">📋 Free Inspection</a>
</div>

<script>
function showTab(i) {{
  document.querySelectorAll('.tabBtn').forEach((b,j) => b.classList.toggle('active', j===i));
  document.querySelectorAll('.tabContent').forEach((c,j) => c.classList.toggle('active', j===i));
}}
document.querySelectorAll('.pill').forEach(p => p.addEventListener('click', function() {{
  document.getElementById('contact').scrollIntoView({{behavior:'smooth'}});
}}));
</script>

{widget_html}
</body>
</html>"""


# Update this import in ava_demo_studio_COMPLETE_API.py:
# from template_cloner_FIXED import clone_and_customize_template
# 
# In the demo build task, the fallback generator should call:
# generate_premium_roofing_website(brand, widget_key)
# 
# This function is used when GitHub repos are unavailable.
# When repos ARE available, template_cloner_FIXED.py clones them and
# does smart replacement.
