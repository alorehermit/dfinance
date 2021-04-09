import classNames from "classnames";
import React, { Component } from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import Header from "./Header";
import Wallet from "./Wallet";
import TokenIssue from "./TokenIssue";
import TokenIssueForm from "./TokenIssueForm";
import "./Layout.css";

interface IProps extends RouteComponentProps {}
interface IState {
}
class Layout extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="Layout">
        {this.props.history.location.pathname !== "/newtoken" ? 
          <Header withNav={true} />
        : null}
        <div className={classNames(
          "layout-bg", 
          {status1: this.props.history.location.pathname === "/"},
          {status2: this.props.history.location.pathname === "/1"},
          {disabled: this.props.history.location.pathname === "/newtoken"}
        )}>
          <svg className="accessory-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2368.707 824.631">
            <path id="路径_72" data-name="路径 72" d="M4395.531-6686.679c-586.145-90.224-675.187,163.824-1143.015,213.577s-670.924-200.5-990.235-34.53S2383.694-5895,2383.694-5895l2131.216,13.737Z" transform="translate(-2146.202 6705.895)" fill="#f5f5f5"/>
          </svg>
          <svg className="accessory-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2147.404 816.905">
            <path id="路径_73" data-name="路径 73" d="M4461.668-6629.178c-482.182-192.152-807.01,79.89-1222,62.753s-584.357-146.518-757.722-13.424S2383.694-5895,2383.694-5895l2131.216,13.737Z" transform="translate(-2367.505 6698.168)" fill="#fff"/>
          </svg>
        </div>
        <Route path="/" exact render={() => <Wallet />} />
        <Route path="/1" exact render={() => <TokenIssue />} />
        {/* <Route path="/2" exact render={() => <Wallet />} />
        <Route path="/3" exact render={() => <Wallet />} />
        <Route path="/4" exact render={() => <Wallet />} /> */}
        <Route path="/newtoken" exact render={() => <TokenIssueForm />} />
      </div>
    )
  }
}

export default withRouter(Layout);
