import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  email?: string;
  role?: "admin";
}

const initialState: AuthState = {
  isLoggedIn: false,
  email: undefined,
  role: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<{ email: string; role: "admin" }>) => {
      state.isLoggedIn = true;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.email = undefined;
      state.role = undefined;
    },
  },
});

export const { setLoggedIn, setLoggedOut } = authSlice.actions;
export default authSlice.reducer;
