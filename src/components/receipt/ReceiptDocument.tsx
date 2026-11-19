import type { BusinessProfile, ReceiptItem } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/format";

export interface ReceiptDocumentData {
  invoiceNo: string;
  receiptNo: string;
  date: string;
  customerName: string;
  paymentMethod: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export function ReceiptDocument({ business, receipt }: { business: BusinessProfile; receipt: ReceiptDocumentData }) {
  return (
    <div id="receipt-print-area" className="mx-auto max-w-md rounded-xl2 border border-line bg-panel p-6 font-mono">
      <div className="text-center">
        <h3 className="text-lg font-extrabold text-ink">{business.name}</h3>
        <p className="mt-1 text-xs text-muted">{business.address}</p>
        <p className="text-xs text-muted">{business.phone}</p>
      </div>

      <div className="my-4 border-t border-dashed border-line" />

      <div className="space-y-1 text-xs text-ink">
        <Row label="Invoice" value={receipt.invoiceNo} bold />
        <Row label="Receipt" value={receipt.receiptNo} bold />
        <Row label="Date" value={formatDateTime(receipt.date)} />
        <Row label="Customer" value={receipt.customerName || "Walk-in Customer"} />
        <Row label="Payment" value={receipt.paymentMethod} />
      </div>

      <div className="my-4 border-t border-dashed border-line" />

      <div className="space-y-1.5">
        {receipt.items.map((item, index) => (
          <div key={`${item.productName}-${index}`} className="flex justify-between gap-3 text-xs">
            <span className="text-ink">
              {item.productName} <span className="text-muted">x{item.quantity}</span>
            </span>
            <span className="font-semibold tabular-money text-ink">{formatCurrency(item.lineTotal)}</span>
          </div>
        ))}
      </div>

      <div className="my-4 border-t border-dashed border-line" />

      <div className="space-y-1 text-xs">
        <Row label="Subtotal" value={formatCurrency(receipt.subtotal)} />
        <Row label="Discount" value={`-${formatCurrency(receipt.discount)}`} />
        <Row label="Tax" value={formatCurrency(receipt.tax)} />
      </div>

      <div className="mt-3 flex justify-between border-t border-line pt-3">
        <span className="text-sm font-extrabold text-ink">TOTAL</span>
        <span className="text-lg font-extrabold tabular-money text-ink">{formatCurrency(receipt.total)}</span>
      </div>

      <div className="my-4 border-t border-dashed border-line" />

      <p className="text-center text-[11px] leading-relaxed text-muted">{business.receiptFooter}</p>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className={bold ? "font-bold text-ink" : "text-ink"}>{value}</span>
    </div>
  );
}
