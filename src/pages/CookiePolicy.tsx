
import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const CookiePolicy: React.FC = () => {
  return (
    <PolicyLayout title="Cookie Policy">
      <p className="text-lg text-muted-foreground mb-6">
        Effective Date: April 17, 2025
      </p>
      
      <p className="mb-6">
        At Summit AI, we are committed to protecting your privacy and ensuring transparency about the data we collect. This Cookie Policy explains what cookies are, how we use them on our website (including smart widgets, voice AI integrations, and client portals), and how you can manage them.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device (computer, smartphone, or tablet) when you visit a website. They help websites remember user preferences, enhance functionality, and analyze site performance and traffic.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Why We Use Cookies</h2>
      <p>
        We use cookies to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide core functionality (including our Voice AI Widget and smart scheduling tools)</li>
        <li>Enhance user experience on our website</li>
        <li>Remember user preferences and login information</li>
        <li>Analyze traffic and visitor behavior using third-party analytics tools (like Google Analytics)</li>
        <li>Improve marketing efforts, such as tracking which services users view or engage with</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
      <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2 font-semibold">Essential Cookies</td>
            <td className="p-2">Required for the website to function properly. These include session cookies and security/authentication cookies.</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold">Performance Cookies</td>
            <td className="p-2">Help us understand how visitors interact with the site (e.g., pages visited, time spent, errors encountered).</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold">Functionality Cookies</td>
            <td className="p-2">Allow us to remember your preferences (e.g., language settings, chat history with our AI widget).</td>
          </tr>
          <tr>
            <td className="p-2 font-semibold">Marketing Cookies</td>
            <td className="p-2">Help tailor advertising and outreach based on your interaction with the site and services.</td>
          </tr>
        </tbody>
      </table>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>
      <p className="mb-4">
        Some cookies may be placed by third-party tools we integrate to deliver services. These include:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>OpenAI and voice processing platforms (used to power our smart voice assistant)</li>
        <li>Google Analytics (for site performance tracking)</li>
        <li>CRM platforms and automation tools (e.g., GoHighLevel, Calendly integrations)</li>
      </ul>
      <p className="mb-6">
        These providers may collect anonymous usage data to improve service delivery. We do not share personal data unless explicitly required for service fulfillment.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Managing Your Cookie Preferences</h2>
      <p className="mb-4">
        You can control and manage cookie settings directly through your browser. You can choose to:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Accept all cookies</li>
        <li>Reject all cookies</li>
        <li>Be notified when cookies are being set</li>
      </ul>
      <p className="mb-4">
        Note: Disabling certain cookies may impact your experience using the interactive features of our site, such as speaking to Ava (our voice AI), booking demos, or logging into client portals.
      </p>
      <p className="mb-6">
        To manage settings:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Chrome: Settings &gt; Privacy & Security &gt; Cookies and other site data</li>
        <li>Safari: Preferences &gt; Privacy &gt; Manage Website Data</li>
        <li>Firefox: Options &gt; Privacy & Security &gt; Cookies and Site Data</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Updates to This Policy</h2>
      <p className="mb-6">
        We may update this Cookie Policy periodically to reflect changes in technology, legislation, or our services. When we do, we will revise the "Effective Date" at the top of this policy.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
      <p className="mb-4">
        For questions about our cookie usage or to request further privacy accommodations, contact:
      </p>
      <p className="mb-4">
        Dan Gill<br />
        Founder, Summit AI
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

export default CookiePolicy;
