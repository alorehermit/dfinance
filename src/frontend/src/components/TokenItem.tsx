import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDTokenBalance } from "../apis/token";
import { Token } from "../global";
import { RootState } from "../redux/store";
import { currencyFormat } from "../utils/common";
import "./TokenItem.css";

interface Props extends Token {
  owned: boolean;
}
const TokenItem = (props: Props) => {
  const [balance, setBalance] = useState("");
  const selected = useSelector((state: RootState) => state.selected);

  useEffect(() => {
    let _isMounted = true;
    if (selected)
      getDTokenBalance(props.canisterId, props.decimals)
        .then((res) => {
          if (_isMounted) setBalance(res);
        })
        .catch((err) => console.log(err));
    return () => {
      _isMounted = false;
    };
  }, [selected]);

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
