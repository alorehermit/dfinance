import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { addNewAccount } from "../../redux/features/accounts";
import { RootState } from "../../redux/store";
import PwdForm from "./PwdForm";
import { mnemonicToIdentity } from "../../utils/func";
import Icon from "../../icons/Icon";
import styled from "styled-components";
import { device, getScaled, getVW } from "../styles";
import { validateMnemonic } from "bip39";
import { updateSelected } from "../../redux/features/selected";

const Div = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: ${getVW(450)};
  background-color: #e8e8e8;
  overflow: hidden;
  @media ${device.tablet} {
    min-height: ${getVW(getScaled(503, 450, 1920 * 0.7))};
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
const Wrap = styled.div`
  position: absolute;
  width: ${getVW(503)};
  height: ${getVW(450)};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media ${device.tablet} {
    width: 70vw;
    height: ${getVW(getScaled(503, 450, 1920 * 0.7))};
  }
`;
const Brand = styled.div`
  width: ${(346 * 100) / 503}%;
  height: ${(70 * 100) / 450}%;
  margin-bottom: ${(72 * 100) / 503}%;
  & svg {
    width: 100%;
    height: 100%;
  }
`;
const Label = styled.div`
  font-size: ${getVW(36)};
  color: #242424;
  margin-bottom: ${getVW(20)};
  @media ${device.tablet} {
    font-size: 3.6vw;
    margin-bottom: 2vw;
  }
`;
const Textarea = styled.textarea`
  resize: none;
  width: 100%;
  height: ${(180 * 100) / 450}%;
  border: none;
  border-radius: ${getVW(10)};
  background-color: #dbdbdb;
  padding: ${getVW(25)};
  margin-bottom: ${getVW(45)};
  font-size: ${getVW(32)};
  color: #242424;
  @media ${device.tablet} {
    height: ${(100 * 100) / 450}%;
    padding: 2.5vw;
    font-size: 3.2vw;
  }
`;
const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${(58 * 100) / 450}%;
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
const Err = styled.div`
  height: ${getVW(30)};
  padding-top: ${getVW(10)};
  padding-left: ${getVW(4)};
  font-size: ${getVW(18)};
  color: tomato;
  @media ${device.tablet} {
    font-size: 1.8vw;
  }
`;

interface Props extends RouteComponentProps {}
const ImportKeyPair = (props: Props) => {
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const password = useSelector((state: RootState) => state.password);
  const accounts = useSelector((state: RootState) => state.accounts);

  // const importWallet = () => {
  //   const secretKey = getUint8ArrayFromHex(privateKey);
  //   const keyIdentity = Ed25519KeyIdentity.fromSecretKey(secretKey);
  //   const val = keyIdentity.getPrincipal().toString(); // principal
  //   const str = keyIdentity.toJSON()[0]; // public key hex string
  //   setPrincipal(val);
  //   setPublicKey(str);
  // };
  const importMnemonicWallet = () => {
    const isValid = validateMnemonic(mnemonic);
    if (!isValid) return setError("Invalid mnemonic");
    const keyIdentity = mnemonicToIdentity(mnemonic);
    const principal = keyIdentity.getPrincipal().toString();
    const [str1, str2] = keyIdentity.toJSON(); // public key and private key hex string
    setTimeout(() => {
      const matched = accounts.find((i) => i.publicKey === str1);
      if (matched) {
        updateSelected(str1);
      } else {
        dispatch(
          addNewAccount({
            type: "Ed25519KeyIdentity",
            principal,
            publicKey: str1,
            keys: [str1, str2],
          })
        );
      }
      props.history.push("/");
    }, 200);
  };

  if (password) {
    return (
      <Div className="ImportKeyPair">
        <BG>
          <Icon name="bg-1" />
          <Icon name="bg-2" />
          <Icon name="bg-3" />
          <Icon name="bg-4" />
        </BG>
        <Wrap>
          <Brand>
            <Icon name="logo-1" />
          </Brand>
          <Label>Import Idenity from Mnemonic</Label>
          <Textarea
            placeholder="Mnemonic"
            value={mnemonic}
            onChange={(e) => {
              setMnemonic(e.target.value);
              setError("");
            }}
          />
          <Btn onClick={importMnemonicWallet}>
            Next Step <Icon name="arrow" />
          </Btn>
          <Err>{error}</Err>
        </Wrap>
      </Div>
    );
  } else {
    return <PwdForm label="Import Identity" next={() => {}} />;
  }
};

export default withRouter(ImportKeyPair);
