import React, { useCallback, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BOOKING_LINKS } from '@/data/company';
import { LeadDialogContext, type OpenLeadOptions } from './leadDialogContext';
import LeadForm from './LeadForm';


const LeadDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<OpenLeadOptions | null>(null);
  const [open, setOpen] = useState(false);

  const openLead = useCallback((o: OpenLeadOptions) => {
    setOptions(o);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openLead }), [openLead]);
  const kind = options?.bookingKind ?? 'discovery';

  return (
    <LeadDialogContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{options?.title || 'Tell us where to reach you'}</DialogTitle>
            <DialogDescription>
              {options?.subtitle ||
                (kind === 'demo'
                  ? 'Takes about a minute. After you send it you can pick a time for your live demo.'
                  : 'Takes about a minute. After you send it you can pick a time to talk.')}
            </DialogDescription>
          </DialogHeader>
          {options && (
                          <LeadForm
                form={options.form}
                bookingKind={kind}
                vertical={options.vertical}
                offerInterest={options.offerInterest}
                submitLabel={options.submitLabel || 'Send it'}
                fields={{ company: true, message: true }}
                messageLabel="Anything we should know? (optional)"
                variant="compact"
              />
          )}
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            Just want to pick a time?{' '}
            <a
              href={BOOKING_LINKS[kind]}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00D9FF', textDecoration: 'underline' }}
            >
              Book now
            </a>
          </p>
        </DialogContent>
      </Dialog>
    </LeadDialogContext.Provider>
  );
};

export default LeadDialogProvider;
