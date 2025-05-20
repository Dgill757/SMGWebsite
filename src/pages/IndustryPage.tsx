import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SEO, getOrganizationSchema, getServiceSchema } from '@/lib/seo';
import { motion } from "framer-motion";
import { Wrench, Home, Building2, Scale, Car, Calculator, Scissors, Headphones, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hash } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollUp,
  SelectScrollDown,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import IndustryStatsProof from '@/components/industry/IndustryStatsProof';
import { getStatsByIndustrySlug } from '@/data/industryStats';

interface IndustryData {
  name: string;
  description: string;
  metaDescription: string;
  problemStatement: string;
  solutionOverview: string;
  keyBenefits: string[];
  useCaseExamples: string[];
  faqs: { question: string; answer: string; }[];
}

const IndustryPage = () => {
  const [industryData, setIndustryData] = useState<IndustryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { industrySlug } = useParams<{ industrySlug: string }>();
  
  const industryStatsData = getStatsByIndustrySlug(industrySlug || '');

  useEffect(() => {
    const fetchIndustryData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching data from an API based on the industry slug
        const data = await getIndustryData(industrySlug);
        setIndustryData(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load industry data.');
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive",
        })
      } finally {
        setLoading(false);
      }
    };

    fetchIndustryData();
    window.scrollTo(0, 0); // Scroll to top on page load/route change
  }, [industrySlug]);

  const getIndustryData = async (slug: string | undefined): Promise<IndustryData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (slug) {
      case 'home-services':
        return {
          name: "Home Services",
          description: "AI Voice Assistant for Home Services",
          metaDescription: "AI Voice Assistant for Home Services meta description",
          problemStatement: "Home Services businesses often struggle with missed calls, after-hours inquiries, and inefficient appointment scheduling, leading to lost revenue and frustrated customers.",
          solutionOverview: "SummitVoiceAI provides a 24/7 AI receptionist that captures every call, qualifies leads, and books appointments, ensuring no opportunity is missed.",
          keyBenefits: [
            "Never miss a call, even after hours",
            "Qualify leads instantly",
            "Book appointments automatically",
            "Reduce administrative workload",
            "Improve customer satisfaction"
          ],
          useCaseExamples: [
            "A plumbing company uses SummitVoiceAI to capture emergency service requests 24/7.",
            "An HVAC business automates appointment scheduling, reducing no-shows and increasing revenue.",
            "A landscaping service qualifies leads and provides instant quotes, winning more jobs."
          ],
          faqs: [
            {
              question: "How does SummitVoiceAI integrate with my existing systems?",
              answer: "SummitVoiceAI integrates seamlessly with most popular CRM systems, scheduling software, and business management tools."
            },
            {
              question: "How accurate is the voice recognition?",
              answer: "Our AI voice technology achieves over 95% accuracy in understanding caller requests, questions, and information."
            }
          ]
        };
      case 'real-estate':
        return {
          name: "Real Estate",
          description: "AI Voice Assistant for Real Estate Agents",
          metaDescription: "AI Voice Assistant for Real Estate Agents meta description",
          problemStatement: "Real estate agents often miss potential buyer and seller inquiries due to being busy with clients or after-hours. This leads to lost opportunities and slower response times.",
          solutionOverview: "SummitVoiceAI handles potential buyer and seller inquiries 24/7, qualifying leads and scheduling showings even when you're with clients.",
          keyBenefits: [
            "Capture every property inquiry",
            "Schedule property viewings automatically",
            "Qualify potential buyers and sellers",
            "Provide instant listing details",
            "Improve response times"
          ],
          useCaseExamples: [
            "A real estate agent uses SummitVoiceAI to capture inquiries about listings and schedule viewings.",
            "A property manager automates responses to rental inquiries, providing instant details and qualifying potential renters.",
            "A real estate team uses SummitVoiceAI to follow up with leads and provide personalized information."
          ],
          faqs: [
            {
              question: "Can SummitVoiceAI handle multiple property listings?",
              answer: "Yes, SummitVoiceAI can handle inquiries for multiple property listings, providing details and scheduling viewings for each."
            },
            {
              question: "How does SummitVoiceAI qualify potential buyers and sellers?",
              answer: "SummitVoiceAI collects information such as price range, mortgage pre-approval status, and desired property features to qualify leads."
            }
          ]
        };
      case 'healthcare':
        return {
          name: "Healthcare",
          description: "AI Voice Assistant for Healthcare Practices",
          metaDescription: "AI Voice Assistant for Healthcare Practices meta description",
          problemStatement: "Healthcare practices often struggle with overwhelming call volumes, patient inquiries, and appointment scheduling, leading to long wait times and frustrated patients.",
          solutionOverview: "SummitVoiceAI enables medical practices, dental offices, and wellness clinics to handle appointment scheduling, insurance verification, and patient intake without overwhelming staff.",
          keyBenefits: [
            "Handle appointment scheduling automatically",
            "Verify insurance information",
            "Provide 24/7 patient support",
            "Reduce wait times",
            "Improve patient satisfaction"
          ],
          useCaseExamples: [
            "A medical practice uses SummitVoiceAI to schedule appointments and send reminders, reducing no-shows.",
            "A dental office automates responses to patient inquiries, providing information about services and insurance.",
            "A wellness clinic uses SummitVoiceAI to handle patient intake and collect medical history."
          ],
          faqs: [
            {
              question: "Can SummitVoiceAI integrate with my electronic health record (EHR) system?",
              answer: "Yes, SummitVoiceAI can integrate with most popular EHR systems to streamline patient data management."
            },
            {
              question: "How does SummitVoiceAI ensure patient privacy and security?",
              answer: "SummitVoiceAI is HIPAA compliant and uses advanced encryption and security measures to protect patient data."
            }
          ]
        };
      case 'legal':
        return {
          name: "Legal",
          description: "AI Voice Assistant for Legal & Law Firms",
          metaDescription: "AI Voice Assistant for Legal & Law Firms meta description",
          problemStatement: "Law firms often struggle with capturing potential client inquiries, scheduling consultations, and collecting case information, requiring significant paralegal or receptionist time.",
          solutionOverview: "SummitVoiceAI allows law firms to capture potential client inquiries, schedule consultations, and collect case information without requiring paralegal or receptionist time.",
          keyBenefits: [
            "Capture potential client inquiries 24/7",
            "Schedule consultations automatically",
            "Collect case information",
            "Reduce administrative workload",
            "Improve client satisfaction"
          ],
          useCaseExamples: [
            "A law firm uses SummitVoiceAI to capture potential client inquiries and schedule initial consultations.",
            "A solo practitioner automates responses to client inquiries, providing information about services and fees.",
            "A legal team uses SummitVoiceAI to collect case information and prepare for consultations."
          ],
          faqs: [
            {
              question: "Can SummitVoiceAI handle inquiries in multiple languages?",
              answer: "Yes, SummitVoiceAI can handle inquiries in multiple languages, ensuring you never miss an opportunity to connect with potential clients."
            },
            {
              question: "How does SummitVoiceAI ensure confidentiality and compliance?",
              answer: "SummitVoiceAI uses advanced security measures and complies with all relevant regulations to ensure confidentiality and compliance."
            }
          ]
        };
      case 'automotive':
        return {
          name: "Automotive",
          description: "AI Voice Assistant for Automotive",
          metaDescription: "AI Voice Assistant for Automotive meta description",
          problemStatement: "Auto dealerships, repair shops, and detailers often struggle with capturing service requests, scheduling appointments, and following up with customers, leading to missed opportunities and lost revenue.",
          solutionOverview: "SummitVoiceAI helps auto dealerships, repair shops, and detailers capture service requests, schedule appointments, and follow up with customers automatically.",
          keyBenefits: [
            "Capture service requests 24/7",
            "Schedule appointments automatically",
            "Follow up with customers",
            "Reduce administrative workload",
            "Improve customer satisfaction"
          ],
          useCaseExamples: [
            "An auto dealership uses SummitVoiceAI to capture service requests and schedule appointments.",
            "A repair shop automates responses to customer inquiries, providing information about services and pricing.",
            "A detailing service uses SummitVoiceAI to follow up with customers and schedule repeat appointments."
          ],
          faqs: [
            {
              question: "Can SummitVoiceAI integrate with my existing shop management system?",
              answer: "Yes, SummitVoiceAI can integrate with most popular shop management systems to streamline operations."
            },
            {
              question: "How does SummitVoiceAI handle inquiries about specific vehicle models and services?",
              answer: "SummitVoiceAI uses advanced natural language processing to understand customer inquiries and provide accurate information."
            }
          ]
        };
      case 'professional-services':
        return {
          name: "Professional Services",
          description: "AI Voice Assistant for Professional Services",
          metaDescription: "AI Voice Assistant for Professional Services meta description",
          problemStatement: "Consultants, financial advisors, marketing agencies, and other professional service providers often struggle with qualifying leads and scheduling appointments efficiently, leading to wasted time and missed opportunities.",
          solutionOverview: "SummitVoiceAI enables consultants, financial advisors, marketing agencies, and other professional service providers to qualify leads and schedule appointments efficiently.",
          keyBenefits: [
            "Qualify leads automatically",
            "Schedule appointments efficiently",
            "Reduce administrative workload",
            "Improve client satisfaction",
            "Increase revenue"
          ],
          useCaseExamples: [
            "A consultant uses SummitVoiceAI to qualify leads and schedule initial consultations.",
            "A financial advisor automates responses to client inquiries, providing information about services and fees.",
            "A marketing agency uses SummitVoiceAI to follow up with leads and schedule discovery calls."
          ],
          faqs: [
            {
              question: "Can SummitVoiceAI handle inquiries about specific services and pricing?",
              answer: "Yes, SummitVoiceAI can handle inquiries about specific services and pricing, providing accurate and up-to-date information."
            },
            {
              question: "How does SummitVoiceAI integrate with my existing CRM system?",
              answer: "SummitVoiceAI integrates seamlessly with most popular CRM systems to streamline lead management and client communication."
            }
          ]
        };
      case 'landscaping':
        return {
          name: "Landscaping & Outdoor Services",
          description: "AI Voice Assistant for Landscaping & Outdoor Services",
          metaDescription: "AI Voice Assistant for Landscaping & Outdoor Services meta description",
          problemStatement: "Landscaping and outdoor service providers often struggle with capturing seasonal business opportunities, especially when on job sites, leading to missed calls and lost revenue.",
          solutionOverview: "SummitVoiceAI captures seasonal business opportunities even when you're on job sites with our dedicated voice AI for landscaping and outdoor service providers.",
          keyBenefits: [
            "Capture seasonal business opportunities",
            "Provide instant quotes",
            "Schedule appointments automatically",
            "Reduce administrative workload",
            "Improve customer satisfaction"
          ],
          useCaseExamples: [
            "A landscaping company uses SummitVoiceAI to capture inquiries about lawn care services and schedule appointments.",
            "An outdoor service provider automates responses to customer inquiries, providing information about services and pricing.",
            "A landscaping team uses SummitVoiceAI to follow up with leads and schedule consultations."
          ],
          faqs: [
            {
              question: "Can SummitVoiceAI handle inquiries about specific services and pricing?",
              answer: "Yes, SummitVoiceAI can handle inquiries about specific services and pricing, providing accurate and up-to-date information."
            },
            {
              question: "How does SummitVoiceAI integrate with my existing scheduling software?",
              answer: "SummitVoiceAI integrates seamlessly with most popular scheduling software to streamline appointment management."
            }
          ]
        };
      case 'customer-service':
        return {
          name: "Customer Service & Call Centers",
          description: "AI Voice Assistant for Customer Service & Call Centers",
          metaDescription: "AI Voice Assistant for Customer Service & Call Centers meta description",
          problemStatement: "Customer service and call centers often struggle with high call volumes, long wait times, and agent burnout, leading to frustrated customers and increased costs.",
          solutionOverview: "SummitVoiceAI augments your call center operations with AI voice assistants that handle routine inquiries, reducing wait times and allowing your agents to focus on complex issues.",
          keyBenefits: [
            "Reduce call volumes",
            "Reduce wait times",
            "Improve agent satisfaction",
            "Improve customer satisfaction",
            "Reduce costs"
          ],
          useCaseExamples: [
            "A customer service center uses SummitVoiceAI to handle routine inquiries and provide instant support.",
            "A call center automates responses to customer inquiries, providing information about products and services.",
            "A support team uses SummitVoiceAI to follow up with customers and resolve issues."
          ],
          faqs: [
            {
              question: "Can SummitVoiceAI handle inquiries in multiple languages?",
              answer: "Yes, SummitVoiceAI can handle inquiries in multiple languages, ensuring you can provide support to customers worldwide."
            },
            {
              question: "How does SummitVoiceAI integrate with my existing CRM system?",
              answer: "SummitVoiceAI integrates seamlessly with most popular CRM systems to streamline customer data management and communication."
            }
          ]
        };
      default:
        throw new Error('Industry not found');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading industry data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  if (!industryData) {
    return <div className="text-center py-10">No industry data found.</div>;
  }

  return (
    <>
      <SEO 
        title={`${industryData?.name} AI Voice Assistant | Best Voice AI for ${industryData?.name} | SummitVoiceAI`}
        description={`Transform your ${industryData?.name} business with SummitVoiceAI's voice AI assistant. Answer calls 24/7, qualify leads, book appointments, and boost revenue with our specialized ${industryData?.name.toLowerCase()} AI voice technology.`}
        keywords={industryStatsData.keywords}
        schema={[getOrganizationSchema(), getServiceSchema(industryData?.name || '', industryData?.metaDescription || '')]}
      />

      <section className="bg-background py-20">
        <div className="container mx-auto px-4">
          <h1 className="heading-lg text-center mb-4">
            AI Voice Assistant for {industryData.name}
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            {industryData.description}
          </p>
        </div>
      </section>
      
      <IndustryStatsProof data={industryStatsData} />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="heading-md mb-4">
            The Problem
          </h2>
          <p className="text-muted-foreground">
            {industryData.problemStatement}
          </p>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="heading-md text-white mb-4">
            Our Solution
          </h2>
          <p className="text-secondary-foreground">
            {industryData.solutionOverview}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="heading-md mb-4">
            Key Benefits
          </h2>
          <ul className="list-disc list-inside text-muted-foreground">
            {industryData.keyBenefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="heading-md mb-4">
            Use Case Examples
          </h2>
          <ul className="list-disc list-inside text-muted-foreground">
            {industryData.useCaseExamples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="heading-md mb-4">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            {industryData.faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
};

export default IndustryPage;
