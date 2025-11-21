import React, { ChangeEvent, FC } from "react";
import { PizzaType } from "@/app/page";
import { SortOption, sortPizzas } from "@/utils/sortPizzas";

interface SortProps {
  pizzas: PizzaType[];
  onSort: (sorted: PizzaType[]) => void;
}

const Sort: FC<SortProps> = ({ pizzas, onSort }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortOption;
    const sorted = sortPizzas(pizzas, value);
    onSort(sorted);
  };

  return (
    <select
      id="sortBy"
      name="sortBy"
      className="bg-white text-gray-800 font-semibold p-2 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer text-xl"
      onChange={handleChange}
      defaultValue=""
    >
      <option value="" disabled>Sort by:</option>
      <option value="name-asc">Name A → Z</option>
      <option value="name-desc">Name Z → A</option>
      <option value="price-asc">Price Low → High</option>
      <option value="price-desc">Price High → Low</option>
      <option value="date-newest">Newest First</option>
      <option value="date-oldest">Oldest First</option>
    </select>
  );
};

export default React.memo(Sort);
