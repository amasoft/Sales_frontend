import { PauseCircle } from "lucide-react";
import { PAYMENT_METHODS, type PaymentMethod } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { currencySymbol, formatCurrency } from "@/lib/format";

interface PaymentSummaryPanelProps {
  subtotal: number;
  discount: number;
  onDiscountChange: (value: number) => void;
  taxRate: number;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onRecordSale: () => void;
  onHoldSale: () => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export function PaymentSummaryPanel({
  subtotal,
  discount,
  onDiscountChange,
  taxRate,
  paymentMethod,
  onPaymentMethodChange,
  onRecordSale,
  onHoldSale,
  isSubmitting,
  disabled,
}: PaymentSummaryPanelProps) {
  const taxableAmount = Math.max(subtotal - discount, 0);
  const tax = taxableAmount * (taxRate / 100);
  const total = taxableAmount + tax;

  return (
    <Card className="sticky top-20 p-5">
      <p className="text-sm font-bold text-ink">Payment Summary</p>

      <div className="mt-3">
        <Label>Payment method</Label>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => onPaymentMethodChange(method)}
              className={cn(
                "rounded-lg border px-2 py-2 text-center text-xs font-bold transition-colors",
                paymentMethod === method
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-line text-muted hover:border-primary/30 hover:text-ink"
              )}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="discount">Discount ({currencySymbol()})</Label>
        <Input
          id="discount"
          type="number"
          min={0}
          value={discount}
          onChange={(e) => onDiscountChange(Math.max(0, Number(e.target.value)))}
        />
      </div>

      <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span className="font-semibold tabular-money text-ink">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Discount</span>
          <span className="font-semibold tabular-money text-ink">-{formatCurrency(discount)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Tax ({taxRate}%)</span>
          <span className="font-semibold tabular-money text-ink">{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm font-extrabold text-ink">Total</span>
        <span className="text-2xl font-extrabold tabular-money text-primary">{formatCurrency(total)}</span>
      </div>

      <Button size="lg" className="mt-4 w-full" onClick={onRecordSale} loading={isSubmitting} disabled={disabled}>
        Record Sale
      </Button>
      <Button
        variant="secondary"
        size="md"
        className="mt-2 w-full"
        onClick={onHoldSale}
        disabled={disabled || isSubmitting}
      >
        <PauseCircle className="h-4 w-4" /> Hold Sale
      </Button>
    </Card>
  );
}
