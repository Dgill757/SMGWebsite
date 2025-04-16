
import React, { useState } from 'react';
import { Check, Flame, Calendar, Building } from 'lucide-react';

const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const tiers = [{
    name: "Starter",
    description: "Perfect for small businesses ready to stop missing leads and start booking more appointments",
    monthlyPrice: 621,
    annualPrice: 497,
    annualTotal: 5964,
    features: [
      "Smart Voice AI Assistant (Web + Call)",
      "Website widget integration",
      "Call handling (pay-as-you-go: $0.18/min)",
      "Basic appointment scheduling",
      "CRM integration",
      "Lead capture & qualification",
      "Email & SMS notifications",
      "Customer data collection",
      "Standard business hours support"
    ],
    cta: "Get Started",
    popular: false,
    icon: <Calendar className="h-5 w-5" />,
    tagline: "Perfect for solo operators or lean teams who want to sound big and never miss a lead again."
  }, {
    name: "Professional",
    description: "Ideal for growing businesses that want full AI sales and marketing automation",
    monthlyPrice: 1245,
    annualPrice: 997,
    annualTotal: 11964,
    features: [
      "Everything in Starter, plus:",
      "Custom CRM pipeline & workflow build-out",
      "Lead nurturing automation (calls, emails, texts)",
      "Calendar & scheduling integrations",
      "Enhanced lead qualification & routing",
      "Custom AI voice & tone configuration",
      "Priority support"
    ],
    cta: "Get Started",
    popular: true,
    icon: <Flame className="h-5 w-5" />,
    tagline: "Most popular plan—set it and scale it. Turn your AI into a fully functioning sales assistant."
  }, {
    name: "Enterprise",
    description: "Built for high-volume, multi-location, or complex sales operations",
    monthlyPrice: 0,
    annualPrice: 0,
    annualTotal: 0,
    features: [
      "Everything in Professional, plus:",
      "Multi-location routing & support",
      "Advanced analytics & reporting",
      "CRM syncing & custom integrations",
      "Custom workflows, scripts & sales triggers",
      "Dedicated account manager",
      "Payment processing integration",
      "Custom onboarding, training & AI management"
    ],
    cta: "Contact Sales",
    popular: false,
    icon: <Building className="h-5 w-5" />,
    tagline: "Tailored to your exact sales operations—let us build and manage it for you."
  }];
  
  return <section id="pricing" className="section-padding bg-gradient-to-b from-background to-voiceai-primary/5">
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
            <button onClick={() => setIsAnnual(!isAnnual)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isAnnual ? 'bg-voiceai-primary' : 'bg-muted'}`}>
              <span className={`${isAnnual ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
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
          {tiers.map(tier => <div key={tier.name} className={`relative rounded-2xl overflow-hidden transition-all ${tier.popular ? 'shadow-xl shadow-voiceai-primary/20 scale-105 border-2 border-voiceai-primary bg-white dark:bg-voiceai-dark/60' : 'shadow-lg border border-border bg-white/80 dark:bg-voiceai-dark/40 hover:shadow-xl hover:-translate-y-1'}`}>
              {tier.popular && <div className="absolute top-0 right-0 bg-voiceai-primary text-white px-4 py-1 text-xs font-medium">
                  Most Popular
                </div>}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  {tier.name === "Professional" && <span className="text-voiceai-primary">🔹</span>}
                  {tier.name === "Enterprise" && <span className="text-voiceai-primary">🔹</span>}
                  {tier.name}
                </h3>
                <p className="text-muted-foreground mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  {tier.name === "Enterprise" ? (
                    <div className="text-4xl font-bold">Custom</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">
                        ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                        <span className="text-lg font-normal text-muted-foreground">/mo</span>
                      </div>
                      {isAnnual && tier.annualTotal > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Billed annually (${tier.annualTotal}/year)
                        </p>
                      )}
                    </>
                  )}
                </div>
                
                <button className={`w-full py-3 px-4 rounded-lg font-medium mb-8 ${tier.popular ? 'bg-gradient-to-r from-voiceai-primary to-voiceai-secondary text-white' : tier.name === "Enterprise" ? 'bg-white text-voiceai-primary border border-voiceai-primary/20' : 'bg-voiceai-primary/10 text-voiceai-primary'}`}>
                  {tier.cta}
                </button>
                
                <div className="space-y-4 mb-6">
                  <p className="text-sm font-medium">Includes:</p>
                  <ul className="space-y-3">
                    {tier.features.map(feature => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="flex items-start gap-2 text-sm text-voiceai-primary font-medium">
                    {tier.icon}
                    <span>{tier.tagline}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Still have questions? We're here to help!</p>
          <a href="#contact" className="btn-primary inline-block">Contact Us</a>
        </div>
      </div>
    </section>;
};

export default PricingSection;
