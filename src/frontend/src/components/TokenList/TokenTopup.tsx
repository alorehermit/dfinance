import BigNumber from "bignumber.js";
import classNames from "classnames";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getICPBalance, parseICP } from "../../apis/icp";
import { topupCycles } from "../../apis/token";
import Icon from "../../icons/Icon";
import { getSelectedAccount } from "../../utils/identity";
import { TransferModal } from "../styles";

interface Props {
  canisterId: string;
  close: () => void;
}
const TokenTopup = (props: Props) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [loading, setLoading] = useState("");
  const [bal, setBal] = useState(new BigNumber("0"));
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateBal();
  }, []);
  useEffect(() => {
    if (bal.lt(new BigNumber(amount || "0").plus(new BigNumber("0.0002")))) {
      setError("no enough fund");
    } else {
      setError("");
    }
  }, [bal, amount]);

  const updateBal = () => {
    const theOne = getSelectedAccount();
    getICPBalance(theOne?.principal || "").then((res) => {
      if (dom.current) {
        setBal(new BigNumber(res.status ? res.data : "0"));
      }
    });
  };
  const amountOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    setAmount(val);
    setAmountError(!val ? true : false);
  };
  const max = () => {
    setAmount(
      bal.gt(new BigNumber("0.0002"))
        ? bal.minus(new BigNumber("0.0002")).toString()
        : "0"
    );
    setAmountError(false);
  };
  const submit = () => {
    setLoading("Adding...");
    topupCycles(parseICP(amount), props.canisterId)
      .then(() => {
        // props.updateBalance();
      })
      .catch((err) => {
        if (dom.current) setError(err.message);
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

  return (
    <TransferModal className="TokenTopup ac" ref={dom}>
      <div className="bg"></div>
      <div className="wrap">
        <button className="close" onClick={props.close}>
          <Icon name="close" />
        </button>
        <label className="label">Topup Canister</label>
        <label className="sub-label">To: {props.canisterId}</label>
        <label className="sub-label">Amount</label>
        <input
          className={classNames({ err: amountError })}
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={amountOnChange}
        />
        <div className="balance-ctrl">
          <span>{bal ? `Balance: ${bal}` : "0"}</span>
          <button onClick={max}>Safe Max</button>
        </div>
        <div className="balance-ctrl">
          <span>Fee: 0.0002</span>
        </div>
        {loading ? (
          <button className="submit" disabled>
            {loading}
          </button>
        ) : (
          <button
            className="submit"
            onClick={submit}
            disabled={!amount || error ? true : false}
          >
            Add Cycles
          </button>
        )}
        <div className="error">{error}</div>
      </div>
    </TransferModal>
  );
};

export default TokenTopup;
