
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
    <section className="min-h-screen bg-black calculator-hero-bg py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Calculator Container */}
        <div className="premium-glass-container subtle-glow">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-6 leading-tight">
              Calculate Your Missed Call Revenue Loss
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover the shocking amount of revenue your business is losing every month from unanswered calls. 
              The numbers might surprise you.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Input Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 gentle-pulse"></div>
                Enter Your Business Data
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Average Client/Sale Value (USD)
                  </label>
                  <input
                    type="number"
                    value={clientValue}
                    onChange={(e) => setClientValue(parseFloat(e.target.value) || 0)}
                    className="premium-input w-full px-6 py-4 text-white placeholder-gray-400 text-lg"
                    placeholder="e.g., 2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Estimated Missed Calls Per Month
                  </label>
                  <input
                    type="number"
                    value={missedCalls}
                    onChange={(e) => setMissedCalls(parseFloat(e.target.value) || 0)}
                    className="premium-input w-full px-6 py-4 text-white placeholder-gray-400 text-lg"
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Your Close Rate (%)
                  </label>
                  <input
                    type="number"
                    value={closeRate}
                    onChange={(e) => setCloseRate(parseFloat(e.target.value) || 0)}
                    className="premium-input w-full px-6 py-4 text-white placeholder-gray-400 text-lg"
                    placeholder="e.g., 20"
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-3 gentle-pulse"></div>
                Your Revenue Loss
              </h2>

              {/* Revenue Loss Display */}
              <div className="space-y-6">
                <div className="premium-glass-result border-purple-500/20 hover-glow-purple">
                  <p className="text-gray-400 text-sm mb-3">Monthly Revenue Lost</p>
                  <p className="text-5xl font-bold text-purple-300 subtle-number-glow">
                    {formatCurrency(monthlyRevenue)}
                  </p>
                </div>

                <div className="premium-glass-result border-red-500/20 hover-glow-red">
                  <p className="text-gray-400 text-sm mb-3">Annual Revenue Lost</p>
                  <p className="text-5xl font-bold text-red-300 subtle-number-glow">
                    {formatCurrency(annualRevenue)}
                  </p>
                </div>
              </div>

              {/* Eye-Opening Message */}
              <div className="premium-alert-container">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 subtle-icon-glow">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Reality Check</h3>
                    <div className="text-gray-200 leading-relaxed space-y-3">
                      {monthlyRevenue > 0 ? (
                        <>
                          <p>
                            <strong>According to the information you provided, you are currently losing 
                            <span className="text-red-300 font-bold text-xl mx-1">{formatCurrency(monthlyRevenue)}</span> 
                            per month</strong>, which translates into 
                            <span className="text-red-300 font-bold text-xl mx-1">{formatCurrency(annualRevenue)}</span> 
                            annually — and this is likely on the low end.
                          </p>
                          <p>
                            <strong>What type of impact could making an additional 
                            <span className="text-purple-300 font-bold mx-1">{formatCurrency(monthlyRevenue)}</span> 
                            per month have on your business?</strong>
                          </p>
                          <p className="text-cyan-300 font-semibold text-lg">
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
          <div className="text-center mt-16 pt-12 border-t border-gray-800/50">
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-6">
              Don't Let Another Missed Call Cost You Money
            </p>
            <p className="text-gray-300 text-xl mb-8">
              Every minute you wait, potential revenue walks away. Take action now.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissedCallCalculator;
