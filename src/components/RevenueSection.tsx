import React from 'react';

const RevenueSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative" id="features">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Stop Losing <span className="text-voiceai-primary">Revenue</span> to Missed Opportunities
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Transform every missed call into captured revenue with AI that works 24/7
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-voiceai-primary/30 to-voiceai-secondary/30 opacity-20"></div>
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-voiceai-primary to-voiceai-secondary rounded-full flex items-center justify-center shadow-lg shadow-voiceai-primary/30">
                <div className="orbital-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                  <div className="core"></div>
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-foreground">24/7 Availability</h3>
            <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">Your AI assistant never sleeps, ensuring every call is answered and every opportunity captured, regardless of time or day.</p>
          </div>

          <div className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-400/30 opacity-20"></div>
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <div className="holographic-currency">
                  <span className="currency-symbol text-2xl sm:text-3xl">$</span>
                  <div className="floating-particles">
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-foreground">Save $100K+ Annually</h3>
            <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">Replace expensive reception staff while delivering superior service quality and capturing more revenue opportunities.</p>
          </div>

          <div className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-voiceai-primary/30 to-purple-400/30 opacity-20"></div>
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-voiceai-primary to-purple-400 rounded-full flex items-center justify-center shadow-lg shadow-voiceai-primary/30">
                <div className="neural-network">
                  <div className="node node-1"></div>
                  <div className="node node-2"></div>
                  <div className="node node-3"></div>
                  <div className="connection con-1"></div>
                  <div className="connection con-2"></div>
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-foreground">Smart Learning</h3>
            <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">AI continuously adapts and improves from every interaction, becoming more effective at converting leads over time.</p>
          </div>

          <div className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-orange-500/30 to-amber-400/30 opacity-20"></div>
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-orange-500 to-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                <div className="soundwave-phone">
                  <div className="phone-silhouette text-2xl sm:text-3xl">📞</div>
                  <div className="soundwaves">
                    <div className="wave wave-1"></div>
                    <div className="wave wave-2"></div>
                    <div className="wave wave-3"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-foreground">Perfect Call Handling</h3>
            <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">Handle multiple calls simultaneously with perfect consistency, professional tone, and accurate information delivery.</p>
          </div>

          <div className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-voiceai-secondary/30 to-sky-400/30 opacity-20"></div>
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-voiceai-secondary to-sky-400 rounded-full flex items-center justify-center shadow-lg shadow-voiceai-secondary/30">
                <div className="holographic-calendar">
                  <div className="calendar-base text-2xl sm:text-3xl">📅</div>
                  <div className="floating-dates">
                    <div className="date-block">15</div>
                    <div className="date-block">23</div>
                    <div className="date-block">31</div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-foreground">Seamless Scheduling</h3>
            <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">Automatically coordinate appointments, send confirmations, and manage your calendar without any manual intervention.</p>
          </div>

          <div className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-500/30 to-rose-400/30 opacity-20"></div>
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-red-500 to-rose-400 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                <div className="scanning-user">
                  <div className="user-silhouette text-2xl sm:text-3xl">👤</div>
                  <div className="scan-lines">
                    <div className="scan-beam"></div>
                    <div className="checkmarks">
                      <div className="check">✓</div>
                      <div className="check">✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-foreground">Lead Qualification</h3>
            <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">Intelligently assess caller intent, budget, and timeline to prioritize high-value prospects for your sales team.</p>
          </div>

          <div className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-voiceai-accent/30 to-pink-400/30 opacity-20"></div>
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-voiceai-accent to-pink-400 rounded-full flex items-center justify-center shadow-lg shadow-voiceai-accent/30">
                <div className="ascending-bars">
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                  <div className="energy-trail"></div>
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-foreground">Revenue Growth</h3>
            <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">Increase conversion rates by 40% with instant response times and professional, consistent customer interactions.</p>
          </div>

          <div className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-teal-500/30 to-cyan-400/30 opacity-20"></div>
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-teal-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
                <div className="protected-shield">
                  <div className="shield-base text-2xl sm:text-3xl">🛡️</div>
                  <div className="ai-chip">🔬</div>
                  <div className="protective-aura"></div>
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-foreground">No Training Needed</h3>
            <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">Deploy instantly with pre-configured industry knowledge and conversational abilities that work from day one.</p>
          </div>

          <div className="glassmorphism rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-white/10 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-yellow-500/30 to-amber-400/30 opacity-20"></div>
            <div className="relative mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-yellow-500 to-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <div className="rocket-launch">
                  <div className="rocket text-2xl sm:text-3xl">🚀</div>
                  <div className="electric-trail">
                    <div className="spark spark-1"></div>
                    <div className="spark spark-2"></div>
                    <div className="spark spark-3"></div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-foreground">Instant Deployment</h3>
            <p className="text-sm sm:text-base text-foreground/80 text-center leading-relaxed">Get up and running in minutes, not months. Simple setup process with immediate impact on your business operations.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueSection;
