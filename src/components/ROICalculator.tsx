
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

  const calculatorStyles = {
    container: {
      position: 'relative' as const,
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 50%, rgba(15, 23, 42, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '24px',
      boxShadow: `
        0 0 40px rgba(139, 92, 246, 0.15),
        0 0 80px rgba(59, 130, 246, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `,
      overflow: 'hidden' as const
    },
    floatingElements: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none' as const,
      background: `
        radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
      `
    },
    input: {
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '12px',
      padding: '12px 16px',
      color: 'white',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },
    inputFocus: {
      borderColor: 'rgba(139, 92, 246, 0.5)',
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1), 0 0 20px rgba(139, 92, 246, 0.2)'
    },
    resultCard: {
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '16px',
      padding: '20px',
      backdropFilter: 'blur(15px)'
    },
    realityCard: {
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '16px',
      padding: '24px',
      backdropFilter: 'blur(15px)',
      boxShadow: '0 0 30px rgba(239, 68, 68, 0.1)'
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div style={calculatorStyles.container}>
          <div style={calculatorStyles.floatingElements}></div>
          
          <div className="relative z-10 p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Calculate Your Missed Call Revenue Loss
              </h1>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                Discover the shocking amount of revenue your business is losing every month from unanswered calls. 
                The numbers might surprise you.
              </p>
            </div>

            {/* Calculator Grid */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Input Section */}
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
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
                      style={calculatorStyles.input}
                      onFocus={(e) => Object.assign(e.target.style, calculatorStyles.inputFocus)}
                      onBlur={(e) => Object.assign(e.target.style, calculatorStyles.input)}
                      className="w-full"
                      placeholder="2500"
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
                      style={calculatorStyles.input}
                      onFocus={(e) => Object.assign(e.target.style, calculatorStyles.inputFocus)}
                      onBlur={(e) => Object.assign(e.target.style, calculatorStyles.input)}
                      className="w-full"
                      placeholder="25"
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
                      style={calculatorStyles.input}
                      onFocus={(e) => Object.assign(e.target.style, calculatorStyles.inputFocus)}
                      onBlur={(e) => Object.assign(e.target.style, calculatorStyles.input)}
                      className="w-full"
                      placeholder="20"
                    />
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                  Your Revenue Loss
                </h2>

                {/* Revenue Loss Display */}
                <div className="space-y-6">
                  <div style={calculatorStyles.resultCard}>
                    <p className="text-gray-400 text-sm mb-2">Monthly Revenue Lost</p>
                    <p className="text-4xl font-bold text-purple-400">
                      {formatCurrency(monthlyRevenue)}
                    </p>
                  </div>

                  <div style={calculatorStyles.resultCard}>
                    <p className="text-gray-400 text-sm mb-2">Annual Revenue Lost</p>
                    <p className="text-4xl font-bold text-red-400">
                      {formatCurrency(annualRevenue)}
                    </p>
                  </div>

                  {/* Reality Check */}
                  <div style={calculatorStyles.realityCard}>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3">Reality Check</h3>
                        <div className="text-gray-200 leading-relaxed space-y-3">
                          {monthlyRevenue > 0 ? (
                            <>
                              <p>
                                <strong>According to the information you provided, you are currently losing 
                                <span className="text-red-400 font-bold"> {formatCurrency(monthlyRevenue)}</span> 
                                per month</strong>, which translates into 
                                <span className="text-red-400 font-bold"> {formatCurrency(annualRevenue)}</span> 
                                annually — and this is likely on the low end.
                              </p>
                              <p>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissedCallCalculator;
