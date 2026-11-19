import { format, formatDistanceToNow } from "date-fns";

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const nairaCompactFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(amount: number | string | undefined | null): string {
  const value = Number(amount ?? 0);
  return nairaFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatCurrencyCompact(amount: number | string | undefined | null): string {
  const value = Number(amount ?? 0);
  return nairaCompactFormatter.format(Number.isFinite(value) ? value : 0);
}

export function currencySymbol(): string {
  const part = nairaFormatter.formatToParts(0).find((p) => p.type === "currency");
  return part?.value ?? "₦";
}

export function formatNumber(value: number | undefined | null): string {
  return new Intl.NumberFormat("en-NG").format(value ?? 0);
}

export function formatDateTime(value: string | Date | undefined | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "dd MMM yyyy, h:mm a");
}

export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "dd MMM yyyy");
}

export function formatRelative(value: string | Date | undefined | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return formatDistanceToNow(date, { addSuffix: true });
}

export function initials(name: string | undefined | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}
