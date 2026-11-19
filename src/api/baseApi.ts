import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { loggedOut } from "@/features/auth/authSlice";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/**
 * Wraps fetchBaseQuery so an expired/invalid session clears local auth state
 * instead of leaving the UI stuck on failed requests.
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(loggedOut());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "Customer", "Sale", "Dashboard"],
  endpoints: () => ({}),
});

export { API_BASE_URL };
