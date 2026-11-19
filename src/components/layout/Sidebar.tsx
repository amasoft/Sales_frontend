import { NavLink } from "react-router-dom";
import { ChevronsLeft, Store } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/routes/nav";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { sidebarToggled, mobileNavSet } from "@/features/ui/uiSlice";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed) && !mobile;
  const business = useAppSelector((s) => s.settings.business);

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-ink transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-[232px]"
      )}
    >
      <div className={cn("flex items-center gap-2 px-4 py-5", collapsed && "justify-center px-0")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <Store className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-white">Chingi POS</p>
            <p className="truncate text-[11px] text-sidebar-ink/70">{business.name}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const link = (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => mobile && dispatch(mobileNavSet(false))}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-primary text-white shadow-panel"
                    : "text-sidebar-ink hover:bg-white/5 hover:text-white"
                )
              }
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );

          if (!collapsed) return link;
          return (
            <Tooltip key={item.path} delayDuration={200}>
              <TooltipTrigger asChild>{link}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {!mobile && (
        <button
          type="button"
          onClick={() => dispatch(sidebarToggled())}
          className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-xs font-semibold text-sidebar-ink/70 transition-colors hover:text-white"
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && "Collapse"}
        </button>
      )}
    </aside>
  );
}
