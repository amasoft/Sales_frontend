import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { useAppSelector } from "@/app/hooks";
import { router } from "@/routes/router";

export default function App() {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <TooltipProvider delayDuration={150}>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          classNames: {
            toast: "rounded-xl2 border border-line shadow-popover",
          },
        }}
      />
      <RouterProvider router={router} />
    </TooltipProvider>
  );
}
