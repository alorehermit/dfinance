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
        <h1>Import Idenity from Private Key</h1>
        <input
          type="text"
          placeholder="Private Key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
        {principal ? (
          <div className="text">
            Account Id: {principalToAccountIdentifier(principal, 0)}
          </div>
        ) : null}
        {publicKey ? <div className="text">Public Key: {publicKey}</div> : null}
        <div className="btns">
          <button onClick={importWallet} disabled={principal ? true : false}>
            Import
          </button>
          <button onClick={confirm} disabled={!principal}>
            Next
          </button>
        </div>
      </div>
    );
  } else {
    return <PwdForm next={() => {}} />;
  }
};

export default withRouter(ImportKeyPair);
