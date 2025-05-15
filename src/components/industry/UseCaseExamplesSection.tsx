
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Check } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface UseCaseStep {
  type: 'ai' | 'human';
  text: string;
}

interface UseCase {
  title: string;
  description: string;
  steps: UseCaseStep[];
  outcome: string;
}

interface UseCaseExamplesSectionProps {
  useCases: UseCase[];
}

const UseCaseExamplesSection = ({ useCases }: UseCaseExamplesSectionProps) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="heading-md text-center mb-4">
          Real-World Use Cases
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          See how our AI voice assistant handles real scenarios in your industry
        </p>

        <div className="space-y-16">
          {useCases.map((useCase, index) => (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {index % 2 === 0 ? (
                <>
                  <ConversationFlow useCase={useCase} />
                  <UseCaseInfo useCase={useCase} />
                </>
              ) : (
                <>
                  <UseCaseInfo useCase={useCase} />
                  <ConversationFlow useCase={useCase} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ConversationFlow = ({ useCase }: { useCase: UseCase }) => {
  return (
    <div className="bg-white dark:bg-voiceai-dark/40 rounded-xl p-6 shadow-lg overflow-hidden">
      <div className="text-lg font-semibold mb-6 pb-2 border-b border-border/30 text-center">
        Conversation Flow
      </div>
      <div className="space-y-4">
        {useCase.steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className={`flex gap-3 ${step.type === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                step.type === 'ai' 
                  ? 'bg-voiceai-primary text-white rounded-bl-none' 
                  : 'bg-gray-100 dark:bg-gray-800 rounded-br-none'
              }`}
            >
              <div className="text-xs mb-1 opacity-70">
                {step.type === 'ai' ? 'VoiceAI Assistant' : 'Customer'}
              </div>
              <p>{step.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const UseCaseInfo = ({ useCase }: { useCase: UseCase }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
      <p className="text-muted-foreground mb-6">{useCase.description}</p>
      
      <div className="bg-voiceai-primary/10 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Check className="text-voiceai-primary" />
          <h4 className="font-semibold">Outcome</h4>
        </div>
        <p>{useCase.outcome}</p>
      </div>
    </div>
  );
};

export default UseCaseExamplesSection;
