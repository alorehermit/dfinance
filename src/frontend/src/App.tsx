import { useEffect } from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Wallet from "./components/Wallet";
import ComingSoon from "./components/ComingSoon";
import ImportKeyPair from "./components/AuthRelated/ImportKeyPair";
import ConnectWallet from "./components/AuthRelated/ConnectWallet";
import Test from "./components/Test";
import { isIdentityValid } from "./utils/identity";
import Landing from "./components/AuthRelated/Landing";
import SignIn from "./components/AuthRelated/SignIn";
import CreateNewAccount from "./components/AuthRelated/CreateNewAccount";
import "./App.css";
import CreateKeyPair from "./components/AuthRelated/CreateKeyPair";
import { AES } from "crypto-js";

interface Props extends RouteComponentProps {}
const App = (props: Props) => {
  const {
    password,
    selected,
    selectedIndex,
    dfinityIdentity,
    dfinitySubAccounts,
    hdWallets,
    importedAccounts,
  } = useSelector((state: RootState) => state);

  useEffect(() => {
    if (["/", "/signin"].indexOf(props.history.location.pathname) > -1) return;
    // redirect to "/" if no valid agent
    let _isMounted = true;
    isIdentityValid().then((res) => {
      if (!res && _isMounted) props.history.push("/");
    });
    return () => {
      _isMounted = false;
    };
  }, [selected, selectedIndex, dfinityIdentity, hdWallets, importedAccounts]);
  useEffect(() => {
    localStorage.setItem("selected", selected);
  }, [selected]);
  useEffect(() => {
    localStorage.setItem("index", selectedIndex.toString());
  }, [selectedIndex]);
  useEffect(() => {
    localStorage.setItem("DSAs", JSON.stringify(dfinitySubAccounts));
  }, [dfinitySubAccounts]);
  useEffect(() => {
    if (!password) return console.log("no access");
    localStorage.setItem(
      "Wallets",
      AES.encrypt(JSON.stringify(hdWallets), password).toString()
    );
  }, [hdWallets]);
  useEffect(() => {
    if (!password) return console.log("no access");
    localStorage.setItem(
      "Imported",
      AES.encrypt(JSON.stringify(importedAccounts), password).toString()
    );
  }, [importedAccounts]);

  return (
    <div className="Layout">
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
      <Route path="/" exact render={() => <Landing />} />
      <Route path="/signin" exact render={() => <SignIn />} />
      <Route path="/wallet" exact render={() => <Wallet />} />
      <Route path="/connectwallet" render={() => <ConnectWallet />} />
      <Route path="/importkeypair" exact render={() => <ImportKeyPair />} />
      <Route path="/createkeypair" exact render={() => <CreateKeyPair />} />
      <Route path="/createaccount" exact render={() => <CreateNewAccount />} />
      <Route path="/dtoken" exact render={() => <ComingSoon />} />
      {/* <Route path="/DUSD" exact render={() => <ComingSoon />} />
      <Route path="/DLend" exact render={() => <ComingSoon />} /> 
      <Route path="/newtoken" exact render={() => <TokenIssueForm />} /> */}
      <Route path="/swap" render={() => <ComingSoon />} />
      <Route path="/test" render={() => <Test />} />
    </div>
  );
};

export default withRouter(App);
