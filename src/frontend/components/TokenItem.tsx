import classNames from "classnames";
import React, { Component } from "react";
import { Token } from "./interfaces";
import "./TokenItem.css";

interface IProps extends Token{
  owned: boolean
}
interface IState {}
class TokenItem extends Component<IProps, IState> {
  render() {
    return (
      <div className="Token">
        <div className={classNames("bg", {owned: this.props.owned})}></div>
        <div className="wrap">
          {this.props.owner ? <span className="owned">You Issued</span> : null}
          <p className="token-name">
            <span className="symbol">{this.props.symbol}</span>
            <span className="name">/ {this.props.name}</span>
          </p>
          <p className="token-amount">
            <label>Amount</label>
            <span>{this.props.amount}</span>
          </p>
        </div>
      </div>
    )
  }
}

export default TokenItem;
