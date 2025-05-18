
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Clock, BarChart } from 'lucide-react';

interface CostItem {
  title: string;
  human: string;
  ai: string;
  icon: React.ReactNode;
}

interface CostComparisonProps {
  costs: {
    yearly: CostItem[];
    threeYear: {
      human: string;
      ai: string;
    };
    fiveYear: {
      human: string;
      ai: string;
    };
  };
}

const CostComparisonSection = ({ costs }: CostComparisonProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="heading-md text-center mb-4">
          Cost Comparison
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          See how much you can save with SummitVoiceAI compared to traditional staffing
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* First card - 1-Year Costs */}
          <div className="bg-white dark:bg-voiceai-dark/40 rounded-xl p-6 shadow-lg pb-8">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">1-Year Costs</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 font-semibold mb-2 pb-2 border-b border-border/30">
                <div>Item</div>
                <div className="text-center">Human Staff</div>
                <div className="text-center">Voice AI</div>
              </div>
              
              {costs.yearly.map((item, index) => (
                <div key={index} className="grid grid-cols-3 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-voiceai-primary">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <div className="text-center">{item.human}</div>
                  <div className="text-center text-voiceai-primary font-semibold">{item.ai}</div>
                </div>
              ))}
              
              <div className="grid grid-cols-3 font-bold pt-4 border-t border-border/30">
                <div>Total</div>
                <div className="text-center">${calculateTotal(costs.yearly, 'human')}</div>
                <div className="text-center text-voiceai-primary">${calculateTotal(costs.yearly, 'ai')}</div>
              </div>
            </div>
          </div>

          {/* Second card - 3-Year Projection */}
          <div className="bg-white dark:bg-voiceai-dark/40 rounded-xl p-6 shadow-lg pb-8">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">3-Year Projection</h3>
            </div>
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-6">
                <ComparisonBar 
                  label="Human Staff" 
                  value={parseInt(costs.threeYear.human.replace(/[^0-9]/g, ''))} 
                  color="bg-gray-500" 
                  textColor="text-gray-700"
                />
                <ComparisonBar 
                  label="SummitVoiceAI" 
                  value={parseInt(costs.threeYear.ai.replace(/[^0-9]/g, ''))} 
                  color="bg-voiceai-primary" 
                  textColor="text-voiceai-primary"
                />
              </div>
              <div className="mt-6 pb-2 text-center">
                <p className="font-semibold">Estimated 3-Year Savings:</p>
                <p className="text-2xl font-bold text-voiceai-primary mt-4">
                  ${calculateSavings(costs.threeYear.human, costs.threeYear.ai)}
                </p>
              </div>
            </div>
          </div>

          {/* Third card - 5-Year Projection */}
          <div className="bg-white dark:bg-voiceai-dark/40 rounded-xl p-6 shadow-lg pb-8">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">5-Year Projection</h3>
            </div>
            <div className="flex flex-col h-full justify-between">
              <div className="space-y-6">
                <ComparisonBar 
                  label="Human Staff" 
                  value={parseInt(costs.fiveYear.human.replace(/[^0-9]/g, ''))} 
                  color="bg-gray-500" 
                  textColor="text-gray-700"
                />
                <ComparisonBar 
                  label="SummitVoiceAI" 
                  value={parseInt(costs.fiveYear.ai.replace(/[^0-9]/g, ''))} 
                  color="bg-voiceai-primary" 
                  textColor="text-voiceai-primary"
                />
              </div>
              <div className="mt-6 pb-2 text-center">
                <p className="font-semibold">Estimated 5-Year Savings:</p>
                <p className="text-2xl font-bold text-voiceai-primary mt-4">
                  ${calculateSavings(costs.fiveYear.human, costs.fiveYear.ai)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ComparisonBar = ({ label, value, color, textColor }: { label: string, value: number, color: string, textColor: string }) => {
  const maxValue = 300000; // Maximum value for scaling
  const percentage = (value / maxValue) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span>{label}</span>
        <span className={`font-semibold ${textColor}`}>${value.toLocaleString()}</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};

// Helper functions
const calculateTotal = (items: CostItem[], type: 'human' | 'ai') => {
  return items.reduce((acc, item) => {
    const value = parseInt(item[type].replace(/[^0-9]/g, '')) || 0;
    return acc + value;
  }, 0).toLocaleString();
};

const calculateSavings = (human: string, ai: string) => {
  const humanValue = parseInt(human.replace(/[^0-9]/g, '')) || 0;
  const aiValue = parseInt(ai.replace(/[^0-9]/g, '')) || 0;
  return (humanValue - aiValue).toLocaleString();
};

export default CostComparisonSection;

