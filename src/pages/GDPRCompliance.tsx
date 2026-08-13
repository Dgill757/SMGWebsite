
import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const GDPRCompliance: React.FC = () => {
  return (
    <PolicyLayout title="GDPR Compliance">
      <p className="text-lg text-muted-foreground mb-6">
        Effective Date: July 26, 2025
      </p>
      
      <p className="mb-6">
        At Summit AI, we are committed to protecting the privacy and personal data of our clients and their users. We comply with the General Data Protection Regulation (GDPR) (EU Regulation 2016/679), which governs how organizations collect, store, process, and share personal data belonging to individuals within the European Economic Area (EEA).
      </p>
      
      <p className="mb-6">
        Even though we are based in the United States, we recognize that our services—including websites with voice AI, CRM automations, and lead tracking tools—may be accessed or used by individuals in the EEA. As such, we take GDPR compliance seriously and ensure appropriate safeguards are in place.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Who We Are</h2>
      <p>
        Summit AI is a division of Summit Marketing Group, headquartered in Frederick, Maryland. We build AI-powered voice assistants, automate lead generation workflows, and modernize service businesses through advanced sales and marketing systems.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. What Data We Collect (and Why)</h2>
      <p className="mb-4">
        We only collect personal data that is necessary to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide our core services (e.g., voice AI receptionist, CRM integrations, email/SMS automations)</li>
        <li>Communicate with users</li>
        <li>Deliver support and training</li>
        <li>Improve user experience and service performance</li>
      </ul>
      
      <p className="mb-4">
        Typical data includes:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Name, email, and phone number</li>
        <li>Call recordings or transcriptions from AI agents (when authorized)</li>
        <li>Booking and scheduling data</li>
        <li>Usage metrics and website behavior</li>
        <li>CRM interaction data</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Legal Grounds for Processing</h2>
      <p className="mb-4">
        We process personal data under the following legal bases:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Consent – when users explicitly opt-in to voice/chat interactions or form submissions</li>
        <li>Contractual necessity – to deliver services requested by the customer</li>
        <li>Legitimate interest – to improve our services or prevent fraud</li>
        <li>Legal obligation – if required to comply with legal or regulatory processes</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your GDPR Rights</h2>
      <p className="mb-4">
        If you are located in the EEA, you have the right to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Access – request the personal data we hold about you</li>
        <li>Correct – fix inaccurate or incomplete data</li>
        <li>Delete – request erasure of your data ("right to be forgotten")</li>
        <li>Restrict – limit the processing of your data</li>
        <li>Portability – receive a copy of your data in a structured format</li>
        <li>Object – opt out of certain uses (e.g., marketing communications)</li>
        <li>Withdraw consent – at any time, where consent is the lawful basis</li>
      </ul>
      
      <p className="mb-4">
        To exercise any of these rights, email us at:
      </p>
      <p className="mb-6">
        📧 <a href="mailto:dan@summitmktggroup.com" className="text-voiceai-primary hover:underline">dan@summitmktggroup.com</a>
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Transfers Outside the EU</h2>
      <p className="mb-4">
        We may transfer your data to the United States or other countries where we or our trusted service providers operate. In these cases, we ensure:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>The use of Standard Contractual Clauses (SCCs) where applicable</li>
        <li>Data is only processed by vendors that meet privacy and security obligations</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Protection & Retention</h2>
      <p className="mb-4">
        We take technical and organizational measures to protect data, including:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Encryption</li>
        <li>Access controls</li>
        <li>Secure backups</li>
        <li>Regular audits and compliance reviews</li>
      </ul>
      <p className="mb-6">
        Data is only retained as long as necessary to fulfill the purpose it was collected for or as required by law.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Use of AI & Automated Processing</h2>
      <p className="mb-4">
        Some of our services include AI-powered features such as voice receptionists, automated lead qualification, and CRM workflows. Where AI automation is used:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Human oversight is available</li>
        <li>Users are informed of automation use</li>
        <li>You may request a review of decisions made by automated systems</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Our Data Protection Team</h2>
      <p className="mb-4">
        If you have any concerns or GDPR-related requests, contact:
      </p>
      <p className="mb-4">
        Dan Gill<br />
        Founder & Data Protection Contact
      </p>
      <p className="mb-4">
        Email: <a href="mailto:dan@summitmktggroup.com" className="text-voiceai-primary hover:underline">dan@summitmktggroup.com</a>
      </p>
      <p className="mb-6">
        Website: <a href="https://www.summitmktggroup.com" className="text-voiceai-primary hover:underline">www.summitmktggroup.com</a>
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Lodging a Complaint</h2>
      <p>
        If you are located in the EU and believe your rights under GDPR have been violated, you may lodge a complaint with your local Data Protection Authority (DPA).
      </p>
    </PolicyLayout>
  );
};

export default GDPRCompliance;

