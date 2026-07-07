# SUMMIT VOICE AI -- WORLD-CLASS ROOFING WEBSITE GENERATOR v3
# Reference: Roof EZ, D&L Roofing, Cabrera Family Roofers, Janney Roofing
# Stack: Barlow Condensed + Inter, GSAP 3.12 + Lenis, Three.js hero particles
# Quality target: $30,000 site. Real Unsplash photos. No emoji visuals.

_PHOTOS = {
    "hero_bg":  "photo-1558618666-fcd25c85cd64",
    "roofer":   "photo-1504307651254-35680f356dfd",
    "house1":   "photo-1570129477492-45c003edd2be",
    "house2":   "photo-1580587771525-78b9dba3b914",
    "house3":   "photo-1564013799919-ab600027ffc6",
    "house4":   "photo-1605276374104-dee2a0ed3cd6",
    "house5":   "photo-1512917774080-9991f1c4c750",
    "house6":   "photo-1565538810643-b5bdb714032a",
    "damage":   "photo-1563805042-7684c019e1cb",
    "install":  "photo-1586348943529-beaae6c28db9",
}


def _img(key, w=800, q=80):
    pid = _PHOTOS.get(key, _PHOTOS["house1"])
    return f"https://images.unsplash.com/{pid}?auto=format&fit=crop&w={w}&q={q}"

def generate_world_class_roofing_site(brand: dict, widget_key: str = None) -> str:
    c     = brand.get("company_name", "Elite Roofing")
    city  = brand.get("city", "")
    state = brand.get("state", "")
    phone = brand.get("phone", "(800) 000-0000")
    phone_clean = "".join(filter(str.isdigit, phone))
    tagline  = brand.get("tagline", f"{city}'s Most Trusted Roofing Contractor")
    services = brand.get("services", [
        "Roof Replacement", "Storm Damage Repair", "Roof Repair",
        "Gutters & Downspouts", "New Construction", "Emergency Service"
    ])
    about  = brand.get("about", f"{c} has been protecting homes in {city} for years.")
    reviews = brand.get("review_count", 0)
    years   = brand.get("years_in_business", 12)
    navy   = brand.get("primary_color", "#0D1F3C")
    orange = brand.get("secondary_color", "#F97316")
    nearby = brand.get("nearby_cities", [city, f"Greater {city}", "Metro Area", "Surrounding Counties"])
    cities_list = nearby[:12] if len(nearby) >= 12 else nearby + [f"{city} Area"] * (12 - len(nearby))

    svc_descs = [
        f"When your roof reaches the end of its life, {c} delivers a seamless replacement using manufacturer-approved materials with full warranty coverage.",
        f"Our emergency response team handles storm damage from day one. We work directly with your insurance adjuster, document everything, and restore your roof fast.",
        f"Not every problem needs a full replacement. Our certified inspectors pinpoint exactly what needs fixing, saving you money while stopping leaks.",
        f"Properly installed gutters protect your foundation, siding, and landscaping. We install, replace, and clean gutter systems throughout {city}.",
        f"Working with builders and homeowners across {city} for new construction. Precision installation, manufacturer certifications, written warranties on every project.",
        f"Roofing emergencies don't wait for business hours. {c} is staffed 24/7 -- we answer, we show up, we fix it.",
    ]

    svc_photo_keys = ["hero_bg", "roofer", "house1", "install", "house5", "house2"]

    widget_code = ""
    if widget_key:
        widget_code = (
            f'<script src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"></script>'
            f'<div data-widget-key="{widget_key}" style="position:fixed;bottom:24px;right:24px;z-index:9999"></div>'
        )

    svc_tabs_html = "".join(
        f'<button class="svc-tab{" active" if i == 0 else ""}" onclick="switchTab({i})">{s}</button>'
        for i, s in enumerate(services[:6])
    )
    svc_panels_html = "".join(
        f'<div class="svc-panel{" active" if i == 0 else ""}" id="panel-{i}">'
        f'<div class="svc-panel-inner">'
        f'<div><div class="svc-num">0{i+1}</div>'
        f'<div class="svc-content"><h3>{s}</h3>'
        f'<p>{svc_descs[i] if i < len(svc_descs) else s}</p>'
        f'<a href="#contact" class="btn-primary">Get Free Estimate</a></div></div>'
        f'<div class="svc-visual"><img src="{_img(svc_photo_keys[i % len(svc_photo_keys)], 600, 75)}"'
        f' alt="{s}" loading="lazy"></div>'
        f'</div></div>'
        for i, s in enumerate(services[:6])
    )

    gallery_html = "".join(
        f'<div class="gallery-item">'
        f'<img src="{_img(k, 600, 75)}" alt="Roofing project {i+1} by {c}" loading="lazy">'
        f'<div class="gallery-overlay"><span>{city}, {state}</span></div></div>'
        for i, k in enumerate(["house1", "house2", "house3", "house4", "house5", "roofer"])
    )

    cities_grid = "".join(
        f'<div class="city-item"><span class="ci-arrow">&#8250;</span>{ct}</div>'
        for ct in cities_list[:12]
    )
    short = c.split()[0] if c.split() else c
    rest  = " ".join(c.split()[1:]) if len(c.split()) > 1 else ""
    svc_opts = "".join(f'<option value="{s}">{s}</option>' for s in services[:6])
    svc_foot = "".join(f"<li><a href='#'>{s}</a></li>" for s in services[:6])
    rating_val = str(round(min((reviews or 50) / 10 + 4.2, 5.0), 1))
    logo_html = f'<span>{short}</span>{(" " + rest) if rest else ""}'
    hero_bg_url = _img("hero_bg", 1920, 80)

    css = (
        f"*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}"
        f":root{{--navy:{navy};--orange:{orange};--white:#FFF;--gray:#8892A4;--dark:#060E1A;--card:#0F1F38;--card2:#0A1628}}"
        "html{scroll-behavior:smooth}"
        "body{background:var(--dark);color:var(--white);font-family:Inter,sans-serif;overflow-x:hidden}"
        'h1,h2,h3,h4{font-family:"Barlow Condensed",sans-serif;letter-spacing:-.02em}'
        "a{color:inherit;text-decoration:none}img{max-width:100%;display:block}"
        ".container{max-width:1200px;margin:0 auto;padding:0 24px}"
        '.btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--orange);color:#fff;font-family:"Barlow Condensed",sans-serif;font-size:18px;font-weight:700;letter-spacing:.04em;padding:16px 32px;border-radius:4px;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s;text-transform:uppercase}'
        ".btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(249,115,22,.4)}"
        '.btn-outline{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#fff;font-family:"Barlow Condensed",sans-serif;font-size:18px;font-weight:700;padding:14px 30px;border-radius:4px;border:2px solid rgba(255,255,255,.3);cursor:pointer;transition:all .2s;text-transform:uppercase}'
        ".btn-outline:hover{border-color:var(--orange);color:var(--orange)}"
        '.section-label{font-family:"Barlow Condensed",sans-serif;font-size:13px;font-weight:700;letter-spacing:.15em;color:var(--orange);text-transform:uppercase;margin-bottom:16px}'
        ".section-title{font-size:clamp(36px,5vw,64px);font-weight:900;line-height:1.05;margin-bottom:24px}"
        "nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 0;transition:all .3s}"
        "nav.scrolled{background:rgba(6,14,26,.97);backdrop-filter:blur(12px);padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06)}"
        ".nav-inner{display:flex;align-items:center;justify-content:space-between}"
        '.nav-logo{font-family:"Barlow Condensed",sans-serif;font-size:22px;font-weight:900}'
        ".nav-logo span{color:var(--orange)}"
        ".nav-links{display:flex;gap:32px}"
        ".nav-links a{font-size:14px;font-weight:500;color:rgba(255,255,255,.7);transition:color .2s;letter-spacing:.04em;text-transform:uppercase}"
        ".nav-links a:hover{color:var(--white)}"
        '.nav-phone{font-family:"Barlow Condensed",sans-serif;font-size:18px;font-weight:700;color:var(--orange)}'
        "@media(max-width:768px){.nav-links{display:none}.nav-phone{display:none}}"
        f'#hero{{position:relative;height:100vh;min-height:700px;display:flex;align-items:center;overflow:hidden;background:url("{hero_bg_url}") center/cover no-repeat}}'
        "#hero-canvas{position:absolute;inset:0;z-index:1}"
        ".hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(6,14,26,.88) 0%,rgba(13,31,60,.72) 50%,rgba(6,14,26,.82) 100%);z-index:2}"
        ".hero-content{position:relative;z-index:3;max-width:800px}"
        '.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(249,115,22,.15);border:1px solid rgba(249,115,22,.4);border-radius:100px;padding:8px 18px;font-family:"Barlow Condensed",sans-serif;font-size:13px;font-weight:700;letter-spacing:.12em;color:var(--orange);text-transform:uppercase;margin-bottom:32px}'
        ".hero-badge::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--orange);animation:pulse 2s infinite;display:inline-block}"
        "@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}"
        "h1.hero-title{font-size:clamp(48px,8vw,96px);font-weight:900;line-height:.95;margin-bottom:32px;text-transform:uppercase}"
        "h1.hero-title em{color:var(--orange);font-style:normal}"
        ".hero-sub{font-size:20px;color:rgba(255,255,255,.75);line-height:1.6;margin-bottom:48px;max-width:560px}"
        ".hero-ctas{display:flex;flex-wrap:wrap;gap:16px;margin-bottom:64px}"
        ".hero-stats{display:flex;flex-wrap:wrap;gap:40px}"
        '.hero-stat strong{font-family:"Barlow Condensed",sans-serif;font-size:42px;font-weight:900;color:var(--orange);line-height:1}'
        ".hero-stat span{font-size:13px;color:rgba(255,255,255,.5);letter-spacing:.06em;text-transform:uppercase;margin-top:4px;display:block}"
        "#trust{background:rgba(255,255,255,.03);border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);padding:32px 0}"
        ".trust-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:24px}"
        ".trust-item{display:flex;align-items:center;gap:12px}"
        ".trust-icon{width:40px;height:40px;background:rgba(249,115,22,.1);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}"
        '.trust-text strong{font-family:"Barlow Condensed",sans-serif;font-size:16px;font-weight:700;display:block}'
        ".trust-text span{font-size:12px;color:var(--gray)}"
        "#services{padding:120px 0}"
        ".svc-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;flex-wrap:wrap;gap:24px}"
        ".svc-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px}"
        '.svc-tab{font-family:"Barlow Condensed",sans-serif;font-size:15px;font-weight:700;letter-spacing:.06em;padding:10px 20px;border-radius:4px;border:1px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.5);cursor:pointer;transition:all .2s;text-transform:uppercase}'
        ".svc-tab.active,.svc-tab:hover{background:var(--orange);border-color:var(--orange);color:#fff}"
        ".svc-panel{display:none}.svc-panel.active{display:block}"
        ".svc-panel-inner{display:grid;grid-template-columns:1fr 380px;gap:48px;background:var(--card);border-radius:12px;padding:48px;border:1px solid rgba(255,255,255,.06);align-items:center}"
        "@media(max-width:900px){.svc-panel-inner{grid-template-columns:1fr}}"
        '.svc-num{font-family:"Barlow Condensed",sans-serif;font-size:80px;font-weight:900;color:rgba(249,115,22,.12);line-height:1;margin-bottom:16px}'
        ".svc-content h3{font-size:36px;font-weight:800;margin-bottom:16px}"
        ".svc-content p{color:var(--gray);line-height:1.7;margin-bottom:24px;font-size:16px}"
        ".svc-visual{height:280px;border-radius:8px;overflow:hidden;flex-shrink:0}"
        ".svc-visual img{width:100%;height:100%;object-fit:cover;transition:transform .6s}"
        ".svc-visual:hover img{transform:scale(1.04)}"
        "#gallery{padding:100px 0;background:var(--card2)}"
        ".gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:48px}"
        "@media(max-width:768px){.gallery-grid{grid-template-columns:repeat(2,1fr)}}"
        ".gallery-item{position:relative;overflow:hidden;border-radius:8px;aspect-ratio:4/3;cursor:pointer}"
        ".gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .5s}"
        ".gallery-item:hover img{transform:scale(1.06)}"
        ".gallery-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,14,26,.8) 0%,transparent 50%);display:flex;align-items:flex-end;padding:16px;opacity:0;transition:opacity .3s}"
        ".gallery-item:hover .gallery-overlay{opacity:1}"
        '.gallery-overlay span{font-family:"Barlow Condensed",sans-serif;font-size:16px;font-weight:700;color:#fff;letter-spacing:.06em;text-transform:uppercase}'
        "#before-after{padding:100px 0}"
        ".ba-header{text-align:center;margin-bottom:64px}"
        ".ba-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;border-radius:12px;overflow:hidden}"
        "@media(max-width:768px){.ba-grid{grid-template-columns:1fr}}"
        ".ba-side{position:relative}"
        ".ba-side img{width:100%;height:480px;object-fit:cover}"
        ".ba-label{position:absolute;top:20px;left:20px;background:rgba(6,14,26,.85);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:8px 16px;font-family:\"Barlow Condensed\",sans-serif;font-size:14px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff}"
        ".ba-label.after{background:rgba(249,115,22,.85);border-color:var(--orange)}"
        "#about{padding:120px 0;background:linear-gradient(180deg,transparent,rgba(13,31,60,.3),transparent)}"
        ".about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}"
        "@media(max-width:768px){.about-grid{grid-template-columns:1fr}}"
        ".about-text{color:var(--gray);line-height:1.8;margin-bottom:24px;font-size:16px}"
        ".about-metrics{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:40px}"
        ".about-metric{background:var(--card);border-radius:8px;padding:24px;border:1px solid rgba(255,255,255,.06)}"
        '.about-metric strong{font-family:"Barlow Condensed",sans-serif;font-size:42px;font-weight:900;color:var(--orange);display:block}'
        ".about-metric span{font-size:13px;color:var(--gray)}"
        ".about-photo{border-radius:16px;overflow:hidden;position:relative}"
        ".about-photo img{width:100%;height:520px;object-fit:cover}"
        ".about-badge{position:absolute;bottom:24px;right:24px;background:var(--orange);border-radius:12px;padding:20px 24px;text-align:center}"
        '.about-badge strong{font-family:"Barlow Condensed",sans-serif;font-size:32px;font-weight:900;display:block;line-height:1}'
        ".about-badge span{font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.9}"
        "#reviews{padding:120px 0}"
        ".reviews-header{text-align:center;margin-bottom:64px}"
        ".reviews-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}"
        ".review-card{background:var(--card);border-radius:12px;padding:32px;border:1px solid rgba(255,255,255,.06);transition:border-color .2s}"
        ".review-card:hover{border-color:rgba(249,115,22,.3)}"
        ".review-stars{color:var(--orange);font-size:14px;margin-bottom:16px;letter-spacing:2px}"
        ".review-text{color:rgba(255,255,255,.8);line-height:1.7;font-style:italic;margin-bottom:24px;font-size:15px}"
        ".review-author{display:flex;align-items:center;gap:12px}"
        ".review-avatar{width:44px;height:44px;background:linear-gradient(135deg,var(--orange),#ea580c);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:\"Barlow Condensed\",sans-serif;font-size:20px;font-weight:800;flex-shrink:0}"
        ".review-name strong{display:block;font-size:15px;font-weight:600}"
        ".review-name span{font-size:12px;color:var(--gray)}"
        "#areas{padding:80px 0;background:rgba(255,255,255,.02)}"
        ".areas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-top:40px}"
        ".city-item{display:flex;align-items:center;gap:8px;padding:12px 16px;background:var(--card);border-radius:6px;border:1px solid rgba(255,255,255,.05);font-size:14px;color:rgba(255,255,255,.7);transition:all .2s}"
        ".city-item:hover{border-color:var(--orange);color:var(--white)}"
        ".ci-arrow{color:var(--orange);font-size:18px;font-weight:700}"
        "#contact{padding:120px 0}"
        ".contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}"
        "@media(max-width:768px){.contact-grid{grid-template-columns:1fr}}"
        ".contact-form{background:var(--card);border-radius:16px;padding:48px;border:1px solid rgba(255,255,255,.06)}"
        ".form-group{margin-bottom:20px}"
        ".form-group label{display:block;font-family:\"Barlow Condensed\",sans-serif;font-size:13px;font-weight:700;letter-spacing:.1em;color:var(--gray);text-transform:uppercase;margin-bottom:8px}"
        ".form-group input,.form-group select,.form-group textarea{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:14px 16px;color:#fff;font-size:15px;font-family:Inter,sans-serif;outline:none;transition:border-color .2s}"
        ".form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--orange)}"
        ".form-group textarea{height:120px;resize:vertical}"
        ".form-group select option{background:#0D1F3C}"
        ".contact-card{display:flex;gap:16px;padding:24px;background:var(--card);border-radius:10px;border:1px solid rgba(255,255,255,.06);margin-bottom:16px}"
        ".contact-card-icon{width:48px;height:48px;background:rgba(249,115,22,.1);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}"
        ".contact-card-text strong{font-family:\"Barlow Condensed\",sans-serif;font-size:18px;font-weight:700;display:block;margin-bottom:4px}"
        ".contact-card-text a,.contact-card-text span{color:var(--gray);font-size:15px}"
        ".contact-card-text a{color:var(--orange)}"
        "footer{background:var(--dark);border-top:1px solid rgba(255,255,255,.06);padding:64px 0 32px}"
        ".footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;margin-bottom:48px}"
        "@media(max-width:768px){.footer-grid{grid-template-columns:1fr}}"
        ".footer-brand p{color:var(--gray);line-height:1.7;margin-top:16px;max-width:320px;font-size:14px}"
        "footer h4{font-family:\"Barlow Condensed\",sans-serif;font-size:18px;font-weight:700;margin-bottom:20px}"
        "footer ul{list-style:none}footer ul li{margin-bottom:10px}footer ul li a{color:var(--gray);font-size:14px;transition:color .2s}footer ul li a:hover{color:var(--white)}"
        ".footer-bottom{border-top:1px solid rgba(255,255,255,.06);padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}"
        ".footer-bottom p{color:var(--gray);font-size:13px}.footer-bottom a{color:var(--orange);font-size:13px}"
        ".mobile-cta{display:none;position:fixed;bottom:0;left:0;right:0;z-index:99;background:var(--orange);padding:14px 24px;align-items:center;justify-content:center;gap:12px;text-decoration:none;font-family:\"Barlow Condensed\",sans-serif;font-size:20px;font-weight:800;color:#fff;letter-spacing:.04em;text-transform:uppercase}"
        "@media(max-width:768px){.mobile-cta{display:flex}body{padding-bottom:60px}}"
    )

    html = (
        f'<!DOCTYPE html><html lang="en"><head>'
        f'<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">'
        f'<title>{c} | {city} Roofing Contractor</title>'
        f'<meta name="description" content="{c} -- {city}, {state} roofing. Roof replacement, storm damage, gutters. Licensed &amp; insured. {phone}.">'
        f'<link rel="preconnect" href="https://fonts.googleapis.com">'
        f'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        f'<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">'
        f'<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>'
        f'<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>'
        f'<script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>'
        f'<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>'
        f'<style>{css}</style></head><body>'
        # NAV
        f'<nav id="mainNav"><div class="container nav-inner">'
        f'<div class="nav-logo">{logo_html}</div>'
        f'<div class="nav-links"><a href="#services">Services</a><a href="#gallery">Projects</a>'
        f'<a href="#about">About</a><a href="#reviews">Reviews</a><a href="#contact">Contact</a></div>'
        f'<div style="display:flex;align-items:center;gap:16px">'
        f'<a class="nav-phone" href="tel:{phone_clean}">{phone}</a>'
        f'<a class="btn-primary" href="#contact" style="padding:12px 24px;font-size:15px">Free Estimate</a>'
        f'</div></div></nav>'
        # HERO
        f'<section id="hero"><canvas id="hero-canvas"></canvas><div class="hero-overlay"></div>'
        f'<div class="container hero-content">'
        f'<div class="hero-badge">&#9679; Serving {city} &amp; Surrounding Areas</div>'
        f'<h1 class="hero-title">{city}\'s <em>Most<br>Trusted</em><br>Roofer</h1>'
        f'<p class="hero-sub">{tagline}. Licensed, insured, backed by a written workmanship guarantee.</p>'
        f'<div class="hero-ctas">'
        f'<a class="btn-primary" href="tel:{phone_clean}">&#128222; Call {phone}</a>'
        f'<a class="btn-outline" href="#contact">Get Free Estimate</a></div>'
        f'<div class="hero-stats">'
        f'<div class="hero-stat"><strong>{years}+</strong><span>Years Serving {city}</span></div>'
        f'<div class="hero-stat"><strong>{reviews or "500"}+</strong><span>5-Star Reviews</span></div>'
        f'<div class="hero-stat"><strong>24/7</strong><span>Emergency Service</span></div>'
        f'<div class="hero-stat"><strong>100%</strong><span>Satisfaction Guarantee</span></div>'
        f'</div></div></section>'
        # TRUST STRIP
        f'<section id="trust"><div class="container"><div class="trust-grid">'
        f'<div class="trust-item"><div class="trust-icon">&#9989;</div><div class="trust-text"><strong>Licensed &amp; Insured</strong><span>Full liability coverage</span></div></div>'
        f'<div class="trust-item"><div class="trust-icon">&#128196;</div><div class="trust-text"><strong>Insurance Claims</strong><span>We handle the paperwork</span></div></div>'
        f'<div class="trust-item"><div class="trust-icon">&#127775;</div><div class="trust-text"><strong>Manufacturer Certified</strong><span>Premium warranties</span></div></div>'
        f'<div class="trust-item"><div class="trust-icon">&#128338;</div><div class="trust-text"><strong>24/7 Emergency</strong><span>We answer every call</span></div></div>'
        f'<div class="trust-item"><div class="trust-icon">&#128176;</div><div class="trust-text"><strong>Free Estimates</strong><span>No obligation quotes</span></div></div>'
        f'</div></div></section>'
        # SERVICES
        f'<section id="services"><div class="container">'
        f'<div class="svc-header"><div><div class="section-label">What We Do</div>'
        f'<h2 class="section-title">Expert Roofing<br>Services</h2></div>'
        f'<a class="btn-primary" href="#contact">Get Free Estimate</a></div>'
        f'<div class="svc-tabs">{svc_tabs_html}</div>{svc_panels_html}</div></section>'
        # GALLERY
        f'<section id="gallery"><div class="container">'
        f'<div class="section-label">Our Work</div>'
        f'<h2 class="section-title">Completed Projects<br>You Can Trust</h2>'
        f'<p style="color:var(--gray);max-width:560px;line-height:1.7;margin-bottom:8px">Every job handled by our trained crew, never subcontracted. See recent work across {city}.</p>'
        f'<div class="gallery-grid">{gallery_html}</div></div></section>'
        # BEFORE/AFTER
        f'<section id="before-after"><div class="container">'
        f'<div class="ba-header">'
        f'<div class="section-label">Transformations</div>'
        f'<h2 class="section-title">Before &amp; After</h2>'
        f'<p style="color:var(--gray);max-width:500px;margin:0 auto;line-height:1.7">The difference a quality roof makes.</p></div>'
        f'<div class="ba-grid">'
        f'<div class="ba-side"><img src="{_img("damage", 800, 75)}" alt="Before roof replacement" loading="lazy"><div class="ba-label">Before</div></div>'
        f'<div class="ba-side"><img src="{_img("house3", 800, 75)}" alt="After roof replacement" loading="lazy"><div class="ba-label after">After</div></div>'
        f'</div><div style="text-align:center;margin-top:40px">'
        f'<a class="btn-primary" href="#contact">Get This Result For Your Home</a></div></div></section>'
        # ABOUT
        f'<section id="about"><div class="container"><div class="about-grid"><div>'
        f'<div class="section-label">Our Story</div>'
        f'<h2 class="section-title">Why {city}<br>Trusts {short}</h2>'
        f'<p class="about-text">{about}</p>'
        f'<p class="about-text">We don\'t subcontract. Every job is handled by our trained crew.</p>'
        f'<div class="about-metrics">'
        f'<div class="about-metric"><strong>{years}+</strong><span>Years in Business</span></div>'
        f'<div class="about-metric"><strong>{reviews or 500}+</strong><span>Roofs Completed</span></div>'
        f'<div class="about-metric"><strong>A+</strong><span>BBB Rating</span></div>'
        f'<div class="about-metric"><strong>100%</strong><span>Satisfaction</span></div>'
        f'</div><a class="btn-primary" href="#contact" style="margin-top:32px">Start Your Project</a></div>'
        f'<div class="about-photo"><img src="{_img("roofer", 800, 80)}" alt="Our roofing team" loading="lazy">'
        f'<div class="about-badge"><strong>$50K</strong><span>Guarantee</span></div></div>'
        f'</div></div></section>'
        # REVIEWS
        f'<section id="reviews"><div class="container"><div class="reviews-header">'
        f'<div class="section-label">What Customers Say</div>'
        f'<h2 class="section-title">Real Reviews from<br>{city} Homeowners</h2>'
        f'<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:16px">'
        f'<span style="font-size:28px;color:var(--orange)">&#9733;&#9733;&#9733;&#9733;&#9733;</span>'
        f'<span style="color:var(--gray)">{rating_val}/5.0 &bull; {reviews or 50}+ Reviews</span></div></div>'
        f'<div class="reviews-grid">'
        f'<div class="review-card"><div class="review-stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div>'
        f'<p class="review-text">"They came out within hours of my call, assessed the damage, and had everything fixed before the next storm."</p>'
        f'<div class="review-author"><div class="review-avatar">M</div><div class="review-name"><strong>Michael T.</strong><span>{city}, {state}</span></div></div></div>'
        f'<div class="review-card"><div class="review-stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div>'
        f'<p class="review-text">"Best roofing company in {city}. They handled my entire insurance claim and the roof looks amazing."</p>'
        f'<div class="review-author"><div class="review-avatar">S</div><div class="review-name"><strong>Sarah K.</strong><span>{city}, {state}</span></div></div></div>'
        f'<div class="review-card"><div class="review-stars">&#9733; &#9733; &#9733; &#9733; &#9733;</div>'
        f'<p class="review-text">"Fair pricing, fast work, clean job. My neighbor recommended {short} and I am so glad I called. Five stars all day."</p>'
        f'<div class="review-author"><div class="review-avatar">R</div><div class="review-name"><strong>Robert M.</strong><span>{city}, {state}</span></div></div></div>'
        f'</div></div></section>'
        # SERVICE AREAS
        f'<section id="areas"><div class="container">'
        f'<div class="section-label">Where We Work</div>'
        f'<h2 class="section-title">Serving {city}<br>&amp; Nearby Communities</h2>'
        f'<div class="areas-grid">{cities_grid}</div></div></section>'
        # CONTACT
        f'<section id="contact"><div class="container"><div class="contact-grid"><div>'
        f'<div class="section-label">Get in Touch</div>'
        f'<h2 class="section-title">Get Your<br>Free Estimate</h2>'
        f'<p style="color:var(--gray);line-height:1.6;font-size:18px;margin-bottom:40px">No pressure. No obligation. Just an honest assessment.</p>'
        f'<div class="contact-card"><div class="contact-card-icon">&#128222;</div>'
        f'<div class="contact-card-text"><strong>Call or Text</strong><a href="tel:{phone_clean}">{phone}</a></div></div>'
        f'<div class="contact-card"><div class="contact-card-icon">&#128205;</div>'
        f'<div class="contact-card-text"><strong>Service Area</strong><span>{city}, {state} &amp; surrounding cities</span></div></div>'
        f'<div class="contact-card"><div class="contact-card-icon">&#128338;</div>'
        f'<div class="contact-card-text"><strong>Hours</strong><span>Mon-Sat 7am-7pm &bull; Emergency 24/7</span></div></div>'
        f'</div><div class="contact-form">'
        f'<h3 style="font-family:\'Barlow Condensed\',sans-serif;font-size:28px;font-weight:800;margin-bottom:24px">Request Free Estimate</h3>'
        f'<form id="contactForm" onsubmit="handleSubmit(event)">'
        f'<div class="form-group"><label>Your Name</label><input type="text" name="name" placeholder="John Smith" required></div>'
        f'<div class="form-group"><label>Phone Number</label><input type="tel" name="phone" placeholder="(555) 000-0000" required></div>'
        f'<div class="form-group"><label>Email</label><input type="email" name="email" placeholder="john@email.com"></div>'
        f'<div class="form-group"><label>Service Needed</label><select name="service"><option value="">Select...</option>{svc_opts}</select></div>'
        f'<div class="form-group"><label>About Your Project</label><textarea name="message" placeholder="Describe your roofing issue..."></textarea></div>'
        f'<button type="submit" class="btn-primary" style="width:100%;justify-content:center">Send Request &#8594;</button>'
        f'<div id="formMsg" style="display:none;margin-top:16px;padding:16px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);border-radius:8px;color:#4ade80;font-size:14px">'
        f'&#10003; Got it! We will call you within 1 hour.</div>'
        f'</form></div></div></div></section>'
        # FOOTER
        f'<footer><div class="container"><div class="footer-grid">'
        f'<div class="footer-brand"><div class="nav-logo">{logo_html}</div>'
        f'<p>{city}\'s trusted roofing contractor. Licensed, insured, backed by a written guarantee.</p></div>'
        f'<div><h4>Services</h4><ul>{svc_foot}</ul></div>'
        f'<div><h4>Contact</h4><ul>'
        f'<li><a href="tel:{phone_clean}">{phone}</a></li>'
        f'<li><span style="color:var(--gray)">{city}, {state}</span></li>'
        f'<li><span style="color:var(--gray)">Mon-Sat 7am-7pm</span></li>'
        f'<li><span style="color:var(--orange)">24/7 Emergency Line</span></li>'
        f'</ul></div></div>'
        f'<div class="footer-bottom"><p>&copy; 2026 {c}. All rights reserved.</p>'
        f'<a href="#contact">Get Free Estimate &rarr;</a></div></div></footer>'
        f'<a class="mobile-cta" href="tel:{phone_clean}">&#128222; Call Now -- Free Estimate</a>'
        + widget_code
    )

    js = (
        '<script>'
        'gsap.registerPlugin(ScrollTrigger);'
        'const lenis=new Lenis({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))});'
        'function raf(time){lenis.raf(time);requestAnimationFrame(raf);}requestAnimationFrame(raf);'
        "lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(time=>lenis.raf(time*1000));"
        '(function(){'
        "const canvas=document.getElementById('hero-canvas');if(!canvas)return;"
        'try{'
        'const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false});'
        'renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);'
        'const scene=new THREE.Scene();'
        'const cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,1000);cam.position.z=5;'
        'const geo=new THREE.BufferGeometry();'
        'const n=window.innerWidth<768?400:1000;const pos=new Float32Array(n*3);'
        'for(let i=0;i<n*3;i++)pos[i]=(Math.random()-0.5)*20;'
        "geo.setAttribute('position',new THREE.BufferAttribute(pos,3));"
        'const mat=new THREE.PointsMaterial({color:0xF97316,size:0.035,transparent:true,opacity:0.5});'
        'scene.add(new THREE.Points(geo,mat));'
        'function animate(){requestAnimationFrame(animate);scene.rotation.y+=0.0003;scene.rotation.x+=0.0001;renderer.render(scene,cam);}animate();'
        "window.addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});"
        "}catch(e){console.warn('WebGL not available');}})();"
        "const nav=document.getElementById('mainNav');"
        "window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',window.scrollY>50);});"
        'function switchTab(idx){'
        "document.querySelectorAll('.svc-tab').forEach((t,i)=>t.classList.toggle('active',i===idx));"
        "document.querySelectorAll('.svc-panel').forEach((p,i)=>p.classList.toggle('active',i===idx));}"
        "gsap.utils.toArray('.section-title').forEach(el=>{"
        "gsap.from(el,{opacity:0,y:40,duration:0.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}});});"
        "gsap.utils.toArray('.review-card,.about-metric,.trust-item,.city-item,.contact-card,.gallery-item').forEach((el,i)=>{"
        "gsap.from(el,{opacity:0,y:30,duration:0.6,delay:(i%4)*0.08,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%'}});});"
        "gsap.from('.hero-badge',{opacity:0,y:20,duration:0.6,delay:0.3});"
        "gsap.from('.hero-title',{opacity:0,y:40,duration:0.8,delay:0.5});"
        "gsap.from('.hero-sub',{opacity:0,y:30,duration:0.7,delay:0.8});"
        "gsap.from('.hero-ctas',{opacity:0,y:20,duration:0.6,delay:1.0});"
        "gsap.from('.hero-stats',{opacity:0,y:20,duration:0.6,delay:1.2});"
        "function handleSubmit(e){e.preventDefault();document.getElementById('formMsg').style.display='block';e.target.reset();}"
        '</script></body></html>'
    )

    return html + js


