import { Mail, MapPin, Phone } from "lucide-react";
import type { Customer, SaleRecord } from "@/types";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody } from "@/components/ui/Drawer";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDateTime } from "@/lib/format";

interface CustomerDetailDrawerProps {
  customer: Customer | null;
  sales: SaleRecord[];
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailDrawer({ customer, sales, onOpenChange }: CustomerDetailDrawerProps) {
  const purchases = customer
    ? sales.filter((s) => s.customerDetails.customerName === customer.name)
    : [];
  const totalSpent = purchases.reduce((sum, s) => sum + s.paymentDetails.totalAmount, 0);

  return (
    <Drawer open={customer !== null} onOpenChange={onOpenChange}>
      <DrawerContent width="md">
        {customer && (
          <>
            <DrawerHeader>
              <div className="flex items-center gap-3">
                <Avatar name={customer.name} size="lg" />
                <div>
                  <DrawerTitle>{customer.name}</DrawerTitle>
                  <DrawerDescription>Customer since first purchase</DrawerDescription>
                </div>
              </div>
            </DrawerHeader>
            <DrawerBody className="space-y-5">
              <div className="grid grid-cols-1 gap-2 rounded-xl2 bg-soft p-4 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2 text-ink">
                  <Phone className="h-4 w-4 text-muted" /> {customer.phone || "No phone on file"}
                </p>
                <p className="flex items-center gap-2 text-ink">
                  <Mail className="h-4 w-4 text-muted" /> {customer.email || "No email on file"}
                </p>
                {customer.address && (
                  <p className="col-span-2 flex items-center gap-2 text-ink">
                    <MapPin className="h-4 w-4 text-muted" /> {customer.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl2 border border-line p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Total spent</p>
                  <p className="mt-1 text-xl font-extrabold tabular-money text-ink">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="rounded-xl2 border border-line p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Purchases</p>
                  <p className="mt-1 text-xl font-extrabold text-ink">{purchases.length}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-ink">Purchase history</p>
                {purchases.length === 0 ? (
                  <EmptyState title="No purchases yet" className="py-8" />
                ) : (
                  <ul className="divide-y divide-line rounded-xl2 border border-line">
                    {purchases.map((sale) => (
                      <li key={sale.saleDetails.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-ink">{sale.saleDetails.invoiceNo}</p>
                          <p className="text-xs text-muted">{formatDateTime(sale.saleDetails.date)}</p>
                        </div>
                        <p className="text-sm font-bold tabular-money text-ink">
                          {formatCurrency(sale.paymentDetails.totalAmount)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
