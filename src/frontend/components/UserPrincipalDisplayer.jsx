import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Icon from "../stuff/Icon.jsx";
import "./UserPrincipalDisplayer.css";

const UserPrincipalDisplayer = () => {
  const selected = useSelector((state) => state.selected);
  const [principal, setPrincipal] = useState(
    selected && selected.principal ? selected.principal : ""
  );
  const [publicKey, setPublicKey] = useState(
    selected && selected.keys ? selected.keys[0] : ""
  );
  const [privateKey, setPrivateKey] = useState(
    selected && selected.keys ? selected.keys[1] : ""
  );
  const [show, setShow] = useState(false);
  const principalDom = useRef();
  const publicDom = useRef();
  const privateDom = useRef();

  useEffect(() => {
    setPrincipal(selected && selected.principal ? selected.principal : "");
    setPublicKey(selected && selected.keys ? selected.keys[0] : "");
    setPrivateKey(selected && selected.keys ? selected.keys[1] : "");
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

const CopyBtn = (props) => {
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
