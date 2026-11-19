import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { themeToggled } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => dispatch(themeToggled())}
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
