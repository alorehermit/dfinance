import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Icon from "../icons/Icon";
import { RootState } from "../redux/store";
import "./UserPrincipalDisplayer.css";

const UserPrincipalDisplayer = () => {
  const selected = useSelector((state: RootState) => state.selected);
  const accounts = useSelector((state: RootState) => state.accounts);
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [show, setShow] = useState(false);
  const principalDom = useRef<HTMLInputElement>(null);
  const publicDom = useRef<HTMLInputElement>(null);
  const privateDom = useRef<HTMLInputElement>(null);

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
          {principal.substr(0, 5)}...
          {principal.substr(58, 5)}
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
            <input ref={publicDom} value={publicKey} readOnly />
            <input ref={privateDom} value={privateKey} readOnly />
            <label className="label">Wallet</label>
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
            <div className="input-group">
              <span>{privateKey}</span>
              <CopyBtn onCopy={privateKeyOnCopy} />
            </div>
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
