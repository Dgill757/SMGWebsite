
import React, { useState } from 'react';

const ROICalculator = () => {
  const [averageClientValue, setAverageClientValue] = useState(500);
  const [missedCallsPerMonth, setMissedCallsPerMonth] = useState(50);
  const [averageCloseRate, setAverageCloseRate] = useState(25);
  const [monthlyRevenueLost, setMonthlyRevenueLost] = useState(0);
  const [annualRevenueLost, setAnnualRevenueLost] = useState(0);
  const [returnOnInvestment, setReturnOnInvestment] = useState(0);

  const calculate = () => {
    const monthlyLost = averageClientValue * missedCallsPerMonth * (averageCloseRate / 100);
    const annualLost = monthlyLost * 12;
    const roi = (monthlyLost / 500) * 100;

    setMonthlyRevenueLost(monthlyLost);
    setAnnualRevenueLost(annualLost);
    setReturnOnInvestment(roi);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold mb-4 text-foreground">Enter Your Details</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="average-client-value" className="block mb-2 text-foreground/80 font-medium">
                Average Client Value ($)
              </label>
              <input
                type="number"
                id="average-client-value"
                value={averageClientValue}
                onChange={(e) => setAverageClientValue(Number(e.target.value))}
                className="w-full h-10 px-3 border border-white/20 rounded-md bg-voiceai-dark/50 text-foreground focus:outline-none focus:ring-2 focus:ring-voiceai-primary"
              />
            </div>
            
            <div>
              <label htmlFor="missed-calls-per-month" className="block mb-2 text-foreground/80 font-medium">
                Missed Calls Per Month
              </label>
              <input
                type="number"
                id="missed-calls-per-month"
                value={missedCallsPerMonth}
                onChange={(e) => setMissedCallsPerMonth(Number(e.target.value))}
                className="w-full h-10 px-3 border border-white/20 rounded-md bg-voiceai-dark/50 text-foreground focus:outline-none focus:ring-2 focus:ring-voiceai-primary"
              />
            </div>
            
            <div>
              <label htmlFor="average-close-rate" className="block mb-2 text-foreground/80 font-medium">
                Average Close Rate (%)
              </label>
              <input
                type="number"
                id="average-close-rate"
                value={averageCloseRate}
                onChange={(e) => setAverageCloseRate(Number(e.target.value))}
                className="w-full h-10 px-3 border border-white/20 rounded-md bg-voiceai-dark/50 text-foreground focus:outline-none focus:ring-2 focus:ring-voiceai-primary"
              />
            </div>
            
            <button 
              onClick={calculate}
              className="bg-gradient-to-r from-voiceai-primary to-voiceai-secondary text-white font-medium py-3 px-6 rounded-md hover:opacity-90 transition-opacity shadow-lg"
            >
              Calculate ROI
            </button>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold mb-4 text-foreground">Your Results</h2>
          <div className="space-y-4">
            <div className="glassmorphism p-4 rounded-lg border border-white/20">
              <h3 className="font-bold text-foreground">Monthly Revenue Lost:</h3>
              <p className="text-2xl font-bold text-red-400">${monthlyRevenueLost.toLocaleString()}</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-lg border border-white/20">
              <h3 className="font-bold text-foreground">Annual Revenue Lost:</h3>
              <p className="text-2xl font-bold text-red-400">${annualRevenueLost.toLocaleString()}</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-lg border border-white/20">
              <h3 className="font-bold text-foreground">Our Monthly Service:</h3>
              <p className="text-2xl font-bold text-voiceai-primary">$500.00</p>
            </div>
            
            <div className="glassmorphism p-4 rounded-lg border border-white/20 bg-gradient-to-r from-voiceai-primary/10 to-voiceai-secondary/10">
              <h3 className="font-bold text-foreground">Return on Investment:</h3>
              <p className="text-2xl font-bold text-green-400">{returnOnInvestment.toFixed(1)}%</p>
              <div className="mt-2 bg-voiceai-primary/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-voiceai-primary to-voiceai-secondary h-2 rounded-full transition-all duration-500"
                  style={{width: `${Math.min(returnOnInvestment, 100)}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 glassmorphism rounded-lg border border-white/20">
        <h3 className="font-bold text-foreground mb-2">What This Means For Your Business:</h3>
        <p className="text-foreground/80">
          Based on your inputs, you could be losing <span className="text-red-400 font-bold">${annualRevenueLost.toLocaleString()}</span> annually from missed calls. 
          Our service can help you capture these opportunities with a positive ROI of <span className="text-green-400 font-bold">{returnOnInvestment.toFixed(1)}%</span>.
        </p>
      </div>
    </div>
  );
};

export default ROICalculator;
