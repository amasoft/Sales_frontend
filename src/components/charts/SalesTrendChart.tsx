import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useChartPalette } from "@/components/charts/chartColors";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { EmptyState } from "@/components/ui/EmptyState";
import { BarChart3 } from "lucide-react";

interface SalesTrendChartProps {
  data: Array<{ label: string; total: number }>;
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const palette = useChartPalette();

  if (data.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No sales yet"
        description="Once sales are recorded, the trend will appear here."
        className="py-10"
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke={palette.grid} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: palette.axis, fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          width={0}
          tick={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: palette.grid, opacity: 0.4 }} />
        <Bar dataKey="total" name="Revenue" fill={palette.sequential} radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
