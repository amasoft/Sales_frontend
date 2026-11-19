import type { CartLine, PaymentMethod } from "@/types";

export interface HeldSale {
  id: string;
  customerValue: string;
  customerName: string;
  lines: CartLine[];
  discount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

const STORAGE_KEY = "chingi_pos_held_sales";

export function readHeldSales(): HeldSale[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HeldSale[]) : [];
  } catch {
    return [];
  }
}

export function writeHeldSales(sales: HeldSale[]): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}
