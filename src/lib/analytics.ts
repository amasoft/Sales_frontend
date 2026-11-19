import { isToday, format, parseISO } from "date-fns";
import type { DashboardSummary, Product, SaleRecord } from "@/types";
import { getStockStatus } from "@/lib/stock";

function safeDate(value: string): Date {
  try {
    return parseISO(value);
  } catch {
    return new Date(value);
  }
}

/**
 * Derives dashboard metrics from the products + sales lists already loaded
 * elsewhere in the app (RTK Query caches both), rather than depending on a
 * dedicated /dashboard/summary endpoint the backend may not implement yet.
 */
export function buildDashboardSummary(products: Product[], sales: SaleRecord[]): DashboardSummary {
  const todaySales = sales.filter((s) => isToday(safeDate(s.saleDetails.date)));
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.paymentDetails.totalAmount, 0);

  // Profit estimate: sum of (sellingPrice - costPrice) * qty per sold line item,
  // matched against the current product cost price where the product still exists.
  // const todayProfit = todaySales.reduce((sum, sale) => {
  //   const saleProfit = sale.items.reduce((lineSum, item) => {
  //     const match = products.find((p) => p.name === item.productDetails.name);
  //     const cost = match?.price ?? 0;
  //     return lineSum + (item.itemDetails.unitPrice - cost) * item.itemDetails.quantity;
  //   }, 0);
  //   return sum + saleProfit;
  // }, 0);
const todayProfit = todaySales.reduce((sum, sale) => {
  console.log("========== NEW SALE ==========");
  console.log("Current Sum:", sum);
  console.log("Current Sale:", sale);
  console.log("Sale Items:", sale.items);

  const saleProfit = sale.items.reduce((lineSum, item) => {
    console.log("---------- SALE ITEM ----------");

    console.log("Current Line Sum:", lineSum);
    console.log("Current Item:", item);

    const match = products.find(
      (p) => p.name === item.productDetails.name
    );

    console.log("Matched Product:", match);

    const cost = match?.price ?? 0;
const sellingPricevalue=item.itemDetails.sellingPrice
    console.log("Product Cost:", cost);
    console.log("Selling Price:", item.itemDetails.unitPrice);
    console.log("Quantity:", item.itemDetails.quantity);

    const itemProfit =
      (sellingPricevalue - cost) *
      item.itemDetails.quantity;

    console.log("Item Profit:", itemProfit);

    const newLineSum = lineSum + itemProfit;

    console.log("Updated Line Sum:", newLineSum);

    return newLineSum;
  }, 0);

  console.log("Total Profit From This Sale:", saleProfit);

  const newSum = sum + saleProfit;

  console.log("Updated Overall Profit:", newSum);

  return newSum;
}, 0);

console.log("========== FINAL TODAY PROFIT ==========");
console.log("Today Profit:", todayProfit);
  const lowStockProducts = products.filter((p) => getStockStatus(p) !== "in-stock");

  const trendByDay = new Map<string, number>();
  sales.forEach((s) => {
    const key = format(safeDate(s.saleDetails.date), "EEE");
    trendByDay.set(key, (trendByDay.get(key) ?? 0) + s.paymentDetails.totalAmount);
  });
  const salesTrend = Array.from(trendByDay.entries()).map(([label, total]) => ({ label, total }));

  const paymentTotals = new Map<string, number>();
  sales.forEach((s) => {
    const method = s.paymentDetails.paymentMethod || "Unknown";
    paymentTotals.set(method, (paymentTotals.get(method) ?? 0) + s.paymentDetails.totalAmount);
  });
  const paymentBreakdown = Array.from(paymentTotals.entries()).map(([method, total]) => ({
    method,
    total,
  }));

  const productTotals = new Map<string, { unitsSold: number; revenue: number }>();
  sales.forEach((s) => {
    s.items.forEach((item) => {
      const key = item.productDetails.name;
      const existing = productTotals.get(key) ?? { unitsSold: 0, revenue: 0 };
      existing.unitsSold += item.itemDetails.quantity;
      existing.revenue += item.itemDetails.subtotal;
      productTotals.set(key, existing);
    });
  });
  const topProducts = Array.from(productTotals.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const recentSales = [...sales]
    .sort((a, b) => safeDate(b.saleDetails.date).getTime() - safeDate(a.saleDetails.date).getTime())
    .slice(0, 6);

  return {
    todayRevenue,
    todayProfit,
    salesCount: todaySales.length,
    lowStockCount: lowStockProducts.filter((p) => getStockStatus(p) === "low-stock").length,
    outOfStockCount: lowStockProducts.filter((p) => getStockStatus(p) === "out-of-stock").length,
    salesTrend,
    paymentBreakdown,
    topProducts,
    lowStockProducts: lowStockProducts.slice(0, 6),
    recentSales,
  };
}
