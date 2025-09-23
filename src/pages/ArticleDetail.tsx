import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, ExternalLink, Home, ChevronRight } from 'lucide-react';
import { SEO } from '@/lib/seo';
import { getArticleBySlug } from '@/data/articles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RawHtmlBlock from '@/components/RawHtmlBlock';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/articles" replace />;
  }

  const article = getArticleBySlug(slug);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  React.useEffect(() => {
    // Load Chart.js and initialize all charts
    const loadChartJS = () => {
      return new Promise((resolve, reject) => {
        if (typeof (window as any).Chart !== 'undefined') {
          resolve((window as any).Chart);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
        script.async = true;
        script.onload = () => {
          if (typeof (window as any).Chart !== 'undefined') {
            resolve((window as any).Chart);
          } else {
            reject(new Error('Chart.js failed to load'));
          }
        };
        script.onerror = () => reject(new Error('Chart.js script failed to load'));
        document.head.appendChild(script);
      });
    };

    const initializeAllCharts = async () => {
      try {
        const Chart = await loadChartJS();
        
        // Chart colors for consistency
        const chartColors = {
          primary: '#d45087',
          secondary: '#ff7c43', 
          dark: '#003f5c',
          light: '#f0f4f8',
          accent1: '#665191',
          accent2: '#ffa600'
        };

        // Helper function to safely get element
        const $ = (id: string) => document.getElementById(id);

        // Initialize missed calls chart (pie chart)
        const missedCallsElement = $('missedCallsChart') as HTMLCanvasElement;
        if (missedCallsElement) {
          new (Chart as any)(missedCallsElement, {
            type: 'doughnut',
            data: {
              labels: ['Calls Answered', 'Calls Missed'],
              datasets: [{
                data: [38, 62],
                backgroundColor: [chartColors.accent1, chartColors.primary],
                borderColor: '#ffffff',
                borderWidth: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                legend: { 
                  position: 'bottom',
                  labels: { usePointStyle: true, padding: 20 }
                }
              }
            }
          });
        }

        // Initialize voicemail abandonment chart (pie chart) 
        const voicemailElement = $('voicemailAbandonmentChart') as HTMLCanvasElement;
        if (voicemailElement) {
          new (Chart as any)(voicemailElement, {
            type: 'doughnut',
            data: {
              labels: ['Left Voicemail', 'Hung Up'],
              datasets: [{
                data: [15, 85],
                backgroundColor: [chartColors.accent2, chartColors.secondary],
                borderColor: '#ffffff',
                borderWidth: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                legend: { 
                  position: 'bottom',
                  labels: { usePointStyle: true, padding: 20 }
                }
              }
            }
          });
        }

        // Initialize speed to lead chart (line chart)
        const speedElement = $('speedToLeadChart') as HTMLCanvasElement;
        if (speedElement) {
          new (Chart as any)(speedElement, {
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
                pointHoverBorderColor: chartColors.primary,
                pointRadius: 5,
                pointBorderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) { return value + '%' }
                  },
                  grid: { color: 'rgba(0,0,0,0.1)' }
                },
                x: {
                  grid: { color: 'rgba(0,0,0,0.1)' }
                }
              },
              plugins: {
                legend: { display: false }
              }
            }
          });
        }

        // Initialize comparison chart (horizontal bar chart)
        const comparisonElement = $('comparisonChart') as HTMLCanvasElement;
        if (comparisonElement) {
          new (Chart as any)(comparisonElement, {
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
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) { return value + '%' }
                  },
                  grid: { color: 'rgba(0,0,0,0.1)' }
                },
                y: {
                  grid: { display: false }
                }
              },
              plugins: {
                legend: { 
                  position: 'bottom',
                  labels: { usePointStyle: true, padding: 20 }
                }
              }
            }
          });
        }

        // Initialize ROI Calculator
        initROICalculator();

      } catch (error) {
        console.error('Failed to initialize charts:', error);
        // Fallback: still try to initialize ROI calculator
        setTimeout(initROICalculator, 1000);
      }
    };

    const initROICalculator = () => {
      const $ = (id: string) => document.getElementById(id);

      const avgClientValue = $('avgClientValue') as HTMLInputElement;
      const missedCalls = $('missedCalls') as HTMLInputElement;
      const closeRate = $('closeRate') as HTMLInputElement;
      const webLeads = $('webLeads') as HTMLInputElement;
      const afterHoursCalls = $('afterHoursCalls') as HTMLInputElement;
      const missAfterHours = $('missAfterHours') as HTMLInputElement;
      const receptionistCost = $('receptionistCost') as HTMLInputElement;
      const dormantLeads = $('dormantLeads') as HTMLInputElement;
      const reactivationRate = $('reactivationRate') as HTMLInputElement;
      const calcBtn = $('calcBtn');

      if (!avgClientValue || !calcBtn) return;

      const fmt = (n: number) => n.toLocaleString(undefined, { style:'currency', currency:'USD', maximumFractionDigits:0 });
      const pct = (n: number) => `${n.toFixed(0)}%`;

      const PLAN_PRICE = 997;
      const WIDGET_UPLIFT_RATE = 0.25;
      const ANSWER_RATE_WITH_AI = 0.92;
      const AFTER_HOURS_MISS_RATE = 0.85;
      const RECEPTIONIST_OFFSET_FACTOR = 0.35;

      let chart: any;
      
      const ensureChart = () => {
        const ctx = $('roiChart') as HTMLCanvasElement;
        if (!ctx || typeof (window as any).Chart === 'undefined') return null;
        if (chart) return chart;
        
        const Chart = (window as any).Chart;
        chart = new (Chart as any)(ctx, {
          type: 'bar',
          data: {
            labels: ['Missed Calls', 'Web Uplift', 'DB Reactivation', 'Recpt. Savings', 'AI Cost'],
            datasets: [
              {
                label: 'Current (Loss/Cost)',
                data: [0, 0, 0, 0, -PLAN_PRICE],
                backgroundColor: '#ef4444',
                borderRadius: 6
              },
              {
                label: 'With Summit Voice AI (Gain)',
                data: [0, 0, 0, 0, 0],
                backgroundColor: '#8b5cf6',
                borderRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
            scales: {
              y: {
                ticks: { callback: (v: any) => '$' + Number(v).toLocaleString() },
                beginAtZero: true
              }
            }
          }
        });
        return chart;
      };

      const calculate = () => {
        const v = Number(avgClientValue.value || 0);
        const m = Number(missedCalls.value || 0);
        const cr = Math.min(100, Math.max(0, Number(closeRate.value || 0))) / 100;
        const wl = Number(webLeads.value || 0);
        const ah = Number(afterHoursCalls.value || 0);
        const missAH = missAfterHours.checked ? AFTER_HOURS_MISS_RATE : 0;
        const recCost = Number(receptionistCost.value || 0);
        const db = Number(dormantLeads.value || 0);
        const rr = Math.min(100, Math.max(0, Number(reactivationRate.value || 0))) / 100;

        const missedNowRevenue = m * cr * v;
        const afterHoursLostNow = ah * missAH * cr * v;
        const totalMissedCount = m + (missAH * ah);
        const recoveredMissedRevenue = totalMissedCount * ANSWER_RATE_WITH_AI * cr * v;
        const webUpliftRevenue = wl * WIDGET_UPLIFT_RATE * cr * v;
        const reactivatedPerMonth = (db * rr) / 12;
        const dbReactivationRevenue = reactivatedPerMonth * cr * v;
        const receptionistSavings = recCost * RECEPTIONIST_OFFSET_FACTOR;
        const totalGainBeforePlan = recoveredMissedRevenue + webUpliftRevenue + dbReactivationRevenue + receptionistSavings;
        const net = totalGainBeforePlan - PLAN_PRICE;

        // Update UI elements
        const updates = [
          ['kpiMissedLoss', fmt(missedNowRevenue + afterHoursLostNow)],
          ['kpiWebUplift', fmt(webUpliftRevenue)],
          ['kpiReactivation', fmt(dbReactivationRevenue)],
          ['kpiSavings', fmt(receptionistSavings)],
          ['outRecoveredMissed', fmt(recoveredMissedRevenue)],
          ['outWebUplift', fmt(webUpliftRevenue)],
          ['outReactivation', fmt(dbReactivationRevenue)],
          ['outSavings', fmt(receptionistSavings)],
          ['outGain', fmt(totalGainBeforePlan)],
          ['outPlanCost', fmt(PLAN_PRICE)],
          ['outNetRoi', fmt(net)]
        ];

        updates.forEach(([id, value]) => {
          const el = $(id);
          if (el) el.textContent = value;
        });

        const roiMultiple = PLAN_PRICE > 0 ? totalGainBeforePlan / PLAN_PRICE : 0;
        const roiPercent = PLAN_PRICE > 0 ? ((totalGainBeforePlan - PLAN_PRICE) / PLAN_PRICE) * 100 : 0;
        
        const multipleEl = $('outRoiMultiple');
        const percentEl = $('outRoiPercent');
        if (multipleEl) multipleEl.textContent = `${roiMultiple.toFixed(1)}×`;
        if (percentEl) percentEl.textContent = pct(roiPercent);

        const roiBlurb = $('roiBlurb');
        if (roiBlurb) {
          roiBlurb.textContent = `Based on ${m} missed calls/month, an average client value of ${fmt(v)}, and a ${pct(cr*100)} close rate, you are potentially leaving ${fmt(missedNowRevenue + afterHoursLostNow)} on the table every month from missed and after-hours calls. Implementing Voice AI recovers an estimated ${fmt(recoveredMissedRevenue)} from calls alone, adds ${fmt(webUpliftRevenue)} from website conversations, revives ${fmt(dbReactivationRevenue)} from dormant leads, and offsets about ${fmt(receptionistSavings)} in receptionist workload — for an estimated monthly net ROI of ${fmt(net)} after a $${PLAN_PRICE} plan.`;
        }

        const sixMo = Math.max(0, net) * 6;
        const twelve = Math.max(0, net) * 12;
        const outlook = $('outlook');
        if (outlook) {
          outlook.textContent = `If you implement now, the conservative projected impact is approximately ${fmt(sixMo)} over the next 6 months and ${fmt(twelve)} over the next 12 months. Early adopters capture more market share while AI handles the front desk, follow-up, and reactivation.`;
        }

        const c = ensureChart();
        if (c) {
          c.data.datasets[0].data = [-(missedNowRevenue + afterHoursLostNow), 0, 0, -recCost, -PLAN_PRICE];
          c.data.datasets[1].data = [recoveredMissedRevenue, webUpliftRevenue, dbReactivationRevenue, receptionistSavings, 0];
          c.update();
        }
      };

      calcBtn.addEventListener('click', calculate);
      calculate(); // Initial calculation
    };

    // Start initialization with proper timing
    const timer = setTimeout(initializeAllCharts, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO 
        title={`${article.title} | SummitVoiceAI`}
        description={article.excerpt}
        keywords={article.tags}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center">
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/articles">Articles & Reports</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back to Articles Link */}
          <Button variant="ghost" asChild className="mb-6 p-0">
            <Link to="/articles" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </Button>

          {/* Article Header */}
          <header className="mb-12 text-center">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-lg">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
                {article.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center bg-card/50 rounded-full px-4 py-2 border">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">{formatDate(article.published_at)}</span>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="w-4 h-4" />
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs capitalize font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {article.excerpt}
              </p>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg prose-slate max-w-none mb-16">
            <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden">
              <RawHtmlBlock 
                html={article.content_html}
                className="article-content"
              />
            </div>
          </article>

          {/* Enhanced CTA */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl p-8 md:p-12 text-center text-primary-foreground shadow-2xl mb-16 border border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-primary-foreground/90 mb-6 text-lg max-w-2xl mx-auto leading-relaxed">
                See how Voice AI can revolutionize your service business with a personalized demo. Join hundreds of home service companies already using AI to capture more leads.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-4 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <a
                  href={article.cta_calendly_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  Book Your Free Demo
                  <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          {/* ROI Calculator */}
          <section id="roi-calculator" className="my-20">
            <style>
              {`
                /* --- INPUT UX PATCH --- */
                /* Remove any browser decoration containers that can overlay digits */
                input::-webkit-textfield-decoration-container { display: none !important; }
                input::-webkit-contacts-auto-fill-button,
                input::-webkit-credentials-auto-fill-button { visibility: hidden; display: none !important; pointer-events: none; height: 0; width: 0; margin: 0; }

                /* Spinner kill if any number inputs slip in */
                input[type=number]::-webkit-outer-spin-button,
                input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }

                /* Unified, bigger inputs */
                .svai-input {
                  height: 3.25rem;                   /* taller = more digits visible */
                  padding: 0 1rem;                   /* comfortable padding */
                  font-size: 1.125rem;               /* text-lg */
                  line-height: 1.2;
                  border-radius: 0.75rem;
                  caret-color: #7c3aed;              /* visible caret */
                  font-variant-numeric: tabular-nums;
                }
                .svai-input:focus {
                  outline: none;
                  box-shadow: 0 0 0 3px rgba(124,58,237,.7);  /* clear purple focus ring */
                }
                
                /* Ensure chart containers have proper height and Chart.js can render */
                .chart-container canvas {
                  max-height: 100% !important;
                  width: 100% !important;
                }
                
                /* Force chart visibility */
                canvas {
                  display: block !important;
                  visibility: visible !important;
                }
              `}
            </style>

            <div className="bg-card/95 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12 border border-border/50">
              <div className="mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  ROI Calculator — Summit Voice AI
                </h2>
                <p className="mt-3 text-muted-foreground max-w-3xl mx-auto">
                  Plug in your numbers to see how much revenue you're leaving on the table from missed calls, slow follow-up, and silent web visitors — and what flips when AI answers <em>every</em> call, follows up instantly, and reactivates dormant leads.
                </p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground">Average Client Value ($)</label>
                    <input 
                      id="avgClientValue" 
                      inputMode="decimal" 
                      autoComplete="off" 
                      enterKeyHint="done"
                      type="text" 
                      defaultValue="2500"
                      className="svai-input mt-1 w-full border border-input bg-background text-foreground focus:ring-0" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground">Missed Calls / Month</label>
                    <input 
                      id="missedCalls" 
                      inputMode="decimal" 
                      autoComplete="off" 
                      enterKeyHint="done"
                      type="text" 
                      defaultValue="30"
                      className="svai-input mt-1 w-full border border-input bg-background text-foreground focus:ring-0" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground">Close Rate on Calls (%)</label>
                    <input 
                      id="closeRate" 
                      inputMode="decimal" 
                      autoComplete="off" 
                      enterKeyHint="done"
                      type="text" 
                      defaultValue="35"
                      className="svai-input mt-1 w-full border border-input bg-background text-foreground focus:ring-0" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground">Website Leads / Month</label>
                    <input 
                      id="webLeads" 
                      inputMode="decimal" 
                      autoComplete="off" 
                      enterKeyHint="done"
                      type="text" 
                      defaultValue="60"
                      className="svai-input mt-1 w-full border border-input bg-background text-foreground focus:ring-0" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll apply a default widget uplift of <span className="font-semibold">+25%</span> to turn more visitors into live conversations.
                    </p>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground">After-Hours Calls / Month</label>
                    <input 
                      id="afterHoursCalls" 
                      inputMode="decimal" 
                      autoComplete="off" 
                      enterKeyHint="done"
                      type="text" 
                      defaultValue="18"
                      className="svai-input mt-1 w-full border border-input bg-background text-foreground focus:ring-0" 
                    />
                    <div className="flex items-center mt-2">
                      <input 
                        id="missAfterHours" 
                        type="checkbox"
                        defaultChecked
                        className="rounded border-input text-primary focus:ring-primary" 
                      />
                      <label htmlFor="missAfterHours" className="ml-2 text-sm text-muted-foreground">
                        We currently miss most after-hours calls
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground">Receptionist Cost / Month ($)</label>
                    <input 
                      id="receptionistCost" 
                      inputMode="decimal" 
                      autoComplete="off" 
                      enterKeyHint="done"
                      type="text" 
                      defaultValue="3500"
                      className="svai-input mt-1 w-full border border-input bg-background text-foreground focus:ring-0" 
                    />
                    <p className="text-xs text-muted-foreground mt-1">If you don't have one, set to 0 — AI handles overflow & after-hours regardless.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground">Dormant Leads in CRM</label>
                      <input 
                        id="dormantLeads" 
                        inputMode="decimal" 
                        autoComplete="off" 
                        enterKeyHint="done"
                        type="text" 
                        defaultValue="2000"
                        className="svai-input mt-1 w-full border border-input bg-background text-foreground focus:ring-0" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground">Reactivation Rate (%)</label>
                      <input 
                        id="reactivationRate" 
                        inputMode="decimal" 
                        autoComplete="off" 
                        enterKeyHint="done"
                        type="text" 
                        defaultValue="8"
                        className="svai-input mt-1 w-full border border-input bg-background text-foreground focus:ring-0" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">Typical 6–10% response with smart AI campaigns.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
                <div className="rounded-xl p-5 bg-[#003f5c] text-white">
                  <div className="text-xs uppercase tracking-wide opacity-80">Missed-Call Loss / Mo</div>
                  <div id="kpiMissedLoss" className="text-2xl font-black mt-1">$0</div>
                </div>
                <div className="rounded-xl p-5 bg-[#2f4b7c] text-white">
                  <div className="text-xs uppercase tracking-wide opacity-80">Website Uplift Revenue</div>
                  <div id="kpiWebUplift" className="text-2xl font-black mt-1">$0</div>
                </div>
                <div className="rounded-xl p-5 bg-[#665191] text-white">
                  <div className="text-xs uppercase tracking-wide opacity-80">DB Reactivation / Mo</div>
                  <div id="kpiReactivation" className="text-2xl font-black mt-1">$0</div>
                </div>
                <div className="rounded-xl p-5 bg-[#ff7c43] text-white">
                  <div className="text-xs uppercase tracking-wide opacity-80">Receptionist Savings</div>
                  <div id="kpiSavings" className="text-2xl font-black mt-1">$0</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8">
                <button 
                  id="calcBtn"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#d45087] to-[#ff7c43] shadow hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Calculate ROI
                </button>
                <a 
                  href={article.cta_calendly_url} 
                  target="_blank" 
                  rel="noopener"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold border border-border text-foreground hover:border-foreground"
                >
                  Book a 15-Minute ROI Review
                </a>
              </div>

              {/* Chart + Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                <div className="bg-muted rounded-xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Monthly Projection</h3>
                  <div className="relative h-72">
                    <canvas id="roiChart"></canvas>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Projection compares your <span className="font-semibold">current status</span> vs <span className="font-semibold">with Summit Voice AI</span> across recovered missed calls, website uplift, database reactivation, and net savings.
                  </p>
                </div>

                <div className="bg-muted rounded-xl p-6">
                  <h3 className="text-lg font-bold text-foreground mb-4">Your ROI Snapshot</h3>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li>Recovered revenue from missed + after-hours calls: <span id="outRecoveredMissed" className="font-semibold">$0</span></li>
                    <li>Incremental revenue from website widget uplift (+25% default): <span id="outWebUplift" className="font-semibold">$0</span></li>
                    <li>Reactivated revenue from dormant leads: <span id="outReactivation" className="font-semibold">$0</span></li>
                    <li>Estimated receptionist savings / overflow coverage value: <span id="outSavings" className="font-semibold">$0</span></li>
                    <li className="mt-2">Total monthly gain (before AI plan): <span id="outGain" className="font-semibold">$0</span></li>
                    <li>AI plan cost (locked): <span id="outPlanCost" className="font-semibold">$997</span></li>
                    <li className="text-foreground font-semibold">Net ROI (monthly): <span id="outNetRoi" className="font-black">$0</span></li>
                    <li className="text-foreground font-semibold">ROI Multiple: <span id="outRoiMultiple" className="font-black">0×</span> &nbsp;|&nbsp; ROI %: <span id="outRoiPercent" className="font-black">0%</span></li>
                  </ul>

                  <div className="mt-5 rounded-lg bg-card border p-4">
                    <p id="roiBlurb" className="text-sm text-foreground leading-6">
                      Enter your numbers and click "Calculate ROI" to see what you're leaving on the table — and what flips when every call is answered and every lead is followed up.
                    </p>
                  </div>
                </div>
              </div>

              {/* 6–12 Month Outlook */}
              <div className="mt-10 bg-[#003f5c] text-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">6–12 Month Outlook</h3>
                <p id="outlook" className="text-sm opacity-95">
                  Once calculated, you'll see conservative projections for the next 6 and 12 months based on your inputs.
                </p>
              </div>
            </div>

            <script>
              {`
                (function(){
                  const $ = id => document.getElementById(id);

                  // Grab inputs (text-based now)
                  const avgClientValue   = $('avgClientValue');
                  const missedCalls      = $('missedCalls');
                  const closeRate        = $('closeRate');
                  const webLeads         = $('webLeads');
                  const afterHoursCalls  = $('afterHoursCalls');
                  const missAfterHours   = $('missAfterHours');
                  const receptionistCost = $('receptionistCost');
                  const dormantLeads     = $('dormantLeads');
                  const reactivationRate = $('reactivationRate');
                  const calcBtn          = $('calcBtn');

                  // Prevent scroll wheel from changing values or blurring
                  [avgClientValue, missedCalls, closeRate, webLeads, afterHoursCalls, receptionistCost, dormantLeads, reactivationRate]
                    .forEach(inp => {
                      if (inp) inp.addEventListener('wheel', e => e.preventDefault(), { passive:false });
                    });

                  // Sanitize to number (keeps user typing visible)
                  const num = (el) => {
                    if (!el) return 0;
                    const v = (el.value || '').toString().replace(/[^0-9.]/g, '');
                    return Number(v || 0);
                  };

                  // KPIs / outputs
                  const kpiMissedLoss    = $('kpiMissedLoss');
                  const kpiWebUplift     = $('kpiWebUplift');
                  const kpiReactivation  = $('kpiReactivation');
                  const kpiSavings       = $('kpiSavings');

                  const outRecoveredMissed = $('outRecoveredMissed');
                  const outWebUplift       = $('outWebUplift');
                  const outReactivation    = $('outReactivation');
                  const outSavings         = $('outSavings');
                  const outGain            = $('outGain');
                  const outPlanCost        = $('outPlanCost');
                  const outNetRoi          = $('outNetRoi');
                  const outRoiMultiple     = $('outRoiMultiple');
                  const outRoiPercent      = $('outRoiPercent');
                  const roiBlurb           = $('roiBlurb');
                  const outlook            = $('outlook');

                  const fmt = (n) => n.toLocaleString(undefined, { style:'currency', currency:'USD', maximumFractionDigits:0 });
                  const pct = (n) => Math.max(0, Math.min(100, n)).toFixed(0) + '%';

                  // Assumptions
                  const PLAN_PRICE = 997;            // locked
                  const WIDGET_UPLIFT_RATE = 0.25;   // +25% more website leads → convos
                  const ANSWER_RATE_WITH_AI = 0.92;  // recovered share of missed totals
                  const AFTER_HOURS_MISS_RATE = 0.85;// currently missed share if box checked
                  const RECEPTIONIST_OFFSET_FACTOR = 0.35;

                  // Chart
                  let chart;
                  function ensureChart(){
                    const ctx = $('roiChart');
                    if (!ctx || typeof Chart === 'undefined') return null;
                    if (chart) return chart;
                    chart = new Chart(ctx, {
                      type: 'bar',
                      data: {
                        labels: ['Missed Calls', 'Web Uplift', 'DB Reactivation', 'Recpt. Savings', 'AI Cost'],
                        datasets: [
                          { label: 'Current (Loss/Cost)', backgroundColor: '#ff7c43', borderRadius: 6, data: [0,0,0,0,-PLAN_PRICE] },
                          { label: 'With Summit Voice AI (Gain)', backgroundColor: '#665191', borderRadius: 6, data: [0,0,0,0,0] }
                        ]
                      },
                      options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom' } },
                        scales: { y: { beginAtZero: true, ticks: { callback:v=>'$'+Number(v).toLocaleString() } } }
                      }
                    });
                    return chart;
                  }

                  function calculate(){
                    const v  = num(avgClientValue);
                    const m  = num(missedCalls);
                    const cr = Math.min(100, Math.max(0, num(closeRate))) / 100;
                    const wl = num(webLeads);
                    const ah = num(afterHoursCalls);
                    const missAH = missAfterHours && missAfterHours.checked ? AFTER_HOURS_MISS_RATE : 0;
                    const recCost = num(receptionistCost);
                    const db = num(dormantLeads);
                    const rr = Math.min(100, Math.max(0, num(reactivationRate))) / 100;

                    // Current losses
                    const missedNowRevenue = m * cr * v;
                    const afterHoursLostNow = ah * missAH * cr * v;

                    // Recovered with AI
                    const totalMissedCount = m + (missAH * ah);
                    const recoveredMissedRevenue = totalMissedCount * ANSWER_RATE_WITH_AI * cr * v;

                    // Website uplift
                    const webUpliftRevenue = wl * WIDGET_UPLIFT_RATE * cr * v;

                    // DB reactivation (monthly from annual pool)
                    const reactivatedPerMonth = (db * rr) / 12;
                    const dbReactivationRevenue = reactivatedPerMonth * cr * v;

                    // Receptionist savings
                    const receptionistSavings = recCost * RECEPTIONIST_OFFSET_FACTOR;

                    // Totals
                    const totalGainBeforePlan = recoveredMissedRevenue + webUpliftRevenue + dbReactivationRevenue + receptionistSavings;
                    const net = totalGainBeforePlan - PLAN_PRICE;

                    // KPIs
                    if (kpiMissedLoss) kpiMissedLoss.textContent = fmt(missedNowRevenue + afterHoursLostNow);
                    if (kpiWebUplift) kpiWebUplift.textContent = fmt(webUpliftRevenue);
                    if (kpiReactivation) kpiReactivation.textContent = fmt(dbReactivationRevenue);
                    if (kpiSavings) kpiSavings.textContent = fmt(receptionistSavings);

                    if (outRecoveredMissed) outRecoveredMissed.textContent = fmt(recoveredMissedRevenue);
                    if (outWebUplift) outWebUplift.textContent = fmt(webUpliftRevenue);
                    if (outReactivation) outReactivation.textContent = fmt(dbReactivationRevenue);
                    if (outSavings) outSavings.textContent = fmt(receptionistSavings);
                    if (outGain) outGain.textContent = fmt(totalGainBeforePlan);
                    if (outPlanCost) outPlanCost.textContent = fmt(PLAN_PRICE);
                    if (outNetRoi) outNetRoi.textContent = fmt(net);

                    const roiMultiple = PLAN_PRICE > 0 ? totalGainBeforePlan / PLAN_PRICE : 0;
                    const roiPercent  = PLAN_PRICE > 0 ? ((totalGainBeforePlan - PLAN_PRICE) / PLAN_PRICE) * 100 : 0;
                    if (outRoiMultiple) outRoiMultiple.textContent = roiMultiple.toFixed(1) + '×';
                    if (outRoiPercent) outRoiPercent.textContent = pct(roiPercent);

                    // Narrative blurb
                    if (roiBlurb) {
                      roiBlurb.textContent =
                        'Based on ' + m + ' missed calls/month, an average client value of ' + fmt(v) + ', and a ' + pct(cr*100) + ' close rate, you\'re potentially leaving ' + fmt(missedNowRevenue + afterHoursLostNow) + ' on the table every month from missed and after-hours calls that often drive straight to competitors. Implementing Voice AI now recovers an estimated ' + fmt(recoveredMissedRevenue) + ' from calls alone, adds ' + fmt(webUpliftRevenue) + ' from website conversations, revives ' + fmt(dbReactivationRevenue) + ' from dormant leads, and offsets about ' + fmt(receptionistSavings) + ' in receptionist workload — for an estimated monthly net ROI of ' + fmt(net) + ' after a $' + PLAN_PRICE + ' plan.';
                    }

                    // 6–12 month outlook
                    const sixMo  = Math.max(0, net) * 6;
                    const twelve = Math.max(0, net) * 12;
                    if (outlook) {
                      outlook.textContent =
                        'If you implement now, the conservative projected impact is approximately ' + fmt(sixMo) + ' over the next 6 months and ' + fmt(twelve) + ' over the next 12 months (based on your inputs). Early adopters capture more market share, spend less time on the phone, and focus on higher-value work while AI handles the front desk, follow-up, and reactivation.';
                    }

                    // Chart
                    const c = ensureChart();
                    if (c){
                      c.data.datasets[0].data = [
                        -(missedNowRevenue + afterHoursLostNow), 0, 0, -recCost, -PLAN_PRICE
                      ];
                      c.data.datasets[1].data = [
                        recoveredMissedRevenue, webUpliftRevenue, dbReactivationRevenue, receptionistSavings, 0
                      ];
                      c.update();
                    }
                  }

                  // Calculate on button
                  if (calcBtn) calcBtn.addEventListener('click', calculate);

                  // First render with defaults
                  calculate();
                })();
              `}
            </script>
          </section>
        </div>
      </main>

      <style>{`
        .article-content {
          line-height: 1.8;
          padding: 2rem;
        }
        
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4 {
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          font-weight: 800;
          line-height: 1.2;
          color: hsl(var(--foreground));
        }
        
        .article-content h1 {
          font-size: 2.75rem;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)) 70%, hsl(var(--accent)));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .article-content h2 {
          font-size: 2.25rem;
          color: hsl(var(--primary));
        }
        
        .article-content h3 {
          font-size: 1.75rem;
          color: hsl(var(--primary));
        }
        
        .article-content h4 {
          font-size: 1.375rem;
        }
        
        .article-content p {
          margin-bottom: 1.75rem;
          color: hsl(var(--muted-foreground));
          font-size: 1.125rem;
        }
        
        .article-content ul,
        .article-content ol {
          margin-bottom: 2rem;
          padding-left: 2rem;
        }
        
        .article-content li {
          margin-bottom: 0.75rem;
          color: hsl(var(--muted-foreground));
        }
        
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem auto;
          display: block;
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15);
        }
        
        .article-content canvas {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.75rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .article-content .chart-container {
          margin: 2rem auto;
          padding: 1rem;
          background: hsl(var(--card));
          border-radius: 1rem;
          border: 1px solid hsl(var(--border));
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        
        .article-content section {
          margin: 3rem 0;
        }
        
        .article-content .bg-white {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border));
        }
        
        .article-content .bg-gray-50 {
          background: hsl(var(--muted)) !important;
        }
        
        .article-content .text-gray-700 {
          color: hsl(var(--foreground)) !important;
        }
        
        .article-content .text-gray-600 {
          color: hsl(var(--muted-foreground)) !important;
        }
        
        @media (max-width: 768px) {
          .article-content {
            font-size: 1rem;
            padding: 1.5rem;
          }
          
          .article-content h1 {
            font-size: 2rem;
          }
          
          .article-content h2 {
            font-size: 1.75rem;
          }
          
          .article-content h3 {
            font-size: 1.5rem;
          }
          
          .article-content h4 {
            font-size: 1.25rem;
          }
          
          .article-content canvas {
            height: 250px !important;
          }
          
          .article-content .chart-container {
            height: 280px !important;
          }
        }
        
        /* Chart responsiveness improvements */
        .article-content .chart-container canvas {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Loading state for charts */
        .article-content .chart-container:empty::after {
          content: 'Loading chart...';
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: hsl(var(--muted-foreground));
          font-style: italic;
        }
      `}</style>
    </>
  );
};

export default ArticleDetail;