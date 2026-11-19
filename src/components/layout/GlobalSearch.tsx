import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Receipt, Search, User } from "lucide-react";
import { useGetProductsQuery } from "@/api/productsApi";
import { useGetCustomersQuery } from "@/api/customersApi";
import { useGetSalesQuery } from "@/api/salesApi";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/cn";

export function GlobalSearch() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: products = [] } = useGetProductsQuery();
  const { data: customers = [] } = useGetCustomersQuery();
  const { data: sales = [] } = useGetSalesQuery();

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (q.length < 2) return null;

    const matchedProducts = products
      .filter((p) => p.name.toLowerCase().includes(q) || p.productCodeNo?.toLowerCase().includes(q))
      .slice(0, 4);
    const matchedCustomers = customers.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4);
    const matchedSales = sales
      .filter(
        (s) =>
          s.saleDetails.invoiceNo.toLowerCase().includes(q) ||
          s.customerDetails.customerName?.toLowerCase().includes(q)
      )
      .slice(0, 4);

    return { matchedProducts, matchedCustomers, matchedSales };
  }, [term, products, customers, sales]);

  const hasResults =
    results && (results.matchedProducts.length || results.matchedCustomers.length || results.matchedSales.length);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search products, customers, invoices…"
        className="h-10 w-full rounded-lg border border-line bg-soft pl-9 pr-3 text-sm text-ink placeholder:text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:bg-panel"
      />

      {open && term.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-xl2 border border-line bg-panel py-2 shadow-popover scrollbar-thin animate-fade-in">
          {!hasResults && <p className="px-4 py-6 text-center text-sm text-muted">No matches for "{term}"</p>}

          {results && results.matchedProducts.length > 0 && (
            <ResultGroup label="Products">
              {results.matchedProducts.map((p) => (
                <ResultRow
                  key={p.id}
                  icon={Package}
                  title={p.name}
                  subtitle={`${p.category_name} · ${formatCurrency(p.sellingPrice)}`}
                  onClick={() => {
                    navigate(`/app/products?q=${encodeURIComponent(p.name)}`);
                    setOpen(false);
                  }}
                />
              ))}
            </ResultGroup>
          )}

          {results && results.matchedCustomers.length > 0 && (
            <ResultGroup label="Customers">
              {results.matchedCustomers.map((c) => (
                <ResultRow
                  key={c.id}
                  icon={User}
                  title={c.name}
                  subtitle={c.phone || c.email || "No contact on file"}
                  onClick={() => {
                    navigate(`/app/customers?q=${encodeURIComponent(c.name)}`);
                    setOpen(false);
                  }}
                />
              ))}
            </ResultGroup>
          )}

          {results && results.matchedSales.length > 0 && (
            <ResultGroup label="Invoices">
              {results.matchedSales.map((s) => (
                <ResultRow
                  key={s.saleDetails.id}
                  icon={Receipt}
                  title={s.saleDetails.invoiceNo}
                  subtitle={`${s.customerDetails.customerName} · ${formatCurrency(s.paymentDetails.totalAmount)}`}
                  onClick={() => {
                    navigate(`/app/sales?q=${encodeURIComponent(s.saleDetails.invoiceNo)}`);
                    setOpen(false);
                  }}
                />
              ))}
            </ResultGroup>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-1.5 py-1">
      <p className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
      {children}
    </div>
  );
}

function ResultRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: typeof Package;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-soft"
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{title}</p>
        <p className="truncate text-xs text-muted">{subtitle}</p>
      </div>
    </button>
  );
}
