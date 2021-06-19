import { configureStore } from "@reduxjs/toolkit";
import agentReducer from "./features/agent";
import selectedReducer from "./features/selected";
import selectedIndexReducer from "./features/selectedIndex";
import hdWalletsReducer from "./features/hdWallets";
import importedAccountsReducer from "./features/importedAccounts";
import dfinityIdentityReducer from "./features/dfinityIdentity";
import dfinitySubAccountsReducer from "./features/dfinitySubAccounts";
import passwordReducer from "./features/password";

const store = configureStore({
  reducer: {
    agent: agentReducer,
    selected: selectedReducer,
    selectedIndex: selectedIndexReducer,
    hdWallets: hdWalletsReducer,
    importedAccounts: importedAccountsReducer,
    dfinityIdentity: dfinityIdentityReducer,
    dfinitySubAccounts: dfinitySubAccountsReducer,
    password: passwordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
