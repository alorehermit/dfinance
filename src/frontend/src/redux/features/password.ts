import { createSlice } from "@reduxjs/toolkit";

const initialState: string = "";

export const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    updatePassword: (state, action) => {
      return action.payload;
    },
  },
});

export const { updatePassword } = passwordSlice.actions;

export default passwordSlice.reducer;
