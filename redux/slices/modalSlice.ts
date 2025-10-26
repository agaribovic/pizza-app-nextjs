import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PizzaType } from "@/app/page";

interface ModalType {
  value: string | null;
  selectedPizza?: PizzaType;
}

const initialState: ModalType = {
  value: null,
  selectedPizza: undefined,
};

const modalSlice = createSlice({
  name: "modalType",
  initialState,
  reducers: {
    pizzaOrder: (state, action: PayloadAction<PizzaType | undefined>) => {
      state.value = "pizzaOrder";
      state.selectedPizza = action.payload;
    },
    pizzaDetails: (state, action: PayloadAction<PizzaType | undefined>) => {
      state.value = "pizzaDetails";
      state.selectedPizza = action.payload;
    },
    closeModal: (state) => {
      state.value = initialState.value;
      state.selectedPizza = undefined;
    },
    pizzaEdit: (state, action: PayloadAction<PizzaType | undefined>) => {
      state.value = "pizzaEdit";
      state.selectedPizza = action.payload;
    },
  },
});

export const { pizzaOrder, pizzaDetails, closeModal, pizzaEdit } =
  modalSlice.actions;
export default modalSlice.reducer;
