import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { formatUnits } from "../../apis/icp";
import { getDTokenTotalSupply } from "../../apis/token";
import Icon from "../../icons/Icon";
import { getVW, TransferModal } from "../styles";

const Button = styled.button`
  vertical-align: middle;
  padding: 0;
  border: none;
  background-color: transparent;
  width: ${getVW(20)};
  height: ${getVW(20)};
  margin-left: ${getVW(10)};
  opacity: 0.3;
  & svg {
    width: 80%;
    height: 80%;
  }
  &:hover {
    opacity: 0.5;
  }
`;

interface Props {
  canisterId: string;
  name: string;
  symbol: string;
  decimals: string;
  close: () => void;
}
const TokenInfo = (props: Props) => {
  const [totalSupply, setTotalSupply] = useState("");
  const canisterIdDom = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let _isMounted = true;
    getDTokenTotalSupply(props.canisterId)
      .then((res) => {
        if (_isMounted) setTotalSupply(formatUnits(res, props.decimals));
      })
      .catch(() => {
        if (_isMounted) setTotalSupply("NO_VALUE");
      });
    return () => {
      _isMounted = false;
    };
  }, []);

  const canisterIdOnCopy = () => {
    if (canisterIdDom.current) {
      canisterIdDom.current.select();
      canisterIdDom.current.setSelectionRange(0, 99999);
      document.execCommand("copy");
      canisterIdDom.current.blur();
    }
  };

  return (
    <TransferModal className="TokenInfo ac">
      <div className="bg"></div>
      <div className="wrap">
        <button className="close" onClick={props.close}>
          <Icon name="close" />
        </button>
        <label className="label">Asset Info</label>
        <label className="sub-label">
          Canister ID: {props.canisterId} <CopyBtn onCopy={canisterIdOnCopy} />
        </label>
        <label className="sub-label">Name: {props.name}</label>
        <label className="sub-label">Symbol: {props.symbol}</label>
        <label className="sub-label">Decimals: {props.decimals}</label>
        <label className="sub-label">Total Supply: {totalSupply}</label>
        <input
          ref={canisterIdDom}
          value={props.canisterId}
          style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          readOnly
        />
      </div>
    </TransferModal>
  );
};

export default TokenInfo;

interface IProps {
  onCopy: () => void;
}
const CopyBtn = (props: IProps) => {
  const [clicked, setClicked] = useState(false);
  const onClick = () => {
    if (clicked) return;
    props.onCopy();
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  };
  return (
    <Button onClick={onClick} title="Copy">
      {clicked ? <Icon name="check-alt" /> : <Icon name="copy" />}
    </Button>
  );
};
