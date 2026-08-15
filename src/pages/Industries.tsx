
import React, { useEffect, useRef } from 'react';
import { motion, useInView } from "framer-motion";
import { Wrench, Home, Building2, Scale, Car, Calculator, Scissors, Headphones, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO, getOrganizationSchema } from '@/lib/seo';
import { getIndustryName } from '@/data/industryStats';

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}>
      {children}
    </motion.div>
  );
}

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
        "url": `https://www.summitvoiceai.com${industry.link}`
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
            <span style={{
              background: 'linear-gradient(135deg, #00D9FF, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: '#00D9FF'
            }}>Industries We Service</span> with <span className="text-white">Voice AI Solutions</span>
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Don't be the last in your industry to adopt AI—your competitors will all be on it in 5 years. Get ahead today with SummitVoiceAI.
          </p>
        </div>

        <section className="py-20 bg-background" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="container mx-auto px-4" style={{ position: 'relative' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <FadeUp
                  key={index}
                  delay={(index % 3) * 0.12}
                  className="glass card-hover-lift rounded-xl p-6"
                >
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #00D9FF, #7C3AED)', position: 'relative', zIndex: 1 }}
                  >
                    {industry.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white" style={{ position: 'relative', zIndex: 1 }}>
                    {industry.title}
                  </h3>
                  <p className="text-white/80 mb-4 leading-relaxed" style={{ position: 'relative', zIndex: 1 }}>
                    {industry.description}
                  </p>
                  <Link
                    to={industry.link}
                    className="inline-flex items-center font-bold text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #00D9FF, #7C3AED)', position: 'relative', zIndex: 1 }}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Industries;
