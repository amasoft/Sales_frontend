import {
  LayoutGrid,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/app/dashboard", icon: LayoutGrid, end: true },
  { label: "Make Sale", path: "/app/pos", icon: ShoppingCart },
  { label: "Products", path: "/app/products", icon: Package },
  { label: "Sales History", path: "/app/sales", icon: Receipt },
  { label: "Customers", path: "/app/customers", icon: Users },
  { label: "Settings", path: "/app/settings", icon: Settings },
];
