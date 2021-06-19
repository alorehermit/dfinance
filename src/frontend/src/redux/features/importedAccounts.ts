import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ed25519Account } from "../../global";

const initialState: Ed25519Account[] = [];

export const importedAccountsSlice = createSlice({
  name: "importedAccounts",
  initialState,
  reducers: {
    addNewImportedAccount: (state, action: PayloadAction<Ed25519Account>) => {
      return [...state, action.payload];
    },
    updateImportedAccounts: (
      state,
      action: PayloadAction<Ed25519Account[]>
    ) => {
      return action.payload || [];
    },
  },
});

export const { addNewImportedAccount, updateImportedAccounts } =
  importedAccountsSlice.actions;

export default importedAccountsSlice.reducer;
