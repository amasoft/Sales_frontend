import { ShoppingCart, Trash2 } from "lucide-react";
import type { CartLine } from "@/types";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/format";

interface CartTableProps {
  lines: CartLine[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  canEditSellingPrice?: boolean;
  onUpdateSellingPrice?: (productId: number, price: number) => void;
}

export function CartTable({ lines, onUpdateQuantity, onRemove, canEditSellingPrice, onUpdateSellingPrice }: CartTableProps) {
  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Cart is empty"
        description="Select products on the left to add them to this sale."
        className="py-14"
      />
    );
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>Product</TH>
          <TH>Qty</TH>
          <TH className="text-right">Unit Cost</TH>
          <TH className="text-right">Selling Price</TH>
          <TH className="text-right">Total</TH>
          <TH className="w-10" />
        </TR>
      </THead>
      <TBody>
        {lines.map((line) => (
          <TR key={line.productId}>
            <TD className="font-medium">{line.name}</TD>
            <TD>
              <QuantityStepper
                value={line.quantity}
                max={line.availableQuantity}
                onChange={(qty) => onUpdateQuantity(line.productId, qty)}
              />
            </TD>
            <TD className="text-right text-muted">{formatCurrency(line.price)}</TD>
            <TD className="text-right">
              {canEditSellingPrice ? (
                <input
                  type="text"
                  min={0}
                  value={line.sellingPrice}
                  onChange={(e) => onUpdateSellingPrice?.(line.productId, Number(e.target.value))}
                  className="w-24 rounded-md border border-line bg-panel px-2 py-1 text-right text-sm tabular-money focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              ) : (
                formatCurrency(line.sellingPrice)
              )}
            </TD>
            <TD className="text-right font-bold tabular-money">
              {formatCurrency(line.sellingPrice * line.quantity)}
            </TD>
            <TD>
              <button
                type="button"
                onClick={() => onRemove(line.productId)}
                aria-label={`Remove ${line.name}`}
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger-soft hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
