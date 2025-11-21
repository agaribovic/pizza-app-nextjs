"use client";

import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/components/Card/Card";
import Spinner from "@/components/Spinner/Spinner";
import { Overlay } from "@/components/Overlay/Overlay";
import { useGetPizzasQuery } from "@/redux/api/pizzaApi";
import { setPizzaData } from "@/redux/slices/pizzaDataSlice";
import { RootState, AppDispatch } from "@/redux/store";

export type PizzaType = {
  id: number;
  name: string;
  price: number;
  image: string;
  createdAt: string; 
  description: string;
};

const Home: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: pizzaData, isLoading, isError } = useGetPizzasQuery();
  const sortedPizzas = useSelector((state: RootState) => state.pizzaData.sortedPizzas);

  useEffect(() => {
    if (pizzaData) {
      dispatch(setPizzaData(pizzaData));
    }
  }, [pizzaData, dispatch]);

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
        {sortedPizzas.map((pizza) => (
          <Card key={pizza.id} pizzaData={pizza} />
        ))}
      </main>
    </div>
  );
}

export default Home;
