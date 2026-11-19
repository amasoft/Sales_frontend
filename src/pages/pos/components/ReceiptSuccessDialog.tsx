import { CheckCircle2 } from "lucide-react";
import { ReceiptDialog } from "@/components/receipt/ReceiptDialog";
import type { ReceiptDocumentData } from "@/components/receipt/ReceiptDocument";

interface ReceiptSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  receipt: ReceiptDocumentData | null;
}

export function ReceiptSuccessDialog({ open, onClose, receipt }: ReceiptSuccessDialogProps) {
  return (
    <ReceiptDialog
      open={open}
      onClose={onClose}
      receipt={receipt}
      title="Sale recorded"
      description="Print or save this receipt for the customer."
      closeLabel="Start new sale"
      icon={
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="h-5 w-5" />
        </div>
      }
    />
  );
}
