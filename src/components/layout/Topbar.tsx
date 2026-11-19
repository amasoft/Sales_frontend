import { Menu } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { mobileNavSet } from "@/features/ui/uiSlice";
import { Button } from "@/components/ui/Button";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { UserMenu } from "@/components/layout/UserMenu";

export function Topbar() {
  const dispatch = useAppDispatch();
  const pageTitle = useAppSelector((s) => s.ui.pageTitle);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-panel/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-panel/80 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => dispatch(mobileNavSet(true))}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="hidden shrink-0 text-sm font-bold text-ink lg:block">{pageTitle}</h1>

      <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:gap-3">
        <div className="hidden flex-1 sm:block sm:max-w-xs md:max-w-sm lg:max-w-md">
          <GlobalSearch />
        </div>
        <NotificationsMenu />
        <ThemeToggle />
        <div className="h-6 w-px bg-line" />
        <UserMenu />
      </div>
    </header>
  );
}
