import { useState, useEffect, useRef, useCallback } from "react";

type OrbState = "idle" | "listening" | "speaking";

interface OrbitItem {
  id: string;
  src: string;
  label: string;
  orbitR: number;
  phase: number;
  speed: number;
  glowColor: string;
  size: number;
}

// --- 6 Orbiting Icons: 3 inner, 3 outer --------------------------------------
// Inner orbit: daily workflow tools (faster, smaller radius)
// Outer orbit: industry CRM tools (slower, larger radius)
const getOrbits = (scale: number): OrbitItem[] => [
  // INNER ORBIT
  {
    id: "ghl",
    src: "/logos/GHL-logo-cropped.png",
    label: "GoHighLevel",
    orbitR: 115 * scale,
    phase: 0,
    speed: 0.38,
    glowColor: "#FF6B35",
    size: 42 * scale,
  },
  {
    id: "gcal",
    src: "/logos/google-calendar-logo-cropped.png",
    label: "Google Calendar",
    orbitR: 115 * scale,
    phase: (Math.PI * 2) / 3,
    speed: 0.38,
    glowColor: "#4285F4",
    size: 42 * scale,
  },
  {
    id: "outlook",
    src: "/logos/outlook-logo-cropped.png",
    label: "Outlook Calendar",
    orbitR: 115 * scale,
    phase: (Math.PI * 4) / 3,
    speed: 0.38,
    glowColor: "#0078D4",
    size: 42 * scale,
  },
  // OUTER ORBIT
  {
    id: "acculynx",
    src: "/logos/Acculynx-logo-cropped.png",
    label: "Acculynx",
    orbitR: 190 * scale,
    phase: Math.PI / 4,
    speed: -0.22,
    glowColor: "#00C9E4",
    size: 40 * scale,
  },
  {
    id: "housecall",
    src: "/logos/housecall-logo-cropped.png",
    label: "HouseCall Pro",
    orbitR: 190 * scale,
    phase: Math.PI / 4 + (Math.PI * 2) / 3,
    speed: -0.22,
    glowColor: "#00B14F",
    size: 40 * scale,
  },
  {
    id: "salesforce",
    src: "/logos/salesforce-logo-cropped.png",
    label: "Salesforce",
    orbitR: 190 * scale,
    phase: Math.PI / 4 + (Math.PI * 4) / 3,
    speed: -0.22,
    glowColor: "#00A1E0",
    size: 40 * scale,
  },
];

// --- Additional integrations shown as text badges only -----------------------
const ADDITIONAL_BADGES = [
  "ServiceTitan",
  "Jobber",
  "Roof Link",
  "HubSpot",
  "Zapier",
  "Make.com",
];

// --- Siri Orb -----------------------------------------------------------------
function SiriOrb({ state, size = 110 }: { state: OrbState; size?: number }) {
  const colors: Record<OrbState, { c1: string; c2: string; c3: string }> = {
    idle:      { c1: "oklch(72% 0.18 200)", c2: "oklch(68% 0.22 260)", c3: "oklch(74% 0.20 230)" },
    listening: { c1: "oklch(78% 0.24 180)", c2: "oklch(72% 0.28 200)", c3: "oklch(70% 0.20 160)" },
    speaking:  { c1: "oklch(78% 0.22 320)", c2: "oklch(72% 0.25 350)", c3: "oklch(68% 0.28 280)" },
  };
  const c = colors[state];
  const blur = Math.round(size * 0.09);
  const dur = state === "idle" ? "18s" : state === "listening" ? "7s" : "4s";

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        borderRadius: "50%",
        // GPU compositing — prevents tracer artifacts
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        isolation: "isolate",
      }}
    >
      <style>{`
        @property --summit-orb-angle-${state} {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes summit-orb-spin-${state} {
          from { --summit-orb-angle-${state}: 0deg; }
          to   { --summit-orb-angle-${state}: 360deg; }
        }
        @keyframes summit-orb-breathe {
          0%,100% { transform: translateZ(0) scale(1); }
          50%      { transform: translateZ(0) scale(1.05); }
        }
        .summit-orb-wrap {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          animation: summit-orb-breathe 4s ease-in-out infinite;
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: transform;
        }
        .summit-orb-core-${state} {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background:
            conic-gradient(from calc(var(--summit-orb-angle-${state}) * 1.3) at 30% 65%,
              ${c.c3} 0deg, transparent 50deg 310deg, ${c.c3} 360deg),
            conic-gradient(from calc(var(--summit-orb-angle-${state}) * 0.7) at 70% 35%,
              ${c.c2} 0deg, transparent 60deg 300deg, ${c.c2} 360deg),
            conic-gradient(from calc(var(--summit-orb-angle-${state}) * -1.4) at 60% 70%,
              ${c.c1} 0deg, transparent 90deg 270deg, ${c.c1} 360deg),
            conic-gradient(from calc(var(--summit-orb-angle-${state}) * 2.2) at 25% 25%,
              ${c.c2} 0deg, transparent 30deg 330deg, ${c.c2} 360deg),
            radial-gradient(ellipse 120% 80% at 40% 60%, ${c.c3} 0%, transparent 55%);
          filter: blur(${blur}px) contrast(2.0) saturate(1.4);
          animation: summit-orb-spin-${state} ${dur} linear infinite;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
      <div className="summit-orb-wrap">
        <div className={`summit-orb-core-${state}`} />
      </div>
    </div>
  );
}

// --- Single Orbiting Icon -----------------------------------------------------
function OrbitIcon({ item, time }: { item: OrbitItem; time: number }) {
  const [hovered, setHovered] = useState(false);
  const angle = time * item.speed + item.phase;
  const x = Math.cos(angle) * item.orbitR;
  const y = Math.sin(angle) * item.orbitR;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: item.size,
        height: item.size,
        // GPU-accelerated positioning — no top/left animation, only transform
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%)) translateZ(0)`,
        zIndex: hovered ? 30 : 10,
        cursor: "default",
        willChange: "transform",
        backfaceVisibility: "hidden",
        // Glow via filter — isolated so it doesn't bleed
        filter: hovered
          ? `drop-shadow(0 0 12px ${item.glowColor}) drop-shadow(0 0 4px ${item.glowColor})`
          : `drop-shadow(0 0 5px ${item.glowColor}90)`,
        transition: "filter 0.25s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {/* Icon image in a circular container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          background: "rgba(15, 20, 40, 0.85)",
          backdropFilter: "blur(4px)",
          border: `1px solid ${item.glowColor}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxSizing: "border-box",
          padding: "6px",
        }}
      >
        <img
          src={item.src}
          alt={item.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            // Prevent img from causing repaint artifacts
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
          draggable={false}
        />
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: item.size + 6,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(6, 10, 24, 0.97)",
            border: "1px solid rgba(100, 180, 255, 0.2)",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "11px",
            color: "#CBD5E1",
            whiteSpace: "nowrap",
            fontFamily: "monospace",
            letterSpacing: "0.06em",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          {item.label}
        </div>
      )}
    </div>
  );
}

// --- Orbit Ring ---------------------------------------------------------------
function OrbitRing({ radius, color }: { radius: number; color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: radius * 2,
        height: radius * 2,
        transform: "translate(-50%, -50%) translateZ(0)",
        borderRadius: "50%",
        border: `1px solid ${color}30`,
        boxShadow: `0 0 20px ${color}15, inset 0 0 20px ${color}08`,
        pointerEvents: "none",
        backfaceVisibility: "hidden",
      }}
    />
  );
}

// --- Main Widget --------------------------------------------------------------
export default function SummitWidget() {
  const [time, setTime] = useState(0);
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [paused, setPaused] = useState(false);

  // Responsive scale based on viewport
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      if (vw < 400) setScale(0.58);
      else if (vw < 480) setScale(0.65);
      else if (vw < 600) setScale(0.75);
      else if (vw < 768) setScale(0.85);
      else setScale(1);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const loop = (now: number) => {
      if (lastRef.current !== null) {
        setTime(t => t + (now - lastRef.current!) / 1000);
      }
      lastRef.current = now;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, [paused]);

  const handleOrbClick = useCallback(() => {
    // Try every known Thinkrr activation method
    const win = window as any;
    if (win.ThinkrrWidget?.open) win.ThinkrrWidget.open();
    if (win.ThinkrrWidget?.start) win.ThinkrrWidget.start();
    if (win.ThinkrrWidget?.toggle) win.ThinkrrWidget.toggle();
    if (win.thinkrr?.open) win.thinkrr.open();
    if (win.thinkrr?.start) win.thinkrr.start();
    if (win.openWidget) win.openWidget();

    const container = document.querySelector(
      '[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]'
    ) as HTMLElement | null;

    if (container) {
      // Shadow DOM
      if (container.shadowRoot) {
        const btn = container.shadowRoot.querySelector("button") as HTMLElement | null;
        if (btn) btn.click();
      }
      // Direct children
      const btn = container.querySelector("button") as HTMLElement | null;
      if (btn) btn.click();
      // Container itself
      container.click();
      container.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    }

    // Broadcast to any iframes
    document.querySelectorAll("iframe").forEach(iframe => {
      try {
        iframe.contentWindow?.postMessage({ type: "open" }, "*");
        iframe.contentWindow?.postMessage({ action: "open" }, "*");
        iframe.contentWindow?.postMessage({ type: "start" }, "*");
      } catch (_) {}
    });

    setOrbState(s => s === "idle" ? "listening" : "idle");
  }, []);

  const orbits = getOrbits(scale);
  const containerSize = 470 * scale;
  const orbSize = 110 * scale;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Orbit container */}
      <div
        style={{
          position: "relative",
          width: containerSize,
          height: containerSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          // Contain all GPU layers
          transform: "translateZ(0)",
          willChange: "transform",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={handleOrbClick}
      >
        {/* Rings */}
        <OrbitRing radius={115 * scale} color="#06B6D4" />
        <OrbitRing radius={190 * scale} color="#9333EA" />

        {/* Ambient glow behind orb */}
        <div
          style={{
            position: "absolute",
            width: 180 * scale,
            height: 180 * scale,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(80,140,255,0.16) 0%, rgba(140,80,255,0.08) 50%, transparent 70%)",
            filter: "blur(24px)",
            pointerEvents: "none",
            animation: "summit-ambient-glow 4s ease-in-out infinite",
            transform: "translateZ(0)",
          }}
        />
        <style>{`
          @keyframes summit-ambient-glow {
            0%,100% { opacity: 0.5; transform: translateZ(0) scale(1); }
            50%      { opacity: 1;   transform: translateZ(0) scale(1.15); }
          }
        `}</style>

        {/* Orbiting icons */}
        {orbits.map(item => (
          <OrbitIcon key={item.id} item={item} time={time} />
        ))}

        {/* Center orb + mic icon */}
        <div style={{ position: "relative", zIndex: 20, pointerEvents: "none" }}>
          <SiriOrb state={orbState} size={orbSize} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "rgba(255,255,255,0.9)",
              pointerEvents: "none",
              zIndex: 25,
            }}
          >
            {orbState === "speaking" ? (
              <svg
                width={Math.round(28 * scale)}
                height={Math.round(28 * scale)}
                viewBox="0 0 28 28"
                fill="white"
              >
                <rect x="2" y="9" width="4" height="10" rx="2" />
                <rect x="8" y="5" width="4" height="18" rx="2" />
                <rect x="14" y="7" width="4" height="14" rx="2" />
                <rect x="20" y="10" width="4" height="8" rx="2" opacity="0.6" />
              </svg>
            ) : (
              <svg
                width={Math.round(26 * scale)}
                height={Math.round(26 * scale)}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Integration badges */}
      <div
        style={{
          textAlign: "center",
          marginTop: Math.round(-8 * scale),
          padding: "0 16px",
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            fontSize: Math.max(9, Math.round(11 * scale)),
            letterSpacing: "0.22em",
            color: "#64748B",
            textTransform: "uppercase",
            marginBottom: 10,
            fontFamily: "monospace",
          }}
        >
          Integrates With All Your Systems
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: Math.round(460 * scale),
            margin: "0 auto",
          }}
        >
          {/* Orbiting ones listed first */}
          {["GoHighLevel", "Google Calendar", "Outlook Calendar", "Acculynx", "HouseCall Pro", "Salesforce"].map(name => (
            <span
              key={name}
              style={{
                fontSize: Math.max(9, Math.round(10 * scale)),
                padding: "3px 10px",
                border: "1px solid rgba(100,160,255,0.2)",
                borderRadius: 20,
                color: "#94A3B8",
                letterSpacing: "0.07em",
                fontFamily: "monospace",
                background: "rgba(100,160,255,0.04)",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </span>
          ))}
          {/* Additional badges */}
          {ADDITIONAL_BADGES.map(name => (
            <span
              key={name}
              style={{
                fontSize: Math.max(9, Math.round(10 * scale)),
                padding: "3px 10px",
                border: "1px solid rgba(100,160,255,0.12)",
                borderRadius: 20,
                color: "#64748B",
                letterSpacing: "0.07em",
                fontFamily: "monospace",
                background: "rgba(100,160,255,0.02)",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </span>
          ))}
          {/* And More pill */}
          <span
            style={{
              fontSize: Math.max(9, Math.round(10 * scale)),
              padding: "3px 12px",
              border: "1px solid rgba(168,85,247,0.4)",
              borderRadius: 20,
              color: "#C084FC",
              letterSpacing: "0.07em",
              fontFamily: "monospace",
              background: "rgba(168,85,247,0.08)",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            + And More
          </span>
        </div>
      </div>
    </div>
  );
}
