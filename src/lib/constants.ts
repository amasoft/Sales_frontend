import type { BusinessProfile, Category } from "@/types";

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  name: import.meta.env.VITE_BUSINESS_NAME || "Chingi Gadgets Store",
  address:
    import.meta.env.VITE_BUSINESS_ADDRESS ||
    "No 12, Medical Road, Computer Village, Ikeja",
  phone: import.meta.env.VITE_BUSINESS_PHONE || "234-8130523194",
  email: "",
  taxRate: 7.5,
  currency: "NGN",
  receiptFooter:
    "Thank you for shopping with us. Goods sold are not returnable after payment.",
  lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
};

// Fallback categories used until GET /categories is available on the backend;
// the products form always prefers server-provided categories when present.
export const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "Mobile Phones" },
  { id: 2, name: "Laptops" },
  { id: 3, name: "Accessories" },
];

export const NAV_SECTIONS = {
  overview: "Overview",
  operations: "Operations",
  manage: "Manage",
} as const;
