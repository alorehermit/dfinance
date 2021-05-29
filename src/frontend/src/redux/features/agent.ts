import { Agent } from "@dfinity/agent";
import { createSlice } from "@reduxjs/toolkit";

const initialState: null | Agent = null;

export const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    updateIdentity: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateIdentity } = agentSlice.actions;

export default agentSlice.reducer;
