import React from 'react';
import { Link } from 'react-router-dom';
import PolicyLayout from '@/components/PolicyLayout';
import { COMPANY } from '@/data/company';

const link = { color: '#00D9FF' } as const;

const SmsTerms: React.FC = () => {
  return (
      <PolicyLayout title="SMS Terms and Conditions">
        <p className="text-lg text-muted-foreground mb-6">Effective Date: {COMPANY.effectiveDate}</p>

        <p className="mb-6">
          <strong>Summit Voice AI text message program</strong>
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Program name and who sends the texts</h2>
        <p className="mb-6">
          The &quot;Summit Voice AI Text Updates&quot; program is run by {COMPANY.legalEntity}, doing business as Summit Voice
          AI, {COMPANY.address}.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What you are signing up for</h2>
        <p className="mb-4">
          By opting in, you agree to receive text messages from Summit Voice AI at the mobile number you gave us. We use texts
          to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>reply to your demo request, question or inquiry;</li>
          <li>send the demo link or information you asked for;</li>
          <li>confirm, remind you about, and reschedule calls and appointments;</li>
          <li>send account, setup and service updates if you are a client; and</li>
          <li>provide customer support.</li>
        </ul>
        <p className="mb-6">
          We do not send other types of promotional text messages under this program unless you separately agreed to them.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How to join</h2>
        <p className="mb-4">You can join by:</p>
        <ol className="list-decimal pl-6 mb-4">
          <li>
            checking the unchecked text message box on a Summit Voice AI form at summitvoiceai.com and submitting it; or
          </li>
          <li>
            texting or calling us first and asking us to text you. We will reply to your message and confirm your opt-in.
          </li>
        </ol>
        <p className="mb-6">
          Consent to receive texts is <strong>not</strong> a condition of buying anything from us. You can use our services and
          call us without agreeing to texts.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Message frequency</h2>
        <p className="mb-6">Message frequency varies depending on your requests and activity.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Cost</h2>
        <p className="mb-6">
          Message and data rates may apply, as charged by your mobile carrier. We do not charge you for texts. Check your mobile
          plan for details.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How to stop</h2>
        <p className="mb-6">
          You can cancel at any time. <strong>Reply STOP</strong> to any text. You can also reply UNSUBSCRIBE, CANCEL, END,
          QUIT, OPT OUT or REVOKE. You may also opt out by calling{' '}
          <a href={COMPANY.phoneHref} className="hover:underline" style={link}>
            {COMPANY.phone}
          </a>{' '}
          or emailing{' '}
          <a href={`mailto:${COMPANY.supportEmail}`} className="hover:underline" style={link}>
            {COMPANY.supportEmail}
          </a>
          . After you opt out we will send one confirmation text, and then we will not text you again unless you opt back in. A
          request to stop one kind of text applies to all texts in this program. If you opt out, we may still contact you by
          email or phone where the law allows, and we will keep a record of your opt-out so we can honor it.
        </p>
        <p className="mb-6">
          To join again, reply <strong>START</strong>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How to get help</h2>
        <p className="mb-4">
          <strong>Reply HELP</strong> to any text, or contact us:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>
            Phone:{' '}
            <a href={COMPANY.phoneHref} className="hover:underline" style={link}>
              {COMPANY.phone}
            </a>
          </li>
          <li>
            Email:{' '}
            <a href={`mailto:${COMPANY.supportEmail}`} className="hover:underline" style={link}>
              {COMPANY.supportEmail}
            </a>
          </li>
          <li>Mail: {COMPANY.address}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Supported carriers and delivery</h2>
        <p className="mb-6">
          Message delivery depends on your mobile carrier and your device. Carriers and Summit Voice AI are not liable for
          delayed or undelivered messages. This program is for mobile numbers in the United States. You must be at least 18,
          and the account holder or have the account holder&apos;s permission.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Privacy</h2>
        <p className="mb-6">
          Your privacy matters. How we collect, use and protect your information, including your phone number and your texting
          consent, is described in our{' '}
          <Link to="/privacy-policy" className="hover:underline" style={link}>
            Privacy Policy
          </Link>
          . Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Other terms</h2>
        <p className="mb-6">
          These SMS Terms are part of our{' '}
          <Link to="/terms-of-service" className="hover:underline" style={link}>
            Terms of Service
          </Link>
          . We follow applicable law and carrier messaging rules, including quiet hours: we do not send marketing texts before
          8 a.m. or after 8 p.m. in your local time. We may change these terms by posting an update on this page. If we change
          what you agreed to in a material way, we will ask you again.
        </p>
      </PolicyLayout>
  );
};

export default SmsTerms;
