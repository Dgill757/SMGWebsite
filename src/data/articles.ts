export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  thumbnail?: string;
  tags: string[];
  published_at: string;
  content_html: string;
  cta_calendly_url: string;
  show_in_listing: boolean;
}

export const articles: Article[] = [
  {
    title: "The Voice AI Revolution for Roofing & Home Services",
    slug: "voice-ai-revolution-roofing",
    excerpt: "How voice AI eliminates missed calls, kills voicemails, and books jobs 24/7 with inbound, outbound, reminders, and database reactivation.",
    thumbnail: "/lovable-uploads/c99219ee-c2be-4e58-a89a-ddb88e9a7695.png",
    tags: ["voice ai", "roofing", "home services", "automation", "lead gen"],
    published_at: "2024-01-15",
    cta_calendly_url: "https://calendly.com/aivoice/call",
    show_in_listing: true,
    content_html: `
      <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
      
      <style>
        .article-content {
            font-family: 'Inter', sans-serif;
            background-color: #f0f4f8;
            padding: 0;
            margin: 0;
        }
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            height: 300px;
            max-height: 400px;
        }
        @media (min-width: 768px) {
            .chart-container {
                height: 350px;
            }
        }
        .stat-card h3 {
            font-size: 4rem;
            font-weight: 900;
            line-height: 1;
        }
        .gradient-text {
            background: linear-gradient(to right, #d45087, #ff7c43);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
      </style>

      <div class="container mx-auto p-4 md:p-8 max-w-6xl text-gray-700">

        <header class="text-center my-12 md:my-20">
            <h1 class="text-4xl md:text-6xl font-black text-[#003f5c] leading-tight">Turn Every Missed Call into a Booked Job.</h1>
            <p class="mt-4 text-xl md:text-2xl font-semibold text-[#665191]">AI is Your New 24/7 Front Desk.</p>
        </header>

        <section id="problem" class="my-16">
            <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-[#003f5c] mb-8">Why Roofing Companies Are Bleeding Leads</h2>
                <p class="text-center max-w-3xl mx-auto text-lg mb-12">Every day, potential customers are looking for a solution to their roofing problem. But for many home service businesses, the most common outcome is a lost opportunity. Your team is busy on job sites, it's after hours, and another potential job goes straight to a competitor who simply answered the phone.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 text-center">
                    <div class="bg-gray-50 rounded-lg p-6">
                        <div class="chart-container h-64 md:h-72 mx-auto">
                            <canvas id="missedCallsChart"></canvas>
                        </div>
                        <h3 class="text-xl font-bold mt-4 text-[#003f5c]">The Silent Revenue Killer</h3>
                        <p class="mt-2">A significant portion of calls to small businesses go unanswered, especially during peak hours or after 5 PM. Each missed call is a lost sale.</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-6">
                        <div class="chart-container h-64 md:h-72 mx-auto">
                             <canvas id="voicemailAbandonmentChart"></canvas>
                        </div>
                        <h3 class="text-xl font-bold mt-4 text-[#003f5c]">Voicemails Are Dead</h3>
                        <p class="mt-2">The vast majority of callers today will not leave a voicemail. They simply hang up and dial your competitor, assuming they'll never get a call back.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="data" class="my-16">
             <div class="bg-[#003f5c] text-white rounded-2xl shadow-xl p-8 md:p-12">
                <h2 class="text-3xl md:text-4xl font-bold text-center mb-8">The Shocking ROI of Speed</h2>
                 <p class="text-center max-w-3xl mx-auto text-lg mb-12 opacity-90">The data is undeniable. In today's on-demand world, customers expect an immediate response. Failing to meet this expectation is the single biggest leak in your sales funnel.</p>
                 <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div class="stat-card bg-[#2f4b7c] rounded-lg p-6">
                        <h3 class="gradient-text">82%</h3>
                        <p class="font-semibold mt-2">of consumers expect an immediate response to an inquiry.</p>
                    </div>
                     <div class="stat-card bg-[#2f4b7c] rounded-lg p-6">
                        <h3 class="gradient-text">47</h3>
                        <p class="font-semibold mt-2">The average lead response time in home services is 47 HOURS.</p>
                    </div>
                     <div class="stat-card bg-[#2f4b7c] rounded-lg p-6">
                        <h3 class="gradient-text">100x</h3>
                        <p class="font-semibold mt-2">Leads are 100x more likely to respond if called in under 5 minutes.</p>
                    </div>
                </div>
                 <div class="mt-12 bg-white rounded-lg p-6 shadow-inner">
                    <h3 class="text-xl font-bold text-center text-[#003f5c] mb-4">The Conversion Cliff: Speed to Lead</h3>
                     <div class="chart-container h-72">
                        <canvas id="speedToLeadChart"></canvas>
                     </div>
                     <p class="text-center text-gray-600 mt-4">This chart visualizes the dramatic decay in lead conversion probability over time. The first 5 minutes are critical; after an hour, your chances have plummeted.</p>
                 </div>
            </div>
        </section>

        <section id="solution" class="my-16">
             <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-[#003f5c] mb-8">The Voice AI Solution: Never Miss a Lead Again</h2>
                <p class="text-center max-w-3xl mx-auto text-lg mb-12">Voice and conversational AI aren't about replacing your team; they're about empowering them to do what they do best: high-quality roofing jobs. Let AI handle the front desk so your team can focus on the field.</p>
                 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <div class="bg-gray-50 rounded-lg p-6 text-center">
                        <div class="text-5xl mb-4">📞</div>
                         <h3 class="font-bold text-xl text-[#003f5c]">Never Miss a Call</h3>
                         <p class="mt-2">An AI receptionist answers every single call, 24/7/365, including after-hours, weekends, and holidays. More leads captured, higher conversion.</p>
                     </div>
                     <div class="bg-gray-50 rounded-lg p-6 text-center">
                         <div class="text-5xl mb-4">⚡️</div>
                         <h3 class="font-bold text-xl text-[#003f5c]">Instant Follow-Up</h3>
                         <p class="mt-2">AI triggers texts and emails the moment a lead comes in, keeping them warm and engaged while your competitors are still trying to find the phone.</p>
                     </div>
                     <div class="bg-gray-50 rounded-lg p-6 text-center">
                         <div class="text-5xl mb-4">🗓️</div>
                         <h3 class="font-bold text-xl text-[#003f5c]">Automated Reminders</h3>
                         <p class="mt-2">Proactively send appointment reminders via SMS or voice, dramatically reducing no-shows and improving scheduling efficiency.</p>
                     </div>
                     <div class="bg-gray-50 rounded-lg p-6 text-center">
                         <div class="text-5xl mb-4">📈</div>
                         <h3 class="font-bold text-xl text-[#003f5c]">Data & Insights</h3>
                         <p class="mt-2">AI captures and analyzes call data, giving you actionable insights into what marketing channels are working and which jobs are most profitable.</p>
                     </div>
                     <div class="bg-gray-50 rounded-lg p-6 text-center">
                         <div class="text-5xl mb-4">🌪️</div>
                         <h3 class="font-bold text-xl text-[#003f5c]">Infinite Scalability</h3>
                         <p class="mt-2">When a storm hits and demand spikes, your AI scales instantly to handle unlimited call volume without you needing to hire and train temporary staff.</p>
                     </div>
                      <div class="bg-gray-50 rounded-lg p-6 text-center">
                         <div class="text-5xl mb-4">🏆</div>
                         <h3 class="font-bold text-xl text-[#003f5c]">Gain a Competitive Edge</h3>
                         <p class="mt-2">While your competitors are stuck in the past with voicemails, you'll be capturing their frustrated customers and dominating the market.</p>
                     </div>
                 </div>
            </div>
        </section>

         <section id="comparison" class="my-16">
            <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-[#003f5c] mb-8">AI vs. The Traditional Front Desk</h2>
                <p class="text-center max-w-3xl mx-auto text-lg mb-12">An AI receptionist is not just a replacement; it's a force multiplier that provides coverage and efficiency that a human-only approach simply cannot match.</p>
                <div class="chart-container">
                    <canvas id="comparisonChart"></canvas>
                </div>
                <p class="text-center text-gray-600 mt-4">This chart clearly shows the advantage of AI in core metrics. While a busy human receptionist can answer 60-70% of calls, an AI system consistently answers over 90%, ensuring you never miss an opportunity.</p>
            </div>
        </section>

        <section id="transformation" class="my-16">
            <div class="bg-[#003f5c] text-white rounded-2xl shadow-xl p-8 md:p-12">
                <h2 class="text-3xl md:text-4xl font-bold text-center mb-8">The 'Before & After AI' Snapshot</h2>
                <p class="text-center max-w-3xl mx-auto text-lg mb-12 opacity-90">Implementing Voice AI fundamentally transforms your business operations, shifting focus from administrative tasks to revenue-generating activities.</p>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div class="bg-gray-100/10 rounded-lg p-6 border-l-4 border-[#f95d6a]">
                        <h3 class="font-bold text-2xl text-white mb-4">Before AI: The Daily Grind</h3>
                         <ul class="space-y-3">
                            <li class="flex items-start"><span class="text-2xl mr-3">📞</span> <div><strong class="text-[#ffa600]">50% Missed Calls:</strong> Revenue lost daily during peak hours.</div></li>
                             <li class="flex items-start"><span class="text-2xl mr-3">⏰</span> <div><strong class="text-[#ffa600]">15+ Hours/Week:</strong> Owner stuck on the phone with admin tasks.</div></li>
                             <li class="flex items-start"><span class="text-2xl mr-3">😞</span> <div><strong class="text-[#ffa600]">20% No-Shows:</strong> Lost time and fuel from unconfirmed appointments.</div></li>
                             <li class="flex items-start"><span class="text-2xl mr-3">📉</span> <div><strong class="text-[#ffa600]">Stagnant Growth:</strong> Inability to handle more leads or scale for storm season.</div></li>
                         </ul>
                     </div>
                     <div class="bg-gray-100/20 rounded-lg p-6 border-l-4 border-[#8fbc8f]">
                         <h3 class="font-bold text-2xl text-white mb-4">After AI: The Growth Engine</h3>
                         <ul class="space-y-3">
                             <li class="flex items-start"><span class="text-2xl mr-3">✅</span> <div><strong class="text-[#8fbc8f]">92% Answer Rate:</strong> Every lead is captured and qualified, 24/7.</div></li>
                             <li class="flex items-start"><span class="text-2xl mr-3">🚀</span> <div><strong class="text-[#8fbc8f]">3 Hours/Week:</strong> Owner focuses on strategy, sales, and crew management.</div></li>
                             <li class="flex items-start"><span class="text-2xl mr-3">👍</span> <div><strong class="text-[#8fbc8f]">Under 5% No-Shows:</strong> Automated reminders keep the schedule tight.</div></li>
                             <li class="flex items-start"><span class="text-2xl mr-3">📈</span> <div><strong class="text-[#8fbc8f]">Scalable Growth:</strong> Ready to handle any surge in demand, effortlessly.</div></li>
                         </ul>
                     </div>
                 </div>
            </div>
        </section>

        <footer class="text-center my-12 md:my-20">
            <h2 class="text-3xl md:text-4xl font-bold text-[#003f5c]">Ready to Revolutionize Your Business?</h2>
            <p class="mt-4 max-w-2xl mx-auto text-lg">Don't let another lead slip away. The future is here, and early adopters are winning big. It's time to take the AI leap and secure your competitive edge.</p>
            <a href="https://calendly.com/aivoice/call" target="_blank" class="inline-block bg-gradient-to-r from-[#d45087] to-[#ff7c43] text-white font-bold text-xl py-4 px-10 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mt-8">Book a Demo Now</a>
        </footer>

      </div>

      <script>
        // Wait for Chart.js to load before initializing charts
        document.addEventListener('DOMContentLoaded', function() {
          // Add a small delay to ensure Chart.js is fully loaded
          setTimeout(function() {
            if (typeof Chart !== 'undefined') {
              initializeCharts();
            } else {
              // Retry after a longer delay if Chart.js isn't ready
              setTimeout(initializeCharts, 1000);
            }
          }, 500);
        });

        function initializeCharts() {
          const tooltipCallback = {
              plugins: {
                  tooltip: {
                      callbacks: {
                          title: function(tooltipItems) {
                              const item = tooltipItems[0];
                              let label = item.chart.data.labels[item.dataIndex];
                              if (Array.isArray(label)) {
                                return label.join(' ');
                              } else {
                                return label;
                              }
                          }
                      }
                  }
              }
          };

          const chartColors = {
              primary: '#d45087',
              secondary: '#ff7c43',
              dark: '#003f5c',
              light: '#f0f4f8',
              accent1: '#665191',
              accent2: '#ffa600'
          };

          // Check if elements exist before creating charts
          const missedCallsElement = document.getElementById('missedCallsChart');
          if (missedCallsElement) {
            new Chart(missedCallsElement, {
                type: 'doughnut',
                data: {
                    labels: ['Calls Answered', 'Calls Missed'],
                    datasets: [{
                        data: [38, 62],
                        backgroundColor: [chartColors.accent1, chartColors.primary],
                        borderColor: chartColors.light,
                        borderWidth: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                     plugins: {
                        ...tooltipCallback.plugins,
                        legend: { position: 'bottom' }
                    }
                }
            });
          }

          const voicemailElement = document.getElementById('voicemailAbandonmentChart');
          if (voicemailElement) {
            new Chart(voicemailElement, {
                type: 'doughnut',
                data: {
                    labels: ['Left Voicemail', 'Hung Up'],
                    datasets: [{
                        data: [15, 85],
                        backgroundColor: [chartColors.accent2, chartColors.secondary],
                        borderColor: chartColors.light,
                        borderWidth: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        ...tooltipCallback.plugins,
                        legend: { position: 'bottom' }
                    }
                }
            });
          }
          
          const speedElement = document.getElementById('speedToLeadChart');
          if (speedElement) {
            new Chart(speedElement, {
                type: 'line',
                data: {
                    labels: ['< 1 min', '< 5 min', '< 1 hr', '< 24 hrs', '> 24 hrs'],
                    datasets: [{
                        label: 'Conversion Likelihood',
                        data: [100, 95, 40, 15, 5],
                        borderColor: chartColors.primary,
                        backgroundColor: 'rgba(212, 80, 135, 0.2)',
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: chartColors.primary,
                        pointBorderColor: '#fff',
                        pointHoverRadius: 7,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: chartColors.primary
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) { return value + '%' }
                            }
                        }
                    },
                    plugins: {
                         ...tooltipCallback.plugins,
                        legend: { display: false }
                    }
                }
            });
          }
          
          const comparisonElement = document.getElementById('comparisonChart');
          if (comparisonElement) {
            new Chart(comparisonElement, {
                type: 'bar',
                data: {
                    labels: ['Call Answer Rate', '24/7 Availability', 'Scalability'],
                    datasets: [
                        {
                            label: 'Voice AI',
                            data: [92, 100, 100],
                            backgroundColor: chartColors.accent1,
                            borderRadius: 4
                        },
                        {
                            label: 'Traditional Front Desk',
                            data: [65, 33, 10],
                            backgroundColor: chartColors.secondary,
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            ticks: {
                                callback: function(value) { return value + '%' }
                            }
                        }
                    },
                    plugins: {
                        ...tooltipCallback.plugins,
                        legend: { position: 'bottom' }
                    }
                }
            });
          }
        }
      </script>
    `
  }
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return articles.find(article => article.slug === slug && article.show_in_listing);
};

export const getAllArticles = (): Article[] => {
  return articles.filter(article => article.show_in_listing);
};

export const getArticlesByTag = (tag: string): Article[] => {
  return articles.filter(article => 
    article.show_in_listing && 
    article.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};