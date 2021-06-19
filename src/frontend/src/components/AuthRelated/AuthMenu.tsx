import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { RootState } from "../../redux/store";
import { updateSelected } from "../../redux/features/selected";
import AuthBtn from "./AuthBtn";
import Icon from "../../icons/Icon";
import styled from "styled-components";
import { device, getVW } from "../styles";
import { getSelectedAccount } from "../../utils/identity";
import { JsonnableEd25519KeyIdentity } from "@dfinity/identity/lib/cjs/identity/ed25519";
import { DfinitySubAccount, Ed25519Account } from "../../global";
import { updateSelectedIndex } from "../../redux/features/selectedIndex";

const Menu = styled.div`
  display: inline-block;
`;
const Select = styled.div`
  position: relative;
  z-index: 100;
  border-radius: ${getVW(10)};
  @media ${device.tablet} {
    border-radius: 1vw;
  }
`;
const Label = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${getVW(247)};
  height: ${getVW(44)};
  min-width: 200px;
  min-height: 32px;
  border: none;
  border-radius: ${getVW(10)};
  background-color: #e5e5e5;
  color: #838383;
  font-size: ${getVW(20)};
  padding: 0 ${getVW(20)};
  box-shadow: 0 ${getVW(3)} ${getVW(10)} rgba(0, 0, 0, 0.2);
  &:hover {
    box-shadow: 0 ${getVW(3)} ${getVW(12)} rgba(0, 0, 0, 0.3);
  }
  & svg {
    width: ${getVW(20)};
    height: ${getVW(12)};
    color: #838383;
  }
  &.show svg {
    transform: rotate(90deg);
  }
  @media ${device.tablet} {
    width: 25vw;
    height: 4.5vw;
    border-radius: 1vw;
    font-size: 1.8vw;
    padding: 0 2vw;
    & svg {
      width: 1.8vw;
      height: 1.5vw;
    }
  }
`;
const Options = styled.div`
  position: absolute;
  display: none;
  width: 100%;
  left: 0;
  top: ${getVW(22)};
  background-color: #f8f8f8;
  box-shadow: 0 ${getVW(3)} ${getVW(12)} rgba(0, 0, 0, 0.3);
  padding-top: ${getVW(30)};
  padding-bottom: ${getVW(50)};
  z-index: -10;
  &.show {
    display: block;
  }
  & button {
    width: 100%;
    height: ${getVW(44)};
    min-height: 32px;
    border: none;
    background-color: transparent;
    padding: 0 ${getVW(20)};
    font-size: ${getVW(16)};
    color: #838383;
    text-align: left;
    justify-content: flex-start;
  }
  & button.ac {
    color: #36a9db;
  }
  & button:hover {
    background-color: #36a9db14;
  }
  & button:last-child {
    position: absolute;
    width: 100%;
    height: ${getVW(59)};
    left: 0;
    bottom: ${getVW(-20)};
    border-radius: ${getVW(10)};
    background-image: linear-gradient(90deg, #3dc4ed, #2976ba);
    text-align: center;
    color: #fff;
  }
  & button:last-child:hover {
    background-image: linear-gradient(120deg, #3dc4ed, #2976ba);
  }
  @media ${device.tablet} {
    top: 50%;
    padding-top: 10%;
    padding-bottom: 21%;
    & button {
      height: 3.2vw;
      font-size: 1.8vw;
      padding: 0 2vw;
    }
    & button:last-child {
      bottom: -20%;
      min-height: 40px;
      border-radius: 7px;
    }
  }
`;

interface Props extends RouteComponentProps {}
const AuthMenu = (props: Props) => {
  const [show, setShow] = useState(false);
  const [theOne, setTheOne] =
    useState<{
      type: string;
      name: string;
      principal: string;
      aid: string;
      index: number;
      keys?: JsonnableEd25519KeyIdentity;
      isImported?: boolean;
    } | null>(null);
  const {
    selected,
    selectedIndex,
    dfinityIdentity,
    hdWallets,
    dfinitySubAccounts,
    importedAccounts,
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dom.current && !dom.current.contains(e.target as HTMLElement)) {
        setShow(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const val = getSelectedAccount();
    setTheOne(val ? val : null);
  }, [selected, selectedIndex, dfinityIdentity, hdWallets, importedAccounts]);

  const switchToDfinitySubAccount = (val: DfinitySubAccount) => {
    const keys: JsonnableEd25519KeyIdentity = JSON.parse(
      localStorage.getItem("ic-identity") || "[]"
    );
    dispatch(updateSelected(keys[0]));
    dispatch(updateSelectedIndex(val.index));
    setShow(false);
  };
  const switchToHdWallet = (val: Ed25519Account) => {
    dispatch(updateSelected(val.publicKey));
    dispatch(updateSelectedIndex(val.index));
    setShow(false);
  };
  const switchToImportedAccount = (val: Ed25519Account) => {
    dispatch(updateSelected(val.publicKey));
    dispatch(updateSelectedIndex(-1));
    setShow(false);
  };

  return (
    <Menu ref={dom} className="AuthMenu">
      {theOne ? (
        <Select className="selector">
          <Label
            className={classNames("label", { show })}
            onClick={() => setShow(!show)}
          >
            {theOne.isImported
              ? `${theOne.aid.substr(0, 5)}...${theOne.aid.substr(
                  length - 5,
                  5
                )}`
              : theOne.name}{" "}
            <Icon name="dart" />
          </Label>
          <Options className={classNames("options", { show })}>
            {dfinitySubAccounts.map((i, index) => (
              <Item
                key={index}
                matched={selectedIndex === index}
                name={i.name}
                aid={i.aid}
                type={i.type}
                onClick={() => switchToDfinitySubAccount(i)}
              />
            ))}
            {hdWallets.map((i, index) => (
              <Item
                key={index}
                matched={selected === i.publicKey}
                name={i.name}
                aid={i.aid}
                type={i.type}
                onClick={() => switchToHdWallet(i)}
              />
            ))}
            {importedAccounts.map((i, index) => (
              <Item
                key={index}
                matched={selected === i.publicKey}
                name={i.name}
                aid={i.aid}
                type={i.type}
                onClick={() => switchToImportedAccount(i)}
              />
            ))}
            <button
              onClick={() => {
                props.history.push("/createaccount");
                setShow(false);
              }}
            >
              Create New Account
            </button>
          </Options>
        </Select>
      ) : (
        <Select className="selector">
          <Label
            className={classNames("label", { show })}
            onClick={() => setShow(!show)}
          >
            Login <Icon name="dart" />
          </Label>
          <Options className={classNames("options", { show })}>
            <AuthBtn />
            <button
              onClick={() => {
                props.history.push("/");
                setShow(false);
              }}
            >
              Create wallet
            </button>
          </Options>
        </Select>
      )}
    </Menu>
  );
};

export default withRouter(AuthMenu);

interface ItemProps {
  matched: boolean;
  name: string;
  aid: string;
  type: string;
  onClick: () => void;
}
const Item = (props: ItemProps) => {
  return (
    <button
      className={classNames({
        ac: props.matched,
      })}
      onClick={props.onClick}
    >
      {props.type === "Imported"
        ? `${props.aid.substr(0, 5)}...${props.aid.substr(
            length - 5,
            5
          )} Imported`
        : props.name}
    </button>
  );
};
