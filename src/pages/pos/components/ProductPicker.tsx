import { useMemo, useState } from "react";
import { PackageSearch, Plus } from "lucide-react";
import type { Product } from "@/types";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/format";
import { useDebouncedValue } from "@/lib/hooks";
import { cn } from "@/lib/cn";

interface ProductPickerProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function ProductPicker({ products, onSelect }: ProductPickerProps) {
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebouncedValue(term, 150);

  const filtered = useMemo(() => {
    const q = debouncedTerm.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.productCodeNo?.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q)
    );
  }, [products, debouncedTerm]);

  return (
    <div>
      <SearchInput
        value={term}
        onChange={setTerm}
        placeholder="Search by product name, SKU, or category…"
        autoFocus
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No matching products"
          description="Try a different name, SKU, or category."
          className="py-12"
        />
      ) : (
        <ul className="mt-3 max-h-[520px] space-y-1.5 overflow-y-auto scrollbar-thin">
          {filtered.map((product) => {
            const outOfStock = product.quantity <= 0;
            const low = !outOfStock && product.quantity <= (product.lowStockThreshold ?? 5);
            return (
              <li key={product.id}>
                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={() => onSelect(product)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl2 border border-line bg-panel p-2.5 text-left transition-colors",
                    outOfStock ? "cursor-not-allowed opacity-50" : "hover:border-primary/40 hover:bg-primary-soft/40"
                  )}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary-soft to-soft">
                    {product.imageURL ? (
                      <img src={product.imageURL} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <PackageSearch className="h-5 w-5 text-primary/50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
                    <p className="truncate text-xs text-muted">{product.category_name}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold tabular-money text-primary">
                      {formatCurrency(product.sellingPrice)}
                    </p>
                    <p className={cn("text-xs font-semibold", outOfStock ? "text-danger" : low ? "text-warning" : "text-muted")}>
                      {product.quantity} left
                    </p>
                  </div>
                  {!outOfStock && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-soft text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      <Plus className="h-4 w-4" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
