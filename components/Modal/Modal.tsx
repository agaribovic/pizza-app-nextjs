"use client";
import { ReactNode } from "react";

interface ModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
  title: string;
}

export default function Modal({
  isModalOpen,
  closeModal,
  children,
  title,
}: ModalProps) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 !bg-black !opacity-10" onClick={closeModal}></div>
      <div className="relative bg-white rounded-2xl shadow-lg p-6 z-10 w-[90%] max-w-md text-xl">
        <h1 className="text-3xl text-center font-bold text-gray-900 mb-5">{title}</h1>
        {children}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
