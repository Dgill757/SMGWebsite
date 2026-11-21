import React from 'react';
import { BOOKING_LINKS } from '@/data/company';
import { useLeadCta, type OpenLeadOptions } from './leadDialogContext';

type LeadCtaLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & OpenLeadOptions;

/**
 * A CTA that opens the lead form (which posts to /api/lead and then offers the
 * booking link). The href is the GHL booking page, so open-in-new-tab, middle
 * click and no-JS still work.
 */
const LeadCtaLink: React.FC<LeadCtaLinkProps> = ({
  form,
  bookingKind = 'discovery',
  vertical,
  offerInterest,
  title,
  subtitle,
  submitLabel,
  onClick,
  children,
  ...rest
}) => {
  const open = useLeadCta({ form, bookingKind, vertical, offerInterest, title, subtitle, submitLabel });
  return (
    <a
      href={BOOKING_LINKS[bookingKind]}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        open(e);
      }}
    >
      {children}
    </a>
  );
};

export default LeadCtaLink;
