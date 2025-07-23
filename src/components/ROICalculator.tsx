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
      className="roi-calculator-section"
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 70%, rgba(65, 105, 225, 0.04) 0%, transparent 60%),
          radial-gradient(ellipse at 60% 20%, rgba(0, 255, 255, 0.03) 0%, transparent 60%),
          radial-gradient(ellipse at 40% 80%, rgba(138, 43, 226, 0.05) 0%, transparent 60%),
          linear-gradient(180deg, rgba(0, 0, 0, 0.99) 0%, rgba(2, 2, 8, 1) 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        padding: '4rem 1rem'
      }}
    >
      {/* Subtle Electric Background - Scoped to this component only */}
      <div className="roi-calc-background" style={{
        position: 'absolute',
        inset: '0',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {/* Electric Waves */}
        <div 
          className="roi-calc-waves"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(45deg, transparent 48%, rgba(138, 43, 226, 0.02) 50%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, rgba(65, 105, 225, 0.015) 50%, transparent 52%),
              linear-gradient(90deg, transparent 49%, rgba(0, 255, 255, 0.01) 50%, transparent 51%)
            `,
            animation: 'roi-calc-subtle-flow 20s ease-in-out infinite'
          }}
        />
        
        {/* Floating Particles */}
        <div className="roi-calc-particle-1" style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '4px',
          height: '4px',
          backgroundColor: 'rgba(167, 139, 250, 0.2)',
          borderRadius: '50%',
          animation: 'roi-calc-float-1 25s ease-in-out infinite'
        }} />
        <div className="roi-calc-particle-2" style={{
          position: 'absolute',
          top: '80%',
          right: '20%',
          width: '2px',
          height: '2px',
          backgroundColor: 'rgba(34, 211, 238, 0.15)',
          borderRadius: '50%',
          animation: 'roi-calc-float-2 30s ease-in-out infinite'
        }} />
        <div className="roi-calc-particle-3" style={{
          position: 'absolute',
          top: '40%',
          left: '80%',
          width: '2px',
          height: '2px',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          borderRadius: '50%',
          animation: 'roi-calc-float-3 35s ease-in-out infinite'
        }} />
        
        {/* Shimmer Lines */}
        <div 
          className="roi-calc-shimmer-1"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(167, 139, 250, 0.1), transparent)',
            animation: 'roi-calc-shimmer-1 25s linear infinite'
          }}
        />
        <div 
          className="roi-calc-shimmer-2"
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '100%',
            height: '1px',
            background: 'linear-gradient(to left, transparent, rgba(34, 211, 238, 0.08), transparent)',
            animation: 'roi-calc-shimmer-2 35s linear infinite'
          }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Calculator Container */}
        <div 
          className="roi-calc-main-container"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(15, 15, 25, 0.85) 0%, 
                rgba(8, 8, 18, 0.9) 50%, 
                rgba(12, 12, 22, 0.85) 100%
              )
            `,
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '32px',
            padding: '3rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `
              0 0 80px rgba(138, 43, 226, 0.08),
              0 0 40px rgba(65, 105, 225, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.12)
            `
          }}
        >
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
                    className="roi-calc-input w-full px-6 py-4 text-white placeholder-gray-400 text-lg"
                    placeholder="e.g., 2500"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.04) 0%, 
                          rgba(255, 255, 255, 0.02) 100%
                        )
                      `,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.3s ease',
                      color: 'white',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
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
                    className="roi-calc-input w-full px-6 py-4 text-white placeholder-gray-400 text-lg"
                    placeholder="e.g., 25"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.04) 0%, 
                          rgba(255, 255, 255, 0.02) 100%
                        )
                      `,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.3s ease',
                      color: 'white',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
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
                    className="roi-calc-input w-full px-6 py-4 text-white placeholder-gray-400 text-lg"
                    placeholder="e.g., 20"
                    style={{
                      background: `
                        linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.04) 0%, 
                          rgba(255, 255, 255, 0.02) 100%
                        )
                      `,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.3s ease',
                      color: 'white',
                      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
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
                  className="roi-calc-result-card roi-calc-result-purple"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.03) 0%, 
                        rgba(255, 255, 255, 0.01) 100%
                      )
                    `,
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(138, 43, 226, 0.25)',
                    borderRadius: '20px',
                    padding: '2rem',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 0 30px rgba(138, 43, 226, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <p className="text-gray-400 text-sm mb-3">Monthly Revenue Lost</p>
                  <p 
                    className="text-5xl font-bold text-purple-300" 
                    style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.3)'}}
                  >
                    {formatCurrency(monthlyRevenue)}
                  </p>
                </div>

                <div 
                  className="roi-calc-result-card roi-calc-result-red"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.03) 0%, 
                        rgba(255, 255, 255, 0.01) 100%
                      )
                    `,
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '20px',
                    padding: '2rem',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 0 30px rgba(239, 68, 68, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <p className="text-gray-400 text-sm mb-3">Annual Revenue Lost</p>
                  <p 
                    className="text-5xl font-bold text-red-300"
                    style={{textShadow: '0 0 15px rgba(255, 255, 255, 0.3)'}}
                  >
                    {formatCurrency(annualRevenue)}
                  </p>
                </div>
              </div>

              {/* Eye-Opening Message */}
              <div 
                className="roi-calc-alert"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(239, 68, 68, 0.06) 0%, 
                      rgba(138, 43, 226, 0.04) 50%,
                      rgba(239, 68, 68, 0.06) 100%
                    )
                  `,
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '20px',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 0 40px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                }}
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{boxShadow: '0 0 15px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}}
                  >
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

      {/* Component-specific CSS */}
      <style>{`
        /* All animations and styles are prefixed with roi-calc- to avoid global conflicts */
        @keyframes roi-calc-subtle-flow {
          0%, 100% { 
            transform: translateX(-2%) rotate(0deg); 
            opacity: 0.5;
          }
          33% { 
            transform: translateX(1%) rotate(0.1deg); 
            opacity: 0.7;
          }
          66% { 
            transform: translateX(-1%) rotate(-0.1deg); 
            opacity: 0.6;
          }
        }

        @keyframes roi-calc-float-1 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.2;
          }
          50% { 
            transform: translateY(-15px) translateX(10px) scale(1.1); 
            opacity: 0.3;
          }
        }

        @keyframes roi-calc-float-2 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px); 
            opacity: 0.15;
          }
          50% { 
            transform: translateY(20px) translateX(-12px); 
            opacity: 0.25;
          }
        }

        @keyframes roi-calc-float-3 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.1;
          }
          50% { 
            transform: translateY(-25px) translateX(-8px) scale(1.2); 
            opacity: 0.2;
          }
        }

        @keyframes roi-calc-shimmer-1 {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 0.1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes roi-calc-shimmer-2 {
          0% { transform: translateX(100%); opacity: 0; }
          50% { opacity: 0.08; }
          100% { transform: translateX(-100%); opacity: 0; }
        }

        .roi-calc-input:focus {
          outline: none !important;
          border-color: rgba(138, 43, 226, 0.3) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 0 25px rgba(138, 43, 226, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-1px);
        }

        .roi-calc-result-purple:hover {
          border-color: rgba(138, 43, 226, 0.3) !important;
          box-shadow: 0 0 40px rgba(138, 43, 226, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-2px);
        }

        .roi-calc-result-red:hover {
          border-color: rgba(239, 68, 68, 0.3) !important;
          box-shadow: 0 0 40px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 1024px) {
          .roi-calc-main-container {
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .roi-calc-main-container {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MissedCallCalculator;