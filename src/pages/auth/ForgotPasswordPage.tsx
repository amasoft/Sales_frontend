import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { AuthLayout, AuthFooterLink } from "@/pages/auth/AuthLayout";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validators";
import { useRequestPasswordResetMutation } from "@/api/authApi";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await requestReset(values).unwrap();
    } catch {
      // Regardless of whether the account exists or the endpoint is wired up yet,
      // we don't want to leak account existence — show the same confirmation state.
    }
    setSentTo(values.email);
  };

  if (sentTo) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="We've sent password reset instructions if an account exists for this email."
        footer={<AuthFooterLink to="/login" label="Remembered it after all?" linkText="Back to sign in" />}
      >
        <div className="flex flex-col items-center gap-3 rounded-xl2 border border-line bg-soft px-6 py-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-success" />
          <p className="text-sm text-ink">
            If <span className="font-semibold">{sentTo}</span> matches a Chingi POS account, a reset link is on
            its way.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter the email linked to your account and we'll send reset instructions."
      footer={<AuthFooterLink to="/login" label="Remembered it after all?" linkText="Back to sign in" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@business.com" {...register("email")} />
        </FormField>
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
