
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
          <h2 className="text-xl font-bold mb-4">Enter Your Details</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="average-client-value" className="block mb-2">
                Average Client Value ($)
              </label>
              <input
                type="number"
                id="average-client-value"
                value={averageClientValue}
                onChange={(e) => setAverageClientValue(Number(e.target.value))}
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="missed-calls-per-month" className="block mb-2">
                Missed Calls Per Month
              </label>
              <input
                type="number"
                id="missed-calls-per-month"
                value={missedCallsPerMonth}
                onChange={(e) => setMissedCallsPerMonth(Number(e.target.value))}
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="average-close-rate" className="block mb-2">
                Average Close Rate (%)
              </label>
              <input
                type="number"
                id="average-close-rate"
                value={averageCloseRate}
                onChange={(e) => setAverageCloseRate(Number(e.target.value))}
                className="w-full h-10 px-3 border border-gray-300 rounded-md"
              />
            </div>
            
            <button 
              onClick={calculate}
              className="bg-voiceai-primary text-white font-medium py-2 px-4 rounded-md hover:bg-voiceai-primary/90 transition-colors"
            >
              Calculate
            </button>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold">Monthly Revenue Lost:</h3>
              <p className="text-xl font-semibold">${monthlyRevenueLost.toFixed(2)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold">Annual Revenue Lost:</h3>
              <p className="text-xl font-semibold">${annualRevenueLost.toFixed(2)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold">Our Monthly Service Charge:</h3>
              <p className="text-xl font-semibold">$500.00</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-bold">Return on Investment:</h3>
              <p className="text-xl font-semibold">{returnOnInvestment.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p>
          What This Means For Your Business: Based on your inputs, you could be losing significant revenue from missed calls. 
          Our service can help you capture these opportunities with a positive ROI of {returnOnInvestment.toFixed(1)}%.
        </p>
      </div>
    </div>
  );
};

export default ROICalculator;
