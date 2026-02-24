
import React from 'react';
import { Calendar, PhoneCall, Calculator } from 'lucide-react';

const CALENDLY = 'https://calendly.com/aivoice/call';

interface CtaSectionProps {
  setCalendarOpen?: (open: boolean) => void;
  heading?: string;
  subheading?: string;
  buttonText?: string;
}

const CtaSection = ({
  heading = "Ready to Transform Your Business?",
  subheading = "Take the first step toward never missing another opportunity. Schedule your free consultation or request a personalized demo today.",
  buttonText
}: CtaSectionProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-voiceai-primary/20 to-voiceai-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-md mb-6">
            {heading}
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            {subheading}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glassmorphism rounded-xl p-6 shadow-lg border border-white/20 flex flex-col">
              <div className="mx-auto mb-4 p-3 rounded-full bg-voiceai-primary/10">
                <Calendar className="h-6 w-6 text-voiceai-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">Schedule Consultation</h3>
              <p className="text-sm text-white/70 mb-6">Book a 30-minute call with our solutions team</p>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-auto btn-primary w-full text-center"
                style={{ textDecoration: 'none' }}
              >
                Book Now
              </a>
            </div>

            <div className="glassmorphism rounded-xl p-6 shadow-lg border border-white/20 flex flex-col">
              <div className="mx-auto mb-4 p-3 rounded-full bg-voiceai-primary/10">
                <PhoneCall className="h-6 w-6 text-voiceai-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">Request Demo</h3>
              <p className="text-sm text-white/70 mb-6">See our AI in action with a personalized demo</p>
              <a
                href={CALENDLY}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-auto btn-primary w-full text-center"
                style={{ textDecoration: 'none' }}
              >
                {buttonText || 'Get Demo'}
              </a>
            </div>

            <div className="glassmorphism rounded-xl p-6 shadow-lg border border-white/20 flex flex-col">
              <div className="mx-auto mb-4 p-3 rounded-full bg-voiceai-primary/10">
                <Calculator className="h-6 w-6 text-voiceai-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">Calculate ROI</h3>
              <p className="text-sm text-white/70 mb-6">See how much you can save with SummitVoiceAI</p>
              <a href="#roi-calculator" className="mt-auto btn-secondary w-full text-center">
                Calculate Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
