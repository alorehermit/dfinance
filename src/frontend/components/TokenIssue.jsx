import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../stuff/Icon.jsx";
import { getTokensByUser } from "../APIs/token.js";
import { Principal } from "@dfinity/agent";
import TokenList from "./TokenList.jsx";
import { useSelector } from "react-redux";
import "./TokenIssue.css";

const TokenIssue = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const selected = useSelector((state) => state.selected);

  useEffect(() => {
    let _isMounted = true;
    if (selected) initial(_isMounted);
    return () => {
      _isMounted = false;
    };
  }, [selected]);

  const initial = (_isMounted) => {
    const user = selected.principal;
    if (!user) return setLoading(false);
    getTokensByUser(Principal.fromText(user))
      .then((res) => {
        if (_isMounted) setTokens(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        if (_isMounted) setLoading(false);
      });
  };

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
          {loading ? <Icon name="spinner" spin /> : null}
          <TokenList
            tokens={tokens}
            user={selected ? selected.principal : ""}
          />
          {!loading && !selected ? (
            <p className="zero">No Account Found</p>
          ) : null}
          {!loading && !tokens.length && selected ? (
            <p className="zero">No Token Yet</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TokenIssue;
