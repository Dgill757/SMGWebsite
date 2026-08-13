
import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <PolicyLayout title="Privacy Policy">
      <p className="text-lg text-muted-foreground mb-6">
        Effective Date: June 23, 2024
      </p>
      
      <p className="mb-6">
        Summit AI, a division of Summit Marketing Group
      </p>
      
      <p className="mb-6">
        At Summit AI, your privacy matters. This policy outlines what data we collect, how we use it, and how we protect your information as you use our AI-powered services—including smart websites, voice assistants, and automation systems.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
      <p className="mb-4">
        We collect and process only what is necessary to deliver our services effectively:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Contact Info: Names, phone numbers, emails.</li>
        <li>Service Interactions: Booking data, chat logs, form submissions, call metadata (but not recordings unless authorized).</li>
        <li>Business Preferences: CRM settings, automation flows, AI assistant configurations.</li>
        <li>Website Usage: Analytics and usage patterns (non-identifiable) for optimization.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use this data to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Set up and operate your AI assistant, smart website, and automations.</li>
        <li>Send confirmations, reminders, or updates based on your usage.</li>
        <li>Improve service performance and personalization.</li>
        <li>Provide customer support and onboarding assistance.</li>
        <li>Fulfill legal obligations and security protections.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Storage & Protection</h2>
      <p className="mb-4">
        All data is encrypted in transit and at rest using modern security protocols.
      </p>
      <p className="mb-4">
        Access is limited to trained team members and governed by strict confidentiality.
      </p>
      <p className="mb-6">
        Data is retained only as long as required to provide services or comply with law.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Technology Use</h2>
      <p className="mb-6">
        We may utilize third-party AI models strictly for processing tasks initiated by you (e.g., voice transcriptions or chatbot logic). These services do not retain or reuse your data beyond each request. We do not sell, rent, or share your information with any third parties for advertising or marketing.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
      <p className="mb-4">
        You are in control of your data. You may:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Request access to your stored information.</li>
        <li>Correct or delete inaccurate information.</li>
        <li>Withdraw consent at any time (for marketing or data handling).</li>
        <li>Request complete deletion of your stored data if no longer using our services.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Updates to This Policy</h2>
      <p className="mb-6">
        We may occasionally update this Privacy Policy to reflect changes in our operations or legal requirements. When we do, we'll post the updates on our website and notify you directly when necessary.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
      <p className="mb-4">
        Have questions or need to make a request?
      </p>
      <p className="mb-4">
        Email: <a href="mailto:dan@summitmktggroup.com" className="text-voiceai-primary hover:underline">dan@summitmktggroup.com</a>
      </p>
      <p className="mb-6">
        Website: <a href="https://www.summitmktggroup.com" className="text-voiceai-primary hover:underline">www.summitmktggroup.com</a>
      </p>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
