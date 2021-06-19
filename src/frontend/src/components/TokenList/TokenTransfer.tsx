import BigNumber from "bignumber.js";
import classNames from "classnames";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { transferDToken } from "../../apis/token";
import Icon from "../../icons/Icon";
import { TransferModal } from "../styles";

interface Props {
  canisterId: string;
  symbol: string;
  decimals: string;
  balance: string;
  updateBal: () => void;
  close: () => void;
}
const TokenTransfer = (props: Props) => {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [receiverError, setReceiverError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [bal, setBal] = useState(new BigNumber("0"));
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.updateBal();
  }, []);
  useEffect(() => {
    setBal(new BigNumber(props.balance));
  }, [props.balance]);
  useEffect(() => {
    if (bal.lt(new BigNumber(amount || "0"))) {
      setError("no enough fund");
    } else {
      setError("");
    }
  }, [bal, amount]);

  const receiverOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setReceiver(val);
    setReceiverError(!val ? true : false);
  };
  const amountOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const reg = new RegExp(/^[0-9\.]*$/);
    if (val && !reg.test(val)) return;
    setAmount(val);
    setAmountError(!val ? true : false);
  };
  const max = () => {
    setAmount(bal.toString());
    setAmountError(false);
  };
  const submit = () => {
    setLoading("Transferring...");
    transferDToken(props.canisterId, receiver, amount, props.decimals)
      .then(() => props.updateBal())
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
    <TransferModal className="TokenListModal ac" ref={dom}>
      <div className="bg"></div>
      <div className="wrap">
        <button className="close" onClick={props.close}>
          <Icon name="close" />
        </button>
        <label className="label">Transfer {props.symbol}</label>
        <label className="sub-label">To</label>
        <input
          className={classNames({ err: receiverError })}
          type="text"
          placeholder="Receiver(Principal)"
          value={receiver}
          onChange={receiverOnChange}
        />
        <label className="sub-label">Amount</label>
        <input
          className={classNames({ err: amountError })}
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={amountOnChange}
        />
        <div className="balance-ctrl">
          <span>{bal ? `Balance: ${bal.toString()}` : "0"}</span>
          <button onClick={max}>Max</button>
        </div>
        {loading ? (
          <button className="submit" disabled>
            {loading}
          </button>
        ) : (
          <button
            className="submit"
            onClick={submit}
            disabled={!receiver || !amount ? true : false}
          >
            Transfer
          </button>
        )}
        <div className="error">{error}</div>
      </div>
    </TransferModal>
  );
};

export default TokenTransfer;
