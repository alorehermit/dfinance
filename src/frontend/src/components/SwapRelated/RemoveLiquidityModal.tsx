import classNames from "classnames";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  approveLpToken,
  getLpAllowance,
  getLpBalance,
  removeLiquidity,
} from "../../apis/token";
import { Token } from "../../global";
import Icon from "../../icons/Icon";
import { RootState } from "../../redux/store";
import { getSelectedAccount } from "../../utils/identity";
// import { currencyFormat } from "../../utils/common";

interface Props {
  pair: {
    id: string;
    token0: string;
    token1: string;
  };
  ac: boolean;
  tokens: Token[];
  close: () => void;
  triggerUpdate: () => void;
}
const RemoveLiquidityModal = (props: Props) => {
  const [loading, setLoading] = useState("");
  const [approved, setApproved] = useState(false);
  const [bal, setBal] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(false);
  const [theOne, setTheOne] = useState(""); // user's principal
  const dom = useRef<HTMLDivElement>(null);
  const { selected, selectedIndex } = useSelector((state: RootState) => state);

  useEffect(() => {
    let _isMounted = true;
    initial();
    return () => {
      _isMounted = false;
    };
  }, []);
  useEffect(() => {
    const val = getSelectedAccount();
    if (val) {
      setTheOne(val.principal);
    } else {
      setTheOne("");
    }
  }, [selected, selectedIndex]);
  useEffect(() => {
    initial();
  }, [props.pair.id]);

  const initial = () => {
    if (!theOne) return;
    if (props.pair.id) {
      getLpBalance(props.pair.id, theOne)
        .then((bal) => {
          if (dom.current) setBal(bal);
        })
        .catch((err) => {
          console.log("get lp token balance failed");
          console.log(err);
        });
      getLpAllowance(props.pair.id, theOne, process.env.DSWAP_CANISTER_ID)
        .then((res) => {
          if (parseFloat(res) > 0 && dom.current) {
            setApproved(true);
          } else {
            setApproved(false);
          }
        })
        .catch((err) => {
          console.log("get lp token allowance failed");
          console.log(err);
        });
    }
  };
  const updateBal = () => {
    getLpBalance(props.pair.id, theOne)
      .then((bal) => {
        if (dom.current) setBal(bal);
      })
      .catch((err) => {
        console.log("get lp token balance failed");
        console.log(err);
      });
  };
  const amountOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    setAmount(val);
    setError(!val || parseFloat(val) > parseFloat(bal || "0") ? true : false);
  };
  const max = () => {
    setAmount(bal || "0");
    setError(false);
  };
  const approve = () => {
    setLoading("Approving...");
    const MAX_AMOUNT = Number.MAX_SAFE_INTEGER; // TODO
    approveLpToken(props.pair.id, process.env.DSWAP_CANISTER_ID, MAX_AMOUNT) // TODO
      .then(() => {})
      .catch((err) => {
        console.log("approve lp token failed");
        console.log(err);
      })
      .finally(() => {
        if (dom.current) {
          setLoading("Done");

          setTimeout(() => {
            if (dom.current) {
              setLoading("");
              setApproved(true);
            }
          }, 1500);
        }
      });
  };
  const remove = () => {
    setLoading("Removing...");
    const { token0, token1 } = props.pair;
    removeLiquidity(token0, token1, amount)
      .then((res) => {
        props.triggerUpdate();
        if (dom.current) updateBal();
      })
      .catch((err) => {
        console.log("remove liquidity failed");
        console.log(err);
      })
      .finally(() => {
        if (dom.current) {
          setLoading("Done");
          setTimeout(() => {
            if (dom.current) setLoading("");
          }, 1500);
        }
      });
  };
  const close = () => {
    setLoading("");
    setApproved(false);
    setBal("");
    setAmount("");
    setError(false);
    props.close();
  };

  const { ac, tokens, pair } = props;
  const token0 = tokens.filter((i) => i.canisterId === pair.token0)[0] || {};
  const token1 = tokens.filter((i) => i.canisterId === pair.token1)[0] || {};
  return (
    <div className={classNames("RemoveLiquidityModal", { ac })} ref={dom}>
      <div className="bg"></div>
      <div className="wrap">
        <button className="close" onClick={close}>
          <Icon name="close" />
        </button>
        <label className="label">Remove Liquidity</label>
        <label className="sub-label">
          {token0.symbol}-{token1.symbol}
        </label>
        <input
          className={classNames({ error })}
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={amountOnChange}
        />
        <div className="balance-ctrl">
          {/* <span>{bal ? `Balance: ${currencyFormat(bal, "8")}` : ""}</span> */}
          <span>{bal ? `Balance: ${bal}` : ""}</span>
          <button onClick={max}>Max</button>
        </div>
        {approved ? (
          loading ? (
            <button className="submit" disabled>
              {loading}
            </button>
          ) : (
            <button
              className="submit"
              disabled={!amount || error}
              onClick={remove}
            >
              Remove
            </button>
          )
        ) : loading ? (
          <button className="submit" disabled>
            {loading}
          </button>
        ) : (
          <button
            className="submit"
            disabled={!pair || !amount || error}
            onClick={approve}
          >
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

export default RemoveLiquidityModal;
