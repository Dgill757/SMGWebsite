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
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center flex-shrink-0"
          style={{ textDecoration: 'none' }}
          aria-label="SummitVoiceAI — back to home"
        >
          <img
            src="/assets/summitvoiceai-logo-gradient.png"
            alt="SummitVoiceAI"
            width={1070}
            height={260}
            loading="eager"
            decoding="async"
            className="logo-gradient"
            style={{
              height: 'clamp(28px, 4vw, 38px)',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
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
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
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
