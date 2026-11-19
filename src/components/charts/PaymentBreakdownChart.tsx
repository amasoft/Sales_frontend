import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useChartPalette } from "@/components/charts/chartColors";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/format";
import { PieChart as PieIcon } from "lucide-react";

interface PaymentBreakdownChartProps {
  data: Array<{ method: string; total: number }>;
}

export function PaymentBreakdownChart({ data }: PaymentBreakdownChartProps) {
  const palette = useChartPalette();

  if (data.length === 0) {
    return (
      <EmptyState
        icon={PieIcon}
        title="No payments recorded"
        description="Payment method breakdown appears after your first sale."
        className="py-10"
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <ResponsiveContainer width="100%" height={200} className="sm:max-w-[200px]">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="method"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            strokeWidth={2}
            stroke="rgb(var(--color-panel))"
          >
            {data.map((entry, index) => (
              <Cell key={entry.method} fill={palette.categorical[index % palette.categorical.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend doubles as a table view of the underlying values. */}
      <ul className="w-full flex-1 space-y-2">
        {data.map((entry, index) => (
          <li key={entry.method} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: palette.categorical[index % palette.categorical.length] }}
              />
              {entry.method}
            </span>
            <span className="font-semibold tabular-money text-ink">{formatCurrency(entry.total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
