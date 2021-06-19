import { useEffect, useState } from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { updateSelected } from "./redux/features/selected";
import { updateAccounts } from "./redux/features/accounts";
import Wallet from "./components/Wallet";
import ComingSoon from "./components/ComingSoon";
import ImportKeyPair from "./components/AuthRelated/ImportKeyPair";
import CreateKeyPair from "./components/AuthRelated/CreateKeyPair";
import ConnectWallet from "./components/AuthRelated/ConnectWallet";
import { Account } from "./global";
import { AES, enc } from "crypto-js";
import { AuthClient } from "@dfinity/auth-client";
import { updateDfinityIdentity } from "./redux/features/dfinityIdentity";
import { DelegationIdentity } from "@dfinity/identity";
import { Identity } from "@dfinity/identity/node_modules/@dfinity/agent";
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import AccountModal from "./components/AuthRelated/AccountModal";
import Test from "./components/Test";
import "./App.css";

interface Props extends RouteComponentProps {}
const App = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const dfinityIdentity = useSelector(
    (state: RootState) => state.dfinityIdentity
  );
  const accounts = useSelector((state: RootState) => state.accounts);
  const selected = useSelector((state: RootState) => state.selected);
  const dispatch = useDispatch();

  useEffect(() => {
    initialUserCheck(); // initial store based on the values from localStorage
  }, []);
  useEffect(() => {
    if (loading) return;
    // update selected in localStorage
    if (
      selected &&
      (dfinityIdentity.publicKey === selected ||
        accounts.find((i) => i.publicKey === selected))
    ) {
      setShowAccountModal(false);
      localStorage.setItem("selected", selected);
    } else {
      localStorage.setItem("selected", "");
      if (accounts && accounts.length > 0) {
        setShowAccountModal(true);
      } else {
        setShowAccountModal(false);
        props.history.push("/connectwallet");
      }
    }
  }, [selected, dfinityIdentity, accounts]);
  useEffect(() => {
    // update accounts in localStorage
    const encryptedPwd = localStorage.getItem("password");
    if (accounts.length > 0 && encryptedPwd) {
      const encryptedAccounts = AES.encrypt(
        JSON.stringify(accounts),
        encryptedPwd
      ).toString();
      localStorage.setItem("accounts", encryptedAccounts);
      dispatch(updateSelected(accounts[accounts.length - 1].publicKey));
    }
  }, [accounts]);

  const initialUserCheck = async () => {
    // Check on whether any ed25519 identities exist locally,
    // and update the store.account at first.
    let hasEd25519Identity = false;
    const encryptedAccounts = localStorage.getItem("accounts");
    let localAccounts: Account[] = [];
    if (encryptedAccounts) {
      const encryptedPwd = localStorage.getItem("password");
      localAccounts = JSON.parse(
        AES.decrypt(encryptedAccounts, encryptedPwd || "").toString(enc.Utf8)
      );
      if (Array.isArray(localAccounts) && localAccounts[0]) {
        hasEd25519Identity = true;
        dispatch(updateAccounts(localAccounts));
      }
    }

    // Check on whether a dfinity identity exists locally,
    // and update the store.dfinityIdentity.
    let hasDfinityIdentity = false;
    let userIdentity: Identity | null = null;
    const authClient = await AuthClient.create();
    const isAuth = await authClient.isAuthenticated();
    if (isAuth) {
      userIdentity = authClient.getIdentity();
      if (userIdentity instanceof DelegationIdentity) {
        hasDfinityIdentity = true;
        const keys: JsonnableEd25519KeyIdentity = JSON.parse(
          localStorage.getItem("ic-identity") || "[]"
        );
        const obj = {
          type: "DelegationIdentity",
          principal: userIdentity.getPrincipal().toString(),
          publicKey: keys[0],
          keys,
        };
        dispatch(updateDfinityIdentity(obj));
      }
    }

    // update store.selected
    const localSelected = localStorage.getItem("selected");
    if (localSelected) {
      dispatch(updateSelected(localSelected));
    } else {
      if (hasDfinityIdentity) {
        // if dfinity identity exists, set it as the connected identity.
        dispatch(
          updateSelected(
            JSON.parse(localStorage.getItem("ic-identity") || "[]")[0] || ""
          )
        );
      } else {
        if (hasEd25519Identity) {
          // if any ed25519 identities exist locally, set the first one as the connected identity.
          dispatch(updateSelected(localAccounts[0].publicKey));
        }
      }
    }

    setTimeout(() => {
      // redirect to connect wallet if no identity found
      if (!hasDfinityIdentity && !hasEd25519Identity) {
        props.history.push("/connectwallet");
      }
      setLoading(false);
    }, 200);
  };

  return (
    <div className="Layout">
      {loading ? null : (
        <>
          {/* {props.history.location.pathname !== "/newtoken" ? (
            <Header withNav={true} />
          ) : null}
          <div
            className={classNames(
              "layout-bg",
              { status1: props.history.location.pathname === "/" },
              { status2: props.history.location.pathname === "/dtoken" },
              { disabled: props.history.location.pathname === "/newtoken" }
            )}
          >
            <svg
              className="accessory-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2368.707 824.631"
            >
              <path
                id="路径_72"
                data-name="路径 72"
                d="M4395.531-6686.679c-586.145-90.224-675.187,163.824-1143.015,213.577s-670.924-200.5-990.235-34.53S2383.694-5895,2383.694-5895l2131.216,13.737Z"
                transform="translate(-2146.202 6705.895)"
                fill="#f5f5f5"
              />
            </svg>
            <svg
              className="accessory-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2147.404 816.905"
            >
              <path
                id="路径_73"
                data-name="路径 73"
                d="M4461.668-6629.178c-482.182-192.152-807.01,79.89-1222,62.753s-584.357-146.518-757.722-13.424S2383.694-5895,2383.694-5895l2131.216,13.737Z"
                transform="translate(-2367.505 6698.168)"
                fill="#fff"
              />
            </svg>
          </div> */}
          <Route path="/" exact render={() => <Wallet />} />
          <Route path="/connectwallet" render={() => <ConnectWallet />} />
          <Route path="/importkeypair" exact render={() => <ImportKeyPair />} />
          <Route path="/createkeypair" exact render={() => <CreateKeyPair />} />
          <Route path="/dtoken" exact render={() => <ComingSoon />} />
          {/* <Route path="/DUSD" exact render={() => <ComingSoon />} />
          <Route path="/DLend" exact render={() => <ComingSoon />} /> 
          <Route path="/newtoken" exact render={() => <TokenIssueForm />} /> */}
          <Route path="/swap" render={() => <ComingSoon />} />
          <Route path="/test" render={() => <Test />} />
        </>
      )}
      {showAccountModal &&
      ["/connectwallet", "/importkeypair", "/createkeypair"].indexOf(
        props.history.location.pathname
      ) < 0 ? (
        <AccountModal />
      ) : null}
    </div>
  );
};

export default withRouter(App);
