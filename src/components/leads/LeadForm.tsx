import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { submitLead, type LeadPayload } from '@/lib/leadApi';
import { BOOKING_LINKS, COMPANY, SMS_CONSENT_TEXT, type BookingKind } from '@/data/company';

export interface LeadFormFields {
  company?: boolean;
  website?: boolean;
  serviceArea?: boolean;
  message?: boolean;
  /** Calls per day, missed calls per day, average job value, close rate. */
  qualification?: boolean;
  /** Old leads and estimates on file. */
  databaseSize?: boolean;
}

interface LeadFormProps {
  /** Form id sent to GHL, for example "footer-contact". Lowercase letters, numbers, dashes. */
  form: string;
  vertical?: string;
  offerInterest?: string;
  fields?: LeadFormFields;
  submitLabel?: string;
  messageLabel?: string;
  /** compact keeps placeholders and screen reader labels (footer and dialog). page shows labels. */
  variant?: 'page' | 'compact';
  bookingKind?: BookingKind;
  thankYouBody?: string;
  onSuccess?: () => void;
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 10,
  padding: '0.7rem 0.9rem',
  fontSize: '0.9rem',
  color: '#fff',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.75)',
  marginBottom: 6,
};

const linkStyle: React.CSSProperties = { color: '#00D9FF', textDecoration: 'underline' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = 'idle' | 'loading' | 'success';

const LeadForm: React.FC<LeadFormProps> = ({
  form,
  vertical,
  offerInterest,
  fields = {},
  submitLabel = 'Send',
  messageLabel = 'Anything we should know? (optional)',
  variant = 'page',
  bookingKind = 'discovery',
  thankYouBody,
  onSuccess,
}) => {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const compact = variant === 'compact';

  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    serviceArea: '',
    message: '',
    inboundCallsPerDay: '',
    missedCallsPerDay: '',
    avgJobValue: '',
    closeRatePct: '',
    databaseSize: '',
    fax: '',
  });
  const [smsConsent, setSmsConsent] = useState(false); // unchecked by default, never required
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const focusRing = {
    onFocus: (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = 'rgba(0,217,255,0.7)'),
    onBlur: (e: React.FocusEvent<HTMLElement>) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'),
  };

  const validate = (): { message: string; fields: string[] } | null => {
    if (!values.name.trim()) return { message: 'Add your name.', fields: ['name'] };
    if (!EMAIL_RE.test(values.email.trim())) return { message: 'Add a valid email address.', fields: ['email'] };
    const digits = values.phone.replace(/\D/g, '');
    if (values.phone.trim() && (digits.length < 10 || digits.length > 15)) {
      return { message: 'That phone number does not look right. Use 10 digits.', fields: ['phone'] };
    }
    if (smsConsent && !values.phone.trim()) {
      return {
        message: 'Add your mobile number to get texts, or uncheck the text message box.',
        fields: ['phone'],
      };
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    const problem = validate();
    if (problem) {
      setError(problem.message);
      setErrorFields(problem.fields);
      return;
    }
    setError('');
    setErrorFields([]);
    setStatus('loading');

    const payload: LeadPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      company: values.company.trim() || undefined,
      website: values.website.trim() || undefined,
      serviceArea: values.serviceArea.trim() || undefined,
      message: values.message.trim() || undefined,
      vertical,
      form,
      offerInterest,
      inboundCallsPerDay: values.inboundCallsPerDay || undefined,
      missedCallsPerDay: values.missedCallsPerDay || undefined,
      avgJobValue: values.avgJobValue || undefined,
      closeRatePct: values.closeRatePct || undefined,
      databaseSize: values.databaseSize || undefined,
      smsConsent,
      fax: values.fax,
    };

    const result = await submitLead(payload);
    if (result.ok) {
      setStatus('success');
      onSuccess?.();
      return;
    }
    setStatus('idle');
    if (result.reason === 'invalid') {
      setErrorFields(result.fields || []);
      setError('Please check the highlighted fields and try again.');
    } else if (result.reason === 'rate_limited') {
      setError(`Too many tries from this connection. Call us at ${COMPANY.phone} or try again in a few minutes.`);
    } else {
      setError(`That did not go through. Try again, or call us at ${COMPANY.phone}.`);
    }
  };

  if (status === 'success') {
    const first = values.name.trim().split(/\s+/)[0];
    const primary = BOOKING_LINKS[bookingKind];
    const otherKind: BookingKind = bookingKind === 'discovery' ? 'demo' : 'discovery';
    return (
      <div
        role="status"
        style={{
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.35)',
          borderRadius: 14,
          padding: '1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#4ADE80', marginBottom: '0.5rem' }}>
          Got it, {first}.
        </div>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: '0 0 1.1rem' }}>
          {thankYouBody ||
            "I'll look at what you sent and follow up by email. If you'd rather not wait, grab a time that works for you."}
        </p>
        <a
          href={primary}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ display: 'inline-flex', padding: '0.8rem 1.8rem', textDecoration: 'none', fontSize: '0.9rem' }}
        >
          <span>{bookingKind === 'demo' ? 'Book your live demo' : 'Pick a time to talk'}</span>
        </a>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', margin: '1rem 0 0' }}>
          {otherKind === 'demo' ? 'Want to hear it work first? ' : 'Rather talk to a person? '}
          <a href={BOOKING_LINKS[otherKind]} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            {otherKind === 'demo' ? 'Book the live demo' : 'Book a call'}
          </a>
        </p>
      </div>
    );
  }

  const bad = (n: string) => errorFields.includes(n);
  const fieldProps = (n: string) => ({
    id: id(n),
    className: 'lead-field',
    'aria-invalid': bad(n) || undefined,
    'aria-describedby': bad(n) ? id('error') : undefined,
    style: { ...inputStyle, ...(bad(n) ? { borderColor: '#F87171' } : {}) },
    ...focusRing,
  });
  const labelFor = (n: string, text: string) => (
    <label htmlFor={id(n)} className={compact ? 'sr-only' : undefined} style={compact ? undefined : labelStyle}>
      {text}
    </label>
  );
  const numberField = (n: keyof typeof values, text: string, placeholder: string) => (
    <div>
      {labelFor(n, text)}
      <input
        {...fieldProps(n)}
        type="text"
        inputMode="decimal"
        placeholder={compact ? text : placeholder}
        value={values[n]}
        onChange={set(n)}
      />
    </div>
  );

  const gap = compact ? '0.75rem' : '1rem';

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap }}>
        <div>
          {labelFor('name', 'Your name')}
          <input
            {...fieldProps('name')}
            type="text"
            autoComplete="name"
            required
            placeholder={compact ? 'Your name' : ''}
            value={values.name}
            onChange={set('name')}
          />
        </div>
        <div>
          {labelFor('email', 'Email address')}
          <input
            {...fieldProps('email')}
            type="email"
            autoComplete="email"
            required
            placeholder={compact ? 'Email address' : ''}
            value={values.email}
            onChange={set('email')}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap }}>
        <div>
          {labelFor('phone', 'Mobile number (optional)')}
          <input
            {...fieldProps('phone')}
            type="tel"
            autoComplete="tel"
            placeholder={compact ? 'Mobile number (optional)' : ''}
            value={values.phone}
            onChange={set('phone')}
          />
        </div>
        {fields.company && (
          <div>
            {labelFor('company', 'Company name')}
            <input
              {...fieldProps('company')}
              type="text"
              autoComplete="organization"
              placeholder={compact ? 'Company name' : ''}
              value={values.company}
              onChange={set('company')}
            />
          </div>
        )}
      </div>

      {(fields.website || fields.serviceArea) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap }}>
          {fields.website && (
            <div>
              {labelFor('website', 'Website address (leave blank if you do not have one)')}
              <input
                {...fieldProps('website')}
                type="text"
                inputMode="url"
                placeholder={compact ? 'Website address' : ''}
                value={values.website}
                onChange={set('website')}
              />
            </div>
          )}
          {fields.serviceArea && (
            <div>
              {labelFor('serviceArea', 'Service area (city and state)')}
              <input
                {...fieldProps('serviceArea')}
                type="text"
                placeholder={compact ? 'Service area (city and state)' : ''}
                value={values.serviceArea}
                onChange={set('serviceArea')}
              />
            </div>
          )}
        </div>
      )}

      {fields.qualification && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap }}>
          {numberField('inboundCallsPerDay', 'Calls per day, roughly', 'For example 12')}
          {numberField('missedCallsPerDay', 'Calls you miss per day, roughly', 'For example 3')}
          {numberField('avgJobValue', 'Average job value ($)', 'For example 9500')}
          {numberField('closeRatePct', 'Close rate, roughly (%)', 'For example 30')}
        </div>
      )}

      {fields.databaseSize && (
        <div>
          {labelFor('databaseSize', 'Old leads and estimates on file, roughly')}
          <input
            {...fieldProps('databaseSize')}
            type="text"
            inputMode="numeric"
            placeholder={compact ? 'Old leads and estimates on file' : 'For example 800'}
            value={values.databaseSize}
            onChange={set('databaseSize')}
          />
        </div>
      )}

      {fields.message && (
        <div>
          {labelFor('message', messageLabel)}
          <textarea
            {...fieldProps('message')}
            rows={3}
            placeholder={compact ? messageLabel : ''}
            value={values.message}
            onChange={set('message')}
            className="lead-field"
            style={{ ...inputStyle, ...(bad('message') ? { borderColor: '#F87171' } : {}), resize: 'vertical' }}
          />
        </div>
      )}

      {/* Honeypot: hidden from people and screen readers. Bots fill it. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor={id('fax')}>Leave this field empty</label>
        <input
          id={id('fax')}
          type="text"
          name="fax"
          tabIndex={-1}
          autoComplete="off"
          value={values.fax}
          onChange={set('fax')}
        />
      </div>

      {/* SMS consent: separate from any terms acceptance, unchecked by default, never required. */}
      <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
        <input
          id={id('sms')}
          type="checkbox"
          className="lead-field"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          style={{ marginTop: 3, width: 18, height: 18, flexShrink: 0, accentColor: '#00D9FF' }}
        />
        <label
          htmlFor={id('sms')}
          style={{ fontSize: compact ? '0.75rem' : '0.8rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.68)' }}
        >
          {SMS_CONSENT_TEXT.split('Privacy Policy and Terms.')[0]}
          <Link to="/privacy-policy" target="_blank" style={linkStyle}>
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link to="/terms-of-service" target="_blank" style={linkStyle}>
            Terms
          </Link>
          .
        </label>
      </div>

      {error && (
        <p id={id('error')} role="alert" style={{ fontSize: '0.82rem', color: '#FCA5A5', margin: 0 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary"
        style={{
          justifyContent: 'center',
          padding: compact ? '0.75rem 1.5rem' : '0.9rem 1.5rem',
          fontSize: '0.9rem',
          opacity: status === 'loading' ? 0.7 : 1,
          cursor: status === 'loading' ? 'wait' : 'pointer',
        }}
      >
        <span>{status === 'loading' ? 'Sending...' : submitLabel}</span>
      </button>

      <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
        <Link to="/privacy-policy" style={linkStyle}>
          Privacy Policy
        </Link>
        {' | '}
        <Link to="/terms-of-service" style={linkStyle}>
          Terms of Service
        </Link>
        {' | '}
        <Link to="/sms-terms" style={linkStyle}>
          SMS Terms
        </Link>
      </p>
    </form>
  );
};

export default LeadForm;
