import React, { Component } from "react";
import TokenItem from "./TokenItem.jsx";
import { Link } from "react-router-dom";
import "./TokenIssue.css";

const dtoken = {
  getTokenList: () => {
    let promise = new Promise((resolve, reject) => {
      resolve(Array(12).fill(        {
        name: "Hoho Coin",
        symbol: "HHC",
        owner: "",
        amount: "123123123123"
      }));
    });
    return promise;
  },
  getBalance: () => {
    let promise = new Promise((resolve, reject) => {
      resolve("");
    });
    return promise;
  }
}

class TokenIssue extends Component {
  constructor() {
    super();
    this.state = {
      tokens: [],
      loading: true
    };
  }

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    this.initial();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  initial = () => {
    dtoken.getTokenList()
      .then(res => {
        if (!this._isMounted) return;
        this.setState({ tokens: res, loading: false });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="TokenIssue">
        <div className="more">
          <Link className="more-link" to="/newtoken"></Link>
          <div className="accessory-1"></div>
          <div className="accessory-2"></div>
          <div className="accessory-3">Issue a new token</div>
        </div>
        <div className="tokens">
          <label className="tokens-label">Your tokens</label>
          <div className="tokens-list">
            {this.state.tokens.map((i, index) => (
              <TokenItem key={index} {...i} owned={i.owner === ""} />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default TokenIssue;
