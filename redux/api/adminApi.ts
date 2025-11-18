import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AdminData {
  email: string;
  role: "admin";
  expiresIn: number;
}

export interface LoginResponse extends AdminData {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Admin"],

  endpoints: (builder) => ({
    getAdmin: builder.query<AdminData, void>({
      query: () => "/api/admin",
      providesTags: ["Admin"],
    }),

    loginAdmin: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/admin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    logoutAdmin: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/admin",
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAdminQuery,
  useLoginAdminMutation,
  useLogoutAdminMutation,
} = adminApi;
