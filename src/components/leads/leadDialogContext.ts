import React, { createContext, useCallback, useContext } from 'react';
import type { BookingKind } from '@/data/company';

export interface OpenLeadOptions {
  /** Form id sent to GHL, for example "navbar-get-started". */
  form: string;
  /** discovery = sales call, demo = live AI demo. */
  bookingKind?: BookingKind;
  vertical?: string;
  offerInterest?: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
}

interface LeadDialogContextValue {
  openLead: (options: OpenLeadOptions) => void;
}

export const LeadDialogContext = createContext<LeadDialogContextValue>({ openLead: () => undefined });

export const useLeadDialog = () => useContext(LeadDialogContext);

/**
 * Click handler for a CTA anchor that already has the GHL booking link as its href.
 * A plain click opens the lead form. Ctrl/Cmd/Shift/middle click still opens the booking page.
 */
export function useLeadCta(options: OpenLeadOptions) {
  const { openLead } = useLeadDialog();
  const { form, bookingKind, vertical, offerInterest, title, subtitle, submitLabel } = options;
  return useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      openLead({ form, bookingKind, vertical, offerInterest, title, subtitle, submitLabel });
    },
    [openLead, form, bookingKind, vertical, offerInterest, title, subtitle, submitLabel],
  );
}
