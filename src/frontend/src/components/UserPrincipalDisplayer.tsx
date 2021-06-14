import classNames from "classnames";
import { enc, MD5 } from "crypto-js";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Icon from "../icons/Icon";
import { RootState } from "../redux/store";
import { principalToAccountIdentifier } from "../utils/common";
import "./UserPrincipalDisplayer.css";

const UserPrincipalDisplayer = () => {
  const selected = useSelector((state: RootState) => state.selected);
  const accounts = useSelector((state: RootState) => state.accounts);
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [show, setShow] = useState(false);
  const [pwd, setPwd] = useState("");
  const [matched, setMatched] = useState(-1);
  const [aid, setAid] = useState("");

  const accountIdDom = useRef<HTMLInputElement>(null);
  const principalDom = useRef<HTMLInputElement>(null);
  const publicDom = useRef<HTMLInputElement>(null);
  const privateDom = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (principal) {
      setAid(principalToAccountIdentifier(principal, 0));
    } else {
      setAid("");
    }
  }, [principal]);

  useEffect(() => {
    const theOne = accounts.find((i) => i.publicKey === selected);
    if (selected && theOne) {
      setPrincipal(theOne.principal);
      setPublicKey(theOne.keys[0]);
      setPrivateKey(theOne.keys[1]);
    } else {
      setPrincipal("");
      setPublicKey("");
      setPrivateKey("");
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
      <div className="group">
        <span className="label">
          {aid.substr(0, 5)}...
          {aid.substr(length - 5, 5)}
        </span>
        <CopyBtn onCopy={principalOnCopy} />
        <button onClick={() => setShow(true)}>
          <Icon name="export" />
        </button>
      </div>
      {show ? (
        <div className={classNames("ExportWalletModal", { ac: show })}>
          <div className="bg"></div>
          <div className="wrap">
            <button className="close" onClick={() => setShow(false)}>
              <Icon name="close" />
            </button>
            <input
              ref={accountIdDom}
              value={principalToAccountIdentifier(principal, 0)}
              readOnly
            />
            <input ref={publicDom} value={publicKey} readOnly />
            <input ref={privateDom} value={privateKey} readOnly />
            <label className="label">Wallet</label>
            <label className="sub-label">Account Id :</label>
            <div className="input-group">
              <span>{principalToAccountIdentifier(principal, 0)}</span>
              <CopyBtn onCopy={accountIdOnCopy} />
            </div>
            <label className="sub-label">Principal :</label>
            <div className="input-group">
              <span>{principal}</span>
              <CopyBtn onCopy={principalOnCopy} />
            </div>
            <label className="sub-label">Public Key :</label>
            <div className="input-group">
              <span>{publicKey}</span>
              <CopyBtn onCopy={publicKeyOnCopy} />
            </div>
            <label className="sub-label">Private Key :</label>
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
            {matched === 0 ? <div className="error">wrong password</div> : null}
            {matched === 1 ? (
              <div className="input-group">
                <span>{privateKey}</span>
                <CopyBtn onCopy={privateKeyOnCopy} />
              </div>
            ) : null}
          </div>
        </div>
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
    <button onClick={onClick}>
      {clicked ? <Icon name="check-alt" /> : <Icon name="copy" />}
    </button>
  );
};
