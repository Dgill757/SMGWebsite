import React, { useState } from 'react';
import VoiceWaveAnimation from './VoiceWaveAnimation';
import { Play, PhoneCall, Calendar, CreditCard } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const scrollToWidget = (event: React.MouseEvent) => {
    event.preventDefault();
    const widgetElement = document.getElementById('web-widget');
    if (widgetElement) {
      widgetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Toggle animation state
      setIsPlaying(true);
      
      // After some time, reset the animation state
      setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-20 pb-[100px]">
      {/* Background Elements */}
      <div className="absolute inset-0 neural-bg opacity-40 z-0"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-voiceai-primary/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-voiceai-secondary/20 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-voiceai-primary/10 text-voiceai-primary px-4 py-2 rounded-full mb-6">
                <span className="animate-pulse rounded-full w-2 h-2 bg-voiceai-primary"></span>
                <span className="text-sm font-medium">The Future of Websites Is Here</span>
              </div>
              <h1 className="heading-xl">
                Give Your Website a <span className="text-gradient">Voice</span> & <span className="text-gradient">Brain</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Stop losing leads to unanswered calls and static forms. Our Voice AI handles calls, qualifies leads, books appointments, and follows up—all while you sleep.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#pricing" className="btn-primary flex items-center justify-center gap-2">
                <span>Get Started Today</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <button 
                onClick={scrollToWidget}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <span>Listening...</span>
                    <VoiceWaveAnimation isAnimating={true} className="h-6" />
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    <span>Hear It In Action</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-voiceai-primary/10 flex items-center justify-center">
                  <PhoneCall size={20} className="text-voiceai-primary" />
                </div>
                <span className="text-sm">Never Miss a Call</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-voiceai-secondary/10 flex items-center justify-center">
                  <Calendar size={20} className="text-voiceai-secondary" />
                </div>
                <span className="text-sm">Auto Scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-voiceai-accent/10 flex items-center justify-center">
                  <CreditCard size={20} className="text-voiceai-accent" />
                </div>
                <span className="text-sm">Billing & Invoicing</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main illustration container */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/20 shadow-xl glassmorphism animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-voiceai-primary/10 to-voiceai-secondary/10"></div>
                
                {/* Website/App mockup with voice UI */}
                <div className="absolute inset-6 bg-white dark:bg-black/60 rounded-2xl shadow-lg overflow-hidden flex flex-col">
                  {/* Mockup header */}
                  <div className="h-10 border-b border-gray-200 dark:border-gray-800 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto flex items-center text-xs text-gray-500">
                      yourwebsite.com
                    </div>
                  </div>
                  
                  {/* Mockup content */}
                  <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                    <div className="w-full max-w-md mx-auto text-center space-y-4">
                      <h3 className="text-xl font-bold">Welcome to Our Service</h3>
                      <p className="text-sm text-gray-500">How can we help you today?</p>
                    </div>
                    
                    {/* Voice assistant UI */}
                    <div className="absolute bottom-6 right-6">
                      <div className="relative">
                        <button className="w-14 h-14 rounded-full bg-gradient-to-r from-voiceai-primary to-voiceai-secondary flex items-center justify-center shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="22"></line>
                          </svg>
                        </button>
                        <div className="absolute -top-16 right-0 w-48 p-3 rounded-lg glassmorphism text-sm">
                          <p>Click to speak with our AI assistant</p>
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-voiceai-primary/30 animate-pulse-glow"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-voiceai-secondary/30 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
                
                {/* Neural network lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100,50 Q200,150 300,50" stroke="url(#gradient1)" strokeWidth="1" fill="none" opacity="0.3">
                    <animate attributeName="d" dur="10s" repeatCount="indefinite" values="M100,50 Q200,150 300,50; M50,100 Q200,200 350,100; M100,50 Q200,150 300,50" />
                  </path>
                  <path d="M50,200 Q200,250 350,200" stroke="url(#gradient2)" strokeWidth="1" fill="none" opacity="0.3">
                    <animate attributeName="d" dur="15s" repeatCount="indefinite" values="M50,200 Q200,250 350,200; M100,150 Q200,200 300,150; M50,200 Q200,250 350,200" />
                  </path>
                  <path d="M100,350 Q200,300 300,350" stroke="url(#gradient1)" strokeWidth="1" fill="none" opacity="0.3">
                    <animate attributeName="d" dur="12s" repeatCount="indefinite" values="M100,350 Q200,300 300,350; M50,300 Q200,250 350,300; M100,350 Q200,300 300,350" />
                  </path>
                  
                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#F472B6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Stats card */}
              <div className="absolute -bottom-10 -left-10 md:left-auto md:-right-10 glassmorphism p-4 rounded-xl animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Call Conversion</p>
                    <p className="text-xl font-bold">+327%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Code Embed Block */}
      <section className="relative z-10 text-center">
        <script src="https://d2cqc7yqzf8c8f.cloudfront.net/web-widget-v1.js"></script>
        <div data-widget-key="8ba094ef-bcf2-4aec-bcef-ee65c95b0492"></div>
      </section>
    </div>
  );
};

export default HeroSection;
