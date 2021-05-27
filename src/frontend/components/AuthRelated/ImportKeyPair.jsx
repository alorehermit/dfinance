import React, { useEffect, useState } from "react";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router";
import { addNewAccount } from "../../redux/features/accounts";
import { getUint8ArrayFromHex } from "../../utils/common";
import AuthBtn from "./AuthBtn.jsx";
import "./ImportKeyPair.css";

const ImportKeyPair = (props) => {
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setPrincipal("");
    setPublicKey("");
  }, [privateKey]);

  const importWallet = () => {
    const secretKey = getUint8ArrayFromHex(privateKey);
    const keyIdentity = Ed25519KeyIdentity.fromSecretKey(secretKey);
    const val = keyIdentity.getPrincipal().toString(); // principal
    const str = keyIdentity.toJSON()[0]; // public key hex string
    setPrincipal(val);
    setPublicKey(str);
  };
  const confirm = () => {
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

  return (
    <div className="ImportKeyPair">
      <div className="toggle">
        <AuthBtn />
        <button onClick={() => props.history.push("/createkeypair")}>
          Create One
        </button>
      </div>
      <h1>Import Idenity from Private Key</h1>
      <input
        type="text"
        placeholder="Private Key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
      />
      {principal ? <div className="text">Principal: {principal}</div> : null}
      {publicKey ? <div className="text">Public Key: {publicKey}</div> : null}
      <div className="btns">
        <button onClick={importWallet} disabled={principal}>
          Import
        </button>
        <button onClick={confirm} disabled={!principal}>
          Next
        </button>
      </div>
    </div>
  );
};

export default withRouter(ImportKeyPair);
