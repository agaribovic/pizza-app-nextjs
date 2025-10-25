import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PizzaType } from "@/app/page";

export const pizzaApi = createApi({
  reducerPath: "pizzaApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
  tagTypes: ["Pizza"],
  endpoints: (builder) => ({
    getPizzas: builder.query<PizzaType[], void>({
      query: () => "/api/pizzas",
      providesTags: ["Pizza"],
    }),
    addPizza: builder.mutation<PizzaType, FormData>({
      query: (formData) => ({
        url: "/api/pizzas",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Pizza"],
    }),
    deletePizza: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/pizzas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pizza"],
    }),
  }),
});

export const {
  useGetPizzasQuery,
  useAddPizzaMutation,
  useDeletePizzaMutation,
} = pizzaApi;
