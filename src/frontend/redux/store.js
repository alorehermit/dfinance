import { configureStore } from "@reduxjs/toolkit";
import identityReducer from "./features/identity";
import selectedReducer from "./features/selected";
import accountsReducer from "./features/accounts";

const store = configureStore({
  reducer: {
    identity: identityReducer,
    selected: selectedReducer,
    accounts: accountsReducer,
  },
});

export default store;
