import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DfinitySubAccount } from "../../global";

const initialState: DfinitySubAccount[] = [];

export const dfinitySubAccountsSlice = createSlice({
  name: "dfinitySubAccounts",
  initialState,
  reducers: {
    addNewDfinitySubAccount: (
      state,
      action: PayloadAction<DfinitySubAccount>
    ) => {
      return [...state, action.payload];
    },
    updateDfinitySubAccounts: (
      state,
      action: PayloadAction<DfinitySubAccount[]>
    ) => {
      return action.payload || [];
    },
    updateDfinityMainAccount: (
      state,
      action: PayloadAction<DfinitySubAccount>
    ) => {
      let arr = state.concat();
      arr.splice(0, 1, action.payload);
      return arr;
    },
  },
});

export const {
  addNewDfinitySubAccount,
  updateDfinitySubAccounts,
  updateDfinityMainAccount,
} = dfinitySubAccountsSlice.actions;

export default dfinitySubAccountsSlice.reducer;
