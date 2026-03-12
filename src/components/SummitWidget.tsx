import { useState, useEffect, useRef, useCallback, forwardRef } from "react";

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

const getOrbits = (scale: number): OrbitItem[] => [
  {
    id: "ghl",
    src: "/logos/GHL-logo-cropped.png",
    label: "GoHighLevel",
    orbitR: 115 * scale,
    phase: 0,
    speed: 0.38,
    glowColor: "#FF6B35",
    size: 58 * scale,
  },
  {
    id: "gcal",
    src: "/logos/google-calendar-logo-cropped.png",
    label: "Google Calendar",
    orbitR: 115 * scale,
    phase: (Math.PI * 2) / 3,
    speed: 0.38,
    glowColor: "#4285F4",
    size: 58 * scale,
  },
  {
    id: "outlook",
    src: "/logos/outlook-logo-cropped.png",
    label: "Outlook Calendar",
    orbitR: 115 * scale,
    phase: (Math.PI * 4) / 3,
    speed: 0.38,
    glowColor: "#0078D4",
    size: 58 * scale,
  },
  {
    id: "acculynx",
    src: "/logos/Acculynx-logo-cropped.png",
    label: "Acculynx",
    orbitR: 190 * scale,
    phase: Math.PI / 4,
    speed: -0.22,
    glowColor: "#00C9E4",
    size: 54 * scale,
  },
  {
    id: "housecall",
    src: "/logos/housecall-logo-cropped.png",
    label: "HouseCall Pro",
    orbitR: 190 * scale,
    phase: Math.PI / 4 + (Math.PI * 2) / 3,
    speed: -0.22,
    glowColor: "#00B14F",
    size: 54 * scale,
  },
  {
    id: "salesforce",
    src: "/logos/salesforce-logo-cropped.png",
    label: "Salesforce",
    orbitR: 190 * scale,
    phase: Math.PI / 4 + (Math.PI * 4) / 3,
    speed: -0.22,
    glowColor: "#00A1E0",
    size: 54 * scale,
  },
];

function SiriOrb({ state, size = 110 }: { state: OrbState; size?: number }) {
  const colors: Record<OrbState, { c1: string; c2: string; c3: string }> = {
    idle: { c1: "oklch(72% 0.18 200)", c2: "oklch(68% 0.22 260)", c3: "oklch(74% 0.20 230)" },
    listening: { c1: "oklch(78% 0.24 180)", c2: "oklch(72% 0.28 200)", c3: "oklch(70% 0.20 160)" },
    speaking: { c1: "oklch(78% 0.22 320)", c2: "oklch(72% 0.25 350)", c3: "oklch(68% 0.28 280)" },
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

function StateIndicator({ state }: { state: OrbState }) {
  const config = {
    idle: { label: "CLICK TO TALK · AVA IS READY", color: "#22D3EE", dot: "#22D3EE" },
    listening: { label: "LISTENING...", color: "#34D399", dot: "#34D399" },
    speaking: { label: "AVA IS SPEAKING...", color: "#C084FC", dot: "#C084FC" },
  };
  const { label, color, dot } = config[state];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        marginTop: 16,
        fontSize: 11,
        letterSpacing: "0.18em",
        fontFamily: "monospace",
        color,
        transition: "color 0.6s ease",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: dot,
          boxShadow: `0 0 8px ${dot}, 0 0 16px ${dot}60`,
          animation:
            state !== "idle"
              ? "summit-dot-blink 0.9s ease-in-out infinite"
              : "summit-dot-pulse 3s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
      <style>{`
        @keyframes summit-dot-blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.2; }
        }
        @keyframes summit-dot-pulse {
          0%,100% { opacity: 0.7; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.3); }
        }
      `}</style>
      {label}
    </div>
  );
}

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
        border: `1px solid ${color}40`,
        boxShadow: `0 0 30px ${color}25, inset 0 0 30px ${color}12`,
        pointerEvents: "none",
        backfaceVisibility: "hidden",
      }}
    />
  );
}

interface OrbitIconStaticProps {
  item: OrbitItem;
  onPause: () => void;
  onResume: () => void;
}

const OrbitIconStatic = forwardRef<HTMLDivElement, OrbitIconStaticProps>(
  ({ item, onPause, onResume }, ref) => {
    const [hovered, setHovered] = useState(false);

    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: item.size,
          height: item.size,
          transform: "translate(-50%, -50%) translateZ(0)",
          zIndex: hovered ? 30 : 10,
          willChange: "transform",
          backfaceVisibility: "hidden",
          filter: hovered
            ? `drop-shadow(0 0 14px ${item.glowColor}) drop-shadow(0 0 5px ${item.glowColor})`
            : `drop-shadow(0 0 6px ${item.glowColor}90)`,
          transition: "filter 0.25s ease, z-index 0s",
        }}
        onMouseEnter={() => {
          setHovered(true);
          onPause();
        }}
        onMouseLeave={() => {
          setHovered(false);
          onResume();
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            background: "rgba(10, 15, 35, 0.82)",
            border: `1.5px solid ${item.glowColor}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <img
            src={item.src}
            alt={item.label}
            onError={(e) => console.error("Logo failed:", item.src, e)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            draggable={false}
          />
        </div>

        {hovered && (
          <div
            style={{
              position: "absolute",
              bottom: item.size + 6,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(6,10,24,0.97)",
              border: "1px solid rgba(100,180,255,0.2)",
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
);
OrbitIconStatic.displayName = "OrbitIconStatic";

export default function SummitWidget() {
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [scale, setScale] = useState(1);
  const isPausedRef = useRef(false);
  const timeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const orbitsRef = useRef(getOrbits(1));
  useEffect(() => {
    orbitsRef.current = getOrbits(scale);
  }, [scale]);

  useEffect(() => {
    const loop = (now: number) => {
      if (!isPausedRef.current) {
        if (lastTimeRef.current !== null) {
          timeRef.current += (now - lastTimeRef.current) / 1000;
        }
        lastTimeRef.current = now;

        orbitsRef.current.forEach((item, i) => {
          const el = iconRefs.current[i];
          if (!el) return;
          const angle = timeRef.current * item.speed + item.phase;
          const x = Math.cos(angle) * item.orbitR;
          const y = Math.sin(angle) * item.orbitR;
          el.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%)) translateZ(0)`;
        });
      } else {
        lastTimeRef.current = null;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleOrbClick = useCallback(() => {
    const win = window as any;
    if (win.ThinkrrWidget?.open) win.ThinkrrWidget.open();
    if (win.ThinkrrWidget?.start) win.ThinkrrWidget.start();
    if (win.ThinkrrWidget?.toggle) win.ThinkrrWidget.toggle();
    if (win.thinkrr?.open) win.thinkrr.open();
    if (win.thinkrr?.start) win.thinkrr.start();

    const container = document.querySelector(
      '[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]'
    ) as HTMLElement | null;
    if (container) {
      if (container.shadowRoot) {
        (container.shadowRoot.querySelector("button") as HTMLElement | null)?.click();
      }
      (container.querySelector("button") as HTMLElement | null)?.click();
      container.click();
      container.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    }
    document.querySelectorAll("iframe").forEach((iframe) => {
      try {
        iframe.contentWindow?.postMessage({ type: "open" }, "*");
        iframe.contentWindow?.postMessage({ action: "open" }, "*");
      } catch (_) {
        // no-op
      }
    });

    setOrbState((s) => (s === "idle" ? "listening" : "idle"));
  }, []);

  const orbits = getOrbits(scale);
  const containerSize = 470 * scale;
  const orbSize = 110 * scale;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: containerSize,
          height: containerSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transform: "translateZ(0)",
        }}
        onClick={handleOrbClick}
      >
        <OrbitRing radius={115 * scale} color="#06B6D4" />
        <OrbitRing radius={190 * scale} color="#9333EA" />

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

        {orbits.map((item, i) => (
          <OrbitIconStatic
            key={item.id}
            item={item}
            ref={(el) => {
              iconRefs.current[i] = el;
            }}
            onPause={() => {
              isPausedRef.current = true;
            }}
            onResume={() => {
              isPausedRef.current = false;
              lastTimeRef.current = null;
            }}
          />
        ))}

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
              <svg width={28 * scale} height={28 * scale} viewBox="0 0 28 28" fill="white">
                <rect x="2" y="9" width="4" height="10" rx="2" />
                <rect x="8" y="5" width="4" height="18" rx="2" />
                <rect x="14" y="7" width="4" height="14" rx="2" />
                <rect x="20" y="10" width="4" height="8" rx="2" opacity="0.6" />
              </svg>
            ) : (
              <svg
                width={26 * scale}
                height={26 * scale}
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

        <div
          style={{
            position: "absolute",
            bottom: Math.round(containerSize * 0.11),
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 25,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <StateIndicator state={orbState} />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: -8 * scale, padding: "0 16px", maxWidth: "100%" }}>
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
          {["ServiceTitan", "Jobber", "Roof Link", "HubSpot", "Zapier", "Make.com"].map((name) => (
            <span
              key={name}
              style={{
                fontSize: Math.max(9, Math.round(10 * scale)),
                padding: "3px 10px",
                border: "1px solid rgba(100,160,255,0.15)",
                borderRadius: 20,
                color: "#64748B",
                letterSpacing: "0.07em",
                fontFamily: "monospace",
                background: "rgba(100,160,255,0.03)",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </span>
          ))}
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
