import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, FormField } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { businessProfileSchema, type BusinessProfileFormValues } from "@/lib/validators";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { businessProfileUpdated } from "@/features/settings/settingsSlice";
import { selectCurrentUser } from "@/features/auth/authSlice";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const business = useAppSelector((s) => s.settings.business);
  const user = useAppSelector(selectCurrentUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: business,
  });

  const onSubmit = (values: BusinessProfileFormValues) => {
    dispatch(businessProfileUpdated(values));
    toast.success("Business profile updated");
  };

  return (
    <>
      <PageHeader title="Settings" description="Business profile, receipts, and account details." />

      <Tabs defaultValue="business">
        <TabsList>
          <TabsTrigger value="business">Business Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>
                  These details appear on every printed receipt. Saved on this device.
                </CardDescription>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField label="Business name" htmlFor="name" error={errors.name?.message}>
                  <Input id="name" {...register("name")} />
                </FormField>
                <FormField label="Address" htmlFor="address" error={errors.address?.message}>
                  <Textarea id="address" {...register("address")} />
                </FormField>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
                    <Input id="phone" {...register("phone")} />
                  </FormField>
                  <FormField label="Email" htmlFor="email" error={errors.email?.message}>
                    <Input id="email" type="email" {...register("email")} />
                  </FormField>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField label="Tax rate (%)" htmlFor="taxRate" error={errors.taxRate?.message}>
                    <Input id="taxRate" type="number" step="0.1" min={0} max={100} {...register("taxRate")} />
                  </FormField>
                  <FormField label="Currency" htmlFor="currency" error={errors.currency?.message}>
                    <Input id="currency" {...register("currency")} />
                  </FormField>
                  <FormField label="Low stock threshold" htmlFor="lowStockThreshold" error={errors.lowStockThreshold?.message}>
                    <Input id="lowStockThreshold" type="number" min={0} {...register("lowStockThreshold")} />
                  </FormField>
                </div>
                <FormField
                  label="Receipt footer message"
                  htmlFor="receiptFooter"
                  error={errors.receiptFooter?.message}
                  hint="Shown at the bottom of every printed receipt."
                >
                  <Textarea id="receiptFooter" {...register("receiptFooter")} />
                </FormField>
              </CardContent>
              <div className="flex justify-end border-t border-line px-5 py-4">
                <Button type="submit" disabled={!isDirty}>
                  Save changes
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Account</CardTitle>
                <CardDescription>Your signed-in profile and role.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {user && (
                <div className="flex items-center gap-4">
                  <Avatar name={user.name} size="lg" />
                  <div>
                    <p className="text-base font-bold text-ink">{user.name}</p>
                    <p className="text-sm text-muted">{user.email}</p>
                    <Badge variant="primary" className="mt-2 capitalize">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              )}
              <p className="mt-6 text-xs text-muted">
                Profile editing and password changes will be available once the account management API is
                connected.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
