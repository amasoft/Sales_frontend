import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductPicker } from "@/pages/pos/components/ProductPicker";
import { CartTable } from "@/pages/pos/components/CartTable";
import { CustomerPicker, WALK_IN_VALUE } from "@/pages/pos/components/CustomerPicker";
import { PaymentSummaryPanel } from "@/pages/pos/components/PaymentSummaryPanel";
import { ReceiptSuccessDialog } from "@/pages/pos/components/ReceiptSuccessDialog";
import { HeldSalesMenu } from "@/pages/pos/components/HeldSalesMenu";
import { readHeldSales, writeHeldSales, type HeldSale } from "@/pages/pos/heldSales";
import { useCart } from "@/pages/pos/useCart";
import { useGetProductsQuery } from "@/api/productsApi";
import { useGetCustomersQuery } from "@/api/customersApi";
import { useCreateSaleMutation } from "@/api/salesApi";
import { useAppSelector } from "@/app/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { PAYMENT_METHODS, type PaymentMethod } from "@/types";
import type { ReceiptDocumentData } from "@/components/receipt/ReceiptDocument";

export default function MakeSalePage() {
  const user = useAppSelector(selectCurrentUser);
  const business = useAppSelector((s) => s.settings.business);
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductsQuery();
  const { data: customers = [] } = useGetCustomersQuery();
  const [createSale, { isLoading: isSubmitting }] = useCreateSaleMutation();

  const cart = useCart();
  const [customerValue, setCustomerValue] = useState<string>(WALK_IN_VALUE);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [receipt, setReceipt] = useState<ReceiptDocumentData | null>(null);
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);

  useEffect(() => {
    setHeldSales(readHeldSales());
  }, []);

  const selectedCustomer = customers.find((c) => String(c.id) === customerValue);
  const customerName = customerValue === WALK_IN_VALUE ? "Walk-in Customer" : selectedCustomer?.name ?? "";

  const resetSale = () => {
    cart.clear();
    setCustomerValue(WALK_IN_VALUE);
    setDiscount(0);
    setPaymentMethod(PAYMENT_METHODS[0]);
  };

  const handleHoldSale = () => {
    if (cart.lines.length === 0) {
      toast.error("Add at least one product before holding a sale");
      return;
    }
    const held: HeldSale = {
      id: crypto.randomUUID(),
      customerValue,
      customerName,
      lines: cart.lines,
      discount,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };
    const next = [held, ...heldSales];
    setHeldSales(next);
    writeHeldSales(next);
    resetSale();
    toast.success("Sale held — resume it anytime from Held Sales");
  };

  const handleResumeSale = (sale: HeldSale) => {
    cart.replace(sale.lines);
    setCustomerValue(sale.customerValue);
    setDiscount(sale.discount);
    setPaymentMethod(sale.paymentMethod);
    const next = heldSales.filter((s) => s.id !== sale.id);
    setHeldSales(next);
    writeHeldSales(next);
  };

  const handleDiscardHeld = (id: string) => {
    const next = heldSales.filter((s) => s.id !== id);
    setHeldSales(next);
    writeHeldSales(next);
  };

  const handleRecordSale = async () => {
    if (cart.lines.length === 0) {
      toast.error("Add at least one product to record a sale");
      return;
    }
    if (customerValue !== WALK_IN_VALUE && !selectedCustomer) {
      toast.error("Select a valid customer or choose Walk-in Customer");
      return;
    }

    const taxRate = business.taxRate;
    const taxableAmount = Math.max(cart.subtotal - discount, 0);
    const tax = taxableAmount * (taxRate / 100);

    try {
      const result = await createSale({
        customerName,
        customerId: selectedCustomer?.id,
        paymentMethod,
        createdById: user?.id ?? 1,
        discount,
        items: cart.lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          name: line.name,
          price: line.price,
          sellingPrice: line.sellingPrice,
        })),
      }).unwrap();

      setReceipt({
        invoiceNo: result.sale.invoiceNo,
        receiptNo: result.receipt.receiptNo,
        date: result.sale.date,
        customerName: result.sale.customerName,
        paymentMethod: result.receipt.paymentMethod,
        items: result.receipt.items,
        subtotal: cart.subtotal,
        discount,
        tax,
        // The backend's totalAmount only reflects item prices minus discount —
        // it has no concept of tax, so the receipt total is computed here to
        // stay consistent with the subtotal/discount/tax lines shown above it.
        total: taxableAmount + tax,
      });
      resetSale();
      toast.success("Sale recorded");
    } catch (error) {
      toast.error((error as { data?: { message?: string } })?.data?.message ?? "Couldn't record this sale");
    }
  };

  return (
    <>
      <PageHeader
        title="Record a New Sale"
        description="Select customer, add products, collect payment, print receipt."
        actions={
          <div className="flex items-center gap-2">
            <HeldSalesMenu heldSales={heldSales} onResume={handleResumeSale} onDiscard={handleDiscardHeld} />
            {cart.lines.length > 0 && (
              <>
                <Badge variant="primary">{cart.totalItems} item{cart.totalItems === 1 ? "" : "s"} in cart</Badge>
                <Button variant="ghost" size="sm" onClick={resetSale}>
                  <XCircle className="h-4 w-4" /> Clear
                </Button>
              </>
            )}
          </div>
        }
      />

      {productsLoading ? (
        <PageSpinner label="Loading products…" />
      ) : productsError ? (
        <Card>
          <EmptyState
            icon={AlertTriangle}
            title="Couldn't load products"
            description="Check that the API is running, then refresh the page."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1.55fr_0.9fr]">
          <Card>
            <CardContent>
              <p className="mb-3 text-sm font-bold text-ink">Customer</p>
              <CustomerPicker customers={customers} value={customerValue} onChange={setCustomerValue} />
              <div className="mt-5 border-t border-line pt-4">
                <p className="mb-3 text-sm font-bold text-ink">Products</p>
                <ProductPicker products={products} onSelect={cart.addProduct} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="mb-3 text-sm font-bold text-ink">Cart</p>
              <CartTable
                lines={cart.lines}
                onUpdateQuantity={cart.updateQuantity}
                onRemove={cart.removeProduct}
                canEditSellingPrice={user?.role === "admin" || user?.role === "manager"}
                onUpdateSellingPrice={cart.updateSellingPrice}
              />
            </CardContent>
          </Card>

          <PaymentSummaryPanel
            subtotal={cart.subtotal}
            discount={discount}
            onDiscountChange={setDiscount}
            taxRate={business.taxRate}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onRecordSale={handleRecordSale}
            onHoldSale={handleHoldSale}
            isSubmitting={isSubmitting}
            disabled={cart.lines.length === 0}
          />
        </div>
      )}

      <ReceiptSuccessDialog open={receipt !== null} onClose={() => setReceipt(null)} receipt={receipt} />
    </>
  );
}
