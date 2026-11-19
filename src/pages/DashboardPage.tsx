import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, PackageX, Receipt, ShoppingCart, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SalesTrendChart } from "@/components/charts/SalesTrendChart";
import { PaymentBreakdownChart } from "@/components/charts/PaymentBreakdownChart";
import { TopProductsChart } from "@/components/charts/TopProductsChart";
import { useGetProductsQuery } from "@/api/productsApi";
import { useGetSalesQuery } from "@/api/salesApi";
import { buildDashboardSummary } from "@/lib/analytics";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useAppSelector } from "@/app/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";

export default function DashboardPage() {
  const user = useAppSelector(selectCurrentUser);
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductsQuery();
  const { data: sales = [], isLoading: salesLoading, isError: salesError } = useGetSalesQuery();

  const summary = useMemo(() => buildDashboardSummary(products, sales), [products, sales]);
  console.log(`-SUMMARY:::${JSON.stringify(summary)}`)
  
  const isLoading = productsLoading || salesLoading;
  const hasError = productsError && salesError;

  return (
    <>
      <PageHeader
        // Previous line was patched to `user.user.name` to work around the
        // same response-shape bug fixed in authSlice/LoginPage — `user` from
        // `selectCurrentUser` is already the flat AuthUser, so `.user.name`
        // was undefined and this never rendered until now.
        // title={`Welcome back${user ? `, ${user.user.name}` : ""}`}
        title={`Welcome back${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Today's business performance at a glance."
        actions={
          <Button asChild>
            <Link to="/app/pos">
              <ShoppingCart className="h-4 w-4" /> Open POS
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <PageSpinner label="Crunching today's numbers…" />
      ) : hasError ? (
        <Card>
          <EmptyState
            icon={AlertTriangle}
            title="Couldn't load dashboard data"
            description="Check that the API is running and reachable, then refresh the page."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Today's Revenue"
              value={formatCurrency(summary.todayRevenue)}
              trend={`${summary.salesCount} sale${summary.salesCount === 1 ? "" : "s"} today`}
              trendTone="neutral"
              icon={TrendingUp}
            />
            <StatCard
              label="Today's Profit"
              value={formatCurrency(summary.todayProfit)}
              trend="Estimated from cost price"
              trendTone={summary.todayProfit >= 0 ? "positive" : "negative"}
              icon={Receipt}
            />
            <StatCard
              label="Low Stock"
              value={String(summary.lowStockCount)}
              trend={summary.lowStockCount > 0 ? "Needs attention" : "All good"}
              trendTone={summary.lowStockCount > 0 ? "warning" : "positive"}
              icon={AlertTriangle}
            />
            <StatCard
              label="Out of Stock"
              value={String(summary.outOfStockCount)}
              trend={summary.outOfStockCount > 0 ? "Blocking potential sales" : "Nothing out of stock"}
              trendTone={summary.outOfStockCount > 0 ? "negative" : "positive"}
              icon={PackageX}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>Revenue recorded per day this week</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <SalesTrendChart data={summary.salesTrend} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Low Stock Alerts</CardTitle>
                  <CardDescription>Restock soon to avoid missed sales</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {summary.lowStockProducts.length === 0 ? (
                  <EmptyState title="Stock levels look healthy" className="py-10" />
                ) : (
                  <ul className="divide-y divide-line">
                    {summary.lowStockProducts.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                          <p className="text-xs text-muted">{p.category_name}</p>
                        </div>
                        <Badge variant={p.quantity <= 0 ? "danger" : "warning"}>
                          {p.quantity <= 0 ? "0 left" : `${p.quantity} left`}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>How customers are paying</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <PaymentBreakdownChart data={summary.paymentBreakdown} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best sellers by revenue</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <TopProductsChart data={summary.topProducts} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>The latest completed transactions</CardDescription>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link to="/app/sales">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {summary.recentSales.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="No sales yet"
                  description="Sales you record from the POS screen will show up here."
                  className="py-10"
                />
              ) : (
                <ul className="divide-y divide-line">
                  {summary.recentSales.map((sale) => (
                    <li key={sale.saleDetails.id} className="flex items-center justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{sale.saleDetails.invoiceNo}</p>
                        <p className="text-xs text-muted">
                          {sale.customerDetails.customerName || "Walk-in Customer"} ·{" "}
                          {formatDateTime(sale.saleDetails.date)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold tabular-money text-ink">
                        {formatCurrency(sale.paymentDetails.totalAmount)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
