import { Printer } from "lucide-react";
import type { SaleRecord } from "@/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { formatCurrency, formatDateTime } from "@/lib/format";

interface SaleDetailDrawerProps {
  sale: SaleRecord | null;
  onOpenChange: (open: boolean) => void;
  onReprint: (sale: SaleRecord) => void;
}

export function SaleDetailDrawer({ sale, onOpenChange, onReprint }: SaleDetailDrawerProps) {
  return (
    <Drawer open={sale !== null} onOpenChange={onOpenChange}>
      <DrawerContent width="lg">
        {sale && (
          <>
            <DrawerHeader>
              <div>
                <DrawerTitle>{sale.saleDetails.invoiceNo}</DrawerTitle>
                <DrawerDescription>{formatDateTime(sale.saleDetails.date)}</DrawerDescription>
              </div>
            </DrawerHeader>
            <DrawerBody className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl2 bg-soft p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Customer</p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {sale.customerDetails.customerName || "Walk-in Customer"}
                  </p>
                </div>
                <div className="rounded-xl2 bg-soft p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Cashier</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{sale.createdBy?.name ?? "—"}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-ink">Items ({sale.meta.totalQuantity})</p>
                <Table>
                  <THead>
                    <TR>
                      <TH>Product</TH>
                      <TH className="text-center">Qty</TH>
                      <TH className="text-right">Unit Price</TH>
                      <TH className="text-right">Total</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {sale.items.map((item, index) => (
                      <TR key={index}>
                        <TD>{item.productDetails.name}</TD>
                        <TD className="text-center">{item.itemDetails.quantity}</TD>
                        <TD className="text-right text-muted">{formatCurrency(item.itemDetails.unitPrice)}</TD>
                        <TD className="text-right font-semibold">{formatCurrency(item.itemDetails.subtotal)}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>

              <div className="flex items-center justify-between rounded-xl2 border border-line p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Payment method</p>
                  <Badge variant="primary" className="mt-1">
                    {sale.paymentDetails.paymentMethod}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Total paid</p>
                  <p className="text-xl font-extrabold tabular-money text-ink">
                    {formatCurrency(sale.paymentDetails.totalAmount)}
                  </p>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button onClick={() => onReprint(sale)}>
                <Printer className="h-4 w-4" /> View / Print Receipt
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
