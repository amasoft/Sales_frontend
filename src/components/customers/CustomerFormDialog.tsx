import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { Customer } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, FormField } from "@/components/ui/Input";
import { customerSchema, type CustomerFormValues } from "@/lib/validators";
import { useCreateCustomerMutation } from "@/api/customersApi";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (customer: Customer) => void;
  withAddress?: boolean;
}

export function CustomerFormDialog({ open, onOpenChange, onCreated, withAddress }: CustomerFormDialogProps) {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { firstName: "",lastName:"", email: "", phone: "", address: "" },
    // defaultValues: { name: "", email: "", phone: "", address: "" },
  });

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      const name = `${values.firstName} ${values.lastName}`.trim();

      const result = await createCustomer({
        firstName:values.firstName,
   lastName:values.lastName,
  email: values.email,
  phone: values.phone,
  address: values.address}).unwrap();
console.log("CUSTOMER:", result);
console.log("CREATED CUSTOMER:", result);

toast.success(`${name} added`);
      onCreated?.(result.customer);
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error((error as { data?: { message?: string } })?.data?.message ?? "Couldn't add customer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Add customer</DialogTitle>
          <DialogDescription>Save their details to speed up checkout and track purchase history.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-4">
            <FormField label="First name" error={errors.firstName?.message}>
              <Input placeholder="Gift Okonkwo" {...register("firstName")} />
            </FormField>
            <FormField label="lastName" error={errors.lastName?.message}>
              <Input placeholder="Gift Okonkwo" {...register("lastName")} />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message}>
              <Input placeholder="080…" {...register("phone")} />
            </FormField>
            <FormField label="Email" error={errors.email?.message}>
              <Input type="email" placeholder="optional" {...register("email")} />
            </FormField>
            {withAddress && (
              <FormField label="Address" error={errors.address?.message}>
                <Textarea placeholder="optional" {...register("address")} />
              </FormField>
            )}
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Save customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
