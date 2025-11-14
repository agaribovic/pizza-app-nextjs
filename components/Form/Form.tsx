import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useAddPizzaMutation, useEditPizzaMutation } from "@/redux/api/pizzaApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useLoginAdminMutation } from "@/redux/api/adminApi";
import { setLoggedIn } from "@/redux/slices/authSlice";
import Spinner from "../Spinner/Spinner";

interface FormData {
  name?: string;
  price?: number;
  image?: string | File;
  description?: string;
  email?: string;
  password?: string;
}

export default function Form() {

  // --- Form state ---
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: 0.0,
    image: "",
    description: "",
    email: "",
    password: "",
  });

  // --- Local state ---
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);

  // --- API hooks ---
  const [addPizza] = useAddPizzaMutation();
  const [editPizza] = useEditPizzaMutation();
  const [loginAdmin] = useLoginAdminMutation();

  // --- Redux selector ---
  const modalType = useSelector((state: RootState) => state.modalType);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch<AppDispatch>();

  // --- Form data ---
  const { name, price, image, description, email, password } = formData;

  // --- Mode flags ---
  const isAddMode = modalType.value === "pizzaOrder";
  const isEditMode = modalType.value === "pizzaEdit";
  const isLoginMode = !isLoggedIn;

  // --- Validation flags ---
  const isAddInvalid = isAddMode && (!name || !price || !image || !description);
  const isEditInvalid = isEditMode && !name && !price && !image && !description;
  const isLoginInvalid = !email || !password;

  // --- Button disabled state ---
  const btnDisabled =
    submitting ||
    (isLoginMode ? isLoginInvalid : isAddInvalid || isEditInvalid);

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
    setErrorMessage(null);

    try {
      const formData = Object.entries({
        name,
        price: price?.toString(),
        description,
        email,
        password,
      }).reduce((fd, [key, value]) => {
        if (value) fd.append(key, value);
        return fd;
      }, new FormData());

      if (image instanceof File) {
        formData.append("file", image);
      }

      if (isLoginMode) {
        const result = await loginAdmin({
          email: email ?? "",
          password: password ?? "",
        }).unwrap();

        dispatch(setLoggedIn({ email: result.email, role: result.role }));
        return;
      }

      if (isAddMode) {
        await addPizza(formData).unwrap();
        setFormData({ name: "", price: 0.0, image: "", description: "" });
      } else if (modalType.selectedPizza) {
        await editPizza({
          id: modalType.selectedPizza.id,
          data: formData,
        }).unwrap();
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      const action = isLoginMode ? "login" : isAddMode ? "add" : "edit";
      const message = err?.data?.message ?? err?.error ?? (err instanceof Error ? err.message : "Unknown error");
      setErrorMessage(`Failed to ${action}: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 text-gray-900 -mt-4 text-center"
    >
      {!isLoginMode ? (
        <>
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
        </>
      ) : (
        <>
          <div>
            <label htmlFor="email" className="block">
              E-mail:
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="border rounded p-2 w-full"
              defaultValue={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block">
              Password:
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border rounded p-2 w-full"
              defaultValue={formData.password}
              onChange={handleChange}
            />
          </div>
        </>
      )}
      <button
        type="submit"
        className={`bg-[#1B2533] text-white px-4 py-2 rounded w-32 h-12 ${
          btnDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#1B2533] cursor-pointer"
        }`}
        disabled={btnDisabled}
      >
        {submitting ? <Spinner size={30} /> : isLoginMode ? "Login" : "Submit"}
      </button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
}
