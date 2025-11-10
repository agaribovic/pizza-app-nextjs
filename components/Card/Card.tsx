"use client";
import Image from "next/image";
import Modal from "@/components/Modal/Modal";
import { useRef } from "react";
import { PizzaType } from "@/app/page";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { pizzaDetails, closeModal, pizzaEdit } from "@/redux/slices/modalSlice";
import { useDeletePizzaMutation } from "@/redux/api/pizzaApi";
import Spinner from "../Spinner/Spinner";
import PizzaForm from "../Form/Form";

type PropType = {
  pizzaData: PizzaType;
};

const Card: React.FC<PropType> = ({ pizzaData }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const modalType = useSelector((state: RootState) => state.modalType);
  const dispatch = useDispatch<AppDispatch>();
  const createdAt = new Date(modalType.selectedPizza?.createdAt ?? new Date());
  const [deletePizza, { isLoading: isDeleting }] = useDeletePizzaMutation();

  const handleBorder = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    e.type === "mouseover"
      ? (divRef.current.style.border = "2px solid grey")
      : (divRef.current.style.border = "2px solid transparent");
  };

  return (
    <div
      className="border p-7 shadow-2xl relative flex flex-col items-center mt-10"
      ref={divRef}
      onMouseOver={handleBorder}
      onMouseOut={handleBorder}
    >
      {!isDeleting ? (
        <Image
          src={pizzaData.image}
          alt={pizzaData.name}
          width={250}
          height={250}
          className="w-[250px] h-[250px] object-cover"
        />
      ) : (
        <Spinner size={200} />
      )}
      <div className="flex gap-2 absolute top-75">
        <button
          className="cursor-pointer bg-yellow-300 text-red-700 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-yellow-400 transition w-24 h-12 text-base"
          onClick={() => dispatch(pizzaDetails(pizzaData))}
        >
          🍕 View
        </button>

        <button
          className="cursor-pointer bg-green-300 text-yellow-800 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-green-400 transition w-24 h-12 text-base"
          onClick={() => dispatch(pizzaEdit(pizzaData))}
        >
          🧀 Edit
        </button>

        <button
          className="cursor-pointer bg-red-400 text-yellow-800 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition w-27 h-12 text-base"
          onClick={async () => await deletePizza(pizzaData?.id).unwrap()}
        >
          🗑️ Delete
        </button>
      </div>

      <Modal
        isModalOpen={modalType.value === "pizzaDetails"}
        closeModal={() => dispatch(closeModal())}
        title="Pizza Details"
      >
        <p>
          <strong>Name: </strong>
          {modalType.selectedPizza?.name ?? "Pizza"}
        </p>
        <hr />
        <p className="mt-2">
          <strong>Price: </strong>${modalType.selectedPizza?.price ?? "Price"}
        </p>
        <hr />
        <p className="mt-2">
          <strong>Date: </strong>
          {createdAt?.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) ?? "Date"}
        </p>
        <hr />
        <p className="mt-2">
          <strong>Description: </strong> Nam eu fringilla felis. Curabitur in
          magna molestie, tristique massa nec, molestie lectus.
        </p>
      </Modal>

      <Modal
        isModalOpen={
          modalType.value === "pizzaOrder" || modalType.value === "pizzaEdit"
        }
        closeModal={() => dispatch(closeModal())}
        title={modalType.value === "pizzaOrder" ? "Add Pizza" : "Edit Pizza"}
      >
        <PizzaForm />
      </Modal>
    </div>
  );
};

export default Card;
