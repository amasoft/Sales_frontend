import { baseApi } from "@/api/baseApi";
import type { AuthUser } from "@/types";

interface LoginRequest {
  email: string;
  password: string;
}
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
// Previous (wrong) shape — assumed a flat { token, user } response, but the
// backend actually nests accessToken/refreshToken/user inside `user`.
// interface AuthResponse {
//   token: string;
//   user: AuthUser;
// }
interface AuthResponse {
  message: string;
  user: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    requestPasswordReset: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
} = authApi;
