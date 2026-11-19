import { Link } from "react-router-dom";
import { BarChart3, Receipt, ShieldCheck, Store, Zap } from "lucide-react";
import { useAppSelector } from "@/app/hooks";

const HIGHLIGHTS = [
  { icon: Zap, text: "Ring up a sale in under a minute, with live stock deducted automatically." },
  { icon: Receipt, text: "Every sale produces a clean, printable invoice and receipt." },
  { icon: BarChart3, text: "See today's revenue, profit and low-stock items at a glance." },
  { icon: ShieldCheck, text: "Role-aware actions keep pricing and discounts under control." },
];

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const business = useAppSelector((s) => s.settings.business);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-canvas lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-ink lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.35),_transparent_55%)]" />
        <div className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <Store className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold text-white">Chingi POS</span>
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="max-w-md text-3xl font-extrabold leading-tight text-white">
              Sell faster. Track every product. Never lose a receipt.
            </h2>
            <p className="mt-3 max-w-sm text-sm text-sidebar-ink/80">
              The operating system for {business.name || "your retail business"} — point of sale, inventory
              and sales tracking in one place.
            </p>
          </div>
          <ul className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-sidebar-ink/90">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary-soft">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-sidebar-ink/50">
          © {new Date().getFullYear()} {business.name || "Chingi Gadgets Store"}. All rights reserved.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold text-ink">Chingi POS</span>
          </div>

          <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function AuthFooterLink({ to, label, linkText }: { to: string; label: string; linkText: string }) {
  return (
    <p>
      {label}{" "}
      <Link to={to} className="font-semibold text-primary hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
