
import React, { useState } from 'react';
import { Clock, DollarSign, Brain, PhoneCall, Calendar, UserCheck, BarChart, BotIcon, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ROICalculator from './ROICalculator';

const BenefitsSection: React.FC = () => {
  const [isROIDialogOpen, setIsROIDialogOpen] = useState(false);
  
  const benefits = [{
    icon: <Clock className="h-6 w-6" />,
    title: "24/7 Availability",
    description: "Never miss a call again. Our AI assistant works around the clock, capturing leads while you sleep.",
    color: "from-blue-500 to-cyan-400"
  }, {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Save $100K+ Annually",
    description: "Replace multiple sales and admin staff with a tireless AI that never takes breaks or vacations.",
    color: "from-green-500 to-emerald-400"
  }, {
    icon: <Brain className="h-6 w-6" />,
    title: "Smart Learning",
    description: "Train once and forget. Our AI continuously improves from interactions with your customers.",
    color: "from-voiceai-primary to-purple-400"
  }, {
    icon: <PhoneCall className="h-6 w-6" />,
    title: "Perfect Call Handling",
    description: "Convert more calls into sales with perfect script execution every single time.",
    color: "from-orange-500 to-amber-400"
  }, {
    icon: <Calendar className="h-6 w-6" />,
    title: "Seamless Scheduling",
    description: "Automatically book appointments directly into your calendar when customers are ready.",
    color: "from-voiceai-secondary to-sky-400"
  }, {
    icon: <UserCheck className="h-6 w-6" />,
    title: "Lead Qualification",
    description: "Only spend time on qualified leads that match your perfect customer profile.",
    color: "from-red-500 to-rose-400"
  }, {
    icon: <BarChart className="h-6 w-6" />,
    title: "Revenue Growth",
    description: "Increase close rates with immediate follow-up on every lead, every time.",
    color: "from-voiceai-accent to-pink-400"
  }, {
    icon: <BotIcon className="h-6 w-6" />,
    title: "No Training Needed",
    description: "Unlike human employees, our AI never forgets what it's learned or needs retraining.",
    color: "from-teal-500 to-cyan-400"
  }, {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Deployment",
    description: "Be up and running in minutes, not weeks. No complicated setup or integration required.",
    color: "from-yellow-500 to-amber-400"
  }];
  
  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Stop Losing <span className="text-voiceai-primary font-bold">Revenue</span> in Missed Opportunities
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            If your business misses 2-5 calls a day, that's 60-150 potential customers lost monthly. At $5,000-$10,000 per customer, you're leaving massive revenue on the table.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
              <div className={`absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${benefit.color} opacity-20`}></div>
              <div className={`inline-flex items-center justify-center p-3 sm:p-4 rounded-lg bg-gradient-to-br ${benefit.color} text-white mb-4 sm:mb-6 shadow-lg mx-auto`}>
                {benefit.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center text-foreground">{benefit.title}</h3>
              <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl glassmorphism border border-primary/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-foreground">Calculate Your ROI</h3>
              <p className="text-sm sm:text-base text-foreground/80 max-w-md">
                See how much revenue you're leaving on the table with missed calls and leads.
              </p>
            </div>
            <div className="glassmorphism rounded-xl p-4 sm:p-6 text-center border border-white/20">
              <div className="text-2xl sm:text-3xl font-bold text-voiceai-primary mb-2">$120,000+</div>
              <p className="text-xs sm:text-sm text-foreground/70">Average annual revenue increase</p>
            </div>
            <button 
              onClick={() => setIsROIDialogOpen(true)}
              className="btn-primary w-full sm:w-auto whitespace-nowrap"
            >
              Get Your Custom ROI Analysis
            </button>
          </div>
        </div>
      </div>
      
      <Dialog open={isROIDialogOpen} onOpenChange={setIsROIDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold mb-4">Missed Call ROI Calculator</DialogTitle>
          </DialogHeader>
          <ROICalculator />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BenefitsSection;
