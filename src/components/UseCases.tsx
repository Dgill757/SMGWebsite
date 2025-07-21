
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  Wrench, Home, Stethoscope, Scale, Car, Briefcase, 
  Phone, PhoneOff, Calendar, ClipboardCheck, Clock, DollarSign
} from 'lucide-react';

const UseCases: React.FC = () => {
  const industries = [
    {
      icon: <Wrench className="h-5 w-5" />,
      name: "Home Services",
      description: "Perfect for plumbers, electricians, HVAC, landscapers, and other home service providers who need to capture leads from phone calls and schedule appointments efficiently.",
      benefits: [
        { 
          icon: <Phone className="h-4 w-4" />, 
          title: "Never Miss Emergency Calls", 
          description: "Capture emergency service requests 24/7, even after hours." 
        },
        { 
          icon: <Calendar className="h-4 w-4" />, 
          title: "Optimized Scheduling", 
          description: "Schedule technicians based on location and availability to minimize travel time." 
        },
        { 
          icon: <ClipboardCheck className="h-4 w-4" />, 
          title: "Pre-Visit Information", 
          description: "Collect all necessary information before the appointment to ensure techs arrive prepared." 
        }
      ],
      testimonial: {
        quote: "Our HVAC company was missing at least 5 calls per day after hours. Now our VoiceAI answers every call and we've increased revenue by 40% in just two months.",
        author: "Michael J.",
        company: "Comfort Air Systems"
      }
    },
    {
      icon: <Home className="h-5 w-5" />,
      name: "Real Estate",
      description: "Help real estate agents and property managers capture inquiries about listings, schedule viewings, and qualify potential buyers or renters without playing phone tag.",
      benefits: [
        { 
          icon: <PhoneOff className="h-4 w-4" />, 
          title: "No More Missed Inquiries", 
          description: "Capture every property inquiry and automatically send listing details." 
        },
        { 
          icon: <Calendar className="h-4 w-4" />, 
          title: "Automated Showings", 
          description: "Schedule property viewings directly into your calendar with pre-screening." 
        },
        { 
          icon: <DollarSign className="h-4 w-4" />, 
          title: "Buyer Qualification", 
          description: "Pre-qualify buyers by collecting price range and mortgage information." 
        }
      ],
      testimonial: {
        quote: "My real estate business is booming since implementing the VoiceAI system. It pre-qualifies prospects and only sends me serious buyers, saving me countless hours of wasted showings.",
        author: "Sarah L.",
        company: "Premium Properties"
      }
    },
    {
      icon: <Stethoscope className="h-5 w-5" />,
      name: "Healthcare",
      description: "Enable medical practices, dental offices, and wellness clinics to handle appointment scheduling, insurance verification, and patient intake without overwhelming staff.",
      benefits: [
        { 
          icon: <Calendar className="h-4 w-4" />, 
          title: "Streamlined Appointments", 
          description: "Reduce no-shows with automated scheduling and reminders." 
        },
        { 
          icon: <Clock className="h-4 w-4" />, 
          title: "24/7 Availability", 
          description: "Allow patients to schedule appointments any time, even after hours." 
        },
        { 
          icon: <ClipboardCheck className="h-4 w-4" />, 
          title: "Patient Screening", 
          description: "Collect symptoms and medical history before appointments." 
        }
      ],
      testimonial: {
        quote: "Our dental practice has reduced front desk staffing by 50% while improving patient satisfaction. The AI handles all routine scheduling and follow-ups beautifully.",
        author: "Dr. Amanda R.",
        company: "Bright Smile Dental"
      }
    },
    {
      icon: <Scale className="h-5 w-5" />,
      name: "Legal Services",
      description: "Allow law firms to capture potential client inquiries, schedule consultations, and collect case information without requiring paralegal or receptionist time.",
      benefits: [
        { 
          icon: <ClipboardCheck className="h-4 w-4" />, 
          title: "Case Intake", 
          description: "Collect detailed case information before the first consultation." 
        },
        { 
          icon: <Calendar className="h-4 w-4" />, 
          title: "Automated Consultations", 
          description: "Schedule initial consultations based on case type and attorney availability." 
        },
        { 
          icon: <DollarSign className="h-4 w-4" />, 
          title: "Client Qualification", 
          description: "Pre-screen clients to ensure they're a good fit for your practice." 
        }
      ],
      testimonial: {
        quote: "As a solo practitioner, I was overwhelmed with calls. Now my AI assistant qualifies leads, schedules consultations, and collects client information, allowing me to focus on actual legal work.",
        author: "James W., Esq.",
        company: "West Law Partners"
      }
    },
    {
      icon: <Car className="h-5 w-5" />,
      name: "Automotive",
      description: "Help auto dealerships, repair shops, and detailers capture service requests, schedule appointments, and follow up with customers automatically.",
      benefits: [
        { 
          icon: <Phone className="h-4 w-4" />, 
          title: "Service Request Handling", 
          description: "Capture detailed vehicle issues and service history when scheduling." 
        },
        { 
          icon: <Calendar className="h-4 w-4" />, 
          title: "Maintenance Reminders", 
          description: "Automatically follow up for scheduled maintenance and warranty services." 
        },
        { 
          icon: <Clock className="h-4 w-4" />, 
          title: "Status Updates", 
          description: "Provide automated repair status updates to customers." 
        }
      ],
      testimonial: {
        quote: "Our auto repair shop has increased appointment bookings by 35% and virtually eliminated no-shows with the automated reminder system. The ROI has been incredible.",
        author: "Robert T.",
        company: "Precision Auto Care"
      }
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      name: "Professional Services",
      description: "Enable consultants, financial advisors, marketing agencies, and other professional service providers to qualify leads and schedule appointments efficiently.",
      benefits: [
        { 
          icon: <ClipboardCheck className="h-4 w-4" />, 
          title: "Client Qualification", 
          description: "Screen potential clients to ensure they meet your ideal client profile." 
        },
        { 
          icon: <Calendar className="h-4 w-4" />, 
          title: "Discovery Calls", 
          description: "Schedule initial consultations and collect business requirements beforehand." 
        },
        { 
          icon: <DollarSign className="h-4 w-4" />, 
          title: "Proposal Follow-ups", 
          description: "Automatically follow up on sent proposals to improve close rates." 
        }
      ],
      testimonial: {
        quote: "Our marketing agency used to waste hours on discovery calls with unqualified prospects. Now the AI prescreens them and only schedules calls with clients who match our ideal customer profile.",
        author: "Lisa M.",
        company: "Digital Growth Partners"
      }
    }
  ];

  return (
    <section id="use-cases" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-lg">Perfect for <span className="text-voiceai-primary font-bold">Any Service Business</span></h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See how businesses across different industries are using Voice AI to transform their operations and boost revenue.
          </p>
        </div>
        
        <Tab.Group>
          <Tab.List className="flex flex-wrap justify-center gap-2 mb-10">
            {industries.map((industry) => (
              <Tab
                key={industry.name}
                className={({ selected }) =>
                  `px-4 py-2 rounded-full transition-all font-medium flex items-center gap-2
                   ${selected 
                     ? 'bg-voiceai-primary text-white shadow-lg shadow-voiceai-primary/20' 
                     : 'bg-voiceai-primary/10 text-voiceai-primary hover:bg-voiceai-primary/20'}`
                }
              >
                {industry.icon}
                <span>{industry.name}</span>
              </Tab>
            ))}
          </Tab.List>
          
          <Tab.Panels>
            {industries.map((industry) => (
              <Tab.Panel key={industry.name}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Industry Description */}
                  <div className="lg:col-span-1">
                   <div className="bg-white/98 dark:bg-voiceai-dark/98 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/20">
                     <div className="inline-flex items-center justify-center p-3 rounded-lg bg-voiceai-primary/20 text-voiceai-primary mb-4">
                       {industry.icon}
                     </div>
                     <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-foreground">{industry.name}</h3>
                     <p className="text-gray-700 dark:text-foreground/80 mb-6">{industry.description}</p>
                       
                       <div className="mt-auto">
                         <a href="#pricing" className="btn-primary w-full text-center">Get Started</a>
                       </div>
                     </div>
                  </div>
                  
                   <div className="lg:col-span-1">
                     <div className="bg-white/98 dark:bg-voiceai-dark/98 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-white/20 h-full">
                       <h4 className="font-bold mb-4 text-gray-900 dark:text-foreground">Key Benefits</h4>
                       <div className="space-y-4">
                         {industry.benefits.map((benefit, index) => (
                           <div key={index} className="flex gap-3">
                             <div className="w-8 h-8 rounded-full bg-voiceai-primary/20 flex items-center justify-center flex-shrink-0">
                               {benefit.icon}
                             </div>
                             <div>
                               <p className="font-medium text-gray-900 dark:text-foreground">{benefit.title}</p>
                               <p className="text-sm text-gray-600 dark:text-foreground/70">{benefit.description}</p>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                  
                  {/* Testimonial */}
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-voiceai-primary/20 to-voiceai-secondary/20 rounded-xl p-6 shadow-lg border border-voiceai-primary/10 h-full flex flex-col">
                      <div className="mb-4">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.4 24H7.2C6.64 24 6.08 23.76 5.68 23.36C5.28 22.96 5.04 22.4 5.04 21.84V14.64C5.04 14.08 5.28 13.52 5.68 13.12C6.08 12.72 6.64 12.48 7.2 12.48H14.4C14.96 12.48 15.52 12.72 15.92 13.12C16.32 13.52 16.56 14.08 16.56 14.64V21.84C16.56 22.4 16.32 22.96 15.92 23.36C15.52 23.76 14.96 24 14.4 24ZM7.2 14.64V21.84H14.4V14.64H7.2Z" fill="url(#quote-gradient)" />
                          <path d="M28.8 24H21.6C21.04 24 20.48 23.76 20.08 23.36C19.68 22.96 19.44 22.4 19.44 21.84V14.64C19.44 14.08 19.68 13.52 20.08 13.12C20.48 12.72 21.04 12.48 21.6 12.48H28.8C29.36 12.48 29.92 12.72 30.32 13.12C30.72 13.52 30.96 14.08 30.96 14.64V21.84C30.96 22.4 30.72 22.96 30.32 23.36C29.92 23.76 29.36 24 28.8 24ZM21.6 14.64V21.84H28.8V14.64H21.6Z" fill="url(#quote-gradient)" />
                          <path d="M12.24 28.32C11.68 28.32 11.12 28.56 10.72 28.96C10.32 29.36 10.08 29.92 10.08 30.48C10.08 31.04 10.32 31.6 10.72 32C11.12 32.4 11.68 32.64 12.24 32.64H35.28C36.4 32.64 37.52 32.16 38.32 31.36C39.12 30.56 39.6 29.44 39.6 28.32V14.64C39.6 14.08 39.36 13.52 38.96 13.12C38.56 12.72 38 12.48 37.44 12.48H34.56C34 12.48 33.44 12.72 33.04 13.12C32.64 13.52 32.4 14.08 32.4 14.64C32.4 15.2 32.64 15.76 33.04 16.16C33.44 16.56 34 16.8 34.56 16.8H35.28V28.32H12.24Z" fill="url(#quote-gradient)" />
                          <defs>
                            <linearGradient id="quote-gradient" x1="5.04" y1="12.48" x2="42.8846" y2="20.8999" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#7C3AED" />
                              <stop offset="1" stopColor="#3B82F6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      
                      <p className="italic mb-6 flex-grow">{industry.testimonial.quote}</p>
                      
                      <div>
                        <p className="font-bold">{industry.testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{industry.testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
};

export default UseCases;
