
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    
    const isHomePage = location.pathname === '/';
    
    if (!isHomePage) {
      navigate(`/#${sectionId}`);
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Floating orbs for background animation */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-3 glassmorphism shadow-2xl shadow-voiceai-primary/20' 
          : 'py-6 bg-transparent'
      }`}>
        <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3" onClick={() => window.scrollTo(0, 0)}>
              <div className="relative">
                <div className="bg-gradient-to-r from-voiceai-primary to-voiceai-secondary p-3 rounded-xl shadow-lg shadow-voiceai-primary/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-voiceai-primary to-voiceai-secondary rounded-xl blur opacity-30 animate-pulse"></div>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-voiceai-primary to-voiceai-secondary bg-clip-text text-transparent">SummitVoiceAI</span>
            </Link>
            <span className="text-sm text-foreground/70 ml-4 navbar-tagline font-medium hidden sm:block">The Future of Websites Is Here</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" onClick={(e) => scrollToSection('features', e)} className="nav-link">Features</a>
            <a href="#how-it-works" onClick={(e) => scrollToSection('how-it-works', e)} className="nav-link">How It Works</a>
            <a href="#use-cases" onClick={(e) => scrollToSection('use-cases', e)} className="nav-link">Use Cases</a>
            <Link to="/industries" className="nav-link" onClick={() => window.scrollTo(0, 0)}>Industries</Link>
            <a href="#pricing" onClick={(e) => scrollToSection('pricing', e)} className="nav-link">Pricing</a>
            <a href="#pricing" onClick={(e) => scrollToSection('pricing', e)} className="btn-primary">Get Started</a>
          </div>
          
          <button 
            className="md:hidden glassmorphism p-2 rounded-lg" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full glassmorphism shadow-2xl py-6 px-4 space-y-6 border-t border-white/10">
            <a 
              href="#features" 
              className="block py-3 nav-link text-base font-medium" 
              onClick={(e) => scrollToSection('features', e)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="block py-3 nav-link text-base font-medium" 
              onClick={(e) => scrollToSection('how-it-works', e)}
            >
              How It Works
            </a>
            <a 
              href="#use-cases" 
              className="block py-3 nav-link text-base font-medium" 
              onClick={(e) => scrollToSection('use-cases', e)}
            >
              Use Cases
            </a>
            <Link 
              to="/industries" 
              className="block py-3 nav-link text-base font-medium"
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo(0, 0);
              }}
            >
              Industries
            </Link>
            <a 
              href="#pricing" 
              className="block py-3 nav-link text-base font-medium" 
              onClick={(e) => scrollToSection('pricing', e)}
            >
              Pricing
            </a>
            <a 
              href="#pricing" 
              className="block py-3 btn-primary text-center" 
              onClick={(e) => scrollToSection('pricing', e)}
            >
              Get Started
            </a>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
