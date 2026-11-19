import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import type { Product } from "@/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, FormField } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { productSchema, type ProductFormValues } from "@/lib/validators";
import { FALLBACK_CATEGORIES } from "@/lib/constants";
import { useCreateProductMutation, useUpdateProductMutation } from "@/api/productsApi";

interface ProductFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

const PRODUCT_TYPES = ["Dell", "HP", "Apple", "Samsung", "Generic"];

export function ProductFormDrawer({ open, onOpenChange, product }: ProductFormDrawerProps) {
  const isEditing = Boolean(product);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      productCodeNo: "",
      categoryId: undefined as unknown as number,
      productType: "",
      description: "",
      price: 0,
      sellingPrice: 0,
      quantity: 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        product
          ? {
              name: product.name,
              productCodeNo: product.productCodeNo,
              categoryId: product.categoryId,
              productType: product.productType ?? "",
              description: product.description ?? "",
              price: product.price,
              sellingPrice: product.sellingPrice,
              quantity: product.quantity,
            }
          : {
              name: "",
              productCodeNo: "",
              categoryId: undefined as unknown as number,
              productType: "",
              description: "",
              price: 0,
              sellingPrice: 0,
              quantity: 0,
            }
      );
      setImagePreview(product?.imageURL ?? null);
      setImageFile(null);
    }
  }, [open, product, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (isEditing && product) {
        await updateProduct({ id: product.id, input: { ...values, image: imageFile } }).unwrap();
        toast.success("Product updated");
      } else {
        await createProduct({ ...values, image: imageFile }).unwrap();
        toast.success("Product added");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error((error as { data?: { message?: string } })?.data?.message ?? "Couldn't save this product");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent width="md">
        <DrawerHeader>
          <div>
            <DrawerTitle>{isEditing ? "Edit product" : "Add product"}</DrawerTitle>
            <DrawerDescription>
              {isEditing ? "Update pricing, stock, or details." : "Register a new item in your inventory."}
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSubmit)} id="product-form" className="contents">
          <DrawerBody className="space-y-4">
            <div>
              <label
                htmlFor="product-image"
                className="flex h-28 cursor-pointer items-center justify-center gap-3 rounded-xl2 border border-dashed border-line bg-soft transition-colors hover:border-primary/40"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Product" className="h-full w-28 rounded-xl2 object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted">
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs font-semibold">Upload product image</span>
                  </div>
                )}
              </label>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImageFile(file);
                  if (file) setImagePreview(URL.createObjectURL(file));
                }}
              />
            </div>

            <FormField label="Product name" htmlFor="name" error={errors.name?.message}>
              <Input id="name" placeholder="iPhone 12 Pro Max" {...register("name")} />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="SKU / Product code" htmlFor="productCodeNo" error={errors.productCodeNo?.message}>
                <Input id="productCodeNo" placeholder="IP12-PM" {...register("productCodeNo")} />
              </FormField>
              <FormField label="Brand" htmlFor="productType">
                <select
                  id="productType"
                  {...register("productType")}
                  className="flex h-10 w-full rounded-lg border border-line bg-panel px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <option value="">Select brand</option>
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {FALLBACK_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <div className="grid grid-cols-3 gap-3">
              <FormField label="Cost price" htmlFor="price" error={errors.price?.message}>
                <Input id="price" type="number" min={0} {...register("price")} />
              </FormField>
              <FormField label="Selling price" htmlFor="sellingPrice" error={errors.sellingPrice?.message}>
                <Input id="sellingPrice" type="number" min={0} {...register("sellingPrice")} />
              </FormField>
              <FormField label="Quantity" htmlFor="quantity" error={errors.quantity?.message}>
                <Input id="quantity" type="number" min={0} {...register("quantity")} />
              </FormField>
            </div>

            <FormField label="Description" htmlFor="description">
              <Textarea id="description" placeholder="Optional notes about this product" {...register("description")} />
            </FormField>
          </DrawerBody>
          <DrawerFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSaving}>
              {isEditing ? "Save changes" : "Add product"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
