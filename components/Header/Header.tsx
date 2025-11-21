"use client";
import { useCallback } from "react";
import Sort from "../Sort/Sort";
import { pizzaOrder } from "@/redux/slices/modalSlice";
import { adminApi } from "@/redux/api/adminApi";
import { setSortedPizzas } from "@/redux/slices/pizzaDataSlice";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useLogoutAdminMutation } from "@/redux/api/adminApi";
import { setLoggedOut } from "@/redux/slices/authSlice";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [logoutAdmin] = useLogoutAdminMutation();

  const { pizzaData, isLoggedIn } = useSelector(
    (state: RootState) => ({
      pizzaData: state.pizzaData.pizzaData,
      isLoggedIn: state.auth.isLoggedIn,
    }),
    shallowEqual
  );

  const handleSort = useCallback(
    (sorted: typeof pizzaData) => dispatch(setSortedPizzas(sorted)),
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    await logoutAdmin().unwrap();
    dispatch(adminApi.util.resetApiState());
    dispatch(setLoggedOut());
  }, [logoutAdmin, dispatch]);

  const headerPadding = "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4";

  return (
    <header className={`flex justify-between items-center bg-gray-800 text-center ${headerPadding}`}>
      <Sort pizzas={pizzaData} onSort={handleSort} />

      <div className="flex gap-20">
        {isLoggedIn && (
          <button
            aria-label="Logout"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        )}
        <button
          aria-label="Open Pizza Order"
          className="cursor-pointer text-4xl"
          onClick={() => dispatch(pizzaOrder())}
        >
          🍕
        </button>
      </div>
    </header>
  );
}

export default Header;