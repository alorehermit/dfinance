import React, { Component } from "react";
import { getDTokenBalance } from "../../APIs/token.js";
import { currencyFormat } from "../../utils/common";

class TokenSelect extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.show !== this.state.show) {
      this.props.setBigger(this.state.show);
    }
  }
  render() {
    return (
      <div className="TokenOptionList">
        <label>{this.props.label}</label>
        {this.state.show ? 
          <div className="option-wrap">
            <div className="options">
              {this.props.options.length === 0 ? 
                <span className="no-pair">No token available</span>
              : null}
              {this.props.options.map((i, index) => (
                <TokenSelectOptionItem key={index} {...i} token={i} onSelect={this.props.onSelect} />
              ))}
            </div>
          </div> :
          <button 
            className="trigger" 
            onClick={() => this.setState({ show: true })} 
            disabled={this.props.options && this.props.options.length === 0}
          >
            {this.props.options && this.props.options.length === 0 ? "Unavailable" : "Select a token"}
          </button>
        }
      </div>
    )
  }
};

export default TokenSelect;


class TokenSelectOptionItem extends Component {
  constructor() {
    super();
    this.state = {
      balance: ""
    }
  }

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    if (this.props.canisterId) {
      getDTokenBalance(this.props.canisterId, this.props.decimals)
        .then(balance => {
          if (this._isMounted) this.setState({ balance });
        })
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="btn-wrap">
        <button className="option-btn" onClick={() => this.props.onSelect(this.props.token)}>
          <span className="token-icon"></span>
          <span className="token-symbol">{this.props.symbol}</span>
          <span className="token-name">{this.props.name}</span>
          <span className="token-balance">{currencyFormat(this.state.balance, this.props.decimals || "2")}</span>
        </button>
      </div>
    )
  }
};