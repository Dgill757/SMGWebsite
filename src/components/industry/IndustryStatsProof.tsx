
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ChartBar, TrendingUp, Clock, Users, Phone, Calendar, Star, CheckCircle, Info } from 'lucide-react';
import './IndustryStatsProof.css';

// Define types for our industry stats data
export interface IndustryStat {
  metric: string;
  value: string;
  source: string;
  blurb: string;
  icon?: LucideIcon;
}

export interface IndustryStatsData {
  industry: string;
  stats: IndustryStat[];
  keywords: string[];
}

interface IndustryStatsProofProps {
  data: IndustryStatsData;
}

// Map metric keywords to icons
const getIconForMetric = (metric: string): LucideIcon => {
  const metricLower = metric.toLowerCase();
  
  if (metricLower.includes('call') || metricLower.includes('response')) return Phone;
  if (metricLower.includes('time') || metricLower.includes('wait') || metricLower.includes('hold')) return Clock;
  if (metricLower.includes('revenue') || metricLower.includes('cost') || metricLower.includes('roi')) return TrendingUp;
  if (metricLower.includes('satisfaction') || metricLower.includes('csat') || metricLower.includes('nps')) return Star;
  if (metricLower.includes('appointment') || metricLower.includes('booking') || metricLower.includes('schedule')) return Calendar;
  if (metricLower.includes('lead') || metricLower.includes('client') || metricLower.includes('customer')) return Users;
  if (metricLower.includes('resolution') || metricLower.includes('capture')) return CheckCircle;
  
  // Default icon
  return ChartBar;
};

const IndustryStatsProof: React.FC<IndustryStatsProofProps> = ({ data }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/90 overflow-hidden relative stats-section stats-bg-gradient">
      {/* Background elements - subtle circuit-like patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50h100M50 0v100" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
              <circle cx="0" cy="50" r="2" fill="currentColor" />
              <circle cx="100" cy="50" r="2" fill="currentColor" />
              <circle cx="50" cy="0" r="2" fill="currentColor" />
              <circle cx="50" cy="100" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="heading-lg">
            <span className="text-gradient">{data.industry}</span> Industry Insights
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            See how SummitVoiceAI is transforming {data.industry} businesses with AI voice technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.stats.map((stat, index) => {
            const Icon = stat.icon || getIconForMetric(stat.metric);
            
            return (
              <div 
                key={index}
                className="bg-white dark:bg-voiceai-dark/40 rounded-xl p-6 shadow-lg border border-voiceai-primary/10 hover:border-voiceai-primary/30 transition-all group stats-card"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-lg bg-voiceai-primary/10 text-voiceai-primary group-hover:bg-voiceai-primary/20 transition-all stats-icon">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{stat.metric}</h3>
                    <div className="flex flex-col gap-1">
                      <p className="text-2xl font-bold text-voiceai-primary">{stat.value}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Info className="w-3.5 h-3.5 mr-1.5" />
                        <span>Source: {stat.source}</span>
                      </div>
                      <p className="mt-2 font-medium">{stat.blurb}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SEO Keywords (Hidden visually but present for search engines) */}
        <div className="sr-only">
          {data.keywords.map((keyword, i) => (
            <span key={i}>{keyword}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustryStatsProof;
