"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { pizzaOrder } from "@/redux/slices/modalSlice";
import { setSortedPizzas } from "@/redux/slices/pizzaDataSlice";
import Sort from "../Sort/Sort";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const pizzaData = useSelector(
    (state: RootState) => state.pizzaData.pizzaData
  );

  return (
    <header
      className="flex justify-between items-center bg-gray-800 text-center 
                   px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4"
    >
      <Sort
        pizzas={pizzaData}
        onSort={(sorted) => dispatch(setSortedPizzas(sorted))}
      />

      <button
        className="cursor-pointer text-4xl"
        onClick={() => dispatch(pizzaOrder())}
      >
        🍕
      </button>
    </header>
  );
}
