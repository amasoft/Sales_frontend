import { useAppSelector } from "@/app/hooks";

/**
 * Categorical + sequential chart colors, validated with the CVD-safety
 * validator (scripts/validate_palette.js) against this app's panel surfaces:
 * light #ffffff and dark #111827. Do not hand-tweak without re-validating.
 */
const LIGHT = {
  categorical: ["#4f46e5", "#0d9488", "#d97706", "#e11d48"],
  sequential: "#4f46e5",
  grid: "#e5e7eb",
  axis: "#6b7280",
};

const DARK = {
  categorical: ["#7c74f2", "#0f9c8d", "#d97706", "#e2596a"],
  sequential: "#8b85ff",
  grid: "#1f2937",
  axis: "#94a3b8",
};

export function useChartPalette() {
  const theme = useAppSelector((s) => s.ui.theme);
  return theme === "dark" ? DARK : LIGHT;
}
