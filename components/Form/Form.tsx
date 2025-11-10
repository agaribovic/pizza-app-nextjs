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
  description: string;
}

export default function PizzaForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0.0,
    image: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const [addPizza] = useAddPizzaMutation();
  const [editPizza] = useEditPizzaMutation();
  const modalType = useSelector((state: RootState) => state.modalType);

  const { value: modal } = modalType;
  const { name, price, image, description } = formData;
  const isAddMode = modal === "pizzaOrder";
  const isEditMode = modal === "pizzaEdit";
  const isAddInvalid = isAddMode && (!name || !price || !image || !description);
  const isEditInvalid = isEditMode && !name && !price && !image && !description;
  const btnDisabled = isAddInvalid || isEditInvalid || submitting;

  type InputElements = | HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

  const handleChange = (e: ChangeEvent<InputElements>) => {
    const target = e.target;
    const { name, value, type } = target;

    const newValue =
      type === "file" && target instanceof HTMLInputElement
        ? target.files?.[0] ?? ""
        : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    if (isAddMode && (!formData.image || !(formData.image instanceof File)))
      return;

    const data = new FormData();
    if (name) data.append("name", name);
    if (price) data.append("price", price.toString());
    if (formData.image instanceof File) data.append("file", formData.image);
    if (description) data.append("description", description);

    try {
      (await isAddMode)
        ? addPizza(data).unwrap()
        : editPizza({ id: modalType.selectedPizza!.id, data }).unwrap();
      setTimeout(() => {
        isAddMode &&
          setFormData({ name: "", price: 0.0, image: "", description: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSubmitting(false);
      }, 1000);
    } catch (e) {
      console.error(
        `Failed to add pizza: ${e instanceof Error ? e.message : e}`
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 text-gray-900 -mt-4 text-center"
    >
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

      <div>
        <label htmlFor="description" className="block">
          Description:
        </label>
        <textarea
          name="description"
          placeholder="An Italian dish consisting of a flat, leavened dough base topped with ingredients such as..."
          onChange={handleChange}
          rows={4}
          cols={40}
          className="border rounded p-2 w-full"
          defaultValue={modalType.selectedPizza?.description}
          required={isAddMode}
        />
      </div>

      <button
        type="submit"
        className={`bg-[#1B2533] text-white px-4 py-2 rounded w-32 h-12 ${
          btnDisabled
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
