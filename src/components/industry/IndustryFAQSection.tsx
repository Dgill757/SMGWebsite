
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface IndustryFAQSectionProps {
  faqs: FAQ[];
  industryName: string;
}

const IndustryFAQSection = ({ faqs, industryName }: IndustryFAQSectionProps) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="heading-md text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Common questions about SummitVoiceAI for {industryName}
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-lg font-semibold py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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

export default IndustryFAQSection;
