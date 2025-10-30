import { ChangeEvent } from "react";
import { PizzaType } from "@/app/page";

type SortProps = {
  pizzas: PizzaType[];
  onSort: (sorted: PizzaType[]) => void;
};

export default function Sort({ pizzas, onSort }: SortProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    const sortedPizzas = [...pizzas];

    switch (value) {
      case "name-asc":
        sortedPizzas.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedPizzas.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sortedPizzas.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedPizzas.sort((a, b) => b.price - a.price);
        break;
      case "date-newest":
        sortedPizzas.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "date-oldest":
        sortedPizzas.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "default":
        console.log("Error sorting pizzas!");
        break;
    }

    onSort(sortedPizzas);
  };

  return (
    <>
      <select
        id="sortBy"
        name="sortBy"
        className="relative right-2/5 bg-white text-gray-800 font-semibold p-2 
                  rounded cursor-pointer border-none shadow-md focus:outline-none 
                  focus:ring-2 focus:ring-gray-400 transition duration-200 text-xl"
        onChange={handleChange}
      >
        <option value="" disabled selected>
          Sort by:
        </option>
        <option value="name-asc">Name A → Z</option>
        <option value="name-desc">Name Z → A</option>
        <option value="price-asc">Price Low → High</option>
        <option value="price-desc">Price High → Low</option>
        <option value="date-newest">Newest First</option>
        <option value="date-oldest">Oldest First</option>
      </select>
    </>
  );
}
