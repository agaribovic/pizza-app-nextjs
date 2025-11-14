"use client";
import Card from "@/components/Card/Card";
import Spinner from "@/components/Spinner/Spinner";
import { useGetPizzasQuery } from "@/redux/api/pizzaApi";
import { useGetAdminQuery } from "@/redux/api/adminApi";
import { Overlay } from "@/components/Overlay/Overlay";
import { useEffect } from "react";
import { setPizzaData } from "@/redux/slices/pizzaDataSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedIn } from "@/redux/slices/authSlice";

export type PizzaType = {
  id: number;
  name: string;
  price: number;
  image: string;
  createdAt: Date;
  description: string;
};

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: pizzaData, isLoading, isError } = useGetPizzasQuery();
  const sortedPizzas = useSelector((state: RootState) => state.pizzaData.sortedPizzas);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { data: admin } = useGetAdminQuery(undefined, { skip: !isLoggedIn });

  useEffect(() => {
    dispatch(setPizzaData(pizzaData ?? []));
  }, [pizzaData]);

  useEffect(() => {
    if (admin) {
      dispatch(setLoggedIn({ email: admin.email, role: admin.role }));
    }
  }, [admin, dispatch]);

  if (isLoading || isError) {
    return (
      <Overlay>
        {isLoading && <Spinner size={350} />}
        {isError && (
          <h1 className="text-red-500 text-6xl text-center">
            Error fetching pizzas
          </h1>
        )}
      </Overlay>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 place-items-center p-4 mb-18">
        {sortedPizzas?.map((pizza) => (
          <Card key={pizza.id} pizzaData={pizza} />
        ))}
      </main>
    </div>
  );
}
