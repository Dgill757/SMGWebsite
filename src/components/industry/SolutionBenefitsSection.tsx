
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import ROICalculator from '@/components/ROICalculator';

interface Comparison {
  feature: string;
  traditional: boolean;
  voiceAI: boolean;
}

interface SolutionBenefitsSectionProps {
  benefits: string[];
  comparisons: Comparison[];
  industryName?: string;
}

const SolutionBenefitsSection = ({ benefits, comparisons, industryName = "" }: SolutionBenefitsSectionProps) => {
  const titleText = industryName 
    ? `The SummitVoiceAI Solution for ${industryName}`
    : "The SummitVoiceAI Solution";

  return (
    <section className="py-20" id="solution-benefits">
      <div className="container mx-auto px-4">
        <h2 className="heading-md text-center mb-4" data-seo-heading="solution">
          The <span className="text-gradient">SummitVoiceAI</span> Solution
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Transform your business with AI voice technology designed specifically for {industryName || 'your industry'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-xl font-semibold mb-6">Key Benefits</h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-4 mt-1 text-voiceai-primary">
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p>{benefit}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" aria-label="Feature Comparison Table">
                <thead>
                  <tr>
                    <th className="text-left pb-2 border-b" scope="col">Feature</th>
                    <th className="px-4 pb-2 border-b text-center" scope="col">Traditional Approach</th>
                    <th className="px-4 pb-2 border-b text-center" scope="col">SummitVoiceAI</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((item, index) => (
                    <tr key={index} className="border-b border-border/30">
                      <td className="py-3">{item.feature}</td>
                      <td className="px-4 py-3 text-center">
                        {item.traditional ? 
                          <span aria-label="Yes">
                            <CheckCircle className="h-5 w-5 inline text-green-500" aria-hidden="true" />
                          </span> : 
                          <span aria-label="No">
                            <XCircle className="h-5 w-5 inline text-red-500" aria-hidden="true" />
                          </span>
                        }
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.voiceAI ? 
                          <span aria-label="Yes">
                            <CheckCircle className="h-5 w-5 inline text-voiceai-primary" aria-hidden="true" />
                          </span> : 
                          <span aria-label="No">
                            <XCircle className="h-5 w-5 inline text-muted-foreground" aria-hidden="true" />
                          </span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-8 max-w-5xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center">Calculate Your Potential ROI</h3>
          <ROICalculator />
        </div>
      </div>
    </section>
  );
};

export default SolutionBenefitsSection;
