import classNames from "classnames";
import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import Header from "./Header.jsx";
import ProtectedRouteWrap from "../utils/ProtectedRouteWrap.jsx";
import Wallet from "./Wallet.jsx";
import TokenIssue from "./TokenIssue.jsx";
import TokenIssueForm from "./TokenIssueForm.jsx";
import Test from "./Test.jsx";
import KeyPair from "./KeyPair.jsx";
import { getAgent } from "../utils/common.js";
import Swap from "./Swap.jsx";
import "./Layout.css";
import ComingSoon from "./ComingSoon.jsx";

class Layout extends Component{
  constructor() {
    super();
    this.state = {
      hasUser: false,
      loading: true
    };
  }

  componentDidMount() {
    this.initialUserCheck();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.hasUser !== this.state.hasUser) {
      this.updateAgentOnUserChange();
    }
  }

  initialUserCheck = () => {
    if (localStorage.getItem("dfinance_current_user_key") && localStorage.getItem("dfinance_current_user")) {
      this.setState({ hasUser: true, loading: false });
    } else {
      this.setState({ hasUser: false, loading: false });
    }
  };
  updateAgentOnUserChange = () => {
    if (this.state.hasUser) {
      if (!(window).ic) {
        const { HttpAgent, IDL, canister } = require("@dfinity/agent");
        console.log(canister)
        (window).ic = { agent: getAgent(), HttpAgent, IDL };
      } else {
        (window).ic.agent = getAgent();
        console.log("window.ic:", window.ic);
      }
    } else {
      (window).ic.agent = null;
      this.props.history.push("/connectwallet");
    }
  };

  render() {
    if (this.state.loading) return null;  // wait for checking
    return (
      <div className="Layout">
        {this.props.history.location.pathname !== "/newtoken" ? 
          <Header withNav={true} />
        : null}
        <div className={classNames(
          "layout-bg", 
          {status1: this.props.history.location.pathname === "/"},
          {status2: this.props.history.location.pathname === "/dtoken"},
          {disabled: this.props.history.location.pathname === "/newtoken"}
        )}>
          <svg className="accessory-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2368.707 824.631">
            <path id="路径_72" data-name="路径 72" d="M4395.531-6686.679c-586.145-90.224-675.187,163.824-1143.015,213.577s-670.924-200.5-990.235-34.53S2383.694-5895,2383.694-5895l2131.216,13.737Z" transform="translate(-2146.202 6705.895)" fill="#f5f5f5"/>
          </svg>
          <svg className="accessory-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2147.404 816.905">
            <path id="路径_73" data-name="路径 73" d="M4461.668-6629.178c-482.182-192.152-807.01,79.89-1222,62.753s-584.357-146.518-757.722-13.424S2383.694-5895,2383.694-5895l2131.216,13.737Z" transform="translate(-2367.505 6698.168)" fill="#fff"/>
          </svg>
        </div>
        <Route path="/" exact render={() => (
          <ProtectedRouteWrap component={<Wallet />} access={this.state.hasUser} redirectPath="/connectwallet" />
        )} />
        <Route path="/dtoken" exact render={() => (
          <ProtectedRouteWrap component={<TokenIssue />} access={this.state.hasUser} redirectPath="/connectwallet" />
        )} />
        <Route path="/swap" render={() => <Swap />} />
        <Route path="/DUSD" exact render={() => <ComingSoon />} />
        <Route path="/DLend" exact render={() => <ComingSoon />} />
        <Route path="/newtoken" exact render={() => (
          <ProtectedRouteWrap component={<TokenIssueForm />} access={this.state.hasUser} redirectPath="/connectwallet" />
        )} />
        {/* <Route path="/test" exact render={() => <Test />} /> */}
        <Route path="/connectwallet" exact render={() => <KeyPair changeUser={val => this.setState({ hasUser: val })} />} />
      </div>
    )
  }
}

export default withRouter(Layout);
