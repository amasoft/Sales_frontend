import type { SaleRecord } from "@/types";
import { formatDateTime } from "@/lib/format";

function toCsvValue(value: string | number): string {
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function downloadSalesCsv(sales: SaleRecord[]): void {
  const header = ["Invoice", "Customer", "Cashier", "Items", "Total", "Payment Method", "Date"];
  const rows = sales.map((s) => [
    s.saleDetails.invoiceNo,
    s.customerDetails.customerName || "Walk-in Customer",
    s.createdBy?.name ?? "",
    s.meta.totalQuantity,
    s.paymentDetails.totalAmount,
    s.paymentDetails.paymentMethod,
    formatDateTime(s.saleDetails.date),
  ]);

  const csv = [header, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sales-history-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
