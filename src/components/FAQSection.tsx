
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How does the Voice AI actually sound? Is it robotic?",
      answer: "Our Voice AI uses the latest natural language technology to deliver human-like conversations. Most callers can't tell they're speaking with an AI. You can choose from various voice options and even customize the personality to match your brand."
    },
    {
      question: "Will it work with my existing business phone number?",
      answer: "Yes! We can either integrate with your existing phone system or provide a dedicated number that forwards to your Voice AI. The AI can then transfer calls to your team when needed or handle them completely on its own."
    },
    {
      question: "How does the AI know what to say about my specific business?",
      answer: "During onboarding, we'll help you configure your AI with information about your business, services, pricing, and common customer questions. The AI is trained on this information and continuously learns from interactions to improve over time."
    },
    {
      question: "What happens if the AI can't handle a particular call?",
      answer: "You can configure exactly how the AI should handle complex situations. It can transfer calls to your team when needed, take detailed messages, or schedule callbacks. You have complete control over when human intervention should occur."
    },
    {
      question: "How does the scheduling feature work with my calendar?",
      answer: "Our Voice AI integrates with popular calendar systems like Google Calendar, Outlook, and Calendly. It checks your real-time availability and only offers appointment slots that work with your schedule, eliminating double-bookings."
    },
    {
      question: "Can I listen to recordings of the calls handled by the AI?",
      answer: "Yes, all calls are recorded and transcribed for your review. You can access these through your dashboard along with AI-generated summaries of each conversation and any action items."
    },
    {
      question: "How quickly can I get set up?",
      answer: "Basic setup takes just minutes, and most businesses are fully operational within 24 hours. Our team provides hands-on support to ensure your Voice AI is properly configured and ready to handle calls effectively."
    },
    {
      question: "What kind of businesses benefit most from Voice AI?",
      answer: "Service-based businesses with high call volumes see the greatest benefit, including home services (plumbing, HVAC, roofing), healthcare practices, legal firms, real estate, automotive services, and professional services. If you rely on phone calls for leads and appointments, Voice AI can transform your business."
    }
  ];

  return (
    <section id="faq" className="section-padding bg-muted">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-lg">Frequently <span className="text-gradient">Asked Questions</span></h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our Voice AI solution
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white dark:bg-voiceai-dark/40 rounded-lg shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
