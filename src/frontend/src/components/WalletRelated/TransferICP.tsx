import classNames from "classnames";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { transferICP } from "../../apis/token";
import Icon from "../../icons/Icon";
import "./TransferICP.css";

interface Props {
  balance: string;
  updateBalance: () => void;
}
const TransferICP = (props: Props) => {
  const [ac, setAc] = useState(false);
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("");
  const [spenderError, setSpenderError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parseFloat(props.balance || "0") < parseFloat(amount || "0")) {
      setError("no enough fund");
    } else {
      setError("");
    }
  }, [props.balance, amount]);

  const spenderOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSpender(val);
    setSpenderError(!val ? true : false);
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
      (parseFloat(props.balance) - 0.0001 > 0
        ? parseFloat(props.balance) - 0.0001
        : 0
      ).toString() || "0"
    );
    setAmountError(false);
  };
  const submit = () => {
    setLoading("Transferring...");
    transferICP(spender, parseFloat(amount))
      .then(() => props.updateBalance())
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
    <div className="TransferICP" ref={dom}>
      <button className="trigger" onClick={() => setAc(true)}>
        Transfer
      </button>
      {ac ? (
        <div className="TokenListModal ac ICP">
          <div className="bg"></div>
          <div className="wrap">
            <button
              className="close"
              onClick={() => {
                setAc(false);
                setSpender("");
                setSpenderError(false);
                setAmount("");
                setAmountError(false);
                setLoading("");
              }}
            >
              <Icon name="close" />
            </button>
            <label className="label">Transfer ICP</label>
            <label className="sub-label">To</label>
            <input
              className={classNames({ err: spenderError })}
              type="text"
              placeholder="Spender"
              value={spender}
              onChange={spenderOnChange}
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
              <span>
                {props.balance ? `Balance: ${props.balance}` : "0.00"}
              </span>
              <button onClick={max}>Safe Max</button>
            </div>
            <div className="balance-ctrl">
              <span>Transfer fee: 0.0001</span>
            </div>
            {loading ? (
              <button className="submit" disabled>
                {loading}
              </button>
            ) : (
              <button
                className="submit"
                onClick={submit}
                disabled={!spender || !amount || error ? true : false}
              >
                Transfer
              </button>
            )}
            <div className="error">{error}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TransferICP;
