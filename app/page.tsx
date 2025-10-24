"use client";
import Card from "@/components/Card/Card";
import Spinner from "@/components/Spinner/Spinner";
import { useGetPizzasQuery } from "@/redux/api/pizzaApi";

export type PizzaType = {
  id: number;
  name: string;
  price: number;
  image: string;
};

type OverlayProps = {
  children: React.ReactNode;
};

const Overlay = ({ children }: OverlayProps) => (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50 z-50">
    {children}
  </div>
);

export default function Home() {
  const { data: pizzaData, isLoading, isError } = useGetPizzasQuery();
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
      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 place-items-center p-4">
        {pizzaData?.map((pizza) => (
          <Card key={pizza.id} pizzaData={pizza} />
        ))}
      </main>
    </div>
  );
}
