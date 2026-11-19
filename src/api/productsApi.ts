import { baseApi } from "@/api/baseApi";
import type { Product, ProductInput } from "@/types";

interface ProductsResponse {
  products: Product[];
}
interface ProductResponse {
  product: Product;
  message?: string;
}

function toFormData(input: ProductInput): FormData {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("description", input.description ?? "");
  formData.append("productCodeNo", input.productCodeNo);
  formData.append("price", String(input.price));
  formData.append("sellingPrice", String(input.sellingPrice));
  formData.append("quantity", String(input.quantity));
  formData.append("categoryId", String(input.categoryId));
  formData.append("productType", input.productType ?? "");
  if (input.image instanceof File) {
    formData.append("image", input.image);
  }
  return formData;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response: ProductsResponse) => response.products,
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Product" as const, id: p.id })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    createProduct: builder.mutation<ProductResponse, ProductInput>({
      query: (input) => ({
        url: "/products",
        method: "POST",
        body: toFormData(input),
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation<ProductResponse, { id: number; input: ProductInput }>({
      query: ({ id, input }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: toFormData(input),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
