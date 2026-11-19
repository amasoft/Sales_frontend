import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthLayout, AuthFooterLink } from "@/pages/auth/AuthLayout";
import { registerSchema, type RegisterFormValues } from "@/lib/validators";
import { useRegisterMutation } from "@/api/authApi";
import { useAppDispatch } from "@/app/hooks";
import { credentialsSet } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await registerUser(values).unwrap();
      // Same response-shape bug as LoginPage: the backend nests
      // accessToken/refreshToken/user inside `result.user`.
      // dispatch(credentialsSet(result));
      dispatch(credentialsSet(result.user));
      toast.success("Account created — welcome to Chingi POS");
      navigate("/app/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        (error as { data?: { message?: string } })?.data?.message ?? "Couldn't create your account. Try again."
      );
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up Chingi POS for your business in a couple of minutes."
      footer={<AuthFooterLink to="/login" label="Already have an account?" linkText="Sign in" />}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" autoComplete="name" placeholder="Amadi Patrick" {...register("name")} />
        </FormField>
        <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@business.com" {...register("email")} />
        </FormField>
        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" autoComplete="new-password" placeholder="••••••••" {...register("password")} />
        </FormField>
        <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
        </FormField>
        <Button type="submit" size="lg" className="w-full" loading={isLoading}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
