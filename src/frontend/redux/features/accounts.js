import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    addNewAccount: (state, action) => {
      return [...state, action.payload];
    },
    updateAccounts: (state, action) => {
      return action.payload || [];
    },
  },
});

export const { addNewAccount, updateAccounts } = accountsSlice.actions;

export default accountsSlice.reducer;
