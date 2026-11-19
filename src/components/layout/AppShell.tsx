import { Outlet } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { mobileNavSet } from "@/features/ui/uiSlice";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function AppShell() {
  const dispatch = useAppDispatch();
  const mobileNavOpen = useAppSelector((s) => s.ui.mobileNavOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <DialogPrimitive.Root open={mobileNavOpen} onOpenChange={(open) => dispatch(mobileNavSet(open))}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" />
          <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-40 lg:hidden">
            <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
            <Sidebar mobile />
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
