import classNames from "classnames";
import React, { Component } from "react";
import { getDTokenBalance, transferDToken } from "../APIs/Token.js";
import { currencyFormat } from "../utils/common";
import TokenItem from "./TokenItem.jsx";
import "./TokenList.css";

class TokenList extends Component {
  constructor() {
    super();
    this.state = {
      active: null,
      spender: "",
      spenderError: false,
      amount: "",
      amountError: false,
      balance: "",
      loading: false,
      info: ""
    }
  }

  _isMounted = false;
  componentDidMount () {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.active !== prevState.active && this.state.active) {
      this.getBalance();
    }
  }

  getBalance = () => {
    getDTokenBalance(this.state.active.canisterId)
      .then(res => {
        if (this._isMounted) this.setState({ balance: res.toString() });
      })
      .catch(err => console.log(err));
  };
  spenderOnChange = e => {
    const val = e.target.value;
    this.setState({ spender: val, spenderError: !val ? true : false });
  };
  amountOnChange = e => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ amount: val, amountError: !val ? true : false });
  };
  max = () => {
    this.setState({ amount: this.state.balance || "0" });
  };
  close = () => {
    this.setState({ 
      active: null,
      spender: "",
      spenderError: false,
      amount: "",
      amountError: false,
      balance: "",
      loading: false,
      info: ""
    });
  };
  submit = () => {
    this.setState({ loading: true });
    transferDToken(
      this.state.active.canisterId, 
      this.state.spender, 
      this.state.amount
    )
      .then(res => {
        if (this._isMounted) {
          this.getBalance();
          this.setState({ info: "Transferred" }, () => {
            setTimeout(() => {
              if (this._isMounted) this.setState({ info: "" });
            }, 2000);
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted) this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div className="TokenListWrap">
        <div className="TokenList">
          {this.props.tokens.map((i, index) => (
            <div 
              className="TokenItemWrap"
              onClick={() => this.setState({ active: i })}
            >
              <TokenItem key={index} {...i} owned={i.owner === localStorage.getItem("dfinance_current_user")} />
            </div>
          ))}
        </div>
        <div className={classNames("TokenListModal", {ac: this.state.active})}>
          <div className="bg"></div>
          <div className="wrap">
            <button className="close" onClick={this.close}>
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 492 492" xmlSpace="preserve">
                <g>
                  <path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872
                    c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872
                    c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052
                    L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116
                    c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952
                    c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116
                    c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z"/>
                </g>
              </svg>
            </button>
            <label className="label">Transfer {this.state.active ? this.state.active.symbol : ""}</label>
            <label className="sub-label">To</label>
            <input 
              className={classNames({ err: this.state.spenderError })}
              type="text" 
              placeholder="Spender" 
              value={this.state.spender} 
              onChange={this.spenderOnChange} 
            />
            <label className="sub-label">Amount</label>
            <input 
              className={classNames({ err: this.state.amountError })}
              type="text" 
              placeholder="0.00" 
              value={this.state.amount} 
              onChange={this.amountOnChange} 
            />
            <div className="balance-ctrl">
              <span>{this.state.balance ? `Balance: ${currencyFormat(this.state.balance, this.state.active ? this.state.active.decimals : "18")}` : ""}</span>
              <button onClick={this.max}>Max</button>
            </div>
            {this.state.loading ?
              <button className="submit" disabled>Transferring...</button> :
              <button className="submit" onClick={this.submit} disabled={
                !this.state.active || !this.state.spender || !this.state.amount ? true : false
              }>Transfer</button>
            }
            <div className="info">{this.state.info}</div>
          </div>
        </div>
      </div>
    )
  }
};

export default TokenList;
