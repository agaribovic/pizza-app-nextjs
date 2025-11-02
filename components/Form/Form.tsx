import { useState, useRef, FormEvent, ChangeEvent } from "react";
import {
  useAddPizzaMutation,
  useEditPizzaMutation,
} from "@/redux/api/pizzaApi";
import Spinner from "../Spinner/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface FormData {
  name: string;
  price: number;
  image: string | File;
}

export default function PizzaForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0.0,
    image: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const [addPizza] = useAddPizzaMutation();
  const [editPizza] = useEditPizzaMutation();
  const modalType = useSelector((state: RootState) => state.modalType);

  const { value: modal } = modalType;
  const { name, price, image } = formData;
  const isAddMode = modal === "pizzaOrder";
  const isEditMode = modal === "pizzaEdit";
  const isAddInvalid = isAddMode && (!name || !price || !image);
  const isEditInvalid = isEditMode && (!name && !price && !image);
  const btnDisabled = (isAddInvalid || isEditInvalid || submitting);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files?.[0] ?? "" : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    if (isAddMode && (!formData.image || !(formData.image instanceof File))) return;
    const data = new FormData();

    if (name) data.append("name", name);
    if (price !== null && price !== 0) {
      data.append("price", price.toString());
    }
    if (formData.image instanceof File) data.append("file", formData.image);


    try {
      await isAddMode
        ? addPizza(data).unwrap()
        : editPizza({ id: modalType.selectedPizza!.id, data }).unwrap();
      setTimeout(() => {
        isAddMode && setFormData({ name: "", price: 0.0, image: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSubmitting(false);
      }, 1000);
    } catch (e) {
      console.error("Error submitting form:", e);
      console.error(
        `Failed to add pizza: ${e instanceof Error ? e.message : e}`
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 text-gray-900 -mt-4">
      <div>
        <label htmlFor="name" className="block">
          Name:
        </label>
        <input
          type="text"
          name="name"
          defaultValue={modalType.selectedPizza?.name}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          id="name"
          placeholder="Margherita"
          required={isAddMode}
        />
      </div>

      <div>
        <label htmlFor="price" className="block">
          Price (USD):
        </label>
        <input
          type="number"
          name="price"
          defaultValue={modalType.selectedPizza?.price}
          onChange={handleChange}
          ref={numberRef}
          className="border rounded p-2 w-full"
          id="price"
          min="1"
          max="200"
          step="0.01"
          placeholder="11.50"
          required={isAddMode}
        />
      </div>

      <div>
        <label htmlFor="image" className="block">
          Image:
        </label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          ref={fileInputRef}
          className="border rounded p-2 w-full"
          id="image"
          required={isAddMode}
        />
      </div>
      <button
        type="submit"
        className={`bg-[#1B2533] text-white px-4 py-2 rounded w-32 h-12 ${btnDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#1B2533] cursor-pointer"
          }`}
        disabled={btnDisabled}
      >
        {submitting ? <Spinner size={30} /> : "Submit"}
      </button>
    </form>
  );
}
