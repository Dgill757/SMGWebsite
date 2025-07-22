import React from 'react';

const RevenueSection = () => {
  return (
    <section className="revenue-section" id="features">
      <div className="section-header">
        <h2 className="section-title">Stop Losing Revenue to Missed Opportunities</h2>
        <p className="section-subtitle">Transform every missed call into captured revenue with AI that works 24/7</p>
      </div>
      
      <div className="features-grid">
        <div className="feature-box">
          <div className="feature-icon availability-icon">
            <div className="orbital-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="core"></div>
            </div>
          </div>
          <h3 className="feature-title">24/7 Availability</h3>
          <p className="feature-description">Your AI assistant never sleeps, ensuring every call is answered and every opportunity captured, regardless of time or day.</p>
        </div>

        <div className="feature-box">
          <div className="feature-icon savings-icon">
            <div className="holographic-currency">
              <span className="currency-symbol">$</span>
              <div className="floating-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
              </div>
            </div>
          </div>
          <h3 className="feature-title">Save $100K+ Annually</h3>
          <p className="feature-description">Replace expensive reception staff while delivering superior service quality and capturing more revenue opportunities.</p>
        </div>

        <div className="feature-box">
          <div className="feature-icon learning-icon">
            <div className="neural-network">
              <div className="node node-1"></div>
              <div className="node node-2"></div>
              <div className="node node-3"></div>
              <div className="connection con-1"></div>
              <div className="connection con-2"></div>
            </div>
          </div>
          <h3 className="feature-title">Smart Learning</h3>
          <p className="feature-description">AI continuously adapts and improves from every interaction, becoming more effective at converting leads over time.</p>
        </div>

        <div className="feature-box">
          <div className="feature-icon call-handling-icon">
            <div className="soundwave-phone">
              <div className="phone-silhouette">📞</div>
              <div className="soundwaves">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
              </div>
            </div>
          </div>
          <h3 className="feature-title">Perfect Call Handling</h3>
          <p className="feature-description">Handle multiple calls simultaneously with perfect consistency, professional tone, and accurate information delivery.</p>
        </div>

        <div className="feature-box">
          <div className="feature-icon scheduling-icon">
            <div className="holographic-calendar">
              <div className="calendar-base">📅</div>
              <div className="floating-dates">
                <div className="date-block">15</div>
                <div className="date-block">23</div>
                <div className="date-block">31</div>
              </div>
            </div>
          </div>
          <h3 className="feature-title">Seamless Scheduling</h3>
          <p className="feature-description">Automatically coordinate appointments, send confirmations, and manage your calendar without any manual intervention.</p>
        </div>

        <div className="feature-box">
          <div className="feature-icon qualification-icon">
            <div className="scanning-user">
              <div className="user-silhouette">👤</div>
              <div className="scan-lines">
                <div className="scan-beam"></div>
                <div className="checkmarks">
                  <div className="check">✓</div>
                  <div className="check">✓</div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="feature-title">Lead Qualification</h3>
          <p className="feature-description">Intelligently assess caller intent, budget, and timeline to prioritize high-value prospects for your sales team.</p>
        </div>

        <div className="feature-box">
          <div className="feature-icon growth-icon">
            <div className="ascending-bars">
              <div className="bar bar-1"></div>
              <div className="bar bar-2"></div>
              <div className="bar bar-3"></div>
              <div className="energy-trail"></div>
            </div>
          </div>
          <h3 className="feature-title">Revenue Growth</h3>
          <p className="feature-description">Increase conversion rates by 40% with instant response times and professional, consistent customer interactions.</p>
        </div>

        <div className="feature-box">
          <div className="feature-icon training-icon">
            <div className="protected-shield">
              <div className="shield-base">🛡️</div>
              <div className="ai-chip">🔬</div>
              <div className="protective-aura"></div>
            </div>
          </div>
          <h3 className="feature-title">No Training Needed</h3>
          <p className="feature-description">Deploy instantly with pre-configured industry knowledge and conversational abilities that work from day one.</p>
        </div>

        <div className="feature-box">
          <div className="feature-icon deployment-icon">
            <div className="rocket-launch">
              <div className="rocket">🚀</div>
              <div className="electric-trail">
                <div className="spark spark-1"></div>
                <div className="spark spark-2"></div>
                <div className="spark spark-3"></div>
              </div>
            </div>
          </div>
          <h3 className="feature-title">Instant Deployment</h3>
          <p className="feature-description">Get up and running in minutes, not months. Simple setup process with immediate impact on your business operations.</p>
        </div>
      </div>
    </section>
  );
};

export default RevenueSection;