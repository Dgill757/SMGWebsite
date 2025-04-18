
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureItemProps {
  Icon: LucideIcon;
  text: string;
  colorClass: string;
}

const FeatureItem = ({ Icon, text, colorClass }: FeatureItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}>
        <Icon size={20} className={text.includes('Call') ? 'text-voiceai-primary' : 
                                text.includes('Scheduling') ? 'text-voiceai-secondary' : 
                                'text-voiceai-accent'} />
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
};

export default FeatureItem;
