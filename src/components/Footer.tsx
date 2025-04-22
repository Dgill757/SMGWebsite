
import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // New fields for Name and Phone
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Update webhook to Make.com integration
  const webhookUrl = 'https://hook.us1.make.com/z4gfd71t668ji99fhqbiwazr82986xb7';

  const handlePolicyClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    if (!webhookUrl) {
      toast({
        title: "Configuration Required",
        description: "Please set up your Make.com webhook URL first",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "no-cors",
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          timestamp: new Date().toISOString(),
          source: window.location.origin
        })
      });
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!"
      });
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <footer id="contact" className="bg-voiceai-dark text-white">
      <div className="container mx-auto py-16 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-voiceai-primary to-voiceai-secondary p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gradient">SummitVoiceAI</span>
            </div>
            <p className="text-gray-400">
              Summit Voice AI - The #1 AI voice solution for service businesses. Never miss a call, automate scheduling, and increase your revenue.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/daniel.gill.iii" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://x.com/SMG_Biz_Growth" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/summit_marketing_group_/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/summitmarketing-business-growth" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="/#use-cases" className="text-gray-400 hover:text-white transition-colors">Use Cases</a></li>
              <li><a href="/#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Industries We Serve</h3>
            <ul className="space-y-2">
              <li><a href="/#use-cases" className="text-gray-400 hover:text-white transition-colors">Home Services (HVAC, Plumbing)</a></li>
              <li><a href="/#use-cases" className="text-gray-400 hover:text-white transition-colors">Real Estate Agencies</a></li>
              <li><a href="/#use-cases" className="text-gray-400 hover:text-white transition-colors">Law Firms</a></li>
              <li><a href="/#use-cases" className="text-gray-400 hover:text-white transition-colors">Accounting & CPA Firms</a></li>
              <li><a href="/#use-cases" className="text-gray-400 hover:text-white transition-colors">Healthcare Practices</a></li>
              <li><a href="/#use-cases" className="text-gray-400 hover:text-white transition-colors">Automotive Services</a></li>
              <li><a href="/#use-cases" className="text-gray-400 hover:text-white transition-colors">Landscaping Companies</a></li>
            </ul>
          </div>
          
          <div id="contact">
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="text-voiceai-primary" size={18} />
                <a href="mailto:dan@summitmktggroup.com" className="text-gray-400 hover:text-white transition-colors">
                  dan@summitmktggroup.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-voiceai-primary" size={18} />
                <a href="tel:+12404740668" className="text-gray-400 hover:text-white transition-colors">
                  +1 (240) 474-0668
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-voiceai-primary">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <a href="https://summitaivoice.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">summitmktggroup.com</a>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-voiceai-primary"
                  disabled={isLoading}
                  autoComplete="name"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-voiceai-primary"
                  disabled={isLoading}
                  autoComplete="email"
                />
                <input
                  type="tel"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-voiceai-primary"
                  disabled={isLoading}
                  autoComplete="tel"
                />
                <textarea
                  placeholder="Your message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-voiceai-primary"
                  disabled={isLoading}
                ></textarea>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-voiceai-primary to-voiceai-secondary text-white font-medium py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SummitVoiceAI. All Rights Reserved.</p>
          <div className="mt-4 text-xs space-x-4">
            <button className="text-gray-500 hover:text-white transition-colors" onClick={() => handlePolicyClick('/terms-of-service')}>
              Terms of Service
            </button>
            <button className="text-gray-500 hover:text-white transition-colors" onClick={() => handlePolicyClick('/privacy-policy')}>
              Privacy Policy
            </button>
            <button className="text-gray-500 hover:text-white transition-colors" onClick={() => handlePolicyClick('/cookie-policy')}>
              Cookie Policy
            </button>
            <button className="text-gray-500 hover:text-white transition-colors" onClick={() => handlePolicyClick('/gdpr-compliance')}>
              GDPR Compliance
            </button>
          </div>
        </div>
      </div>
    </footer>;
};

export default Footer;

