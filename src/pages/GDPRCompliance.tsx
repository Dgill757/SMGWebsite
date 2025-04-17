
import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const GDPRCompliance: React.FC = () => {
  return (
    <PolicyLayout title="GDPR Compliance">
      <p className="text-lg text-muted-foreground mb-6">
        Last updated: April 17, 2025
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction to GDPR</h2>
      <p>
        The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection and privacy. 
        At VoiceAI, we are committed to ensuring compliance with GDPR requirements for our European users.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Our Role Under GDPR</h2>
      <p>
        VoiceAI acts as both a data controller and a data processor:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>As a data controller:</strong> We determine the purposes and means of processing personal data collected directly from you.</li>
        <li><strong>As a data processor:</strong> We process data on behalf of our business customers when providing our AI voice services.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Legal Basis for Processing</h2>
      <p>
        We process personal data based on one or more of the following legal grounds:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Your consent</li>
        <li>The need to perform a contract with you</li>
        <li>Compliance with a legal obligation</li>
        <li>Our legitimate interests</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights Under GDPR</h2>
      <p>
        Under GDPR, you have the following rights:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>The right to be informed</li>
        <li>The right of access</li>
        <li>The right to rectification</li>
        <li>The right to erasure</li>
        <li>The right to restrict processing</li>
        <li>The right to data portability</li>
        <li>The right to object</li>
        <li>Rights related to automated decision making and profiling</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Protection Measures</h2>
      <p>
        We implement appropriate technical and organizational measures to ensure data protection, including:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Encryption of personal data</li>
        <li>Regular testing of security measures</li>
        <li>Risk assessment procedures</li>
        <li>Staff training on data protection</li>
        <li>Data protection policies and procedures</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. International Data Transfers</h2>
      <p>
        When we transfer personal data outside the European Economic Area (EEA), we ensure appropriate safeguards are in place, 
        such as standard contractual clauses approved by the European Commission.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Breach Procedures</h2>
      <p>
        In the event of a data breach that may pose a risk to individuals' rights and freedoms, we have procedures in place to notify 
        the relevant supervisory authority within 72 hours and affected individuals without undue delay.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Data Protection Officer</h2>
      <p>
        Our Data Protection Officer can be contacted at dpo@voiceai.com for any queries related to GDPR compliance or data protection.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Updates to This Policy</h2>
      <p>
        We regularly review and update our GDPR compliance documentation. Any significant changes will be communicated to users.
      </p>
    </PolicyLayout>
  );
};

export default GDPRCompliance;
