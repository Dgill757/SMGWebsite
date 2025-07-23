
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
          ? 'py-2 glassmorphism shadow-2xl shadow-voiceai-primary/20' 
          : 'py-4 bg-transparent'
      }`}>
        <div className="w-full max-w-none flex justify-between items-center px-6 lg:px-12">
          {/* Logo Section */}
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
          </div>

          {/* Tagline */}
          <div className="hidden lg:flex items-center">
            <span className="text-sm text-foreground/70 font-medium bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">The Future of Websites Is Here</span>
          </div>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="#features" 
              onClick={(e) => scrollToSection('features', e)} 
              className="enhanced-nav-link text-foreground/80 hover:text-white font-medium transition-all duration-300 relative group"
            >
              Features
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => scrollToSection('how-it-works', e)} 
              className="enhanced-nav-link text-foreground/80 hover:text-white font-medium transition-all duration-300 relative group"
            >
              How It Works
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
            </a>
            <a 
              href="#use-cases" 
              onClick={(e) => scrollToSection('use-cases', e)} 
              className="enhanced-nav-link text-foreground/80 hover:text-white font-medium transition-all duration-300 relative group"
            >
              Use Cases
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
            </a>
            <Link 
              to="/industries" 
              className="enhanced-nav-link text-foreground/80 hover:text-white font-medium transition-all duration-300 relative group" 
              onClick={() => window.scrollTo(0, 0)}
            >
              Industries
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
            </Link>
            <a 
              href="#pricing" 
              onClick={(e) => scrollToSection('pricing', e)} 
              className="enhanced-nav-link text-foreground/80 hover:text-white font-medium transition-all duration-300 relative group"
            >
              Pricing
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => scrollToSection('pricing', e)} 
              className="enhanced-btn-primary bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden glassmorphism p-2 rounded-lg hover:bg-white/20 transition-all duration-300" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full glassmorphism shadow-2xl py-6 px-4 space-y-6 border-t border-white/10">
            <a 
              href="#features" 
              className="block py-3 enhanced-nav-link text-base font-medium text-foreground/80 hover:text-white transition-colors duration-300" 
              onClick={(e) => scrollToSection('features', e)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="block py-3 enhanced-nav-link text-base font-medium text-foreground/80 hover:text-white transition-colors duration-300" 
              onClick={(e) => scrollToSection('how-it-works', e)}
            >
              How It Works
            </a>
            <a 
              href="#use-cases" 
              className="block py-3 enhanced-nav-link text-base font-medium text-foreground/80 hover:text-white transition-colors duration-300" 
              onClick={(e) => scrollToSection('use-cases', e)}
            >
              Use Cases
            </a>
            <Link 
              to="/industries" 
              className="block py-3 enhanced-nav-link text-base font-medium text-foreground/80 hover:text-white transition-colors duration-300"
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo(0, 0);
              }}
            >
              Industries
            </Link>
            <a 
              href="#pricing" 
              className="block py-3 enhanced-nav-link text-base font-medium text-foreground/80 hover:text-white transition-colors duration-300" 
              onClick={(e) => scrollToSection('pricing', e)}
            >
              Pricing
            </a>
            <a 
              href="#pricing" 
              className="block py-3 enhanced-btn-primary text-center bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold rounded-lg transition-all duration-300" 
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
