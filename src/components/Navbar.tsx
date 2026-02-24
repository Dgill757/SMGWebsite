import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    setMenuOpen(false);
    if (location.pathname !== '/') { navigate(`/#${id}`); return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Features',     id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Industries',   id: 'use-cases' },
    { label: 'Pricing',      id: 'pricing' },
    { label: 'FAQ',          id: 'faq' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5,5,7,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}
        className="flex items-center justify-between py-4"
      >

        {/* Logo */}
        <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#3B82F6)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight" style={{
            background: 'linear-gradient(135deg,#fff 0%,rgba(255,255,255,0.85) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            SummitVoiceAI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, id }) => (
            <a key={id} href={`#${id}`} onClick={(e) => scrollTo(id, e)} className="nav-link">{label}</a>
          ))}
          <Link to="/industries" className="nav-link" style={{ textDecoration: 'none' }}>Who We Serve</Link>
          <Link to="/articles" className="nav-link" style={{ textDecoration: 'none' }}>Articles</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://calendly.com/aivoice/call"
            target="_blank"
            rel="noreferrer noopener"
            className="btn-primary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.875rem', textDecoration: 'none' }}
          >
            <span>Get Started</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'rgba(255,255,255,0.75)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(5,5,7,0.97)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0.5rem 1.5rem 1rem' }}
            className="flex flex-col gap-1">
            {navLinks.map(({ label, id }) => (
              <a key={id} href={`#${id}`} onClick={(e) => scrollTo(id, e)}
                className="nav-link" style={{ padding: '0.75rem 1rem', display: 'block' }}>{label}</a>
            ))}
            <Link to="/industries" className="nav-link" onClick={() => setMenuOpen(false)}
              style={{ padding: '0.75rem 1rem', display: 'block', textDecoration: 'none' }}>Who We Serve</Link>
            <Link to="/articles" className="nav-link" onClick={() => setMenuOpen(false)}
              style={{ padding: '0.75rem 1rem', display: 'block', textDecoration: 'none' }}>Articles</Link>
            <div style={{ paddingTop: '0.75rem' }}>
              <a
                href="https://calendly.com/aivoice/call"
                target="_blank"
                rel="noreferrer noopener"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'flex' }}
                onClick={() => setMenuOpen(false)}
              >
                <span>Get Started</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
