import { useEffect, useState } from "react";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { addNewAccount } from "../../redux/features/accounts";
import {
  getUint8ArrayFromHex,
  principalToAccountIdentifier,
} from "../../utils/common";
import AuthBtn from "./AuthBtn";
import "./ImportKeyPair.css";
import { RootState } from "../../redux/store";
import PwdForm from "./PwdForm";

interface Props extends RouteComponentProps {}
const ImportKeyPair = (props: Props) => {
  const [type, setType] = useState("1");
  const [mnemonic, setMnemonic] = useState("");
  const [principal, setPrincipal] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const dispatch = useDispatch();
  const password = useSelector((state: RootState) => state.password);

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
  const importMnemonicWallet = () => {
    const bip39 = require("bip39");
    let seed = bip39.mnemonicToSeedSync(mnemonic);
    seed = Array.from(seed);
    seed = seed.splice(0, 32);
    seed = new Uint8Array(seed);
    const keyIdentity = Ed25519KeyIdentity.generate(seed);
    const val = keyIdentity.getPrincipal().toString(); // principal
    const [str1, str2] = keyIdentity.toJSON(); // public key and private key hex string
    setPrivateKey(str2);
    setTimeout(() => {
      setPublicKey(str1);
      setPrincipal(val);
    }, 200);
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

  if (password) {
    return (
      <div className="ImportKeyPair">
        <div className="toggle">
          <AuthBtn />
          <button onClick={() => props.history.push("/createkeypair")}>
            Create One
          </button>
        </div>
        <h1>Import Idenity from {type === "1" ? "Private Key" : "Mnemonic"}</h1>
        <label>Type :</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setMnemonic("");
            setPrivateKey("");
            setPublicKey("");
            setPrincipal("");
          }}
        >
          <option value="1">Private Key</option>
          <option value="2">Mnemonic</option>
        </select>
        {type === "1" ? (
          <div>
            <label>Private Key :</label>
            <textarea
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
            {principal ? (
              <div className="text">
                Account Id: {principalToAccountIdentifier(principal, 0)}
              </div>
            ) : null}
            {publicKey ? (
              <div className="text">Public Key: {publicKey}</div>
            ) : null}
            <div className="btns">
              <button
                onClick={importWallet}
                disabled={principal ? true : false}
              >
                Import
              </button>
              <button onClick={confirm} disabled={!principal}>
                Next
              </button>
            </div>
          </div>
        ) : null}
        {type === "2" ? (
          <div>
            <label>Mnemonic :</label>
            <textarea
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
            />
            {principal ? (
              <div className="text">
                Account Id: {principalToAccountIdentifier(principal, 0)}
              </div>
            ) : null}
            {publicKey ? (
              <div className="text">Public Key: {publicKey}</div>
            ) : null}
            <div className="btns">
              <button
                onClick={importMnemonicWallet}
                disabled={principal ? true : false}
              >
                Import
              </button>
              <button onClick={confirm} disabled={!principal}>
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className="ImportKeyPair">
        <div className="toggle">
          <AuthBtn />
          <button onClick={() => props.history.push("/createkeypair")}>
            Create One
          </button>
        </div>
        <h1>Import Idenity from Private Key</h1>
        <PwdForm next={() => {}} />
      </div>
    );
  }
};

export default withRouter(ImportKeyPair);
