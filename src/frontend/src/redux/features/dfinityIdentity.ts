import { createSlice } from "@reduxjs/toolkit";
import { Account } from "../../global";

const initialState: Account = {
  type: "DelegationIdentity",
  principal: "",
  publicKey: "",
  keys: ["", ""],
};

export const dfinityIdentitySlice = createSlice({
  name: "dfinityIdentity",
  initialState,
  reducers: {
    updateDfinityIdentity: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateDfinityIdentity } = dfinityIdentitySlice.actions;

export default dfinityIdentitySlice.reducer;
