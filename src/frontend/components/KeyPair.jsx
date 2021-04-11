import React, { useState } from "react";
import { Ed25519KeyIdentity } from "@dfinity/authentication";
import { getUint8ArrayFromHex } from "../utils/common";
import "./KeyPair.css";
import classNames from "classnames";
import { withRouter } from "react-router";

const KeyPair = props => {

  const [showForm, setShowForm] = useState(false);
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [wallet, setWallet] = useState(null);

  const importWallet = () => {
    const secretKey = getUint8ArrayFromHex(privateKey);
    const keyIdentity = Ed25519KeyIdentity.fromSecretKey(secretKey);
    const val = keyIdentity.getPrincipal().toString();  // principal
    const str = keyIdentity.toJSON()[0];  // public key hex string
    localStorage.setItem("dfinance_current_user", val);
    localStorage.setItem("dfinance_current_user_key", JSON.stringify([str, privateKey]));
    setPrincipal(val);
    setWallet({ publicKey: str, privateKey });
    setShowForm(false);
    setPublicKey("");
    setPrivateKey("");
    props.changeUser(true);
  };
  const createWallet = () => {
		const createRandomSeed = () => crypto.getRandomValues(new Uint8Array(32));
    const keyIdentity = Ed25519KeyIdentity.generate(createRandomSeed());
    localStorage.setItem("dfinance_current_user", keyIdentity.getPrincipal().toString());
    localStorage.setItem("dfinance_current_user_key", JSON.stringify(keyIdentity.toJSON()));
    setPrincipal(keyIdentity.getPrincipal().toString());
    setWallet({ 
      publicKey: keyIdentity.toJSON()[0], 
      privateKey: keyIdentity.toJSON()[1] 
    });
    props.changeUser(true);
  };

  return (
    <div className="KeyPair">
      <div className={classNames("wrap", {upper: showForm || wallet})}>
        <button onClick={() => setShowForm(true)}>Import wallet</button>
        <button onClick={createWallet}>Create wallet</button>
      </div>
      {showForm ? 
        <Form
          publicKey={publicKey}
          publicKeyonChange={e => setPublicKey(e.target.value)}
          privateKey={privateKey}
          privateKeyonChange={e => setPrivateKey(e.target.value)}
          submit={importWallet}
          cancel={() => {
            setShowForm(false);
            setPublicKey("");
            setPrivateKey("");
          }}
        />
      : null}
      {wallet ? 
        <div className="wallet">
          <p className="label">Wallet :</p>
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
      : null}
    </div>
  )
};

export default withRouter(KeyPair);

const Form = props => {
  return (
    <div className="import-form">
      <input type="text" placeholder="Private Key" value={props.privateKey} onChange={props.privateKeyonChange} />
      <button onClick={props.submit}>Import</button>
      <button onClick={props.cancel}>Cancel</button>
    </div>
  )
}
