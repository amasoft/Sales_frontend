import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendTone?: "positive" | "negative" | "warning" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

const trendToneClass: Record<NonNullable<StatCardProps["trendTone"]>, string> = {
  positive: "text-success",
  negative: "text-danger",
  warning: "text-warning",
  neutral: "text-muted",
};

export function StatCard({ label, value, trend, trendTone = "positive", icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-extrabold tabular-money text-ink">{value}</p>
      {trend && <p className={cn("mt-1 text-xs font-semibold", trendToneClass[trendTone])}>{trend}</p>}
    </Card>
  );
}
