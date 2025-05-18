import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Users, Clock, BarChart, Building2, Wrench } from 'lucide-react';
import CalendarDialog from '@/components/CalendarDialog';
import ProblemStatementSection from '@/components/industry/ProblemStatementSection';
import SolutionBenefitsSection from '@/components/industry/SolutionBenefitsSection';
import CostComparisonSection from '@/components/industry/CostComparisonSection';
import UseCaseExamplesSection from '@/components/industry/UseCaseExamplesSection';
import IndustryTestimonial from '@/components/industry/IndustryTestimonial';
import IndustryFAQSection from '@/components/industry/IndustryFAQSection';
import CtaSection from '@/components/industry/CtaSection';
import { SEO, generateServiceSchema, generateFaqSchema } from '@/lib/seo-fixed';

const IndustryPage = () => {
  const { industrySlug } = useParams<{ industrySlug: string }>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Find the industry data based on the URL slug
  const industryData = INDUSTRY_DATA.find(industry => industry.slug === industrySlug);
  
  useEffect(() => {
    // Ensure page always scrolls to top when industry page loads
    window.scrollTo(0, 0);
  }, [industrySlug]);
  
  if (!industryData) {
    return <Navigate to="/404" replace />;
  }

  // Generate service schema for this industry
  const serviceSchema = generateServiceSchema({
    title: `${industryData.name} Voice AI Assistant | SummitVoiceAI`,
    description: industryData.metaDescription,
    url: `https://summitaivoice.com/industries/${industryData.slug}`,
    industryName: industryData.name
  });

  // Generate FAQ schema if FAQs exist
  const faqSchema = industryData.faqs ? generateFaqSchema(industryData.faqs) : null;

  // Combine schemas if both exist
  const schemas = [serviceSchema];
  if (faqSchema) schemas.push(faqSchema);

  return (
    <>
      <SEO
        title={`${industryData.name} Voice AI Assistant | SummitVoiceAI`}
        description={industryData.metaDescription}
        keywords={industryData.keywords}
        industry={industryData.name}
        canonical={`https://summitaivoice.com/industries/${industryData.slug}`}
        schema={schemas}
      />
      
      <div className="pt-28 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-voiceai-primary/10 rounded-full mb-6">
              <div className="text-voiceai-primary w-10 h-10">
                {industryData.icon}
              </div>
            </div>
            <h1 className="heading-lg mb-6">
              {industryData.headline}
            </h1>
            <p className="text-lg text-muted-foreground">
              {industryData.subheadline}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            <div>
              <img 
                src={industryData.heroImage} 
                alt={`${industryData.name} Voice AI Assistant`}
                className="w-full h-auto rounded-xl shadow-lg"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4">
                {industryData.heroContent.heading}
              </h2>
              <p className="mb-6 text-muted-foreground">
                {industryData.heroContent.description}
              </p>
              <ul className="space-y-3 mb-8">
                {industryData.heroContent.bullets.map((bullet, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="mr-3 text-voiceai-primary">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor" />
                      </svg>
                    </div>
                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setCalendarOpen(true)}
                  className="btn-primary"
                >
                  Schedule Demo
                </button>
                <a 
                  href="#roi-calculator" 
                  className="btn-outline"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('roi-calculator');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Calculate ROI
                </a>
              </div>
            </div>
          </div>

          <ProblemStatementSection problems={industryData.problems} industryName={industryData.name} />
          <SolutionBenefitsSection benefits={industryData.benefits} comparisons={industryData.comparisons} />
          <div id="roi-calculator">
            <CostComparisonSection costs={industryData.costs} />
          </div>
          <UseCaseExamplesSection useCases={industryData.useCases} />
          <IndustryTestimonial {...industryData.testimonial} />
          <IndustryFAQSection faqs={industryData.faqs} industryName={industryData.name} />
          <CtaSection setCalendarOpen={setCalendarOpen} />
        </div>
      </div>
      
      <CalendarDialog open={calendarOpen} setOpen={setCalendarOpen} />
    </>
  );
};

// Industry data definitions
interface UseCaseStep {
  type: "human" | "ai";
  text: string;
}

interface UseCase {
  title: string;
  description: string;
  steps: UseCaseStep[];
  outcome: string;
}

interface Problem {
  title: string;
  description: string;
  statistic: string;
}

interface Comparison {
  feature: string;
  traditional: boolean;
  voiceAI: boolean;
}

interface CostItem {
  title: string;
  human: string;
  ai: string;
  icon: React.ReactNode;
}

interface Industry {
  name: string;
  slug: string;
  icon: React.ReactNode;
  headline: string;
  subheadline: string;
  metaDescription: string;
  keywords: string;
  heroImage: string;
  heroContent: {
    heading: string;
    description: string;
    bullets: string[];
  };
  problems: Problem[];
  benefits: string[];
  comparisons: Comparison[];
  costs: {
    yearly: CostItem[];
    threeYear: {
      human: string;
      ai: string;
    };
    fiveYear: {
      human: string;
      ai: string;
    };
  };
  useCases: UseCase[];
  testimonial: {
    name: string;
    role: string;
    companyName: string;
    quote: string;
    image: string;
    metrics: {
      label: string;
      value: string;
    }[];
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

// Industry data with SEO optimized content
const INDUSTRY_DATA: Industry[] = [
  {
    name: "Healthcare",
    slug: "healthcare",
    icon: <Building2 className="w-full h-full" />,
    headline: "AI Voice Assistant for Healthcare Practices",
    subheadline: "Give your patients 24/7 support with our HIPAA-compliant AI receptionist that schedules appointments, answers questions, and reduces no-shows.",
    metaDescription: "Transform your healthcare practice with our HIPAA-compliant AI voice assistant. Schedule appointments, reduce no-shows, and provide 24/7 patient support. Try our demo now!",
    keywords: "healthcare voice assistant, medical office AI receptionist, patient scheduling AI, HIPAA-compliant voice AI, medical practice automation",
    heroImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    heroContent: {
      heading: "Transform Your Healthcare Practice with AI Voice Support",
      description: "Our healthcare-focused AI voice assistant handles patient calls 24/7, schedules appointments, sends reminders, and provides critical information—all while maintaining HIPAA compliance and freeing your staff to focus on in-office patient care.",
      bullets: [
        "HIPAA-compliant patient communication",
        "24/7 appointment scheduling & management",
        "Automated appointment reminders to reduce no-shows",
        "Insurance verification assistance",
        "Seamless integration with major EHR/EMR systems"
      ]
    },
    problems: [
      {
        title: "High Call Volume During Peak Hours",
        description: "Medical practices often experience overwhelming call volume during mornings and lunch hours, leading to long hold times and patient frustration.",
        statistic: "68% of patients hang up after being on hold more than 2 minutes"
      },
      {
        title: "Staff Burnout from Routine Calls",
        description: "Administrative staff spend hours each day answering the same basic questions about location, hours, and services instead of focusing on in-office patients.",
        statistic: "30% of medical staff time is spent on phone calls"
      },
      {
        title: "Costly Appointment No-Shows",
        description: "Missed appointments create scheduling gaps and lost revenue, often because patients don't receive proper reminders.",
        statistic: "$150 average cost per no-show appointment"
      },
      {
        title: "After-Hours Patient Communication Gap",
        description: "Patients with evening or weekend questions have no way to get answers or schedule appointments outside of business hours.",
        statistic: "43% of patient calls occur outside business hours"
      }
    ],
    benefits: [
      "HIPAA-compliant patient interactions with full audit trail",
      "24/7 appointment scheduling, even when your office is closed",
      "Automated appointment reminders that reduce no-shows by up to 70%",
      "Insurance verification and eligibility checks",
      "Prescription refill request handling and routing",
      "Natural language understanding of medical terminology",
      "Seamless integration with major EHR/EMR systems",
      "Multilingual support for diverse patient populations",
      "Call volume metrics and analytics dashboard"
    ],
    comparisons: [
      {
        feature: "24/7 Availability",
        traditional: false,
        voiceAI: true
      },
      {
        feature: "Handle Multiple Calls Simultaneously",
        traditional: false,
        voiceAI: true
      },
      {
        feature: "Automated Appointment Reminders",
        traditional: true,
        voiceAI: true
      },
      {
        feature: "HIPAA Compliance",
        traditional: true,
        voiceAI: true
      },
      {
        feature: "Multilingual Support",
        traditional: false,
        voiceAI: true
      },
      {
        feature: "Zero Hold Times",
        traditional: false,
        voiceAI: true
      },
      {
        feature: "EHR/EMR Integration",
        traditional: true,
        voiceAI: true
      },
      {
        feature: "Scales Without Additional Hiring",
        traditional: false,
        voiceAI: true
      }
    ],
    costs: {
      yearly: [
        {
          title: "Staffing",
          human: "$65,000",
          ai: "$7,800",
          icon: <Users className="h-5 w-5" />
        },
        {
          title: "Training",
          human: "$4,500",
          ai: "$0",
          icon: <Users className="h-5 w-5" />
        },
        {
          title: "Benefits",
          human: "$12,000",
          ai: "$0",
          icon: <Users className="h-5 w-5" />
        },
        {
          title: "Missed Calls",
          human: "$18,000",
          ai: "$2,000",
          icon: <DollarSign className="h-5 w-5" />
        }
      ],
      threeYear: {
        human: "$298,500",
        ai: "$29,400"
      },
      fiveYear: {
        human: "$497,500",
        ai: "$49,000"
      }
    },
    useCases: [
      {
        title: "New Patient Appointment Scheduling",
        description: "A new patient calls after hours to schedule their first appointment with your practice.",
        steps: [
          {
            type: "human",
            text: "Hi, I'd like to schedule a first-time appointment with Dr. Johnson."
          },
          {
            type: "ai",
            text: "I'd be happy to help you schedule a first appointment with Dr. Johnson. Do you have a preference between a morning or afternoon appointment?"
          },
          {
            type: "human",
            text: "Morning would be better for me."
          },
          {
            type: "ai",
            text: "Great! Dr. Johnson has availability next Tuesday at 9:15 AM or Thursday at 10:00 AM. Which would you prefer?"
          },
          {
            type: "human",
            text: "Tuesday at 9:15 works for me."
          },
          {
            type: "ai",
            text: "Perfect! Could I please have your name and date of birth to schedule this appointment?"
          },
          {
            type: "human",
            text: "My name is Sarah Martinez, and my date of birth is May 12, 1985."
          },
          {
            type: "ai",
            text: "Thank you, Sarah. Is this your first time visiting our practice? If so, I'll need to collect some additional information."
          }
        ],
        outcome: "The AI collects all necessary new patient information, verifies insurance, schedules the appointment for Tuesday at 9:15 AM, sends a confirmation text with appointment prep instructions, and creates the new patient record in the EHR system."
      },
      {
        title: "Prescription Refill Request Handling",
        description: "A patient needs a prescription refill but doesn't need to speak with a doctor.",
        steps: [
          {
            type: "human",
            text: "I need to refill my blood pressure medication. I'm almost out."
          },
          {
            type: "ai",
            text: "I'd be happy to help with your refill request. Could you please provide your full name and date of birth?"
          },
          {
            type: "human",
            text: "Robert Williams, January 8, 1972."
          },
          {
            type: "ai",
            text: "Thank you, Mr. Williams. Is this for your lisinopril 10mg prescription that was last filled on April 15th?"
          },
          {
            type: "human",
            text: "Yes, that's the one."
          },
          {
            type: "ai",
            text: "Great. Would you like this sent to Walgreens on Main Street as before, or would you prefer a different pharmacy?"
          },
          {
            type: "human",
            text: "Same pharmacy is fine."
          },
          {
            type: "ai",
            text: "Perfect. I've submitted your refill request for lisinopril 10mg to Dr. Chen for approval. Once approved, it will be sent to Walgreens on Main Street. You should receive a text message notification when it's ready for pickup. Is there anything else I can help you with today?"
          }
        ],
        outcome: "The AI creates a prescription refill request in the EHR system, routes it to the appropriate provider for approval, and sends a confirmation to the patient. The patient receives notification when the prescription is ready at their pharmacy."
      }
    ],
    testimonial: {
      name: "Dr. Emily Chen",
      role: "Practice Manager",
      companyName: "Pacific Family Medicine",
      quote: "SummitVoiceAI has transformed our practice operations. Our front desk staff is no longer overwhelmed with calls, patients love being able to schedule appointments 24/7, and our no-show rate has dropped by 62%. The HIPAA compliance and EHR integration were seamless.",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
      metrics: [
        {
          label: "Reduction in No-Shows",
          value: "62%"
        },
        {
          label: "Staff Hours Saved Weekly",
          value: "32"
        },
        {
          label: "ROI",
          value: "384%"
        }
      ]
    },
    faqs: [
      {
        question: "Is your healthcare voice AI HIPAA compliant?",
        answer: "Yes, our healthcare voice AI solution is fully HIPAA compliant. We implement enterprise-grade security measures including end-to-end encryption, secure data storage, and comprehensive audit trails. We also sign Business Associate Agreements (BAAs) with all healthcare clients."
      },
      {
        question: "Which electronic health record (EHR) systems do you integrate with?",
        answer: "Our voice AI integrates with all major EHR systems including Epic, Cerner, Allscripts, eClinicalWorks, NextGen, Athenahealth, and many others. Our team can provide custom integrations for specialty systems as needed."
      },
      {
        question: "How does the AI handle urgent medical situations?",
        answer: "Our AI is programmed to recognize urgent medical situations based on key phrases and caller tone. For any detected emergencies, the system immediately provides guidance to call 911 and can transfer the call to an on-call provider based on your escalation protocols."
      },
      {
        question: "Can patients request prescription refills through the AI assistant?",
        answer: "Yes, the AI can handle prescription refill requests by collecting patient information, medication details, and preferred pharmacy. The request is then routed to the appropriate provider through your EHR system for approval according to your practice's protocols."
      },
      {
        question: "How does the AI reduce no-show appointments?",
        answer: "Our AI significantly reduces no-shows through automated appointment reminders via calls, texts, or emails based on patient preference. The system sends initial confirmations, follow-up reminders, and day-before notifications, and can reschedule or waitlist appointments when cancellations occur."
      },
      {
        question: "Can the AI handle insurance verification?",
        answer: "Yes, our AI can verify patient insurance information, check eligibility for specific procedures, and provide estimates of patient responsibility. This information can be collected during appointment scheduling or in separate verification calls."
      },
      {
        question: "Is the voice AI multilingual for diverse patient populations?",
        answer: "Absolutely. Our healthcare voice AI supports multiple languages including Spanish, Mandarin, French, Vietnamese, Arabic, and more. The system automatically detects the caller's preferred language and seamlessly switches to provide support in that language."
      },
      {
        question: "How quickly can we implement the voice AI in our practice?",
        answer: "Most healthcare practices can be fully implemented within 2-4 weeks, including EHR integration, customization to your specific workflows, and staff training. Our implementation team handles the entire process to ensure minimal disruption to your practice operations."
      }
    ]
  },
  {
    name: "Home Services",
    slug: "home-services",
    icon: <Wrench className="w-full h-full" />,
    headline: "AI Voice Assistant for Home Service Businesses",
    subheadline: "Never miss another job opportunity with our 24/7 AI receptionist that handles calls, qualifies leads, and books jobs for your plumbing, HVAC, electrical, or home service business.",
    metaDescription: "Capture more leads with our AI voice assistant for home services. Our 24/7 virtual receptionist schedules appointments, qualifies leads & integrates with your CRM. Try it today!",
    keywords: "home services AI, plumbing business virtual receptionist, HVAC call handling, contractor call management, electrician scheduling software",
    heroImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    heroContent: {
      heading: "Stop Missing Calls, Start Booking More Jobs",
      description: "Our AI voice assistant is designed specifically for home service businesses. It handles customer calls 24/7, qualifies leads, schedules appointments, and integrates with your existing field service software—all without missing a single opportunity.",
      bullets: [
        "24/7 call answering even during peak seasons",
        "Automated job scheduling and technician dispatching",
        "Service type qualification and prioritization",
        "Real-time integration with field service software",
        "Emergency service call routing and after-hours support"
      ]
    },
    problems: [
      {
        title: "Missed Calls During Peak Seasons",
        description: "Home service businesses often experience overwhelming call volumes during seasonal peaks, leading to missed opportunities and frustrated customers.",
        statistic: "85% of customers won't call back if their call goes unanswered"
      },
      {
        title: "Inconsistent Lead Qualification",
        description: "Staff members qualify leads differently, leading to technicians being sent on low-value or unprofitable jobs.",
        statistic: "32% of service calls could be better qualified or scheduled"
      },
      {
        title: "After-Hours Emergency Calls",
        description: "Emergency service requests come in at all hours, requiring costly on-call staff or risking lost business to competitors.",
        statistic: "40% of emergency calls occur outside business hours"
      },
      {
        title: "Scheduling Inefficiencies",
        description: "Manual scheduling leads to routing inefficiencies, double-bookings, and wasted technician time.",
        statistic: "$200+ lost per technician per day due to poor scheduling"
      }
    ],
    benefits: [
      "24/7/365 call answering, even during highest seasonal demand",
      "Consistent lead qualification based on your specific criteria",
      "Intelligent emergency call routing based on severity",
      "Automated scheduling that optimizes technician routes",
      "Integration with ServiceTitan, Jobber, HouseCall Pro, and other software",
      "Detailed job information collection for technician preparation",
      "Follow-up call scheduling and review requests",
      "Real-time availability updates from your field service software",
      "Customizable pricing quotes based on your service matrix"
    ],
    comparisons: [
      {
        feature: "24/7 Availability",
        traditional: false,
        voiceAI: true
      },
      {
        feature: "Consistent Lead Qualification",
        traditional: false,
        voiceAI: true
      },
      {
        feature: "Handle Multiple Calls Simultaneously",
        traditional: false,
        voiceAI: true
      },
      {
        feature: "Real-time FSM Integration",
        traditional: true,
        voiceAI: true
      },
      {
        feature: "Scheduled Follow-ups",
        traditional: true,
        voiceAI: true
      },
      {
        feature: "Zero Hold Times",
        traditional: false,
        voiceAI: true
      },
      {
        feature: "Seasonal Scalability",
        traditional: false,
        voiceAI: true
      },
      {
        feature: "No Additional Staffing Costs",
        traditional: false,
        voiceAI: true
      }
    ],
    costs: {
      yearly: [
        {
          title: "Receptionist Salary",
          human: "$42,000",
          ai: "$7,800",
          icon: <Users className="h-5 w-5" />
        },
        {
          title: "Training/Turnover",
          human: "$8,500",
          ai: "$0",
          icon: <Clock className="h-5 w-5" />
        },
        {
          title: "Missed Opportunities",
          human: "$36,000",
          ai: "$3,600",
          icon: <DollarSign className="h-5 w-5" />
        },
        {
          title: "After-Hours Service",
          human: "$15,000",
          ai: "$0",
          icon: <Clock className="h-5 w-5" />
        }
      ],
      threeYear: {
        human: "$304,500",
        ai: "$34,200"
      },
      fiveYear: {
        human: "$507,500",
        ai: "$57,000"
      }
    },
    useCases: [
      {
        title: "Emergency HVAC Service Call",
        description: "A customer calls about a broken AC unit during a heatwave, requiring urgent service.",
        steps: [
          {
            type: "human",
            text: "Hi, my air conditioner just stopped working completely and it's 95 degrees outside. I need someone to come fix it as soon as possible."
          },
          {
            type: "ai",
            text: "I understand this is an urgent situation with the high temperatures. I'd be happy to help get a technician to you quickly. Could I have your name and address please?"
          },
          {
            type: "human",
            text: "My name is Michael Rodriguez. I'm at 1542 Oakwood Drive, Springfield."
          },
          {
            type: "ai",
            text: "Thank you, Mr. Rodriguez. To help our technician diagnose the issue, could you tell me a bit more about the problem? Is the unit not turning on at all, or is it running but not cooling?"
          },
          {
            type: "human",
            text: "It's running but blowing warm air. I checked the air filter and it's clean."
          },
          {
            type: "ai",
            text: "Thank you for checking the filter already. Based on your description, I see we can have a technician at your location within 3 hours. Our emergency service call is $129 for the diagnostic fee, which is waived if you proceed with the repairs. Would you like me to schedule the visit?"
          },
          {
            type: "human",
            text: "Yes, please. The sooner the better."
          },
          {
            type: "ai",
            text: "I've scheduled an emergency service call with our technician David, who specializes in AC repairs. He will arrive between 2:00-3:00 PM today. You'll receive a text message with his details and a link to track his arrival. Is there anything else you need to know before his visit?"
          }
        ],
        outcome: "The AI categorized this as an emergency call based on the description, prioritized it in the scheduling system, provided the customer with pricing transparency, and dispatched the appropriate technician with AC repair expertise. The customer receives automated updates about the technician's arrival time."
      },
      {
        title: "Routine Plumbing Job Scheduling",
        description: "A customer needs to schedule a routine plumbing service for a leaking faucet.",
        steps: [
          {
            type: "human",
            text: "I have a kitchen faucet that's been leaking for a few days. Nothing urgent but I'd like to get it fixed."
          },
          {
            type: "ai",
            text: "I'd be happy to help schedule a plumber to fix your leaking kitchen faucet. Could I have your name and contact information please?"
          },
          {
            type: "human",
            text: "It's Jennifer Miller, 555-123-4567. I live at 42 Cedar Street."
          },
          {
            type: "ai",
            text: "Thank you, Ms. Miller. Have you used our plumbing services before?"
          },
          {
            type: "human",
            text: "Yes, about a year ago for a water heater installation."
          },
          {
            type: "ai",
            text: "I see your previous service in our system. Thank you for being a returning customer. For the leaking faucet, we have availability this Thursday between 1-3 PM or Friday morning between 9-11 AM. Do either of those times work for you?"
          },
          {
            type: "human",
            text: "Friday morning would be better for me."
          },
          {
            type: "ai",
            text: "Perfect. I've scheduled a plumber to visit this Friday between 9-11 AM for your leaking kitchen faucet. Our service call fee is $89, which covers the diagnosis and first 30 minutes of labor. Any parts needed would be additional. You'll receive a confirmation email shortly with all these details. Is there anything else I can help you with today?"
          }
        ],
        outcome: "The AI recognized this as a non-emergency call, accessed the customer's history as a returning client, scheduled the appointment during a time that worked for the customer's preference, and provided transparent pricing information. The job was automatically added to the plumber's schedule for Friday morning."
      }
    ],
    testimonial: {
      name: "Mark Johnson",
      role: "Owner",
      companyName: "Johnson Heating & Cooling",
      quote: "We were missing up to 40% of calls during summer peak season. After implementing SummitVoiceAI, we haven't missed a single opportunity. The system qualifies leads better than my staff did and has increased our average ticket value by identifying upsell opportunities consistently.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
      metrics: [
        {
          label: "Increase in Booked Jobs",
          value: "37%"
        },
        {
          label: "Reduction in No-Shows",
          value: "42%"
        },
        {
          label: "Monthly ROI",
          value: "410%"
        }
      ]
    },
    faqs: [
      {
        question: "Does the AI voice assistant integrate with my current field service management software?",
        answer: "Yes, our AI voice assistant integrates seamlessly with all major field service management platforms including ServiceTitan, Jobber, HouseCall Pro, FieldEdge, Service Fusion, and many others. We also offer custom integrations for proprietary systems through our open API."
      },
      {
        question: "How does the AI handle emergency calls versus routine service requests?",
        answer: "Our AI is programmed to identify emergency situations based on key phrases, tone, and specific issues. Emergency calls can be immediately routed to on-call technicians, while routine requests are scheduled based on your availability calendar. The prioritization rules are fully customizable to your business needs."
      },
      {
        question: "Can the AI provide pricing estimates for different services?",
        answer: "Absolutely. We program your service pricing matrix into the AI, allowing it to provide accurate estimates based on the customer's description of the problem, location, equipment type, and other factors. The system can also explain service fees, trip charges, and membership benefits."
      },
      {
        question: "How does the AI qualify leads for my home service business?",
        answer: "The AI qualifies leads based on your specific criteria, such as service location, job type, customer history, urgency, budget considerations, and more. It asks strategic questions to gather all necessary information and prioritizes high-value opportunities according to your business rules."
      },
      {
        question: "Can customers reschedule or cancel appointments through the AI?",
        answer: "Yes, customers can easily reschedule or cancel appointments through the AI. The system updates your scheduling software in real-time, can offer alternative time slots, and even fill canceled appointments with waitlisted customers to maximize your schedule efficiency."
      },
      {
        question: "How does the system handle peak seasonal call volumes?",
        answer: "Unlike human receptionists who can only handle one call at a time, our AI voice assistant can manage unlimited simultaneous calls during seasonal peaks (like summer AC emergencies or winter heating issues), ensuring you never miss an opportunity regardless of call volume."
      },
      {
        question: "Can the AI assistant follow up with customers after service is completed?",
        answer: "Yes, the AI automatically schedules follow-up calls after service completion to check customer satisfaction, request reviews, and identify additional service opportunities. These follow-ups can be customized based on job type, technician, and service outcome."
      },
      {
        question: "What happens if a customer specifically requests to speak with a human?",
        answer: "If a customer requests a human representative or if the AI detects the conversation requires human intervention, it can seamlessly transfer the call to your designated staff member. The AI provides a complete summary of the conversation to the staff member for continuity."
      }
    ]
  },
  // Add more industries with properly formatted data
  // ...continuing with many more industries...
  // Note: All other industries would follow this same comprehensive format with industry-specific data
];

export default IndustryPage;
