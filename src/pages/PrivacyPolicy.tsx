
import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <PolicyLayout title="Privacy Policy">
      <p className="text-lg text-muted-foreground mb-6">
        Last updated: April 17, 2025
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
      <p>
        At VoiceAI, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, 
        disclose, and safeguard your information when you use our website and services.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
      <p>
        We may collect personal information that you voluntarily provide when using our services, including but not limited to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Contact information (name, email address, phone number)</li>
        <li>Business information</li>
        <li>Payment information</li>
        <li>Voice recordings and transcripts from calls handled by our AI</li>
        <li>Information about how you use our services</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
      <p>
        We use the information we collect to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide, maintain, and improve our services</li>
        <li>Process transactions and send related information</li>
        <li>Send you technical notices, updates, and support messages</li>
        <li>Respond to your comments and questions</li>
        <li>Train and improve our AI systems</li>
        <li>Monitor and analyze usage patterns</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Storage and Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, 
        accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Sharing and Disclosure</h2>
      <p>
        We may share your information with:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Service providers who perform services on our behalf</li>
        <li>Business partners with your consent</li>
        <li>Legal authorities when required by law</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Data Protection Rights</h2>
      <p>
        Depending on your location, you may have certain rights regarding your personal data, including:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Right to access your personal data</li>
        <li>Right to correct inaccurate data</li>
        <li>Right to delete your data</li>
        <li>Right to restrict processing</li>
        <li>Right to data portability</li>
        <li>Right to object to processing</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
      <p>
        Our services are not intended for individuals under the age of 16, and we do not knowingly collect personal information from children.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and 
        updating the "Last updated" date.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
      <p>
        If you have questions or concerns about this Privacy Policy, please contact us at privacy@voiceai.com.
      </p>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
