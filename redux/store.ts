import { configureStore } from "@reduxjs/toolkit";
import { pizzaApi } from "./api/pizzaApi";
import modalReducer from "./slices/modalSlice";
import pizzaReducer from "./slices/pizzaDataSlice";

export const store = configureStore({
  reducer: {
    modalType: modalReducer,
    [pizzaApi.reducerPath]: pizzaApi.reducer,
    pizzaData: pizzaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pizzaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
