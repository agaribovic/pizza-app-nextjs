"use client";
import Image from "next/image";
import React, { FC, useRef, useEffect, useCallback } from "react";
import Modal from "@/components/Modal/Modal";
import Spinner from "../Spinner/Spinner";
import Form from "../Form/Form";
import { PizzaType } from "@/app/page";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { pizzaDetails, closeModal, pizzaEdit } from "@/redux/slices/modalSlice";
import { useDeletePizzaMutation } from "@/redux/api/pizzaApi";
import { setLoggedIn, setLoggedOut } from "@/redux/slices/authSlice";
import { useGetAdminQuery } from "@/redux/api/adminApi";

type CardProps = {
  pizzaData: PizzaType;
};

const Card: FC<CardProps> = ({ pizzaData }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [deletePizza, { isLoading: isDeleting }] = useDeletePizzaMutation();

  const { modalType, isLoggedIn } = useSelector(
    (state: RootState) => ({
      modalType: state.modalType,
      isLoggedIn: state.auth.isLoggedIn,
    }),
    shallowEqual
  );

  const createdAt = new Date(modalType.selectedPizza?.createdAt ?? new Date());
  const { data } = useGetAdminQuery();

  const isPizzaDetails = modalType.value === "pizzaDetails";
  const isPizzaForm = ["pizzaOrder", "pizzaEdit"].includes(modalType.value ?? "");

  const handleBorder = useCallback((hover: boolean) => {
    if (!divRef.current) return;
    divRef.current.classList.toggle("border-gray-500", hover);
    divRef.current.classList.toggle("border-transparent", !hover);
  }, []);

  const handleLogoutTimer = useCallback(() => {
    if (!data?.expiresIn) return;

    dispatch(setLoggedIn());
    const timer = setTimeout(() => dispatch(setLoggedOut()), data.expiresIn);

    return () => clearTimeout(timer);
  }, [data, dispatch]);

  useEffect(() => {
    handleLogoutTimer();
    if (isLoggedIn) dispatch(closeModal());
  }, [handleLogoutTimer, isLoggedIn, dispatch]);

  const getModalTitle = () => {
    if (!isLoggedIn) return "Login 🍕";
    if (modalType.value === "pizzaOrder") return "Add 🍕";
    if (modalType.value === "pizzaEdit") return "Edit 🍕";
    return "";
  };

  const buttonClass = (bg: string, text: string) =>
    `cursor-pointer ${bg} ${text} font-bold px-4 py-2 rounded-lg shadow-md hover:brightness-110 transition w-24 h-12 text-base`;

  return (
    <div
      className="border border-transparent p-7 shadow-2xl relative flex flex-col items-center mt-10 transition-colors"
      ref={divRef}
      onMouseOver={() => handleBorder(true)}
      onMouseOut={() => handleBorder(false)}
    >
      {!isDeleting ? (
        <Image
          src={pizzaData.image}
          alt={pizzaData.name}
          width={250}
          height={250}
          className="w-[250px] h-[250px] object-cover"
          loading="lazy"
        />
      ) : (
        <Spinner size={200} />
      )}

      <div className="flex gap-2 absolute top-75">
        <button
          aria-label="View pizza"
          className={buttonClass("bg-yellow-300", "text-red-700")}
          onClick={() => dispatch(pizzaDetails(pizzaData))}
        >
          🍕 View
        </button>

        {isLoggedIn && (
          <>
            <button
              aria-label="Edit pizza"
              className={buttonClass("bg-green-300", "text-yellow-800")}
              onClick={() => dispatch(pizzaEdit(pizzaData))}
            >
              🧀 Edit
            </button>
            <button
              aria-label="Delete pizza"
              className="cursor-pointer bg-red-400 text-yellow-800 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition w-27 h-12 text-base"
              onClick={async () => await deletePizza(pizzaData.id).unwrap()}
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>

      {isPizzaDetails && (
        <Modal
          isModalOpen={isPizzaDetails}
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
            {createdAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
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
          isModalOpen={isPizzaForm}
          closeModal={() => dispatch(closeModal())}
          title={getModalTitle()}
        >
          <Form />
        </Modal>
      )}
    </div>
  );
};

export default React.memo(Card);
