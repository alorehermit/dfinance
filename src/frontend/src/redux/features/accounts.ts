import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "../../global";

const initialState: Account[] = [];

export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    addNewAccount: (state, action: PayloadAction<Account>) => {
      return [...state, action.payload];
    },
    updateAccounts: (state, action: PayloadAction<Account[]>) => {
      return action.payload || [];
    },
  },
});

export const { addNewAccount, updateAccounts } = accountsSlice.actions;

export default accountsSlice.reducer;
