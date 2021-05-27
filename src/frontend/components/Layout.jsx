import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Route, withRouter } from "react-router-dom";
import Header from "./Header.jsx";
import ProtectedRouteWrap from "../utils/ProtectedRouteWrap.jsx";
import Wallet from "./Wallet.jsx";
import TokenIssue from "./TokenIssue.jsx";
import TokenIssueForm from "./TokenIssueForm.jsx";
import Test from "./Test.jsx";
import Swap from "./SwapRelated/Swap.jsx";
import ComingSoon from "./ComingSoon.jsx";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { useDispatch, useSelector } from "react-redux";
import { HttpAgent } from "@dfinity/agent";
import { updateSelected } from "../redux/features/selected.js";
import { updateAccounts } from "../redux/features/accounts.js";
import ImportKeyPair from "./AuthRelated/ImportKeyPair.jsx";
import CreateKeyPair from "./AuthRelated/CreateKeyPair.jsx";
import { getHexFromUint8Array } from "../utils/common.js";
import { AuthClient } from "@dfinity/auth-client";
import "./Layout.css";

const Layout = (props) => {
  const [loading, setLoading] = useState(true);
  const accounts = useSelector((state) => state.accounts);
  const selected = useSelector((state) => state.selected);
  const dispatch = useDispatch();

  useEffect(() => {
    initialUserCheck();
  }, []);
  useEffect(() => {
    if (selected) {
      if (selected.type === "Ed25519KeyIdentity") {
        localStorage.setItem("selected", JSON.stringify(selected));
        const keyIdentity = Ed25519KeyIdentity.fromParsedJson(selected.keys);
        const agent = new HttpAgent({
          host: "http://localhost:8000/",
          identity: keyIdentity,
        });
        window.ic = { agent };
      } else if (selected.type === "DelegationIdentity") {
        localStorage.setItem("selected", JSON.stringify(selected));
        localStorage.setItem("ic-identity", JSON.stringify(selected.keys));
        localStorage.setItem(
          "ic-delegation",
          JSON.stringify(selected.delegationChain)
        );
        setTimeout(async () => {
          const authClient = await AuthClient.create();
          const identity = authClient.getIdentity();
          console.log(
            "account principal: ",
            identity.getPrincipal().toString()
          );
          console.log(
            "account public key: ",
            getHexFromUint8Array(identity.getPublicKey().toDer())
          );
          const agent = new HttpAgent({
            host: "http://localhost:8000/",
            identity,
          });
          window.ic = { agent };
        }, 200);
      } else {
        localStorage.removeItem("selected");
        window.ic = { agent: null };
      }
    } else {
      localStorage.removeItem("selected");
      window.ic = { agent: null };
    }
  }, [selected]);
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem("accounts", JSON.stringify(accounts));
      dispatch(updateSelected(accounts[accounts.length - 1]));
    }
  }, [accounts]);

  const initialUserCheck = async () => {
    // check on whether any key pair found locally
    const localSelected = localStorage.getItem("selected");
    if (localSelected) {
      dispatch(updateSelected(JSON.parse(localSelected)));
    }
    const localAccounts = localStorage.getItem("accounts");
    if (localAccounts) {
      dispatch(updateAccounts(JSON.parse(localAccounts)));
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
          <Route
            path="/"
            exact
            render={() => (
              <ProtectedRouteWrap
                component={<Wallet />}
                access={selected}
                redirectPath="/createkeypair"
              />
            )}
          />
          <Route
            path="/dtoken"
            exact
            render={() => (
              <ProtectedRouteWrap
                component={<TokenIssue />}
                access={selected}
                redirectPath="/createkeypair"
              />
            )}
          />
          <Route
            path="/swap"
            render={() => (
              <ProtectedRouteWrap
                component={<Swap />}
                access={selected}
                redirectPath="/createkeypair"
              />
            )}
          />
          <Route path="/DUSD" exact render={() => <ComingSoon />} />
          <Route path="/DLend" exact render={() => <ComingSoon />} />
          <Route
            path="/newtoken"
            exact
            render={() => (
              <ProtectedRouteWrap
                component={<TokenIssueForm />}
                access={selected}
                redirectPath="/createkeypair"
              />
            )}
          />
          <Route path="/test" exact render={() => <Test />} />
          {/* <Route path="/createkeypair" exact render={() => <KeyPair />} /> */}
          <Route path="/importkeypair" exact render={() => <ImportKeyPair />} />
          <Route path="/createkeypair" exact render={() => <CreateKeyPair />} />
        </>
      )}
    </div>
  );
};

export default withRouter(Layout);
