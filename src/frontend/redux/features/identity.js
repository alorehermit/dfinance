import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const identitySlice = createSlice({
  name: "identity",
  initialState,
  reducers: {
    updateIdentity: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateIdentity } = identitySlice.actions;

export default identitySlice.reducer;
