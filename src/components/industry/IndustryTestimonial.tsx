
import React from 'react';
import { Star } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
}

interface TestimonialProps {
  name: string;
  role: string;
  companyName: string;
  quote: string;
  image: string;
  metrics: Metric[];
}

const IndustryTestimonial = ({ 
  name, 
  role, 
  companyName, 
  quote, 
  image,
  metrics 
}: TestimonialProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-voiceai-primary/10 to-voiceai-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="heading-md text-center mb-12">
          Success Story
        </h2>
        
        <div className="bg-gradient-to-br from-voiceai-dark/90 to-black/70 border border-white/10 rounded-2xl shadow-2xl shadow-voiceai-primary/30 overflow-hidden max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image and Info */}
            <div className="relative h-full min-h-[300px] lg:min-h-[400px] bg-gradient-to-br from-voiceai-primary to-voiceai-secondary">
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1.5" fill="white" />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                </svg>
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-white text-center">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden mb-4">
                  <img 
                    src={image} 
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-white/80">{role}</p>
                <p className="font-bold mt-1">{companyName}</p>
                
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-300" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Testimonial and Metrics */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 opacity-30 text-voiceai-primary">
                  <path d="M14.4 24H7.2C6.64 24 6.08 23.76 5.68 23.36C5.28 22.96 5.04 22.4 5.04 21.84V14.64C5.04 14.08 5.28 13.52 5.68 13.12C6.08 12.72 6.64 12.48 7.2 12.48H14.4C14.96 12.48 15.52 12.72 15.92 13.12C16.32 13.52 16.56 14.08 16.56 14.64V21.84C16.56 22.4 16.32 22.96 15.92 23.36C15.52 23.76 14.96 24 14.4 24ZM7.2 14.64V21.84H14.4V14.64H7.2Z" fill="currentColor" />
                  <path d="M28.8 24H21.6C21.04 24 20.48 23.76 20.08 23.36C19.68 22.96 19.44 22.4 19.44 21.84V14.64C19.44 14.08 19.68 13.52 20.08 13.12C20.48 12.72 21.04 12.48 21.6 12.48H28.8C29.36 12.48 29.92 12.72 30.32 13.12C30.72 13.52 30.96 14.08 30.96 14.64V21.84C30.96 22.4 30.72 22.96 30.32 23.36C29.92 23.76 29.36 24 28.8 24ZM21.6 14.64V21.84H28.8V14.64H21.6Z" fill="currentColor" />
                  <path d="M12.24 28.32C11.68 28.32 11.12 28.56 10.72 28.96C10.32 29.36 10.08 29.92 10.08 30.48C10.08 31.04 10.32 31.6 10.72 32C11.12 32.4 11.68 32.64 12.24 32.64H35.28C36.4 32.64 37.52 32.16 38.32 31.36C39.12 30.56 39.6 29.44 39.6 28.32V14.64C39.6 14.08 39.36 13.52 38.96 13.12C38.56 12.72 38 12.48 37.44 12.48H34.56C34 12.48 33.44 12.72 33.04 13.12C32.64 13.52 32.4 14.08 32.4 14.64C32.4 15.2 32.64 15.76 33.04 16.16C33.44 16.56 34 16.8 34.56 16.8H35.28V28.32H12.24Z" fill="currentColor" />
                </svg>
                
                <p className="text-lg leading-relaxed mb-8 text-white">
                  "{quote}"
                </p>
              </div>
              
              <div>
                <h4 className="text-sm uppercase text-white/60 mb-4 font-medium">Results Achieved</h4>
                <div className="grid grid-cols-3 gap-4">
                  {metrics.map((metric, index) => (
                    <div key={index} className="text-center p-3 bg-black/30 border border-white/10 rounded-lg">
                      <p className="text-xl lg:text-2xl font-bold text-voiceai-primary">{metric.value}</p>
                      <p className="text-xs text-white/80 font-medium">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryTestimonial;
