# SummitVoiceAI — Phase 6: Performance, Abstract Hero & Site Experience
### PageSpeed 30→80+, Abstract Voice Waveform, 5 Premium Components, Landing Page CRO Audit

> **This is the final experience prompt.** It fixes the PageSpeed score first
> (biggest lever), then rebuilds the hero around an abstract voice waveform,
> then places 5 premium components where they create maximum impact,
> then audits the landing page as a conversion specialist.
> Run in one pass. Do not skip phases.

---

## What You're Starting With (From The Live Audit)
- PageSpeed: ~30/100
- Demo videos: 25MB, 54MB, 36MB, 25MB = **144MB on first load**
- Three.js + AvaParticleHero bundle: **~967KB** loading for a visual that reads as a starfield
- A stray `gptengineer.js` script loading on every page
- Hero visual: sophisticated code, poor visual output — particle density can't hold a face at distance
- The fix for all three: kill Three.js, compress videos, replace with lighter canvas waveform

---

```
WORKING DIRECTORY:
C:\Users\DanGi\Downloads\SummitVoiceAI\MyCompanies\SummitVoiceAi\SMG_WEBSITE_MAIN\SMGWebsite-main\SMGWebsite-main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN INTELLIGENCE — INTERNALIZE THESE PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You have access to 5 premium component patterns to learn from and apply.
Study each, understand what makes it special, then apply surgically.

COMPONENT 1 — VOXEL TOPOGRAPHY GRID (learn from this)
  Canvas-based isometric 3D voxel landscape. Mouse proximity raises tiles.
  Wave animation via sin/cos. Performance-optimized with LUT color tables.
  Painter's algorithm for back-to-front rendering. 60fps target.
  The magic: it feels like terrain that responds to presence.
  SummitVoiceAI application: primaryColor="#00D9FF", wireColor="rgba(0,217,255,0.2)"
  Place between HeroSection and IntegrationMarquee as a cinematic divider.

COMPONENT 2 — WEBGL SHADER HERO (learn from this)
  WebGL2 fragment shader — cosmic nebula/cloud animation. Interactive via
  pointer uniforms. The GLSL shader creates fluid organic motion impossible
  with CSS. Extremely light once GPU-accelerated.
  SummitVoiceAI application: Use the WebGL canvas ONLY (no hero wrapper/copy).
  Apply as the background of FinalCTA section — makes the closing moment cinematic.

COMPONENT 3 — BACKGROUND PATHS (learn from this)
  36 framer-motion animated SVG paths that drift across the viewport.
  pathLength animation from 0.3→1, pathOffset loops, creates flowing line art.
  Very subtle, very premium. Works best behind text-heavy sections.
  SummitVoiceAI application: Apply behind PricingSection.
  Change stroke to "rgba(0,217,255,0.06)" so it's almost subliminal.

COMPONENT 4 — AETHER FLOW PARTICLE NETWORK (learn from this)
  Canvas particle system with connection lines. Mouse repels particles.
  Distance-based connection rendering. Color near cursor vs distant differs.
  SummitVoiceAI application: Extract canvas only, apply to TrackRecord section.
  Change particle color to "rgba(0,217,255,0.55)", connection "rgba(0,217,255,0.15)".

COMPONENT 5 — ANIMATED SHADER (liquid glass CTAs + stagger patterns)
  Full trust-badge → headline → sub → CTA animation pipeline.
  Orange palette — extract the animation TIMING and STRUCTURE only.
  The fade-in-up stagger at 200ms/400ms/600ms/800ms delays is the pattern.
  Already applied to our hero, but learn from the button hover states.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 0 — PERFORMANCE TRIAGE (DO THIS FIRST)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This phase alone could move PageSpeed from 30 to 60+.
Do ALL of these before touching any component code.

════════════════════════════════════════════
0A — KILL THREE.JS AND THE PARTICLE SYSTEM
════════════════════════════════════════════

The AvaParticleHero + Three.js chunk = ~967KB of JS loading on every
page visit for a visual that doesn't work. Remove it entirely.

Step 1: Open src/pages/Index.tsx.
  Search for any of these imports and DELETE them:
    import AvaParticleHero from ...
    import { AvaParticleScene } from ...
    import * as THREE from ...
    import { Canvas } from '@react-three/fiber'
    import { useGLTF } from '@react-three/drei'

  Delete the corresponding JSX elements from the return statement.

Step 2: Search src/ recursively for these packages and remove their usage:
    @react-three/fiber
    @react-three/drei
    three

Step 3: Open package.json. Remove from dependencies:
    "three": "..."
    "@react-three/fiber": "..."
    "@react-three/drei": "..."

Step 4: Run: npm uninstall three @react-three/fiber @react-three/drei

Step 5: Check if AvaParticleHero.tsx or AvaParticleScene.tsx still exist.
  If they do: move them to src/_archive/ (do not delete — user keeps them).

RESULT: The single heaviest JS chunk gone. Bundle shrinks ~967KB raw.

════════════════════════════════════════════
0B — REMOVE gptengineer.js
════════════════════════════════════════════

Open index.html at the project root.
Search for "gptengineer" — there is a <script> tag loading this.
Delete the entire <script> line.
This is leftover scaffolding from the initial project generation.
It loads on every page, does nothing, and costs a network round-trip.

════════════════════════════════════════════
0C — FIX VIDEO LOADING (144MB → ~20MB)
════════════════════════════════════════════

The 4 demo videos (combined 144MB) are the #1 PageSpeed killer.

Step 1: Open src/components/DemoCallsSection.tsx.
  Find all <video> elements.
  For EACH video element:
    a) Add: preload="none"  ← was "metadata" or missing — change to "none"
    b) Add: loading="lazy"  ← if not present
    c) Keep: autoPlay muted loop playsInline (for when they DO play)
    d) Wrap the entire <video> element in an IntersectionObserver-based
       lazy mount: only insert the video into the DOM when the section
       is within 200px of the viewport.

  Use this pattern for each video card:
    const [shouldLoad, setShouldLoad] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setShouldLoad(true); },
        { rootMargin: '200px' }
      );
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, []);
    
    return (
      <div ref={ref}>
        {shouldLoad && <video preload="none" ...>...</video>}
      </div>
    );

Step 2: Print these FFmpeg commands to the terminal output
  so the user can compress their videos themselves.
  Do NOT try to run FFmpeg — just print these:

  ═══════════════════════════════════════════════
  VIDEO COMPRESSION — RUN THESE MANUALLY
  Open PowerShell or Terminal and run:
  ═══════════════════════════════════════════════
  
  Install FFmpeg first if not installed:
  https://ffmpeg.org/download.html (Windows: download and add to PATH)
  OR use Handbrake (GUI): https://handbrake.fr (free, drag and drop)
  
  FFmpeg commands (run from the public/ or assets/ folder):
  
  ffmpeg -i Roofing-Demo.mp4 -vcodec libx264 -crf 26 -preset slow -vf "scale=1280:-2" -an -movflags +faststart Roofing-Demo-compressed.mp4
  
  ffmpeg -i Deck-Landscaping-demo.mp4 -vcodec libx264 -crf 26 -preset slow -vf "scale=1280:-2" -an -movflags +faststart Deck-Landscaping-demo-compressed.mp4
  
  ffmpeg -i Pool-Demo.mp4 -vcodec libx264 -crf 26 -preset slow -vf "scale=1280:-2" -an -movflags +faststart Pool-Demo-compressed.mp4
  
  ffmpeg -i Real-Estate-Demo.mp4 -vcodec libx264 -crf 26 -preset slow -vf "scale=1280:-2" -an -movflags +faststart Real-Estate-Demo-compressed.mp4
  
  Target output: 3-8MB per video (from 25-54MB).
  -crf 26 = good quality. Raise to 30 for smaller files.
  -an = no audio (demo videos don't need it)
  -movflags +faststart = critical for web (playback starts before full download)
  
  After compressing: replace original files with compressed versions,
  or update video src paths in DemoCallsSection.tsx.
  ═══════════════════════════════════════════════

════════════════════════════════════════════
0D — LAZY LOAD HEAVY BELOW-FOLD SECTIONS
════════════════════════════════════════════

Open src/pages/Index.tsx.

Add React.lazy imports for these heavy sections (they are below the fold
and should NOT block initial render):

  const AnimatedStats    = React.lazy(() => import('@/components/AnimatedStats'));
  const TrackRecord      = React.lazy(() => import('@/components/TrackRecord'));
  const RoofingTestimonials = React.lazy(() => import('@/components/RoofingTestimonials'));
  const DemoCallsSection = React.lazy(() => import('@/components/DemoCallsSection'));

Wrap the lazy sections in <Suspense fallback={<div style={{height:'400px'}}/>}>

Keep these as EAGER (not lazy) — they appear above or near the fold:
  HeroSection, Navbar, IntegrationMarquee, AvaComparison

════════════════════════════════════════════
0E — ADD PRELOAD HINTS TO index.html
════════════════════════════════════════════

Open index.html. Add these inside <head> (before any existing link tags):

  <!-- Preload critical fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

  <!-- Preload the integration logos (they're in the critical path) -->
  <link rel="preload" href="/logos/service-titan-logo-cropped.png" as="image" />

════════════════════════════════════════════
0F — ADD IMAGE LAZY LOADING
════════════════════════════════════════════

Search src/ for all <img> elements that do NOT already have loading="lazy".
Add loading="lazy" to every <img> that is below the fold (not in HeroSection
or Navbar).

Add to src/index.css:
  img { max-width: 100%; height: auto; }

⛔ HARD STOP — BUILD CHECK AFTER PERFORMANCE PHASE
  npm run build
  Note: build output size before and after (compare JS chunk sizes).
  If 0 errors → continue. If errors → list and STOP.

  git add -A
  git commit -m "perf: remove Three.js (-967KB), lazy load videos/sections, kill gptengineer.js"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — ABSTRACT VOICE WAVEFORM HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace the particle Ava with an abstract animated voice waveform.
No Three.js. No GLB. Pure canvas. ~3KB of code. 60fps.
This is the right choice: voice is the product, waveform IS the brand.

════════════════════════════════════════════
1A — CREATE AvaWaveform.tsx
════════════════════════════════════════════

Create src/components/AvaWaveform.tsx:

---START FILE: src/components/AvaWaveform.tsx---
import React, { useEffect, useRef, useCallback } from 'react';

interface Wave {
  frequency: number;
  amplitude: number;
  speed: number;
  phase: number;
  color: string;
  lineWidth: number;
  glow: boolean;
}

const WAVES: Wave[] = [
  { frequency: 0.0025, amplitude: 90, speed: 0.55, phase: 0,    color: 'rgba(0,217,255,0.10)', lineWidth: 1.5, glow: false },
  { frequency: 0.0038, amplitude: 68, speed: 0.72, phase: 1.2,  color: 'rgba(0,217,255,0.22)', lineWidth: 1.5, glow: false },
  { frequency: 0.0052, amplitude: 50, speed: 0.92, phase: 2.5,  color: 'rgba(0,217,255,0.55)', lineWidth: 2.0, glow: true  },
  { frequency: 0.0068, amplitude: 34, speed: 1.15, phase: 0.8,  color: 'rgba(124,58,237,0.35)', lineWidth: 1.5, glow: false },
  { frequency: 0.0085, amplitude: 22, speed: 1.40, phase: 3.8,  color: 'rgba(200,180,255,0.18)', lineWidth: 1.0, glow: false },
];

export function AvaWaveform() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef(0);
  const timeRef      = useRef(0);
  const mouseRef     = useRef({ x: -999, y: -999, smoothX: -999, smoothY: -999 });
  const spikeRef     = useRef({ active: false, intensity: 0, nextAt: Date.now() + 5000 });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const drawWave = useCallback((
    ctx: CanvasRenderingContext2D,
    wave: Wave,
    w: number,
    h: number,
    t: number,
    mouseInfluence: number,
    spikeMod: number
  ) => {
    const centerY = h * 0.5;
    const amp = wave.amplitude * mouseInfluence * spikeMod;

    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const mx_ratio = mouseRef.current.smoothX / w;
      const proximity = 1 - Math.abs((x / w) - mx_ratio) * 2;
      const localAmp  = amp * (1 + Math.max(0, proximity) * 0.7);
      const y = centerY + Math.sin(x * wave.frequency + t * wave.speed + wave.phase) * localAmp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    if (wave.glow) {
      ctx.shadowBlur  = 16;
      ctx.shadowColor = '#00D9FF';
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = wave.color;
    ctx.lineWidth   = wave.lineWidth;
    ctx.stroke();
    ctx.shadowBlur  = 0;
  }, []);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    resize();
    const obs = new ResizeObserver(resize);
    obs.observe(container);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouseRef.current.x = -999; mouseRef.current.y = -999; };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    const tick = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = container.offsetWidth;
      const h = container.offsetHeight;

      timeRef.current += 0.016;
      const t = timeRef.current;

      // Smooth mouse lerp
      mouseRef.current.smoothX += (mouseRef.current.x - mouseRef.current.smoothX) * 0.06;
      mouseRef.current.smoothY += (mouseRef.current.y - mouseRef.current.smoothY) * 0.06;

      // Breathing envelope
      const breathe = 0.82 + 0.18 * Math.sin(t * 0.45);

      // Mouse influence on amplitude
      const mouseActive = mouseRef.current.x > 0;
      const mY_ratio    = mouseActive ? mouseRef.current.smoothY / h : 0.5;
      const mouseAmp    = mouseActive ? (1 + (1 - mY_ratio) * 0.55) : 1;
      const influence   = breathe * mouseAmp;

      // Spike system (simulates "incoming call answered")
      const spike = spikeRef.current;
      let spikeMod = 1;
      if (!spike.active && Date.now() > spike.nextAt) {
        spike.active    = true;
        spike.intensity = 1;
      }
      if (spike.active) {
        spikeMod         = 1 + spike.intensity * 2.2;
        spike.intensity -= 0.045;
        if (spike.intensity <= 0) {
          spike.active = false;
          spike.nextAt = Date.now() + 5000 + Math.random() * 4000;
        }
      }

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Draw waves back to front
      WAVES.forEach(wave => drawWave(ctx, wave, w, h, t, influence, spikeMod));

      // Center hairline accent
      ctx.beginPath();
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.5);
      ctx.strokeStyle = 'rgba(0,217,255,0.07)';
      ctx.lineWidth   = 1;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      obs.disconnect();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [resize, drawWave]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'auto',
        cursor: 'crosshair',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      {/* Subtle radial glow behind the waveform center */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse 70% 40% at 50% 50%,
            rgba(0,217,255,0.04) 0%,
            transparent 70%),
          radial-gradient(ellipse 40% 60% at 75% 50%,
            rgba(124,58,237,0.03) 0%,
            transparent 65%)
        `,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
---END FILE---

════════════════════════════════════════════
1B — UPDATE HeroSection.tsx TO USE AvaWaveform
════════════════════════════════════════════

Open src/components/HeroSection.tsx.

Step 1: Add import at the top:
  import { AvaWaveform } from '@/components/AvaWaveform';

Step 2: Inside the HeroSection return JSX, add <AvaWaveform /> as the
  FIRST child of the outermost section element (position absolute, fills
  the section):
  
  <section className="hero-section-wrapper" style={{ position:'relative', ... }}>
    <AvaWaveform />                           {/* ← ADD THIS */}
    <canvas ... />                            {/* spotlight canvas if present */}
    <div ref={revealRef} ... />               {/* spotlight reveal if present */}
    <div style={{ position:'relative', zIndex:10, ... }}>
      {/* existing hero content */}
    </div>
  </section>

Step 3: Remove any leftover particle canvas elements or refs that were
  part of the old AvaParticleHero. Read the file and remove them.
  The ONLY canvas now is AvaWaveform (the hero visual) and the
  spotlight canvas (cursor reveal) — both are intentional and kept.

Step 4: In the hero content column, update or add a small callout that
  names the visual for context. Add below the trust pills:

  <p style={{
    marginTop: '18px',
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.18)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontStyle: 'italic',
  }}>
    ↑ This is what Ava sounds like. Move your cursor through the wave.
  </p>

Step 5: In src/index.css add:

  /* AvaWaveform — mobile */
  @media (max-width: 768px) {
    /* On mobile, the waveform still renders but is de-emphasized */
    .hero-section-wrapper > div[aria-hidden] canvas {
      opacity: 0.55;
    }
  }

⛔ BUILD CHECK:
  npm run build
  Expected: zero errors, bundle is significantly smaller (Three.js gone)
  
  git add -A
  git commit -m "feat: replace Three.js particle hero with abstract voice waveform canvas"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — INTEGRATE 5 PREMIUM COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Apply each component exactly where specified.
If a section doesn't exist, skip it — do NOT create sections to use components.
The placement map: component fits the existing content, not vice versa.

════════════════════════════════════════════
2A — VOXEL TOPOGRAPHY GRID
Place: Between HeroSection and IntegrationMarquee
════════════════════════════════════════════

Create src/components/VoxelDivider.tsx:

---START FILE: src/components/VoxelDivider.tsx---
'use client';
import React, { useEffect, useRef } from 'react';

export function VoxelDivider() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef     = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let raf = 0, width = 0, height = 0, time = 0;
    const TILE      = 22;
    const MAX_H     = 42;
    const PRIMARY   = '#00D9FF';
    const WIRE      = 'rgba(0,217,255,0.18)';
    const BG        = '#050505';
    const tileW     = TILE * 0.866025;
    const tileH     = TILE * 0.5;
    const maxRSq    = 200 * 200;
    const invMH     = 1 / (MAX_H + 30);

    // Parse color
    const r = parseInt(PRIMARY.slice(1,3),16);
    const g = parseInt(PRIMARY.slice(3,5),16);
    const b = parseInt(PRIMARY.slice(5,7),16);
    const leftColor  = `rgba(${Math.floor(r*.42)},${Math.floor(g*.42)},${Math.floor(b*.42)},0.85)`;
    const rightColor = `rgba(${Math.floor(r*.62)},${Math.floor(g*.62)},${Math.floor(b*.62)},0.85)`;

    const lut: string[] = Array(101).fill('').map((_,i) => {
      const rt = i/100;
      return `rgb(${Math.floor(r*(0.5+rt*0.5))},${Math.floor(g*(0.5+rt*0.5))},${Math.floor(b*(0.5+rt*0.5))})`;
    });

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio||1,2);
      width  = container.clientWidth;
      height = container.clientHeight;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr,dpr);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    handleResize();

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };
    const onLeave = () => { mouseRef.current.targetX = -1000; mouseRef.current.targetY = -1000; };
    window.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });

    const draw = () => {
      time += 0.012;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.28;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.28;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width  / tileW) + 4;
      const rows = Math.ceil(height / tileH) + 8;
      const ox = width * 0.5;
      const oy = height * 0.42;
      const sR = -Math.floor(rows/2);
      const eR =  Math.ceil(rows/2);
      const sC = -Math.floor(cols/2);
      const eC =  Math.ceil(cols/2);

      for (let row = sR; row < eR; row++) {
        for (let col = sC; col < eC; col++) {
          const ix = ox + (col - row) * tileW;
          const iy = oy + (col + row) * tileH;
          const dx = ix - mx, dy = iy - my;
          const dSq = dx*dx + dy*dy;
          const w1  = Math.sin(time*2 + col*0.28 + row*0.28);
          const w2  = Math.cos(time*1.4 + col*0.18 - row*0.32);
          let   h   = (w1+w2+2)*0.25*MAX_H;
          if (dSq < maxRSq) { const inf = 1-Math.sqrt(dSq)/200; h += inf*inf*30; }
          const py = iy - h;
          if (ix+tileW<0||ix-tileW>width||py+h+12<0||py-tileH>height) continue;
          const bot = h+12;
          ctx.beginPath();
          ctx.moveTo(ix-tileW,py); ctx.lineTo(ix,py+tileH);
          ctx.lineTo(ix,py+tileH+bot); ctx.lineTo(ix-tileW,py+bot);
          ctx.closePath(); ctx.fillStyle=leftColor; ctx.fill();
          ctx.beginPath();
          ctx.moveTo(ix,py+tileH); ctx.lineTo(ix+tileW,py);
          ctx.lineTo(ix+tileW,py+bot); ctx.lineTo(ix,py+tileH+bot);
          ctx.closePath(); ctx.fillStyle=rightColor; ctx.fill();
          ctx.beginPath();
          ctx.moveTo(ix,py-tileH); ctx.lineTo(ix+tileW,py);
          ctx.lineTo(ix,py+tileH); ctx.lineTo(ix-tileW,py);
          ctx.closePath();
          const lv = Math.min(1,Math.max(0.1,h*invMH));
          ctx.fillStyle = lut[(lv*100)|0]; ctx.fill();
          ctx.strokeStyle=WIRE; ctx.lineWidth=0.55; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      height: 'clamp(160px, 22vh, 260px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top fade */}
      <div style={{
        position:'absolute',top:0,left:0,right:0,
        height:'40%',
        background:'linear-gradient(to bottom,#050505,transparent)',
        zIndex:2,pointerEvents:'none',
      }}/>
      {/* Bottom fade */}
      <div style={{
        position:'absolute',bottom:0,left:0,right:0,
        height:'40%',
        background:'linear-gradient(to top,#050505,transparent)',
        zIndex:2,pointerEvents:'none',
      }}/>
      <div ref={containerRef} style={{ width:'100%', height:'100%' }}>
        <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:'100%' }}/>
      </div>
    </div>
  );
}
---END FILE---

In src/pages/Index.tsx:
  Add import: import { VoxelDivider } from '@/components/VoxelDivider';
  Place <VoxelDivider /> BETWEEN <HeroSection /> and <IntegrationMarquee />

════════════════════════════════════════════
2B — BACKGROUND PATHS behind Pricing
════════════════════════════════════════════

Create src/components/PricingPaths.tsx:

---START FILE: src/components/PricingPaths.tsx---
'use client';
import React from 'react';
import { motion } from 'framer-motion';

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    d: `M-${380-i*5*position} -${189+i*6}C-${380-i*5*position} -${189+i*6} -${312-i*5*position} ${216-i*6} ${152-i*5*position} ${343-i*6}C${616-i*5*position} ${470-i*6} ${684-i*5*position} ${875-i*6} ${684-i*5*position} ${875-i*6}`,
    width: 0.4 + i * 0.025,
    opacity: 0.05 + i * 0.018,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
        {paths.map(path => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#00D9FF"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.2, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: [0.2, path.opacity, 0.2], pathOffset: [0, 1, 0] }}
            transition={{ duration: 22 + path.id * 0.8, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </svg>
    </div>
  );
}

export function PricingPaths() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
---END FILE---

Open src/components/PricingSection.tsx.
Find the outermost section/div wrapper. Add style={{ position:'relative' }} if
it doesn't already have it.
Add <PricingPaths /> as the FIRST child inside that outermost wrapper.

Add import at top of PricingSection.tsx:
  import { PricingPaths } from '@/components/PricingPaths';

════════════════════════════════════════════
2C — PARTICLE NETWORK behind TrackRecord
════════════════════════════════════════════

Create src/components/TrackRecordParticles.tsx:

---START FILE: src/components/TrackRecordParticles.tsx---
import React, { useEffect, useRef } from 'react';

export function TrackRecordParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let raf = 0;
    const mouse = { x: -999, y: -999 };
    
    class Particle {
      x: number; y: number;
      dx: number; dy: number;
      size: number;
      constructor() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.dx = (Math.random() - 0.5) * 0.35;
        this.dy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 1.8 + 0.6;
      }
      update() {
        if (this.x > canvas.width || this.x < 0)  this.dx *= -1;
        if (this.y > canvas.height || this.y < 0) this.dy *= -1;
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          const f = (120-dist)/120;
          this.x -= dx/dist*f*3.5;
          this.y -= dy/dist*f*3.5;
        }
        this.x += this.dx; this.y += this.dy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(0,217,255,0.55)';
        ctx.fill();
      }
    }

    const resize = () => {
      canvas.width  = canvas.parentElement?.offsetWidth  || 800;
      canvas.height = canvas.parentElement?.offsetHeight || 300;
    };
    resize();
    
    const count = Math.floor(canvas.width * canvas.height / 12000);
    const particles: Particle[] = Array.from({ length: count }, () => new Particle());
    
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);

    const connect = () => {
      const maxDist = (canvas.width / 8) ** 2;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a+1; b < particles.length; b++) {
          const dx = particles[a].x-particles[b].x;
          const dy = particles[a].y-particles[b].y;
          const dSq = dx*dx+dy*dy;
          if (dSq < maxDist) {
            const op = 0.18 * (1 - dSq/maxDist);
            ctx.strokeStyle = `rgba(0,217,255,${op})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      connect();
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity: 0.55,
      }}
    />
  );
}
---END FILE---

Open src/components/TrackRecord.tsx.
Find the outermost <section> element. Ensure it has position:'relative'.
Add <TrackRecordParticles /> as the FIRST child.

Add import:
  import { TrackRecordParticles } from '@/components/TrackRecordParticles';

All text and stat numbers in TrackRecord must have position:'relative', zIndex:1
to float above the particle canvas. Check existing styles — add z-index:1 to
the inner content div (maxWidth:'1000px',margin:'0 auto') if missing.

════════════════════════════════════════════
2D — WEBGL SHADER behind FinalCTA
════════════════════════════════════════════

Create src/components/FinalCTAShader.tsx with a simplified version
of the cosmic WebGL shader (adapted from the animated-shader-hero pattern):

---START FILE: src/components/FinalCTAShader.tsx---
import React, { useEffect, useRef } from 'react';

const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<4;i++){t+=a*noise(p);p*=2.;a*=.5;}return t;}
void main(){
  vec2 uv=(FC-.5*R)/MN;
  vec3 col=vec3(0);
  float bg=fbm(vec2(uv.x*2.+T*.3,-uv.y));
  for(float i=1.;i<8.;i++){
    uv+=.08*cos(i*vec2(.1+.01*i,.8)+i*i+T*.4+.1*uv.x);
    vec2 p=uv;float d=length(p);
    // Cyan-violet palette instead of warm
    col+=.0015/d*(cos(sin(i)*vec3(0.2,1.8,2.8)+1.)*vec3(0.,1.,1.)+vec3(0.,.3,.5));
    float b=noise(i+p+bg*1.5);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(0.,bg*.1,bg*.18),d);
  }
  O=vec4(col*0.85,1);
}`;

const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

export function FinalCTAShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio||1,1.5);
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0,0,canvas.width,canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT); gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG); gl.compileShader(fs);
    
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.warn('FinalCTAShader GLSL error:', gl.getShaderInfoLog(fs));
      gl.deleteShader(vs); gl.deleteShader(fs); return;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes  = gl.getUniformLocation(prog, 'resolution');
    const uTime = gl.getUniformLocation(prog, 'time');

    const tick = (now: number) => {
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, opacity: 0.45,
      }}
    />
  );
}
---END FILE---

Open src/components/FinalCTA.tsx.
The outermost <section> already has position:'relative'.
Add <FinalCTAShader /> as the FIRST child of the section.
Add import: import { FinalCTAShader } from '@/components/FinalCTAShader';

Ensure all FinalCTA content divs have position:'relative', zIndex:1.

⛔ BUILD CHECK:
  npm run build
  
  git add -A
  git commit -m "feat: 4 premium visual components — voxel divider, pricing paths, particles, WebGL CTA"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — LANDING PAGE: CRO + COPY AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are now acting as a conversion rate optimization specialist
and direct-response copywriter with 15 years of B2B sales funnel
experience. Your job is to audit summitvoiceai-landing/client/src/pages/Home.tsx
and identify every gap between the designed funnel and what is actually
rendering. Fix everything you find.

════════════════════════════════════════════
3A — READ FIRST, AUDIT SECOND
════════════════════════════════════════════

Read the entire Home.tsx file before writing anything.
Then generate an internal audit report covering:

1. THE PSYCHOLOGICAL FUNNEL — is it complete?
   Required sequence:
   a) Hero: "Revenue Recovery" positioning — NOT "AI receptionist"
   b) Leak section: problem → "leaking bucket" visual
   c) Calculator: inputs → results → ROI sequence
   d) Loop: Revenue Recovery Loop™ (7 nodes: CAPTURE→OPTIMIZE)
   e) Systems: 4 system cards
   f) Proof: Teo Roofing result (582 appts, $4.1M+)
   g) Implementation timeline (30-day)
   h) Pricing: 3 tiers ($697/$1,497/$2,497)
   i) Guarantee: official language
   j) FAQ: 6 roofing questions
   k) Final CTA + booking form

2. THE ROI SEQUENCE — is the 5-part post-calculator sequence present?
   A) "Even 10% recovery scenario" card
   B) "1 extra job per month" grid (3 columns)
   C) "Payback view" paragraph
   D) "1 job every 2 months" amber card
   E) "CRM teaser" + "Real question" + CTA button

3. TEXT READABILITY — check ALL of these:
   a) Legal disclaimer at bottom of calculator: is it visible?
      Must NOT be: font-size < 9px, opacity < 0.55, color contrast < 3:1 on dark bg
   b) Small labels inside the ROI cards (9px uppercase): readable against their bg?
   c) The .hero-footnote paragraph: opacity not below 0.45
   d) The .leak-section paragraph: opacity not below 0.5
   e) All <small> tags: minimum 9px, opacity minimum 0.5
   f) Guarantee disclaimer <small>: must be visible, not microscopic

4. CALCULATOR MATH — verify these formulas are correct:
   calc.daily   = missedCalls × jobValue × (closeOutOfTen/10)
   calc.weekly  = calc.daily × 5
   calc.monthly = calc.daily × 21.67
   calc.annual  = calc.daily × 260
   calc.tenPercent    = calc.annual × 0.1
   calc.oneJobAnnual  = jobValue × 12
   calc.oneJobRatio   = calc.oneJobAnnual / (MONTHLY_FEE×12 + IMPLEMENTATION_FEE)
   calc.jobsToFee     = (MONTHLY_FEE×12 + IMPLEMENTATION_FEE) / jobValue
   calc.everyTwoMonths = jobValue × 6
   calc.everyTwoMonthsRatio = calc.everyTwoMonths / (MONTHLY_FEE×12 + IMPLEMENTATION_FEE)
   calc.lowContacts  = databaseSize × 0.03
   calc.highContacts = databaseSize × 0.16
   calc.lowRevenue   = calc.lowContacts  × (closeOutOfTen/10) × jobValue
   calc.highRevenue  = calc.highContacts × (closeOutOfTen/10) × jobValue
   
   If any formula is wrong or missing, fix it.

5. MOBILE LAYOUT — check:
   a) Calculator inputs: sliders are touch-friendly (min-height 44px on mobile)
   b) ROI sequence cards: no horizontal overflow on 375px width
   c) .roi-grid: collapses to 2-column on mobile (check CSS)
   d) Hero board (pipeline UI): doesn't overflow viewport width on mobile
   e) Pricing cards: stack correctly on mobile

6. CONVERSION KILLS — look for and fix:
   a) Any CTA buttons that don't call scrollToBooking or go to booking
   b) The booking form: is VITE_CALENDAR_URL used? Does it have a fallback?
   c) Any section where the primary CTA is missing
   d) The email report form: does it have a submit handler?

════════════════════════════════════════════
3B — FIX EVERYTHING FOUND IN THE AUDIT
════════════════════════════════════════════

Based on your audit findings, make the minimum targeted fixes.
For each fix:
  - State what was wrong
  - Show what you changed
  - Confirm the fix doesn't break adjacent code

Do NOT restructure any working section.
Do NOT change the design direction.
Fix contrast, missing sections, broken math, and conversion gaps.

════════════════════════════════════════════
3C — LANDING PAGE PERFORMANCE (optional quick wins)
════════════════════════════════════════════

Open summitvoiceai-landing/client/src/pages/Home.tsx.
Add to the top of the component:

  // Preload critical fonts
  // (already in index.html — confirm Google Fonts preconnect exists)

Check summitvoiceai-landing/client/index.html for:
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

If missing, add them.

⛔ BUILD CHECK:
  cd summitvoiceai-landing
  npm run build
  
  git add -A
  git commit -m "fix: landing page CRO audit — calculator math, readability, ROI sequence completeness"
  git push origin main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — FINAL PUSH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From the main project root:

  npm run build (final verification — must pass)
  git add -A
  git commit -m "feat: complete site experience — waveform hero, 4 premium sections, PageSpeed fixes"

Then print this:
  ═══════════════════════════════════════════
  USER — PUSH COMMANDS TO RUN IN TERMINAL:
  ═══════════════════════════════════════════
  
  Main site:
  cd [main project path]
  git push origin main --force
  
  Landing page:
  cd summitvoiceai-landing
  git push origin main
  
  After pushing:
  1. Open summitvoiceai.com — check hero waveform (should move with cursor)
  2. Open revenuerecovery.summitvoiceai.com — check calculator ROI sequence
  3. Run PageSpeed Insights again: pagespeed.web.dev
     Target: 60+ with Three.js removed + lazy loading
     Target after video compression: 80+
  4. Compress demo videos with FFmpeg commands printed in Phase 0C
     Then push compressed videos — this is the final 20-point gain
  ═══════════════════════════════════════════

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — FINAL AUDIT REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Output this report:

PERFORMANCE:
  ✓/✗ Three.js removed (was ~967KB raw)
  ✓/✗ gptengineer.js removed
  ✓/✗ Videos: preload="none" + lazy mount (was preload="metadata")
  ✓/✗ React.lazy() applied to: [list sections]
  ✓/✗ Image loading="lazy" added
  ✓/✗ Font preconnect hints added
  Estimated PageSpeed improvement: [describe]
  Videos still need manual compression: ✓/✗ FFmpeg commands printed

HERO:
  ✓/✗ AvaWaveform.tsx created (pure canvas, no Three.js)
  ✓/✗ 5 waves with correct parameters
  ✓/✗ Mouse interaction on amplitude
  ✓/✗ Breathing envelope (0.82 + 0.18 * sin)
  ✓/✗ Spike system (every 5-9 seconds)
  ✓/✗ Glow on primary wave (shadowBlur:16, #00D9FF)
  ✓/✗ Mobile opacity reduced
  Bundle change: Three.js gone, AvaWaveform added [estimate new size]

PREMIUM COMPONENTS:
  ✓/✗ VoxelDivider: between Hero + IntegrationMarquee
  ✓/✗ PricingPaths: behind PricingSection
  ✓/✗ TrackRecordParticles: behind TrackRecord
  ✓/✗ FinalCTAShader: behind FinalCTA

LANDING PAGE CRO AUDIT:
  Funnel completeness: [list any missing sections]
  ROI sequence (5 parts): [✓ all present / list what's missing]
  Text readability issues found: [list what was fixed]
  Calculator math: [✓ correct / list what was wrong]
  Mobile issues: [list what was fixed]
  Conversion gaps: [list what was fixed]

BUILDS:
  Main site: ✓/✗ passes
  Landing page: ✓/✗ passes

REMAINING MANUAL ACTIONS:
  1. Run in terminal: git push origin main --force (main site)
  2. Run in terminal: cd summitvoiceai-landing && git push origin main
  3. Compress videos with FFmpeg (commands printed in Phase 0C)
  4. Replace VITE_CALENDAR_URL in Vercel env vars
  5. Update "Book a Strategy Call" href in FinalCTA.tsx
  6. Run PageSpeed Insights after video compression
```

---

## The PageSpeed Path

| Fix | Estimated Score Gain |
|-----|---------------------|
| Remove Three.js bundle (~967KB) | +12-18 pts |
| `preload="none"` + lazy mount videos | +8-12 pts |
| `gptengineer.js` removed | +2-4 pts |
| `React.lazy()` on below-fold sections | +4-8 pts |
| Image `loading="lazy"` | +3-5 pts |
| Font preconnect hints | +2-3 pts |
| **Subtotal before video compression** | **~60-70** |
| Video compression (144MB → ~15-20MB) | +10-20 pts |
| **Target after video compression** | **~80-90** |

The video compression cannot be done by Claude Code — FFmpeg needs to run on your machine. The commands are printed in Phase 0C. Handbrake (free GUI) works too if FFmpeg setup feels complex.

---

## Why The Abstract Waveform Wins

| | Three.js GLB Particle | Abstract Waveform |
|--|--|--|
| Bundle size | ~967KB | ~3KB |
| Visual clarity | Scattered starfield | Recognizable voice signal |
| Brand relevance | Generic AI aesthetic | Voice = the product |
| Mouse interaction | Complex | Immediate, responsive |
| Mobile performance | GPU overhead | Smooth 60fps canvas |
| Maintenance | GLB file dependency | Zero dependencies |

The waveform is the honest visual for a voice AI company. When a roofing owner sees sine waves pulsing and responding to their cursor, they don't need to be told what Ava does — they feel it.

---

*SummitVoiceAI — Dan Gill / Summit Marketing Group*
*summitvoiceai.com | revenuerecovery.summitvoiceai.com*
