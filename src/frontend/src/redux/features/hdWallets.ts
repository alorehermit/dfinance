import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ed25519Account } from "../../global";

const initialState: Ed25519Account[] = [];

export const hdWalletsSlice = createSlice({
  name: "hdWallets",
  initialState,
  reducers: {
    addNewHdWallet: (state, action: PayloadAction<Ed25519Account>) => {
      return [...state, action.payload];
    },
    updateHdWallets: (state, action: PayloadAction<Ed25519Account[]>) => {
      return action.payload || [];
    },
  },
});

export const { addNewHdWallet, updateHdWallets } = hdWalletsSlice.actions;

export default hdWalletsSlice.reducer;
