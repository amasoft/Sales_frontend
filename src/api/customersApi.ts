import { baseApi } from "@/api/baseApi";
import type { Customer } from "@/types";

interface CustomersResponse {
  customers: Customer[];
}
interface CustomerResponse {
  customer: Customer;
  message?: string;
}

export interface CustomerInput {
  // name: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => "/customer",
      transformResponse: (response: CustomersResponse) => response.customers,
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({ type: "Customer" as const, id: c.id })),
              { type: "Customer" as const, id: "LIST" },
            ]
          : [{ type: "Customer" as const, id: "LIST" }],
    }),
    createCustomer: builder.mutation<CustomerResponse, CustomerInput>({
      query: (body) => ({ url: "/customer", method: "POST", body }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
  }),
});

export const { useGetCustomersQuery, useCreateCustomerMutation } = customersApi;
