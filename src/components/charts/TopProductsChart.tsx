import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useChartPalette } from "@/components/charts/chartColors";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Trophy } from "lucide-react";

interface TopProductsChartProps {
  data: Array<{ name: string; revenue: number; unitsSold: number }>;
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const palette = useChartPalette();

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No product sales yet"
        description="Your best sellers will be ranked here."
        className="py-10"
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <CartesianGrid horizontal={false} stroke={palette.grid} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          width={130}
          tick={{ fill: palette.axis, fontSize: 12 }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: palette.grid, opacity: 0.4 }} />
        <Bar dataKey="revenue" name="Revenue" fill={palette.sequential} radius={[0, 6, 6, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
