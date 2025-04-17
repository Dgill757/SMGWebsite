
import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const TermsOfService: React.FC = () => {
  return (
    <PolicyLayout title="Terms of Service">
      <p className="text-lg text-muted-foreground mb-6">
        Last updated: April 17, 2025
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
      <p>
        Welcome to VoiceAI. These Terms of Service govern your use of our website, products, and services.
        By accessing or using VoiceAI, you agree to be bound by these Terms. If you disagree with any part of the terms, 
        you may not access our services.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Services</h2>
      <p>
        Our services provide AI-powered voice communication solutions for businesses. You may use our services
        only as permitted by these terms and applicable law, including applicable export and re-export control laws and regulations.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Payment Terms</h2>
      <p>
        Various payment plans are available for our services. You agree to pay all fees associated with your selected plan.
        Fees are non-refundable except as required by law or as explicitly stated in our refund policy.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
      <p>
        Our services and all related content, features, and functionality are owned by VoiceAI and are protected by
        international copyright, trademark, patent, trade secret, and other intellectual property laws.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Content</h2>
      <p>
        You retain all rights to any content you submit, post, or display through our services. By providing content,
        you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content in
        connection with the service.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Termination</h2>
      <p>
        We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason.
        Upon termination, your right to use the services will immediately cease.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, in no event shall VoiceAI be liable for any indirect, incidental, special,
        consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
      <p>
        These Terms shall be governed by the laws of the United States, without regard to its conflict of law provisions.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
      <p>
        We reserve the right to modify or replace these Terms at any time. If a revision is material we will try to provide
        at least 30 days' notice prior to any new terms taking effect.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at contact@voiceai.com.
      </p>
    </PolicyLayout>
  );
};

export default TermsOfService;
