import { Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { ReceiptDocument, type ReceiptDocumentData } from "@/components/receipt/ReceiptDocument";
import { useAppSelector } from "@/app/hooks";

interface ReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  receipt: ReceiptDocumentData | null;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  closeLabel?: string;
}

export function ReceiptDialog({
  open,
  onClose,
  receipt,
  title = "Receipt",
  description = "Print or save this receipt.",
  icon,
  secondaryAction,
  closeLabel = "Close",
}: ReceiptDialogProps) {
  const business = useAppSelector((s) => s.settings.business);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent size="lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogBody className="bg-soft">{receipt && <ReceiptDocument business={business} receipt={receipt} />}</DialogBody>
        <DialogFooter>
          {secondaryAction}
          <Button variant="secondary" onClick={onClose}>
            {closeLabel}
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
