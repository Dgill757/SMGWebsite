
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  Icon: LucideIcon;
  text: string;
  colorClass: string;
}

const FeatureItem = ({ Icon, text, colorClass }: FeatureItemProps) => {
  const getIconColor = () => {
    if (text.includes('Call')) return 'text-voiceai-primary';
    if (text.includes('Scheduling')) return 'text-voiceai-secondary';
    return 'text-voiceai-accent';
  };

  const getGradient = () => {
    if (text.includes('Call')) return 'from-voiceai-primary/20 to-voiceai-primary/5';
    if (text.includes('Scheduling')) return 'from-voiceai-secondary/20 to-voiceai-secondary/5';
    return 'from-voiceai-accent/20 to-voiceai-accent/5';
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${colorClass} card-hover group`}>
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient()} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className={`${getIconColor()} group-hover:scale-110 transition-transform duration-300`} />
      </div>
      <span className="text-base font-semibold text-foreground/90 group-hover:text-white transition-all duration-300">{text}</span>
    </div>
  );
};

export default FeatureItem;
