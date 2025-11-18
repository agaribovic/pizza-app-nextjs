"use client";
import Image from "next/image";
import Modal from "@/components/Modal/Modal";
import Spinner from "../Spinner/Spinner";
import Form from "../Form/Form";
import { useRef, useEffect } from "react";
import { PizzaType } from "@/app/page";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { pizzaDetails, closeModal, pizzaEdit } from "@/redux/slices/modalSlice";
import { useDeletePizzaMutation } from "@/redux/api/pizzaApi";
import { setLoggedOut } from "@/redux/slices/authSlice";
import { useGetAdminQuery } from "@/redux/api/adminApi";
import { setLoggedIn } from "@/redux/slices/authSlice";

type PropType = {
  pizzaData: PizzaType;
};

const Card: React.FC<PropType> = ({ pizzaData }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const modalType = useSelector((state: RootState) => state.modalType);
  const dispatch = useDispatch<AppDispatch>();
  const createdAt = new Date(modalType.selectedPizza?.createdAt ?? new Date());
  const [deletePizza, { isLoading: isDeleting }] = useDeletePizzaMutation();
  const isPizzaDetails = modalType.value === "pizzaDetails";
  const isPizzaForm =
    modalType.value === "pizzaOrder" || modalType.value === "pizzaEdit";
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { data } = useGetAdminQuery();

  const handleBorder = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    e.type === "mouseover"
      ? (divRef.current.style.border = "2px solid grey")
      : (divRef.current.style.border = "2px solid transparent");
  };

  useEffect(() => {
    if (data?.expiresIn) {
      dispatch(setLoggedIn());

      const timeUntilExpiration = data.expiresIn;

      if (timeUntilExpiration > 0) {
        const timer = setTimeout(() => {
          dispatch(setLoggedOut());
        }, timeUntilExpiration);

        return () => clearTimeout(timer);
      } else {
        dispatch(setLoggedOut());
      }
    }

    if (isLoggedIn) {
      dispatch(closeModal());
    }
  }, [data, isLoggedIn, dispatch]);

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
          priority
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

        {isLoggedIn && (
          <>
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
          </>
        )}
      </div>
      {isPizzaDetails && (
        <Modal
          isModalOpen={modalType.value === "pizzaDetails"}
          closeModal={() => dispatch(closeModal())}
          title="🍕 Details"
        >
          <p>
            <strong>Name: </strong>
            {modalType.selectedPizza?.name ?? "Name"}
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
            <strong>Description: </strong>
            {modalType.selectedPizza?.description ?? "Description"}
          </p>
        </Modal>
      )}

      {isPizzaForm && (
        <Modal
          isModalOpen={
            modalType.value === "pizzaOrder" || modalType.value === "pizzaEdit"
          }
          closeModal={() => dispatch(closeModal())}
          title={
            isLoggedIn
              ? modalType.value === "pizzaOrder"
                ? "Add 🍕"
                : "Edit 🍕"
              : "Login 🍕"
          }
        >
          <Form />
        </Modal>
      )}
    </div>
  );
};

export default Card;
