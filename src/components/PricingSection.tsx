
import React, { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';

const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const tiers = [
    {
      name: "Starter",
      description: "Perfect for small businesses handling up to 100 calls per month",
      monthlyPrice: 249,
      annualPrice: 199,
      features: [
        "Smart voice AI assistant",
        "Website widget integration",
        "Call handling (up to 100/mo)",
        "Basic appointment scheduling",
        "Email notifications",
        "Standard business hours support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses with higher call volume and advanced needs",
      monthlyPrice: 499,
      annualPrice: 399,
      features: [
        "Everything in Starter",
        "Call handling (up to 500/mo)",
        "Calendar integration",
        "SMS notifications & reminders",
        "Customer information collection",
        "Lead qualification & routing",
        "Custom voice & personality",
        "Priority support"
      ],
      cta: "Start 14-Day Trial",
      popular: true
    },
    {
      name: "Enterprise",
      description: "Customized solution for high-volume businesses with complex requirements",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "Everything in Professional",
        "Unlimited call handling",
        "CRM integration",
        "Payment processing",
        "Multi-location support",
        "Advanced analytics & reporting",
        "Custom workflows & scripts",
        "Dedicated account manager",
        "99.9% uptime SLA"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-gradient-to-b from-background to-voiceai-primary/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-lg">Simple, <span className="text-gradient">Transparent</span> Pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core Voice AI technology.
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-voiceai-primary' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)} 
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                isAnnual ? 'bg-voiceai-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
            <div className="flex items-center space-x-1">
              <span className={`text-sm font-medium ${isAnnual ? 'text-voiceai-primary' : 'text-muted-foreground'}`}>
                Annual
              </span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative rounded-2xl overflow-hidden transition-all ${
                tier.popular 
                  ? 'shadow-xl shadow-voiceai-primary/20 scale-105 border-2 border-voiceai-primary bg-white dark:bg-voiceai-dark/60' 
                  : 'shadow-lg border border-border bg-white/80 dark:bg-voiceai-dark/40 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-voiceai-primary text-white px-4 py-1 text-xs font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground mb-6 h-12">{tier.description}</p>
                
                <div className="mb-6">
                  {tier.name === "Enterprise" ? (
                    <div className="text-4xl font-bold">Custom</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">
                        ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                        <span className="text-lg font-normal text-muted-foreground">/mo</span>
                      </div>
                      {isAnnual && (
                        <p className="text-sm text-muted-foreground mt-1">Billed annually (${tier.annualPrice * 12}/year)</p>
                      )}
                    </>
                  )}
                </div>
                
                <button 
                  className={`w-full py-3 px-4 rounded-lg font-medium mb-8 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-voiceai-primary to-voiceai-secondary text-white' 
                      : tier.name === "Enterprise" 
                        ? 'bg-white text-voiceai-primary border border-voiceai-primary/20' 
                        : 'bg-voiceai-primary/10 text-voiceai-primary'
                  }`}
                >
                  {tier.cta}
                </button>
                
                <div className="space-y-4">
                  <p className="text-sm font-medium">Includes:</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-voiceai-dark/40 rounded-lg p-6 shadow-md">
              <h4 className="flex items-center gap-2 text-lg font-medium mb-2">
                <HelpCircle className="h-5 w-5 text-voiceai-primary" />
                Is there a setup fee?
              </h4>
              <p className="text-muted-foreground">No, there are no setup fees. You only pay the monthly or annual subscription fee for your chosen plan.</p>
            </div>
            
            <div className="bg-white dark:bg-voiceai-dark/40 rounded-lg p-6 shadow-md">
              <h4 className="flex items-center gap-2 text-lg font-medium mb-2">
                <HelpCircle className="h-5 w-5 text-voiceai-primary" />
                What happens if I exceed my monthly call limit?
              </h4>
              <p className="text-muted-foreground">If you exceed your plan's call limit, additional calls will be billed at $2 per call. We'll notify you when you reach 80% of your limit so you can upgrade if needed.</p>
            </div>
            
            <div className="bg-white dark:bg-voiceai-dark/40 rounded-lg p-6 shadow-md">
              <h4 className="flex items-center gap-2 text-lg font-medium mb-2">
                <HelpCircle className="h-5 w-5 text-voiceai-primary" />
                How long does it take to set up?
              </h4>
              <p className="text-muted-foreground">Most businesses are up and running within 24 hours. The basic setup takes just minutes, and we provide guidance for customizing your AI assistant to match your business needs.</p>
            </div>
            
            <div className="bg-white dark:bg-voiceai-dark/40 rounded-lg p-6 shadow-md">
              <h4 className="flex items-center gap-2 text-lg font-medium mb-2">
                <HelpCircle className="h-5 w-5 text-voiceai-primary" />
                Can I cancel anytime?
              </h4>
              <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. For monthly plans, you'll have access until the end of your billing cycle. For annual plans, you can continue using the service until the end of your annual term.</p>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">Still have questions? We're here to help!</p>
              <a href="#contact" className="btn-primary inline-block">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
