import classNames from "classnames";
import { useEffect, useState } from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { updateSelected } from "./redux/features/selected";
import { updateAccounts } from "./redux/features/accounts";
import Header from "./components/header/Header";
import Wallet from "./components/Wallet";
import TokenIssue from "./components/TokenIssue";
import ComingSoon from "./components/ComingSoon";
import TokenIssueForm from "./components/TokenIssueForm";
import ImportKeyPair from "./components/AuthRelated/ImportKeyPair";
import CreateKeyPair from "./components/AuthRelated/CreateKeyPair";
import Swap from "./components/SwapRelated/Swap";
import ConnectWallet from "./components/ConnectWallet";
import Test from "./components/Test";
import { Account } from "./global";
import { AES, enc } from "crypto-js";
import "./App.css";

interface Props extends RouteComponentProps {}
const App = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const accounts = useSelector((state: RootState) => state.accounts);
  const selected = useSelector((state: RootState) => state.selected);
  const dispatch = useDispatch();

  useEffect(() => {
    initialUserCheck();
  }, []);
  useEffect(() => {
    const theSelectedOne = accounts.find((i) => i.publicKey === selected);
    if (selected && theSelectedOne) {
      // update selected in localStorage
      localStorage.setItem("selected", JSON.stringify(selected));
      if (theSelectedOne.type === "DelegationIdentity") {
        localStorage.setItem(
          "ic-identity",
          JSON.stringify(theSelectedOne.keys)
        );
        localStorage.setItem(
          "ic-delegation",
          JSON.stringify(theSelectedOne.delegationChain)
        );
      }
    } else {
      localStorage.removeItem("selected");
    }
  }, [selected]);
  useEffect(() => {
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
  // useEffect(() => {
  //   if (
  //     !selected &&
  //     ["/connectwallet", "/importkeypair", "/createkeypair"].indexOf(
  //       props.history.location.pathname
  //     ) === -1
  //   ) {
  //     props.history.push("/connectwallet");
  //   }
  // }, [selected, props.history]);

  const initialUserCheck = async () => {
    // check on whether any key pair found locally
    const encryptedPwd = localStorage.getItem("password");
    const localAccounts =
      AES.decrypt(
        localStorage.getItem("accounts") || "",
        encryptedPwd || ""
      ).toString(enc.Utf8) || "[]";
    if (localAccounts && JSON.parse(localAccounts)[0]) {
      dispatch(updateAccounts(JSON.parse(localAccounts)));
      const localSelected = localStorage.getItem("selected");
      if (localSelected) {
        dispatch(updateSelected(JSON.parse(localSelected)));
      } else {
        dispatch(
          updateSelected((JSON.parse(localAccounts)[0] as Account).publicKey)
        );
      }
    } else {
      props.history.push("/connectwallet");
    }
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  return (
    <div className="Layout">
      {loading ? null : (
        <>
          {props.history.location.pathname !== "/newtoken" ? (
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
          </div>
          <Route path="/" exact render={() => <Wallet />} />
          <Route path="/connectwallet" render={() => <ConnectWallet />} />
          <Route path="/importkeypair" exact render={() => <ImportKeyPair />} />
          <Route path="/createkeypair" exact render={() => <CreateKeyPair />} />
          <Route path="/dtoken" exact render={() => <TokenIssue />} />
          <Route path="/DUSD" exact render={() => <ComingSoon />} />
          <Route path="/DLend" exact render={() => <ComingSoon />} />
          <Route path="/newtoken" exact render={() => <TokenIssueForm />} />
          <Route path="/swap" render={() => <Swap />} />
          <Route path="/test" exact render={() => <Test />} />
        </>
      )}
    </div>
  );
};

export default withRouter(App);
