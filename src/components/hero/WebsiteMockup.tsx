
import React from 'react';

const WebsiteMockup = () => {
  return (
    <div className="w-full lg:w-1/2 relative">
      <div className="relative w-full aspect-square max-w-lg mx-auto">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-voiceai-primary/30 via-voiceai-secondary/20 to-voiceai-accent/30 filter blur-xl animate-pulse-glow"></div>
        
        <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl glassmorphism animate-float">
          <div className="absolute inset-0 bg-gradient-to-br from-voiceai-primary/10 to-voiceai-secondary/10"></div>
          
          <div className="absolute inset-6 bg-black/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden flex flex-col border border-white/10">
            {/* Browser header */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 bg-black/60">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
              </div>
              <div className="mx-auto flex items-center text-xs text-white/60 glassmorphism px-3 py-1 rounded-lg">
                yourwebsite.com
              </div>
            </div>
            
            {/* Website content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-gradient-to-br from-black/90 to-gray-900/90">
              <div className="w-full max-w-md mx-auto text-center space-y-6">
                <h3 className="text-2xl font-bold text-gradient">Welcome to Our Service</h3>
                <p className="text-sm text-white/70">How can we help you today?</p>
                
                {/* Mock chat interface */}
                <div className="space-y-3 text-left">
                  <div className="glassmorphism p-3 rounded-lg text-xs text-white/80 max-w-xs">
                    Hi! I'm interested in your services...
                  </div>
                  <div className="glassmorphism p-3 rounded-lg text-xs text-gradient max-w-xs ml-auto">
                    I'd be happy to help! Let me connect you with an expert right away.
                  </div>
                </div>
              </div>
              
              {/* Voice AI Button */}
              <div className="absolute bottom-6 right-6">
                <div className="relative">
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-voiceai-primary to-voiceai-secondary animate-ping opacity-30"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-r from-voiceai-primary to-voiceai-secondary animate-ping opacity-40" style={{ animationDelay: '0.5s' }}></div>
                  
                  <button className="relative w-16 h-16 rounded-full bg-gradient-to-r from-voiceai-primary to-voiceai-secondary flex items-center justify-center shadow-2xl shadow-voiceai-primary/50 hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="22"></line>
                    </svg>
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-20 right-0 w-52 p-3 rounded-xl glassmorphism text-sm text-white/90 shadow-lg opacity-90">
                    <p className="text-gradient font-semibold">✨ AI Voice Assistant Active</p>
                    <p className="text-xs mt-1">Click to speak with our AI</p>
                  </div>
                  
                  {/* Active indicator */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50 border-2 border-black"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional floating elements */}
          <div className="absolute -top-8 -left-8 w-20 h-20 rounded-full bg-voiceai-primary/40 animate-pulse-glow filter blur-lg"></div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-voiceai-secondary/40 animate-pulse-glow filter blur-lg" style={{ animationDelay: '2s' }}></div>
          
          {/* Animated connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F472B6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            
            <path d="M50,100 Q200,150 350,100" stroke="url(#lineGradient)" strokeWidth="2" fill="none" opacity="0.4">
              <animate attributeName="d" dur="8s" repeatCount="indefinite" values="M50,100 Q200,150 350,100; M100,150 Q200,200 300,150; M50,100 Q200,150 350,100" />
            </path>
            <path d="M100,300 Q200,250 300,300" stroke="url(#lineGradient)" strokeWidth="1" fill="none" opacity="0.3">
              <animate attributeName="d" dur="12s" repeatCount="indefinite" values="M100,300 Q200,250 300,300; M50,250 Q200,300 350,250; M100,300 Q200,250 300,300" />
            </path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WebsiteMockup;
