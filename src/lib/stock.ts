import type { Product, StockStatus } from "@/types";
import { DEFAULT_LOW_STOCK_THRESHOLD } from "@/lib/constants";

export function getStockStatus(product: Pick<Product, "quantity" | "lowStockThreshold">): StockStatus {
  if (product.quantity <= 0) return "out-of-stock";
  const threshold = product.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD;
  if (product.quantity <= threshold) return "low-stock";
  return "in-stock";
}

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};
