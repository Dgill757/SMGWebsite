import React, { useState, useEffect } from 'react';

const EnhancedROICalculator = () => {
  const [missedCalls, setMissedCalls] = useState(50);
  const [dealValue, setDealValue] = useState(2500);
  const [conversionRate, setConversionRate] = useState(25);
  const [lostRevenue, setLostRevenue] = useState(31250);

  const calculateROI = () => {
    const revenue = (missedCalls * dealValue * (conversionRate / 100));
    setLostRevenue(revenue);
  };

  useEffect(() => {
    calculateROI();
  }, [missedCalls, dealValue, conversionRate]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(Number(e.target.value) || 0);
  };

  return (
    <section className="roi-section">
      <div className="roi-container">
        <div className="roi-calculator">
          <h2 className="roi-title">Calculate Your ROI</h2>
          <p className="section-subtitle">See how much revenue you're missing and could recover</p>
          
          <div className="roi-inputs">
            <div className="input-group">
              <label className="input-label">Monthly Calls Missed</label>
              <input 
                type="number" 
                className="roi-input" 
                value={missedCalls}
                onChange={handleInputChange(setMissedCalls)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Average Deal Value ($)</label>
              <input 
                type="number" 
                className="roi-input" 
                value={dealValue}
                onChange={handleInputChange(setDealValue)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Conversion Rate (%)</label>
              <input 
                type="number" 
                className="roi-input" 
                value={conversionRate}
                onChange={handleInputChange(setConversionRate)}
              />
            </div>
          </div>
          
          <div className="roi-result">
            <div className="roi-value">${lostRevenue.toLocaleString()}</div>
            <div className="roi-label">Monthly Lost Revenue</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedROICalculator;