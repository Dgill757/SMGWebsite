"""Premium roofing concept-site generator.

The generator is deliberately deterministic and evidence-aware.  It may propose
conversion copy and layout, but it never manufactures reviews, certifications,
guarantees, project counts, or years in business.
"""

from __future__ import annotations

import hashlib
import html
import json
import re
from urllib.parse import urlparse


_FALLBACK_PHOTOS = (
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=84",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1100&q=82",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1100&q=82",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1100&q=82",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1100&q=82",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1100&q=82",
)


def _text(value: object, fallback: str = "") -> str:
    value = str(value or fallback).strip()
    return html.escape(value, quote=True)


def _color(value: object, fallback: str) -> str:
    value = str(value or "").strip()
    return value if re.fullmatch(r"#[0-9a-fA-F]{6}", value) else fallback


def _safe_url(value: object) -> str:
    value = str(value or "").strip()
    try:
        parsed = urlparse(value)
        return html.escape(value, quote=True) if parsed.scheme in {"http", "https"} and parsed.netloc else ""
    except Exception:
        return ""


def _unique_images(brand: dict) -> list[str]:
    values = []
    for item in [brand.get("hero_image"), *(brand.get("source_images") or [])]:
        safe = _safe_url(item)
        if safe and safe not in values and not any(x in safe.lower() for x in ("favicon", "icon-", "sprite")):
            values.append(safe)
    return (values + list(_FALLBACK_PHOTOS))[:6]


def validate_demo_html(document: str, brand: dict | None = None) -> dict:
    """Return a deployment gate score and actionable issues."""
    checks = {
        "company_identity": bool(brand and _text(brand.get("company_name")) in document),
        "preview_disclosure": "Website concept preview" in document,
        "mobile_navigation": 'id="menuToggle"' in document and 'id="mobileMenu"' in document,
        "reduced_motion": "prefers-reduced-motion" in document,
        "responsive_viewport": 'name="viewport"' in document,
        "conversion_cta": "#estimate" in document,
        "semantic_sections": all(f'id="{key}"' in document for key in ("services", "work", "about", "estimate")),
        "no_known_fabrications": not any(term in document for term in (
            "A+ BBB", "$50K Guarantee", "Michael T.", "Sarah K.", "Robert M.",
            "We will call you within 1 hour", "Emergency 24/7", "500+ Roofs",
        )),
        "substantial_document": len(document) >= 12000,
    }
    issues = [name.replace("_", " ") for name, passed in checks.items() if not passed]
    score = round(100 * sum(checks.values()) / len(checks))
    return {"score": score, "passed": score >= 88 and not issues, "checks": checks, "issues": issues}


def generate_world_class_roofing_site(brand: dict, widget_key: str | None = None) -> str:
    company = _text(brand.get("company_name"), "Local Roofing Company")
    city = _text(brand.get("city"), "Your Community")
    state = _text(brand.get("state"))
    place = f"{city}, {state}" if state else city
    phone = _text(brand.get("phone"))
    phone_href = re.sub(r"[^0-9+]", "", str(brand.get("phone") or ""))
    tagline = _text(brand.get("tagline"), "Roofing built around your home")
    about = _text(brand.get("about"), f"A modern website concept for {company}, designed to make it easier for local homeowners to understand services and request an estimate.")
    primary = _color(brand.get("primary_color"), "#0a192f")
    accent = _color(brand.get("secondary_color"), "#f97316")
    logo = _safe_url(brand.get("logo_url"))
    images = _unique_images(brand)
    services = [str(x).strip() for x in (brand.get("services") or []) if str(x).strip()][:6]
    services = services or ["Roof Replacement", "Roof Repair", "Storm Damage", "Roof Inspections", "Gutters", "Commercial Roofing"]
    services = [_text(x) for x in services]
    nearby = [_text(x) for x in (brand.get("nearby_cities") or []) if str(x).strip()][:8]
    testimonials = [x for x in (brand.get("testimonials") or []) if isinstance(x, dict) and x.get("quote")][:3]
    direction = str(brand.get("design_direction") or "premium-modern")
    direction = direction if direction in {"premium-modern", "bold-editorial", "heritage-trust"} else "premium-modern"
    years = int(brand.get("years_in_business") or 0)
    reviews = int(brand.get("review_count") or 0)
    seed = hashlib.sha256(company.encode("utf-8")).hexdigest()[:8]

    logo_markup = f'<img src="{logo}" alt="{company} logo">' if logo else f'<span class="wordmark">{company}</span>'
    call_markup = f'<a class="nav-call" href="tel:{phone_href}">Call {phone}</a>' if phone_href else '<a class="nav-call" href="#estimate">Request an estimate</a>'
    phone_card = f'<a href="tel:{phone_href}">{phone}</a>' if phone_href else '<span>Phone number added after approval</span>'
    stats = []
    if years > 0:
        stats.append((f"{years}+", "Years serving homeowners"))
    if reviews > 0:
        stats.append((f"{reviews}+", "Published customer reviews"))
    stats.extend([(str(len(services)), "Services clearly explained"), ("Fast", "Estimate-first experience")])
    stat_markup = "".join(f'<div class="stat"><strong>{a}</strong><span>{b}</span></div>' for a, b in stats[:3])

    service_copy = {
        "replace": "A clear path from inspection and material selection through final cleanup.",
        "storm": "Make the next step obvious after wind, hail, or unexpected roof damage.",
        "repair": "Help homeowners understand the problem and request the right repair quickly.",
        "gutter": "Protect the roofline, siding, landscaping, and foundation with a complete drainage plan.",
        "inspect": "Turn uncertainty into a documented next step with a professional roof assessment.",
        "commercial": "Present commercial roofing capabilities with a straightforward consultation path.",
    }
    def description(name: str) -> str:
        lower = name.lower()
        return next((copy for key, copy in service_copy.items() if key in lower), "A focused service page can explain the process, answer objections, and make the next step simple.")
    service_markup = "".join(
        f'<article class="service-card reveal"><span>0{i + 1}</span><h3>{name}</h3><p>{description(name)}</p><a href="#estimate">Explore this service <b>↗</b></a></article>'
        for i, name in enumerate(services)
    )
    work_markup = "".join(
        f'<figure class="project reveal"><img src="{src}" alt="Roofing website concept imagery" loading="lazy" width="900" height="680"><figcaption><span>Concept {i + 1:02d}</span><strong>Project storytelling</strong></figcaption></figure>'
        for i, src in enumerate(images[1:5])
    )
    if testimonials:
        proof_label = "Published customer feedback"
        proof_markup = "".join(
            f'<blockquote class="proof-card reveal"><p>“{_text(item.get("quote"))}”</p><cite>{_text(item.get("name"), "Published customer")}</cite></blockquote>'
            for item in testimonials
        )
    else:
        proof_label = "Conversion plan"
        proof_markup = "".join(
            f'<div class="proof-card reveal"><b>{number}</b><h3>{title}</h3><p>{body}</p></div>' for number, title, body in (
                ("01", "Build immediate trust", "Lead with the company’s real identity, service area, and proof as verified assets become available."),
                ("02", "Reduce homeowner friction", "Make services, phone contact, and estimate requests easy to find on every device."),
                ("03", "Turn attention into action", "Use focused calls to action and connect form submissions to the approved CRM workflow."),
            )
        )
    areas = "".join(f"<li>{area}</li>" for area in nearby) if nearby else f"<li>{place}</li><li>Nearby communities</li>"
    widget = ""
    if widget_key:
        widget = f'<script src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js" defer></script><div data-widget-key="{_text(widget_key)}" class="voice-widget"></div>'

    structured = {"@context": "https://schema.org", "@type": "RoofingContractor", "name": html.unescape(company), "areaServed": html.unescape(place)}
    if phone:
        structured["telephone"] = html.unescape(phone)
    css = f"""
    *,*::before,*::after{{box-sizing:border-box}}html{{scroll-behavior:smooth}}body{{margin:0;background:#07111f;color:#f8fafc;font-family:Inter,system-ui,sans-serif;overflow-x:hidden}}
    :root{{--ink:#07111f;--panel:#0d1c30;--brand:{primary};--accent:{accent};--muted:#9fb0c6;--line:rgba(255,255,255,.11)}}a{{color:inherit;text-decoration:none}}img{{display:block;max-width:100%}}button,input,select,textarea{{font:inherit}}
    .container{{width:min(1180px,calc(100% - 40px));margin:auto}}.eyebrow{{color:var(--accent);font-size:.76rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase}}h1,h2,h3{{font-family:"Barlow Condensed",Impact,sans-serif;margin:0;line-height:.96}}h2{{font-size:clamp(2.8rem,7vw,5.8rem);text-transform:uppercase}}p{{line-height:1.7}}
    .preview{{position:fixed;inset:0 0 auto;z-index:120;background:#fff;color:#101827;padding:7px 14px;text-align:center;font-size:.66rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;box-shadow:0 8px 30px #0006}}
    nav{{position:fixed;inset:29px 0 auto;z-index:100;padding:22px 0;transition:.35s}}nav.scrolled{{padding:14px 0;background:#07111feb;backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}}nav.hidden{{transform:translateY(-140%)}}.nav-inner{{display:flex;align-items:center;justify-content:space-between;gap:24px}}.logo img{{height:50px;max-width:190px;object-fit:contain}}.wordmark{{font:900 1.35rem/1 "Barlow Condensed",sans-serif;text-transform:uppercase;letter-spacing:.03em}}.nav-links{{display:flex;gap:28px;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:#d5deea}}.nav-call,.button{{background:var(--accent);color:#fff;padding:14px 20px;border-radius:4px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;border:0;cursor:pointer}}.menu-toggle{{display:none;background:#07111faa;border:1px solid var(--line);color:white;padding:10px}}
    .mobile-menu{{display:none;position:fixed;inset:0;background:#07111ff5;z-index:95;padding:120px 28px 40px}}.mobile-menu.open{{display:flex;flex-direction:column;gap:26px;font:800 2rem "Barlow Condensed";text-transform:uppercase}}
    .hero{{min-height:100svh;display:flex;align-items:end;position:relative;background:linear-gradient(90deg,#06101eee 0%,#06101ecc 45%,#06101e66),url('{images[0]}') center/cover;overflow:hidden;padding:170px 0 80px}}.hero::after{{content:"{seed}";position:absolute;right:-2vw;bottom:-8vw;font:900 clamp(10rem,28vw,28rem) "Barlow Condensed";color:#ffffff08;letter-spacing:-.08em}}.hero-content{{position:relative;z-index:2;max-width:900px}}h1{{font-size:clamp(4.1rem,10vw,9.7rem);text-transform:uppercase;letter-spacing:-.045em;max-width:1000px}}h1 em{{color:var(--accent);font-style:normal}}.hero-copy{{font-size:clamp(1rem,2vw,1.3rem);max-width:620px;color:#d6dfeb;margin:30px 0}}.hero-actions{{display:flex;gap:12px;flex-wrap:wrap}}.button.secondary{{background:transparent;border:1px solid #ffffff55}}.stats{{display:flex;gap:42px;margin-top:65px;flex-wrap:wrap}}.stat strong{{display:block;color:var(--accent);font:900 2.6rem "Barlow Condensed"}}.stat span{{color:#b5c2d2;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em}}
    section{{padding:120px 0}}.section-head{{display:grid;grid-template-columns:1.2fr .8fr;gap:70px;align-items:end;margin-bottom:60px}}.section-head p{{color:var(--muted);max-width:500px}}.service-grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}}.service-card{{padding:34px;background:var(--panel);border:1px solid var(--line);min-height:300px;display:flex;flex-direction:column;transition:.3s}}.service-card:hover{{transform:translateY(-8px);border-color:var(--accent)}}.service-card>span{{color:var(--accent);font-weight:800}}.service-card h3{{font-size:2rem;margin:58px 0 14px}}.service-card p{{color:var(--muted);margin:0 0 24px}}.service-card a{{margin-top:auto;font-weight:800}}.service-card b{{color:var(--accent)}}
    .work{{background:#eef2f5;color:#07111f}}.work-grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}}.project{{margin:0;position:relative;overflow:hidden;aspect-ratio:4/3;background:#d9e0e6}}.project img{{width:100%;height:100%;object-fit:cover;transition:transform .8s}}.project:hover img{{transform:scale(1.045)}}.project::after{{content:"CONCEPT IMAGERY";position:absolute;right:12px;top:12px;background:#07111fcc;color:white;padding:7px 9px;font-size:.62rem;letter-spacing:.1em}}.project figcaption{{position:absolute;inset:auto 0 0;padding:70px 24px 24px;color:white;background:linear-gradient(transparent,#07111fe8)}}.project span{{display:block;color:var(--accent);font-size:.7rem;letter-spacing:.12em}}.project strong{{font:800 1.8rem "Barlow Condensed"}}
    .about-grid{{display:grid;grid-template-columns:.85fr 1.15fr;gap:80px;align-items:center}}.portrait{{position:relative}}.portrait img{{width:100%;height:620px;object-fit:cover}}.portrait::before{{content:"";position:absolute;inset:-14px 14px 14px -14px;border:1px solid var(--accent);z-index:-1}}.about-copy p{{color:var(--muted)}}.areas{{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none;margin:30px 0}}.areas li{{border:1px solid var(--line);padding:9px 12px;color:#c5d0dd}}
    .proof{{background:var(--brand)}}.proof-grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:50px}}.proof-card{{margin:0;padding:34px;background:#07111f88;border:1px solid var(--line);min-height:220px}}.proof-card>b{{color:var(--accent)}}.proof-card h3{{font-size:2rem;margin:35px 0 8px}}.proof-card p{{color:#d2dbe7}}.proof-card cite{{color:var(--accent);font-style:normal;font-weight:800}}
    .estimate-grid{{display:grid;grid-template-columns:.8fr 1.2fr;gap:80px}}.contact-line{{margin:32px 0;font:800 1.65rem "Barlow Condensed"}}.contact-line a{{color:var(--accent)}}form{{background:var(--panel);border:1px solid var(--line);padding:38px}}.fields{{display:grid;grid-template-columns:1fr 1fr;gap:14px}}label{{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:#b6c2d0}}input,select,textarea{{width:100%;margin-top:7px;padding:14px;background:#07111f;border:1px solid var(--line);color:white}}textarea{{min-height:130px;resize:vertical}}.full{{grid-column:1/-1}}.form-note{{font-size:.76rem;color:var(--muted)}}#formMsg{{display:none;padding:12px;margin-top:12px;border:1px solid var(--accent);color:#fff}}
    footer{{border-top:1px solid var(--line);padding:45px 0 95px}}.footer-inner{{display:flex;align-items:center;justify-content:space-between;gap:25px;color:var(--muted);font-size:.8rem}}.voice-widget{{position:fixed;right:22px;bottom:22px;z-index:90}}
    .reveal{{opacity:0;transform:translateY(25px);transition:opacity .7s,transform .7s}}.reveal.visible{{opacity:1;transform:none}}
    @media(max-width:850px){{.nav-links,.nav-call{{display:none}}.menu-toggle{{display:block}}.section-head,.about-grid,.estimate-grid{{grid-template-columns:1fr;gap:35px}}.service-grid,.proof-grid{{grid-template-columns:1fr 1fr}}.hero{{padding-top:145px}}}}
    @media(max-width:600px){{.container{{width:min(100% - 28px,1180px)}}section{{padding:82px 0}}.service-grid,.proof-grid,.work-grid,.fields{{grid-template-columns:1fr}}.stats{{display:grid;grid-template-columns:1fr 1fr;gap:22px}}.stat{{min-width:0}}.stat span{{line-height:1.4}}.portrait img{{height:430px}}form{{padding:24px}}.preview{{font-size:.56rem;letter-spacing:.045em;padding-inline:5px}}}}
    body.bold-editorial .service-grid{{grid-template-columns:1.35fr .8fr .8fr}}body.bold-editorial .service-card:first-child{{grid-row:span 2}}body.bold-editorial h1{{max-width:1150px}}
    body.heritage-trust{{background:#10130f}}body.heritage-trust .hero{{background:linear-gradient(90deg,#10130fee,#10130f88),url('{images[0]}') center/cover}}body.heritage-trust .service-card,body.heritage-trust form{{border-radius:14px}}body.heritage-trust h1,body.heritage-trust h2{{letter-spacing:-.02em}}
    @media(max-width:850px){{body.bold-editorial .service-grid{{grid-template-columns:1fr 1fr}}}}
    @media(max-width:600px){{body.bold-editorial .service-grid{{grid-template-columns:1fr}}}}
    @media(prefers-reduced-motion:reduce){{html{{scroll-behavior:auto}}*,*::before,*::after{{animation:none!important;transition:none!important}}.reveal{{opacity:1;transform:none}}}}
    """
    document = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="{primary}"><meta name="description" content="Website concept for {company}, a roofing business serving {place}."><meta property="og:title" content="{company} | Roofing in {place}"><meta property="og:description" content="A premium website concept focused on clear services and easy estimate requests."><meta property="og:image" content="{images[0]}"><title>{company} | Roofing in {place}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><script type="application/ld+json">{json.dumps(structured).replace('</', '<\\/')}</script><style>{css}</style></head><body class="{direction}">
    <!-- SummitOS Demo Generator v4; preview; verified claims only -->
    <div class="preview">Website concept preview • Not yet the official site</div>
    <nav id="mainNav"><div class="container nav-inner"><a class="logo" href="#top">{logo_markup}</a><div class="nav-links"><a href="#services">Services</a><a href="#work">Work</a><a href="#about">About</a><a href="#estimate">Estimate</a></div>{call_markup}<button class="menu-toggle" id="menuToggle" aria-expanded="false" aria-controls="mobileMenu">Menu</button></div></nav>
    <div class="mobile-menu" id="mobileMenu"><a href="#services">Services</a><a href="#work">Work</a><a href="#about">About</a><a href="#estimate">Request estimate</a></div>
    <main id="top"><header class="hero"><div class="container hero-content"><span class="eyebrow">Roofing • {place}</span><h1>{tagline.replace(' ', ' <em>', 1)}</em></h1><p class="hero-copy">A sharper digital front door for {company}. Clear services. Strong local positioning. One obvious next step for every homeowner.</p><div class="hero-actions"><a class="button" href="#estimate">Request an estimate</a>{f'<a class="button secondary" href="tel:{phone_href}">Call {phone}</a>' if phone_href else ''}</div><div class="stats">{stat_markup}</div></div></header>
    <section id="services"><div class="container"><div class="section-head"><div><span class="eyebrow">What homeowners need</span><h2>Services made simple.</h2></div><p>A premium site should answer the first questions quickly, then guide each visitor toward a useful conversation.</p></div><div class="service-grid">{service_markup}</div></div></section>
    <section class="work" id="work"><div class="container"><div class="section-head"><div><span class="eyebrow">Visual direction</span><h2>Show the standard.</h2></div><p>Source-site assets are used when available. Any curated stock photography below is explicitly presented as concept imagery, not completed client work.</p></div><div class="work-grid">{work_markup}</div></div></section>
    <section id="about"><div class="container about-grid"><div class="portrait reveal"><img src="{images[0]}" alt="Roofing website concept for {company}" loading="lazy" width="900" height="1100"></div><div class="about-copy reveal"><span class="eyebrow">Built around the real business</span><h2>{company}</h2><p>{about}</p><p>This concept reorganizes the company story around homeowner trust, fast comprehension, and a clean path to an estimate.</p><ul class="areas">{areas}</ul><a class="button" href="#estimate">Plan the next step</a></div></div></section>
    <section class="proof"><div class="container"><span class="eyebrow">{proof_label}</span><h2>Proof before promises.</h2><div class="proof-grid">{proof_markup}</div></div></section>
    <section id="estimate"><div class="container estimate-grid"><div><span class="eyebrow">Start a conversation</span><h2>Make the next step effortless.</h2><p>Use this concept as the starting point. Final copy, project photography, credentials, reviews, service areas, and CRM routing are verified before launch.</p><div class="contact-line">{phone_card}</div></div><form id="contactForm"><div class="fields"><label>Name<input name="name" autocomplete="name" required></label><label>Phone<input name="phone" type="tel" autocomplete="tel" required></label><label>Email<input name="email" type="email" autocomplete="email"></label><label>Service<select name="service"><option>Select a service</option>{''.join(f'<option>{x}</option>' for x in services)}</select></label><label class="full">Project details<textarea name="message"></textarea></label><div class="full"><button class="button" type="submit">Preview estimate flow</button><p class="form-note">Concept mode: this form does not transmit personal information or contact the business.</p><div id="formMsg">Preview complete. The production form is connected to the approved CRM after launch.</div></div></div></form></div></section></main>
    <footer><div class="container footer-inner"><div>{logo_markup}</div><p>Website concept prepared for {company}. Claims and assets require owner approval before publication.</p><a href="#top">Back to top ↑</a></div></footer>{widget}
    <script>
    const nav=document.getElementById('mainNav'),toggle=document.getElementById('menuToggle'),menu=document.getElementById('mobileMenu');let lastY=0;
    addEventListener('scroll',()=>{{const y=scrollY;nav.classList.toggle('scrolled',y>30);nav.classList.toggle('hidden',y>lastY&&y>180&&!menu.classList.contains('open'));lastY=y}},{{passive:true}});
    toggle.addEventListener('click',()=>{{const open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close':'Menu'}});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu'}}));
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const reveals=document.querySelectorAll('.reveal');if(reduced)reveals.forEach(x=>x.classList.add('visible'));if(!reduced){{const observer=new IntersectionObserver(entries=>entries.forEach(e=>{{if(e.isIntersecting){{e.target.classList.add('visible');observer.unobserve(e.target)}}}}),{{threshold:.12}});reveals.forEach(x=>observer.observe(x))}}
    document.getElementById('contactForm').addEventListener('submit',e=>{{e.preventDefault();document.getElementById('formMsg').style.display='block'}});
    </script></body></html>"""
    return document
