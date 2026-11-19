import type { ReceiptDocumentData } from "@/components/receipt/ReceiptDocument";
import type { SaleRecord } from "@/types";

/**
 * The sales-history endpoint returns totals only (no stored discount/tax split),
 * so a reprinted receipt derives the difference between the item subtotal and
 * the recorded total rather than inventing numbers the backend never sent.
 */
export function receiptFromSaleRecord(sale: SaleRecord): ReceiptDocumentData {
  const subtotal = sale.items.reduce((sum, item) => sum + item.itemDetails.subtotal, 0);
  const total = sale.paymentDetails.totalAmount;
  const difference = total - subtotal;

  return {
    invoiceNo: sale.saleDetails.invoiceNo,
    receiptNo: sale.saleDetails.invoiceNo.replace("INV-", "RCP-"),
    date: sale.saleDetails.date,
    customerName: sale.customerDetails.customerName,
    paymentMethod: sale.paymentDetails.paymentMethod,
    items: sale.items.map((item) => ({
      productName: item.productDetails.name,
      quantity: item.itemDetails.quantity,
      unitPrice: item.itemDetails.unitPrice,
      lineTotal: item.itemDetails.subtotal,
    })),
    subtotal,
    discount: difference < 0 ? -difference : 0,
    tax: difference >= 0 ? difference : 0,
    total,
  };
}
