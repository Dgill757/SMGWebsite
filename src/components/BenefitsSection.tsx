
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
  
  return <section id="features" className="pt-0 pb-20 px-4 md:px-8 lg:px-16 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background"></div>
      
      {/* Content */}
      <div className="container mx-auto relative z-10">
        <section style={{textAlign: 'center', padding: '200px 0'}}>
          <script src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"></script>
          <div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"></div>
        </section>

        <div className="text-center mb-16">
          <h2 className="heading-lg">
            Stop Losing <span className="text-gradient">Thousands of Dollar$</span> in Missed Opportunities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            If your business misses 2-5 calls a day, that's 60-150 potential customers lost monthly. At $5,000-$10,000 per customer, you're leaving massive revenue on the table.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => <div key={index} className="bg-white dark:bg-voiceai-dark/40 rounded-xl p-6 shadow-lg card-hover border border-border relative overflow-hidden">
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${benefit.color} opacity-10`}></div>
              <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-br ${benefit.color} text-white mb-4`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>)}
        </div>
        
        {/* ROI Calculator Teaser */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-voiceai-primary/10 to-voiceai-secondary/10 border border-voiceai-primary/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="heading-md mb-2">Calculate Your ROI</h3>
              <p className="text-muted-foreground">
                See how much revenue you're leaving on the table with missed calls and leads.
              </p>
            </div>
            <div className="bg-voiceai-dark/5 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">$120,000+</div>
              <p className="text-sm text-muted-foreground">Average annual revenue increase</p>
            </div>
            <button 
              onClick={() => setIsROIDialogOpen(true)}
              className="btn-primary"
            >
              Get Your Custom ROI Analysis
            </button>
          </div>
        </div>
      </div>
      
      {/* ROI Calculator Dialog */}
      <Dialog open={isROIDialogOpen} onOpenChange={setIsROIDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Missed Call ROI Calculator</DialogTitle>
          </DialogHeader>
          <ROICalculator />
        </DialogContent>
      </Dialog>
    </section>;
};

export default BenefitsSection;
