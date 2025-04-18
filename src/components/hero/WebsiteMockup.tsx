
import React from 'react';

const WebsiteMockup = () => {
  return (
    <div className="w-full lg:w-1/2 relative">
      <div className="relative w-full aspect-square max-w-lg mx-auto">
        <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/20 shadow-xl glassmorphism animate-float">
          <div className="absolute inset-0 bg-gradient-to-br from-voiceai-primary/10 to-voiceai-secondary/10"></div>
          
          <div className="absolute inset-6 bg-white dark:bg-black/60 rounded-2xl shadow-lg overflow-hidden flex flex-col">
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
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
              <div className="w-full max-w-md mx-auto text-center space-y-4">
                <h3 className="text-xl font-bold">Welcome to Our Service</h3>
                <p className="text-sm text-gray-500">How can we help you today?</p>
              </div>
              
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
          
          <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-voiceai-primary/30 animate-pulse-glow"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-voiceai-secondary/30 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          
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
      </div>
    </div>
  );
};

export default WebsiteMockup;
