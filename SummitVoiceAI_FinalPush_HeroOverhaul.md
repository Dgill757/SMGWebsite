# SummitVoiceAI — Final Push + Award-Level Hero Overhaul
### Phase 5: Ship Everything. Make It Win Awards.

> **This is the final execution prompt.** Two commits are ready locally.
> This prompt pushes them live, safeguards the old version, fixes the
> particle hero, rebuilds the main site hero to an award level using patterns
> from motionsites.ai, copies landing page images, and updates llms.txt.
> Run it in one pass. Do not skip phases.

---

## Pre-Flight

- [ ] Working directory open in VS Code:
  `C:\Users\DanGi\Downloads\SummitVoiceAI\MyCompanies\SummitVoiceAi\SMG_WEBSITE_MAIN\SMGWebsite-main\SMGWebsite-main`
- [ ] Confirm local commits `b4a512a` (main site) and `315f20b/977ac9a` (landing page) exist: `git log --oneline -5`
- [ ] Confirm source images folder exists: `C:\Users\DanGi\Downloads\SummitVoiceAI\MyCompanies\SummitVoiceAi\SMG_WEBSITE_MAIN\SMGWebsite-main\SMGWebsite-main\summitvoiceai-assets`
- [ ] framer-motion is already installed in both codebases (confirmed in Phase 4)

---

```
WORKING DIRECTORY:
C:\Users\DanGi\Downloads\SummitVoiceAI\MyCompanies\SummitVoiceAi\SMG_WEBSITE_MAIN\SMGWebsite-main\SMGWebsite-main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN INTELLIGENCE — READ BEFORE CODING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are applying premium motion-site design patterns to SummitVoiceAI.
Study and internalize these patterns before writing a single line:

PATTERN 1 — CINEMATIC FULL-BLEED STAGING (from motionsites.ai)
  The hero = ONE composition. Brand mark + nav + headline + sub + CTA
  pair + full-bleed visual. No cards, no badge chips, no marketing blocks
  above the fold. Video or animated visual IS the background plane,
  not an inset card. Typography floats left, visual dominates right.
  Fade overlays at edges/bottom. Restrained palette.

PATTERN 2 — CURSOR SPOTLIGHT REVEAL (from motionsites.ai)
  A hidden second-state image or layer revealed ONLY inside a soft
  circular mask that follows the mouse. The spotlight uses:
  radial-gradient at cursor (x,y) from rgba(255,255,255,1) at center
  → rgba(255,255,255,0) at edge-radius. Canvas.toDataURL() applied as
  mask-image on the reveal div. Smooth lerp: smooth += (mouse - smooth) * 0.09
  via requestAnimationFrame. Radius ~220-280px. Creates discovery behavior.
  SummitVoiceAI application: default state = dark "missed call" visual,
  cursor reveals a CYAN "call answered / Ava active" state beneath.

PATTERN 3 — LIQUID GLASS UI ELEMENTS (from motionsites.ai)
  .liquid-glass pill elements:
    background: rgba(255,255,255,0.025); backdrop-filter: blur(6px);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
    border: none; overflow: hidden; position: relative;
  ::before border effect:
    position: absolute; inset: 0; padding: 1.4px; border-radius: inherit;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
      rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
      rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none;
  Use on: trust pills, ghost CTA buttons, integration badge pills.

PATTERN 4 — STAGGERED GSAP/FRAMER ENTRANCE (from motionsites.ai)
  Brand/nav → rise 0.8s delay 0s
  Headline → rise 0.9s delay 0.06s
  Sub → rise 0.9s delay 0.14s
  CTA pair → rise 0.9s delay 0.22s
  Trust pills / partner logos → fade 1.1s delay 0.34s
  Easing everywhere: cubic-bezier(0.22, 1, 0.36, 1)
  @keyframes rise: from { opacity:0; transform:translateY(14px) }
  Respect prefers-reduced-motion: skip all entrance animations.

PATTERN 5 — VIEWPORT-LOCKED PROPORTIONAL LAYOUT (from motionsites.ai)
  --u: calc(100vh / 1058); (design pixel locked to screen height)
  Typography floats from exact left: ~75u from left edge.
  All vertical positions are multiples of --u. This means the layout
  FILLS the screen perfectly at any resolution. Never use fixed px
  for hero positioning — always calc(N * var(--u)).

SUMMITVOICEAI-SPECIFIC RULES:
  - Brand colors: #050505 bg, #00D9FF cyan, #7C3AED violet
  - Do NOT remove, replace, or touch: AmbientBackground.tsx, GlobalAtmosphere.tsx,
    the existing particle Ava system OR the SummitWidget.tsx orbs. Only ENHANCE.
  - The existing page sections (AnimatedStats, AvaComparison, etc.) are untouched.
  - This phase ONLY touches: HeroSection.tsx, index.css, llms.txt, and
    the landing page image assets.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 0 — FIX THE AVA GLB PATH (30 SECONDS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

READ src/components/ava/AvaParticleHero.tsx (if it exists).
Search for the string "/ava-face.glb".
Replace it with "/Ava.glb" (this file exists in /public/, confirmed by mtime check).

That's it for this phase. One line change. Do not change anything else
in the particle system. This enables the TRUE 3D GLB mode that the
particle hero was designed for but has never actually used.

If AvaParticleHero.tsx does not exist or does not contain "/ava-face.glb",
skip this phase entirely.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — COPY LANDING PAGE IMAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Source folder (already confirmed by user):
  C:\...\SMGWebsite-main\SMGWebsite-main\summitvoiceai-assets\

Destination:
  summitvoiceai-landing\client\public\images\

Step 1: List all files in summitvoiceai-assets/ using bash or file tool.

Step 2: Copy EVERY image file (.png, .jpg, .jpeg, .webp, .svg) from
  summitvoiceai-assets/ to summitvoiceai-landing/client/public/images/

Step 3: After copying, map filenames to the expected paths used in
  summitvoiceai-landing/client/src/pages/Home.tsx and index.css.
  The 5 expected filenames from the Manus cleanup (Phase 3A) were:
    hero-roof.png
    logo-mark.png
    roof-detail.png
    operations-surface.png
    roof-finished-home.png

  If the assets folder uses different names, create symlinks or copies
  with the expected names. Example: if the folder has "hero.png" but
  the code references "/images/hero-roof.png", copy it as hero-roof.png.

  Map the most visually appropriate image to each role:
    hero-roof.png → any roofing exterior / dramatic roofing scene
    roof-finished-home.png → completed home with roof
    roof-detail.png → close-up roof texture / material
    logo-mark.png → company logo if present, else skip
    operations-surface.png → dashboard or tech UI if present, else use roof-detail

Step 4: Print which files were copied and what names they received.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — HERO SECTION OVERHAUL (HeroSection.tsx)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is the most important phase. The goal: make a roofing business
owner open summitvoiceai.com and immediately think "this is different
from anything I've seen in this industry." Award level.

READ src/components/HeroSection.tsx completely before starting.

════════════════════════════════════════════
2A — ADD LIQUID GLASS CSS (src/index.css)
════════════════════════════════════════════

Add these CSS rules to src/index.css (after existing rules):

  /* ── LIQUID GLASS SYSTEM ── */
  .glass {
    background: rgba(255,255,255,0.025);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.10);
    position: relative;
    overflow: hidden;
  }
  .glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.45) 0%,
      rgba(255,255,255,0.15) 20%,
      rgba(255,255,255,0) 40%,
      rgba(255,255,255,0) 60%,
      rgba(255,255,255,0.15) 80%,
      rgba(255,255,255,0.45) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: 0;
  }

  /* ── HERO ENTRANCE ANIMATIONS ── */
  @keyframes heroRise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes heroPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,217,255,0); }
    50% { box-shadow: 0 0 0 8px rgba(0,217,255,0.12); }
  }
  .hero-rise {
    opacity: 0;
    animation: heroRise 0.9s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .hero-fade {
    opacity: 0;
    animation: heroFade 1.1s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .hero-cta-pulse {
    animation: heroPulse 3s ease-in-out 2s infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-rise, .hero-fade { animation: none; opacity: 1; }
  }

  /* ── CURSOR SPOTLIGHT CANVAS ── */
  .hero-spotlight-canvas {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
    display: none;
  }
  .hero-spotlight-reveal {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    background-size: cover;
    background-position: center;
    transition: none;
  }

  /* ── VIEWPORT UNIT SYSTEM ── */
  :root {
    --u: calc(100vh / 1058);
    --page-top: 112px;
  }
  @supports (height: 100dvh) { :root { --u: calc(100dvh / 1058); } }
  @media (max-width: 768px)  { :root { --page-top: 80px; } }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

════════════════════════════════════════════
2B — REWRITE HeroSection.tsx
════════════════════════════════════════════

READ the current HeroSection.tsx completely.
Preserve: the className="hero-section-wrapper", the particle Ava canvas/scene,
and any existing widget orb trigger logic (#experience-ava, .wcw-state-container).

REPLACE the component with this complete implementation.
Adapt any import paths to match what already exists in the project.

---START FILE: src/components/HeroSection.tsx---
import React, { useEffect, useRef, useState, useCallback } from 'react';

const SPOTLIGHT_R = 240;

export function HeroSection() {
  // ── Cursor spotlight state ──
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const mouseRef  = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef    = useRef<number>(0);
  const heroRef   = useRef<HTMLElement>(null);
  const [spotlightActive, setSpotlightActive] = useState(false);

  // ── Size canvas to window ──
  const sizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  // ── Spotlight RAF loop ──
  const tick = useCallback(() => {
    const c = canvasRef.current;
    const r = revealRef.current;
    if (!c || !r) { rafRef.current = requestAnimationFrame(tick); return; }
    const ctx = c.getContext('2d');
    if (!ctx) { rafRef.current = requestAnimationFrame(tick); return; }

    // Lerp smooth toward mouse
    smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.09;
    smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.09;

    const { x, y } = smoothRef.current;
    ctx.clearRect(0, 0, c.width, c.height);

    // Build radial gradient mask
    const grad = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_R);
    grad.addColorStop(0,    'rgba(255,255,255,1)');
    grad.addColorStop(0.4,  'rgba(255,255,255,1)');
    grad.addColorStop(0.65, 'rgba(255,255,255,0.72)');
    grad.addColorStop(0.82, 'rgba(255,255,255,0.28)');
    grad.addColorStop(0.94, 'rgba(255,255,255,0.06)');
    grad.addColorStop(1,    'rgba(255,255,255,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const url = c.toDataURL();
    r.style.maskImage          = `url(${url})`;
    r.style.webkitMaskImage    = `url(${url})`;
    r.style.maskSize           = '100% 100%';
    r.style.webkitMaskSize     = '100% 100%';

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    const onMove = (e: MouseEvent) => {
      if (!spotlightActive) setSpotlightActive(true);
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current  = { x: -999, y: -999 };
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sizeCanvas, tick, spotlightActive]);

  // ── Scroll to widget ──
  const handleTalkToAva = () => {
    const section = document.getElementById('experience-ava');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const btn = document.querySelector('.wcw-state-container') as HTMLElement;
      if (btn) btn.click();
    }, 700);
  };

  return (
    <section
      ref={heroRef}
      className="hero-section-wrapper"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 'var(--page-top)',
        paddingBottom: '0',
      }}
    >
      {/* ── Cursor spotlight: CYAN "with Ava" reveal layer ── */}
      {/* Default state = dark (missed calls); cursor reveals the cyan "answered" world */}
      <canvas
        ref={canvasRef}
        className="hero-spotlight-canvas"
        style={{ display: 'block' }}
        aria-hidden="true"
      />
      <div
        ref={revealRef}
        className="hero-spotlight-reveal"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 60% 70% at 65% 45%,
              rgba(0,217,255,0.08) 0%,
              rgba(0,217,255,0.04) 40%,
              transparent 75%),
            radial-gradient(ellipse 40% 50% at 70% 38%,
              rgba(124,58,237,0.06) 0%,
              transparent 70%)
          `,
        }}
      />

      {/* ── Main hero content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 80px)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {/* Trust badge */}
        <div
          className="hero-fade glass"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 16px',
            borderRadius: '999px',
            marginBottom: 'clamp(20px, 3vh, 32px)',
            alignSelf: 'flex-start',
            animationDelay: '0s',
          }}
        >
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#00D9FF',
            boxShadow: '0 0 10px rgba(0,217,255,0.9)',
            flexShrink: 0,
            animation: 'heroPulse 2.5s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 'clamp(0.7rem, 1.4vw, 0.78rem)',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}>
            Trusted by 42+ Roofing Companies Across the US
          </span>
        </div>

        {/* Headline */}
        <h1
          className="hero-rise"
          style={{
            animationDelay: '0.06s',
            fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            margin: '0 0 clamp(16px, 2.5vh, 24px)',
            background: 'linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #00D9FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            maxWidth: '820px',
          }}
        >
          Every Missed Call Is a Job Going to Your Competitor
        </h1>

        {/* Subheadline */}
        <p
          className="hero-rise"
          style={{
            animationDelay: '0.14s',
            fontSize: 'clamp(1rem, 2vw, 1.18rem)',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.58)',
            lineHeight: 1.65,
            margin: '0 0 clamp(10px, 1.5vh, 14px)',
            maxWidth: '580px',
          }}
        >
          Ava answers every call 24/7, books appointments automatically,
          follows up with unsold estimates, reactivates old leads —
          and syncs everything to your CRM. At a fraction of the cost
          of a receptionist.
        </p>

        {/* Social proof line */}
        <p
          className="hero-rise"
          style={{
            animationDelay: '0.18s',
            fontSize: 'clamp(0.78rem, 1.4vw, 0.88rem)',
            fontStyle: 'italic',
            color: 'rgba(0,217,255,0.75)',
            margin: '0 0 clamp(24px, 4vh, 36px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🏆</span>
          Teo Roofing booked 582 appointments in 12 months.
          That's $4.1M+ recovered from one AI receptionist.
        </p>

        {/* CTA Buttons */}
        <div
          className="hero-rise"
          style={{
            animationDelay: '0.22s',
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 'clamp(20px, 3vh, 28px)',
          }}
        >
          {/* Primary: gradient pill */}
          <button
            onClick={handleTalkToAva}
            className="hero-cta-pulse"
            style={{
              padding: 'clamp(14px, 2vh, 18px) clamp(28px, 4vw, 42px)',
              background: 'linear-gradient(135deg, #00D9FF 0%, #7C3AED 100%)',
              border: 'none',
              borderRadius: '999px',
              color: '#000',
              fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '0.02em',
              boxShadow: '0 8px 32px rgba(0,217,255,0.25)',
              transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.02)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 14px 40px rgba(0,217,255,0.38)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0,217,255,0.25)';
            }}
          >
            🎙️ Talk to Ava Now — It's Free
          </button>

          {/* Secondary: liquid glass ghost */}
          <button
            className="glass"
            style={{
              padding: 'clamp(14px, 2vh, 18px) clamp(24px, 3.5vw, 36px)',
              background: 'transparent',
              borderRadius: '999px',
              color: 'rgba(255,255,255,0.82)',
              fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 0.2s, transform 0.2s',
              whiteSpace: 'nowrap',
              border: 'none',
            }}
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.82)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            See How It Works →
          </button>
        </div>

        {/* Trust pills */}
        <div
          className="hero-fade"
          style={{
            animationDelay: '0.34s',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {[
            '✓ No credit card required',
            '✓ Live in 48–72 hours',
            '✓ Cancel anytime',
          ].map((text, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: 'clamp(0.68rem, 1.2vw, 0.75rem)',
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: '#00D9FF', marginRight: '5px' }}>✓</span>
              {text.replace('✓ ', '')}
            </div>
          ))}
        </div>

        {/* Cursor hint — shows briefly then fades */}
        <p
          className="hero-fade"
          style={{
            animationDelay: '1.2s',
            fontSize: '0.68rem',
            color: 'rgba(255,255,255,0.2)',
            marginTop: 'clamp(16px, 2.5vh, 22px)',
            letterSpacing: '0.08em',
            fontStyle: 'italic',
          }}
        >
          ↖ Move your cursor to see what changes when Ava answers
        </p>
      </div>

      {/* ── Mobile safe-area bottom spacer ── */}
      <div style={{ height: 'clamp(40px, 6vh, 80px)' }} />
    </section>
  );
}
---END FILE---

════════════════════════════════════════════
2C — WIRE IT IN (Index.tsx)
════════════════════════════════════════════

Open src/pages/Index.tsx.
Find the existing HeroSection import and JSX usage.
The import path may need updating depending on whether HeroSection
was default or named export. Read the existing import and match it.

Ensure the HeroSection export in HeroSection.tsx matches what Index.tsx imports.
If Index.tsx uses: import HeroSection from '...'
  → change export function HeroSection to export default function HeroSection
    OR add: export default HeroSection; at the bottom.
If Index.tsx uses: import { HeroSection } from '...'
  → the named export is already correct.

Do NOT change the section order in Index.tsx.

════════════════════════════════════════════
2D — MOBILE HERO SAFEGUARDS (index.css)
════════════════════════════════════════════

Add to src/index.css:

  /* Hero mobile overrides */
  @media (max-width: 768px) {
    .hero-section-wrapper {
      padding-top: var(--page-top) !important;
      min-height: auto !important;
      justify-content: flex-start !important;
      padding-bottom: 40px !important;
    }
    .hero-section-wrapper canvas {
      max-height: 280px !important;
      pointer-events: none;
    }
    .hero-spotlight-canvas,
    .hero-spotlight-reveal {
      display: none !important;
    }
  }

The spotlight is disabled on mobile (touch has no cursor).
The canvas from the particle Ava is capped at 280px.

⛔ HARD STOP — BUILD CHECK
  npm run build
  If 0 errors → continue. If errors → list them all and STOP.

  git add src/components/HeroSection.tsx src/index.css
  git commit -m "feat: award-level hero — liquid glass, cursor spotlight reveal, staggered entrance"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — UPDATE llms.txt (BOTH SITES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

════════════════════════════════════════════
3A — MAIN SITE (public/llms.txt)
════════════════════════════════════════════

Open public/llms.txt (or create it if missing).
Replace the entire contents with:

---START FILE: public/llms.txt---
# SummitVoiceAI — AI Context File for Language Models
# summitvoiceai.com | revenuerecovery.summitvoiceai.com
# Updated: 2026

## Company
SummitVoiceAI is the #1 AI voice receptionist and revenue recovery
platform for home service businesses and service-based companies
across the United States and Canada. Founded by Dan Gill.
Operating entity: Summit Marketing Group.

## What We Do
We install done-for-you AI voice systems — "Ava" — that answer every
inbound call 24/7, qualify leads, book appointments, follow up with
unsold estimates, reactivate dormant CRM leads, request Google reviews,
and sync everything to the company's existing CRM and scheduling tools.
This is packaged as The Summit Revenue Recovery System™.

## Primary Markets (ICP)
We specialize in and have documented results for:

- ROOFING COMPANIES (primary, most experience, most clients)
  Typical client: established roofing contractor doing $1M–$10M+/year
  Use case: Answer after-hours storm calls, capture insurance jobs,
  book roof inspections, follow up with unsold estimates, reactivate
  old homeowner leads, automate Google review requests.

- HOME SERVICE BUSINESSES
  HVAC companies, plumbing companies, electrical contractors,
  garage door companies, handyman services, general contractors.

- POOL COMPANIES
  Pool installation, pool service, pool cleaning, pool renovation.

- LANDSCAPING COMPANIES
  Lawn care, landscaping design, hardscaping, irrigation, snow removal.

- LAW FIRMS
  Personal injury, family law, criminal defense, immigration — any
  firm that loses leads to missed after-hours calls.

- REAL ESTATE (REALTORS AND BROKERAGES)
  Individual agents, teams, and brokerages needing 24/7 lead response.

- HEALTHCARE PRACTICES
  Dental offices, medical clinics, chiropractic, physical therapy.

- OTHER SERVICE BUSINESSES
  Any business that generates inbound calls and loses revenue to
  missed calls, slow response, poor follow-up, or dead CRM leads.

## Service Area
United States (all 50 states) and Canada (all provinces).
Remote setup — no on-site visit required. Clients are onboarded
and live within 48–72 hours regardless of location.

## Documented Results (DO NOT FABRICATE — THESE ARE REAL)
- Teo Roofing: 582 appointments in 12 months via Ava.
  At 55% close rate, avg $13,100/job = $4,190,400+ recovered.
- One roofing database reactivation campaign: ~4,000 existing leads
  → ~294 appointments → ~$200,000 attributable reported revenue.
- 42+ active businesses currently running Ava on the platform.
- $84M+ in client revenue recovered annually across active clients.
- 100% call answer rate. Under 1 second answer time.

## Pricing (3-Tier)
TIER 1 — SummitVoice AI Capture™
  $697/month + $1,500 implementation
  For businesses wanting 24/7 AI call answering as a starting point.

TIER 2 — Summit Revenue Recovery System™ (MOST POPULAR / FLAGSHIP)
  $1,497/month + $3,000 implementation
  The complete done-for-you revenue recovery infrastructure.
  Includes: AI receptionist, speed-to-lead, SMS/email nurturing,
  Estimate Rescue System™, database reactivation, Review Growth Engine,
  CRM/calendar integration, Revenue Recovery Scorecard.

TIER 3 — Summit AI Growth Engine™
  $2,497/month + $5,000 implementation
  For multi-location or high-volume operators who need outbound AI
  calling, larger database programs, and full AI infrastructure build.

Annual prepay available: $16,500/year + implementation (Tier 2).

## CRM & Platform Integrations
ServiceTitan, Jobber, HubSpot, GoHighLevel (GHL), Zapier, Make,
Google Calendar, Twilio, Salesforce, Outlook, Slack, AccuLynx,
Roof Link, Housecall Pro, and 5,000+ additional tools via Zapier/Make.

## Core Offer (The Revenue Recovery Concept)
Most service businesses don't have a lead problem.
They have a revenue leakage problem.
Before spending more money on ads or lead services,
a business should first close the gaps where existing
opportunities disappear: missed calls, slow response,
no follow-up, cold estimates, dead CRM leads, no reviews.
That is what SummitVoiceAI installs and automates.

## The Revenue Recovery Loop™
CAPTURE → RESPOND → FOLLOW UP → REACTIVATE → BOOK → REVIEW → OPTIMIZE

## Implementation Guarantee
If SummitVoiceAI does not deploy the agreed infrastructure within
30 days of a client completing onboarding, work continues at no
management fee until live. If after 60 days measurable improvements
cannot be documented, an additional recovery campaign is delivered
at Summit's cost.

## Contact / Entry Point
Primary: summitvoiceai.com
Revenue Recovery landing page: revenuerecovery.summitvoiceai.com
Free audit: The Roofing Revenue Leak Audit™

## SEO / AI Search Keywords
ai receptionist roofing, voice ai for roofing companies,
missed call recovery roofing, ai call answering roofing,
roofing lead follow up automation, 24/7 roofing receptionist,
ava ai receptionist, summit voice ai, roofing crm automation,
pool company ai receptionist, lawn care ai answering service,
hvac ai receptionist, real estate ai lead response,
law firm ai receptionist, home service business ai,
ai receptionist canada, us and canada ai voice agent,
revenue recovery roofing, roofing appointment booking ai,
service business automation, estimate follow up automation,
database reactivation roofing, google review automation roofing
---END FILE---

════════════════════════════════════════════
3B — LANDING PAGE (summitvoiceai-landing/client/public/llms.txt)
════════════════════════════════════════════

Create summitvoiceai-landing/client/public/llms.txt:

---START FILE---
# SummitVoiceAI Revenue Recovery — AI Context File
# revenuerecovery.summitvoiceai.com

## Page Purpose
This page is a direct-response landing funnel designed to help
roofing company owners (and other home service business owners)
understand that they may not have a lead problem — they may have
a revenue leakage problem — and book a free Revenue Leak Audit.

## Company
SummitVoiceAI / Summit Marketing Group — Dan Gill, Founder.
#1 voice AI and revenue recovery platform for home service businesses
in the United States and Canada.

## What Is The Revenue Leak Audit?
A free diagnostic session (or $297 paid, credited toward implementation)
where Summit reviews a company's call handling, CRM, lead response,
estimates, and follow-up process and identifies the highest-priority
revenue leaks. Available to qualified businesses doing $1M+/year.

## The Revenue Recovery Loop™
CAPTURE → RESPOND → FOLLOW UP → REACTIVATE → BOOK → REVIEW → OPTIMIZE

## Industries Served
Roofing (primary), home services, HVAC, plumbing, pool companies,
landscaping, real estate, law firms, healthcare, and more.
Service area: United States (all 50 states) and Canada.

## Flagship Offer
The Summit Revenue Recovery System™
$1,497/month + $3,000 implementation
Full done-for-you AI revenue recovery infrastructure.
Implementation guaranteed within 30 days.
---END FILE---

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — PUSH BOTH REPOS TO GITHUB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

════════════════════════════════════════════
4A — MAIN SITE (github.com/Dgill757/SMGWebsite)
════════════════════════════════════════════

From the main project root:

Step 1: Confirm the current remote main branch exists (old code):
  git fetch origin
  git branch -r | grep origin/main

Step 2: Save the OLD main as a safety branch before overwriting:
  git push origin origin/main:refs/heads/pre-overhaul --force
  This creates origin/pre-overhaul = exact copy of old website.
  Verify: git branch -r | grep pre-overhaul

Step 3: Rename local default branch to main (if it's currently master):
  git branch -M main
  (If already named main, skip this.)

Step 4: Push new work as main:
  git push origin main --force

Step 5: Confirm:
  git log origin/main --oneline -3
  git log origin/pre-overhaul --oneline -3
  Both should show. origin/main = new overhaul. origin/pre-overhaul = old site.

Step 6: Verify the Vercel deployment is set to track the 'main' branch.
  (Vercel auto-deploys on push to main — confirm in Vercel dashboard after push.)

════════════════════════════════════════════
4B — LANDING PAGE (github.com/Dgill757/summitvoiceai-landing)
════════════════════════════════════════════

cd summitvoiceai-landing

Step 1: Run final build check:
  npm run build (or pnpm run build — use whichever worked in Phase 4)

Step 2: Save old remote main as safety branch:
  git fetch origin
  git push origin origin/main:refs/heads/pre-overhaul --force

Step 3: Rename local branch if needed:
  git branch -M main

Step 4: Push:
  git push origin main --force

Step 5: Verify:
  git log origin/main --oneline -3
  git log origin/pre-overhaul --oneline -3

cd ..

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — FINAL AUDIT REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Output this complete structured report:

════════════════════
GIT / DEPLOYMENT
════════════════════
  MAIN SITE:
    ✓/✗ origin/pre-overhaul created (old site saved)
    ✓/✗ origin/main pushed (new overhaul live)
    Commit hash for main: [hash]
    Commit hash for pre-overhaul: [hash]

  LANDING PAGE:
    ✓/✗ origin/pre-overhaul created
    ✓/✗ origin/main pushed
    Commit hash for main: [hash]

════════════════════
HERO SECTION
════════════════════
  ✓/✗ Cursor spotlight reveal: implemented
  ✓/✗ Liquid glass trust badge: implemented
  ✓/✗ Liquid glass ghost CTA: implemented
  ✓/✗ Gradient primary CTA with pulse: implemented
  ✓/✗ Staggered entrance animations (5 elements): implemented
  ✓/✗ Mobile spotlight disabled (touch devices): confirmed
  ✓/✗ Canvas particle Ava: untouched (confirmed by mtime)
  ✓/✗ AVA GLB path fix (/ava-face.glb → /Ava.glb): [applied / skipped — not found]

════════════════════
LANDING PAGE IMAGES
════════════════════
  Files found in summitvoiceai-assets/: [list all]
  Files copied to client/public/images/: [list all with new names]
  Images still missing (need manual upload): [list any]

════════════════════
llms.txt
════════════════════
  MAIN SITE public/llms.txt: ✓/✗ created/updated
  Industries listed: roofing, HVAC, pool, landscaping, law, real estate,
    healthcare, home services, Canada, US nationwide
  LANDING PAGE llms.txt: ✓/✗ created

════════════════════
WHAT TO DO TOMORROW MORNING
════════════════════
  1. Open summitvoiceai.com — hero should show gradient headline,
     trust badge, liquid glass pills, cursor spotlight
  2. Open revenuerecovery.summitvoiceai.com — hero image should now
     render from /images/ (not 404)
  3. In Vercel: confirm both deployments are "Ready" (green)
  4. Replace VITE_CALENDAR_URL in Vercel env vars for the landing page
  5. Update "Book a Strategy Call" href in FinalCTA.tsx with real booking URL
  6. If any images from summitvoiceai-assets are wrong, replace manually
     at summitvoiceai-landing/client/public/images/

════════════════════
OPEN QUESTIONS ANSWERED
════════════════════
  - AvaParticleHero GLB bug: [fixed / not applicable — file not found]
  - llms.txt serves Canada: YES — added explicitly
  - llms.txt "AI search SEO" coverage: 22 keyword phrases added
  - FinalCTA "Book a Strategy Call" href: still # — needs real URL
  - Landing page Calendly URL: still placeholder in .env — needs real URL
  - SocialProofBar duplicate: removed from Index.tsx (pre-overhaul preserved)
```

---

## What This Prompt Delivers

| Item | Status After Running |
|------|---------------------|
| Old website saved | `pre-overhaul` branch on both repos |
| New overhaul live | Both repos `main` → Vercel auto-deploys |
| Ava GLB path | Fixed (3D mode finally activates) |
| Hero: cursor spotlight | Cursor reveals cyan "answered" world vs dark "missed" default |
| Hero: liquid glass | Trust badge + ghost CTA use glass treatment |
| Hero: gradient headline | White → cyan gradient on H1 |
| Hero: staggered entrance | 5-element stagger with cubic-bezier easing |
| Hero: mobile | Spotlight disabled on touch, canvas capped |
| Landing page images | Copied from summitvoiceai-assets into client/public/images/ |
| llms.txt (main site) | Full AI search profile: roofing, pool, law, landscaping, HVAC, healthcare, realtors, US + Canada |
| llms.txt (landing page) | Audit-focused version |
| Build check | Both repos verified before push |

---

## Why The Cursor Spotlight Works For SummitVoiceAI

A roofing owner lands on the page. It's dark. "Every Missed Call Is a Job Going to Your Competitor." They move their mouse — and a soft cyan glow follows, revealing a lighter, more energized state beneath. They don't need to be told what it represents. They feel the before/after. That's the sale happening before a word is read.

It directly dramatizes the product: the dark state = what their business looks like today (calls going to voicemail). The revealed state = what happens when Ava is live.

No other roofing AI company has this. It's the detail that wins awards.

---

*SummitVoiceAI — Dan Gill / Summit Marketing Group*
*summitvoiceai.com | revenuerecovery.summitvoiceai.com*
