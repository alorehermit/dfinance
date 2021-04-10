import React, { useState } from "react";
import { Ed25519KeyIdentity } from "@dfinity/authentication";

const KeyPair = () => {

  const [showForm, setShowForm] = useState(false);
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [wallet, setWallet] = useState(null);

  const importWallet = () => {
    const keyIdentity = Ed25519KeyIdentity.fromParsedJson([publicKey, privateKey]);
    const val = keyIdentity.getPrincipal().toString()
    localStorage.setItem("dfinance_current_user", val);
    localStorage.setItem("dfinance_current_user_key", JSON.stringify([publicKey, privateKey]));
    setPrincipal(val);
    setWallet({ publicKey, privateKey });
    setShowForm(false);
    setPublicKey("");
    setPrivateKey("");
  };
  const createWallet = () => {
		const createRandomSeed = () => crypto.getRandomValues(new Uint8Array(32));
    const keyIdentity = Ed25519KeyIdentity.generate(createRandomSeed());
    setTest(keyIdentity._publicKey.rawKey)
    localStorage.setItem("dfinance_current_user", keyIdentity.getPrincipal().toString());
    localStorage.setItem("dfinance_current_user_key", JSON.stringify(keyIdentity.toJSON()));
    setPrincipal(keyIdentity.getPrincipal().toString());
    setWallet({ 
      publicKey: keyIdentity.toJSON()[0], 
      privateKey: keyIdentity.toJSON()[1] 
    });
  };

  return (
    <div className="KeyPair">
      <div className="wrap">
        <button onClick={() => setShowForm(true)}>import wallet</button>
      </div>
      <div className="wrap">
        <button onClick={createWallet}>create wallet</button>
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
        <div>
          <p>Wallet :</p>
          <p>Principal : {principal}</p>
          <p>Public Key : {wallet.publicKey}</p>
          <p>Private Key : {wallet.privateKey}</p>
        </div>
      : null}
    </div>
  )
};

export default KeyPair;

const Form = props => {
  return (
    <div className="import-from">
      <input type="text" placeholder="Public Key" value={props.publicKey} onChange={props.publicKeyonChange} />
      <input type="text" placeholder="Private Key" value={props.privateKey} onChange={props.privateKeyonChange} />
      <button onClick={props.submit}>Import</button>
      <button onClick={props.cancel}>Cancel</button>
    </div>
  )
}
