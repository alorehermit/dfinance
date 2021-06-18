import { useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addNewAccount } from "../../redux/features/accounts";
import { RootState } from "../../redux/store";
import PwdForm from "./PwdForm";
import Icon from "../../icons/Icon";
import styled from "styled-components";
import { device, getScaled, getVW } from "../styles";
import { generateMnemonic } from "bip39";
import { mnemonicToIdentity } from "../../utils/func";
import classNames from "classnames";

const Wrap1Height = 450;
const Wrap2Height = 700;

const Div = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: ${getVW(Wrap2Height)};
  background-color: #e8e8e8;
  overflow: hidden;
  @media ${device.tablet} {
    min-height: ${getVW(getScaled(503, Wrap2Height, 1920 * 0.7))};
  }
`;
const BG = styled.div`
  width: 100%;
  height: 100%;
  & svg#bg-1 {
    position: absolute;
    width: ${getVW(2208)};
    height: ${getVW(420)};
    top: ${getVW(-206)};
    left: ${getVW(-157)};
  }
  & svg#bg-2 {
    position: absolute;
    width: ${getVW(2160)};
    height: ${getVW(398)};
    top: ${getVW(-248)};
    left: ${getVW(-60)};
  }
  & svg#bg-3 {
    position: absolute;
    width: ${getVW(2028)};
    height: ${getVW(446)};
    bottom: ${getVW(-106)};
    left: ${getVW(-110)};
  }
  & svg#bg-4 {
    position: absolute;
    width: ${getVW(2164)};
    height: ${getVW(377)};
    bottom: ${getVW(-140)};
    left: ${getVW(-204)};
  }
`;
const Wrap1 = styled.div`
  position: absolute;
  width: ${getVW(503)};
  height: ${getVW(Wrap1Height)};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media ${device.tablet} {
    width: 70vw;
    height: ${getVW(getScaled(503, Wrap1Height, 1920 * 0.7))};
  }
`;
const Wrap2 = styled.div`
  position: absolute;
  width: ${getVW(503)};
  height: ${getVW(Wrap2Height)};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media ${device.tablet} {
    width: 70vw;
    height: ${getVW(getScaled(503, Wrap2Height, 1920 * 0.7))};
  }
`;
const Brand = styled.div`
  width: ${(346 * 100) / 503}%;
  margin-bottom: ${(72 * 100) / 503}%;
  & svg {
    width: 100%;
    height: 100%;
  }
`;
const Brand1 = styled(Brand)`
  height: ${(70 * 100) / Wrap1Height}%;
`;
const Brand2 = styled(Brand)`
  height: ${(70 * 100) / Wrap2Height}%;
  margin-bottom: ${(50 * 100) / 503}%;
`;
const Label = styled.div`
  font-size: ${getVW(36)};
  color: #242424;
  margin-bottom: ${getVW(10)};
  @media ${device.tablet} {
    font-size: 3.6vw;
    margin-bottom: 2vw;
  }
`;
const Txt = styled.div`
  width: 100%;
  border: none;
  border-radius: ${getVW(10)};
  background-color: #dbdbdb;
  padding: ${getVW(25)};
  margin-bottom: ${getVW(45)};
  font-size: ${getVW(32)};
  color: #242424;
  @media ${device.tablet} {
    padding: 2.5vw;
    font-size: 3.2vw;
  }
`;
const Txt1 = styled(Txt)`
  height: ${(180 * 100) / Wrap1Height}%;
  @media ${device.tablet} {
    height: ${(100 * 100) / Wrap1Height}%;
  }
`;
const Txt2 = styled(Txt)`
  height: ${(180 * 100) / Wrap2Height}%;
  margin-bottom: ${getVW(20)};
  @media ${device.tablet} {
    height: ${(100 * 100) / Wrap2Height}%;
  }
`;
const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border: none;
  border-radius: ${getVW(10)};
  background-image: linear-gradient(110deg, #2976ba, #2aa8ce);
  font-size: ${getVW(32)};
  font-family: "Roboto bold";
  color: #fff;
  & svg {
    width: ${getVW(20)};
    height: ${getVW(20)};
    margin-left: ${getVW(10)};
  }
  &:hover {
    background-image: linear-gradient(90deg, #4a96d9, #4ad5ff);
  }
  @media ${device.tablet} {
    font-size: 3.2vw;
    & svg {
      width: 2vw;
      height: 2vw;
      margin-left: 1vw;
    }
  }
`;
const Btn1 = styled(Btn)`
  height: ${(58 * 100) / Wrap1Height}%;
`;
const Btn2 = styled(Btn)`
  height: ${(58 * 100) / Wrap2Height}%;
`;
const Btns = styled.div`
  width: calc(100% + ${getVW(10)});
  margin-left: -${getVW(5)};
  margin-bottom: ${getVW(20)};
  & button {
    width: calc(33.3% - ${getVW(10)});
    height: ${(40 * 100) / Wrap2Height}%;
    margin: ${getVW(5)};
    border: none;
    border-radius: ${getVW(6)};
    background-color: #dbdbdb;
    font-size: ${getVW(22)};
    line-height: ${getVW(40)};
    color: #242424;
  }
  & button.mute {
    opacity: 0.6;
  }
  & button:hover {
    box-shadow: 0 ${getVW(3)} ${getVW(8)} rgba(0, 0, 0, 0.1);
  }
  @media ${device.tablet} {
    & button {
      font-size: 2.4vw;
      line-height: 4.5vw;
    }
  }
`;
const Error = styled.div`
  position: absolute;
  width: 100%;
  text-align: right;
  color: tomato;
`;
const Back = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: none;
  background-color: transparent;
  color: #001414;
  font-size: ${getVW(26)};
  opacity: 0.4;
  &:hover {
    opacity: 0.7;
  }
  & svg {
    width: ${getVW(16)};
    height: ${getVW(16)};
    margin-right: ${getVW(10)};
    transform: rotate(180deg);
  }
  @media ${device.tablet} {
    font-size: 2.6vw;
    & svg {
      width: 1.6vw;
      height: 1.6vw;
      margin-right: 1vw;
    }
  }
`;

interface Props extends RouteComponentProps {}
const CreateKeyPair = (props: Props) => {
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [sorted, setSorted] = useState<string[]>([]);
  const [step, setStep] = useState(1); // step1 shows the mnemonic, step2 confirms the mnemonic
  const [confirmed, setConfirmed] = useState<string[]>([]); // phase arr the user picked
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const password = useSelector((state: RootState) => state.password);

  const createWallet = () => {
    const phases = generateMnemonic();
    const keyIdentity = mnemonicToIdentity(phases);
    setMnemonic(phases.split(" "));
    setPrincipal(keyIdentity.getPrincipal().toString());
    setPublicKey(keyIdentity.toJSON()[0]);
    setPrivateKey(keyIdentity.toJSON()[1]);
  };
  const submit = () => {
    if (mnemonic.join(" ") !== confirmed.join(" "))
      return setError("wrong mnemonic");
    dispatch(
      addNewAccount({
        type: "Ed25519KeyIdentity",
        principal,
        publicKey,
        keys: [publicKey, privateKey],
      })
    );
    props.history.push("/");
  };

  useEffect(() => {
    createWallet();
  }, []);
  useEffect(() => {
    let arr = mnemonic.concat();
    arr.sort(() => Math.random() - 0.5);
    setSorted(arr);
  }, [mnemonic]);

  if (password) {
    return (
      <Div className="CreateKeyPair">
        <BG>
          <Icon name="bg-1" />
          <Icon name="bg-2" />
          <Icon name="bg-3" />
          <Icon name="bg-4" />
        </BG>
        {step === 1 ? (
          <Wrap1>
            <Brand1>
              <Icon name="logo-1" />
            </Brand1>
            <Label>Identity Mnemonic</Label>
            <Txt1>{mnemonic.join(" ")}</Txt1>
            <Btn1 onClick={() => setStep(2)}>
              Next Step <Icon name="arrow" />
            </Btn1>
          </Wrap1>
        ) : (
          <Wrap2>
            <Brand2>
              <Icon name="logo-1" />
            </Brand2>
            <Label>Confirm Mnemonic</Label>
            <Txt2>{confirmed.join(" ")}</Txt2>
            <Btns>
              {sorted.map((i, index) => (
                <button
                  key={index}
                  className={classNames({ mute: confirmed.indexOf(i) > -1 })}
                  onClick={() => {
                    let index = confirmed.indexOf(i);
                    if (index > -1) {
                      let arr = confirmed.concat();
                      arr.splice(index, 1);
                      setConfirmed(arr);
                    } else {
                      setConfirmed(confirmed.concat(i));
                    }
                  }}
                >
                  {i}
                </button>
              ))}
            </Btns>
            <Btn2 onClick={submit}>
              Next Step <Icon name="arrow" />
            </Btn2>
            <Error>{error}</Error>
            <Back onClick={() => setStep(1)}>
              <Icon name="arrow" />
              Back
            </Back>
          </Wrap2>
        )}
      </Div>
    );
  } else {
    return <PwdForm label="Create New Identity" next={() => {}} />;
  }
};

export default withRouter(CreateKeyPair);
