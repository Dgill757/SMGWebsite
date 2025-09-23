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
      
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-xl p-8 text-white mb-8">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              The Voice AI Revolution for Roofing & Home Services
            </h1>
            <p class="text-xl md:text-2xl text-blue-100 leading-relaxed">
              How Voice AI Eliminates Missed Calls, Kills Voicemails, and Books Jobs 24/7 with Inbound, Outbound, Reminders, and Database Reactivation
            </p>
          </div>
        </div>

        <div class="prose prose-lg max-w-none">
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg">
            <div class="flex items-center mb-2">
              <svg class="w-6 h-6 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <h3 class="text-lg font-semibold text-yellow-800">Industry Reality Check</h3>
            </div>
            <p class="text-yellow-700 font-medium">The roofing and home services industry loses $67 billion annually to missed calls and poor follow-up. Every missed call is a lost job opportunity.</p>
          </div>

          <h2 class="text-3xl font-bold text-gray-900 mb-6">The Current Problem: Your Phone is Bleeding Money</h2>
          
          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 class="text-xl font-bold text-red-800 mb-4">📱 Missed Call Crisis</h3>
              <ul class="space-y-2 text-red-700">
                <li>• 62% of calls to contractors go unanswered</li>
                <li>• Average job value: $3,500 - $15,000</li>
                <li>• Customers call 3-5 competitors before choosing</li>
                <li>• 80% won't leave voicemails</li>
              </ul>
            </div>
            <div class="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 class="text-xl font-bold text-orange-800 mb-4">⏰ Time Drain</h3>
              <ul class="space-y-2 text-orange-700">
                <li>• 4+ hours daily returning calls</li>
                <li>• Scheduling back-and-forth wastes hours</li>
                <li>• No-shows cost $200-500 per occurrence</li>
                <li>• Follow-up calls rarely happen</li>
              </ul>
            </div>
          </div>

          <div class="bg-gray-100 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold text-center mb-4">Lost Revenue Calculator</h3>
            <div class="max-w-2xl mx-auto">
              <canvas id="revenueChart" width="400" height="200"></canvas>
            </div>
          </div>

          <h2 class="text-3xl font-bold text-gray-900 mb-6">The Voice AI Solution: 24/7 Revenue Machine</h2>
          
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
              <div class="text-3xl font-bold text-green-600 mb-2">97%</div>
              <div class="text-green-800 font-medium">Call Answer Rate</div>
            </div>
            <div class="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
              <div class="text-3xl font-bold text-blue-600 mb-2">75%</div>
              <div class="text-blue-800 font-medium">Calls Convert to Bookings</div>
            </div>
            <div class="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
              <div class="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div class="text-purple-800 font-medium">Never Miss Another Call</div>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-gray-900 mb-4">4 Ways Voice AI Transforms Your Business</h3>

          <div class="space-y-8 mb-8">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h4 class="text-xl font-bold text-blue-900 mb-3">1. 🔵 Inbound Call Mastery</h4>
              <ul class="space-y-2 text-blue-800">
                <li>• Answers every call in 2 rings</li>
                <li>• Qualifies leads with smart questions</li>
                <li>• Books appointments instantly</li>
                <li>• Handles multiple calls simultaneously</li>
                <li>• Provides instant quotes for standard services</li>
              </ul>
            </div>

            <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h4 class="text-xl font-bold text-green-900 mb-3">2. 🟢 Outbound Lead Follow-Up</h4>
              <ul class="space-y-2 text-green-800">
                <li>• Calls new leads within 5 minutes</li>
                <li>• Follows up until contact is made</li>
                <li>• Nurtures leads with personalized messages</li>
                <li>• Converts cold leads into hot prospects</li>
                <li>• Handles objections with proven scripts</li>
              </ul>
            </div>

            <div class="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
              <h4 class="text-xl font-bold text-orange-900 mb-3">3. 🟠 Smart Appointment Reminders</h4>
              <ul class="space-y-2 text-orange-800">
                <li>• Reduces no-shows by 85%</li>
                <li>• Confirms appointments 24 hours ahead</li>
                <li>• Reschedules automatically if needed</li>
                <li>• Sends prep instructions to customers</li>
                <li>• Handles emergency rescheduling</li>
              </ul>
            </div>

            <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h4 class="text-xl font-bold text-purple-900 mb-3">4. 🟣 Database Reactivation</h4>
              <ul class="space-y-2 text-purple-800">
                <li>• Revives dormant customer database</li>
                <li>• Offers seasonal services and maintenance</li>
                <li>• Generates referrals from happy customers</li>
                <li>• Identifies upsell opportunities</li>
                <li>• Reactivates 30-40% of old customers</li>
              </ul>
            </div>
          </div>

          <div class="bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-lg mb-8">
            <h3 class="text-2xl font-bold text-center mb-6">ROI Impact Analysis</h3>
            <div class="max-w-3xl mx-auto">
              <canvas id="roiChart" width="600" height="300"></canvas>
            </div>
          </div>

          <h2 class="text-3xl font-bold text-gray-900 mb-6">Real Results from Real Contractors</h2>

          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-lg border">
              <div class="mb-4">
                <h4 class="text-lg font-bold text-gray-900">Elite Roofing Co.</h4>
                <p class="text-gray-600">Phoenix, AZ</p>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Monthly Revenue Before:</span>
                  <span class="font-bold text-red-600">$85,000</span>
                </div>
                <div class="flex justify-between">
                  <span>Monthly Revenue After:</span>
                  <span class="font-bold text-green-600">$142,000</span>
                </div>
                <div class="flex justify-between border-t pt-2">
                  <span class="font-bold">Increase:</span>
                  <span class="font-bold text-green-600">+67%</span>
                </div>
              </div>
              <p class="text-gray-700 text-sm mt-4 italic">"We went from missing 40+ calls per week to answering every single one. Our booking rate tripled overnight."</p>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-lg border">
              <div class="mb-4">
                <h4 class="text-lg font-bold text-gray-900">Precision HVAC</h4>
                <p class="text-gray-600">Denver, CO</p>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>No-Show Rate Before:</span>
                  <span class="font-bold text-red-600">32%</span>
                </div>
                <div class="flex justify-between">
                  <span>No-Show Rate After:</span>
                  <span class="font-bold text-green-600">4%</span>
                </div>
                <div class="flex justify-between border-t pt-2">
                  <span class="font-bold">Time Saved:</span>
                  <span class="font-bold text-green-600">25 hrs/week</span>
                </div>
              </div>
              <p class="text-gray-700 text-sm mt-4 italic">"The reminder system eliminated our no-show problem. We can actually plan our days now."</p>
            </div>
          </div>

          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-xl text-white text-center mb-8">
            <h3 class="text-2xl font-bold mb-4">Conservative ROI Projection</h3>
            <div class="grid md:grid-cols-3 gap-6">
              <div>
                <div class="text-3xl font-bold mb-2">$500</div>
                <div class="text-indigo-200">Monthly Investment</div>
              </div>
              <div>
                <div class="text-3xl font-bold mb-2">$3,200</div>
                <div class="text-indigo-200">Additional Monthly Revenue</div>
              </div>
              <div>
                <div class="text-3xl font-bold mb-2">540%</div>
                <div class="text-indigo-200">Return on Investment</div>
              </div>
            </div>
            <p class="text-indigo-100 mt-4">Based on capturing just 2 additional jobs per month at $1,600 average value</p>
          </div>

          <h2 class="text-3xl font-bold text-gray-900 mb-6">How It Works: Simple 3-Step Setup</h2>

          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 class="text-lg font-bold mb-2">Custom Configuration</h4>
              <p class="text-gray-600">We program your AI with your services, pricing, and availability.</p>
            </div>
            <div class="text-center">
              <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 class="text-lg font-bold mb-2">Phone Integration</h4>
              <p class="text-gray-600">Connect to your existing phone system in under 24 hours.</p>
            </div>
            <div class="text-center">
              <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 class="text-lg font-bold mb-2">Launch & Optimize</h4>
              <p class="text-gray-600">Go live and watch your booking rate soar while we fine-tune performance.</p>
            </div>
          </div>

          <div class="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-r-lg">
            <h3 class="text-lg font-bold text-red-800 mb-2">⚠️ The Cost of Waiting</h3>
            <p class="text-red-700">Every day you delay costs you an average of $400-800 in missed opportunities. Your competitors are already implementing Voice AI - don't get left behind.</p>
          </div>

          <div class="text-center bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white">
            <h3 class="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p class="text-xl mb-6 text-blue-100">See exactly how Voice AI will impact YOUR revenue with a personalized demo.</p>
            <a href="https://calendly.com/aivoice/call" target="_blank" class="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors">
              Book Your Free Demo Now →
            </a>
            <p class="text-sm text-blue-200 mt-3">30-minute call • Custom ROI analysis • No obligation</p>
          </div>
        </div>
      </div>

      <script>
        // Revenue Loss Chart
        const ctx1 = document.getElementById('revenueChart');
        if (ctx1) {
          new Chart(ctx1, {
            type: 'bar',
            data: {
              labels: ['Missed Calls', 'No Follow-up', 'No-Shows', 'Poor Scheduling'],
              datasets: [{
                label: 'Monthly Revenue Loss',
                data: [8500, 3200, 2100, 1800],
                backgroundColor: ['#ef4444', '#f97316', '#eab308', '#f59e0b'],
                borderColor: ['#dc2626', '#ea580c', '#ca8a04', '#d97706'],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Average Monthly Revenue Loss by Issue'
                },
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }
          });
        }

        // ROI Chart
        const ctx2 = document.getElementById('roiChart');
        if (ctx2) {
          new Chart(ctx2, {
            type: 'line',
            data: {
              labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
              datasets: [{
                label: 'Revenue Without Voice AI',
                data: [85000, 87000, 86000, 88000, 89000, 87000],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.1
              }, {
                label: 'Revenue With Voice AI',
                data: [85000, 115000, 125000, 135000, 142000, 148000],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: '6-Month Revenue Comparison'
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  min: 80000,
                  ticks: {
                    callback: function(value) {
                      return '$' + (value/1000) + 'K';
                    }
                  }
                }
              }
            }
          });
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