
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({ open, setOpen, trigger }) => (
  <Dialog open={open} onOpenChange={setOpen}>
    {trigger && (
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
    )}
    <DialogContent className="max-w-lg w-full">
      <DialogHeader>
        <DialogTitle>Schedule a Call</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[600px] w-full rounded-md">
        <div className="w-full">
          <div>
            <iframe
              src="https://link.dlgsolution.com/widget/booking/RttNV383xfqjPa87pdZU"
              style={{ width: "100%", border: "none", overflow: "visible" }}
              scrolling="yes"
              id="8QRwv6sOWLlYQYaPKPUv_1745349963878"
              height={700}
              title="Schedule a Call"
            ></iframe>
            <script src="https://link.dlgsolution.com/js/form_embed.js" type="text/javascript"></script>
          </div>
        </div>
      </ScrollArea>
      <DialogClose asChild>
        <button
          className="mt-4 w-full bg-voiceai-primary text-white py-2 rounded-md hover:bg-voiceai-secondary transition"
          type="button"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);

export default CalendarDialog;
