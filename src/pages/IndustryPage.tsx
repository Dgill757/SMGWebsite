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
import IndustryStatsSection from '@/components/industry/IndustryStatsSection';
import IndustryIntroCard from '@/components/industry/IndustryIntroCard';
import { getIndustryStats, getIndustryName } from '@/data/industryStats';

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
    title: "<span className='text-gradient'>AI Voice Assistant</span> for <span className='text-white'>Healthcare</span>: <span className='text-gradient'>Transforming Patient Experience</span>",
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
  'home-services': {
    title: "<span className='text-gradient'>AI Voice Assistant</span> for <span className='text-white'>Home Services</span>: <span className='text-gradient'>Never Miss Another Call</span>",
    subheading: "Transform how your service business handles calls, schedules appointments, and captures emergency jobs 24/7",
    icon: <Wrench className="w-12 h-12" />,
    description: "Home service businesses face unique communication challenges with technicians in the field and a constant stream of urgent service requests. SummitVoiceAI for Home Services gives plumbers, electricians, HVAC specialists and other contractors a sophisticated AI receptionist that handles calls, qualifies leads, and schedules appointments around the clock.",
    metaTitle: "AI Voice Assistant for Home Services | 24/7 Call Management | SummitVoiceAI",
    metaDescription: "Never miss another service call! SummitVoiceAI handles emergency requests, schedules appointments, and qualifies leads 24/7 for plumbers, HVAC, electricians, and contractors.",
    problems: [
      {
        title: "Missed Emergency Service Calls After Hours",
        description: "Emergency calls happen at all hours, but most home service businesses can't afford 24/7 phone coverage. Each missed emergency call represents a significant loss in potential revenue and customer loyalty.",
        statistic: "40% After Hours"
      },
      {
        title: "Scheduling Inefficiencies",
        description: "Technicians in the field have limited ability to answer calls, creating scheduling conflicts and communication gaps. This leads to unnecessary drive time, missed appointments, and customer frustration.",
        statistic: "2.3hrs Lost Daily"
      },
      {
        title: "Lead Response Delays",
        description: "When customers with urgent needs can't reach your business immediately, they quickly move on to competitors. The industry average response time of 8+ hours is far too slow for emergency situations.",
        statistic: "67% Call Competitors"
      },
      {
        title: "High Cost of After-Hours Answering Services",
        description: "Traditional answering services charge per minute and often lack the ability to properly qualify leads or schedule appointments. Most provide only message-taking, delaying actual service resolution.",
        statistic: "$3-5 Per Call"
      },
      {
        title: "Inconsistent Customer Experience",
        description: "When different people answer calls throughout the day, the customer experience varies widely in quality and information accuracy. This inconsistency damages your brand reputation and service reliability.",
        statistic: "28% Satisfaction Drop"
      }
    ],
    benefits: [
      "24/7/365 response to emergency service calls with intelligent prioritization based on urgency",
      "Advanced scheduling that considers technician location, availability, and expertise to minimize drive time",
      "Automated appointment confirmation and reminder system that reduces no-shows by up to 35%",
      "Pre-visit information collection that helps technicians arrive prepared with the right equipment and parts",
      "Intelligent lead qualification that ensures high-value emergency calls receive priority attention",
      "Seamless integration with popular field service management software",
      "Call recording and transcription for quality assurance and training purposes"
    ],
    comparisons: [
      { feature: "24/7 Availability", traditional: false, voiceAI: true },
      { feature: "Zero Hold Times", traditional: false, voiceAI: true },
      { feature: "Simultaneous Call Handling", traditional: false, voiceAI: true },
      { feature: "Emergency Prioritization", traditional: false, voiceAI: true },
      { feature: "Intelligent Scheduling", traditional: false, voiceAI: true },
      { feature: "Customer Information Storage", traditional: true, voiceAI: true },
      { feature: "Detailed Service Records", traditional: true, voiceAI: true }
    ],
    costs: {
      yearly: [
        { 
          title: "Base Salary",
          human: "$42,000",
          ai: "$6,000",
          icon: <DollarSign className="h-4 w-4" />
        },
        { 
          title: "Benefits & Taxes",
          human: "$12,600",
          ai: "$0",
          icon: <Users className="h-4 w-4" />
        },
        { 
          title: "Training",
          human: "$2,500",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "After-Hours Service",
          human: "$18,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Turnover Costs",
          human: "$8,400",
          ai: "$0",
          icon: <BarChart className="h-4 w-4" />
        }
      ],
      threeYear: {
        human: "$249,500",
        ai: "$18,000"
      },
      fiveYear: {
        human: "$416,000",
        ai: "$30,000"
      }
    },
    useCases: [
      {
        title: "Emergency Service Call Handling",
        description: "A homeowner discovers a major water leak at 2 AM and needs immediate assistance from a plumber.",
        steps: [
          {
            type: "human" as const,
            text: "Hello, I have water pouring from my ceiling! I need a plumber right away!"
          },
          {
            type: "ai" as const,
            text: "I understand this is an emergency situation. I'll help you right away. First, do you know where your main water shutoff valve is located?"
          },
          {
            type: "human" as const,
            text: "Yes, I've already shut off the main water valve, but there's still water dripping."
          },
          {
            type: "ai" as const,
            text: "Good thinking. I'll need to collect some information to dispatch an emergency plumber. What's your name and address?"
          },
          {
            type: "human" as const,
            text: "Michael Thompson, 1435 Oak Street, Apartment 3B."
          },
          {
            type: "ai" as const,
            text: "Thank you, Michael. And is there a phone number where our plumber can reach you?"
          },
          {
            type: "human" as const,
            text: "Yes, it's 555-123-4567."
          },
          {
            type: "ai" as const,
            text: "I've submitted your emergency request, and I'm notifying our on-call plumber right now. Based on your location, technician Dave Miller can be at your address within approximately 30-45 minutes. Would you like me to send you his profile and tracking information via text message?"
          }
        ],
        outcome: "Emergency service dispatched within minutes, with automated updates to the customer. The business captures a $950 emergency service call that would have been lost to a competitor."
      },
      {
        title: "Routine Maintenance Scheduling",
        description: "A customer wants to schedule their annual HVAC maintenance service during business hours.",
        steps: [
          {
            type: "human" as const,
            text: "Hi, I need to schedule my annual AC maintenance service."
          },
          {
            type: "ai" as const,
            text: "I'd be happy to help you schedule your annual AC maintenance. May I have your name and address to locate your account?"
          },
          {
            type: "human" as const,
            text: "Sarah Johnson, 742 Evergreen Terrace."
          },
          {
            type: "ai" as const,
            text: "Thank you, Sarah. I've found your account. I see you have a Carrier central air system that was last serviced in June of last year. Is this the unit you'd like serviced?"
          },
          {
            type: "human" as const,
            text: "Yes, that's correct."
          },
          {
            type: "ai" as const,
            text: "Great. Our technicians are available next Tuesday at 9 AM, Wednesday at 1 PM, or Thursday at 3 PM. Do any of these times work for you?"
          },
          {
            type: "human" as const,
            text: "Tuesday at 9 AM would be perfect."
          },
          {
            type: "ai" as const,
            text: "I've scheduled your AC maintenance for Tuesday at 9 AM. You'll receive a confirmation email shortly with details about your appointment, including the maintenance checklist. We'll also send you a reminder the day before. Is there anything specific you'd like the technician to check during the maintenance?"
          }
        ],
        outcome: "Appointment efficiently scheduled without taking up staff time, with all relevant customer history immediately available to both the AI and the assigned technician."
      }
    ],
    testimonial: {
      name: "Robert Turner",
      role: "Owner",
      companyName: "Turner Plumbing & Heating",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "Our HVAC company was missing at least 5 emergency calls per day after hours. With SummitVoiceAI, we're capturing those high-value service calls and have increased revenue by 38% in just two months. The system paid for itself in the first week.",
      metrics: [
        { label: "Increase in Revenue", value: "38%" },
        { label: "Emergency Calls Captured", value: "100%" },
        { label: "Monthly ROI", value: "840%" }
      ]
    },
    faqs: [
      {
        question: "How quickly can the AI receptionist dispatch emergency service calls?",
        answer: "Our AI receptionist dispatches emergency service calls within 60 seconds of the call ending. It immediately notifies your on-call technician through your preferred communication channel (text, app notification, or email). For urgent situations, the system can be configured to escalate using multiple notification methods to ensure the fastest possible response time."
      },
      {
        question: "Can SummitVoiceAI integrate with our existing field service management software?",
        answer: "Yes, we offer seamless integration with all major field service management platforms including ServiceTitan, housecall Pro, Service Fusion, Jobber, and many others. Our integration capabilities allow for two-way sync of appointment data, customer information, and service history. We also offer a REST API for custom integrations with proprietary systems."
      },
      {
        question: "How does the AI prioritize emergency versus routine service calls?",
        answer: "The AI uses natural language processing to identify emergency keywords and contextual clues in the conversation. It's trained to recognize urgent situations like water leaks, gas smells, electrical failures, and HVAC emergencies. These calls are flagged with high priority and routed according to your customized escalation protocols while routine service requests are scheduled based on your standard availability parameters."
      },
      {
        question: "Can the AI handle specific questions about our service pricing?",
        answer: "Yes, the AI can be trained with your specific pricing information for common services. For more complex jobs that require custom quotes, the AI can collect all the necessary information from the customer and notify your team to provide an accurate estimate. You control exactly what pricing information is shared and when the AI should defer to a human for custom quoting."
      },
      {
        question: "What happens if a customer specifically requests to speak with a human?",
        answer: "Customer satisfaction is our priority. If at any point a caller asks to speak with a human representative, the AI can immediately transfer the call to your designated staff member or take a message if after hours. The system is designed to complement your team, not replace the human touch when it's specifically requested or needed."
      },
      {
        question: "How does the scheduling system prevent overbooking or scheduling conflicts?",
        answer: "Our AI integrates with your actual scheduling system in real-time, ensuring it always has the most current availability information. It considers technician specialties, service zones, job duration estimates, and travel time between appointments to optimize scheduling. The system also maintains buffer times between appointments based on your preferences to accommodate jobs that may run longer than expected."
      },
      {
        question: "Can SummitVoiceAI help with follow-up and customer satisfaction surveys?",
        answer: "Absolutely! The system can automatically follow up after service appointments with satisfaction surveys via text or email. It can also schedule routine maintenance reminders and seasonal service promotions. All customer feedback is logged, categorized, and flagged if immediate attention is needed, helping you maintain high customer satisfaction and address any issues promptly."
      }
    ]
  },
  'real-estate': {
    title: "<span className='text-gradient'>AI Voice Assistant</span> for <span className='text-white'>Real Estate</span>: <span className='text-gradient'>Never Miss Another Lead</span>",
    subheading: "Capture inquiries 24/7, qualify buyers and sellers, and schedule showings while you're with clients",
    icon: <Home className="w-12 h-12" />,
    description: "Real estate professionals juggle client meetings, showings, and constant inquiries—often missing valuable leads when unavailable. SummitVoiceAI for Real Estate captures every call, qualifies prospects, schedules showings, and delivers property information 24/7, ensuring no opportunity slips through the cracks.",
    metaTitle: "AI Voice Assistant for Real Estate | Lead Capture & Scheduling | SummitVoiceAI",
    metaDescription: "Never miss another real estate lead! SummitVoiceAI captures inquiries 24/7, qualifies buyers and sellers, schedules showings, and delivers property information while you're with clients.",
    problems: [
      {
        title: "Missed Lead Opportunities",
        description: "Real estate agents often miss calls while in showings or closings. Studies show that 78% of buyers go with the first agent who responds, making every missed call a potentially lost commission.",
        statistic: "78% First Response"
      },
      {
        title: "Inefficient Lead Qualification",
        description: "Agents spend hours speaking with unqualified prospects. Without proper pre-screening, up to 50% of an agent's time is spent with buyers who aren't mortgage-qualified or sellers not ready to list.",
        statistic: "50% Time Wasted"
      },
      {
        title: "Poor After-Hours Response",
        description: "Many property inquiries occur evenings and weekends when agents are off-duty. Without 24/7 coverage, these high-intent leads often contact multiple agents and go with the first to respond.",
        statistic: "35% After-Hours Calls"
      },
      {
        title: "Scheduling Complexities",
        description: "Coordinating showings between interested buyers, current occupants, and agent availability creates logistical challenges and communication bottlenecks that delay showings and frustrate all parties.",
        statistic: "3.8 Day Avg. Delay"
      },
      {
        title: "Inconsistent Follow-Up",
        description: "The demands of active deals often cause agents to neglect consistent follow-up with early-stage leads, resulting in lower conversion rates and leaving potential commissions unclaimed.",
        statistic: "68% Without Follow-up"
      }
    ],
    benefits: [
      "24/7 lead capture ensures no inquiry goes unanswered, even while you're in meetings or showings",
      "Advanced lead qualification that pre-screens buyers for mortgage readiness and price range",
      "Intelligent property matching that suggests listings based on buyer criteria and preferences",
      "Automated scheduling system for showings that coordinates between all parties without phone tag",
      "Instant property information delivery via text/email when prospects inquire about specific listings",
      "Consistent follow-up sequences that nurture leads until they're ready to transact",
      "Full integration with popular CRM systems like Top Producer, Realvolve, and Follow Up Boss"
    ],
    comparisons: [
      { feature: "24/7 Availability", traditional: false, voiceAI: true },
      { feature: "Simultaneous Call Handling", traditional: false, voiceAI: true },
      { feature: "Automated Lead Qualification", traditional: false, voiceAI: true },
      { feature: "Instant Property Info", traditional: false, voiceAI: true },
      { feature: "Showing Coordination", traditional: true, voiceAI: true },
      { feature: "CRM Integration", traditional: true, voiceAI: true },
      { feature: "Complex Negotiation", traditional: true, voiceAI: false }
    ],
    costs: {
      yearly: [
        { 
          title: "Admin Assistant",
          human: "$48,000",
          ai: "$6,000",
          icon: <DollarSign className="h-4 w-4" />
        },
        { 
          title: "Benefits & Taxes",
          human: "$14,400",
          ai: "$0",
          icon: <Users className="h-4 w-4" />
        },
        { 
          title: "Training",
          human: "$2,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Evening/Weekend Coverage",
          human: "$12,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Lead Opportunity Cost",
          human: "$36,000",
          ai: "$0",
          icon: <BarChart className="h-4 w-4" />
        }
      ],
      threeYear: {
        human: "$338,400",
        ai: "$18,000"
      },
      fiveYear: {
        human: "$564,000",
        ai: "$30,000"
      }
    },
    useCases: [
      {
        title: "Buyer Lead Qualification & Property Matching",
        description: "A potential buyer calls about a property they saw online, but it's not actually the best fit for their needs.",
        steps: [
          {
            type: "human" as const,
            text: "Hi, I'm interested in the house on 742 Maple Street that I saw on your website."
          },
          {
            type: "ai" as const,
            text: "I'd be happy to tell you more about our listing at 742 Maple Street. To make sure I provide you with the most relevant information, may I ask a few questions about what you're looking for in a home?"
          },
          {
            type: "human" as const,
            text: "Sure, we need at least 4 bedrooms and a finished basement. We have two kids and want good schools."
          },
          {
            type: "ai" as const,
            text: "Thank you for sharing that. The property on Maple Street has 3 bedrooms and an unfinished basement. However, we have 2 other listings that match your criteria better, including a 4-bedroom home in the award-winning Lincoln school district. Would you like information about these properties instead?"
          },
          {
            type: "human" as const,
            text: "Yes, that sounds much better for our needs."
          },
          {
            type: "ai" as const,
            text: "Great! I can send you details about these properties right away. Could I have your name and email address to send the listings?"
          },
          {
            type: "human" as const,
            text: "My name is Jennifer Williams, and my email is jennifer.williams@email.com."
          },
          {
            type: "ai" as const,
            text: "Perfect, Jennifer. I've sent the listings to your email. Would you like to schedule a time to view either of these properties with our agent?"
          }
        ],
        outcome: "Lead properly qualified and matched with appropriate listings rather than wasting time on an unsuitable property. The AI identified the buyer's true needs and redirected them to better options, increasing the chance of a successful transaction."
      },
      {
        title: "Seller Lead Capture After Hours",
        description: "A potential seller calls on Saturday evening when the real estate office is closed.",
        steps: [
          {
            type: "human" as const,
            text: "Hello, I'm thinking about selling my house and wanted to get an idea of what it might be worth in the current market."
          },
          {
            type: "ai" as const,
            text: "Thank you for reaching out about selling your property. I'd be happy to help you get that information. May I ask for your address so we can look up recent comparable sales in your neighborhood?"
          },
          {
            type: "human" as const,
            text: "I'm at 1578 Willow Drive in Oakwood Hills."
          },
          {
            type: "ai" as const,
            text: "Thank you. And may I ask what updates or renovations you've made to the property in the last 5 years? This helps us provide a more accurate estimate."
          },
          {
            type: "human" as const,
            text: "We've updated the kitchen with new appliances and countertops, and we replaced the roof last year."
          },
          {
            type: "ai" as const,
            text: "Those are significant improvements that can positively impact your home's value. Our lead listing agent, Sarah Johnson, specializes in the Oakwood Hills area and has sold 14 homes there in the past year. She can provide you with a detailed comparative market analysis. Would you prefer she contact you tomorrow, or would you like to schedule a specific time for her to call?"
          },
          {
            type: "human" as const,
            text: "Could she call me tomorrow afternoon? My number is 555-789-1234."
          },
          {
            type: "ai" as const,
            text: "Absolutely. I'll have Sarah call you tomorrow afternoon at 555-789-1234. In the meantime, I'll send you our free home seller's guide via email, which includes information about our marketing approach and tips for maximizing your home's value. Could you share your email address?"
          }
        ],
        outcome: "High-value seller lead captured outside business hours, with key information collected and immediate value provided to the prospect. The agent can follow up already knowing the property details and improvements, making the conversation more productive."
      }
    ],
    testimonial: {
      name: "Sarah Johnson",
      role: "Realtor",
      companyName: "Premium Properties",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80",
      quote: "My real estate business is booming since implementing SummitVoiceAI. It handles all initial inquiries, pre-qualifies buyers, and only sends me serious prospects. I've closed 11 additional transactions this year that I would have missed while in showings or meetings—that's over $92,000 in extra commission!",
      metrics: [
        { label: "Additional Transactions", value: "42%" },
        { label: "Lead Response Time", value: "<1 min" },
        { label: "Annual ROI", value: "1,540%" }
      ]
    },
    faqs: [
      {
        question: "How does the AI qualify potential buyers?",
        answer: "The AI asks a series of questions designed to determine the buyer's price range, mortgage pre-approval status, timeline for purchase, desired neighborhoods, and must-have features. It ranks leads based on readiness to transact, financial qualification, and alignment with your ideal client profile. For buyers who aren't yet pre-approved, the system can automatically direct them to preferred lenders or your mortgage process resources."
      },
      {
        question: "Can the AI assistant send property details and images to interested buyers?",
        answer: "Yes! When a prospect inquires about specific listings, the AI can instantly send property information, photos, virtual tours, neighborhood data, and school information via text or email. The system can also be configured to follow up automatically with similar listings that match the buyer's criteria, increasing engagement and showing opportunities."
      },
      {
        question: "How does the showing scheduling system work?",
        answer: "The AI integrates with your calendar and showing coordination tools to offer available time slots based on your schedule, seller preferences, and property availability. It can coordinate with current occupants or other listing agents for showing confirmation and automatically sends confirmation and reminder notifications to all parties, eliminating the back-and-forth communication typically required."
      },
      {
        question: "Can the system handle property-specific questions?",
        answer: "Absolutely. The AI is trained on your listing inventory and can answer questions about property features, dimensions, age, materials, utilities, taxes, HOA fees, and more. For questions it can't answer, it collects the prospect's information and specific question for you to follow up on while setting proper expectations about when they'll hear from you."
      },
      {
        question: "How does SummitVoiceAI integrate with my existing CRM system?",
        answer: "We offer direct integrations with popular real estate CRMs including Top Producer, Follow Up Boss, Wise Agent, Realvolve, kvCORE, and many others. The system automatically creates new contact records, logs all interactions, attaches call recordings and transcripts, and updates lead status based on conversation outcomes. For specialized CRMs, we offer Zapier integration or API access."
      },
      {
        question: "Can I customize the qualification process for different types of properties?",
        answer: "Yes, you can create different qualification workflows for various property types or price points. For example, luxury listings might have more stringent qualification criteria than starter homes. Investment properties can include questions about desired cap rate or cash flow, while primary residences focus more on lifestyle factors. The system adapts its conversation flow based on the property type and your preferences."
      },
      {
        question: "How does the AI handle sensitive fair housing compliance issues?",
        answer: "Our AI is programmed with a thorough understanding of fair housing laws and best practices. It avoids asking or answering questions that could violate fair housing regulations. The system focuses on objective property features and buyer requirements rather than demographic information, helping ensure your business remains fully compliant with all applicable fair housing regulations."
      }
    ]
  },
  'legal': {
    title: "<span className='text-gradient'>AI Voice Assistant</span> for <span className='text-white'>Legal Practices</span>: <span className='text-gradient'>Transform Client Intake</span>",
    subheading: "Capture leads 24/7, qualify potential clients, and schedule consultations while maximizing billable hours",
    icon: <Scale className="w-12 h-12" />,
    description: "Law firms and legal practices face unique challenges balancing client acquisition with billable time. SummitVoiceAI for Legal creates a seamless intake process that screens potential clients, schedules consultations, and collects case information—allowing attorneys to focus on high-value casework rather than administrative tasks.",
    metaTitle: "AI Voice Assistant for Legal Practices | Case Intake Automation | SummitVoiceAI",
    metaDescription: "SummitVoiceAI transforms legal practice management by automating client intake, qualifying potential cases, scheduling consultations, and collecting case information 24/7.",
    problems: [
      {
        title: "Billable Hour Dilemma",
        description: "Attorneys face constant tension between client development and billable work. Phone interruptions for initial inquiries cost the average attorney 2-3 billable hours daily—equating to $75,000+ in annual lost revenue.",
        statistic: "$75K Lost Revenue"
      },
      {
        title: "After-Hours Inquiry Loss",
        description: "Legal emergencies don't follow business hours. Criminal matters, injuries, and urgent business issues often arise evenings and weekends, when competitors with 24/7 intake capture these high-value cases.",
        statistic: "38% After-Hours Calls"
      },
      {
        title: "Inefficient Intake Screening",
        description: "Without proper pre-screening, attorneys waste valuable consultation time with cases outside their practice areas or clients who can't afford their services. These consultations rarely convert and drain profitability.",
        statistic: "62% Unqualified"
      },
      {
        title: "Inconsistent Consultation Prep",
        description: "Initial consultations often begin without comprehensive case information, making them less productive and requiring follow-up. This elongates the sales cycle and reduces conversion rates.",
        statistic: "41% Conversion Gap"
      },
      {
        title: "Receptionist Turnover",
        description: "Legal receptionists face high burnout from the emotional nature of crisis calls and repetitive inquiry handling. Annual turnover averages 33%, creating inconsistent client experiences and recurring training costs.",
        statistic: "33% Annual Turnover"
      }
    ],
    benefits: [
      "24/7 case intake that captures critical details and urgency levels regardless of when clients call",
      "Sophisticated case screening that qualifies potential clients based on practice areas, case value, and ability to pay",
      "Calendar integration that schedules consultation appointments without attorney involvement",
      "Comprehensive intake forms automatically collected before consultations",
      "Case urgency assessment that prioritizes time-sensitive legal matters",
      "Conflict checking questions that protect your ethical obligations",
      "Seamless integration with practice management systems like Clio, MyCase, and PracticePanther"
    ],
    comparisons: [
      { feature: "24/7 Availability", traditional: false, voiceAI: true },
      { feature: "Consistent Intake Process", traditional: false, voiceAI: true },
      { feature: "Multi-Call Handling", traditional: false, voiceAI: true },
      { feature: "Case Value Assessment", traditional: true, voiceAI: true },
      { feature: "Initial Conflict Checking", traditional: true, voiceAI: true },
      { feature: "Complex Legal Advice", traditional: true, voiceAI: false },
      { feature: "Emotional Support", traditional: true, voiceAI: false }
    ],
    costs: {
      yearly: [
        { 
          title: "Legal Receptionist",
          human: "$52,000",
          ai: "$6,000",
          icon: <DollarSign className="h-4 w-4" />
        },
        { 
          title: "Benefits & Taxes",
          human: "$15,600",
          ai: "$0",
          icon: <Users className="h-4 w-4" />
        },
        { 
          title: "Training",
          human: "$3,500",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Lost Billable Hours",
          human: "$75,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Turnover Costs",
          human: "$17,160",
          ai: "$0",
          icon: <BarChart className="h-4 w-4" />
        }
      ],
      threeYear: {
        human: "$489,780",
        ai: "$18,000"
      },
      fiveYear: {
        human: "$816,300",
        ai: "$30,000"
      }
    },
    useCases: [
      {
        title: "Personal Injury Case Intake",
        description: "A potential client calls regarding an auto accident injury case outside of business hours.",
        steps: [
          {
            type: "human" as const,
            text: "Hi, I was in a car accident yesterday and I think I need a lawyer. The other driver ran a red light and hit my car."
          },
          {
            type: "ai" as const,
            text: "I'm sorry to hear about your accident. First, are you safe and have you received medical attention for any injuries?"
          },
          {
            type: "human" as const,
            text: "Yes, I went to the emergency room yesterday. They said I have whiplash and a possible concussion."
          },
          {
            type: "ai" as const,
            text: "I'm glad you've been seen by a doctor. That's very important both for your health and for documenting your injuries. To help us understand if we can assist you, I need to gather some information. First, when and where did the accident occur?"
          },
          {
            type: "human" as const,
            text: "It happened yesterday around 5 PM at the intersection of Main Street and Oak Avenue."
          },
          {
            type: "ai" as const,
            text: "Thank you. Was a police report filed, and did you collect the other driver's insurance information?"
          },
          {
            type: "human" as const,
            text: "Yes to both. The police came and took statements, and I have the other driver's insurance details."
          },
          {
            type: "ai" as const,
            text: "That's excellent. Based on what you've shared, this appears to be a case our firm can help with. Our personal injury attorneys have extensive experience with similar cases and have recovered substantial compensation for clients in your situation. I can schedule a free consultation with attorney Jennifer Martinez, who specializes in auto accident cases. She has availability tomorrow at 10 AM or 2 PM. Would either time work for you?"
          }
        ],
        outcome: "High-value personal injury case captured after hours, with crucial statute of limitations clock already running. Initial case details collected and an urgent consultation scheduled, positioning the firm to sign a client who might otherwise have called competitors."
      },
      {
        title: "Business Formation Client Qualification",
        description: "An entrepreneur wants to form a new business entity but needs guidance on the appropriate structure.",
        steps: [
          {
            type: "human" as const,
            text: "I'm starting a new business and need help deciding whether to form an LLC or corporation."
          },
          {
            type: "ai" as const,
            text: "Congratulations on your new business venture. Our firm has helped hundreds of entrepreneurs establish the right legal structure. To better understand your needs, could you tell me a bit about the nature of your business?"
          },
          {
            type: "human" as const,
            text: "I'm launching a software development company that creates custom applications for healthcare providers."
          },
          {
            type: "ai" as const,
            text: "Thank you. A technology company in the healthcare space certainly has specific legal considerations. A few more questions will help us provide the best guidance: Do you plan to seek outside investors or venture capital funding in the next 1-2 years?"
          },
          {
            type: "human" as const,
            text: "Yes, we're planning to raise a seed round within the next year."
          },
          {
            type: "ai" as const,
            text: "And approximately what revenue do you expect in the first year, and how many employees or contractors do you anticipate hiring?"
          },
          {
            type: "human" as const,
            text: "We're projecting about $500,000 in revenue and will probably hire 5-7 developers as contractors initially."
          },
          {
            type: "ai" as const,
            text: "Based on your plans for outside investment, projected revenue, and hiring needs, you would benefit from our business formation package that includes entity selection, formation, initial governance documents, and contractor agreements. Attorney Michael Chen specializes in technology startups and can provide detailed guidance on the optimal structure for investor readiness. His consultation fee is $350, which is credited toward any formation services you select. Would you like to schedule a consultation with him this week?"
          }
        ],
        outcome: "Potential business client properly qualified and matched with the appropriate attorney specializing in their industry. Key qualifying information collected before the consultation, allowing the attorney to prepare specific recommendations tailored to the client's goals."
      }
    ],
    testimonial: {
      name: "James Wilson, Esq.",
      role: "Managing Partner",
      companyName: "Wilson Law Partners",
      image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "As a solo practitioner, I was overwhelmed with calls that interrupted my billable work. Now my AI assistant qualifies leads, schedules consultations, and collects client information, allowing me to focus entirely on actual legal work. My billable hours have increased by 24% and my client conversion rate has improved by 35%.",
      metrics: [
        { label: "Increase in Billable Hours", value: "24%" },
        { label: "Improvement in Conversion", value: "35%" },
        { label: "Annual ROI", value: "920%" }
      ]
    },
    faqs: [
      {
        question: "Is SummitVoiceAI compliant with attorney-client privilege requirements?",
        answer: "Absolutely. Our system is designed with attorney-client privilege considerations at its core. All communications are encrypted end-to-end, and we implement strict data segregation to maintain confidentiality. The AI is programmed to include appropriate privilege disclaimers at the beginning of conversations, and all data is handled in accordance with legal ethics requirements. We also provide BAA agreements when required."
      },
      {
        question: "How does the AI handle initial conflict checking?",
        answer: "The AI can perform preliminary conflict checking by collecting adverse party information and checking it against your firm's conflict database through our secure API integrations. The system can be configured to ask specific questions about opposing parties, related entities, and other potential conflicts based on your firm's practice areas. If a potential conflict is identified, the system can route the inquiry accordingly or provide appropriate disclaimers."
      },
      {
        question: "Can the system handle different practice areas with specialized intake questions?",
        answer: "Yes, the system supports practice-specific intake workflows. For example, personal injury intakes collect incident details, insurance information, and injury documentation. Estate planning intakes focus on family structure and asset questions. Business formation intakes gather entity type preferences and growth projections. You can customize intake questions for each practice area to ensure you collect exactly the information your attorneys need."
      },
      {
        question: "How does SummitVoiceAI integrate with our practice management software?",
        answer: "We offer direct integrations with popular legal practice management systems including Clio, MyCase, PracticePanther, Smokeball, Rocket Matter, and others. The AI can create new contacts, schedule consultations, attach intake forms, and log communication records directly in your existing system. For specialized or proprietary systems, we provide API access or custom integration development."
      },
      {
        question: "Can we customize the AI to use our firm's specific consultation fee structure?",
        answer: "Absolutely. The system can be programmed with your exact fee structure, including consultation fees, retainer requirements, contingency percentages, and fee schedules for different practice areas or attorneys. The AI can communicate these fees appropriately during the intake process, set proper client expectations, and even facilitate initial fee payments through secure payment processing integrations."
      },
      {
        question: "How does the system handle legal emergencies that require immediate attention?",
        answer: "For urgent legal matters, such as criminal arrests, emergency restraining orders, or time-sensitive filings, the AI implements your custom escalation protocols. This might include immediate text notifications to on-call attorneys, prioritized call routing, or urgent case flagging. You define exactly what constitutes an emergency in your practice areas and how you want those situations handled."
      },
      {
        question: "Is the system trained to avoid giving unauthorized legal advice?",
        answer: "Yes, the AI is specifically programmed to avoid providing anything that could be construed as legal advice. It clearly communicates its role in intake and scheduling rather than legal guidance. The system is trained to recognize and deflect questions seeking legal opinions, providing appropriate disclaimers and focusing on connecting potential clients with your attorneys rather than attempting to address legal questions directly."
      }
    ]
  },
  'automotive': {
    title: "<span className='text-gradient'>AI Voice Assistant</span> for <span className='text-white'>Automotive</span>: <span className='text-gradient'>Transform Service Scheduling</span>",
    subheading: "Capture service requests 24/7, schedule appointments efficiently, and boost customer satisfaction",
    icon: <Car className="w-12 h-12" />,
    description: "Dealerships and automotive service centers struggle with phone bottlenecks, missed calls, and inefficient scheduling. SummitVoiceAI for Automotive creates a seamless service scheduling experience that handles appointment bookings, recalls, service inquiries, and parts availability—improving customer satisfaction while maximizing service bay utilization.",
    metaTitle: "AI Voice Assistant for Automotive | Service Scheduling Automation | SummitVoiceAI",
    metaDescription: "SummitVoiceAI transforms automotive service departments by automating appointment scheduling, handling vehicle inquiries, and providing 24/7 customer support for dealerships and repair shops.",
    problems: [
      {
        title: "Service Department Call Bottlenecks",
        description: "Service advisors juggle phone calls while helping in-person customers, creating frustrating wait times and missed calls. During peak hours, hold times average 8+ minutes, driving customers to competitors.",
        statistic: "32% Call Abandonment"
      },
      {
        title: "Inefficient Bay Utilization",
        description: "Poor scheduling practices lead to underutilized service bays during some periods while creating overwhelming backlogs during others. This scheduling inefficiency costs the average dealership over $150,000 annually in lost revenue.",
        statistic: "$150K+ Lost Revenue"
      },
      {
        title: "After-Hours Service Inquiries",
        description: "Many customers can only call about service needs after work hours when service departments are closed. Without 24/7 scheduling options, these customers often seek service elsewhere or delay maintenance.",
        statistic: "28% After-Hours Calls"
      },
      {
        title: "Inconsistent Service Check-In",
        description: "Manual service check-in processes result in inconsistent information gathering, missing customer concerns, and inadequate service history review. This leads to incomplete repairs and customer dissatisfaction.",
        statistic: "23% Incomplete Repairs"
      },
      {
        title: "Poor Customer Communication",
        description: "Service advisors struggle to provide timely updates on vehicle status, resulting in anxious customers making repeated follow-up calls that further congest phone lines and distract from service operations.",
        statistic: "41% Follow-up Calls"
      }
    ],
    benefits: [
      "24/7 service scheduling that optimizes bay utilization based on service type, technician skills, and parts availability",
      "Comprehensive pre-visit information collection that improves service preparation and first-time fix rates",
      "Automated appointment confirmation and reminder system that reduces no-shows by up to 30%",
      "Vehicle service history access that provides customers with maintenance records and recommendations",
      "Recall notification and scheduling services that improve completion rates and customer safety",
      "Seamless integration with DMS systems like CDK, Reynolds & Reynolds, and Dealertrack",
      "Automated status updates that keep customers informed throughout the service process"
    ],
    comparisons: [
      { feature: "24/7 Scheduling", traditional: false, voiceAI: true },
      { feature: "Zero Hold Times", traditional: false, voiceAI: true },
      { feature: "Multi-Call Handling", traditional: false, voiceAI: true },
      { feature: "Pre-Visit Information", traditional: false, voiceAI: true },
      { feature: "Consistent Experience", traditional: false, voiceAI: true },
      { feature: "Complex Diagnosis", traditional: true, voiceAI: false },
      { feature: "Parts Cross-Reference", traditional: true, voiceAI: true }
    ],
    costs: {
      yearly: [
        { 
          title: "Service Advisor",
          human: "$55,000",
          ai: "$6,000",
          icon: <DollarSign className="h-4 w-4" />
        },
        { 
          title: "Benefits & Taxes",
          human: "$16,500",
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
          title: "Lost Service Revenue",
          human: "$150,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Turnover Costs",
          human: "$11,000",
          ai: "$0",
          icon: <BarChart className="h-4 w-4" />
        }
      ],
      threeYear: {
        human: "$706,500",
        ai: "$18,000"
      },
      fiveYear: {
        human: "$1,177,500",
        ai: "$30,000"
      }
    },
    useCases: [
      {
        title: "Routine Maintenance Scheduling",
        description: "A customer needs to schedule their 30,000-mile service during business hours but faces long hold times.",
        steps: [
          {
            type: "human" as const,
            text: "Hi, I need to schedule my 30,000 mile service for my Toyota Camry."
          },
          {
            type: "ai" as const,
            text: "I'd be happy to help you schedule your 30,000 mile service. May I have your name and phone number to locate your vehicle information?"
          },
          {
            type: "human" as const,
            text: "This is Michael Brown, 555-123-7890."
          },
          {
            type: "ai" as const,
            text: "Thank you, Mr. Brown. I see you have a 2020 Toyota Camry with us. For the 30,000 mile service, our factory-recommended maintenance includes oil and filter change, tire rotation, brake inspection, and multiple-point inspection. This typically takes about 2 hours. Would you like to add any additional services like cabin air filter replacement or brake fluid flush?"
          },
          {
            type: "human" as const,
            text: "Yes, let's do the cabin air filter too. How much will all this cost?"
          },
          {
            type: "ai" as const,
            text: "The 30,000 mile service package for your Camry is $189.95, and the cabin air filter replacement is an additional $59.95. Your total estimated cost would be $249.90 plus tax. We have appointments available this Thursday at 10 AM, Friday at 2 PM, or next Monday at 9 AM. Which would you prefer?"
          },
          {
            type: "human" as const,
            text: "Thursday at 10 AM works best for me."
          },
          {
            type: "ai" as const,
            text: "Perfect. I've scheduled your 30,000 mile service with cabin air filter replacement for this Thursday at 10 AM. Would you like our courtesy shuttle service or would you prefer to wait in our customer lounge?"
          }
        ],
        outcome: "Service appointment efficiently scheduled with additional service upsell, proper time allocation, and transportation needs identified. Customer avoids hold times while service advisor focuses on in-person customers."
      },
      {
        title: "After-Hours Emergency Repair",
        description: "A customer experiences a check engine light and strange noise after the service department has closed.",
        steps: [
          {
            type: "human" as const,
            text: "My check engine light just came on and my car is making a weird rattling sound. I need to get it looked at right away."
          },
          {
            type: "ai" as const,
            text: "I understand this is concerning. I can help you schedule a diagnostic appointment. First, is your vehicle still drivable, or do you need roadside assistance?"
          },
          {
            type: "human" as const,
            text: "It's drivable but making strange noises when accelerating."
          },
          {
            type: "ai" as const,
            text: "If you're experiencing unusual noises with a check engine light, it's best to limit driving until a technician can examine it. We have an emergency diagnostic slot available tomorrow morning at 8 AM when our service department opens. Would you like me to reserve this for you?"
          },
          {
            type: "human" as const,
            text: "Yes, please. I need this fixed as soon as possible."
          },
          {
            type: "ai" as const,
            text: "I've reserved our first emergency diagnostic slot for tomorrow at 8 AM. May I have your name, phone number, and the vehicle information so I can create your appointment?"
          },
          {
            type: "human" as const,
            text: "Jennifer Garcia, 555-987-6543. It's a 2019 Honda Accord."
          },
          {
            type: "ai" as const,
            text: "Thank you, Ms. Garcia. I've scheduled your 2019 Honda Accord for an emergency diagnostic tomorrow at 8 AM. Our diagnostic fee is $129, which will be applied to any repairs you authorize. If you arrive a few minutes early, that will help us get started promptly. You'll receive a text confirmation with instructions for our early drop-off procedure. Is there anything else you need assistance with tonight?"
          }
        ],
        outcome: "Urgent vehicle issue captured after hours and scheduled for the first available emergency slot, preventing the customer from seeking service elsewhere. Clear expectations set regarding diagnostic fees and procedures."
      }
    ],
    testimonial: {
      name: "Robert Turner",
      role: "Service Manager",
      companyName: "Precision Auto Care",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "Our dealership service department has increased appointment bookings by 35% and virtually eliminated no-shows with SummitVoiceAI. Our service advisors now spend quality time with customers instead of juggling phones, and our CSI scores have improved by 23 points since implementation.",
      metrics: [
        { label: "Increase in Appointments", value: "35%" },
        { label: "Reduction in No-Shows", value: "28%" },
        { label: "CSI Score Improvement", value: "+23 pts" }
      ]
    },
    faqs: [
      {
        question: "How does the AI handle technical vehicle questions?",
        answer: "The AI is trained on comprehensive automotive service information including maintenance schedules, common diagnostic symptoms, and recall information for major brands. It can answer general questions about maintenance intervals, service procedures, and estimated repair times. For highly technical questions requiring diagnostic expertise, the system collects vehicle symptoms in a structured format and creates detailed notes for your technicians to review."
      },
      {
        question: "Can SummitVoiceAI integrate with our DMS system?",
        answer: "Yes, we offer direct integrations with major Dealer Management Systems including CDK Global, Reynolds & Reynolds, Dealertrack, PBS, Auto/Mate, and others. These integrations allow the AI to access customer records, vehicle service history, parts inventory, technician availability, and open service bays for accurate scheduling. All interactions are automatically logged in your DMS for seamless record-keeping."
      },
      {
        question: "How does the system optimize service bay utilization?",
        answer: "Our intelligent scheduling algorithm considers multiple factors: service type and duration, technician specialization and certification, parts availability, and customer preference. It analyzes historical service time data to improve duration estimates and distributes appointment types throughout the day to maximize efficiency. The system continuously learns from actual service times to refine its scheduling accuracy."
      },
      {
        question: "Can the AI help with recall campaigns?",
        answer: "Absolutely. The system can proactively identify vehicles with open recalls during any customer interaction, notify owners about safety recalls, and help schedule recall service. For dedicated recall campaigns, the AI can conduct outbound calls to affected customers, explain the recall, and schedule service visits, dramatically improving your recall completion rates and customer safety."
      },
      {
        question: "How does the system handle warranty vs. non-warranty work?",
        answer: "The AI can distinguish between warranty and non-warranty service requests based on vehicle age, mileage, and service type. For warranty work, it collects additional documentation requirements and sets appropriate expectations regarding manufacturer coverage. For non-warranty work, the system can provide transparent pricing estimates and facilitate service contract verification when applicable."
      },
      {
        question: "Can SummitVoiceAI provide service status updates to customers?",
        answer: "Yes, the system can provide automated service status updates via the customer's preferred communication channel (text, email, or phone). When integrated with your DMS, it can inform customers when their vehicle enters service, when diagnosis is complete (including findings), when parts are ordered, and when the vehicle is ready for pickup. This proactive communication dramatically reduces inbound status inquiry calls."
      },
      {
        question: "How does the system handle parts availability questions?",
        answer: "When integrated with your parts inventory system, the AI can check real-time parts availability for common maintenance items and accessories. For special order parts, it can provide estimated arrival times based on your vendor relationships and parts ordering schedules. The system can also facilitate parts reservations for upcoming service appointments to ensure availability."
      }
    ]
  },
  'professional-services': {
    title: "<span className='text-gradient'>AI Voice Assistant</span> for <span className='text-white'>Professional Services</span>: <span className='text-gradient'>Streamline Client Acquisition</span>",
    subheading: "Capture inquiries 24/7, qualify prospects, and schedule consultations without interrupting billable work",
    icon: <Calculator className="w-12 h-12" />,
    description: "Financial advisors, CPAs, consultants, and other professional service providers face the constant challenge of balancing client acquisition with revenue-generating work. SummitVoiceAI for Professional Services handles prospect inquiries, schedules consultations, and collects intake information—allowing professionals to focus on delivering high-value services rather than administrative tasks.",
    metaTitle: "AI Voice Assistant for Professional Services | Client Acquisition | SummitVoiceAI",
    metaDescription: "SummitVoiceAI streamlines client acquisition for financial advisors, CPAs, and consultants by automating prospect qualification, scheduling consultations, and collecting intake information 24/7.",
    problems: [
      {
        title: "Productivity Interruptions",
        description: "Professional service providers lose 2-3 hours of productive time daily handling phone inquiries from prospects that often don't match their ideal client profile. These constant interruptions damage focus on billable or high-value activities.",
        statistic: "38% Day Interrupted"
      },
      {
        title: "Seasonal Capacity Challenges",
        description: "Many professional service firms face extreme seasonal demand variation (e.g., tax season for accountants, year-end for financial advisors). Phone systems become overwhelmed, creating poor first impressions with potential clients.",
        statistic: "300% Call Volume Spike"
      },
      {
        title: "Ineffective Lead Qualification",
        description: "Without consistent screening procedures, professionals waste valuable consultation time with prospects who don't meet minimum revenue requirements or fit their specialized expertise areas.",
        statistic: "58% Unqualified Leads"
      },
      {
        title: "High Client Acquisition Costs",
        description: "The fully-loaded cost of acquiring a new client—including marketing, administrative time, and consultation hours—has risen dramatically, making efficient lead conversion essential for profitability.",
        statistic: "$1,200 Per Client"
      },
      {
        title: "Information Collection Gaps",
        description: "Incomplete pre-meeting information gathering leads to unproductive initial consultations, requiring additional meetings and extending the sales cycle unnecessarily.",
        statistic: "2.8 Meetings to Close"
      }
    ],
    benefits: [
      "24/7 inquiry handling that captures prospect information even during your busiest seasons",
      "Sophisticated qualification that identifies ideal clients based on your specific criteria",
      "Intelligent scheduling that respects your productivity patterns and focus time",
      "Comprehensive intake forms automatically collected before initial consultations",
      "Service matching that aligns prospect needs with your specific expertise areas",
      "Professional impression that enhances your brand and service positioning",
      "Seamless integration with CRM systems like Salesforce, HubSpot, and industry-specific platforms"
    ],
    comparisons: [
      { feature: "24/7 Availability", traditional: false, voiceAI: true },
      { feature: "Consistent Qualification", traditional: false, voiceAI: true },
      { feature: "Multi-Call Handling", traditional: false, voiceAI: true },
      { feature: "Calendar Protection", traditional: false, voiceAI: true },
      { feature: "Pre-Meeting Information", traditional: false, voiceAI: true },
      { feature: "Complex Advice", traditional: true, voiceAI: false },
      { feature: "Relationship Building", traditional: true, voiceAI: false }
    ],
    costs: {
      yearly: [
        { 
          title: "Administrative Assistant",
          human: "$48,000",
          ai: "$6,000",
          icon: <DollarSign className="h-4 w-4" />
        },
        { 
          title: "Benefits & Taxes",
          human: "$14,400",
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
          title: "Lost Productive Time",
          human: "$96,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Turnover Costs",
          human: "$9,600",
          ai: "$0",
          icon: <BarChart className="h-4 w-4" />
        }
      ],
      threeYear: {
        human: "$513,000",
        ai: "$18,000"
      },
      fiveYear: {
        human: "$855,000",
        ai: "$30,000"
      }
    },
    useCases: [
      {
        title: "Financial Advisor Prospect Qualification",
        description: "A potential client inquires about financial advisory services but needs to be qualified against the firm's minimum asset requirements.",
        steps: [
          {
            type: "human" as const,
            text: "Hi, I'm looking for some help with retirement planning and investment management."
          },
          {
            type: "ai" as const,
            text: "Thank you for your interest in our financial advisory services. I'd be happy to help determine if we're the right fit for your needs. Our firm specializes in comprehensive financial planning and investment management for individuals approaching or in retirement. Could you share what specifically prompted you to look for financial guidance at this time?"
          },
          {
            type: "human" as const,
            text: "I'm about five years from retirement and want to make sure I'm on track. I've been managing my own investments but feel I need professional help now."
          },
          {
            type: "ai" as const,
            text: "That's a critical transition period, and professional guidance can certainly help optimize your strategy. To match you with the right advisor in our firm, we typically work with clients who have at least $500,000 in investable assets. Would you fall within this range?"
          },
          {
            type: "human" as const,
            text: "Yes, I have about $800,000 across various retirement accounts and some additional non-retirement investments."
          },
          {
            type: "ai" as const,
            text: "Excellent. Based on your situation, our Senior Advisor Thomas Williams, who specializes in retirement transition planning, would be an ideal match for your needs. He has helped many clients in similar situations optimize their retirement strategy. Would you prefer a virtual meeting or an in-person consultation at our office?"
          },
          {
            type: "human" as const,
            text: "I'd prefer in-person to start."
          },
          {
            type: "ai" as const,
            text: "Perfect. Thomas has availability next Tuesday at 10 AM or Thursday at 2 PM for in-person consultations. Before your meeting, it would be helpful to complete our pre-consultation questionnaire, which helps Thomas prepare a personalized discussion guide. Could I send this to your email?"
          }
        ],
        outcome: "High-value prospect properly qualified and matched with the appropriate advisor. Key qualifying information and preferences captured before the meeting, allowing the advisor to prepare specific recommendations tailored to the client's retirement timeline."
      },
      {
        title: "CPA Firm Tax Season Capacity Management",
        description: "During the busy tax season, a potential client calls about tax preparation services.",
        steps: [
          {
            type: "human" as const,
            text: "I need to find a new accountant to handle my taxes this year. My situation has gotten more complicated."
          },
          {
            type: "ai" as const,
            text: "Thank you for considering our firm for your tax preparation needs. To help us determine how we can best assist you, could you share what has changed in your tax situation?"
          },
          {
            type: "human" as const,
            text: "I started a small business last year as a consultant, and I also bought a rental property. I'm not sure how to handle all the deductions and depreciation."
          },
          {
            type: "ai" as const,
            text: "Congratulations on your new business and investment property. Those certainly do create new tax considerations. Our firm specializes in exactly these situations. To ensure you're matched with the right tax professional, could you give me a rough estimate of your business revenue and whether your consulting is a sole proprietorship, LLC, or corporation?"
          },
          {
            type: "human" as const,
            text: "It's an LLC with about $150,000 in revenue last year. The rental property was purchased in October."
          },
          {
            type: "ai" as const,
            text: "Thank you for that information. Based on your situation, you would work with one of our experienced business tax specialists. Given that we're in tax season, our next available new client appointments are on March 10th at 1 PM or March 13th at 9 AM. Would either of those work for you? I should mention that to meet the filing deadline, we recommend getting your information to us no later than March 15th."
          },
          {
            type: "human" as const,
            text: "The March 10th appointment works for me. What information should I bring?"
          },
          {
            type: "ai" as const,
            text: "Excellent. I've reserved March 10th at 1 PM for your appointment with Jenny Richards, our small business tax specialist. I'll email you our new client checklist that details all the documents to bring, including your previous year's return, business income and expenses, rental property closing documents, and any tax documents you've received. There's also a secure portal link where you can upload these documents in advance to make your appointment more productive. Would you like to receive text reminders about your appointment?"
          }
        ],
        outcome: "New tax client effectively scheduled during the busiest season while setting clear expectations about timing and documentation requirements. The firm maintains control over its calendar while still accommodating new business."
      }
    ],
    testimonial: {
      name: "Lisa Morgan",
      role: "Managing Partner",
      companyName: "Morgan Financial Advisors",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "Our financial advisory practice used to waste countless hours on unqualified prospect calls. Now SummitVoiceAI pre-screens all inquiries against our minimum asset requirements and schedules meetings only with qualified prospects. My calendar is protected for client work and high-value activities, and our client acquisition efficiency has improved by 42%.",
      metrics: [
        { label: "Increase in Qualified Leads", value: "36%" },
        { label: "Reduction in Admin Costs", value: "28%" },
        { label: "Annual ROI", value: "740%" }
      ]
    },
    faqs: [
      {
        question: "How does the AI qualify prospects based on our specific criteria?",
        answer: "The AI is fully customizable to your exact qualification criteria, whether that's minimum asset levels for financial advisors, revenue thresholds for business consultants, or complexity factors for CPAs. The system asks a tailored sequence of qualification questions designed to identify your ideal clients while gracefully handling prospects who don't meet your criteria. For those who qualify, it collects detailed information to prepare you for the consultation. For those who don't fit your practice, it can provide alternative resources or referrals."
      },
      {
        question: "Can SummitVoiceAI handle scheduling around my productivity patterns?",
        answer: "Absolutely. The system integrates with your calendar and respects your designated focus time, deep work blocks, and preferred meeting schedule. You can create rules like 'consultations only on Tuesday and Thursday afternoons' or 'no more than 3 prospect meetings per week' to protect your productivity. The AI offers only available times that conform to your rules while still accommodating high-value prospects efficiently."
      },
      {
        question: "How does the system handle confidentiality for sensitive financial or business information?",
        answer: "Client confidentiality is paramount in our design. All communications are encrypted end-to-end, and we implement strict data segregation and access controls. The system includes appropriate confidentiality disclaimers during conversations and collects only the information you specify as necessary for the qualification process. We comply with industry regulations including SEC, FINRA, and GLBA requirements for financial services, and offer BAA agreements for professionals subject to HIPAA regulations."
      },
      {
        question: "Can the AI help with seasonal capacity challenges like tax season?",
        answer: "Yes, the system excels at managing seasonal demand fluctuations. During peak periods, it can implement specialized scheduling protocols, dynamically adjust qualification criteria, provide accurate wait time estimates, and implement queue management for urgent requests. The AI can also assist with capacity planning by tracking inquiry volume patterns and helping you optimize staffing and availability during peak seasons."
      },
      {
        question: "How does SummitVoiceAI integrate with our CRM and other professional systems?",
        answer: "We offer direct integrations with popular CRM systems including Salesforce, HubSpot, Redtail, Wealthbox, Microsoft Dynamics, and practice-specific platforms like CCH Axcess and Karbon. The AI creates new prospect records, schedules appointments, attaches intake forms, and logs all interactions automatically. For specialized systems, we provide API access or custom integration development to ensure seamless data flow."
      },
      {
        question: "Can the system collect different information based on service types?",
        answer: "Yes, the intake process is fully customizable based on the specific service the prospect is interested in. For example, tax preparation inquiries collect tax document information, while estate planning inquiries focus on family structure and asset questions. Financial planning prospects are asked about goals and current investments, while business consulting prospects are queried about industry, size, and specific challenges. Each service type can have its own unique qualification and information collection workflow."
      },
      {
        question: "How does the AI handle situations where a prospect doesn't meet our minimum requirements?",
        answer: "The system handles non-qualified prospects with professionalism and tact. Based on your preferences, it can: 1) refer them to more appropriate providers you designate for different segments, 2) offer self-service resources like guides or webinars for smaller clients, 3) place them in a nurture program for prospects who may qualify in the future, or 4) explain your minimum requirements and alternative options. The approach is customized to maintain your brand reputation while focusing your time on ideal clients."
      }
    ]
  },
  'landscaping': {
    title: "<span className='text-gradient'>AI Voice Assistant</span> for <span className='text-white'>Landscaping & Outdoor Services</span>: <span className='text-gradient'>Never Miss a Service Opportunity</span>",
    subheading: "Capture inquiries 24/7, schedule estimates, and manage seasonal demand while you're on job sites",
    icon: <Scissors className="w-12 h-12" />,
    description: "Landscaping and outdoor service providers face unique challenges with weather dependence, seasonal demand patterns, and communication while working on job sites. SummitVoiceAI for Landscaping handles service inquiries, schedules estimates, manages weather rescheduling, and ensures no new business opportunity is missed while your team is focused on current projects.",
    metaTitle: "AI Voice Assistant for Landscaping & Outdoor Services | SummitVoiceAI",
    metaDescription: "SummitVoiceAI helps landscapers and outdoor service providers capture inquiries 24/7, schedule estimates, and manage seasonal demand fluctuations while maximizing crew productivity.",
    problems: [
      {
        title: "Missed Service Opportunities",
        description: "Landscapers and outdoor service providers often miss calls while operating equipment or focused on job sites. Each missed inquiry represents potential lost revenue, especially during peak seasonal demand periods.",
        statistic: "42% Missed Calls"
      },
      {
        title: "Seasonal Demand Bottlenecks",
        description: "Businesses face overwhelming call volumes during seasonal transitions (spring startup, fall cleanup) that exceed their capacity to respond promptly, resulting in potential customers moving to competitors.",
        statistic: "280% Spring Call Spike"
      },
      {
        title: "Weather Rescheduling Chaos",
        description: "Unpredictable weather events force rapid schedule changes that create communication bottlenecks, as staff struggles to contact all affected customers while reorganizing crew assignments.",
        statistic: "18 Hours/Month Rescheduling"
      },
      {
        title: "Inefficient Estimate Scheduling",
        description: "Unoptimized routing for estimates and consultations results in excessive drive time between appointments, reducing the number of potential new clients that can be seen weekly.",
        statistic: "40% Time Driving"
      },
      {
        title: "Inconsistent Service Scoping",
        description: "Without standardized information collection for different service types, crews often arrive at jobs with incomplete understanding of requirements, leading to project complications and customer dissatisfaction.",
        statistic: "31% Scope Changes"
      }
    ],
    benefits: [
      "24/7 inquiry handling that captures detailed service requirements even during your busiest seasons",
      "Intelligent estimate scheduling that groups appointments geographically to minimize drive time",
      "Automated weather monitoring and rescheduling communication that maintains customer satisfaction during disruptions",
      "Service-specific information collection that ensures crews arrive fully prepared with proper equipment",
      "Seasonal service enrollment and renewal management that maximizes recurring revenue",
      "Seamless integration with field service management software like LMN, Jobber, and HindSite",
      "Reputation management that solicits reviews after successful project completions"
    ],
    comparisons: [
      { feature: "24/7 Availability", traditional: false, voiceAI: true },
      { feature: "Geographic Scheduling", traditional: false, voiceAI: true },
      { feature: "Weather Rescheduling", traditional: false, voiceAI: true },
      { feature: "Service Area Verification", traditional: false, voiceAI: true },
      { feature: "Detailed Service Scoping", traditional: true, voiceAI: true },
      { feature: "Complex Design Consultation", traditional: true, voiceAI: false },
      { feature: "Plant Identification", traditional: true, voiceAI: false }
    ],
    costs: {
      yearly: [
        { 
          title: "Office Manager",
          human: "$42,000",
          ai: "$6,000",
          icon: <DollarSign className="h-4 w-4" />
        },
        { 
          title: "Benefits & Taxes",
          human: "$12,600",
          ai: "$0",
          icon: <Users className="h-4 w-4" />
        },
        { 
          title: "Training",
          human: "$2,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Lost Business Opportunities",
          human: "$58,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Inefficient Routing",
          human: "$24,000",
          ai: "$0",
          icon: <BarChart className="h-4 w-4" />
        }
      ],
      threeYear: {
        human: "$415,800",
        ai: "$18,000"
      },
      fiveYear: {
        human: "$693,000",
        ai: "$30,000"
      }
    },
    useCases: [
      {
        title: "New Service Estimate Scheduling",
        description: "A homeowner calls about comprehensive landscaping services for their new property while all crews and managers are on job sites.",
        steps: [
          {
            type: "human" as const,
            text: "Hi, we just bought a new home and need help with landscaping the entire yard. It's basically a blank slate right now."
          },
          {
            type: "ai" as const,
            text: "Congratulations on your new home! We'd be happy to help with your landscaping project. To make sure we schedule the right type of consultation, could you tell me a bit more about what you're envisioning? Are you looking for a complete design with installation, or mainly maintenance services?"
          },
          {
            type: "human" as const,
            text: "We need a full design and installation. We're thinking about an irrigation system, new lawn, trees, flower beds, and maybe a small patio area."
          },
          {
            type: "ai" as const,
            text: "That sounds like an exciting project. For comprehensive design and installation work like you're describing, we'll need to schedule an on-site consultation with one of our landscape designers. They'll discuss your vision, assess the property, and provide a detailed proposal. Before we check availability, could I confirm your address to verify you're within our service area?"
          },
          {
            type: "human" as const,
            text: "We're at 1534 Oakridge Lane in Greenville."
          },
          {
            type: "ai" as const,
            text: "Thank you. I've confirmed that your address is within our service area. Our landscape designer, Michael, has availability for on-site consultations this Thursday at 10 AM or Friday at 2 PM. These consultations typically take about 60-90 minutes. Would either of those times work for you?"
          },
          {
            type: "human" as const,
            text: "Friday at 2 PM would be perfect."
          },
          {
            type: "ai" as const,
            text: "Great! I've scheduled your landscape design consultation for Friday at 2 PM with Michael. To help him prepare for your consultation, could you share any specific design preferences or priority areas for your project? Also, do you have a target budget range for this project?"
          }
        ],
        outcome: "High-value design and installation opportunity captured without interrupting crews or managers on active job sites. Proper service type identified, address verified within service area, and consultation scheduled with geographic efficiency."
      },
      {
        title: "Weather-Related Rescheduling",
        description: "A forecasted severe storm requires rapid rescheduling of multiple lawn maintenance appointments.",
        steps: [
          {
            type: "ai" as const,
            text: "Hello, this is Green Horizons Landscaping calling about your scheduled lawn service for tomorrow, May 15th. I'm reaching out because the weather forecast shows severe thunderstorms tomorrow afternoon, which would prevent us from completing your service as planned. Would you prefer to reschedule for Thursday, May 16th, or Monday, May 19th instead?"
          },
          {
            type: "human" as const,
            text: "Thursday would be better for me. What time will you be coming?"
          },
          {
            type: "ai" as const,
            text: "Thank you for your flexibility. I've rescheduled your lawn service for Thursday, May 16th. Our crew is expected to arrive between 1:00 PM and 3:00 PM. You don't need to be home for the service, but please ensure gates are unlocked and pets are secured. Would you like to receive a text notification when the crew is on their way?"
          },
          {
            type: "human" as const,
            text: "Yes, a text would be helpful. Also, could you ask them to pay special attention to the edges along the driveway? They were missed last time."
          },
          {
            type: "ai" as const,
            text: "I've noted your request about the driveway edges and added it to the service notes for Thursday's visit. Our crew will make sure to give those areas special attention. You'll receive a text notification when they're on their way. Is there anything else you need regarding this rescheduling?"
          },
          {
            type: "human" as const,
            text: "No, that's all. Thanks for the heads-up about the weather."
          },
          {
            type: "ai" as const,
            text: "You're welcome. We appreciate your understanding about the weather-related change. Your updated service confirmation has been sent to your email. If the forecast changes or if you need anything else before Thursday, please don't hesitate to call us back. Have a great day!"
          }
        ],
        outcome: "Weather disruption handled proactively with minimal customer inconvenience. Client preferences captured and service notes updated to address previous concerns, turning a potential negative experience into a positive customer service interaction."
      }
    ],
    testimonial: {
      name: "Jason Miller",
      role: "Owner",
      companyName: "Green Horizons Landscaping",
      image: "https://images.unsplash.com/photo-1578774296842-c45e472b3028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "During spring rush, we used to miss dozens of calls while crews were on job sites. With SummitVoiceAI, we've captured 100% of incoming inquiries, increased our estimate conversion rate by 34%, and grown our maintenance contract business by over $195,000 this year alone. The system paid for itself in the first month.",
      metrics: [
        { label: "Increase in New Clients", value: "46%" },
        { label: "Revenue Growth", value: "$195K" },
        { label: "Time Saved Weekly", value: "22 hrs" }
      ]
    },
    faqs: [
      {
        question: "How does the AI handle different types of landscaping services?",
        answer: "The system is configured with customized conversation flows for different service categories including maintenance (mowing, trimming, cleanup), installations (plants, trees, sod), hardscaping (patios, walkways, retaining walls), irrigation, design services, and specialty services like tree removal. Each flow collects the specific information needed for that service type, ensuring accurate estimates and proper crew preparation. The AI can even handle complex combinations of services for comprehensive projects."
      },
      {
        question: "Can SummitVoiceAI verify if an address is within our service area?",
        answer: "Absolutely. The system integrates with mapping services to verify addresses against your defined service boundaries. You can set up different service areas for different types of work (e.g., maintenance within 15 miles, installations within 25 miles), and the AI will automatically check each inquiry against these parameters. For addresses outside your service area, the system can provide a courteous explanation and alternative options if you have partner companies you refer to."
      },
      {
        question: "How does the weather rescheduling system work?",
        answer: "Our weather monitoring integration continuously checks forecasts for your service area. When adverse conditions are predicted that would affect scheduled work, the system proactively reaches out to affected customers via their preferred communication method (call, text, email) with rescheduling options. It manages all customer responses, updates your scheduling system, and reorganizes crew assignments to optimize productivity during weather disruptions."
      },
      {
        question: "Can the AI handle seasonal service enrollment and renewals?",
        answer: "Yes, the system excels at seasonal transitions and contract renewals. It can conduct outbound campaigns for spring cleanup, fall services, snow removal contracts, or other seasonal offerings. For existing clients, it handles renewal conversations, service adjustments, and upsell opportunities. The system can also manage early bird discounts, tiered pricing, or other promotional strategies for seasonal service enrollments."
      },
      {
        question: "How does SummitVoiceAI integrate with field service management software?",
        answer: "We offer direct integrations with popular field service platforms including LMN, Jobber, ServiceTitan, HindSite, Real Green, and others. These integrations allow the AI to access customer records, create new leads, schedule estimates and services, route notifications to the right team members, and update job statuses. All customer interactions are automatically logged in your system for seamless record-keeping and follow-up."
      },
      {
        question: "Can the system handle plant-specific questions or landscaping design advice?",
        answer: "The AI can provide basic information about common plants, trees, and landscape features based on a knowledge base you provide. For technical questions requiring horticultural expertise or design advice, the system collects the customer's specific questions and requirements, then routes these to your appropriate specialist. The focus is on gathering quality information to prepare your experts rather than attempting to replace their specialized knowledge."
      },
      {
        question: "How does the estimate scheduling optimize for geographic efficiency?",
        answer: "Our intelligent scheduling algorithm groups consultation appointments by geographic zones on specific days, dramatically reducing travel time between estimates. You can customize geographic zones, available time slots for each zone, and buffer times between appointments. The system considers appointment types, estimated consultation duration, and even typical traffic patterns to create the most efficient routing possible for your sales team."
      }
    ]
  },
  'customer-service': {
    title: "<span className='text-gradient'>AI Voice Assistant</span> for <span className='text-white'>Call Centers</span>: <span className='text-gradient'>Transform Customer Experience</span>",
    subheading: "Handle routine inquiries, reduce hold times, and support human agents during volume spikes",
    icon: <Headphones className="w-12 h-12" />,
    description: "Call centers struggle with unpredictable volume spikes, high agent turnover, and balancing quality with efficiency. SummitVoiceAI for Call Centers creates a hybrid model where AI handles routine inquiries and data collection while seamlessly escalating complex situations to your human agents—improving customer experience, reducing costs, and maintaining service quality.",
    metaTitle: "AI Voice Assistant for Call Centers | Customer Service Automation | SummitVoiceAI",
    metaDescription: "SummitVoiceAI transforms call center operations by automating routine inquiries, reducing hold times, supporting human agents during volume spikes, and improving customer satisfaction.",
    problems: [
      {
        title: "Unpredictable Call Volume Spikes",
        description: "Call centers face sudden volume surges from marketing campaigns, product issues, or external events. These spikes lead to long hold times, abandoned calls, and customer frustration that damages brand reputation.",
        statistic: "24% Abandonment Rate"
      },
      {
        title: "High Agent Turnover",
        description: "Call center annual turnover averages 30-45%, creating constant recruitment and training costs. New agents have lower productivity and higher error rates, further impacting customer experience.",
        statistic: "38% Annual Turnover"
      },
      {
        title: "Routine Inquiry Inefficiency",
        description: "Up to 70% of call center volume consists of repetitive questions that could be automated (order status, account information, basic troubleshooting). These consume valuable agent time that could be applied to complex issues.",
        statistic: "70% Routine Inquiries"
      },
      {
        title: "Inconsistent Customer Experience",
        description: "Quality varies widely between agents and during different volume periods. Customers receive different answers to the same questions, creating confusion and additional follow-up calls.",
        statistic: "42% Quality Variation"
      },
      {
        title: "Rising Labor Costs",
        description: "The fully-loaded cost per call center agent continues to rise with wage pressure, benefits, infrastructure, and management overhead. This challenges traditional staffing models, especially for 24/7 coverage.",
        statistic: "$65K Per Agent Annually"
      }
    ],
    benefits: [
      "24/7 consistent handling of routine inquiries with zero hold time",
      "Intelligent call deflection that resolves simple issues without agent involvement",
      "Dynamic scaling during volume spikes without staffing changes",
      "Comprehensive pre-agent information collection that improves first call resolution",
      "Multilingual support capabilities across dozens of languages",
      "Consistent compliance with required disclosures and procedures",
      "Detailed analytics on inquiry types, resolution rates, and escalation reasons"
    ],
    comparisons: [
      { feature: "Zero Hold Times", traditional: false, voiceAI: true },
      { feature: "Instant Scaling", traditional: false, voiceAI: true },
      { feature: "24/7/365 Availability", traditional: false, voiceAI: true },
      { feature: "Consistent Quality", traditional: false, voiceAI: true },
      { feature: "Multi-Language Support", traditional: false, voiceAI: true },
      { feature: "Complex Problem Solving", traditional: true, voiceAI: false },
      { feature: "Emotional Intelligence", traditional: true, voiceAI: false }
    ],
    costs: {
      yearly: [
        { 
          title: "Agent Salaries (10)",
          human: "$450,000",
          ai: "$60,000",
          icon: <DollarSign className="h-4 w-4" />
        },
        { 
          title: "Benefits & Taxes",
          human: "$135,000",
          ai: "$0",
          icon: <Users className="h-4 w-4" />
        },
        { 
          title: "Training & Quality",
          human: "$65,000",
          ai: "$0",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Management Overhead",
          human: "$95,000",
          ai: "$12,000",
          icon: <Clock className="h-4 w-4" />
        },
        { 
          title: "Turnover Costs",
          human: "$171,000",
          ai: "$0",
          icon: <BarChart className="h-4 w-4" />
        }
      ],
      threeYear: {
        human: "$2,748,000",
        ai: "$216,000"
      },
      fiveYear: {
        human: "$4,580,000",
        ai: "$360,000"
      }
    },
    useCases: [
      {
        title: "Order Status Inquiry Resolution",
        description: "A customer calls to check on the status of their recent order, a high-volume routine inquiry type.",
        steps: [
          {
            type: "human" as const,
            text: "Hi, I placed an order three days ago and wanted to check on when it will be delivered."
          },
          {
            type: "ai" as const,
            text: "I'd be happy to help you check your order status. Could you provide either your order number or the email address used to place the order?"
          },
          {
            type: "human" as const,
            text: "My email is customer@example.com."
          },
          {
            type: "ai" as const,
            text: "Thank you. I've found your recent order #RT78954 for the Ultra Premium Wireless Headphones placed on June 12th. Your order has been shipped via UPS Ground and is currently in transit. The tracking information shows an expected delivery date of June 16th. Would you like me to send this tracking information to your email or phone?"
          },
          {
            type: "human" as const,
            text: "Yes, please text it to me at 555-123-4567."
          },
          {
            type: "ai" as const,
            text: "I've sent the tracking information to 555-123-4567. You should receive it momentarily. The text includes a link to monitor your package's journey in real-time. Is there anything else you needed help with regarding your order?"
          },
          {
            type: "human" as const,
            text: "That's all I needed. Thanks for the help!"
          },
          {
            type: "ai" as const,
            text: "You're welcome! We appreciate your business. If you have any other questions once your headphones arrive, please don't hesitate to contact us again. Have a wonderful day!"
          }
        ],
        outcome: "Routine inquiry handled completely by AI without agent involvement, providing instant resolution without hold time. The customer receives the exact information needed along with proactive delivery of tracking details to their preferred channel."
      },
      {
        title: "Technical Support with Agent Escalation",
        description: "A customer experiences an issue with their product that begins with troubleshooting but requires escalation to a specialist.",
        steps: [
          {
            type: "human" as const,
            text: "My new smart thermostat keeps disconnecting from WiFi every few hours."
          },
          {
            type: "ai" as const,
            text: "I'm sorry to hear you're experiencing connection issues with your smart thermostat. I can help troubleshoot this with you. First, could you tell me which model of our smart thermostat you have?"
          },
          {
            type: "human" as const,
            text: "It's the EcoTemp TX-550 that I installed last week."
          },
          {
            type: "ai" as const,
            text: "Thank you. WiFi disconnection on the TX-550 is often related to signal strength or router compatibility. Let's try a few quick troubleshooting steps. First, have you tried power cycling the thermostat by turning it off for 30 seconds and then back on?"
          },
          {
            type: "human" as const,
            text: "Yes, I've tried that several times. It reconnects but then drops again after a few hours."
          },
          {
            type: "ai" as const,
            text: "I see. Let's check your WiFi signal strength. How far is the thermostat from your wireless router, and are there any walls or large objects between them?"
          },
          {
            type: "human" as const,
            text: "The router is about 15 feet away with just one wall between them. All my other devices connect fine in that location."
          },
          {
            type: "ai" as const,
            text: "Thank you for that information. Based on what you've described, this sounds like it could be a firmware issue or possibly a hardware defect. I'd like to connect you with our technical specialist who can perform advanced diagnostics and resolve this issue for you. The current wait time for a specialist is approximately 2 minutes. While you wait, could you please have the thermostat's serial number ready? It's located on the back of the device or on the packaging."
          }
        ],
        outcome: "Initial troubleshooting handled by AI, collecting vital diagnostic information before a necessary escalation to a human agent. The customer avoids repeating information, and the specialist receives complete context for efficient resolution."
      }
    ],
    testimonial: {
      name: "Marcus Johnson",
      role: "Customer Experience Director",
      companyName: "Global Connect Services",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "Implementing SummitVoiceAI allowed us to handle a 45% increase in call volume without adding staff. Our average handle time decreased by 35%, customer satisfaction scores improved by 24 points, and we reduced our cost per contact by 42%. Most importantly, our human agents now focus on complex issues where they add the most value.",
      metrics: [
        { label: "Reduction in Cost Per Contact", value: "42%" },
        { label: "Improvement in CSAT", value: "+24 pts" },
        { label: "Decrease in Handle Time", value: "35%" }
      ]
    },
    faqs: [
      {
        question: "How does the AI know when to handle an inquiry versus escalating to a human agent?",
        answer: "The system uses a sophisticated decision engine with multiple factors: 1) Intent recognition identifies the customer's specific need, 2) Complexity assessment evaluates whether the issue falls within AI capabilities, 3) Emotional analysis detects customer frustration or sensitivity requiring human empathy, and 4) Customer preference honors requests to speak with a human. You configure which inquiry types are AI-eligible versus always-escalate, and the system continuously learns from successful and unsuccessful interactions."
      },
      {
        question: "Can SummitVoiceAI integrate with our existing call center infrastructure?",
        answer: "Yes, we offer flexible integration options with all major call center platforms including Genesys, NICE inContact, Five9, Talkdesk, Avaya, and others. The system can be deployed as a front-end solution that hands off to your existing IVR or agent desktop, or as a comprehensive replacement for certain call flows. We also integrate with CRM systems like Salesforce, Zendesk, and ServiceNow to maintain a unified customer record across all interactions."
      },
      {
        question: "How does the agent handoff work when escalation is needed?",
        answer: "When escalation is required, the system performs a warm transfer to the appropriate agent based on your skill-based routing rules. The agent receives a complete transcript of the conversation, all collected customer information, the specific reason for escalation, and any relevant customer history from integrated systems. This eliminates the frustrating customer experience of repeating information and provides agents with full context for efficient resolution."
      },
      {
        question: "Can the system handle multiple languages for international customer support?",
        answer: "Absolutely. The AI supports over 30 languages and can automatically detect the caller's language and respond accordingly. This enables truly global 24/7 support without maintaining multilingual staff around the clock. For each supported language, you can customize the voice, terminology, and cultural nuances to ensure an authentic, localized experience that respects regional differences in communication styles."
      },
      {
        question: "How does SummitVoiceAI maintain compliance with required disclosures and procedures?",
        answer: "The system is programmed to consistently deliver required disclosures, consent language, and compliance statements based on your industry regulations and company policies. Whether it's financial services disclosures, healthcare privacy statements, or recorded call notifications, these elements are delivered with 100% consistency. The system also maintains detailed compliance logs and can be configured for mandatory supervisor review of sensitive transactions."
      },
      {
        question: "What analytics and insights does the system provide about customer interactions?",
        answer: "Our comprehensive analytics dashboard provides detailed insights including: 1) Call volume patterns by time, date and inquiry type, 2) Automation rate and escalation reasons, 3) Customer sentiment analysis, 4) Common questions and emerging issues, 5) Resolution rate by issue type, and 6) Opportunity analysis for automation improvement. These insights help continuously optimize both AI and human agent performance while identifying product or policy issues early."
      },
      {
        question: "How can we measure the ROI of implementing SummitVoiceAI in our call center?",
        answer: "We provide a detailed ROI framework that measures multiple value dimensions: 1) Direct labor savings from automation of routine inquiries, 2) Reduced cost-per-contact across your operation, 3) Decreased abandonment rate value based on your conversion metrics, 4) Improved first-call resolution value, 5) Extended hours value without incremental staffing, and 6) Customer satisfaction impact on retention and lifetime value. Most clients achieve full ROI within 3-6 months of implementation."
      }
    ]
  }
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
  
  // Get industry-specific stats data
  const statsData = getIndustryStats(industrySlug);
  const industryName = getIndustryName(industrySlug);
  
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
                
                <h1 className="heading-xl" dangerouslySetInnerHTML={{ __html: industry.title }}>
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  {industry.subheading}
                </p>
                
                <div className="pt-4 flex flex-wrap gap-4">
                  <a href="https://calendly.com/aivoice/call" target="_blank" rel="noreferrer noopener" className="btn-primary" style={{ textDecoration: 'none' }}>
                    Get Started
                  </a>
                  <button onClick={scrollToCalculator} className="btn-secondary">
                    Calculate ROI
                  </button>
                </div>
              </div>
              
              <div className="lg:w-1/3 flex justify-center">
                <IconWithCircle icon={industry.icon} />
              </div>
            </div>
            
            <IndustryIntroCard
              description={industry.description}
              icon={industry.icon}
            />
            
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
      
      {/* Add the new Industry Stats section right after the hero section */}
      {statsData && (
        <IndustryStatsSection 
          stats={statsData.stats} 
          industryName={industryName} 
          keywords={statsData.keywords} 
        />
      )}
      
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
      
      <CtaSection 
        heading="Ready to transform your customer experience?" 
        subheading={`Boost your ${industryName} business with our AI Voice Assistant.`}
        buttonText="Book a Demo"
      />
      
      {/* Fix this later - we need a CalendarDialog component that accepts a boolean state */}
      {/*<CalendarDialog open={calendarOpen} setOpen={setCalendarOpen} />*/}
    </>
  );
};

export default IndustryPage;
