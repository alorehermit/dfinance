import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styled from "styled-components";
import { getInitDfinitySubAccounts } from "../../utils/identity";
import Icon from "../../icons/Icon";
import { updateDfinitySubAccounts } from "../../redux/features/dfinitySubAccounts";
import { updateSelected } from "../../redux/features/selected";
import { updateSelectedIndex } from "../../redux/features/selectedIndex";
import { device, Flex, getScaled, getVW } from "../styles";
import AuthBtn from "./AuthBtn";

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
  & button.signin {
    background-image: linear-gradient(90deg, #2976ba, #3dc4ed);
  }
  & button.signin:hover {
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
const Landing = (props: Props) => {
  const dispatch = useDispatch();

  const accountsUpdateWithoutPwd = () => {
    const index = localStorage.getItem("index");
    dispatch(updateSelectedIndex(index ? Number(index) : -1));
    const selected = localStorage.getItem("selected");
    dispatch(updateSelected(selected || ""));
    const dfinitySubAccounts = getInitDfinitySubAccounts();
    dispatch(updateDfinitySubAccounts(dfinitySubAccounts));
  };

  useEffect(() => {
    accountsUpdateWithoutPwd();
  }, []);

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
          <AuthBtn />
          <button
            className="signin"
            onClick={() =>
              props.history.push(
                !localStorage.getItem("selected") ||
                  !localStorage.getItem("Wallets")
                  ? "/createkeypair"
                  : "/signin"
              )
            }
          >
            Local HDWallet
          </button>
        </Btns>
        <Txt>
          No account yet?{" "}
          <button
            className="create"
            onClick={() => props.history.push("/createkeypair")}
          >
            Create Wallet
          </button>
        </Txt>
      </Wrap>
    </Div>
  );
};

export default withRouter(Landing);
