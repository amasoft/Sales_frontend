import type { TooltipProps } from "recharts";
import { formatCurrency } from "@/lib/format";

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-panel px-3 py-2 text-xs shadow-popover">
      {label && <p className="mb-1 font-semibold text-ink">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted">{entry.name}:</span>
          <span className="font-semibold tabular-money text-ink">
            {formatCurrency(entry.value as number)}
          </span>
        </div>
      ))}
    </div>
  );
}
