"use client";
import Modal from "../Modal/Modal";
import PizzaForm from "../Form/Form";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { pizzaOrder, closeModal } from "@/redux/slices/modalSlice";
import { setSortedPizzas } from "@/redux/slices/pizzaDataSlice";
import Sort from "../Sort/Sort";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const modalType = useSelector((state: RootState) => state.modalType.value);
  const pizzaData = useSelector(
    (state: RootState) => state.pizzaData.pizzaData
  );

  return (
    <header className="bg-gray-800 text-center p-4">
      <Sort
        pizzas={pizzaData}
        onSort={(sorted) => dispatch(setSortedPizzas(sorted))}
      />

      <button
        className="relative left-2/5 cursor-pointer text-4xl"
        onClick={() => dispatch(pizzaOrder())}
      >
        🍕
      </button>
      <Modal
        isModalOpen={modalType === "pizzaOrder" || modalType === "pizzaEdit"}
        closeModal={() => dispatch(closeModal())}
        title={modalType === "pizzaOrder" ? "Add Pizza" : "Edit Pizza"}
      >
        <PizzaForm />
      </Modal>
    </header>
  );
}
