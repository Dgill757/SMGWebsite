
import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const TermsOfService: React.FC = () => {
  return (
    <PolicyLayout title="Terms of Service">
      <p className="text-lg text-muted-foreground mb-6">
        Last Updated: July 17, 2025
      </p>
      
      <p className="mb-6">
        This Agreement ("Agreement") is entered into by and between Summit AI, a division of Summit Marketing Group operating in Frederick, MD ("Provider"), and the individual or entity ("Customer") accessing or using the Provider's services ("Services"). By accessing or using the Services, Customer acknowledges that they have read, understood, and agree to be bound by this Agreement.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Definitions</h2>
      <p className="mb-4">
        <strong>Services:</strong> AI-powered automation tools, smart website integrations, AI voice assistant functionality, CRM automation, lead qualification systems, and other digital solutions provided by Summit AI.
      </p>
      <p className="mb-4">
        <strong>Customer Content:</strong> All data, input, leads, and business information submitted or integrated by the Customer into the Services.
      </p>
      <p className="mb-6">
        <strong>Subscription Period:</strong> The recurring term (monthly or annually) during which Customer pays for and receives access to the Services.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Access and Use of Services</h2>
      <p className="mb-4">
        2.1 Provider grants Customer a non-exclusive, non-transferable, revocable right to access and use the Services during the Subscription Period.
      </p>
      <p className="mb-4">
        2.2 Customer agrees to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Use the Services in compliance with applicable laws.</li>
        <li>Not use the Services to engage in unlawful or harmful activities.</li>
      </ul>
      
      <p className="mb-4">
        2.3 Customer agrees not to:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li>Copy, modify, or reverse-engineer the Services.</li>
        <li>Resell, sublicense, or lease the Services to third parties.</li>
        <li>Upload or transmit harmful, infringing, or deceptive content.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Intellectual Property</h2>
      <p className="mb-4">
        3.1 Provider retains full ownership of all intellectual property associated with the Services, including software, automation systems, AI voice agents, and all related technologies.
      </p>
      <p className="mb-6">
        3.2 Customer retains ownership of all Customer Content and data used within the Services.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Privacy & Security</h2>
      <p className="mb-4">
        4.1 Summit AI does not sell, share, or distribute Customer data with any third party, except as required to deliver the core Services (e.g., CRM syncing, call transcriptions initiated by Customer).
      </p>
      <p className="mb-4">
        4.2 Any use of data is solely for the purpose of operating, maintaining, and improving the Services delivered to the Customer.
      </p>
      <p className="mb-6">
        4.3 Summit AI complies with standard data protection and security best practices. See our Privacy Policy for full details.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Fees & Payments</h2>
      <p className="mb-4">
        5.1 Customer agrees to pay the applicable fees for the Services as outlined in the pricing plans or written agreement.
      </p>
      <p className="mb-4">
        5.2 All fees are billed in advance and non-refundable unless otherwise agreed.
      </p>
      <p className="mb-4">
        5.3 Provider may update pricing with 30-day prior notice. New rates apply at the start of the next billing cycle.
      </p>
      <p className="mb-6">
        5.4 Customer is responsible for all taxes, excluding Provider's income taxes.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Term & Termination</h2>
      <p className="mb-4">
        6.1 This Agreement begins on the signup or onboarding date and continues until terminated by either party.
      </p>
      <p className="mb-4">
        6.2 Customer may cancel the subscription at any time. Cancellation will take effect at the end of the current billing cycle.
      </p>
      <p className="mb-6">
        6.3 Upon termination, Customer access to the Services will be revoked, and all associated content will be removed from active systems.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Warranty Disclaimer</h2>
      <p className="mb-6">
        7.1 The Services are provided "as is" and "as available." Summit AI makes no guarantees regarding uptime, specific outcomes, or suitability for Customer's intended use.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
      <p className="mb-4">
        8.1 Summit AI shall not be liable for indirect, incidental, or consequential damages arising from use of the Services.
      </p>
      <p className="mb-6">
        8.2 Maximum liability is limited to the total amount paid by Customer in the preceding 12 months.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law & Dispute Resolution</h2>
      <p className="mb-4">
        9.1 This Agreement shall be governed by the laws of the State of Maryland, without regard to its conflict of laws principles.
      </p>
      <p className="mb-6">
        9.2 Any disputes shall be resolved by binding arbitration in Frederick, MD or in state or federal court located in Maryland.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">10. Miscellaneous</h2>
      <p className="mb-4">
        10.1 This Agreement represents the full understanding between the parties.
      </p>
      <p className="mb-4">
        10.2 Provider may revise this Agreement at any time by updating its website or notifying Customers via email.
      </p>
      <p className="mb-6">
        10.3 If any provision of this Agreement is deemed invalid or unenforceable, the remainder shall remain in full force and effect.
      </p>
      
      <p className="italic">
        By using the Services provided by Summit AI, the Customer agrees to all terms outlined above.
      </p>
    </PolicyLayout>
  );
};

export default TermsOfService;
