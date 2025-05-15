
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Building2, Home, Scale, Car, Calculator, Scissors, Headphones, Wrench, ChevronDown, ArrowRight, DollarSign, Users, Clock, BarChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import ProblemStatementSection from '@/components/industry/ProblemStatementSection';
import SolutionBenefitsSection from '@/components/industry/SolutionBenefitsSection';
import CostComparisonSection from '@/components/industry/CostComparisonSection';
import UseCaseExamplesSection from '@/components/industry/UseCaseExamplesSection';
import IndustryTestimonial from '@/components/industry/IndustryTestimonial';
import IndustryFAQSection from '@/components/industry/IndustryFAQSection';
import CtaSection from '@/components/industry/CtaSection';

// Define the interface for use case steps
interface UseCaseStep {
  type: "human" | "ai";
  text: string;
}

// Define the interface for use cases
interface UseCase {
  title: string;
  description: string;
  steps: UseCaseStep[];
  outcome: string;
}

// Industry data
const industriesData = {
  'healthcare': {
    title: "AI Voice Assistant for Healthcare: Transforming Patient Experience",
    subheading: "Eliminate frustrating IVR systems and missed calls while improving CAHPS scores and patient satisfaction",
    icon: <Building2 className="w-12 h-12" />,
    description: "Healthcare practices face unique challenges with high call volumes, complex scheduling needs, and after-hours emergencies. SummitVoiceAI for Healthcare delivers 24/7 patient support that understands medical terminology, handles appointment scheduling, and ensures no patient call goes unanswered.",
    metaTitle: "AI Voice Assistant for Healthcare | 24/7 Patient Support | SummitVoiceAI",
    metaDescription: "Transform patient experience with SummitVoiceAI's healthcare voice assistant. Schedule appointments, screen patients, and improve CAHPS scores with 24/7 AI receptionist designed for medical practices.",
    problems: [
      {
        title: "High Call Abandonment During Peak Hours",
        description: "When patients can't reach your office, they often move on to the next provider. During busy hours, up to 30% of calls may go unanswered as staff juggle multiple responsibilities.",
        statistic: "30% Lost Calls"
      },
      {
        title: "Costly Missed Appointments",
        description: "Without proper scheduling and reminder systems, no-show rates increase dramatically. Each missed appointment costs a practice an average of $200-300 in lost revenue.",
        statistic: "$250 Per No-Show"
      },
      {
        title: "After-Hours Patient Concerns",
        description: "Medical concerns don't follow business hours. Patients calling after hours often need assistance with urgent issues or want to schedule appointments while they're thinking about it.",
        statistic: "35% Call After Hours"
      },
      {
        title: "Low CAHPS Scores for Accessibility",
        description: "Access to care and communication are key metrics in CAHPS scores. Practices with poor phone accessibility typically score 15-20% lower in these critical categories.",
        statistic: "15% Lower Ratings"
      },
      {
        title: "Staff Burnout from Phone Management",
        description: "Front desk staff often become overwhelmed by constant phone interruptions, leading to burnout and high turnover. The average medical receptionist handles 50-100 calls daily.",
        statistic: "75+ Calls Per Day"
      }
    ],
    benefits: [
      "24/7 patient support with natural, conversational AI that understands medical terminology",
      "Intelligent appointment scheduling that considers provider availability, reason for visit, and patient preferences",
      "Automated appointment reminders that reduce no-show rates by up to 30%",
      "Patient symptom screening to prioritize urgent cases and prepare providers",
      "Documentation of all calls for quality assurance and HIPAA compliance",
      "Integration with major EHR/EMR systems for seamless workflow",
      "Multi-language support to serve diverse patient populations"
    ],
    comparisons: [
      { feature: "24/7 Availability", traditional: false, voiceAI: true },
      { feature: "Zero Hold Times", traditional: false, voiceAI: true },
      { feature: "Call Documentation", traditional: false, voiceAI: true },
      { feature: "Consistent Experience", traditional: false, voiceAI: true },
      { feature: "Handles Multiple Calls", traditional: false, voiceAI: true },
      { feature: "Insurance Verification", traditional: true, voiceAI: true },
      { feature: "Complex Medical Advice", traditional: true, voiceAI: false }
    ],
    costs: {
      yearly: [
        { 
          title: "Base Salary",
          human: "$45,000",
          ai: "$6,000",
          icon: <DollarSign className="h-4 w-4" />
        },
        { 
          title: "Benefits & Taxes",
          human: "$13,500",
          ai: "$0",
          icon: <Users className="h-4 w-4" />
        },
        { 
          title: "Training",
          human: "$3,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Overtime",
          human: "$5,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Turnover Costs",
          human: "$4,500",
          ai: "$0",
          icon: <BarChart className="h-4 w-4" />
        }
      ],
      threeYear: {
        human: "$213,000",
        ai: "$18,000"
      },
      fiveYear: {
        human: "$355,000",
        ai: "$30,000"
      }
    },
    useCases: [
      {
        title: "After-Hours Appointment Scheduling",
        description: "A patient calls after business hours wanting to schedule an appointment for ongoing back pain that has recently worsened.",
        steps: [
          {
            type: "human" as const,
            text: "Hi, I need to make an appointment. My back pain is getting worse and I haven't been seen in about 6 months."
          },
          {
            type: "ai" as const,
            text: "I'm sorry to hear about your back pain. I'd be happy to help you schedule an appointment. May I have your name and date of birth to locate your record?"
          },
          {
            type: "human" as const,
            text: "My name is Michael Johnson, born September 15, 1978."
          },
          {
            type: "ai" as const,
            text: "Thank you, Mr. Johnson. I've found your record. For back pain that's worsening, would you prefer to see Dr. Garcia who you saw previously, or the first available provider?"
          },
          {
            type: "human" as const,
            text: "I'd like to see Dr. Garcia if possible."
          },
          {
            type: "ai" as const,
            text: "Dr. Garcia has availability tomorrow at 2:15 PM or Friday at 9:30 AM. Which would work better for you?"
          },
          {
            type: "human" as const,
            text: "Tomorrow at 2:15 would be perfect."
          },
          {
            type: "ai" as const,
            text: "Great! I've scheduled you for tomorrow at 2:15 PM with Dr. Garcia for back pain evaluation. Please arrive 15 minutes early to complete any necessary paperwork. You'll receive a confirmation text message shortly. Is there anything else you need help with tonight?"
          }
        ],
        outcome: "Appointment successfully scheduled after hours without staff involvement. Patient doesn't need to wait until morning and risk forgetting to call, and arrives prepared for their appointment."
      },
      {
        title: "Urgent Symptom Triage",
        description: "A parent calls about their child's high fever and rash, requiring assessment of urgency and appropriate guidance.",
        steps: [
          {
            type: "human" as const,
            text: "My 5-year-old daughter has a fever of 103° and developed a rash. I'm not sure if I should bring her in or go to the ER."
          },
          {
            type: "ai" as const,
            text: "I understand your concern. I need to ask a few questions to help determine the best course of action. Does your daughter have difficulty breathing or seem unusually lethargic?"
          },
          {
            type: "human" as const,
            text: "She's tired but breathing normally. The rash is red spots that started on her face and are now on her chest."
          },
          {
            type: "ai" as const,
            text: "Thank you for that information. One more question - when you press on the spots, do they temporarily fade or turn white?"
          },
          {
            type: "human" as const,
            text: "No, they stay red even when I press on them."
          },
          {
            type: "ai" as const,
            text: "Based on your description, this situation needs prompt medical attention. I recommend taking your daughter to the emergency room right away. A rash that doesn't blanch when pressed could indicate a more serious condition that requires immediate evaluation."
          },
          {
            type: "human" as const,
            text: "Ok, I'll take her to the ER now. Thank you!"
          },
          {
            type: "ai" as const,
            text: "You're welcome. I'll make a note in your daughter's record about this call and your plan to seek emergency care. The on-call physician will be notified. Please call back if you need any further assistance."
          }
        ],
        outcome: "Potentially serious condition identified and appropriate care level recommended. Parent receives clear guidance without waiting for a callback from an on-call provider."
      }
    ],
    testimonial: {
      name: "Dr. Amanda Richardson",
      role: "Medical Director",
      companyName: "Bright Smile Dental",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "Our dental practice has reduced front desk staffing by 50% while improving patient satisfaction. The AI handles all routine scheduling and follow-ups beautifully. We've seen our CAHPS scores increase by 18% and appointment no-shows decrease by nearly a third.",
      metrics: [
        { label: "Reduction in No-Shows", value: "32%" },
        { label: "CAHPS Score Increase", value: "18%" },
        { label: "Monthly ROI", value: "411%" }
      ]
    },
    faqs: [
      {
        question: "Is SummitVoiceAI HIPAA compliant?",
        answer: "Yes, SummitVoiceAI is fully HIPAA compliant. We maintain strict data security protocols, regularly conduct security audits, and have signed Business Associate Agreements (BAAs) with all our healthcare clients. All patient data is encrypted both in transit and at rest, and our systems are designed with privacy and compliance as top priorities."
      },
      {
        question: "How does the AI handle complex medical terminology?",
        answer: "Our AI is specifically trained on medical vocabulary and healthcare scenarios. It recognizes thousands of medical terms, conditions, specialties, and procedure names. For unusual or highly specialized terminology it doesn't recognize, the system is designed to gracefully handle the interaction and ensure accurate information gathering without confusion."
      },
      {
        question: "Can SummitVoiceAI integrate with our existing EMR/EHR system?",
        answer: "Yes, we offer integration with major EMR/EHR systems including Epic, Cerner, Allscripts, athenahealth, eClinicalWorks, NextGen, and many others. We have a dedicated integration team that handles the technical aspects of connecting our system with your existing software for seamless operation and data exchange."
      },
      {
        question: "How does the AI assistant handle emergency situations?",
        answer: "The AI is trained to identify potentially urgent or emergency situations through keyword recognition and context analysis. For identified emergencies, the system follows customizable protocols, which may include immediate transfer to on-call staff, providing emergency instructions, or advising the caller to seek emergency services. The system always errs on the side of caution when health and safety are concerned."
      },
      {
        question: "Can patients still speak with a human if they prefer?",
        answer: "Absolutely. Our system is designed to complement your human staff, not replace them entirely. Callers can request a human at any point during the conversation, and the system can be configured to route specific types of calls directly to your staff based on your preferences and operational needs."
      },
      {
        question: "How accurate is the appointment scheduling?",
        answer: "Our scheduling accuracy typically exceeds 97%. The system considers provider availability, appointment types, duration, patient preferences, and any special requirements. It can handle complex scheduling scenarios including recurring appointments, multiple service appointments, and can be configured with custom rules specific to your practice."
      },
      {
        question: "Will the AI assistant work with our multi-location practice?",
        answer: "Yes, SummitVoiceAI is designed to support healthcare practices with multiple locations. The system can route calls to the appropriate location, schedule appointments at specific locations based on availability and patient preference, and maintain distinct scheduling rules for each location while providing a unified patient experience."
      }
    ]
  },
  // Additional industries would be defined here
};

// Helper component for the hero section
const IconWithCircle = ({ icon }: { icon: React.ReactNode }) => (
  <div className="h-24 w-24 rounded-full bg-voiceai-primary/10 flex items-center justify-center">
    <div className="text-voiceai-primary">{icon}</div>
  </div>
);

const IndustryPage = () => {
  const { industrySlug } = useParams<{ industrySlug: string }>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // If the industry doesn't exist, show a not found message
  if (!industrySlug || !industriesData[industrySlug as keyof typeof industriesData]) {
    // Redirect or show 404
    return (
      <div className="pt-28 pb-20 container mx-auto px-4 text-center">
        <h1 className="heading-lg mb-4">Industry Not Found</h1>
        <p className="mb-8">We couldn't find the industry you're looking for.</p>
        <a href="/industries" className="btn-primary inline-flex">
          View All Industries
        </a>
      </div>
    );
  }
  
  const industry = industriesData[industrySlug as keyof typeof industriesData];
  
  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('roi-calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast({
        title: "ROI Calculator",
        description: "See how much you can save with SummitVoiceAI!",
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{industry.metaTitle}</title>
        <meta name="description" content={industry.metaDescription} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "${industry.title}",
              "description": "${industry.metaDescription}",
              "provider": {
                "@type": "Organization",
                "name": "SummitVoiceAI"
              }
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                ${industry.faqs.map(faq => `{
                  "@type": "Question",
                  "name": "${faq.question}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${faq.answer}"
                  }
                }`).join(',')}
              ]
            }
          `}
        </script>
      </Helmet>
      
      {/* Hero Section */}
      <section className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="lg:w-2/3 space-y-6">
                <div className="inline-flex items-center gap-2 bg-voiceai-primary/10 text-voiceai-primary px-4 py-2 rounded-full">
                  <span className="animate-pulse rounded-full w-2 h-2 bg-voiceai-primary"></span>
                  <span className="text-sm font-medium">Industry Solution</span>
                </div>
                
                <h1 className="heading-xl">
                  {industry.title}
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  {industry.subheading}
                </p>
                
                <div className="pt-4 flex flex-wrap gap-4">
                  <button onClick={() => setCalendarOpen(true)} className="btn-primary">
                    Get Started
                  </button>
                  <button onClick={scrollToCalculator} className="btn-secondary">
                    Calculate ROI
                  </button>
                </div>
              </div>
              
              <div className="lg:w-1/3 flex justify-center">
                <IconWithCircle icon={industry.icon} />
              </div>
            </div>
            
            <div className="mt-16 p-6 bg-muted rounded-lg border border-border/50">
              <p className="text-muted-foreground">
                {industry.description}
              </p>
            </div>
            
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => {
                  const problemsSection = document.getElementById('problems-section');
                  if (problemsSection) {
                    problemsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Learn More <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div id="problems-section">
        <ProblemStatementSection 
          problems={industry.problems} 
          industryName={industrySlug!.charAt(0).toUpperCase() + industrySlug!.slice(1)}
        />
      </div>
      
      <div id="roi-calculator">
        <SolutionBenefitsSection 
          benefits={industry.benefits}
          comparisons={industry.comparisons}
        />
      </div>
      
      <CostComparisonSection costs={industry.costs} />
      
      <UseCaseExamplesSection useCases={industry.useCases} />
      
      <IndustryTestimonial {...industry.testimonial} />
      
      <IndustryFAQSection 
        faqs={industry.faqs}
        industryName={industrySlug!.charAt(0).toUpperCase() + industrySlug!.slice(1)} 
      />
      
      <CtaSection setCalendarOpen={setCalendarOpen} />
      
      {/* Fix this later - we need a CalendarDialog component that accepts a boolean state */}
      {/*<CalendarDialog open={calendarOpen} setOpen={setCalendarOpen} />*/}
    </>
  );
};

export default IndustryPage;
