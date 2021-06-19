import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import { AES, enc } from "crypto-js";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import Icon from "../../icons/Icon";
import { addNewDfinitySubAccount } from "../../redux/features/dfinitySubAccounts";
import { addNewHdWallet } from "../../redux/features/hdWallets";
import { updateSelected } from "../../redux/features/selected";
import { updateSelectedIndex } from "../../redux/features/selectedIndex";
import { RootState } from "../../redux/store";
import {
  addSubAccountFromDfinityIdentity,
  addSubAccountFromMnemonic,
  getSelectedAccount,
} from "../../utils/identity";
import { device, Flex, getScaled, getVW } from "../styles";

const Div = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: ${getVW(451)};
  background-color: #e8e8e8;
  overflow: hidden;
  @media ${device.tablet} {
    min-height: ${getVW(getScaled(840, 451, 1920 * 0.9))};
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
  width: ${getVW(840)};
  height: ${getVW(451)};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media ${device.tablet} {
    width: 90vw;
    height: ${getVW(getScaled(840, 451, 1920 * 0.9))};
  }
`;
const Brand = styled.div`
  width: ${(225 * 100) / 840}%;
  height: ${(188 * 100) / 451}%;
  margin: 0 auto ${(90 * 100) / 840}% auto;
  & svg {
    width: 100%;
    height: 100%;
  }
`;
const Btns = styled(Flex)`
  justify-content: space-between;
  height: ${(106 * 100) / 451}%;
  & button {
    width: ${(400 * 100) / 840}%;
    height: 100%;
    border: none;
    border-radius: ${getVW(10)};
    font-size: ${getVW(36)};
    color: #fff;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  }
  & button.login {
    background-image: linear-gradient(90deg, #ba3f8b, #8651ce);
  }
  & button.login:hover {
    background-image: linear-gradient(90deg, #d83599, #ac7ded);
  }
  & button.create {
    background-image: linear-gradient(90deg, #2976ba, #3dc4ed);
  }
  & button.create:hover {
    background-image: linear-gradient(90deg, #4a96d9, #4ad5ff);
  }
  @media ${device.tablet} {
    & button {
      font-size: 3.5vw;
    }
  }
`;
const Txt = styled.div`
  padding-top: ${getVW(36)};
  text-align: center;
  font-size: ${getVW(24)};
  color: #001414;
  & button {
    border: none;
    background-color: transparent;
    padding: 0;
    font-size: ${getVW(24)};
    font-family: "Roboto bold";
    color: #2f8dc9;
  }
`;

interface Props extends RouteComponentProps {}
const CreateNewAccount = (props: Props) => {
  const { dfinityIdentity, dfinitySubAccounts, hdWallets, password } =
    useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  const createSubAccount = async () => {
    const theOne = getSelectedAccount();
    if (!theOne) return props.history.push("/");
    if (dfinityIdentity.principal) {
      let newOne = addSubAccountFromDfinityIdentity(
        dfinityIdentity.principal,
        dfinitySubAccounts.length
      );
      dispatch(updateSelectedIndex(dfinitySubAccounts.length));
      dispatch(addNewDfinitySubAccount(newOne));
      const keys: JsonnableEd25519KeyIdentity = JSON.parse(
        localStorage.getItem("ic-identity") || "[]"
      );
      dispatch(updateSelected(keys[0]));
    } else {
      if (!password) return alert("Error: No access.");
      const mnemonic = localStorage.getItem("mnemonic");
      if (!mnemonic) return alert("Error: Local mnemonic not found.");
      let newOne = addSubAccountFromMnemonic(
        AES.decrypt(mnemonic, password).toString(enc.Utf8),
        hdWallets.length
      );
      dispatch(updateSelectedIndex(hdWallets.length));
      dispatch(addNewHdWallet(newOne));
      dispatch(updateSelected(newOne.publicKey));
    }
    props.history.push("/wallet");
  };

  return (
    <Div>
      <BG>
        <Icon name="bg-1" />
        <Icon name="bg-2" />
        <Icon name="bg-3" />
        <Icon name="bg-4" />
      </BG>
      <Wrap>
        <Brand>
          <Icon name="logo-2" />
        </Brand>
        <Btns>
          <button className="login" onClick={createSubAccount}>
            Create SubAccount
          </button>
          <button
            className="create"
            onClick={() => props.history.push("/importKeypair")}
          >
            From Private Key
          </button>
        </Btns>
        <Txt>
          Not now?{" "}
          <button onClick={() => props.history.goBack()}>Go back</button>
        </Txt>
      </Wrap>
    </Div>
  );
};

export default withRouter(CreateNewAccount);
