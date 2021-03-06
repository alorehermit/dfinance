import React, { Component } from "react";
import TokenItem from "./TokenItem.jsx";
import { Link } from "react-router-dom";
import Icon from "../stuff/Icon.jsx";
import { getTokensByUser } from "../APIs/token.js";
import "./TokenIssue.css";
import { Principal } from "@dfinity/agent";
import TokenList from "./TokenList.jsx";

class TokenIssue extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
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
    const user = localStorage.getItem("dfinance_current_user");
    if (!user) return this.setState({ loading: false });
    getTokensByUser(Principal.fromText(user))
      .then(tokens => {
        if (this._isMounted) this.setState({ tokens });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        if (this._isMounted) this.setState({ loading: false, user });
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
            {this.state.loading ? 
              <Icon name="spinner" spin />
            : null}
            <TokenList tokens={this.state.tokens} />
            {!this.state.loading && !this.state.user ? 
              <p className="zero">No Account Found</p>
            : null}
            {!this.state.loading && !this.state.tokens.length && this.state.user ?
              <p className="zero">No Token Yet</p>
            : null}
          </div>
        </div>
      </div>
    )
  }
}

export default TokenIssue;
