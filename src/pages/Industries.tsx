
import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { Wrench, Home, Building2, Scale, Car, Calculator, Scissors, Headphones, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO, getOrganizationSchema } from '@/lib/seo';

const Industries = () => {
  useEffect(() => {
    // Ensure the page always scrolls to the top when loaded
    window.scrollTo(0, 0);
  }, []);

  const industries = [
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "AI Voice Assistant for Home Services",
      description: "Our AI receptionist for home services (plumbing, HVAC, roofing, remodeling) captures every call, qualifies leads, and books jobs 24/7—never miss another opportunity.",
      link: "/industries/home-services"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "AI Voice Assistant for Real Estate Agents",
      description: "Voice AI for real estate lead capture handles potential buyer and seller inquiries 24/7, qualifying leads and scheduling showings even when you're with clients.",
      link: "/industries/real-estate"
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "AI Voice Assistant for Healthcare Practices",
      description: "No more IVR—24/7 human-like patient support answers questions, schedules appointments, and handles routine inquiries without frustrating phone trees.",
      link: "/industries/healthcare"
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "AI Voice Assistant for Legal & Law Firms",
      description: "Voice AI receptionist for law firms ensures intake calls are handled perfectly, screening potential clients and scheduling consultations while you focus on billable hours.",
      link: "/industries/legal"
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "AI Voice Assistant for Automotive",
      description: "Voice AI call assistant for repair shops & dealerships makes appointment scheduling seamless, handles common questions, and ensures no service opportunity is missed.",
      link: "/industries/automotive"
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "AI Voice Assistant for Professional Services",
      description: "CPAs and consultants leverage our voice AI to manage client inquiries during tax season and beyond, ensuring every potential engagement is properly handled.",
      link: "/industries/professional-services"
    },
    {
      icon: <Scissors className="w-6 h-6" />,
      title: "AI Voice Assistant for Landscaping & Outdoor Services",
      description: "Capture seasonal business opportunities even when you're on job sites with our dedicated voice AI for landscaping and outdoor service providers.",
      link: "/industries/landscaping"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "AI Voice Assistant for Customer Service & Call Centers",
      description: "Augment your call center operations with AI voice assistants that handle routine inquiries, reducing wait times and allowing your agents to focus on complex issues.",
      link: "/industries/customer-service"
    }
  ];

  // Generate industry-specific schema for SEO
  const industriesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": industries.map((industry, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": industry.title,
        "description": industry.description,
        "url": `https://summitaivoice.com${industry.link}`
      }
    }))
  };

  return (
    <>
      <SEO
        title="Industries We Service | AI Voice Assistant Solutions by Industry | SummitVoiceAI"
        description="From Home Services to Healthcare and Law Firms, SummitVoiceAI's AI receptionist captures calls 24/7, qualifies leads, and books appointments for every industry—get ahead of competitors with our voice AI technology."
        keywords={[
          "industry-specific AI voice assistant",
          "voice AI for home services",
          "healthcare AI receptionist",
          "legal voice assistant",
          "real estate AI voice assistant",
          "automotive AI receptionist",
          "voice AI for professional services",
          "landscaping business AI assistant",
          "industry voice solutions"
        ]}
        canonical="/industries"
        schema={[getOrganizationSchema(), industriesSchema]}
      />

      <div className="pt-28 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="heading-lg text-center mb-4">
            Industries We Service with Voice AI Solutions
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Don't be the last in your industry to adopt AI—your competitors will all be on it in 5 years. Get ahead today with SummitVoiceAI.
          </p>
        </div>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-voiceai-dark/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition cursor-pointer"
                >
                  <div className="inline-flex items-center mb-4 text-voiceai-primary">
                    {industry.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {industry.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {industry.description}
                  </p>
                  <Link to={industry.link} className="text-voiceai-primary font-semibold flex items-center" onClick={() => window.scrollTo(0, 0)}>
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Industries;
