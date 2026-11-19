import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AlertTriangle, Package, Pencil, Plus, Trash2 } from "lucide-react";
import type { Product, StockStatus } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { StockBadge } from "@/components/ui/StockBadge";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { ProductFormDrawer } from "@/pages/products/components/ProductFormDrawer";
import { useGetProductsQuery, useDeleteProductMutation } from "@/api/productsApi";
import { FALLBACK_CATEGORIES } from "@/lib/constants";
import { getStockStatus } from "@/lib/stock";
import { formatCurrency } from "@/lib/format";
import { useDebouncedValue, usePagination } from "@/lib/hooks";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const [term, setTerm] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<string>("all");
  const [stockStatus, setStockStatus] = useState<string>("all");
  const debouncedTerm = useDebouncedValue(term, 200);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = debouncedTerm.trim().toLowerCase();
    return products.filter((p) => {
      const matchesTerm =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.productCodeNo?.toLowerCase().includes(q) ||
      p.category_name?.toLowerCase().includes(q);
      console.log(`q values::;${matchesTerm}`)
      const matchesCategory = category === "all" || String(p.categoryId) === category;
      const matchesStock = stockStatus === "all" || getStockStatus(p) === (stockStatus as StockStatus);
      return matchesTerm && matchesCategory && matchesStock;
    });
  }, [products, debouncedTerm, category, stockStatus]);

  const { page, pageCount, pageItems, totalItems, pageSize, setPage } = usePagination(filtered, 8);

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };
  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct.id).unwrap();
      toast.success(`${deletingProduct.name} deleted`);
      setDeletingProduct(null);
    } catch (error) {
      toast.error((error as { data?: { message?: string } })?.data?.message ?? "Couldn't delete this product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage inventory, pricing, and product status."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
          <SearchInput value={term} onChange={setTerm} placeholder="Search product, SKU, category…" containerClassName="flex-1" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {FALLBACK_CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stockStatus} onValueChange={setStockStatus}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Stock status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stock levels</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <PageSpinner label="Loading products…" />
        ) : isError ? (
          <EmptyState
            icon={AlertTriangle}
            title="Couldn't load products"
            description="Check that the API is running, then refresh the page."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description="Try adjusting your filters, or add your first product."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            }
          />
        ) : (
          <>
            <Table bare>
              <THead>
                <TR>
                  <TH>Product</TH>
                  <TH>SKU</TH>
                  <TH>Category</TH>
                  <TH className="text-center">Qty</TH>
                  <TH className="text-right">Cost</TH>
                  <TH className="text-right">Selling</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {pageItems.map((product) => (
                  <TR key={product.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-soft">
                          {product.imageURL ? (
                            <img src={product.imageURL} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-4 w-4 text-muted" />
                          )}
                        </div>
                        <span className="font-semibold text-ink">{product.name}</span>
                      </div>
                    </TD>
                    <TD className="text-muted">{product.productCodeNo}</TD>
                    <TD className="text-muted">{product.category_name}</TD>
                    <TD className="text-center font-semibold">{product.quantity}</TD>
                    <TD className="text-right text-muted">{formatCurrency(product.price)}</TD>
                    <TD className="text-right font-semibold">{formatCurrency(product.sellingPrice)}</TD>
                    <TD>
                      <StockBadge product={product} />
                    </TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(product)} aria-label="Edit product">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingProduct(product)}
                          aria-label="Delete product"
                          className="text-danger hover:bg-danger-soft"
                        >
                          <Trash2 className="h-4 w-4" />
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

      <ProductFormDrawer open={formOpen} onOpenChange={setFormOpen} product={editingProduct} />

      <ConfirmDialog
        open={deletingProduct !== null}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title={`Delete ${deletingProduct?.name ?? "product"}?`}
        description="This removes the product from your catalog. This can't be undone."
        confirmLabel="Delete product"
        destructive
        loading={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
