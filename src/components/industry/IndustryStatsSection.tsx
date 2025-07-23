
import React from 'react';
import { motion } from 'framer-motion';

export type StatItem = {
  metric: string;
  value: string;
  source: string;
  benefit: string;
};

interface IndustryStatsProps {
  stats: StatItem[];
  industryName: string;
  keywords: string[];
}

const IndustryStatsSection = ({ stats, industryName, keywords }: IndustryStatsProps) => {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 neural-bg" />
      
      <div className="container mx-auto px-4">
        <h2 className="heading-lg text-center mb-2">
          Industry Stats & Proof
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          See why businesses choose <span className="font-semibold text-voiceai-primary">SummitVoiceAI</span> for their {industryName.toLowerCase()} voice assistant solution
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20 relative overflow-hidden group"
            >
              {/* Subtle glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-voiceai-primary/0 via-voiceai-primary/5 to-voiceai-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl blur-xl" />
              
              <div className="relative">
                <h3 className="text-lg font-medium text-white/70 mb-1">
                  {stat.metric}
                </h3>
                <div className="text-2xl font-bold mb-3 text-voiceai-primary">
                  {stat.value}
                </div>
                <div className="flex flex-col justify-between h-full">
                  <p className="text-sm mb-2 text-white/90">
                    {stat.benefit}
                  </p>
                  <div className="text-xs text-white/60 mt-auto">
                    Source: {stat.source}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* SEO Keywords section (visually hidden but good for SEO) */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            {keywords.join(' • ')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IndustryStatsSection;
