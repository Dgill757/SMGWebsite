import React, { useState, useEffect, CSSProperties } from 'react';

const MissedCallCalculator = () => {
  const [clientValue, setClientValue] = useState(2500);
  const [missedCalls, setMissedCalls] = useState(25);
  const [closeRate, setCloseRate] = useState(20);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [annualRevenue, setAnnualRevenue] = useState(0);

  const formatCurrency = (value: number) => {
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

  // Component-specific styles with proper TypeScript types
  const calculatorStyles: Record<string, CSSProperties> = {
    section: {
      minHeight: '100vh',
      background: `
        radial-gradient(circle at 25% 25%, rgba(138, 43, 226, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(65, 105, 225, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.03) 0%, transparent 50%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)
      `,
      position: 'relative' as const,
      overflow: 'hidden' as const,
      padding: '4rem 1rem'
    },
    mainContainer: {
      background: 'rgba(8, 8, 12, 0.75)',
      backdropFilter: 'blur(25px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '3rem',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      boxShadow: `
        0 0 60px rgba(138, 43, 226, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `,
    },
    input: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      backdropFilter: 'blur(15px)',
      transition: 'all 0.3s ease',
      color: 'white'
    },
    resultCard: {
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '16px',
      padding: '2rem',
      transition: 'all 0.4s ease',
      position: 'relative' as const,
      overflow: 'hidden' as const
    },
    resultCardPurple: {
      borderColor: 'rgba(138, 43, 226, 0.2)'
    },
    resultCardRed: {
      borderColor: 'rgba(239, 68, 68, 0.2)'
    },
    alertContainer: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(138, 43, 226, 0.06))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '16px',
      padding: '2rem',
      position: 'relative' as const,
      overflow: 'hidden' as const
    },
    numberGlow: {
      textShadow: '0 0 20px rgba(138, 43, 226, 0.2), 0 0 40px rgba(138, 43, 226, 0.1)'
    },
    pulseIndicator: {
      animation: 'calc-gentle-pulse 3s ease-in-out infinite'
    },
    iconGlow: {
      boxShadow: '0 0 15px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes calc-gentle-pulse {
            0%, 100% { 
              opacity: 0.6; 
              transform: scale(1);
            }
            50% { 
              opacity: 1; 
              transform: scale(1.1);
            }
          }

          .calc-input-focus:focus {
            outline: none !important;
            border-color: rgba(138, 43, 226, 0.3) !important;
            background: rgba(255, 255, 255, 0.05) !important;
            box-shadow: 0 0 25px rgba(138, 43, 226, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            transform: translateY(-1px);
          }

          .calc-hover-purple:hover {
            border-color: rgba(138, 43, 226, 0.3) !important;
            box-shadow: 0 0 40px rgba(138, 43, 226, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            transform: translateY(-2px);
          }

          .calc-hover-red:hover {
            border-color: rgba(239, 68, 68, 0.3) !important;
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            transform: translateY(-2px);
          }

          @media (max-width: 1024px) {
            .calc-main-container {
              padding: 2rem;
            }
          }

          @media (max-width: 768px) {
            .calc-main-container {
              padding: 1.5rem;
            }
          }
        `}
      </style>
      <section style={calculatorStyles.section} className="bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Main Calculator Container */}
          <div style={calculatorStyles.mainContainer} className="calc-main-container">
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
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" style={calculatorStyles.pulseIndicator}></div>
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
                      className="w-full px-6 py-4 text-white placeholder-gray-400 text-lg calc-input-focus"
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
                      style={calculatorStyles.input}
                      className="w-full px-6 py-4 text-white placeholder-gray-400 text-lg calc-input-focus"
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
                      style={calculatorStyles.input}
                      className="w-full px-6 py-4 text-white placeholder-gray-400 text-lg calc-input-focus"
                      placeholder="e.g., 20"
                    />
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-8">
                <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3" style={calculatorStyles.pulseIndicator}></div>
                  Your Revenue Loss
                </h2>

                {/* Revenue Loss Display */}
                <div className="space-y-6">
                  <div style={{...calculatorStyles.resultCard, ...calculatorStyles.resultCardPurple}} className="calc-hover-purple">
                    <p className="text-gray-400 text-sm mb-3">Monthly Revenue Lost</p>
                    <p className="text-5xl font-bold text-purple-300" style={calculatorStyles.numberGlow}>
                      {formatCurrency(monthlyRevenue)}
                    </p>
                  </div>

                  <div style={{...calculatorStyles.resultCard, ...calculatorStyles.resultCardRed}} className="calc-hover-red">
                    <p className="text-gray-400 text-sm mb-3">Annual Revenue Lost</p>
                    <p className="text-5xl font-bold text-red-300" style={calculatorStyles.numberGlow}>
                      {formatCurrency(annualRevenue)}
                    </p>
                  </div>
                </div>

                {/* Eye-Opening Message */}
                <div style={calculatorStyles.alertContainer}>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1" 
                         style={calculatorStyles.iconGlow}>
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
    </>
  );
};

export default MissedCallCalculator;