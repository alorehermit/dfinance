import React, { Component } from "react";
import TokenItem from "./TokenItem.jsx";
import { Link } from "react-router-dom";
import Icon from "../stuff/Icon.jsx";
import { getTokensByUser } from "../APIs/Token.js";
import "./TokenIssue.css";

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
    getTokensByUser(user)
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
            {this.state.tokens.map((i, index) => (
              <TokenItem key={index} {...i} owned={i.owner === ""} />
            ))}
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
