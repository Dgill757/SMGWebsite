
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      name: "John Peterson",
      role: "Owner, Premier Roofing",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "We were missing 3-4 calls per day because our office staff was overwhelmed. Since implementing the Voice AI, we've captured 100% of calls and increased our monthly revenue by over $45,000.",
      metrics: [
        { label: "Increase in Appointments", value: "127%" },
        { label: "Monthly Revenue Increase", value: "$45K+" },
        { label: "Cost Reduction", value: "$8,500/mo" }
      ]
    },
    {
      name: "Sarah Williams",
      role: "CEO, Elite Home Services",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "The Voice AI has become our best salesperson. It never forgets to follow up, always sticks to the script, and has increased our close rate by 43%. It's like having a 24/7 sales team that never sleeps or asks for a raise.",
      metrics: [
        { label: "Leads Captured", value: "100%" },
        { label: "Close Rate Increase", value: "43%" },
        { label: "ROI", value: "684%" }
      ]
    },
    {
      name: "Michael Rodriguez",
      role: "Director, Sunshine Plumbing",
      image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      quote: "Our emergency service calls used to go to voicemail after hours, and we'd lose those customers. Now our AI assistant handles them all, qualifying the emergency, and dispatching our on-call technician when needed. Our after-hours revenue is up 215%.",
      metrics: [
        { label: "After-Hours Revenue", value: "+215%" },
        { label: "Customer Satisfaction", value: "97%" },
        { label: "Annual Savings", value: "$127K" }
      ]
    }
  ];
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-voiceai-primary/5 to-voiceai-secondary/5">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            What Our <span className="text-voiceai-primary font-bold">Clients</span> Say
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            See how service businesses just like yours are transforming their operations and growing their revenue with Voice AI.
          </p>
        </div>
        
        <div className="relative">
          {/* Testimonial Navigation - Hidden on Mobile */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 hidden sm:block">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glassmorphism shadow-lg flex items-center justify-center hover:bg-white/20 border border-white/20 transition-all"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
          </div>
          
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 hidden sm:block">
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glassmorphism shadow-lg flex items-center justify-center hover:bg-white/20 border border-white/20 transition-all"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
            </button>
          </div>
          
          {/* Testimonial Content */}
          <div className="glassmorphism rounded-2xl shadow-xl overflow-hidden border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image and Info */}
              <div className="relative h-64 sm:h-80 lg:min-h-[500px] bg-gradient-to-br from-primary to-secondary">
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="1.5" fill="white" />
                      </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                  </svg>
                </div>
                
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 sm:p-8 text-white text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 overflow-hidden mb-4">
                    <img 
                      src={testimonials[activeIndex].image} 
                      alt={testimonials[activeIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold">{testimonials[activeIndex].name}</h3>
                  <p className="text-sm sm:text-base text-white/80 mb-2">{testimonials[activeIndex].role}</p>
                  
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-300" />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Testimonial and Metrics */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 sm:mb-6 opacity-20">
                    <path d="M14.4 24H7.2C6.64 24 6.08 23.76 5.68 23.36C5.28 22.96 5.04 22.4 5.04 21.84V14.64C5.04 14.08 5.28 13.52 5.68 13.12C6.08 12.72 6.64 12.48 7.2 12.48H14.4C14.96 12.48 15.52 12.72 15.92 13.12C16.32 13.52 16.56 14.08 16.56 14.64V21.84C16.56 22.4 16.32 22.96 15.92 23.36C15.52 23.76 14.96 24 14.4 24ZM7.2 14.64V21.84H14.4V14.64H7.2Z" fill="currentColor" />
                    <path d="M28.8 24H21.6C21.04 24 20.48 23.76 20.08 23.36C19.68 22.96 19.44 22.4 19.44 21.84V14.64C19.44 14.08 19.68 13.52 20.08 13.12C20.48 12.72 21.04 12.48 21.6 12.48H28.8C29.36 12.48 29.92 12.72 30.32 13.12C30.72 13.52 30.96 14.08 30.96 14.64V21.84C30.96 22.4 30.72 22.96 30.32 23.36C29.92 23.76 29.36 24 28.8 24ZM21.6 14.64V21.84H28.8V14.64H21.6Z" fill="currentColor" />
                    <path d="M12.24 28.32C11.68 28.32 11.12 28.56 10.72 28.96C10.32 29.36 10.08 29.92 10.08 30.48C10.08 31.04 10.32 31.6 10.72 32C11.12 32.4 11.68 32.64 12.24 32.64H35.28C36.4 32.64 37.52 32.16 38.32 31.36C39.12 30.56 39.6 29.44 39.6 28.32V14.64C39.6 14.08 39.36 13.52 38.96 13.12C38.56 12.72 38 12.48 37.44 12.48H34.56C34 12.48 33.44 12.72 33.04 13.12C32.64 13.52 32.4 14.08 32.4 14.64C32.4 15.2 32.64 15.76 33.04 16.16C33.44 16.56 34 16.8 34.56 16.8H35.28V28.32H12.24Z" fill="currentColor" />
                  </svg>
                  
                  <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 text-foreground/90">
                    {testimonials[activeIndex].quote}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs sm:text-sm uppercase text-foreground/70 mb-3 sm:mb-4 font-medium">Results Achieved</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {testimonials[activeIndex].metrics.map((metric, index) => (
                      <div key={index} className="text-center p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">{metric.value}</p>
                        <p className="text-xs sm:text-sm text-foreground/70">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation Controls */}
          <div className="flex justify-center items-center mt-6 space-x-4 sm:hidden">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full glassmorphism shadow-lg flex items-center justify-center hover:bg-white/20 border border-white/20"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex ? 'bg-primary w-6' : 'bg-primary/30'
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full glassmorphism shadow-lg flex items-center justify-center hover:bg-white/20 border border-white/20"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
          
          {/* Desktop Indicators */}
          <div className="hidden sm:flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? 'bg-primary w-6' : 'bg-primary/30'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
