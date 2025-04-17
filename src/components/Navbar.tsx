import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    // First check if we're on the home page
    const isHomePage = window.location.pathname === '/';
    
    if (!isHomePage) {
      // If not on home page, navigate to home page first and then scroll
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-background/80 backdrop-blur-md shadow-sm' : 'py-6'}`}>
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <a href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-voiceai-primary to-voiceai-secondary p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
          </div>
          <span className="font-bold text-xl text-gradient">SummitVoiceAI</span>
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" onClick={(e) => scrollToSection('features', e)} className="text-foreground/80 hover:text-voiceai-primary transition-colors">Features</a>
          <a href="#how-it-works" onClick={(e) => scrollToSection('how-it-works', e)} className="text-foreground/80 hover:text-voiceai-primary transition-colors">How It Works</a>
          <a href="#use-cases" onClick={(e) => scrollToSection('use-cases', e)} className="text-foreground/80 hover:text-voiceai-primary transition-colors">Use Cases</a>
          <a href="#pricing" onClick={(e) => scrollToSection('pricing', e)} className="text-foreground/80 hover:text-voiceai-primary transition-colors">Pricing</a>
          <a href="#contact" onClick={(e) => scrollToSection('contact', e)} className="btn-primary">Get Started</a>
        </div>
        
        <button 
          className="md:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background shadow-md py-4 px-4 space-y-4 border-t">
          <a 
            href="#features" 
            className="block py-2 text-foreground/80 hover:text-voiceai-primary active:text-voiceai-primary" 
            onClick={(e) => scrollToSection('features', e)}
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            className="block py-2 text-foreground/80 hover:text-voiceai-primary active:text-voiceai-primary" 
            onClick={(e) => scrollToSection('how-it-works', e)}
          >
            How It Works
          </a>
          <a 
            href="#use-cases" 
            className="block py-2 text-foreground/80 hover:text-voiceai-primary active:text-voiceai-primary" 
            onClick={(e) => scrollToSection('use-cases', e)}
          >
            Use Cases
          </a>
          <a 
            href="#pricing" 
            className="block py-2 text-foreground/80 hover:text-voiceai-primary active:text-voiceai-primary" 
            onClick={(e) => scrollToSection('pricing', e)}
          >
            Pricing
          </a>
          <a 
            href="#contact" 
            className="block py-2 btn-primary text-center" 
            onClick={(e) => scrollToSection('contact', e)}
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
