/**
 * Domain types for the POS / inventory / sales tracking system.
 * Shapes mirror the live backend contract (see README "Backend contract" section)
 * rather than an idealized schema, so the API layer needs no guesswork adapters.
 */

export type UserRole = "admin" | "manager" | "cashier" | "inventory";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface Product {
  id: number;
  name: string;
  description?: string;
  productCodeNo: string;
  categoryId: number;
  category_name: string;
  productType?: string;
  price: number; // cost price
  sellingPrice: number;
  quantity: number;
  lowStockThreshold?: number;
  imageURL?: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  productCodeNo: string;
  categoryId: number;
  productType?: string;
  price: number;
  sellingPrice: number;
  quantity: number;
  image?: File | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalSpent?: number;
  purchaseCount?: number;
}

export type PaymentMethod = "Cash" | "Transfer" | "POS Terminal" | "Mobile Money";

export const PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Transfer",
  "POS Terminal",
  "Mobile Money",
];

export interface CartLine {
  productId: number;
  name: string;
  price: number; // cost price, shown for margin visibility
  sellingPrice: number;
  quantity: number;
  availableQuantity: number;
}

export interface CreateSalePayload {
  customerName: string;
  customerId?: number;
  paymentMethod: PaymentMethod;
  createdById: number;
  discount?: number;
  items: Array<{
    productId: number;
    quantity: number;
    name: string;
    price: number;
    sellingPrice: number;
  }>;
}

export interface ReceiptItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Receipt {
  receiptNo: string;
  totalAmount: number;
  paymentMethod: PaymentMethod | string;
  discount?: number;
  tax?: number;
  items: ReceiptItem[];
}

export interface SaleSummary {
  invoiceNo: string;
  date: string;
  customerName: string;
  totalAmount: number;
}

export interface CreateSaleResult {
  sale: SaleSummary;
  receipt: Receipt;
}

export interface SaleRecord {
  saleDetails: {
    id: number;
    invoiceNo: string;
    date: string;
  };
  customerDetails: {
    customerName: string;
  };
  createdBy?: {
    name: string;
  };
  paymentDetails: {
    paymentMethod: PaymentMethod | string;
    totalAmount: number;
  };
  meta: {
    totalQuantity: number;
  };
  items: Array<{
    productDetails: { name: string };
    itemDetails: { quantity: number; unitPrice: number; subtotal: number;sellingPrice:number};
  }>;
}

export interface DashboardSummary {
  todayRevenue: number;
  todayProfit: number;
  salesCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  salesTrend: Array<{ label: string; total: number }>;
  paymentBreakdown: Array<{ method: string; total: number }>;
  topProducts: Array<{ name: string; unitsSold: number; revenue: number }>;
  lowStockProducts: Product[];
  recentSales: SaleRecord[];
}

export interface BusinessProfile {
  name: string;
  address: string;
  phone: string;
  email?: string;
  taxRate: number;
  currency: string;
  receiptFooter: string;
  lowStockThreshold: number;
}
