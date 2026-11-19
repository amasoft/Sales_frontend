import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { AuthLayout, AuthFooterLink } from "@/pages/auth/AuthLayout";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { useLoginMutation } from "@/api/authApi";
import { useAppDispatch } from "@/app/hooks";
import { credentialsSet } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    // Previous defaults pre-filled a real-looking test credential for every
    // visitor — replaced with empty fields.
    // defaultValues: { email: "patrick@loginSch.com", password: "123456677" },
    defaultValues: { email: "", password: "" },
  });

  const redirectTo = location.state?.from?.pathname || "/app/dashboard";
  // const redirectTo =  "/app/dashboard";

  const onSubmit = async (values: LoginFormValues) => {
    console.log(`Loging values `+JSON.stringify(values))
    try {
      const result = await login(values).unwrap();
      // Previous code assumed a flat { token, user } response and dispatched
      // `result` directly, but the backend nests accessToken/refreshToken/user
      // inside `result.user` — dispatching the raw result left `token`
      // missing, and `result.user.name` was undefined (real name is at
      // `result.user.user.name`), which threw right after a successful login.
      // dispatch(credentialsSet(result));
      // toast.success(`Welcome back`);
      console.log(`result::${JSON.stringify(result)}`)
      // toast.success(`Welcome back, ${result.user.name.split(" ")[0]}`);
      dispatch(credentialsSet(result.user));
      toast.success(`Welcome back, ${result.user.user.name.split(" ")[0]}`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(
        (error as { data?: { message?: string } })?.data?.message ??
          "Couldn't sign in. Check your details and the API connection."
      );
    }
  };

  const continueInDemoMode = () => {
    // Previous payload used `token`, which matched the old (wrong) AuthResponse
    // shape; credentialsSet now expects `accessToken` to match the real backend response.
    // dispatch(
    //   credentialsSet({
    //     token: "demo-session-token",
    //     user: { id: 1, name: "Demo Admin", email: "demo@chingipos.dev", role: "admin" },
    //   })
    // );
    dispatch(
      credentialsSet({
        accessToken: "demo-session-token",
        user: { id: 1, name: "Demo Admin", email: "demo@chingipos.dev", role: "admin" },
      })
    );
    toast.message("You're in demo mode", {
      description: "Data comes from your API at " + import.meta.env.VITE_API_BASE_URL,
    });
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Access your dashboard, POS and inventory."
      footer={<AuthFooterLink to="/register" label="New to Chingi POS?" linkText="Create an account" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="username" placeholder="you@business.com" {...register("email")} />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...register("password")} />
        </FormField>

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Sign in
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <Button type="button" variant="secondary" size="lg" className="w-full" onClick={continueInDemoMode}>
        Continue in demo mode
      </Button>
      <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Demo mode skips authentication and opens the dashboard with data from your configured API. Use it while
        the <code className="rounded bg-soft px-1 py-0.5 text-[11px]">/auth/login</code> endpoint is wired up.
      </p>
    </AuthLayout>
  );
}
