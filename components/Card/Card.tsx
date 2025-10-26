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
      className="border p-7 shadow-2xl relative"
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
        />
      ) : (
        <Spinner size={200} />
      )}
      <button
        className="absolute left-1/8 cursor-pointer"
        onClick={() => dispatch(pizzaDetails(pizzaData))}
      >
        View More
      </button>

      <button
        className="absolute left-1/2 cursor-pointer"
        onClick={() => dispatch(pizzaEdit(pizzaData))}
      >
        Edit
      </button>

      <button
        className="absolute right-1/8 cursor-pointer"
        onClick={async () => {
          try {
            await deletePizza(pizzaData?.id).unwrap();
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Delete
      </button>

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
    </div>
  );
};

export default Card;
