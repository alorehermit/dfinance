// import { Principal } from "@dfinity/agent";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { getDTokenBalance } from "../APIs/token.js";
import { currencyFormat } from "../utils/common";
import "./TokenItem.css";

const TokenItem = (props) => {
  const [balance, setBalance] = useState("");
  useEffect(() => {
    let _isMounted = true;
    getDTokenBalance(props.canisterId, props.decimals)
      .then((res) => {
        if (_isMounted) setBalance(res);
      })
      .catch((err) => console.log(err));
    return () => {
      _isMounted = false;
    };
  }, []);

  return (
    <div className="Token">
      <div className={classNames("bg", { owned: props.owned })}></div>
      <div className="wrap">
        {props.owned ? <span className="owned">You Issued</span> : null}
        <p className="token-name">
          <span className="symbol">{props.symbol}</span>
          <span className="name">/ {props.name}</span>
        </p>
        <p className="token-amount">
          <label>Amount</label>
          <span>{currencyFormat(balance, props.decimals)}</span>
        </p>
      </div>
    </div>
  );
};

export default TokenItem;
