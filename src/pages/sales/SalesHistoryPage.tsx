import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, Download, Receipt as ReceiptIcon } from "lucide-react";
import type { SaleRecord } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { SaleDetailDrawer } from "@/pages/sales/components/SaleDetailDrawer";
import { ReceiptDialog } from "@/components/receipt/ReceiptDialog";
import { useGetSalesQuery } from "@/api/salesApi";
import { PAYMENT_METHODS } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useDebouncedValue, usePagination } from "@/lib/hooks";
import { receiptFromSaleRecord } from "@/lib/receiptFromSale";
import { downloadSalesCsv } from "@/lib/exportCsv";

export default function SalesHistoryPage() {
  const [searchParams] = useSearchParams();
  const { data: sales = [], isLoading, isError } = useGetSalesQuery();

  const [term, setTerm] = useState(searchParams.get("q") ?? "");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const debouncedTerm = useDebouncedValue(term, 200);

  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [receiptSale, setReceiptSale] = useState<SaleRecord | null>(null);

  const filtered = useMemo(() => {
    const q = debouncedTerm.trim().toLowerCase();
    return [...sales]
      .filter((s) => {
        const matchesTerm =
          !q ||
          s.saleDetails.invoiceNo.toLowerCase().includes(q) ||
          s.customerDetails.customerName?.toLowerCase().includes(q);
        const matchesPayment = paymentFilter === "all" || s.paymentDetails.paymentMethod === paymentFilter;
        return matchesTerm && matchesPayment;
      })
      .sort((a, b) => new Date(b.saleDetails.date).getTime() - new Date(a.saleDetails.date).getTime());
  }, [sales, debouncedTerm, paymentFilter]);

  const { page, pageCount, pageItems, totalItems, pageSize, setPage } = usePagination(filtered, 8);
console.log('pageitems'+JSON.stringify(pageItems))
  return (
    <>
      <PageHeader
        title="Sales History"
        description="Track completed sales, payments, receipts, and customer purchases."
        actions={
          <Button variant="secondary" onClick={() => downloadSalesCsv(filtered)} disabled={filtered.length === 0}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <SearchInput
            value={term}
            onChange={setTerm}
            placeholder="Search invoice or customer…"
            containerClassName="flex-1"
          />
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payment methods</SelectItem>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <PageSpinner label="Loading sales history…" />
        ) : isError ? (
          <EmptyState
            icon={AlertTriangle}
            title="Couldn't load sales"
            description="Check that the API is running, then refresh the page."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ReceiptIcon}
            title="No sales found"
            description="Sales you record from the POS screen will show up here."
          />
        ) : (
          <>
            <Table bare>
              <THead>
                <TR>
                  <TH>Invoice</TH>
                  <TH>Customer</TH>
                  <TH className="text-center">Items</TH>
                  <TH className="text-center">unit Price</TH>
                  <TH className="text-center">selling price </TH>
                  <TH className="text-right">Total</TH>
                  <TH>Payment</TH>
                  <TH>Date</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {pageItems.map((sale) => (
                  <TR key={sale.saleDetails.id}>
                    <TD className="font-semibold text-ink">{sale.saleDetails.invoiceNo}</TD>
                    <TD>{sale.customerDetails.customerName || "Walk-in Customer"}</TD>
                    <TD className="text-center">{sale.meta.totalQuantity}</TD>
                    {/* <TD>{sale.items.itemDetails.unitPrice}</TD> */}
                    {sale.items.map((item, index) => (
  <TD key={index}>
    {item.itemDetails.unitPrice}
  </TD>
  
))}
          {sale.items.map((item, index) => (
  <TD key={index}>
    {item.itemDetails.sellingPrice}
  </TD>
  
))}
                    <TD className="text-center font-bold tabular-money">
                      {formatCurrency(sale.paymentDetails.totalAmount)}
                    </TD>
                    <TD>
                      <Badge variant="neutral">{sale.paymentDetails.paymentMethod}</Badge>
                    </TD>
                    <TD className="text-muted">{formatDateTime(sale.saleDetails.date)}</TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedSale(sale)}>
                          Details
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setReceiptSale(sale)}>
                          Receipt
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <Pagination page={page} pageCount={pageCount} totalItems={totalItems} pageSize={pageSize} onPageChange={setPage} />
          </>
        )}
      </Card>

      <SaleDetailDrawer
        sale={selectedSale}
        onOpenChange={(open) => !open && setSelectedSale(null)}
        onReprint={(sale) => {
          setSelectedSale(null);
          setReceiptSale(sale);
        }}
      />

      <ReceiptDialog
        open={receiptSale !== null}
        onClose={() => setReceiptSale(null)}
        receipt={receiptSale ? receiptFromSaleRecord(receiptSale) : null}
        title={receiptSale?.saleDetails.invoiceNo ?? "Receipt"}
        description="Reprint this receipt for the customer."
      />
    </>
  );
}
