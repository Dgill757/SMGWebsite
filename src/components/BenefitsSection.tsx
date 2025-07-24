
import React, { useState } from 'react';
import { Clock, DollarSign, Brain, PhoneCall, Calendar, UserCheck, BarChart, BotIcon, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ROICalculator from './ROICalculator';

const BenefitsSection: React.FC = () => {
  const [isROIDialogOpen, setIsROIDialogOpen] = useState(false);
  
  const benefits = [{
    icon: (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/40 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-white"></div>
        </div>
        <div className="absolute inset-4 rounded-full border-2 border-cyan-300 animate-pulse"></div>
      </div>
    ),
    title: "24/7 Availability",
    description: "Your AI assistant never sleeps, ensuring every call is answered and every opportunity captured, regardless of time or day.",
    color: "from-blue-500 to-cyan-400"
  }, {
    icon: (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-600/40"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
          <DollarSign className="h-8 w-8 text-white font-bold" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
      </div>
    ),
    title: "Save $100K+ Annually",
    description: "Replace expensive reception staff while delivering superior service quality and capturing more revenue opportunities.",
    color: "from-green-500 to-emerald-400"
  }, {
    icon: (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-600/40"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    ),
    title: "Smart Learning",
    description: "AI continuously adapts and improves from every interaction, becoming more effective at converting leads over time.",
    color: "from-voiceai-primary to-purple-400"
  }, {
    icon: (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/20 to-red-600/40"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
          <PhoneCall className="h-8 w-8 text-white" />
        </div>
        <div className="absolute inset-1 rounded-full border border-orange-300 animate-ping"></div>
      </div>
    ),
    title: "Perfect Call Handling",
    description: "Handle multiple calls simultaneously with perfect consistency, professional tone, and accurate information delivery.",
    color: "from-orange-500 to-amber-400"
  }, {
    icon: (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-600/40"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-2 h-2 bg-white rounded-sm"></div>
            <div className="w-2 h-2 bg-white/60 rounded-sm"></div>
            <div className="w-2 h-2 bg-white/60 rounded-sm"></div>
            <div className="w-2 h-2 bg-white rounded-sm"></div>
          </div>
        </div>
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-200 rounded text-xs flex items-center justify-center text-blue-800 font-bold">31</div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-200 rounded text-xs flex items-center justify-center text-blue-800 font-bold">7</div>
      </div>
    ),
    title: "Seamless Scheduling",
    description: "Automatically coordinate appointments, send confirmations, and manage your calendar without any manual intervention.",
    color: "from-voiceai-secondary to-sky-400"
  }, {
    icon: (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400/20 to-pink-600/40"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center">
          <UserCheck className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
          <div className="w-2 h-1 bg-white rounded"></div>
        </div>
      </div>
    ),
    title: "Lead Qualification",
    description: "Intelligently assess caller intent, budget, and timeline to prioritize high-value prospects for your sales team.",
    color: "from-red-500 to-rose-400"
  }, {
    icon: (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-600/40"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
          <div className="flex space-x-1 items-end">
            <div className="w-2 h-3 bg-white rounded-sm"></div>
            <div className="w-2 h-4 bg-white rounded-sm"></div>
            <div className="w-2 h-6 bg-white rounded-sm"></div>
          </div>
        </div>
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-pink-300 rounded-full"></div>
      </div>
    ),
    title: "Revenue Growth",
    description: "Increase conversion rates by 40% with instant response times and professional, consistent customer interactions.",
    color: "from-voiceai-accent to-pink-400"
  }, {
    icon: (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-600/40 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
          <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
            <div className="w-3 h-3 rounded bg-teal-500"></div>
          </div>
        </div>
        <div className="absolute inset-3 rounded-full border border-teal-200"></div>
      </div>
    ),
    title: "No Training Needed",
    description: "Deploy instantly with pre-configured industry knowledge and conversational abilities that work from day one.",
    color: "from-teal-500 to-cyan-400"
  }, {
    icon: (
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-600/40"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-6 bg-yellow-300 rounded-full transform rotate-12"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-4 bg-orange-300 rounded-full transform -rotate-12"></div>
      </div>
    ),
    title: "Instant Deployment",
    description: "Get up and running in minutes, not months. Simple setup process with immediate impact on your business operations.",
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
              <div className="flex items-center justify-center mb-4 sm:mb-6 mx-auto">
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
