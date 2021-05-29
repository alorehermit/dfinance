import { configureStore } from "@reduxjs/toolkit";
import agentReducer from "./features/agent";
import selectedReducer from "./features/selected";
import accountsReducer from "./features/accounts";

const store = configureStore({
  reducer: {
    agent: agentReducer,
    selected: selectedReducer,
    accounts: accountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
