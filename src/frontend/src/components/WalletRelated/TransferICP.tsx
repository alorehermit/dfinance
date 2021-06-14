import classNames from "classnames";
import { useState } from "react";
import Icon from "../../icons/Icon";
import { currencyFormat } from "../../utils/common";

interface Props {
  balance: string;
}
const TransferICP = (props: Props) => {
  const [ac, setAc] = useState(false);
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("");
  const [spenderError, setSpenderError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [loading, setLoading] = useState(false);

  const spenderOnChange = () => {};
  const amountOnChange = () => {};
  const max = () => {};
  const submit = () => {};

  return (
    <div className="TransferICP">
      <button className="trigger" onClick={() => setAc(true)}>
        Transfer
      </button>
      {ac ? (
        <div className="TokenListModal">
          <div className="bg"></div>
          <div className="wrap">
            <button className="close" onClick={() => setAc(false)}>
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
                disabled={!spender || !amount ? true : false}
              >
                Transfer
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TransferICP;
