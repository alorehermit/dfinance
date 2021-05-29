import { createSlice } from "@reduxjs/toolkit";

const initialState: string = "";

export const selectedSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    updateSelected: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateSelected } = selectedSlice.actions;

export default selectedSlice.reducer;
