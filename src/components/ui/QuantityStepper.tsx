import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max, className }: QuantityStepperProps) {
  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  return (
    <div className={cn("inline-flex items-center gap-2 rounded-lg border border-line bg-panel p-1", className)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={!canDecrease}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-soft hover:text-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-bold tabular-nums text-ink">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={!canIncrease}
        onClick={() => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1)}
        className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-soft hover:text-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
