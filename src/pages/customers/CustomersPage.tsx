import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, Plus, Users } from "lucide-react";
import type { Customer } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Avatar } from "@/components/ui/Avatar";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { CustomerFormDialog } from "@/components/customers/CustomerFormDialog";
import { CustomerDetailDrawer } from "@/pages/customers/components/CustomerDetailDrawer";
import { useGetCustomersQuery } from "@/api/customersApi";
import { useGetSalesQuery } from "@/api/salesApi";
import { formatCurrency } from "@/lib/format";
import { useDebouncedValue } from "@/lib/hooks";

export default function CustomersPage() {
  const [searchParams] = useSearchParams();
  const { data: customers = [], isLoading, isError } = useGetCustomersQuery();
  const { data: sales = [] } = useGetSalesQuery();

  const [term, setTerm] = useState(searchParams.get("q") ?? "");
  const debouncedTerm = useDebouncedValue(term, 200);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const spendByCustomer = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    sales.forEach((s) => {
      const key = s.customerDetails.customerName;
      const entry = map.get(key) ?? { total: 0, count: 0 };
      entry.total += s.paymentDetails.totalAmount;
      entry.count += 1;
      map.set(key, entry);
    });
    return map;
  }, [sales]);

  const filtered = useMemo(() => {
    const q = debouncedTerm.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q)
    );
  }, [customers, debouncedTerm]);

  return (
    <>
      <PageHeader
        title="Customers"
        description="Track buyer history, contact details, and repeat purchases."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        }
      />

      <Card className="p-4">
        <SearchInput value={term} onChange={setTerm} placeholder="Search name, phone, or email…" />
      </Card>

      <div className="mt-4">
        {isLoading ? (
          <PageSpinner label="Loading customers…" />
        ) : isError ? (
          <Card>
            <EmptyState
              icon={AlertTriangle}
              title="Couldn't load customers"
              description="Check that the API is running, then refresh the page."
            />
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={Users}
              title="No customers found"
              description="Add your first customer, or check them in during a sale."
              action={
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4" /> Add Customer
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((customer) => {
              const stats = spendByCustomer.get(customer.name);
              return (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => setSelectedCustomer(customer)}
                  className="flex items-start gap-3 rounded-xl2 border border-line bg-panel p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-panel"
                >
                  <Avatar name={customer.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">{customer.name}</p>
                    <p className="truncate text-xs text-muted">{customer.phone || customer.email || "No contact on file"}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-muted">{stats?.count ?? 0} purchase{stats?.count === 1 ? "" : "s"}</span>
                      <span className="font-bold tabular-money text-primary">{formatCurrency(stats?.total ?? 0)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <CustomerFormDialog open={addOpen} onOpenChange={setAddOpen} withAddress />
      <CustomerDetailDrawer customer={selectedCustomer} sales={sales} onOpenChange={(open) => !open && setSelectedCustomer(null)} />
    </>
  );
}
