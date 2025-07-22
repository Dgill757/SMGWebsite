import React from 'react';

const RevenueSection = () => {
  return (
    <section className="revenue-section" id="features">
      <div className="section-header">
        <h2 className="section-title">Stop Losing Revenue to Missed Opportunities</h2>
        <p className="section-subtitle">Transform every missed call into captured revenue with AI that works 24/7</p>
      </div>
      
      <div className="revenue-grid">
        <div className="revenue-card">
          <div className="card-icon">🚀</div>
          <h3 className="card-title">Instant Lead Capture</h3>
          <p className="card-description">Never miss another potential customer. Our AI captures leads the moment they reach out, day or night.</p>
          <div className="card-metric">
            <div>
              <div className="metric-value">95%</div>
              <div className="metric-label">Lead Capture Rate</div>
            </div>
          </div>
        </div>
        
        <div className="revenue-card">
          <div className="card-icon">⚡</div>
          <h3 className="card-title">Lightning-Fast Response</h3>
          <p className="card-description">Respond to inquiries in milliseconds, not hours. Speed converts leads into customers.</p>
          <div className="card-metric">
            <div>
              <div className="metric-value">&lt;1s</div>
              <div className="metric-label">Response Time</div>
            </div>
          </div>
        </div>
        
        <div className="revenue-card">
          <div className="card-icon">💎</div>
          <h3 className="card-title">Premium Experience</h3>
          <p className="card-description">Deliver white-glove service that makes customers feel valued and drives conversions.</p>
          <div className="card-metric">
            <div>
              <div className="metric-value">3x</div>
              <div className="metric-label">Higher Conversion</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueSection;