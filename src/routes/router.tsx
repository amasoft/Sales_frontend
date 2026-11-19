import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PageSpinner } from "@/components/ui/Spinner";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth, RedirectIfAuthed } from "@/features/auth/RequireAuth";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const MakeSalePage = lazy(() => import("@/pages/pos/MakeSalePage"));
const ProductsPage = lazy(() => import("@/pages/products/ProductsPage"));
const SalesHistoryPage = lazy(() => import("@/pages/sales/SalesHistoryPage"));
const CustomersPage = lazy(() => import("@/pages/customers/CustomersPage"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageSpinner />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: withSuspense(
      <RedirectIfAuthed>
        <LoginPage />
      </RedirectIfAuthed>
    ),
  },
  {
    path: "/register",
    element: withSuspense(
      <RedirectIfAuthed>
        <RegisterPage />
      </RedirectIfAuthed>
    ),
  },
  {
    path: "/forgot-password",
    element: withSuspense(<ForgotPasswordPage />),
  },
  {
    path: "/das",
    element: <DashboardPage />,
  },
  {
    path: "/sale",
    element: <SalesHistoryPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/app",
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: withSuspense(<DashboardPage />) },
          { path: "pos", element: withSuspense(<MakeSalePage />) },
          { path: "products", element: withSuspense(<ProductsPage />) },
          { path: "sales", element: withSuspense(<SalesHistoryPage />) },
          { path: "customers", element: withSuspense(<CustomersPage />) },
          { path: "settings", element: withSuspense(<SettingsPage />) },
        ],
      },
    ],
  },
  { path: "/", element: <Navigate to="/app/dashboard" replace /> },
  { path: "*", element: withSuspense(<NotFoundPage />) },
]);
