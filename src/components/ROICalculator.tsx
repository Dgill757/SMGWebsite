import React, { useState, useRef, useEffect } from 'react';

function useInView(ref: React.RefObject<Element>, threshold = 0.1) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  accent: string;
  onChange: (v: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, format, accent, onChange }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{format(value)}</span>
      </div>
      <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, #3B82F6)`, borderRadius: 3, transition: 'width 0.1s' }} />
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            width: '100%', opacity: 0, cursor: 'pointer', height: 24, margin: 0,
          }}
        />
        <div style={{
          position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
          left: `${pct}%`, width: 18, height: 18, borderRadius: '50%',
          background: '#fff', border: `3px solid ${accent}`,
          boxShadow: `0 0 12px ${accent}60`, transition: 'left 0.1s',
          pointerEvents: 'none',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>{format(min)}</span>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>{format(max)}</span>
      </div>
    </div>
  );
};

const fmt$ = (v: number) => `$${v.toLocaleString()}`;
const fmtK = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`;
const fmtPct = (v: number) => `${v}%`;
const fmtNum = (v: number) => v.toString();

const MissedCallCalculator: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef);

  // Inputs
  const [monthlyCallVolume, setMonthlyCallVolume] = useState(200);
  const [missedCallPct, setMissedCallPct] = useState(30);
  const [closeRate, setCloseRate] = useState(25);
  const [avgJobValue, setAvgJobValue] = useState(1500);
  const [staffCost, setStaffCost] = useState(4500);

  // Computed results
  const missedCalls = Math.round(monthlyCallVolume * (missedCallPct / 100));
  const recoveredRevenue = Math.round(missedCalls * (closeRate / 100) * avgJobValue);
  const staffSavings = staffCost;
  const avaCost = 997; // Professional plan
  const netROI = recoveredRevenue + staffSavings - avaCost;
  const roiMultiple = netROI > 0 ? Math.round(netROI / avaCost) : 0;
  const annualValue = netROI * 12;

  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    if (inView && !animated) {
      setAnimated(true);
    }
  }, [inView, animated]);

  const ResultCard: React.FC<{ label: string; value: string; sub: string; accent: string; delay: string }> =
    ({ label, value, sub, accent, delay }) => (
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}25`,
        borderRadius: 20, padding: '1.75rem',
        opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)',
        transition: `all 0.5s ease ${delay}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.6rem' }}>{label}</div>
        <div style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, letterSpacing: '-0.04em', background: `linear-gradient(135deg, ${accent}, #fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '0.4rem' }}>
          {value}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{sub}</div>
      </div>
    );

  return (
    <section ref={sectionRef} id="roi-calculator"
      style={{ position: 'relative', background: '#07070A', padding: '7rem 0', overflow: 'hidden' }}
    >
      {/* BG glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 800, height: 600, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 60%)' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.22)', borderRadius: 999, padding: '0.4rem 1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            ROI Calculator
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: '1.2rem' }}>
            See Your{' '}
            <span style={{ background: 'linear-gradient(135deg,#3B82F6,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Exact ROI</span>
            {' '}in 30 Seconds
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
            Drag the sliders to match your business. Watch your potential returns update instantly.
          </p>
        </div>

        {/* Main Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }} className="roi-grid">

          {/* Left: Sliders */}
          <div style={{
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24, padding: '2.5rem',
            opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(24px)',
            transition: 'all 0.6s ease 0.1s',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
              Tell us about your business
            </h3>

            <Slider
              label="Monthly call volume"
              value={monthlyCallVolume} min={50} max={2000} step={25}
              format={fmtNum} accent="#7C3AED"
              onChange={setMonthlyCallVolume}
            />
            <Slider
              label="Calls currently missed or going to voicemail"
              value={missedCallPct} min={5} max={70} step={5}
              format={fmtPct} accent="#3B82F6"
              onChange={setMissedCallPct}
            />
            <Slider
              label="Lead-to-client close rate"
              value={closeRate} min={5} max={80} step={5}
              format={fmtPct} accent="#F472B6"
              onChange={setCloseRate}
            />
            <Slider
              label="Average job / contract value"
              value={avgJobValue} min={200} max={25000} step={100}
              format={fmt$} accent="#7C3AED"
              onChange={setAvgJobValue}
            />
            <Slider
              label="Monthly receptionist / staff cost"
              value={staffCost} min={0} max={15000} step={250}
              format={fmt$} accent="#3B82F6"
              onChange={setStaffCost}
            />

            {/* Missed calls summary */}
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '1rem 1.25rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.3rem' }}>You're currently missing</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7C3AED', letterSpacing: '-0.03em' }}>
                ~{missedCalls} calls/mo
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>
                That's {missedCalls * 12} missed opportunities per year
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ResultCard
              label="Revenue Recovered Monthly"
              value={fmtK(recoveredRevenue)}
              sub={`${missedCalls} missed calls × ${closeRate}% close × ${fmt$(avgJobValue)} avg`}
              accent="#7C3AED" delay="0.2s"
            />
            <ResultCard
              label="Staff Cost Savings Monthly"
              value={fmtK(staffSavings)}
              sub="Eliminate or reduce receptionist overhead"
              accent="#3B82F6" delay="0.3s"
            />
            <ResultCard
              label="Net Monthly ROI with Ava"
              value={netROI >= 0 ? `+${fmtK(netROI)}` : fmtK(netROI)}
              sub={`After Ava's cost ($${avaCost}/mo Professional plan)`}
              accent="#F472B6" delay="0.4s"
            />

            {/* Big ROI banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 20, padding: '2rem',
              opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)',
              transition: 'all 0.5s ease 0.5s',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>First-Year Value</div>
              <div style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.05em', background: 'linear-gradient(135deg,#7C3AED,#3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                {fmtK(annualValue)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: '0.5rem 0 1.25rem' }}>
                {roiMultiple > 0 ? `${roiMultiple}× return on investment` : 'Adjust inputs above'}
              </div>
              <a href="#pricing" className="btn-primary" style={{ display: 'inline-flex', padding: '0.85rem 2rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                <span>Unlock This ROI — Get Started</span>
              </a>
            </div>

            {/* Disclaimer */}
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.6, textAlign: 'center' }}>
              * Estimates based on average client performance data. Actual results vary by industry and implementation.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .roi-grid { grid-template-columns: 1fr !important; }
        }
        input[type='range'] { -webkit-appearance: none; appearance: none; }
      `}</style>
    </section>
  );
};

export default MissedCallCalculator;
