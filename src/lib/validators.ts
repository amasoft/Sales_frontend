import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(6, "Use at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  productCodeNo: z.string().min(1, "SKU / product code is required"),
  categoryId: z.coerce.number({ message: "Select a category" }).int().positive("Select a category"),
  productType: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number({ message: "Enter a valid cost price" }).nonnegative("Cost price can't be negative"),
  sellingPrice: z.coerce
    .number({ message: "Enter a valid selling price" })
    .nonnegative("Selling price can't be negative"),
  quantity: z.coerce.number({ message: "Enter a valid quantity" }).int().min(0, "Quantity can't be negative"),
});
export type ProductFormValues = z.infer<typeof productSchema>;

export const customerSchema = z.object({
  // name: z.string().min(2, "Customer name is required"),
  firstName: z.string().min(2, "Customer name is required"),
  lastName: z.string().min(2, "Customer name is required"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});
export type CustomerFormValues = z.infer<typeof customerSchema>;

export const businessProfileSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  address: z.string().min(2, "Address is required"),
  phone: z.string().min(3, "Phone number is required"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  taxRate: z.coerce.number().min(0).max(100),
  currency: z.string().min(1),
  receiptFooter: z.string().max(240, "Keep the footer under 240 characters"),
  lowStockThreshold: z.coerce.number().int().min(0),
});
export type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;
