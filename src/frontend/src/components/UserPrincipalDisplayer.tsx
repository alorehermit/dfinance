import { enc, MD5 } from "crypto-js";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Icon from "../icons/Icon";
import { RootState } from "../redux/store";
import { principalToAccountIdentifier } from "../utils/common";
import { getSelectedAccount } from "../utils/func";
import { device, getVW } from "./styles";
import "./UserPrincipalDisplayer.css";

const Btns = styled.div`
  & button {
    width: ${getVW(20)};
    height: ${getVW(24)};
    margin-left: ${getVW(20)};
  }
  & button:last-child {
    width: ${getVW(29)};
  }
  @media ${device.tablet} {
    & button {
      min-width: 18px;
      min-height: 16px;
    }
  }
`;
const Wrap = styled.div`
  position: absolute;
  width: ${getVW(614)};
  min-width: 600px;
  top: 140%;
  right: 100%;
  border-radius: ${getVW(20)};
  padding: ${getVW(34)} ${getVW(80)} ${getVW(60)} ${getVW(80)};
  background-color: #fff;
  box-shadow: 0 ${getVW(3)} ${getVW(20)} rgba(0, 0, 0, 0.16);
  overflow-y: auto;
  z-index: 100;
  &::-webkit-scrollbar {
    width: 0;
  }
  @media ${device.tablet} {
    position: fixed;
    width: 90vw;
    min-width: revert;
    height: auto;
    top: 11.5vw;
    right: 5vw;
    border-radius: 1.5vw;
    padding: 3vw 3.5vw;
    z-index: 100;
  }
`;
const Close = styled.button`
  position: absolute;
  width: ${getVW(25)};
  height: ${getVW(25)};
  top: ${getVW(30)};
  right: ${getVW(30)};
  background-color: transparent;
  border: none;
  padding: 0;
  opacity: 0.3;
  transition: opacity 120ms ease;
  &:hover {
    opacity: 0.6;
  }
  @media ${device.tablet} {
    width: 3.2vw;
    height: 3.2vw;
    top: 2vw;
    right: 2vw;
  }
`;
const Label = styled.label`
  display: block;
  font-size: ${getVW(36)};
  padding-bottom: ${getVW(30)};
  color: #242424;
  margin-left: ${getVW(-36)};
`;
const SubLabel = styled.div`
  font-family: "Roboto bold";
  font-size: ${getVW(24)};
  padding-bottom: ${getVW(10)};
  color: #707070;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${getVW(10)};
  & span {
    line-height: 160%;
  }
  & button {
    width: ${getVW(30)};
    height: ${getVW(32)};
    margin-left: ${getVW(45)};
    min-width: 18px;
    min-height: 20px;
  }
`;

const UserPrincipalDisplayer = () => {
  const selected = useSelector((state: RootState) => state.selected);
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [show, setShow] = useState(false);
  const [isDfinityIdentity, setIsDfinityIdentity] = useState(true);
  const [pwd, setPwd] = useState("");
  const [matched, setMatched] = useState(-1);

  const accountIdDom = useRef<HTMLInputElement>(null);
  const principalDom = useRef<HTMLInputElement>(null);
  const publicDom = useRef<HTMLInputElement>(null);
  const privateDom = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const theOne = getSelectedAccount();
    if (theOne) {
      setPrincipal(theOne.principal);
      setPublicKey(theOne.keys[0]);
      setPrivateKey(theOne.keys[1]);
      setIsDfinityIdentity(theOne.type === "DelegationIdentity");
    } else {
      setPrincipal("");
      setPublicKey("");
      setPrivateKey("");
      setIsDfinityIdentity(true);
    }
  }, [selected]);

  const accountIdOnCopy = () => {
    if (accountIdDom.current) {
      accountIdDom.current.select();
      accountIdDom.current.setSelectionRange(0, 99999);
      document.execCommand("copy");
      accountIdDom.current.blur();
    }
  };
  const principalOnCopy = () => {
    if (principalDom.current) {
      principalDom.current.select();
      principalDom.current.setSelectionRange(0, 99999);
      document.execCommand("copy");
      principalDom.current.blur();
    }
  };
  const publicKeyOnCopy = () => {
    if (publicDom.current) {
      publicDom.current.select();
      publicDom.current.setSelectionRange(0, 99999);
      document.execCommand("copy");
      publicDom.current.blur();
    }
  };
  const privateKeyOnCopy = () => {
    if (privateDom.current) {
      privateDom.current.select();
      privateDom.current.setSelectionRange(0, 99999);
      document.execCommand("copy");
      privateDom.current.blur();
    }
  };

  return (
    <div className="UserPrincipalDisplayer">
      <input ref={principalDom} value={principal} readOnly />
      {publicKey ? (
        <Btns className="group">
          <CopyBtn onCopy={principalOnCopy} />
          <button onClick={() => setShow(true)} title="Export">
            <Icon name="export" />
          </button>
        </Btns>
      ) : null}
      {show ? (
        <Wrap className="wrap">
          <Close
            className="close"
            onClick={() => {
              setShow(false);
              setMatched(-1);
              setPwd("");
            }}
          >
            <Icon name="close" />
          </Close>
          <input
            ref={accountIdDom}
            value={principalToAccountIdentifier(principal, 0)}
            readOnly
          />
          <input ref={publicDom} value={publicKey} readOnly />
          <input ref={privateDom} value={privateKey} readOnly />
          <Label className="label">Wallet</Label>
          <SubLabel className="sub-label">Account Id :</SubLabel>
          <Item className="input-group">
            <span>{principalToAccountIdentifier(principal, 0)}</span>
            <CopyBtn onCopy={accountIdOnCopy} />
          </Item>
          <SubLabel className="sub-label">Principal :</SubLabel>
          <Item className="input-group">
            <span>{principal}</span>
            <CopyBtn onCopy={principalOnCopy} />
          </Item>
          <SubLabel className="sub-label">Public Key :</SubLabel>
          <Item className="input-group">
            <span>{publicKey}</span>
            <CopyBtn onCopy={publicKeyOnCopy} />
          </Item>
          {isDfinityIdentity ? null : (
            <>
              <SubLabel className="sub-label">Private Key :</SubLabel>
              {matched !== 1 ? (
                <div className="pwd">
                  <input
                    type="password"
                    placeholder="Password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      if (
                        MD5(enc.Utf8.parse(pwd)).toString() ===
                        localStorage.getItem("password")
                      ) {
                        setMatched(1);
                      } else {
                        setMatched(0);
                      }
                    }}
                  >
                    NEXT
                  </button>
                </div>
              ) : null}
              {matched === 0 ? (
                <div className="error" style={{ color: "tomato" }}>
                  wrong password
                </div>
              ) : null}
              {matched === 1 ? (
                <Item className="input-group">
                  <span>{privateKey}</span>
                  <CopyBtn onCopy={privateKeyOnCopy} />
                </Item>
              ) : null}
            </>
          )}
        </Wrap>
      ) : null}
    </div>
  );
};

export default UserPrincipalDisplayer;

interface Props {
  onCopy: () => void;
}
const CopyBtn = (props: Props) => {
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
    <button onClick={onClick} title="Copy">
      {clicked ? <Icon name="check-alt" /> : <Icon name="copy" />}
    </button>
  );
};
