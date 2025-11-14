import { configureStore } from "@reduxjs/toolkit";
import { pizzaApi } from "./api/pizzaApi";
import { adminApi } from "./api/adminApi";
import modalReducer from "./slices/modalSlice";
import pizzaReducer from "./slices/pizzaDataSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    modalType: modalReducer,
    pizzaData: pizzaReducer,
    auth: authReducer,
    [pizzaApi.reducerPath]: pizzaApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(pizzaApi.middleware)
      .concat(adminApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
