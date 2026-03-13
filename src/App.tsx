
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Industries from "./pages/Industries";
import IndustryPage from "./pages/IndustryPage";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import GDPRCompliance from "./pages/GDPRCompliance";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GlobalAtmosphere from "./components/ui/GlobalAtmosphere";
import AmbientBackground from "./components/AmbientBackground";

// ScrollToTop component to ensure proper scrolling behavior
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If there's no hash, scroll to the top
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // If there's a hash, try to scroll to the element
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (pathname === '/') {
          // If on homepage and element not found, remove the hash
          navigate('/', { replace: true });
          window.scrollTo(0, 0);
        }
      }, 100);
    }
  }, [pathname, hash, navigate]);

  return null;
};

const HomeAlertBar = () => {
  const { pathname } = useLocation();

  if (pathname !== "/") {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '40px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(20, 0, 0, 0.95)',
        borderBottom: '1px solid rgba(239,68,68,0.25)',
        padding: '0 16px',
        gap: '10px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span style={{ color: 'rgba(239,68,68,0.8)', fontSize: '0.8rem', flexShrink: 0 }}>⚠</span>
      <span
        style={{
          fontSize: '0.68rem',
          letterSpacing: '0.07em',
          fontWeight: 700,
          color: 'rgba(252,165,165,0.92)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '700px',
          textAlign: 'center',
        }}
      >
        THE AVERAGE ROOFING COMPANY MISSES 7 OUT OF 10 AFTER-HOURS CALLS — THOSE LEADS DON&apos;T CALL BACK
      </span>
      <span style={{ color: 'rgba(239,68,68,0.8)', fontSize: '0.8rem', flexShrink: 0 }}>⚠</span>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AmbientBackground />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlobalAtmosphere />
          <div className="bg-drift-layer" aria-hidden="true" />
          <div className="min-h-screen text-foreground overflow-x-hidden">
            <ScrollToTop />
            <HomeAlertBar />
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/industries/:industrySlug" element={<IndustryPage />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/gdpr-compliance" element={<GDPRCompliance />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
