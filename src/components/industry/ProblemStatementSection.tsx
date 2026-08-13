
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Problem {
  title: string;
  description: string;
  statistic: string;
}

interface ProblemStatementSectionProps {
  problems: Problem[];
  industryName: string;
}

const ProblemStatementSection = ({ problems, industryName }: ProblemStatementSectionProps) => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="heading-md text-center mb-4">
          Challenges Facing {industryName} Today
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          These industry challenges cost businesses thousands in lost revenue and opportunities each year
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {problems.map((problem, index) => (
              <AccordionItem key={index} value={`problem-${index}`}>
                <AccordionTrigger className="text-lg font-semibold py-4">
                  {problem.title}
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground">{problem.description}</p>
                    </div>
                    <div className="bg-voiceai-primary/10 rounded-lg p-4 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-voiceai-primary">{problem.statistic}</p>
                      <p className="text-xs text-muted-foreground text-center">Industry Impact</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
