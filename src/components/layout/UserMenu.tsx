import { useNavigate } from "react-router-dom";
import { LogOut, Settings, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loggedOut, selectCurrentUser } from "@/features/auth/authSlice";
import { Avatar } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export function UserMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
        <Avatar name={user.name} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="normal-case tracking-normal">
          <p className="text-sm font-semibold text-ink">{user.name}</p>
          <p className="text-xs font-normal text-muted">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/app/settings")}>
          <UserRound className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate("/app/settings")}>
          <Settings className="h-4 w-4" /> Business settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            dispatch(loggedOut());
            navigate("/login", { replace: true });
          }}
          className="text-danger data-[highlighted]:bg-danger-soft data-[highlighted]:text-danger"
        >
          <LogOut className="h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
