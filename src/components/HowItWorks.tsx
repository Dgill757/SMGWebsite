
import React, { useState } from 'react';
import { Check, PhoneCall, Calendar, Mail, BellRing, CreditCard, Users } from 'lucide-react';
import VoiceWaveAnimation from './VoiceWaveAnimation';

const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      id: 'call',
      icon: <PhoneCall className="h-5 w-5" />,
      title: 'Handles Calls',
      description: "When a visitor calls your business or clicks the voice widget, our AI assistant answers immediately and engages in natural conversation.",
      visual: (
        <div className="bg-white dark:bg-voiceai-dark/60 rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="h-5 w-5 text-voiceai-primary" />
            </div>
            <div className="space-y-2">
              <div className="bg-voiceai-primary/10 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">AI Assistant</p>
                <p>Hello! Thank you for calling Ascend Roofing. I'm your AI assistant. How may I help you today?</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">Customer</p>
                <p>Hi, I'm calling about getting a quote for a roof repair.</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-muted-foreground mr-2">AI thinking...</p>
                <VoiceWaveAnimation isAnimating={activeStep === 0} className="h-4" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'qualify',
      icon: <Users className="h-5 w-5" />,
      title: 'Qualifies Leads',
      description: "Our AI asks the right questions to determine if the caller is a good fit for your services, saving you time and resources.",
      visual: (
        <div className="bg-white dark:bg-voiceai-dark/60 rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-voiceai-secondary" />
            </div>
            <div className="space-y-2">
              <div className="bg-voiceai-primary/10 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">AI Assistant</p>
                <p>I'd be happy to help with that! Could you tell me a bit more about your roof issue? When did you first notice it, and what's the approximate size of your home?</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">Customer</p>
                <p>We noticed a leak last week after the storm. Our house is about 2,500 square feet with a shingle roof that's about 15 years old.</p>
              </div>
              <div className="bg-voiceai-primary/10 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">AI Assistant</p>
                <p>Thank you for that information. Based on what you've shared, it sounds like you might need more than a simple repair. Would you be open to discussing replacement options as well?</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'schedule',
      icon: <Calendar className="h-5 w-5" />,
      title: 'Books Appointments',
      description: "Once qualified, the AI assistant schedules appointments directly into your calendar based on your real-time availability.",
      visual: (
        <div className="bg-white dark:bg-voiceai-dark/60 rounded-xl p-4 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-voiceai-accent" />
              </div>
              <div>
                <div className="bg-voiceai-primary/10 rounded-lg p-3 text-sm mb-2">
                  <p className="font-medium mb-1">AI Assistant</p>
                  <p>Great! I can schedule a free inspection with one of our specialists. We have availability this Thursday at 10 AM or Friday at 2 PM. Which works better for you?</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm">
                  <p className="font-medium mb-1">Customer</p>
                  <p>Thursday at 10 AM works for me.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-voiceai-secondary/10 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-voiceai-secondary" />
                <p className="font-medium">New Appointment Booked</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-muted-foreground">Customer:</p>
                <p>John Smith</p>
                <p className="text-muted-foreground">Date:</p>
                <p>Thursday, June 15</p>
                <p className="text-muted-foreground">Time:</p>
                <p>10:00 AM - 11:00 AM</p>
                <p className="text-muted-foreground">Service:</p>
                <p>Roof Inspection</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'follow-up',
      icon: <Mail className="h-5 w-5" />,
      title: 'Handles Follow-up',
      description: "The AI sends confirmation emails, text reminders, and follows up after appointments to keep your pipeline flowing.",
      visual: (
        <div className="bg-white dark:bg-voiceai-dark/60 rounded-xl p-4 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b pb-3">
              <Mail className="h-5 w-5 text-voiceai-primary" />
              <div>
                <p className="font-medium">Appointment Confirmation</p>
                <p className="text-xs text-muted-foreground">Sent: Just now</p>
              </div>
              <div className="ml-auto bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded">
                Delivered
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">Subject: Your Roof Inspection Appointment Confirmation</p>
              <p className="mb-3">Hello John,</p>
              <p className="mb-3">Your appointment for a roof inspection has been scheduled for Thursday, June 15th at 10:00 AM. Our specialist will arrive within the scheduled time window.</p>
              <p className="mb-3">Please have access to your roof available, and feel free to prepare any questions you might have about your roofing needs.</p>
              <div className="bg-voiceai-primary/5 p-3 rounded-lg text-center">
                <p className="mb-1 font-medium">Calendar Invite Attached</p>
                <div className="flex justify-center">
                  <button className="text-voiceai-primary hover:underline text-xs flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <BellRing className="h-5 w-5 text-voiceai-accent" />
              <div>
                <p className="font-medium">Reminder Scheduled</p>
                <p className="text-xs text-muted-foreground">24 hours before appointment</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'invoice',
      icon: <CreditCard className="h-5 w-5" />,
      title: 'Handles Payments',
      description: "When it's time to collect payment, our AI can send invoices, process payments, and update your financial records.",
      visual: (
        <div className="bg-white dark:bg-voiceai-dark/60 rounded-xl p-4 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-voiceai-dark/5 p-3 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-voiceai-secondary mr-2" />
                <p className="font-medium">Invoice #1234</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded">
                Paid
              </div>
            </div>
            
            <div className="border border-border rounded-lg">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Invoice Total</p>
                  <p className="font-bold">$2,500.00</p>
                </div>
              </div>
              
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <p>Roof Repair Service</p>
                  <p>$2,200.00</p>
                </div>
                <div className="flex justify-between">
                  <p>Materials Fee</p>
                  <p>$300.00</p>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t mt-2">
                  <p>Total</p>
                  <p>$2,500.00</p>
                </div>
              </div>
              
              <div className="p-4 bg-voiceai-secondary/5 text-sm rounded-b-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p className="font-medium">Payment Processed Successfully</p>
                </div>
                <p className="text-muted-foreground text-xs">Transaction ID: 8392748291</p>
                <p className="text-muted-foreground text-xs">Processed on: June 22, 2023 at 3:45 PM</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="absolute inset-0 neural-bg opacity-20"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="heading-lg">How Your <span className="text-voiceai-primary font-bold">Smart Website</span> Works</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From answering calls to processing payments, our Voice AI handles the entire customer journey so you can focus on delivering exceptional service.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Steps Navigator */}
          <div className="lg:w-1/3">
            <div className="space-y-1">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all text-left
                             ${activeStep === index 
                                ? 'bg-voiceai-primary/10 text-voiceai-primary shadow-sm' 
                                : 'hover:bg-voiceai-primary/5'}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                  ${activeStep === index 
                                    ? 'bg-voiceai-primary text-white' 
                                    : 'bg-muted text-muted-foreground'}`}>
                    {step.icon}
                  </div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{step.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Visual Demonstration */}
          <div className="lg:w-2/3">
            <div className="bg-gradient-to-r from-voiceai-primary/20 to-voiceai-secondary/20 p-1 rounded-2xl shadow-xl">
              <div className="bg-background rounded-xl p-6">
                {steps[activeStep].visual}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
