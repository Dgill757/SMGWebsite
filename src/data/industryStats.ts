
import { StatItem } from "@/components/industry/IndustryStatsSection";

type IndustryData = {
  [key: string]: {
    stats: StatItem[];
    keywords: string[];
  }
};

export const industryStats: IndustryData = {
  "home-services": {
    stats: [
      {
        metric: "Missed Calls Reduction",
        value: "80%+ reduction",
        source: "Forrester 2023",
        benefit: "Capture every lead, day or night."
      },
      {
        metric: "Response Time",
        value: "Under 1 second",
        source: "InsideSales.com",
        benefit: "Win the job before your competitor does."
      },
      {
        metric: "Increase in Booked Appointments",
        value: "+34% with AI",
        source: "ServiceTitan, 2024",
        benefit: "More jobs, same staff."
      },
      {
        metric: "After-hours Lead Capture",
        value: "100% coverage 24/7",
        source: "PulseM, 2023",
        benefit: "Never lose another after-hours customer."
      },
      {
        metric: "Avg. Revenue per Missed Call",
        value: "$350–$900 lost revenue",
        source: "Jobber, 2024",
        benefit: "Missed call = real $$$ lost."
      },
      {
        metric: "CSAT Improvement",
        value: "+22% satisfaction",
        source: "NiceJob, 2023",
        benefit: "Happier customers, more referrals."
      }
    ],
    keywords: [
      "voice AI for home services", 
      "HVAC AI assistant", 
      "plumbing AI receptionist", 
      "book more jobs with AI", 
      "24/7 AI call answering", 
      "AI for contractors"
    ]
  },
  "real-estate": {
    stats: [
      {
        metric: "Speed-to-Lead",
        value: "92% of deals go to first responder",
        source: "LeadSimple, NAR 2024",
        benefit: "AI = Instant reply, win the listing."
      },
      {
        metric: "Lead Capture",
        value: "+44% more qualified inquiries",
        source: "Real Geeks, 2023",
        benefit: "No lead left behind."
      },
      {
        metric: "Appointment Scheduling",
        value: "30% more showings booked",
        source: "AppointmentPlus, 2023",
        benefit: "More tours, less chasing."
      },
      {
        metric: "After-hours Response",
        value: "70% of inquiries come after 5pm",
        source: "Zillow, 2024",
        benefit: "Capture clients, even after hours."
      },
      {
        metric: "Follow-up Automation",
        value: "10x faster follow-up",
        source: "HubSpot, 2023",
        benefit: "Don't lose hot leads to slow response."
      },
      {
        metric: "CSAT",
        value: "+18% improvement",
        source: "Zillow, 2024",
        benefit: "More 5-star reviews, more referrals."
      }
    ],
    keywords: [
      "voice AI for real estate", 
      "real estate AI assistant", 
      "real estate lead AI", 
      "24/7 real estate answering", 
      "real estate virtual receptionist", 
      "instant real estate follow-up"
    ]
  },
  "healthcare": {
    stats: [
      {
        metric: "First Call Resolution",
        value: "+25% improvement with AI triage",
        source: "McKinsey, 2023",
        benefit: "Solve patient issues on first call."
      },
      {
        metric: "Call Volume Reduction",
        value: "-30% with AI pre-screening",
        source: "Gartner, 2024",
        benefit: "Free up staff, reduce burnout."
      },
      {
        metric: "After-Hours Coverage",
        value: "100% 24/7/365 patient support",
        source: "MGMA, 2024",
        benefit: "Always available, never miss a call."
      },
      {
        metric: "Wait Time Reduction",
        value: "60% lower wait times",
        source: "NRC Health, 2023",
        benefit: "Happier, less frustrated patients."
      },
      {
        metric: "No-show Reduction",
        value: "22% fewer no-shows",
        source: "Zocdoc, 2023",
        benefit: "More kept appointments, more revenue."
      },
      {
        metric: "Patient Satisfaction",
        value: "+19 point NPS increase",
        source: "CMS, 2023",
        benefit: "Higher ratings, better retention."
      }
    ],
    keywords: [
      "voice AI for healthcare", 
      "healthcare call center AI", 
      "medical AI receptionist", 
      "medical office voice assistant", 
      "healthcare AI answering", 
      "24/7 patient AI support"
    ]
  },
  "legal": {
    stats: [
      {
        metric: "Intake Conversion Rate",
        value: "2x more leads convert",
        source: "Clio, 2023",
        benefit: "Never lose a high-value inquiry."
      },
      {
        metric: "24/7 Lead Capture",
        value: "100% after-hours coverage",
        source: "Lawmatics, 2023",
        benefit: "Never miss a lucrative case."
      },
      {
        metric: "Admin Time Saved",
        value: "10+ hours/week per attorney",
        source: "ABA Tech Report, 2022",
        benefit: "More time billing, less admin."
      },
      {
        metric: "Call Answer Rate",
        value: "95%+ calls answered by AI",
        source: "Smith.ai, 2023",
        benefit: "Outperform the \"big firms\"."
      },
      {
        metric: "Client Satisfaction",
        value: "+21% satisfaction",
        source: "ABA, 2023",
        benefit: "More positive reviews, more referrals."
      },
      {
        metric: "Response Time",
        value: "0 sec. hold for clients",
        source: "Clio, 2024",
        benefit: "No more voicemail, no more waiting."
      }
    ],
    keywords: [
      "legal voice AI", 
      "law firm AI receptionist", 
      "24/7 intake AI", 
      "lawyer AI answering", 
      "legal AI phone assistant", 
      "attorney voice AI"
    ]
  },
  "automotive": {
    stats: [
      {
        metric: "Missed Calls Reduction",
        value: "78% reduction",
        source: "CCC Intelligent Solutions, 2023",
        benefit: "Capture every repair lead."
      },
      {
        metric: "Service Booking",
        value: "31% more appointments",
        source: "RepairPal, 2024",
        benefit: "More cars in bays, less downtime."
      },
      {
        metric: "After-Hours Lead Capture",
        value: "95% lead capture after hours",
        source: "Podium, 2023",
        benefit: "Sell more even after closing time."
      },
      {
        metric: "Customer Satisfaction",
        value: "+16% increase",
        source: "J.D. Power, 2024",
        benefit: "Beat your competitors' NPS scores."
      },
      {
        metric: "Hold Time Reduction",
        value: "55% lower hold time",
        source: "AutoLoop, 2024",
        benefit: "Happier callers, higher retention."
      }
    ],
    keywords: [
      "voice AI for auto repair", 
      "automotive AI receptionist", 
      "dealership AI assistant", 
      "24/7 auto booking", 
      "repair shop AI answering", 
      "automotive lead AI"
    ]
  },
  "professional-services": {
    stats: [
      {
        metric: "Lead Response Rate",
        value: "4x faster than humans",
        source: "HubSpot, 2023",
        benefit: "Never lose a deal to slow response."
      },
      {
        metric: "New Client Intake",
        value: "50% reduction in admin work",
        source: "PracticeIgnition, 2023",
        benefit: "Close more new business, faster."
      },
      {
        metric: "Call Answer Rate",
        value: "99%+ calls answered",
        source: "Smith.ai, 2024",
        benefit: "Your firm is always \"open\"."
      },
      {
        metric: "No-show Rate",
        value: "17% decrease with AI",
        source: "Acuity, 2023",
        benefit: "Fewer gaps, more billable hours."
      },
      {
        metric: "NPS Increase",
        value: "+14 Net Promoter Score",
        source: "G2, 2023",
        benefit: "More referrals, more reviews."
      }
    ],
    keywords: [
      "voice AI for accountants", 
      "CPA AI assistant", 
      "consulting AI receptionist", 
      "professional services AI answering", 
      "business AI receptionist", 
      "AI for agencies"
    ]
  },
  "landscaping": {
    stats: [
      {
        metric: "Missed Calls Reduction",
        value: "80% fewer missed calls",
        source: "Jobber, 2024",
        benefit: "Never lose a lead to voicemail."
      },
      {
        metric: "After-hours Lead Capture",
        value: "100% coverage",
        source: "ServiceTitan, 2023",
        benefit: "Book jobs while you sleep."
      },
      {
        metric: "Booked Jobs",
        value: "+37% more work booked",
        source: "Lawn & Landscape, 2024",
        benefit: "Grow your business without more staff."
      },
      {
        metric: "Lead Response Time",
        value: "AI answers in under 1 second",
        source: "Housecall Pro, 2023",
        benefit: "First to respond, first to win."
      },
      {
        metric: "CSAT",
        value: "+23% improvement",
        source: "NiceJob, 2023",
        benefit: "Win more 5-star reviews."
      }
    ],
    keywords: [
      "landscaping voice AI", 
      "lawn care AI answering", 
      "outdoor services AI receptionist", 
      "landscaping booking AI", 
      "landscape contractor AI"
    ]
  },
  "customer-service": {
    stats: [
      {
        metric: "Call Volume Reduction",
        value: "-30% with AI pre-screening",
        source: "McKinsey, 2023",
        benefit: "Human reps focus on real problems."
      },
      {
        metric: "FTE Cost Reduction",
        value: "40%+ reduction in labor costs",
        source: "Gartner, 2023",
        benefit: "Replace expensive reps, keep quality."
      },
      {
        metric: "First Call Resolution",
        value: "+21% improvement",
        source: "Forrester, 2024",
        benefit: "More issues solved in one call."
      },
      {
        metric: "Customer Satisfaction",
        value: "+18 point NPS gain",
        source: "NICE, 2024",
        benefit: "Higher loyalty, fewer complaints."
      },
      {
        metric: "Call Abandonment Rate",
        value: "-35% reduction",
        source: "Genesys, 2024",
        benefit: "Fewer hangups, more conversions."
      }
    ],
    keywords: [
      "voice AI call center", 
      "AI for customer support", 
      "AI voice agent", 
      "call center automation", 
      "customer service voice AI", 
      "contact center AI"
    ]
  }
};

export const getIndustryStats = (industrySlug: string) => {
  return industryStats[industrySlug] || null;
};

export const getIndustryName = (industrySlug: string): string => {
  const industryNames: Record<string, string> = {
    "home-services": "Home Services",
    "real-estate": "Real Estate",
    "healthcare": "Healthcare",
    "legal": "Legal Services",
    "automotive": "Automotive",
    "professional-services": "Professional Services",
    "landscaping": "Landscaping",
    "customer-service": "Customer Service"
  };
  
  return industryNames[industrySlug] || "Industry";
};
