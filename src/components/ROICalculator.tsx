import React, { useState, useEffect } from 'react';

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

  return (
    <div 
      className="calc-premium-wrapper"
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 70%, rgba(65, 105, 225, 0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 60% 20%, rgba(0, 255, 255, 0.04) 0%, transparent 60%),
          radial-gradient(ellipse at 40% 80%, rgba(138, 43, 226, 0.07) 0%, transparent 60%),
          linear-gradient(180deg, rgba(16, 16, 32, 1) 0%, rgba(8, 8, 20, 1) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        padding: '4rem 1rem'
      }}
    >
      {/* Electric Background Effects */}
      <div 
        style={{
          position: 'absolute',
          inset: '0',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {/* Floating Electric Particles */}
        <div 
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '3px',
            height: '3px',
            backgroundColor: 'rgba(147, 51, 234, 0.3)',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
            animation: 'calc-premium-float-1 20s ease-in-out infinite'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '70%',
            right: '15%',
            width: '2px',
            height: '2px',
            backgroundColor: 'rgba(56, 189, 248, 0.25)',
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(56, 189, 248, 0.4)',
            animation: 'calc-premium-float-2 25s ease-in-out infinite'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: '45%',
            left: '85%',
            width: '2px',
            height: '2px',
            backgroundColor: 'rgba(14, 165, 233, 0.2)',
            borderRadius: '50%',
            boxShadow: '0 0 6px rgba(14, 165, 233, 0.3)',
            animation: 'calc-premium-float-3 30s ease-in-out infinite'
          }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 10 }}>
        {/* Main Calculator Container */}
        <div 
          style={{
            background: 'rgba(16, 16, 32, 0.9)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '3rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `
              0 0 60px rgba(138, 43, 226, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
        >
          {/* Header */}
          <div className="text-center mb-12 relative" style={{ zIndex: 2 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Calculate Your Missed Call Revenue Loss
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover the shocking amount of revenue your business is losing every month from unanswered calls. 
              The numbers might surprise you.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid lg:grid-cols-2 gap-12 relative" style={{ zIndex: 2 }}>
            {/* Input Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
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
                    className="w-full px-6 py-4 text-white placeholder-gray-400 text-lg rounded-lg transition-all duration-300"
                    placeholder="e.g., 2500"
                    style={{
                      background: 'rgba(32, 32, 64, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      color: 'white'
                    }}
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
                    className="w-full px-6 py-4 text-white placeholder-gray-400 text-lg rounded-lg transition-all duration-300"
                    placeholder="e.g., 25"
                    style={{
                      background: 'rgba(32, 32, 64, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      color: 'white'
                    }}
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
                    className="w-full px-6 py-4 text-white placeholder-gray-400 text-lg rounded-lg transition-all duration-300"
                    placeholder="e.g., 20"
                    style={{
                      background: 'rgba(32, 32, 64, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      color: 'white'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                Your Revenue Loss
              </h2>

              {/* Revenue Loss Display */}
              <div className="space-y-6">
                <div 
                  style={{
                    background: 'rgba(147, 51, 234, 0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(147, 51, 234, 0.3)',
                    borderRadius: '16px',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <p className="text-gray-400 text-sm mb-3">Monthly Revenue Lost</p>
                  <p className="text-5xl font-bold text-purple-300">
                    {formatCurrency(monthlyRevenue)}
                  </p>
                </div>

                <div 
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '16px',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <p className="text-gray-400 text-sm mb-3">Annual Revenue Lost</p>
                  <p className="text-5xl font-bold text-red-300">
                    {formatCurrency(annualRevenue)}
                  </p>
                </div>
              </div>

              {/* Reality Check Section */}
              <div 
                style={{
                  background: 'rgba(32, 32, 64, 0.8)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '16px',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  >
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Reality Check</h3>
                    <div className="text-gray-200 leading-relaxed space-y-3">
                      {monthlyRevenue > 0 ? (
                        <>
                          <p>
                            According to the information you provided, you are currently losing{' '}
                            <span className="text-red-300 font-bold text-xl">{formatCurrency(monthlyRevenue)}</span>{' '}
                            per month, which translates into{' '}
                            <span className="text-red-300 font-bold text-xl">{formatCurrency(annualRevenue)}</span>{' '}
                            annually — and this is likely on the low end.
                          </p>
                          <p>
                            What type of impact could making an additional{' '}
                            <span className="text-purple-300 font-bold">{formatCurrency(monthlyRevenue)}</span>{' '}
                            per month have on your business?
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
          <div className="text-center mt-16 pt-12 border-t border-gray-800/50 relative" style={{ zIndex: 2 }}>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-6">
              Don't Let Another Missed Call Cost You Money
            </p>
            <p className="text-gray-300 text-xl mb-8">
              Every minute you wait, potential revenue walks away. Take action now.
            </p>
          </div>
        </div>
      </div>

      {/* Component-specific CSS */}
      <style>{`
        @keyframes calc-premium-float-1 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) translateX(15px) scale(1.2); 
            opacity: 0.6;
          }
        }

        @keyframes calc-premium-float-2 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.25;
          }
          50% { 
            transform: translateY(25px) translateX(-18px); 
            opacity: 0.5;
          }
        }

        @keyframes calc-premium-float-3 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.2;
          }
          50% { 
            transform: translateY(-30px) translateX(-12px) scale(1.3); 
            opacity: 0.4;
          }
        }

        .calc-premium-wrapper input:focus {
          outline: none !important;
          border-color: rgba(147, 51, 234, 0.4) !important;
          background: rgba(32, 32, 64, 1) !important;
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.2) !important;
          transform: translateY(-1px);
        }

        @media (max-width: 1024px) {
          .calc-premium-wrapper > div > div {
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .calc-premium-wrapper > div > div {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MissedCallCalculator;