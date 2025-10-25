"use client";
import Modal from "../Modal/Modal";
import PizzaForm from "../Form/Form";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { pizzaOrder, closeModal } from "@/redux/slices/modalSlice";

export default function Header() {
  const modalType = useSelector((state: RootState) => state.modalType.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className="bg-gray-800 text-white text-center p-4 text-4xl">
      <button
        className="relative left-2/5 cursor-pointer"
        onClick={() => dispatch(pizzaOrder())}
      >
        🍕
      </button>
      <Modal
        isModalOpen={modalType === "pizzaOrder"}
        closeModal={() => dispatch(closeModal())}
        title="Add Pizza"
      >
        <PizzaForm />
      </Modal>
    </header>
  );
}
