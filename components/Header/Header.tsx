"use client";
import Sort from "../Sort/Sort";
import { pizzaOrder } from "@/redux/slices/modalSlice";
import { adminApi } from "@/redux/api/adminApi";
import { setSortedPizzas } from "@/redux/slices/pizzaDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useLogoutAdminMutation } from "@/redux/api/adminApi";
import { setLoggedOut } from "@/redux/slices/authSlice";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const pizzaData = useSelector((state: RootState) => state.pizzaData.pizzaData);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [logoutAdmin] = useLogoutAdminMutation();

  return (
    <header
      className="flex justify-between items-center bg-gray-800 text-center 
                   px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4"
    >
      <Sort
        pizzas={pizzaData}
        onSort={(sorted) => dispatch(setSortedPizzas(sorted))}
      />

      <div className="flex gap-20">
        {isLoggedIn && (
          <button
            onClick={async () => {
              await logoutAdmin().unwrap();
              dispatch(adminApi.util.resetApiState());
              dispatch(setLoggedOut());
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        )}
        <button
          className="cursor-pointer text-4xl"
          onClick={() => dispatch(pizzaOrder())}
        >
          🍕
        </button>
      </div>
    </header>
  );
}
