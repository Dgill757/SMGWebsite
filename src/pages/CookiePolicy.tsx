
import React from 'react';
import PolicyLayout from '@/components/PolicyLayout';

const CookiePolicy: React.FC = () => {
  return (
    <PolicyLayout title="Cookie Policy">
      <p className="text-lg text-muted-foreground mb-6">
        Last updated: April 17, 2025
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
      <p>
        Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
        They are widely used to make websites work more efficiently and provide information to the website owners.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
      <p>
        We use cookies and similar technologies for the following purposes:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>To enable certain functions of the website</li>
        <li>To provide analytics</li>
        <li>To store your preferences</li>
        <li>To enable advertisement delivery</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
      <p>
        We use the following types of cookies:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Necessary cookies:</strong> Essential for the website to function properly</li>
        <li><strong>Preference cookies:</strong> Enable the website to remember your preferences</li>
        <li><strong>Statistics cookies:</strong> Collect anonymous information about how you use our website</li>
        <li><strong>Marketing cookies:</strong> Used to track visitors across websites to enable advertising</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>
      <p>
        In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
        deliver advertisements, and so on. These cookies may track your browsing habits and activity when using our website.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Controlling Cookies</h2>
      <p>
        You can control and manage cookies in various ways. You can:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Delete cookies from your browser</li>
        <li>Block cookies by activating the settings in your browser</li>
        <li>Use our cookie consent tool when you first visit our website</li>
      </ul>
      <p>
        Please note that disabling cookies may affect the functionality of our website.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to This Cookie Policy</h2>
      <p>
        We may update our Cookie Policy from time to time. Any changes will be posted on this page.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
      <p>
        If you have any questions about our Cookie Policy, please contact us at cookies@voiceai.com.
      </p>
    </PolicyLayout>
  );
};

export default CookiePolicy;
