import classNames from "classnames";
import React, { Component } from "react";
import { getDTokenBalance, transferDToken } from "../APIs/token.js";
import Icon from "../stuff/Icon.jsx";
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
    };
  }

  _isMounted = false;
  componentDidMount() {
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
    getDTokenBalance(this.state.active.canisterId, this.state.active.decimals)
      .then((balance) => {
        if (this._isMounted) this.setState({ balance });
      })
      .catch((err) => console.log(err));
  };
  spenderOnChange = (e) => {
    const val = e.target.value;
    this.setState({ spender: val, spenderError: !val ? true : false });
  };
  amountOnChange = (e) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    this.setState({ amount: val, amountError: !val ? true : false });
  };
  max = () => {
    this.setState({ amount: this.state.balance || "0", amountError: false });
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
    });
  };
  submit = () => {
    this.setState({ loading: "Transferring..." });
    transferDToken(
      this.state.active.canisterId,
      this.state.spender,
      this.state.amount,
      this.state.active.decimals
    )
      .then((res) => {
        if (this._isMounted) this.getBalance();
      })
      .catch((err) => {
        console.log("transfer token failed");
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted)
          this.setState({ loading: "Done" }, () => {
            setTimeout(() => {
              if (this._isMounted) this.setState({ loading: "" });
            }, 1500);
          });
      });
  };

  render() {
    return (
      <div className="TokenListWrap">
        <div className="TokenList">
          {this.props.tokens.map((i, index) => (
            <div
              key={index}
              className="TokenItemWrap"
              onClick={() => this.setState({ active: i })}
            >
              <TokenItem {...i} owned={i.owner === this.props.user} />
            </div>
          ))}
        </div>
        <div
          className={classNames("TokenListModal", { ac: this.state.active })}
        >
          <div className="bg"></div>
          <div className="wrap">
            <button className="close" onClick={this.close}>
              <Icon name="close" />
            </button>
            <label className="label">
              Transfer {this.state.active ? this.state.active.symbol : ""}
            </label>
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
              <span>
                {this.state.balance
                  ? `Balance: ${currencyFormat(
                      this.state.balance,
                      this.state.active ? this.state.active.decimals : "2"
                    )}`
                  : ""}
              </span>
              <button onClick={this.max}>Max</button>
            </div>
            {this.state.loading ? (
              <button className="submit" disabled>
                {this.state.loading}
              </button>
            ) : (
              <button
                className="submit"
                onClick={this.submit}
                disabled={
                  !this.state.active ||
                  !this.state.spender ||
                  !this.state.amount
                    ? true
                    : false
                }
              >
                Transfer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default TokenList;
