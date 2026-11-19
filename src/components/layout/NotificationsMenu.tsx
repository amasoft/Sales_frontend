import { Bell } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/api/productsApi";
import { getStockStatus } from "@/lib/stock";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function NotificationsMenu() {
  const { data: products = [] } = useGetProductsQuery();
  const alerts = products.filter((p) => getStockStatus(p) !== "in-stock");

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Stock alerts">
          <Bell className="h-4 w-4" />
          {alerts.length > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger" />
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="z-50 w-80 rounded-xl2 border border-line bg-panel shadow-popover animate-fade-in"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-bold text-ink">Stock alerts</p>
            <p className="text-xs text-muted">Products that need restocking soon</p>
          </div>
          <div className="max-h-72 overflow-y-auto scrollbar-thin">
            {alerts.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted">All products are well stocked.</p>
            ) : (
              alerts.slice(0, 8).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-muted">{p.category_name}</p>
                  </div>
                  <Badge variant={p.quantity <= 0 ? "danger" : "warning"}>{p.quantity} left</Badge>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-line p-2">
            <Button asChild variant="ghost" size="sm" className="w-full justify-center">
              <Link to="/app/products">View all products</Link>
            </Button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
