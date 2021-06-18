import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getLpBalance } from "../../apis/token";
import { Token } from "../../global";
import { RootState } from "../../redux/store";
import { currencyFormat } from "../../utils/common";
import { getSelectedAccount } from "../../utils/func";

interface Props {
  hasToUpdateBal: boolean;
  id: string;
  token0: Token;
  token1: Token;
  onRemove: () => void;
  reset: () => void;
}
const LiquidityItem = (props: Props) => {
  const [bal, setBal] = useState("");
  const selected = useSelector((state: RootState) => state.selected);

  useEffect(() => {
    let _isMounted = true;
    if (selected) getBalance(_isMounted);
    return () => {
      _isMounted = false;
    };
  }, [selected]);
  useEffect(() => {
    let _isMounted = true;
    getBalance(_isMounted);
    setTimeout(() => {
      props.reset();
    }, 500);
    return () => {
      _isMounted = false;
    };
  }, [props.hasToUpdateBal, props.reset]);

  const getBalance = (_isMounted: boolean) => {
    const theOne = getSelectedAccount();
    if (theOne) {
      getLpBalance(props.id, theOne.principal)
        .then((res) => {
          console.log("lp balance: ", res);
          if (_isMounted) setBal(res);
        })
        .catch((err) => {
          console.log("get lp balance failed");
          console.log(err);
        });
    }
  };

  const { id, token0, token1, onRemove } = props;
  return (
    <div className="LiquidityItem">
      <label>
        {token0.symbol || "BTC"}-{token1.symbol || "BTC"}
      </label>
      <span className="bal">
        {bal ? `Balance: ${currencyFormat(bal, "8")}` : ""}
      </span>
      <span className="id">Id: {id}</span>
      <button onClick={onRemove}>Remove Liquidity</button>
    </div>
  );
};

export default LiquidityItem;
