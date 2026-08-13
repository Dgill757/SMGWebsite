import React, { useState } from 'react';
import { Clock, DollarSign, Brain, PhoneCall, Calendar, UserCheck, BarChart, BotIcon, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ROICalculator from './ROICalculator';

const benefits = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: '24/7 Availability',
    description: 'Never miss a call again. Our AI assistant works around the clock, capturing leads while you sleep.',
    grad: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    glow: '#3B82F6',
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Save $100K+ Annually',
    description: 'Replace multiple sales and admin staff with a tireless AI that never takes breaks or vacations.',
    grad: 'linear-gradient(135deg, #22C55E, #10B981)',
    glow: '#22C55E',
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'Smart Learning',
    description: 'Train once and forget. Our AI continuously improves from interactions with your customers.',
    grad: 'linear-gradient(135deg, #7C3AED, #A855F7)',
    glow: '#7C3AED',
  },
  {
    icon: <PhoneCall className="h-6 w-6" />,
    title: 'Perfect Call Handling',
    description: 'Convert more calls into sales with perfect script execution every single time.',
    grad: 'linear-gradient(135deg, #F97316, #FBBF24)',
    glow: '#F97316',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Seamless Scheduling',
    description: 'Automatically book appointments directly into your calendar when customers are ready.',
    grad: 'linear-gradient(135deg, #3B82F6, #38BDF8)',
    glow: '#38BDF8',
  },
  {
    icon: <UserCheck className="h-6 w-6" />,
    title: 'Lead Qualification',
    description: 'Only spend time on qualified leads that match your perfect customer profile.',
    grad: 'linear-gradient(135deg, #EF4444, #F43F5E)',
    glow: '#EF4444',
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: 'Revenue Growth',
    description: 'Increase close rates with immediate follow-up on every lead, every time.',
    grad: 'linear-gradient(135deg, #EC4899, #A855F7)',
    glow: '#EC4899',
  },
  {
    icon: <BotIcon className="h-6 w-6" />,
    title: 'No Training Needed',
    description: "Unlike human employees, our AI never forgets what it's learned or needs retraining.",
    grad: 'linear-gradient(135deg, #14B8A6, #06B6D4)',
    glow: '#14B8A6',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Instant Deployment',
    description: 'Be up and running in minutes, not weeks. No complicated setup or integration required.',
    grad: 'linear-gradient(135deg, #EAB308, #F59E0B)',
    glow: '#EAB308',
  },
];

const BenefitsSection: React.FC = () => {
  const [isROIDialogOpen, setIsROIDialogOpen] = useState(false);

  return (
    <section id="features" className="pt-0 pb-20 px-4 md:px-8 lg:px-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />

      <div className="container mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="heading-lg">
            Stop Losing{' '}
            <span className="text-voiceai-primary font-bold">Revenue</span>{' '}
            in Missed Opportunities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            If your business misses 2–5 calls a day, that's 60–150 potential customers lost monthly. At
            $5,000–$10,000 per customer, you're leaving massive revenue on the table.
          </p>
        </div>

        {/* 3 × 3 grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.75rem',
          }}
          className="benefits-grid"
        >
          {benefits.map((b, i) => (
            <BenefitCard key={i} {...b} />
          ))}
        </div>

        {/* ROI Banner */}
        <div className="mt-16 p-8 rounded-2xl glassmorphism border border-primary/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="heading-md mb-2 text-foreground">Calculate Your ROI</h3>
              <p className="text-foreground/80">
                See how much revenue you're leaving on the table with missed calls and leads.
              </p>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center border border-white/20">
              <div className="text-3xl font-bold text-voiceai-primary mb-2">$120,000+</div>
              <p className="text-sm text-foreground/70">Average annual revenue increase</p>
            </div>
            <button onClick={() => setIsROIDialogOpen(true)} className="btn-primary">
              Get Your Custom ROI Analysis
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isROIDialogOpen} onOpenChange={setIsROIDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Missed Call ROI Calculator</DialogTitle>
          </DialogHeader>
          <ROICalculator />
        </DialogContent>
      </Dialog>

      <style>{`
        @media (max-width: 1024px) { .benefits-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .benefits-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};

// ── Individual card with hover glow ─────────────────────────────────────────
interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  grad: string;
  glow: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, grad, glow }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 20,
        padding: '1.75rem',
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? glow + '50' : 'rgba(255,255,255,0.08)'}`,
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered
          ? `0 0 0 1px ${glow}22, 0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${glow}20`
          : '0 4px 20px rgba(0,0,0,0.25)',
      }}
    >
      {/* Decorative corner glow */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: grad,
          opacity: hovered ? 0.18 : 0.10,
          filter: 'blur(20px)',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Icon with always-on glow */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          borderRadius: 14,
          background: grad,
          color: '#fff',
          marginBottom: '1.1rem',
          boxShadow: `0 0 22px ${glow}60, 0 4px 12px rgba(0,0,0,0.3)`,
          transition: 'box-shadow 0.3s ease',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.65 }}>
        {description}
      </p>
    </div>
  );
};

export default BenefitsSection;
