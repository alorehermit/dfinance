import BigNumber from "bignumber.js";
import classNames from "classnames";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { parseICP } from "../../apis/icp";
import { transferICP } from "../../apis/token";
import Icon from "../../icons/Icon";
import { getVW, TransferModal } from "../styles";

const Wrap = styled.div`
  display: inline-block;
  margin-right: ${getVW(20)};
  margin-bottom: ${getVW(140)};
`;
const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${getVW(140)};
  height: ${getVW(58)};
  min-width: 78px;
  min-height: 32px;
  border: none;
  border-radius: ${getVW(9)};
  background-color: #f5f5f5;
  box-shadow: 0 ${getVW(3)} ${getVW(6)} rgba(0, 0, 0, 0.16);
  color: #595959;
  font-size: ${getVW(18)};
  & svg {
    width: ${getVW(27)};
    height: ${getVW(27)};
    min-width: 16px;
    min-height: 16px;
    margin-right: ${getVW(8)};
  }
  &:hover {
    box-shadow: 0 ${getVW(3)} ${getVW(12)} rgba(0, 0, 0, 0.3);
  }
`;

interface Props {
  balance: string;
  updateBalance: () => void;
}
const TransferICP = (props: Props) => {
  const [ac, setAc] = useState(false);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [receiverError, setReceiverError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [bal, setBal] = useState(new BigNumber("0"));
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.updateBalance();
  }, []);
  useEffect(() => {
    setBal(new BigNumber(props.balance));
  }, [props.balance]);
  useEffect(() => {
    if (bal.lt(new BigNumber(amount || "0").plus(new BigNumber("0.0001")))) {
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
    setAmount(
      bal.gt(new BigNumber("0.0001"))
        ? bal.minus(new BigNumber("0.0001")).toString()
        : "0"
    );
    setAmountError(false);
  };
  const submit = () => {
    setLoading("Transferring...");
    transferICP(receiver, parseICP(amount))
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
    <Wrap className="TransferICP" ref={dom}>
      <Btn className="trigger" onClick={() => setAc(true)}>
        <Icon name="transfer" /> Transfer
      </Btn>
      {ac ? (
        <TransferModal className="TokenListModal ac">
          <div className="bg"></div>
          <div className="wrap">
            <button
              className="close"
              onClick={() => {
                setAc(false);
                setReceiver("");
                setReceiverError(false);
                setAmount("");
                setAmountError(false);
                setLoading("");
                setBal(new BigNumber("0"));
              }}
            >
              <Icon name="close" />
            </button>
            <label className="label">Transfer ICP</label>
            <label className="sub-label">To</label>
            <input
              className={classNames({ err: receiverError })}
              type="text"
              placeholder="Receiver(AccountIdentity)"
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
              <span>
                {props.balance ? `Balance: ${props.balance}` : "0.00"}
              </span>
              <button onClick={max}>Safe Max</button>
            </div>
            <div className="balance-ctrl">
              <span>Fee: 0.0001</span>
            </div>
            {loading ? (
              <button className="submit" disabled>
                {loading}
              </button>
            ) : (
              <button
                className="submit"
                onClick={submit}
                disabled={!receiver || !amount || error ? true : false}
              >
                Transfer
              </button>
            )}
            <div className="error">{error}</div>
          </div>
        </TransferModal>
      ) : null}
    </Wrap>
  );
};

export default TransferICP;
