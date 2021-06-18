import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { updateSelected } from "../../redux/features/selected";
import { RootState } from "../../redux/store";
import { principalToAccountIdentifier } from "../../utils/common";
import { device, getScaled, getVW } from "../styles";
import AuthBtn from "./AuthBtn";

const Div = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: ${getVW(266)};
  right: 0;
  z-index: 100;
  @media ${device.tablet} {
    top: 10vw;
    bottom: 7vw;
    left: 0;
  }
`;
const BG = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;
const Wrap = styled.div`
  position: absolute;
  width: ${getVW(654)};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: ${getVW(30)};
  background-color: #fff;
  box-shadow: 0 0.3rem 1.3rem rgba(0, 0, 0, 0.5);
  padding: ${getVW(35)} ${getVW(70)} ${getVW(70)} ${getVW(70)};
  & button {
    just
  }
  @media ${device.tablet} {
    width: 90vw;
    border-radius: ${getVW(getScaled(654, 30, 1920 * 0.9))};
    padding: ${getVW(getScaled(654, 35, 1920 * 0.9))}
      ${getVW(getScaled(654, 70, 1920 * 0.9))}
      ${getVW(getScaled(654, 70, 1920 * 0.9))}
      ${getVW(getScaled(654, 70, 1920 * 0.9))};
  }
`;
const Label = styled.div`
  display: block;
  width: calc(100% + ${getVW(70)});
  font-size: ${getVW(32)};
  font-family: "Roboto bold";
  margin-left: ${getVW(-35)};
  margin-bottom: ${getVW(50)};
  color: #001414;
  @media ${device.tablet} {
    font-size: ${getVW(getScaled(654, 32, 1920 * 0.9))};
    margin-bottom: ${getVW(getScaled(654, 50, 1920 * 0.9))};
  }
`;
const Btns = styled.div`
  width: calc(100% + ${getVW(10)});
  max-height: 40vh;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: ${getVW(4)};
    border-radius: ${getVW(4)};
    background-color: #f8f8f8;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: ${getVW(4)};
    background-color: #e8e8e8;
  }
  & button {
    width: calc(100% - ${getVW(10)});
    height: ${getVW(48)};
    justify-content: flex-start;
    border: none;
    border-radius: ${getVW(10)};
    padding: 0 ${getVW(20)};
    font-size: ${getVW(22)};
    margin-bottom: ${getVW(10)};
    text-align: left;
  }
  & button:last-child {
    margin-bottom: 0;
  }
  & button:hover {
    background-image: linear-gradient(270deg, #e12b7c, #323a8d);
    color: #fff;
  }
  @media ${device.tablet} {
    & button {
      width: calc(100% - ${getVW(getScaled(654, 10, 1920 * 0.9))});
      height: ${getVW(getScaled(654, 48, 1920 * 0.9))};
      font-size: ${getVW(getScaled(654, 22, 1920 * 0.9))};
      padding: 0 ${getVW(getScaled(654, 20, 1920 * 0.9))};
      margin-bottom: ${getVW(getScaled(654, 10, 1920 * 0.9))};
    }
  }
`;

const AccountModal = () => {
  const accounts = useSelector((state: RootState) => state.accounts);
  const dispatch = useDispatch();

  return (
    <Div className="AccountModal ac">
      <BG className="bg"></BG>
      <Wrap className="wrap">
        <Label className="label">
          Sorry, your current account has expired. Please login or switch to
          another account.
        </Label>
        <Btns>
          <AuthBtn />
          <Button principal={""} onClick={() => dispatch(updateSelected(""))} />
          <Button principal={""} onClick={() => dispatch(updateSelected(""))} />
          <Button principal={""} onClick={() => dispatch(updateSelected(""))} />
          {accounts.map((i, index) => (
            <Button
              key={index}
              principal={i.principal}
              onClick={() => dispatch(updateSelected(i.publicKey))}
            />
          ))}
        </Btns>
      </Wrap>
    </Div>
  );
};

export default AccountModal;

interface Props {
  principal: string;
  onClick: () => void;
}
const Button = (props: Props) => {
  const [aid, setAid] = useState("");

  useEffect(() => {
    setAid(principalToAccountIdentifier(props.principal || "", 0));
  }, [props.principal]);
  return (
    <button onClick={props.onClick}>
      Switch to {aid.substr(0, 5)}...{aid.substr(length - 5, 5)}
    </button>
  );
};
