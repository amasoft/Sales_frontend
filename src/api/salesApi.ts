import { baseApi } from "@/api/baseApi";
import type { CreateSalePayload, CreateSaleResult, SaleRecord } from "@/types";

interface SalesResponse {
  sales: SaleRecord[];
}
interface CreateSaleResponse {
  data: CreateSaleResult;
}

export const salesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query<SaleRecord[], void>({
      query: () => "/sales",
      transformResponse: (response: SalesResponse) => response.sales,
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({ type: "Sale" as const, id: s.saleDetails.id })),
              { type: "Sale" as const, id: "LIST" },
            ]
          : [{ type: "Sale" as const, id: "LIST" }],
    }),
    createSale: builder.mutation<CreateSaleResult, CreateSalePayload>({
      query: (body) => ({ url: "/sales", method: "POST", body }),
      transformResponse: (response: CreateSaleResponse) => response.data,
      invalidatesTags: [
        { type: "Sale", id: "LIST" },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetSalesQuery, useCreateSaleMutation } = salesApi;
