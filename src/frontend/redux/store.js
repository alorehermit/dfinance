import { configureStore } from "@reduxjs/toolkit";
import identityReducer from "./features/identity";

const store = configureStore({
  reducer: {
    identity: identityReducer,
  },
});

export default store;
