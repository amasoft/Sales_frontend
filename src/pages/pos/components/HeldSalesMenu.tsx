import * as Popover from "@radix-ui/react-popover";
import { PauseCircle, Trash2 } from "lucide-react";
import type { HeldSale } from "@/pages/pos/heldSales";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDateTime } from "@/lib/format";

interface HeldSalesMenuProps {
  heldSales: HeldSale[];
  onResume: (sale: HeldSale) => void;
  onDiscard: (id: string) => void;
}

export function HeldSalesMenu({ heldSales, onResume, onDiscard }: HeldSalesMenuProps) {
  if (heldSales.length === 0) return null;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary" size="sm">
          <PauseCircle className="h-4 w-4" /> Held Sales
          <Badge variant="primary">{heldSales.length}</Badge>
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="z-50 w-80 rounded-xl2 border border-line bg-panel shadow-popover animate-fade-in"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-bold text-ink">Held sales</p>
            <p className="text-xs text-muted">Resume where you left off</p>
          </div>
          <ul className="max-h-72 divide-y divide-line overflow-y-auto scrollbar-thin">
            {heldSales.map((sale) => (
              <li key={sale.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <button type="button" onClick={() => onResume(sale)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold text-ink">
                    {sale.customerName || "Walk-in Customer"}
                  </p>
                  <p className="text-xs text-muted">
                    {sale.lines.length} item{sale.lines.length === 1 ? "" : "s"} ·{" "}
                    {formatCurrency(sale.lines.reduce((s, l) => s + l.sellingPrice * l.quantity, 0))} ·{" "}
                    {formatDateTime(sale.createdAt)}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onDiscard(sale.id)}
                  aria-label="Discard held sale"
                  className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
