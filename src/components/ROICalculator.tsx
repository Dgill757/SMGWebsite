
import React, { useState, useEffect } from 'react';

const MissedCallCalculator = () => {
  const [clientValue, setClientValue] = useState(2500);
  const [missedCalls, setMissedCalls] = useState(25);
  const [closeRate, setCloseRate] = useState(20);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [annualRevenue, setAnnualRevenue] = useState(0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateResults = () => {
    const monthly = (clientValue * missedCalls * (closeRate / 100));
    const annual = monthly * 12;
    setMonthlyRevenue(monthly);
    setAnnualRevenue(annual);
  };

  useEffect(() => {
    calculateResults();
  }, [clientValue, missedCalls, closeRate]);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      {/* Main Calculator Container */}
      <div className="glass-container electric-glow p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Calculate Your Missed Call Revenue Loss
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            Discover the shocking amount of revenue your business is losing every month from unanswered calls. 
            The numbers might surprise you.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Input Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-3 animate-pulse"></span>
              Enter Your Business Data
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Average Client/Sale Value (USD)
                </label>
                <input
                  type="number"
                  value={clientValue}
                  onChange={(e) => setClientValue(parseFloat(e.target.value) || 0)}
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-400"
                  placeholder="e.g., 2500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Missed Calls Per Month
                </label>
                <input
                  type="number"
                  value={missedCalls}
                  onChange={(e) => setMissedCalls(parseFloat(e.target.value) || 0)}
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-400"
                  placeholder="e.g., 25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Close Rate (%)
                </label>
                <input
                  type="number"
                  value={closeRate}
                  onChange={(e) => setCloseRate(parseFloat(e.target.value) || 0)}
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-400"
                  placeholder="e.g., 20"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
              Your Revenue Loss
            </h2>

            {/* Revenue Loss Display */}
            <div className="space-y-4">
              <div className="glass-container p-6 border-purple-500/30">
                <p className="text-gray-300 text-sm mb-2">Monthly Revenue Lost</p>
                <p className="text-4xl font-bold text-purple-400 revenue-pulse">
                  {formatCurrency(monthlyRevenue)}
                </p>
              </div>

              <div className="glass-container p-6 border-red-500/30">
                <p className="text-gray-300 text-sm mb-2">Annual Revenue Lost</p>
                <p className="text-4xl font-bold text-red-400 revenue-pulse">
                  {formatCurrency(annualRevenue)}
                </p>
              </div>
            </div>

            {/* Eye-Opening Message */}
            <div className="alert-glow glass-container p-6 mt-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Reality Check</h3>
                  <div className="text-gray-200 leading-relaxed">
                    {monthlyRevenue > 0 ? (
                      <>
                        <p className="mb-3">
                          <strong>According to the information you provided, you are currently losing 
                          <span className="text-red-400 font-bold text-xl"> {formatCurrency(monthlyRevenue)}</span> 
                          per month</strong>, which translates into 
                          <span className="text-red-400 font-bold text-xl"> {formatCurrency(annualRevenue)}</span> 
                          annually — and this is likely on the low end.
                        </p>
                        <p className="mb-3">
                          <strong>What type of impact could making an additional 
                          <span className="text-purple-400 font-bold"> {formatCurrency(monthlyRevenue)}</span> 
                          per month have on your business?</strong>
                        </p>
                        <p className="text-cyan-400 font-semibold">
                          Don't let another missed call go unanswered. Every call is potential revenue.
                        </p>
                      </>
                    ) : (
                      <p>Enter your business data above to see how much revenue you're losing to missed calls.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Don't Let Another Missed Call Cost You Money
          </p>
          <p className="text-gray-300 mb-6">
            Every minute you wait, potential revenue walks away. Take action now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissedCallCalculator;
