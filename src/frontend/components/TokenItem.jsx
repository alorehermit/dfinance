// import { Principal } from "@dfinity/agent";
import classNames from "classnames";
import React, { Component } from "react";
import { getDTokenBalance } from "../APIs/Token.js";
import { currencyFormat } from "../utils/common";
import "./TokenItem.css";

class TokenItem extends Component {
  constructor() {
    super();
    this.state = {
      balance: ""
    };
  }
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    console.log("token: ", this.props)
    getDTokenBalance(this.props.canisterId)
      .then(res => {
        if (this._isMounted) this.setState({ balance: res.toString() });
      })
      .catch(err => console.log(err));
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <div className="Token">
        <div className={classNames("bg", {owned: this.props.owned})}></div>
        <div className="wrap">
          {this.props.owned ? <span className="owned">You Issued</span> : null}
          <p className="token-name">
            <span className="symbol">{this.props.symbol}</span>
            <span className="name">/ {this.props.name}</span>
          </p>
          <p className="token-amount">
            <label>Amount</label>
            <span>{currencyFormat(this.state.balance, this.props.decimals)}</span>
          </p>
        </div>
      </div>
    )
  }
}

export default TokenItem;
