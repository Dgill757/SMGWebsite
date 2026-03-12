import { useState, useEffect, useRef, useCallback } from "react";

const CRMIcons = {
  GHL: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#FF6B35"/>
      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="Arial">GHL</text>
    </svg>
  ),
  GoogleCalendar: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="white" stroke="#E0E0E0"/>
      <rect x="6" y="10" width="28" height="24" rx="3" fill="white" stroke="#4285F4" strokeWidth="2"/>
      <rect x="6" y="10" width="28" height="8" rx="3" fill="#4285F4"/>
      <rect x="6" y="15" width="28" height="3" fill="#4285F4"/>
      <circle cx="13" cy="7" r="2.5" fill="#4285F4"/>
      <circle cx="27" cy="7" r="2.5" fill="#4285F4"/>
      <text x="50%" y="72%" textAnchor="middle" dominantBaseline="middle" fill="#4285F4" fontSize="11" fontWeight="700" fontFamily="Arial">31</text>
    </svg>
  ),
  Outlook: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#0078D4"/>
      <rect x="6" y="10" width="16" height="20" rx="2" fill="#50D9FF"/>
      <rect x="18" y="13" width="16" height="14" rx="2" fill="white"/>
      <path d="M18 13 L26 20 L34 13" stroke="#0078D4" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  Acculynx: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#1A3A5C"/>
      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#00C9E4" fontSize="16" fontWeight="800" fontFamily="Arial">Ac</text>
    </svg>
  ),
  HouseCallPro: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#00B14F"/>
      <path d="M20 8 L32 19 L32 32 L8 32 L8 19 Z" fill="white" opacity="0.9"/>
      <rect x="15" y="22" width="10" height="10" rx="1" fill="#00B14F"/>
    </svg>
  ),
  JobNimbus: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#FF4500"/>
      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="15" fontWeight="800" fontFamily="Arial">JN</text>
    </svg>
  ),
  Zapier: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#FF4A00"/>
      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16" fontWeight="800" fontFamily="Arial">Z</text>
    </svg>
  ),
  Salesforce: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="#00A1E0"/>
      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="Arial">SF</text>
    </svg>
  ),
};

const INNER_ORBIT = [
  { id: "ghl", Icon: CRMIcons.GHL, label: "GoHighLevel", orbitR: 115, phase: 0, speed: 0.35, glowColor: "#FF6B35" },
  { id: "gcal", Icon: CRMIcons.GoogleCalendar, label: "Google Calendar", orbitR: 115, phase: (Math.PI * 2) / 3, speed: 0.35, glowColor: "#4285F4" },
  { id: "outlook", Icon: CRMIcons.Outlook, label: "Outlook Calendar", orbitR: 115, phase: (Math.PI * 4) / 3, speed: 0.35, glowColor: "#0078D4" },
];

const OUTER_ORBIT = [
  { id: "acculynx", Icon: CRMIcons.Acculynx, label: "Acculynx", orbitR: 195, phase: Math.PI / 6, speed: -0.22, glowColor: "#00C9E4" },
  { id: "hcp", Icon: CRMIcons.HouseCallPro, label: "HouseCall Pro", orbitR: 195, phase: Math.PI / 6 + (Math.PI * 2) / 3, speed: -0.22, glowColor: "#00B14F" },
  { id: "jobnimbus", Icon: CRMIcons.JobNimbus, label: "JobNimbus", orbitR: 195, phase: Math.PI / 6 + (Math.PI * 4) / 3, speed: -0.22, glowColor: "#FF4500" },
  { id: "salesforce", Icon: CRMIcons.Salesforce, label: "Salesforce", orbitR: 195, phase: Math.PI * 1.5, speed: -0.22, glowColor: "#00A1E0" },
];

function SiriOrb({ state, size = 120 }: { state: string; size?: number }) {
  const colors = {
    idle:      { c1: "oklch(72% 0.18 200)", c2: "oklch(68% 0.22 260)", c3: "oklch(74% 0.20 230)" },
    listening: { c1: "oklch(78% 0.24 180)", c2: "oklch(72% 0.28 200)", c3: "oklch(70% 0.20 160)" },
    speaking:  { c1: "oklch(78% 0.22 320)", c2: "oklch(72% 0.25 350)", c3: "oklch(68% 0.28 280)" },
  };
  const c = colors[state as keyof typeof colors] || colors.idle;
  const blur = size * 0.1;
  const dur = state === "idle" ? "18s" : state === "listening" ? "7s" : "4s";

  return (
    <div style={{ width: size, height: size, position: "relative", borderRadius: "50%" }}>
      <style>{`
        @property --orb-angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes orb-spin-${state} {
          from { --orb-angle: 0deg; }
          to { --orb-angle: 360deg; }
        }
        @keyframes orb-breathe {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .summit-orb-wrap { animation: orb-breathe 4s ease-in-out infinite; }
        .summit-orb-core-${state} {
          border-radius: 50%;
          background:
            conic-gradient(from calc(var(--orb-angle) * 1.3) at 30% 65%, ${c.c3} 0deg, transparent 50deg 310deg, ${c.c3} 360deg),
            conic-gradient(from calc(var(--orb-angle) * 0.7) at 70% 35%, ${c.c2} 0deg, transparent 60deg 300deg, ${c.c2} 360deg),
            conic-gradient(from calc(var(--orb-angle) * -1.4) at 60% 70%, ${c.c1} 0deg, transparent 90deg 270deg, ${c.c1} 360deg),
            conic-gradient(from calc(var(--orb-angle) * 2.2) at 25% 25%, ${c.c2} 0deg, transparent 30deg 330deg, ${c.c2} 360deg),
            radial-gradient(ellipse 120% 80% at 40% 60%, ${c.c3} 0%, transparent 55%);
          filter: blur(${blur}px) contrast(2.2) saturate(1.5);
          animation: orb-spin-${state} ${dur} linear infinite;
          will-change: transform;
        }
      `}</style>
      <div className="summit-orb-wrap" style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden" }}>
        <div className={`summit-orb-core-${state}`} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

function OrbitIcon({ item, time }: { item: (typeof INNER_ORBIT)[number] | (typeof OUTER_ORBIT)[number]; time: number }) {
  const [hovered, setHovered] = useState(false);
  const angle = time * item.speed + item.phase;
  const x = Math.cos(angle) * item.orbitR;
  const y = Math.sin(angle) * item.orbitR;
  const sz = 38;

  return (
    <div
      style={{
        position: "absolute", top: "50%", left: "50%",
        width: sz, height: sz,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: hovered ? 30 : 10,
        cursor: "default",
        filter: hovered
          ? `drop-shadow(0 0 14px ${item.glowColor}) drop-shadow(0 0 6px ${item.glowColor})`
          : `drop-shadow(0 0 5px ${item.glowColor}80)`,
        transition: "filter 0.2s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <item.Icon size={sz} />
      {hovered && (
        <div style={{
          position: "absolute", bottom: sz + 6, left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(8,12,28,0.96)",
          border: "1px solid rgba(100,180,255,0.25)",
          borderRadius: 6, padding: "3px 10px",
          fontSize: 11, color: "#CBD5E1",
          whiteSpace: "nowrap", fontFamily: "monospace",
          letterSpacing: "0.06em", pointerEvents: "none",
        }}>
          {item.label}
        </div>
      )}
    </div>
  );
}

function OrbitRing({ radius, color }: { radius: number; color: string }) {
  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%",
      width: radius * 2, height: radius * 2,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      border: `1px solid ${color}35`,
      boxShadow: `0 0 24px ${color}18, inset 0 0 24px ${color}10`,
      pointerEvents: "none",
    }} />
  );
}

export default function SummitWidget() {
  const [time, setTime] = useState(0);
  const [state, setState] = useState("idle");
  const [paused, setPaused] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) {
      return;
    }
    const loop = (now: number) => {
      if (lastRef.current !== null) {
        setTime((t) => t + (now - lastRef.current!) / 1000);
      }
      lastRef.current = now;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      lastRef.current = null;
    };
  }, [paused]);

  const handleOrbClick = useCallback(() => {
    const widgetContainer = document.querySelector('[data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"]');
    if (widgetContainer) {
      const btn = (widgetContainer as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot?.querySelector('button')
        || widgetContainer.querySelector('button')
        || widgetContainer.querySelector('[role="button"]')
        || widgetContainer.firstElementChild;
      if (btn instanceof HTMLElement) {
        btn.click();
      }
    }

    setState((s) => (s === "idle" ? "listening" : "idle"));
  }, []);

  const allItems = [...INNER_ORBIT, ...OUTER_ORBIT];
  const containerSize = 470;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <div
        style={{
          position: "relative",
          width: containerSize,
          height: containerSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={handleOrbClick}
      >
        <OrbitRing radius={115} color="#06B6D4" />
        <OrbitRing radius={195} color="#9333EA" />

        <div style={{
          position: "absolute", width: 180, height: 180, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(80,140,255,0.18) 0%, rgba(140,80,255,0.10) 50%, transparent 70%)",
          filter: "blur(28px)", pointerEvents: "none",
          animation: "summit-glow 4s ease-in-out infinite",
        }} />
        <style>{`
          @keyframes summit-glow {
            0%,100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.18); }
          }
        `}</style>

        {allItems.map((item) => (
          <OrbitIcon key={item.id} item={item} time={time} />
        ))}

        <div style={{ position: "relative", zIndex: 20, pointerEvents: "none" }}>
          <SiriOrb state={state} size={120} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            color: "rgba(255,255,255,0.88)",
            pointerEvents: "none", zIndex: 25,
          }}>
            {state === "speaking" ? (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <rect x="3" y="8" width="3" height="8" rx="1"/>
                <rect x="9" y="4" width="3" height="16" rx="1"/>
                <rect x="15" y="6" width="3" height="12" rx="1"/>
                <rect x="21" y="9" width="3" height="6" rx="1" opacity="0.6"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="8" y1="22" x2="16" y2="22"/>
              </svg>
            )}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: -16 }}>
        <div style={{
          fontSize: 11, letterSpacing: "0.25em", color: "#475569",
          textTransform: "uppercase", marginBottom: 10, fontFamily: "monospace",
        }}>
          Integrates With All Your Systems
        </div>
        <div style={{ display: "flex", gap: 7, justifyContent: "center", flexWrap: "wrap", maxWidth: 420 }}>
          {["GoHighLevel", "Acculynx", "HouseCall Pro", "JobNimbus", "Google Cal", "Outlook"].map((name) => (
            <span key={name} style={{
              fontSize: 10, padding: "3px 10px",
              border: "1px solid rgba(100,160,255,0.2)",
              borderRadius: 20, color: "#94A3B8",
              letterSpacing: "0.08em", fontFamily: "monospace",
              background: "rgba(100,160,255,0.04)",
            }}>{name}</span>
          ))}
          <span style={{
            fontSize: 10, padding: "3px 10px",
            border: "1px solid rgba(168,85,247,0.35)",
            borderRadius: 20, color: "#C084FC",
            letterSpacing: "0.08em", fontFamily: "monospace",
            background: "rgba(168,85,247,0.08)",
            fontWeight: 600,
          }}>+ And More</span>
        </div>
      </div>
    </div>
  );
}
