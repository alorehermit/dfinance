import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getDTokenBalance } from "../../apis/token";
import { Token } from "../../global";
import { RootState } from "../../redux/store";
import { currencyFormat } from "../../utils/common";
import Icon from "../../icons/Icon";
import { device, getScaled, getVW } from "../styles";
import TokenTransfer from "./TokenTransfer";
import TokenTopup from "./TokenTopup";
import TokenInfo from "./TokenInfo";

const Wrap = styled.div`
  position: relative;
  display: inline-block;
  width: ${getVW(391)};
  height: ${getVW(202)};
  margin-right: ${getVW(7)};
  margin-bottom: ${getVW(23)};
  vertical-align: top;
  &:hover .bg {
    width: ${(361 * 100) / 391}%;
    height: ${(202 * 100) / 202}%;
  }
  @media ${device.tablet} {
    width: 39.1vw;
    height: 20.2vw;
  }
`;
const BG = styled.div`
  width: ${(308 * 100) / 391}%;
  height: ${(175 * 100) / 202}%;
  top: 0;
  margin-left: ${(30 * 100) / 391}%;
  border-radius: ${getVW(30)};
  background-image: linear-gradient(90deg, #3dc4ed, #2976ba);
  box-shadow: 0 0.3rem 1.2rem rgba(0, 0, 0, 0.3);
  z-index: -100;
  transition: all 200ms ease-out;
  &.owned {
    background-image: linear-gradient(90deg, #323a8d, #e12b7c);
  }
`;
const Btn = styled.button`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(33 * 100) / 361}%;
  height: ${(33 * 100) / 202}%;
  border-radius: 50%;
  border: none;
  background-color: #e5e5e5;
  color: #595959;
  box-shadow: 0 ${getVW(3)} ${getVW(6)} rgba(0, 0, 0, 0.16);
  pointer-events: none;
  opacity: 0;
  transform: translate(-150%, -30%);
  transition: all 200ms ease-out;
  .Token:hover & {
    opacity: 1;
    pointer-events: all;
    transform: translate(0%, 0%);
  }
  &:hover {
    box-shadow: 0 ${getVW(3)} ${getVW(12)} rgba(0, 0, 0, 0.3);
  }
  & svg {
    width: 75%;
    height: 75%;
  }
`;
const Btn1 = styled(Btn)`
  top: ${(19 * 100) / 202}%;
  right: ${(17 * 100) / 361}%;
`;
const Btn2 = styled(Btn)`
  top: ${(63 * 100) / 202}%;
  right: ${(13 * 100) / 361}%;
`;
const Btn3 = styled(Btn)`
  top: ${(107 * 100) / 202}%;
  right: ${(17 * 100) / 361}%;
`;
const Btn4 = styled(Btn)`
  top: ${(151 * 100) / 202}%;
  right: ${(29 * 100) / 361}%;
`;
const Info = styled.div`
  position: absolute;
  pointer-events: none;
  width: ${(317 * 100) / 391}%;
  height: ${(135 * 100) / 202}%;
  top: ${(20 * 100) / 202}%;
  left: 0;
  border-radius: ${getVW(20)};
  background-color: #e5e5e5;
  box-shadow: 0 ${getVW(3)} ${getVW(12)} rgba(0, 0, 0, 0.3);
  padding: ${(25 * 100) / 391}% ${(30 * 100) / 391}%;
  & span.owned {
    position: absolute;
    top: ${(13 * 100) / 391}%;
    right: ${(15 * 100) / 391}%;
    font-size: ${getVW(16)};
    font-family: "Roboto bold";
    color: #595959;
  }
  & p {
    margin: 0;
  }
  & p.token-name {
    display: flex;
    align-items: baseline;
    padding-bottom: ${(14 * 100) / 391};
  }
  & p.token-name .symbol {
    font-size: ${getVW(32)};
    font-family: "Roboto bold";
    color: #001414;
  }
  & p.token-name .name {
    flex: 1;
    padding-left: ${getVW(3)};
    font-size: ${getVW(16)};
    color: #595959;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & p.token-amount {
    display: flex;
    align-items: baseline;
  }
  & p.token-amount label {
    font-size: ${getVW(16)};
    color: #595959;
  }
  & p.token-amount span {
    flex: 1;
    margin-left: ${getVW(14)};
    font-size: ${getVW(24)};
    color: #001414;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface Props extends Token {
  owned: boolean;
}
const TokenItem = (props: Props) => {
  const [balance, setBalance] = useState("");
  const [modal, setModal] = useState("");
  const selected = useSelector((state: RootState) => state.selected);
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      updateBal();
    } else {
      setBalance("");
    }
  }, [selected]);

  const updateBal = () => {
    getDTokenBalance(props.canisterId, props.decimals)
      .then((res) => {
        if (dom.current) setBalance(res);
      })
      .catch(() => setBalance("N/A"));
  };

  return (
    <>
      <Wrap className="Token" ref={dom}>
        <BG className={classNames("bg", { owned: props.owned })}>
          <Btn1 title="Transfer" onClick={() => setModal("transfer")}>
            <Icon name="transfer" />
          </Btn1>
          <Btn2 title="Info" onClick={() => setModal("info")}>
            <Icon name="info" />
          </Btn2>
          {/* <Btn3 title="Activity" onClick={() => setModal("")}>
            <Icon name="clock" />
          </Btn3> */}
          <Btn3 title="Topup" onClick={() => setModal("topup")}>
            <Icon name="topup" />
          </Btn3>
        </BG>
        <Info className="wrap">
          {props.owned ? <span className="owned">You Issued</span> : null}
          <p className="token-name">
            <span className="symbol">{props.symbol}</span>
            <span className="name">/ {props.name}</span>
          </p>
          <p className="token-amount">
            <label>Amount</label>
            <span>{currencyFormat(balance, props.decimals)}</span>
          </p>
        </Info>
      </Wrap>
      {modal === "transfer" ? (
        <TokenTransfer
          canisterId={props.canisterId}
          symbol={props.symbol}
          decimals={props.decimals}
          balance={balance}
          updateBal={updateBal}
          close={() => setModal("")}
        />
      ) : null}
      {modal === "topup" ? (
        <TokenTopup canisterId={props.canisterId} close={() => setModal("")} />
      ) : null}
      {modal === "info" ? (
        <TokenInfo
          canisterId={props.canisterId}
          name={props.name}
          symbol={props.symbol}
          decimals={props.decimals}
          close={() => setModal("")}
        />
      ) : null}
    </>
  );
};

export default TokenItem;
