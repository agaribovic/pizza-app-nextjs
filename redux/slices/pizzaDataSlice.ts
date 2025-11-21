import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PizzaType } from "@/app/page";

interface PizzaState {
  pizzaData: PizzaType[];
  sortedPizzas: PizzaType[];
}

const initialState: PizzaState = {
  pizzaData: [],
  sortedPizzas: [],
};

export const pizzaSlice = createSlice({
  name: "pizzaData",
  initialState,
  reducers: {
    setPizzaData: (state, action: PayloadAction<PizzaType[]>) => {
      state.pizzaData = action.payload;
      state.sortedPizzas = [...action.payload]; 
    },
    setSortedPizzas: (state, action: PayloadAction<PizzaType[]>) => {
      state.sortedPizzas = [...action.payload]; 
    },
  },
});

export const { setPizzaData, setSortedPizzas } = pizzaSlice.actions;
export default pizzaSlice.reducer;
