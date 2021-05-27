import React, { useState } from "react";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { getUint8ArrayFromHex } from "../utils/common";
import classNames from "classnames";
import { withRouter } from "react-router";
import { useDispatch } from "react-redux";
import { updateIdentity } from "../redux/features/identity";
import "./KeyPair.css";

const KeyPair = (props) => {
  const [showForm, setShowForm] = useState(false);
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [wallet, setWallet] = useState(null);
  const dispatch = useDispatch();

  const importWallet = () => {
    const secretKey = getUint8ArrayFromHex(privateKey);
    const keyIdentity = Ed25519KeyIdentity.fromSecretKey(secretKey);
    const val = keyIdentity.getPrincipal().toString(); // principal
    const str = keyIdentity.toJSON()[0]; // public key hex string
    localStorage.setItem("dfinance_current_user", val);
    localStorage.setItem("selected", JSON.stringify([str, privateKey]));
    setPrincipal(val);
    setWallet({ publicKey: str, privateKey });
    setShowForm(false);
    setPublicKey("");
    setPrivateKey("");
    dispatch(updateIdentity(keyIdentity));
  };
  const createWallet = () => {
    const createRandomSeed = () => crypto.getRandomValues(new Uint8Array(32));
    const keyIdentity = Ed25519KeyIdentity.generate(createRandomSeed());
    localStorage.setItem(
      "dfinance_current_user",
      keyIdentity.getPrincipal().toString()
    );
    localStorage.setItem("selected", JSON.stringify(keyIdentity.toJSON()));
    setPrincipal(keyIdentity.getPrincipal().toString());
    setWallet({
      publicKey: keyIdentity.toJSON()[0],
      privateKey: keyIdentity.toJSON()[1],
    });
    dispatch(updateIdentity(keyIdentity));
  };

  return (
    <div className="KeyPair">
      <div className={classNames("wrap", { upper: showForm || wallet })}>
        <button onClick={() => setShowForm(true)}>Import wallet</button>
        <button onClick={createWallet}>Create wallet</button>
      </div>
      {showForm ? (
        <Form
          publicKey={publicKey}
          publicKeyonChange={(e) => setPublicKey(e.target.value)}
          privateKey={privateKey}
          privateKeyonChange={(e) => setPrivateKey(e.target.value)}
          submit={importWallet}
          cancel={() => {
            setShowForm(false);
            setPublicKey("");
            setPrivateKey("");
          }}
        />
      ) : null}
      {wallet ? (
        <div className="wallet">
          <p>
            <label>Principal :</label>
            <span>{principal}</span>
          </p>
          <p>
            <label>Public Key :</label>
            <span>{wallet.publicKey}</span>
          </p>
          <p>
            <label>Private Key :</label>
            <span>{wallet.privateKey}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(KeyPair);

const Form = (props) => {
  return (
    <div className="import-form">
      <input
        type="text"
        placeholder="Private Key"
        value={props.privateKey}
        onChange={props.privateKeyonChange}
      />
      <button onClick={props.submit}>Import</button>
      <button onClick={props.cancel}>Cancel</button>
    </div>
  );
};
