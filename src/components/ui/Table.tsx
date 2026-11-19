import * as React from "react";
import { cn } from "@/lib/cn";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Omit the wrapper border/radius when the table already sits inside a bordered container (e.g. Card). */
  bare?: boolean;
}

export function Table({ className, bare, ...props }: TableProps) {
  return (
    <div className={cn("w-full overflow-x-auto scrollbar-thin", !bare && "rounded-xl2 border border-line")}>
      <table className={cn("w-full min-w-max border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-soft", className)} {...props} />;
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-line", className)} {...props} />;
}

export function TR({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("transition-colors hover:bg-soft/70", className)} {...props} />;
}

export function TH({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "border-b border-line px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-muted",
        className
      )}
      {...props}
    />
  );
}

export function TD({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-middle text-ink", className)} {...props} />;
}
