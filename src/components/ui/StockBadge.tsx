import { Badge } from "@/components/ui/Badge";
import { getStockStatus, STOCK_STATUS_LABEL } from "@/lib/stock";
import type { Product } from "@/types";

const STATUS_VARIANT = {
  "in-stock": "success",
  "low-stock": "warning",
  "out-of-stock": "danger",
} as const;

export function StockBadge({ product }: { product: Pick<Product, "quantity" | "lowStockThreshold"> }) {
  const status = getStockStatus(product);
  return <Badge variant={STATUS_VARIANT[status]}>{STOCK_STATUS_LABEL[status]}</Badge>;
}
